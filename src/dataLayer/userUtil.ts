import { Error } from '../common/error';
import { MysqlConfiguration } from '../common/mysqlConfig';
import { User } from '../common/user';
import { MySqlUtility } from '../util/mysqlUtil';

export class UserUtil {
  public static saveUser(
    config: MysqlConfiguration,
    inputUser: User,
  ): Promise<Error> {
    return new Promise(async (resolve, reject) => {
      const executeResult = await MySqlUtility.mysqlExecute(
        config,
        'INSERT INTO `USER_LIST`(`EMAIL`, `PASSWORD`, `DISPLAY_NAME`, `ROLE`,`REFRESH_TOKEN`,`LAST_LOGIN_DATE`,`REGISTER_DATE`) VALUES (?,?,?,?,?,?,?)',
        [
          inputUser.email,
          inputUser.password,
          inputUser.displayName,
          inputUser.usertype,
          inputUser.refreshToken,
          inputUser.lastLoginDate,
          inputUser.registerDate,
        ],
      ).catch(error => {
        reject(error);
      });
      resolve(undefined);
    });
  }

  public static getUser(
    config: MysqlConfiguration,
    email: string,
  ): Promise<User> {
    return new Promise(async (resolve, reject) => {
      const executeResult = await MySqlUtility.mysqlExecute(
        config,
        'SELECT `CIF`,`EMAIL`, `PASSWORD`, `DISPLAY_NAME`, `ROLE`,`REFRESH_TOKEN`,`LAST_LOGIN_DATE`,`REGISTER_DATE` FROM  `USER_LIST` WHERE `EMAIL` = ?',
        [email],
      ).catch(error => {
        reject(error);
        return;
      });
      if (!executeResult || executeResult.length < 1) {
        resolve(null);
      } else {
        resolve(
          new User(
            executeResult[0].CIF,
            executeResult[0].DISPLAY_NAME,
            executeResult[0].EMAIL,
            executeResult[0].PASSWORD,
            executeResult[0].ROLE,
            executeResult[0].REFRESH_TOKEN,
            null,
            executeResult[0].LAST_LOGIN_DATE,
            executeResult[0].REGISTER_DATE,
          ),
        );
      }
    });
  }

  public static updateRefreshTokenAndLastLogin(
    config: MysqlConfiguration,
    email: string,
    refreshToken: string,
    lastLoginDate: Date,
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const executeResult = await MySqlUtility.mysqlExecute(
        config,
        'UPDATE `USER_LIST` SET `REFRESH_TOKEN` = ? , `LAST_LOGIN_DATE` = ? WHERE `EMAIL` = ?',
        [refreshToken, lastLoginDate, email],
      ).catch(error => {
        reject(error);
        return;
      });
      if (executeResult.affectedRows > 0) {
        resolve(executeResult.affectedRows);
      }
      resolve(null);
    });
  }

  public static removeRefreshToken(
    config: MysqlConfiguration,
    email: string,
    refreshToken: string,
  ): Promise<number> {
    return new Promise(async (resolve, reject) => {
      const executeResult = await MySqlUtility.mysqlExecute(
        config,
        'UPDATE `USER_LIST` SET `REFRESH_TOKEN` = `` WHERE `EMAIL` = ? AND `REFRESH_TOKEN` = ?',
        [email, refreshToken],
      ).catch(error => {
        reject(error);
        return;
      });
      if (executeResult.affectedRows > 0) {
        resolve(executeResult.affectedRows);
      }
      resolve(null);
    });
  }
}
