  import axios, {AxiosRequestConfig} from 'axios';

  export async function callRoutingAPI(currentLocation: [number,number], destination: [number, number] ): Promise<any> {
    const url =
      'http://betaerp.tgdd.vn/mwg-app-service-gis-web-service/api/routing?profile=driving-hgv';
    const body = {
      coordinates: [
        currentLocation,
        destination,
      ],
      preference: 'fastest',
      continue_straight: true,
      elevation: false,
      units: 'km',
      language: 'vi-vn',
      geometry: true,
      instructions: true,
      instructions_format: 'html',
    };

    const headers = {
      Authorization: 'Bearer 31f755be-5dcb-4c22-aa05-48e95e7bf370',
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
    Authorization: 'Bearer 31f755be-5dcb-4c22-aa05-48e95e7bf370',
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

export async function getCoordinatesAPI(coordinates:[number,number]): Promise<any> {
const [longitude, latitude] = coordinates;

  const url = `https://betaerp.tgdd.vn/mwg-app-service-gis-web-service/api/els/nearest?lat=${latitude}&lon=${longitude}`;
  const headers = {
    Authorization: 'Bearer 31f755be-5dcb-4c22-aa05-48e95e7bf370',
    'Content-Type': 'application/json',
  };

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: headers,
  };

  try {
    const response = await fetch(url, requestOptions);
    const responseData = await response.json();
    console.log("Response data: ", JSON.stringify(responseData));
    return responseData;
  } catch (error: any) {
    console.error(error);
    return null;
  }
}

const APIKEY =
  'pk.eyJ1Ijoibmd1eWVuaDgiLCJhIjoiY2xvZHIwaWVoMDY2MzJpb2lnOHh1OTI4MiJ9.roagibKOQ4EdGvZaPdIgqg';

function makeRouterFeature(coordinates: [number, number][]): any {
  let routerFeature = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: coordinates,
        },
      },
    ],
  };
  return routerFeature;
}

export const createRouterLine2 = async(currentLocation: [number,number], destination: [number, number]) => {
  const data = await callRoutingAPI(currentLocation, destination);
  console.log(JSON.stringify(data));

  let coordinates = data.Data.features[0].geometry.coordinates

  if (coordinates.length) {
    const routerFeature = makeRouterFeature([...coordinates]);
    return routerFeature;
  }
}

export const createRouterLine = async (
  startCoords: [number, number],
  endCoords: [number, number],
) => {
  const startCoordinates = `${startCoords[0]},${startCoords[1]}`;
  const endCoordinates = `${endCoords[0]},${endCoords[1]}`;
  const geometries = 'geojson';
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates};${endCoordinates}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=${APIKEY}`;

  try {
    let response = await fetch(url);
    let json = await response.json();
    const distanceInKilometers = (json.routes[0].distance / 1000.0).toFixed(2);
    console.log('URL' + url);
    console.log('Distance: ' + distanceInKilometers + ' km');
    console.log(json.waypoints[1].name);
    let coordinates = json.routes[0].geometry.coordinates;

    if (coordinates.length) {
      const routerFeature = makeRouterFeature([...coordinates]);
      return routerFeature;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};