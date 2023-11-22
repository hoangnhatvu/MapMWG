import axios, {AxiosRequestConfig} from 'axios';

export async function callRoutingAPI(currentLocation: [number, number], destination: [number, number]): Promise<any> {
  const url =
    'http://betaerp.tgdd.vn/mwg-app-service-gis-web-service/api/routing?profile=driving-motorcycle';
  const body = {
    coordinates: [currentLocation, destination],
    preference: 'fastest',
    continue_straight: true,
    elevation: false,
    units: 'km',
    language: 'vi-vn',
    geometry: true,
    instructions: true,
    instructions_format: 'html',
    alternative_routes: {
      target_count: 3,
      weight_factor: 1.5,
      share_factor: 0.6,
    }
  };

  const headers = {
    Authorization: 'Bearer 241f0bc0-b8ba-4088-bb8c-2a35875c3783',
    'Content-Type': 'application/json',
  };

  const config: AxiosRequestConfig = {
    method: 'post',
    url: url,
    headers: headers,
    data: body,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}

export async function searchAddressAPI(): Promise<any> {
  const url =
    'http://betaerp.tgdd.vn/mwg-app-service-gis-web-service/api/address/search';
  const body = {
    searchAddress: '640 đường 2/9',
    debug: true,
  };

  const headers = {
    Authorization: 'Bearer 241f0bc0-b8ba-4088-bb8c-2a35875c3783',
    'Content-Type': 'application/json',
  };

  const config: AxiosRequestConfig = {
    method: 'post',
    url: url,
    headers: headers,
    data: body,
  };

  try {
    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error: any) {
    console.error(error);
    throw error;
  }
}

export async function getCoordinatesAPI(
  coordinates: [number, number],
): Promise<any> {
  const [longitude, latitude] = coordinates;

  const url = `https://betaerp.tgdd.vn/mwg-app-service-gis-web-service/api/els/nearest?lat=${latitude}&lon=${longitude}`;
  const headers = {
    Authorization: 'Bearer 241f0bc0-b8ba-4088-bb8c-2a35875c3783',
    'Content-Type': 'application/json',
  };

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: headers,
  };

  try {
    const response = await fetch(url, requestOptions);
    const responseData = await response.json();
    console.log('Response data: ', JSON.stringify(responseData));
    return responseData;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}


