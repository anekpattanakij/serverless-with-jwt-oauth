import { authorizeService } from './authService';
import {
  HTTP_REQUEST_SUCCESS,
  ResponseRequest,
} from './common/responseRequest';

const getBnkMembers = () => {
  return [
    {
      nickname: 'Cherprang',
      full_name: 'Cherprang Areekul',
    },
    {
      nickname: 'Jennis',
      full_name: 'Jennis Oprasert',
    },
    {
      nickname: 'Miori',
      full_name: 'Miori Ohkubo',
    },
  ];
};

export const landing = (event, context, callback): void => {
  const response: ResponseRequest = new ResponseRequest(HTTP_REQUEST_SUCCESS, '');
  const resultFromAuthorizeService = await authorizeService(event, context).catch(err => {
    response.body = JSON.stringify(err);
  });
  if(resultFromAuthorizeService) {
    response = resultFromAuthorizeService;
  }
  callback(null, response);
};
