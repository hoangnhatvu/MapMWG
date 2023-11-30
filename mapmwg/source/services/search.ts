import requestApi, { type requestApiProps } from "./apiConfig";
import { useState } from "react";


const searchApi = async (searchKey: string) => {
  const request: requestApiProps = {
    endpoint: "address/search",
    method: "POST",
    params: undefined,
    body:
    {
      "searchAddress": searchKey,
      "debug": true
    },
    responseType: undefined,
  };
  try {
    const response = await requestApi(request);
    return response.data.Data?.elasticSearchResult;
  } catch (error) {
    console.log(error)
  } 
};

export {searchApi};
