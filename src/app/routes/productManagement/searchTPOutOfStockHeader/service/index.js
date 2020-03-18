import React from 'react';
import {notification} from 'antd';
import {config} from 'config/config';
import {makeQueryParams} from 'util/httpUtil';
import {RequestEntity} from 'entities';
import TpProductEntity from "../entity/TpProductEntity";

import globalStore from 'store/configureStore';
import UserInfoEntity from "../../../../entities/UserInfoEntity";
import {ModifyError} from "../validator/ModifyError";
import EHubDeliveryUtil from "../../../../util/EHubDeliveryUtil";

const BASE_URL = config.serverInfo;

export const getTpPlantDelivery = (searchConditions) => {
    const url = `${BASE_URL}/tp-plant-delivery`;
    let paramsKey = ["statusCode", "closingDate"], queryString;
    let conditions = {
        statusCode: searchConditions["errorType"] === TpProductEntity.INVALID_PRODUCT ? TpProductEntity.INVALID_PRODUCT_CODE : TpProductEntity.OUT_OF_STOCK_CODE,
        closingDate: searchConditions["closingDate"]
    };
    if(searchConditions["brandCode"] === null) {
        queryString = makeQueryParams(paramsKey, conditions);
    } else {
        paramsKey.push("brandCode");
        queryString = makeQueryParams(paramsKey, {...conditions, brandCode: searchConditions["brandCode"]});
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

export const modifyTpProductCodeToEhubProductCode = (modifiedTpProductCode, ref) => {
    const url = `${BASE_URL}/tp-plant-delivery`;
    const body = [{
        brandCode: TpProductEntity.getBrandCode(),
        sourceProductCode: TpProductEntity.getTpProductId(),
        targetProductCode: modifiedTpProductCode,
        modifiedBy: UserInfoEntity.getUserName()
    }];
    return new RequestEntity("PUT", url, "getTpPlantDelivery", body)
        .then(res => res.json())
        .then(res => {
            if (res.code === "100") {
                notification['warning']({
                    message: '更新失败',
                    description: ModifyError.getErrorMessage(res),
                    duration: null
                });
                return;
            }
            if (res.statusCode === "40" || res.statusCode === "31") {
                notification['success']({
                    message: "商品代码修改成功",
                    description: TpProductEntity.getTpProductId() + "=>" + res.productId + " 修改成功",
                    duration: null
                });
                const {searchTpPlantDelivery} = ref.props;
                searchTpPlantDelivery(TpProductEntity.getBrandCode(), TpProductEntity.INVALID_PRODUCT, EHubDeliveryUtil.daysAgo(0));
                ref.handleCancel();
            }
        });
};
