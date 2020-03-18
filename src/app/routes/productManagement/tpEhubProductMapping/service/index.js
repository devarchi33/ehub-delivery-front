import { config } from 'config/config';
import {RequestEntity} from '../../../../../app/entities';
import globalStore from 'store/configureStore';
import UserInfoEntity from "../../../../entities/UserInfoEntity";
import {notification} from 'antd';
import TpProductEntity from "../../searchTPOutOfStockHeader/entity/TpProductEntity";
import {makeQueryParams} from 'util/httpUtil';

const BASE_URL = config.serverInfo;

const TpEhubProductMappingRequestEntity = (method, url, name, param) => {
    return new RequestEntity(method, url, name, param).then(res => {
        if (res.status !== 200) {
            return res.json();
        } else {
            return res;
        }
    })
};

export const getMappingInfo = (brand = "", productCd = "") => {
    let url = `${BASE_URL}/tp-plant-delivery/queryProductMapping?brandCd=${brand}`;
    if (productCd)
        url += `&productCd=${productCd}`;
    
    return fetch(url).then(res => res.json());  //P006
};

export const deleteMappingInfo = (brand = "", tpProductCd = "", ehubProductCd = "") => {
    return TpEhubProductMappingRequestEntity("DELETE", `${BASE_URL}/tp-plant-delivery/deleteProductMapping?brandCd=${brand}&tpProductCd=${tpProductCd}&ehubProductCd=${ehubProductCd}`, "deleteProductMapping");
};

export const modifyTpProductCodeToEhubProductCode = (record, modifiedTpProductCode) => {
    const url = `${BASE_URL}/tp-plant-delivery`;
    const body = [{
        brandCode: record.brandCode,
        sourceProductCode: record.tpProductCode,
        targetProductCode: modifiedTpProductCode,
        modifiedBy: UserInfoEntity.getUserName()
    }];
    return new RequestEntity("PUT", url, "getTpPlantDelivery", body);
};

export const getTpPlantDelivery = (searchConditions) => {
    const url = `${BASE_URL}/tp-plant-delivery`;
    let paramsKey = ["statusCode"], queryString;
    let conditions = {
        statusCode: TpProductEntity.INVALID_PRODUCT_CODE
    };
    
    if(searchConditions["brandCode"] === "All") {
        queryString = makeQueryParams(paramsKey, {...conditions});
    }
    if(searchConditions["brandCode"] !== "All") {
        paramsKey.push("brandCode");
        queryString = makeQueryParams(paramsKey, {...conditions, brandCode: searchConditions["brandCode"]});
    }
    if (searchConditions["productCd"] !== null && searchConditions["productCd"] !== "") {
        paramsKey.push("productCd");
        queryString = makeQueryParams(paramsKey, {...conditions, productCd: searchConditions["productCd"]});
    }
    
    const urlWithQueryString = `${url}?${queryString}`;
    return new RequestEntity("GET", urlWithQueryString, "getTpPlantDelivery")
        .then(res => res.json())
        .then(rowTpPlantDeliveries => {
            if(rowTpPlantDeliveries.status === 400) {
                globalStore.dispatch({type: "SET_LOADING", payload: false});
                notification["warning"]({
                    message: '查询失败',
                    description: rowTpPlantDeliveries.message,
                    duration: null
                });
                return;
            }
            if(rowTpPlantDeliveries.status === 500) {
                globalStore.dispatch({type: "SET_LOADING", payload: false});
                notification["error"]({
                    message: '查询失败',
                    description: rowTpPlantDeliveries.message,
                    duration: null
                });
                return;
            }
            const tpPlantDeliveries = rowTpPlantDeliveries.map(delivery => {
                return {...delivery};
            });
            return tpPlantDeliveries;
        });
};
