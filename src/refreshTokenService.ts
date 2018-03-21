import * as jwt from 'jsonwebtoken';
import * as validator from 'validator';
import {
  Error,
  ERROR_CODE_INVALID_INPUT,
  ERROR_CODE_INVALID_REFRESH_TOKEN,
  ERROR_CODE_MYSQL_CONNECTION,
  ERROR_CODE_REFRESH_EXPIRE,
} from './common/error';
import {
  HTTP_REQUEST_SUCCESS,
  ResponseRequest,
} from './common/responseRequest';
import { User } from './common/user';
import { Config } from './config/index';
import { UserUtil } from './dataLayer/userUtil';
import { errorToHttpStatusCode } from './util/errorResponseUtil';

export const refresh = async (event, context, callback) => {
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
      !inputObject.refreshToken ||
      validator.isEmpty(inputObject.refreshToken)
    ) {
      throw new Error(ERROR_CODE_INVALID_INPUT, 'Invalid input');
    }
    // Get Refresh to token from db storage
    const currentUser = await UserUtil.getUser(
      Config.MYSQL_CONFIGURATION,
      inputObject.email,
    ).catch(error => {
      throw new Error(ERROR_CODE_MYSQL_CONNECTION, JSON.stringify(error));
    });
    // If no user in database - return error
    if (!currentUser) {
      throw new Error(
        ERROR_CODE_INVALID_REFRESH_TOKEN,
        'REFRESH TOKEN and EMAIL does not match',
      );
    }
    // If refresh token is empty - return error
    if (validator.isEmpty(currentUser.refreshToken)) {
      throw new Error(
        ERROR_CODE_INVALID_REFRESH_TOKEN,
        'REFRESH TOKEN and EMAIL does not match',
      );
    }
    let newAccessToken: string;
    if (currentUser.refreshToken === inputObject.refreshToken) {
      const timeoutDate: Date = new Date();
      timeoutDate.setHours(
        timeoutDate.getHours() - Config.REFRESH_TIMEOUT_HOUR,
      );
      if (currentUser.lastLoginDate < timeoutDate) {
        throw new Error(ERROR_CODE_REFRESH_EXPIRE, 'REFRESH TOKEN has expired');
      }
      // check if refresh token has expire time
      newAccessToken = currentUser.generateAccessToken();
    } else {
      throw new Error(
        ERROR_CODE_INVALID_REFRESH_TOKEN,
        'REFRESH TOKEN and EMAIL does not match',
      );
    }

    // if pass all, put success response
    response.statusCode = HTTP_REQUEST_SUCCESS;
    response.body = JSON.stringify({
      accessToken: newAccessToken,
    });
  } catch (error) {
    console.log(error);
    response = errorToHttpStatusCode(error);
  }
  callback(null, response);
};

export const revoke = async (event, context, callback) => {
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
      !inputObject.refreshToken ||
      validator.isEmpty(inputObject.refreshToken)
    ) {
      throw new Error(ERROR_CODE_INVALID_INPUT, 'Invalid input');
    }
     const effectRow = await UserUtil.removeRefreshToken(
       Config.MYSQL_CONFIGURATION,
       inputObject.email,
       inputObject.refreshToken,
     ).catch(error => {
       throw new Error(ERROR_CODE_MYSQL_CONNECTION, JSON.stringify(error));
     });
     // If no user in database - return error
     if (effectRow===0) {
       throw new Error(
         ERROR_CODE_INVALID_REFRESH_TOKEN,
         'REFRESH TOKEN and EMAIL does not match',
       );
     }
     // if pass all, put success response
     response.statusCode = HTTP_REQUEST_SUCCESS;
     response.body = JSON.stringify({
       message: 'succesfully revoke ',
     });
   } catch (error) {
     console.log(error);
     response = errorToHttpStatusCode(error);
   }
   callback(null, response);
};
