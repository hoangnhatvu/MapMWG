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

const createRouterLine = async (
  startCoords: [number, number],
  endCoords: [number, number],
) => {
  const startCoordinates = `${startCoords[0]},${startCoords[1]}`;
  const endCoordinates = `${endCoords[0]},${endCoords[1]}`;
  const geometries = 'geojson';
  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${startCoordinates};${endCoordinates}?alternatives=true&geometries=${geometries}&steps=true&banner_instructions=true&overview=full&voice_instructions=true&access_token=${APIKEY}`;
  console.log('url: ' + url);

  try {
    let response = await fetch(url);
    let json = await response.json();
    let coordinates = json.routes[0].geometry.coordinates;

    if (coordinates.length) {
      const routerFeature = makeRouterFeature([...coordinates]);
      return routerFeature;
    }
  } catch (error) {
    return null;
    console.error(error);
  }
};

export const createRoute = async () => {};
