import { config } from 'config/config';

const BASE_URL = config.serverInfo;

export const getIncomingStocks = (page = 1,
                                  maxResultCount = 10,
                                  brand = "",
                                  plant = "",
                                  style = "",
                                  skuId = "") => {                                    
    let url=  `${BASE_URL}/stocks/e-commerce/receipt-issue/stats?brandCode=${brand}`;
    (plant && plant !== "") ? (url = url + '&plantId=' + plant) : url;
    (style && style !== "") ? (url = url + '&styleCode=' + style) : url;
    (skuId && skuId !== "") ? (url = url + '&skuId=' + skuId) : url;

    return fetch(`${url}` + `&maxResultCount=${maxResultCount}&page=${page}`) //API ID:S002
        .then(res => res.json());
};
