import { config } from 'config/config';

const BASE_URL = config.serverInfo;

export const getProductInfo = (productCode = "", brand = "EE") => {
    return fetch(`${BASE_URL}/productInfos?brandCode=${brand}&productCode=${productCode}`)
        .then(res => res.json());
};