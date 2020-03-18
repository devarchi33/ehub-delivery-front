import React from 'react';
import {notification} from 'antd';

import console from 'util/logger';
import {searchWorkingDeliveries, searchWorkingDeliveriyBox, searchWorkingTpPlantDeliveries} from '../../service';

import UserInfoEntity from '../../../../entities/UserInfoEntity';

import globalStore from 'store/configureStore';
import {initializeEHubMaster} from '../../../service';
import {UploadService} from '../service';
import EHubDeliveryUtil from '../../../../util/EHubDeliveryUtil';

const initialState = {
    dataSourceForDelivery: {},
    dataSourceForBox: {},
    dataSourceForTpPlantDelivery: {},
    confirming: false,
    confirmPercentage: 0
};

const confirmWorkDeliveryList = (eachConfirmWorkingDeliveryService, dataSourceForDelivery) => {
    if (!EHubDeliveryUtil.existUploadFileCheck(dataSourceForDelivery.items)) {
        return;
    }
    if (!EHubDeliveryUtil.existConfirmKeys(dataSourceForDelivery.confirmKeyList)) {
        return;
    }
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    eachConfirmWorkingDeliveryService(dataSourceForDelivery).then(() => {
        UploadService.confirmPolling(dataSourceForDelivery.type, dataSourceForDelivery.platformCode);
    });
};

const RESET_WORKDELIVERIES = "RESET_WORKDELIVERIES";
const resetWorkDeliveriesAction = () => ({type: RESET_WORKDELIVERIES});
export const resetWorkDeliveries = () => {
    return (dispatch) => {
        return dispatch(resetWorkDeliveriesAction());
    };
};

const LOAD_WORKDEILVERIES = "LOAD_WORKDELIVERIES";
const loadWorkDeliveriesAction = (dataSourceForDelivery) => ({type: LOAD_WORKDEILVERIES, payload: dataSourceForDelivery});
export const loadWorkDeliveries = (type, page = 1, maxResultCount = 10) => {
    return (dispatch) => {
        searchWorkingDeliveries({createdBy: UserInfoEntity.getUserName()}, type, maxResultCount, page).then(response => {
            return dispatch(loadWorkDeliveriesAction(response));
        });
    };
};

const LOAD_WORKDELIVERY_BOX = "LOAD_WORKDELIVERY_BOX";
const loadWorkDeliveryBoxAction = (dataSourceForBox) => ({type: LOAD_WORKDELIVERY_BOX, payload: dataSourceForBox});
export const loadWorkDeliveryBox = (type, waybillNo, page = 1, maxResultCount = 8) => {
    return (dispatch) => {
        searchWorkingDeliveriyBox({createdBy: UserInfoEntity.getUserName()}, type, waybillNo, maxResultCount, page).then(response => {
            return dispatch(loadWorkDeliveryBoxAction(response));
        });
    };
};

const UPDATE_CONFIRM_PERCENTAGE = "UPDATE_CONFIRM_PERCENTAGE";
const updateConfirmPercentageAction = (dataSourceForDelivery) => ({type: UPDATE_CONFIRM_PERCENTAGE, payload: dataSourceForDelivery});

const CONFIRM_WORKDELIVERIES = "CONFIRM_WORKDELIVERIES";
const confirmWorkDeliveriesAction = (dataSourceForDelivery) => ({type: CONFIRM_WORKDELIVERIES, payload: dataSourceForDelivery});
export const confirmWorkDeliveries = () => {
    const dataSourceForDelivery = globalStore.getState().uploadManagementReducer.dataSourceForDelivery;
    if(dataSourceForDelivery.type !== 'SHIPMENT') {
        const workingDeliveries = dataSourceForDelivery.items ? dataSourceForDelivery.items : [];
        const receiptPlant = _.uniq(workingDeliveries.map(workDelivery => workDelivery.receiptPlantId))[0];
        const selectedBrand = workingDeliveries.length > 0 ? workingDeliveries[0].brandCode : '';
        const allowReceiptPlantList = initializeEHubMaster().plantList.filter(item => selectedBrand.indexOf(item.brandCode) !== -1).map(plant => plant.plantCode);
        const checkCanReceipt = allowReceiptPlantList.indexOf(receiptPlant) !== -1;
        if(checkCanReceipt) {
            confirmWorkDeliveryList(dataSourceForDelivery.type === 'RECEIPT' ?
                UploadService.confirmWorkingReceiptDeliveries : UploadService.confirmWorkingIssueReceipt, dataSourceForDelivery);
        } else {
            notification['warning']({
                message: '当前账号没有' + receiptPlant + '权限，请修改后重试.',
                duration: null
            });
        }
    } else {
        confirmWorkDeliveryList(UploadService.confirmWorkingIssueDeliveries, dataSourceForDelivery);
    }
    return (dispatch) => {
        return dispatch(confirmWorkDeliveriesAction(dataSourceForDelivery))
    };
};

const LOAD_WORK_TP_PLANT_DELIVERIES = "LOAD_WORK_TP_PLANT_DELIVERIES";
const loadWorkTpPlantDeliveriesAction = (dataSourceForTpPlantDelivery) => ({
    type: LOAD_WORK_TP_PLANT_DELIVERIES,
    payload: dataSourceForTpPlantDelivery
});
export const loadWorkTpPlantDeliveries = (type, platformCode, page) => {
    return (dispatch) => {
        searchWorkingTpPlantDeliveries({createdBy: UserInfoEntity.getUserName()}, type, platformCode, 10, page).then(response => {
            return dispatch(loadWorkTpPlantDeliveriesAction(response));
        });
    };
};

const CONFIRM_WORK_TP_PLANT_DELIVERIES = "CONFIRM_WORK_TP_PLANT_DELIVERIES";
const confirmWorkTpPlantDeliveriesAction = (dataSourceForTpPlantDelivery) => ({
    type: "CONFIRM_WORK_TP_PLANT_DELIVERIES",
    payload: dataSourceForTpPlantDelivery
});
export const confirmWorkTpPlantDeliveries = () => {
    const dataSourceForTpPlantDelivery = globalStore.getState().uploadManagementReducer.dataSourceForTpPlantDelivery;
    confirmWorkDeliveryList(UploadService.confirmWorkingTpPlantDelivery, dataSourceForTpPlantDelivery);
    return (dispatch) => {
        return dispatch(confirmWorkTpPlantDeliveriesAction(dataSourceForTpPlantDelivery));
    };
};


export default (state = initialState, action) => {
    switch (action.type) {
        case RESET_WORKDELIVERIES:
            console.log(">>>>>>>>>> debug uploadManagementReducer resetWorkDeliveries");
            return initialState;
        case LOAD_WORKDEILVERIES:
            console.log(">>>>>>>>>> debug uploadManagementReducer loadWorkDeliveries", action.payload);
            return {
                ...state,
                dataSourceForDelivery: action.payload
            };
        case LOAD_WORKDELIVERY_BOX:
            console.log(">>>>>>>>>> debug uploadManagementReducer loadWorkDeliveryBox", action.payload);
            return {
                ...state,
                dataSourceForBox: action.payload
            };
        case UPDATE_CONFIRM_PERCENTAGE:
            const confirmPercentage = Number.parseInt((action.payload.applyCount/action.payload.totalCount) * 100);
            console.log(">>>>>>>>>> debug uploadManagementReducer updateConfirmPercentage", confirmPercentage);
            return {
                ...state,
                confirmPercentage: confirmPercentage
            };
        case CONFIRM_WORKDELIVERIES:
            console.log(">>>>>>>>>> debug uploadManagementReducer confirmWorkDeliveries", action.payload);
            return {
                ...state,
                confirming: true
            };
        case LOAD_WORK_TP_PLANT_DELIVERIES:
            console.log(">>>>>>>>>> debug uploadManagementReducer loadWorkTpPlantDeliveries", action.payload);
            return {
                ...state,
                dataSourceForTpPlantDelivery: action.payload
            };
        case CONFIRM_WORK_TP_PLANT_DELIVERIES:
            console.log(">>>>>>>>>> debug uploadManagementReducer confirmWorkTpPlantDeliveries", action.payload);
            return {
                ...state,
                confirming: true
            };
        default:
            return state;
    }
};