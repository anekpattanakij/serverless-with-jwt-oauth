import jwk from 'jsonwebtoken';
import { Config } from './config/index';

const SUBSTRING_TOKEN_BEARER_POSITION = 7;

const buildIAMPolicy = (userId, effect, resource, context) => {
  const policy = {
    principalId: userId,
    policyDocument: {
      Version: '2017-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
    context,
  };

  return policy;
};

export const authorize = async (event, context, callback) => {
  console.log(event);
  console.log('Auth function invoked');
  // check Authorization in header
  if (event.authorizationToken) {
    // Remove 'bearer ' from token:
    const token = event.authorizationToken.substring(
      SUBSTRING_TOKEN_BEARER_POSITION,
    );
    // verify token first
    jwk.verify(token, Config.SIGN_TOKEN, async (err, decoded) => {
      if (err) {
        console.log('Unauthorized user:', err.message);
        callback('Unauthorized');
      } else {
        // TODO validate token
        const resultInStore=false;
        if (resultInStore) {
          const policyDocument = buildIAMPolicy(
            'userId',
            'Allow',
            event.methodArn,
            'userId',
          );
          callback(null, policyDocument);
        } else {
          callback('session expire');
        }
      }
    });
  } else {
    console.log('No authorizationToken found in the header.');
    callback('Unauthorized');
  }
};
