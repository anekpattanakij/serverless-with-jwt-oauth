# Serverless with JWT OAuth 
Sample Oauth and JWT Authentication on serverless framework with Typescript 

## Design Concept 
Wait for put description

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

## Starting server
npm run develop

## Design Concept 
[POST] http://localhost:3000/chargeByToken

# Good Luck!!
