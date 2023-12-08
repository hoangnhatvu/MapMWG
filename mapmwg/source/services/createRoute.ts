import {callRoutingAPI} from './fetchAPI';

const APIKEY =
  'pk.eyJ1Ijoibmd1eWVuaDgiLCJhIjoiY2xvZHIwaWVoMDY2MzJpb2lnOHh1OTI4MiJ9.roagibKOQ4EdGvZaPdIgqg';

export function makeRouterFeature(coordinates: [number, number][]): any {
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

export const createRouterLine = async (
  currentLocation: [number, number],
  destination: [number, number],
  transportation: string,
) => {
  try {
    const data = await callRoutingAPI(
      currentLocation,
      destination,
      transportation,
    );

    if (
      data &&
      data.Data &&
      data.Data.features &&
      data.Data.features.length > 0
    ) {
      const coordinates = data.Data.features[0].geometry.coordinates;

      if (coordinates && coordinates.length) {
        const routerFeature = makeRouterFeature([...coordinates]);
        return routerFeature;
      }
    }
    return null;
  } catch (error) {
    console.error('Error in createRouterLine:', error);
    return null;
  }
};

export const createMultipleRouterLine = async (
  currentLocation: [number, number],
  destination: [number, number],
  transportation: string,
) => {
  try {
    const data = await callRoutingAPI(
      currentLocation,
      destination,
      transportation,
    );
    const routes = [];

    if (
      data &&
      data.Data &&
      data.Data.features &&
      Array.isArray(data.Data.features)
    ) {
      for (let i = 0; i < data.Data.features.length; i++) {
        if (
          data.Data.features[i].geometry &&
          data.Data.features[i].geometry.coordinates
        ) {
          let coordinates = data.Data.features[i].geometry.coordinates;
          routes.push(makeRouterFeature([...coordinates]));
        } else {
          console.error('Invalid data structure for feature ' + i);
        }
      }
    } else {
      return null;
    }
    return routes;
  } catch (error) {
    throw new Error('Có lỗi xảy ra !');
  }
};
