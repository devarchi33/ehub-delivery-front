import { config } from 'config/config';
import console from 'util/logger';
import {RequestEntity} from "../../../../entities/index";
import {makeQueryParams} from "../../../../util/httpUtil";

const BASE_URL = config.serverInfo;

export const getCompareStock = (brandCode = "", plantId = "", productId="") => {
    let url =`${BASE_URL}/stocks/compare`;
    const paramsKey = ["brandCode", "plantId", "productId"];
    let queryString;
    if(productId) {
        queryString = makeQueryParams(paramsKey, {brandCode, plantId, productId});
    } else {
        queryString = makeQueryParams(paramsKey, {brandCode, plantId});
    }
    const urlWithQueryString = `${url}?${queryString}`;

    return new RequestEntity("GET", urlWithQueryString, "getCompareStock").then(res => res.json()); //[API ID : S005]
};