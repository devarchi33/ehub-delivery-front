import React from 'react';
import {notification} from 'antd';
import {config} from 'config/config';
import {RequestEntity, UserInfoEntity} from 'entities';
import globalStore from 'store/configureStore';
import {searchWorkingDeliveries, searchWorkingTpPlantDeliveries} from '../../service';

const BASE_URL = config.serverInfo;
const WORK_DELIVERY_BASE_URL = BASE_URL + '/work-deliveries';
const WORK_TP_PLANT_DELIVERY_BASE_URL = BASE_URL + '/work-tp-plant-deliveries';

const UploadConfirmRequestEntity = (method, url, name, param) => {
    return new RequestEntity(method, url, name, param).then(res => {
        if (res.status !== 200) {
            return res.json();
        } else {
            return res;
        }
    }).then(res => {
        if (res.status === 400) {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            globalStore.dispatch({type: "RESET_WORKDELIVERIES"});
            notification['warning']({
                message: res.message,
                description: JSON.stringify(res.errors),
                duration: null
            });
            return null;
        }
        if (res.status === 500) {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            globalStore.dispatch({type: "RESET_WORKDELIVERIES"});
            notification['error']({
                message: res.exception,
                description: res.message,
                duration: null
            });
            return null;
        }
    });
};

export class UploadService {
    static confirmWorkingIssueDeliveries = (datasource) => {
        const url = `${WORK_DELIVERY_BASE_URL}/${UserInfoEntity.getUserName()};type=commit-issue`;
        // 출고 작업 진행 중인 수불 출고 처리
        return new UploadConfirmRequestEntity("PUT", url, "confirmWorkingIssueDeliveries", datasource.confirmKeyList);
    };
    static confirmWorkingReceiptDeliveries = (datasource) => {
        const url = `${WORK_DELIVERY_BASE_URL}/${UserInfoEntity.getUserName()};type=commit-inspect`;
        // 검품 작업 진행 중인 수불 (예. 검품 창고) 입고 검품 처리
        return new UploadConfirmRequestEntity("PUT", url, "confirmWorkingReceiptDeliveries", datasource.confirmKeyList);
    };
    static confirmWorkingIssueReceipt = (datasource) => {
        const url = `${WORK_DELIVERY_BASE_URL}/${UserInfoEntity.getUserName()};type=commit-issue-receipt`;
        // 출고 + 입고 작업 진행 중인 수불(예.외부 플랫폼) 출고 + 입고 처리
        return new UploadConfirmRequestEntity("PUT", url, "confirmWorkingIssueReceipt", datasource.confirmKeyList);
    };
    static confirmWorkingTpPlantDelivery = (datasource) => {
        const url = `${WORK_TP_PLANT_DELIVERY_BASE_URL}/${UserInfoEntity.getUserName()}/${datasource.type}/${datasource.platformCode}`;
        // TpPlantDelivery Supplement
        return new UploadConfirmRequestEntity("PUT", url, "confirmWorkingTpPlantDelivery", datasource.confirmKeyList);
    };
    // 共享
    static confirmPolling = (type, platformCode) => {
        const pollingProcessor = setInterval(() => {
            let searchFunction;
            let dispatchType;
            if (type === 'OS' || type === 'OR' || type === 'EV') {
                searchFunction = searchWorkingTpPlantDeliveries;
                dispatchType = "LOAD_WORK_TP_PLANT_DELIVERIES";
            } else {
                searchFunction = searchWorkingDeliveries;
                dispatchType = "LOAD_WORKDELIVERIES";
            }
            searchFunction({createdBy: UserInfoEntity.getUserName()}, type, platformCode).then(response => {
                globalStore.dispatch({type: "UPDATE_CONFIRM_PERCENTAGE", payload: response});
                if (response.totalCount !== response.applyCount) {
                    globalStore.dispatch({type: dispatchType, payload: response});
                } else {
                    globalStore.dispatch({type: "SET_LOADING", payload: false});
                    globalStore.dispatch({type: "RESET_WORKDELIVERIES"});
                    notification['success']({
                        message: "保存成功",
                        duration: null
                    });
                    clearInterval(pollingProcessor);
                }
            });
        }, 6000);
    };
}