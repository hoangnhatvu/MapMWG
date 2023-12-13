import axios, {AxiosRequestConfig} from 'axios';

export async function callRoutingAPI(currentLocation: [number, number], destination: [number, number], transportation: string, avoidance: string[]): Promise<any> {
  const url =
    `http://betaerp.tgdd.vn/mwg-app-service-gis-web-service/api/routing?profile=driving-${transportation}`;

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
    },
    options: {
      avoid_features: avoidance,
    },

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
    throw error;
  }
}

export async function callMultipleRoutingAPI(coordinates: [number,number] [], transportation: string): Promise<any> {
  const url = `'http://betaerp.tgdd.vn/mwg-app-service-gis-web-service/api/routing_genetic?profile=driving-${transportation}'`;
  const body = {
    coordinates: coordinates,
    preference: 'shortest',
    continue_straight: true,
    elevation: false,
    units: 'km',
    language: 'vi-vn',
    geometry: true,
    instructions: true,
    instructions_format: 'html',
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
    return responseData;
  } catch (error: any) {
    throw new Error("Có lỗi xảy ra");
  }
}


