import requestApi, { type requestApiProps } from "./apiConfig";

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
    const response = await requestApi(request);
    return response.data.Data?.elasticSearchResult;
};

export { searchApi };
