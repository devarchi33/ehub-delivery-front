import React from 'react';
import {notification} from 'antd';

import {RequestEntity} from '../../../../entities';
import globalStore from '../../../../../admin/store/configureStore';
import {config} from '../../../../config/config';
import UserInfoEntity from '../../../../entities/UserInfoEntity';
import EHubDeliveryUtil from '../../../../util/EHubDeliveryUtil';

const BASE_URL = config.serverInfo;

const BatchRequestEntity = (method, url, name, param) => {
    return new RequestEntity(method, url, name, param).then(res => {
        if (res.status !== 200) {
            return res.json();
        } else {
            return res;
        }
    }).then(res => {
        globalStore.dispatch({type: "REST_UI_STATE"});
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
            getBatchInfoList().then(batchInfoList => globalStore.dispatch({type: "LOAD_BATCH_INFO_LIST", payload: batchInfoList}));
            return res.json();
        } else if (res.status === 200 && method === "GET") {
            return res.json();
        } else {
            notification['error']({
                message: 'Contact Developer',
                duration: null
            });
            return null;
        }
    });
};

export const getBatchInfoList = () => {
    const URL = BASE_URL.split('api')[0];
    return BatchRequestEntity("GET", `${URL}batchInfoList`, "getBatchInfoList");
};

export const updateBatchInfo = (createdBatchInfo) => {
    return BatchRequestEntity("POST", `${BASE_URL}/batchInfoList`, "updateBatchInfo", createdBatchInfo);
};

export const executeJob = (jobName, selectedBrandCodeList, selectedPlatformCodeList, endClosingDt, isForceExecute = false) => {
    return BatchRequestEntity("POST", `${BASE_URL}/batchJob/${jobName}?modifiedBy=${UserInfoEntity.getUserName()}&isForceExecute=${isForceExecute}&startClosingDt=${EHubDeliveryUtil.mindate}&endClosingDt=${endClosingDt}&brandCodes=${selectedBrandCodeList}&platformCodes=${selectedPlatformCodeList}`, "executeBatchJob");
};
