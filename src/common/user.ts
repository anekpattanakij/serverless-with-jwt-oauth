import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { Config } from '../config/index';
import { BaseCustomClass } from './baseCustomClass';

const RANDOM_LENGTH: number = 20;

export class User extends BaseCustomClass {

  public cif: number;
  public displayName: string;
  public email: string;
  public password: string;
  public usertype: number;
  public refreshToken: string;
  public accessToken: string;
  public lastLoginDate: Date;
  public registerDate: Date;

  constructor(
    cif: number,
    displayName: string,
    email: string,
    password: string,
    usertype: number,
    refreshToken: string,
    accessToken: string,
    lastLoginDate: Date,
    registerDate: Date,
  ) {
    super();
    this.cif = cif;
    this.displayName = displayName;
    this.email = email;
    this.password = password;
    this.usertype = usertype;
    this.refreshToken = refreshToken;
    this.accessToken = accessToken;
    this.lastLoginDate = lastLoginDate;
    this.registerDate = registerDate;
  }
  
  // override encode because it has data object
  public encode() {
    return Object.assign({}, this, {
      lastLoginDate: this.lastLoginDate.toString(),
      registerDate: this.registerDate.toString(),
    });
  }

  public stampTime(): void {
    this.lastLoginDate = new Date();
    if (!this.registerDate) {
      this.registerDate = this.lastLoginDate;
    }
  }

  public stampNewRefreshToken(): void {
    this.refreshToken = crypto.randomBytes(RANDOM_LENGTH).toString('base64');
  }

  public generateAccessToken(): string {
    const token: string = jwt.sign(
      {
        cif: this.cif,
        displayName: this.displayName,
        email: this.email,
        usertype: this.usertype,
      },
      Config.SIGN_TOKEN,
      { expiresIn: Config.ACCESS_TOKEN_TIMEOUT_SECOND },
    );
    this.accessToken = token;
    return token;
  }

  public toPlainObject() {
    const tempPassword = this.password;
    this.password = '';
    const returnObject =  Object.assign({}, this);
    this.password = tempPassword;
    return returnObject;
    
  }
}
