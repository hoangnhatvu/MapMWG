import requestApi, { type requestApiProps } from "./apiConfig";

const getRouteMutilDestination = async (data: [number, number][]) => {
  const request: requestApiProps = {
    endpoint: "routing_genetic?profile=driving-hgv",
    method: "POST",
    params: undefined,
    body:
    {
      "coordinates": data,
      "preference": "shortest",
      "continue_straight": true,
      "elevation": false,
      "units": "km",
      "language": "vi-vn",
      "geometry": true,
      "instructions": false,
      "instructions_format": "html"

    },
    responseType: undefined,
  };
  console.log(request.body)
  const response = await requestApi(request);
  return response.data?.Data;
};

export { getRouteMutilDestination };
