import React from 'react';
import {notification} from 'antd';

import {RequestEntity} from 'entities';
import globalStore from 'store/configureStore';
import {config} from 'config/config';
import {makeQueryParams} from '../../../../util/httpUtil';
import UserInfoEntity from '../../../../entities/UserInfoEntity';

const BASE_URL = config.serverInfo;

const TpPlantDeliveryRequestEntity = (method, url, name, param) => {
    return new RequestEntity(method, url, name, param).then(res => {
        if (res.status !== 200 && res.status !== 201 && res.status !== 202 && res.status !== 205) {
            return res.json();
        } else {
            return res;
        }
    }).then(res => {
        if (res.status === 400) {
            notification['warning']({
                message: res.message,
                description: JSON.stringify(res.errors),
                duration: null
            });
            return null;
        }
        if (res.status === 500) {
            notification['error']({
                message: res.exception,
                description: res.message,
                duration: null
            });
            return null;
        }
        if (res.status === 200 && method !== "GET") {
            getStatisticsTpPlantDelivery().then(tpPlantDelivery => globalStore.dispatch({
                type: "LOAD_STATISTICS_TP_PLANT_DELIVERY",
                payload: tpPlantDelivery
            }));
        } else if ((res.status === 200 && method === "GET") || res.status === 201) {
            return res.json();
        } else if (res.status === 202 || res.status === 205) {
            return null;
        } else {
            notification['error']({
                message: 'Contact Developer',
                duration: null
            });
            return null;
        }
    });
};

export const getStatisticsTpPlantDelivery = (startClosingDate, endClosingDate) => {
    return TpPlantDeliveryRequestEntity("GET", `${BASE_URL}/tp-plant-delivery/statistics?startClosingDate=${startClosingDate}&endClosingDate=${endClosingDate}`, "getStatisticsTpPlantDelivery");
};

export const getOriginalTpPlantDelivery = (searchCondition, page) => {
    let queryString = "";
    if (searchCondition['statusCode'] && searchCondition['platformCode']){
        queryString = makeQueryParams(
            ['brandCode', 'deliveryType', 'platformCode', 'startClosingDate', 'endClosingDate', 'statusCode', 'page', 'maxResultCount'],
            {
                brandCode: searchCondition['brandCode'],
                deliveryType: searchCondition['deliveryType'],
                platformCode: searchCondition['platformCode'],
                startClosingDate: searchCondition['startClosingDate'],
                endClosingDate: searchCondition['endClosingDate'],
                statusCode: searchCondition['statusCode'],
                page, maxResultCount: 100000
            })
    } else if (searchCondition['statusCode']){
        queryString = makeQueryParams(
            ['brandCode', 'deliveryType', 'startClosingDate', 'endClosingDate', 'statusCode', 'page', 'maxResultCount'],
            {
                brandCode: searchCondition['brandCode'],
                deliveryType: searchCondition['deliveryType'],
                startClosingDate: searchCondition['startClosingDate'],
                endClosingDate: searchCondition['endClosingDate'],
                statusCode: searchCondition['statusCode'],
                page, maxResultCount: 100000
            })
    } else if (searchCondition['platformCode']){
        queryString = makeQueryParams(
            ['brandCode', 'deliveryType', 'startClosingDate', 'endClosingDate', 'platformCode', 'page', 'maxResultCount'],
            {
                brandCode: searchCondition['brandCode'],
                deliveryType: searchCondition['deliveryType'],
                startClosingDate: searchCondition['startClosingDate'],
                endClosingDate: searchCondition['endClosingDate'],
                platformCode: searchCondition['platformCode'],
                page, maxResultCount: 100000
            })
    } else {
        queryString = makeQueryParams(
            ['brandCode', 'deliveryType', 'startClosingDate', 'endClosingDate', 'page', 'maxResultCount'],
            {
                brandCode: searchCondition['brandCode'],
                deliveryType: searchCondition['deliveryType'],
                startClosingDate: searchCondition['startClosingDate'],
                endClosingDate: searchCondition['endClosingDate'],
                page, maxResultCount: 100000
            })
    }
    return TpPlantDeliveryRequestEntity("GET", `${BASE_URL}/tp-plant-delivery/original?${queryString}`);
};

export const saveEmailAttachFile = (uploadFile) => {
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    const formData = new FormData();
    formData.append("attachFile", uploadFile);
    return TpPlantDeliveryRequestEntity("POST", `${BASE_URL}/email/save-attach-file?sendBy=${UserInfoEntity.getUserName()}`, 'MULTIPART_FORM_REQUEST', formData).then(count => {
        const attachFileList = globalStore.getState().searchTpOriginalDeliveryReducer.attachFileList;
        if (attachFileList.length === count) {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
        }
    });
};

export const deleteEmailAttachFile = () => {
    return TpPlantDeliveryRequestEntity("DELETE", `${BASE_URL}/email/delete-attach-file?sendBy=${UserInfoEntity.getUserName()}`, 'deleteEmailAttachFile');
};

export const deleteEmailAttachFileByFileName = (file) => {
    return TpPlantDeliveryRequestEntity("DELETE", `${BASE_URL}/email/delete-attach-file-by-fileName?sendBy=${UserInfoEntity.getUserName()}&fileName=${file.name}`, 'deleteEmailAttachFileByFileName');
};

export const sendEmailAboutCompareResult = (emails, compareStatisticsTpPlantDeliveries) => {
    compareStatisticsTpPlantDeliveries = compareStatisticsTpPlantDeliveries.map(tpPlantDelivery => {
        delete tpPlantDelivery['key'];
        return tpPlantDelivery;
    });
    const queryString = makeQueryParams(['emails', 'sendBy'], {emails: emails, sendBy: UserInfoEntity.getUserName()});
    return TpPlantDeliveryRequestEntity("POST", `${BASE_URL}/email/send-compare-result?${queryString}`, 'sendEmailAboutCompareResult', compareStatisticsTpPlantDeliveries);
};