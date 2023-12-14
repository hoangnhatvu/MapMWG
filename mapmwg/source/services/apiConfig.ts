import axios from 'axios';

export type ResponseType = 'arraybuffer' | 'document' | 'json';
export type requestApiProps = {
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  params: Object | undefined;
  body: Object;
  responseType: ResponseType | undefined;
};

export default function requestApi({
  endpoint,
  method,
  params,
  body,
  responseType,
}: requestApiProps) {
  const headers = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  };
  headers['Content-Type'] = 'application/json';
  const instance = axios.create({headers});
  const accessToken = '74ff298c-dfe2-45f5-814d-ec9283bb65c5';
  instance.interceptors.request.use(
    config => {
      if (!config.headers?.Authorization) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );

  return instance.request({
    method: method,
    url: `http://betaerp.tgdd.vn/mwg-app-service-gis-web-service/api/${endpoint}`,
    data: body,
    params: params,
    responseType: responseType,
  });
}
