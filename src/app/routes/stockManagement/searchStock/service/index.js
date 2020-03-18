import { config } from 'config/config';
import { UserInfoEntity } from 'entities/index';
import console from 'util/logger';

const BASE_URL = config.serverInfo;
//暂不使用,勿删
// export const getStockInfo = (brandCode = "EE", plantId = "",
//                              styleCode = "", skuId = "", page = "1", pageSize = "200") => {
//     let url =`${BASE_URL}/stocks/e-commerce/stats?brandCode=${brandCode}&plantId=${plantId}&maxResultCount=${pageSize}&page=${page}`
//     if(styleCode)
//         url += `&styleCode=${styleCode}`;
//     if(skuId)
//         url += `&skuId=${skuId}`;

//      console.log("..........url", url);
//     return fetch(url).then(res => res.json()); //[API ID : S001]
// };

export const getStockInfo = (brandCode = "", plantId = "", productId="") => {
    let url =`${BASE_URL}/stocks?brandCode=${brandCode}&plantId=${plantId}`
    if(productId)
        url += `&productId=${productId}`;

     console.log("..........url", url);
    return fetch(url).then(res => res.json()); //[API ID : S004]
};