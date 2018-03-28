import { sha3_512 } from 'js-sha3';
import * as validator from 'validator';
import {
  Error,
  ERROR_CODE_INVALID_INPUT,
  ERROR_CODE_MYSQL_CONNECTION,
} from './common/error';
import {
  HTTP_REQUEST_SUCCESS,
  ResponseRequest,
} from './common/responseRequest';
import { User } from './common/user';
import { Config } from './config/index';
import { UserUtil } from './dataLayer/userUtil';
import { errorToHttpStatusCode } from './util/errorResponseUtil';

export const login = async (event, context, callback) => {
  // console.log('EMAIL_SERVICE_API_KEY: ', process.env.EMAIL_SERVICE_API_KEY);
  let response: ResponseRequest = new ResponseRequest(HTTP_REQUEST_SUCCESS, '');
  try {
    if (!event.body) {
      throw new Error(ERROR_CODE_INVALID_INPUT, 'Invalid input');
    }

    const inputObject = JSON.parse(event.body);
    // TODO check email and password value first
    if (
      !inputObject.email ||
      !validator.isEmail(inputObject.email) ||
      !inputObject.password ||
      validator.isEmpty(inputObject.password)
    ) {
      throw new Error(ERROR_CODE_INVALID_INPUT, 'Invalid input');
    }
    // store token in as session
    const getUser: User = await UserUtil.getUser(
      Config.MYSQL_CONFIGURATION,
      inputObject.email,
    ).catch(error => {
      throw new Error(ERROR_CODE_MYSQL_CONNECTION, JSON.stringify(error));
    });
    if (!getUser || sha3_512(inputObject.password) !== getUser.password) {
      throw new Error('USERERR1', 'Password not match');
    }
    // Stamp last login date and refresh token
    getUser.stampTime();
    getUser.stampNewRefreshToken();
    await UserUtil.updateRefreshTokenAndLastLogin(
      Config.MYSQL_CONFIGURATION,
      getUser.email,
      getUser.refreshToken,
      getUser.lastLoginDate,
    ).catch(error => {
      throw new Error(ERROR_CODE_MYSQL_CONNECTION, JSON.stringify(error));
    });
    response.statusCode = HTTP_REQUEST_SUCCESS;
    // return user information
    getUser.generateAccessToken();
    response.body = JSON.stringify({
      user: getUser.toPlainObject(),
    });
  } catch (error) {
    console.log(error);
    response = errorToHttpStatusCode(error);
  }

  callback(null, response);
};
