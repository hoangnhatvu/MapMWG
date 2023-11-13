import { callRoutingAPI } from "./fetchAPI";

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

export const createRouterLine = async(currentLocation: [number,number], destination: [number, number]) => {
  const data = await callRoutingAPI(currentLocation, destination);
  console.log(JSON.stringify(data));

  let coordinates = data.Data.features[0].geometry.coordinates

  if (coordinates.length) {
    const routerFeature = makeRouterFeature([...coordinates]);
    return routerFeature;
  }
}
