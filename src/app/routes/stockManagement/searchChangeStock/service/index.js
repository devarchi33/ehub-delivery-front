import { config } from 'config/config';
import console from 'util/logger';

const BASE_URL = config.serverInfo;

export const getStockChangeInfo = (brandCode = "", plantId = "", productId="", page=1, maxPageSize=1000) => {
    let url =`${BASE_URL}/stocks/searchchangedstock?brandCode=${brandCode}&plantId=${plantId}&skuId=${productId}&page=${page}&maxResultCount=${maxPageSize}`

    console.log("..........url", url);
    return fetch(url).then(res => res.json()); //[API ID : S007]
};