import { config } from 'config/config';
import console from 'util/logger';

const BASE_URL = config.serverInfo;

export const getAdjustmentStockInfo = (brandCode = "", plantId = "", skuId="", page, pageSize) => {
    let url =`${BASE_URL}/stocks/adjustmentstock?brandCode=${brandCode}&page=${page}&maxResultCount=${pageSize}`;
    (plantId && plantId !== "") ? (url = url + '&plantId=' + plantId) : url;
    (skuId && skuId !== "") ? (url = url + '&skuId=' + skuId) : url;

    console.log("..........url", url);
    return fetch(url).then(res => res.json()); //[API ID : S006]
};