import console from 'util/logger';
import {getReceiptDeliveries, parseClickReceiptDeliveryInfo} from '../service';
import {config} from "../../../../config/config";

import globalStore from 'store/configureStore';

const initialState = {
    receiptDeliveries: [],
    selectedDeliveryKeys: [],
    selectedDeliveryList: [],
    productsInspectionList: [],
    confirmationExcelFile: [],
    receiptSumByDataList: [],
    receiptListCount: 0,
    receiptCountByDirectDelivery: 0,
    receiptCountByNormalDelivery: 0,
    pageConfig: config.pageConfig({totalCount: 0, receiptConfirmNum: 0})
};

const LOAD_RECEIPT_DELIVERIES = "LOAD_RECEIPT_DELIVERIES";
const loadReceiptDeliveriesAction = (receiptDeliveries) => ({type: LOAD_RECEIPT_DELIVERIES, payload: receiptDeliveries});
export const loadReceiptDeliveries = (searchCondition, page = 1, maxResultCount = 50000) => {
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    return (dispatch) => {
        getReceiptDeliveries(searchCondition, page, maxResultCount).then(deliveriesInfo => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            return dispatch(loadReceiptDeliveriesAction(deliveriesInfo));
        });
    };
};
const CLICK_RECEIPT_DELIVERY = "CLICK_RECEIPT_DELIVERY";
const clickReceiptDeliveryAction = (clickDeliveryInfo) => ({type: CLICK_RECEIPT_DELIVERY, payload: clickDeliveryInfo});
export const processAfterClickReceiptDelivery = (receiptDeliveries, deliveryIndex, waybillNo) => {
    return (dispatch) => {
        const clickedReceiptDeliveryInfo = parseClickReceiptDeliveryInfo(receiptDeliveries, deliveryIndex, waybillNo, initialState);
        return dispatch(clickReceiptDeliveryAction({
            parseProductList: clickedReceiptDeliveryInfo.parseProductList,
        }));
    };
};
const CHANGE_PAGE_CONFIG = "CHANGE_PAGE_CONFIG";
const changePageConfigAction = (pageConfig) => ({type: CHANGE_PAGE_CONFIG, payload: pageConfig});
export const changePageConfig = (totalCount, receiptConfirmNum) => {
    return (dispatch) => {
        return dispatch(changePageConfigAction(config.pageConfig({totalCount, receiptConfirmNum})));
    };
};
const LOAD_RECEIPT_RESETSTATE = "LOAD_RECEIPT_RESETSTATE";
const loadReceiptResetStateAction = (receiptDeliveries) => ({type: LOAD_RECEIPT_RESETSTATE, payload: receiptDeliveries});
export const resetState = () => {
    return (dispatch) => {
        return dispatch(loadReceiptResetStateAction(""));
    };
};
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_RECEIPT_DELIVERIES:
            console.log(">>>>>>>>>> debug receiptDeliveryListReducer receiptDeliveriesInfo", action.payload);
            let rawDeliveries = action.payload.deliveries;
            let groupedByWaybillNoAndBoxNoDelivery = _.groupBy(rawDeliveries, (delivery) => {
                return delivery.waybillNo+'&'+delivery.boxNo
            });
            let aggregatedDeliveryInfo = [];
            const deliveryList = Object.keys(groupedByWaybillNoAndBoxNoDelivery).map(key => {
                //如果statusCode=OW则显示OW，否则则正常计算
                const value = groupedByWaybillNoAndBoxNoDelivery[key];
                value[0].normalQty = _.sumBy(value, 'normalQty');
                value[0].preliminaryQty = _.sumBy(value, 'preliminaryQty');
                value[0].preliminaryQtyByDirectDelivery = _.sumBy(value, (data) => {
                    return data.shippingTypeCode === '16' ? data.preliminaryQty : 0
                });
                value[0].preliminaryQtyByNormalDelivery = value[0].preliminaryQty - value[0].preliminaryQtyByDirectDelivery;
                value[0].differenceQty = _.sumBy(value, 'differenceQty');
                //同一个deliveryNo中有不同的boxNo时，可以以boxNo为单位分批次上传，上传后的状态则需要根据boxNo的状态来判断
                let normalQtys = [];
                value.forEach(delivery => normalQtys = normalQtys.concat(delivery.createdPackingBox.packingSKUs[0].inspectedQty.normalQty));
                if(normalQtys.indexOf(null) !== -1) {
                    value[0].statusCode = 'OW';
                    value[0].isReceipt = false;
                } else {
                    value[0].statusCode = 'IC';
                    value[0].isReceipt = true;
                }
                aggregatedDeliveryInfo = aggregatedDeliveryInfo.concat(value[0]);
                return value;
            });
            const receiptListCount = aggregatedDeliveryInfo.reduce((initVal, record) => {
                return initVal + record.preliminaryQty;
            }, 0);
            const receiptConfirmNum = aggregatedDeliveryInfo.reduce((initVal, record) => {
                return initVal + record.normalQty;
            }, 0);
            return {
                ...state,
                receiptDeliveries: deliveryList,
                receiptSumByDataList: aggregatedDeliveryInfo,
                receiptListCount,
                receiptCountByDirectDelivery: aggregatedDeliveryInfo.reduce((initVal, record) => {
                    return initVal + record.preliminaryQtyByDirectDelivery;
                }, 0),
                receiptCountByNormalDelivery: aggregatedDeliveryInfo.reduce((initVal, record) => {
                    return initVal + record.preliminaryQtyByNormalDelivery;
                }, 0),
                pageConfig: config.pageConfig({totalCount: receiptListCount, receiptConfirmNum: receiptConfirmNum})
            };
        case CLICK_RECEIPT_DELIVERY:
            console.log(">>>>>>>>>> debug receiptDeliveryListReducer clickedReceiptDeliveryInfo", action.payload);
            return {
                ...state,
                productsInspectionList: action.payload.parseProductList
            };
        case CHANGE_PAGE_CONFIG:
            console.log(">>>>>>>>>> debug receiptDeliveryListReducer changePageConfig", action.payload);
            return {
                ...state,
                pageConfig: action.payload
            };
        case LOAD_RECEIPT_RESETSTATE:
            console.log(">>>>>>>>>> debug receiptDeliveryListReducer resetState", action.payload);
            return {
                receiptDeliveries: [],
                receiptDeliveriesCount: 0,
                selectedDeliveryKeys: [],
                selectedDeliveryList: [],
                productsInspectionList: [],
                confirmationExcelFile: [],
                pageConfig: config.pageConfig({totalCount: 0, receiptConfirmNum: 0})
            };
        default:
            return state;
    }
};