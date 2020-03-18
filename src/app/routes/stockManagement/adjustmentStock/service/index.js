import { config } from 'config/config';

const BASE_URL = config.serverInfo;

export const getAdjustmentStockInfo = (productCode = "", brand = "EE") => {
    return fetch(`${BASE_URL}/adjustmentStocks`)
        .then(res => res.json());
};

export const createAdjustmentStockInfo = (stockInfo) => {
    console.log(stockInfo);
    return fetch(`${MOCK_BASE_URL}/adjustmentStocks`, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify({id: stockInfo.key, ...stockInfo})
    })
        .then(res => {
            if(res.status === 200 || res.status === 201) {
                return res.json();
            } else {
                console.error(res);
            }
        });
};

export const updateAdjustmentStockInfo = (stockInfo) => {
    return fetch(`${MOCK_BASE_URL}/adjustmentStocks/${stockInfo.key}`, {
        method: "PUT",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        },
        body: JSON.stringify(stockInfo)
    })
        .then(res => res.json());
};

export const deleteAdjustmentStockInfo = (key) => {
    return fetch(`${MOCK_BASE_URL}/${key}`, {
        method: "DELETE",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json"
        }
    });
};

export const getStockInfo = (brandCode = "", plantId = "", skuId = "") => {
    let url =`${BASE_URL}/cmm_sku/brand/${brandCode}/plant/${plantId}/sku/${skuId}`
    console.log("..........url", url);
    return fetch(url).then(res => res.json()); //[API : master-info-rest-controller] 
};