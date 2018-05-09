# Serverless with JWT OAuth 
Sample Oauth and JWT Authentication on serverless framework with Typescript 

## Design Concept 
Boilerplate for authentication system for serverless framework.
1. User send login request through login API
2. System check username and password on mysql server.
3. If username and password are matched, System generate refresh token and access token for further secure request <token timeout can be set in configuration>, and refresh token will be kept in mysql database.
  3.1 access token will be implemented base on JWT concept that contain basic information with short expiration time.
4. Customer able to request secure service with authentication in Bearer access token in header
  4.1 System check for token that is valid or not by decrypt jwt token.
  4.2 If token is valid, system will continue working.
5. If access token has been expired, user can request new access token by using refreshToken.
6. If customer would like to log out, customer can revoke refresh token. System will clean up refresh token in mysql.

### Service list

```
[POST] http://localhost:3000/register
```
Service for register new user.

```
[POST] http://localhost:3000/login
```
Service for login, this function will return access token and refresh token.

```
[POST] http://localhost:3000/refreshToken
```
Refresh access token by using refresh token

```
[POST] http://localhost:3000/revokeToken
```
Revoke token service

```
[POST] http://localhost:3000/secure
```
Sample secure function that should be request with authorizer token, this function has controlled by authorizer parameter in configuration.
It is simple, but it will cost 2 function call request <one for authorizer and another one for request processing>

```
[POST] http://localhost:3000/secureWithFuction
```
Sample secure function that should be request with authorizer token, this function has controlled by manual checking authorizer token in header.

## Prepare running environment 
1. Create your own mysql server.
2. run create_table.sql in sqlScript folder on mysql

## Starting on-premise serverless server
serverless offline start

# Good Luck!!
