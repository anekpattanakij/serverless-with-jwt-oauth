import { BaseCustomClass } from './baseCustomClass';

// System Error
export const ERROR_SERVER_ERROR:string = 'ERR_SERVER_ERROR';
// Input or Token error
export const ERROR_CODE_INVALID_INPUT:string = 'ERROR_CODE_INVALID_INPUT';
export const ERROR_CODE_INVALID_TOKEN:string = 'ERROR_CODE_INVALID_TOKEN';
export const ERROR_CODE_NO_AUTHORIZE:string = 'ERROR_CODE_NO_AUTHORIZE';
export const ERROR_CODE_MYSQL_CONNECTION:string = 'ERROR_CODE_MYSQL_CONNECTION';
export const ERROR_CODE_NO_AUTHORIZE_IN_HEADER:string = 'ERROR_CODE_NO_AUTHORIZE_IN_HEADER';
export const ERROR_CODE_REFRESH_EXPIRE:string = 'ERROR_CODE_REFRESH_EXPIRE';
export const ERROR_CODE_INVALID_REFRESH_TOKEN:string = 'ERROR_CODE_INVALID_REFRESH_TOKEN';
export const ERROR_CODE_ACCESS_EXPIRE:string = 'ERROR_CODE_ACCESS_EXPIRE';
export const ERROR_CODE_INVALID_ACCESS_TOKEN:string = 'ERROR_CODE_INVALID_ACCESS_TOKEN';

// User error list
export const ERROR_CODE_USER_DUPLICATE_EMAIL:string = 'ERR_USER_DUPLICATE_EMAIL';

export class Error extends BaseCustomClass {
  public code: string;
  public message: string;

  constructor(code: string, message: string) {
    super();
    this.code = code;
    this.message = message;
  }
}
