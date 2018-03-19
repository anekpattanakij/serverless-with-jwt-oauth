import { sha3_512 } from 'js-sha3';
import * as jwt from 'jsonwebtoken';
import { thunk } from 'thunks';
import * as validator from 'validator';
import {
  Error,
  ERROR_CODE_INVALID_INPUT,
  ERROR_CODE_MYSQL_CONNECTION,
  ERROR_CODE_USER_DUPLICATE_EMAIL,
} from './common/error';
import {
  HTTP_REQUEST_SUCCESS,
  ResponseRequest,
} from './common/responseRequest';
import { User } from './common/user';
import { Config } from './config/index';
import { UserUtil } from './dataLayer/userUtil';
import { errorToHttpStatusCode } from './util/errorResponseUtil';

const JWT_SIGNATURE_POSITION: number = 2;

export const register = async (event, context, callback) => {
  // console.log('EMAIL_SERVICE_API_KEY: ', process.env.EMAIL_SERVICE_API_KEY);
  let response: ResponseRequest = new ResponseRequest(HTTP_REQUEST_SUCCESS, '');
  let inputObject: any;
  try {
    if (!event.body) {
      throw new Error(ERROR_CODE_INVALID_INPUT, 'Invalid input');
    }

    try {
      inputObject = JSON.parse(event.body);
    } catch (err) {
      throw new Error(ERROR_CODE_INVALID_INPUT, 'Error on convert json');
    }
    if (
      !inputObject.email ||
      !validator.isEmail(inputObject.email) ||
      !inputObject.password ||
      validator.isEmpty(inputObject.password) ||
      !inputObject.displayName ||
      validator.isEmpty(inputObject.displayName)
    ) {
      throw new Error(ERROR_CODE_INVALID_INPUT, 'Invalid input');
    }
    // TODO Check for input format

    const inputNewUser: User = new User(
      0,
      inputObject.displayName,
      inputObject.email,
      sha3_512(inputObject.password),
      1,
      '',
      null,
      null,
    );

    // Save user to database
    const checkExistingUser: User = await UserUtil.getUser(
      Config.MYSQL_CONFIGURATION,
      inputNewUser.email,
    ).catch(error => {
      throw new Error(ERROR_CODE_MYSQL_CONNECTION, JSON.stringify(error));
    });
    // If duplicate user return error
    if (checkExistingUser) {
      throw new Error(
        ERROR_CODE_USER_DUPLICATE_EMAIL,
        'this user already exist',
      );
    } else {
      inputNewUser.stampTime();
      inputNewUser.stampNewRefreshToken();
      await UserUtil.saveUser(Config.MYSQL_CONFIGURATION, inputNewUser).catch(
        error => {
          throw new Error(ERROR_CODE_MYSQL_CONNECTION, JSON.stringify(error));
        },
      );
    }
    // if pass all, put success response
    response.statusCode = HTTP_REQUEST_SUCCESS;
    console.log('access token:' + inputNewUser.generateAccessToken());
    response.body = JSON.stringify({
      accessToken: inputNewUser.generateAccessToken(),
      refreshToken: inputNewUser.refreshToken,
    });
  } catch (error) {
    console.log(error);
    response = errorToHttpStatusCode(error);
  }
  callback(null, response);
};
