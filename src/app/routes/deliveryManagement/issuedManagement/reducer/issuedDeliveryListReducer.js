import console from 'util/logger';

import {extractPackingProducts, getIssueDeliveries} from '../service';
import globalStore from 'store/configureStore';

const initialState = {
    issuedDeliveries: [],
    issuedDeliveriesCount: 0,
    packingProducts: [],
    selectedDeliveryKeys: [],
    selectedDeliveryList: [],
    issueDeliveriesData: [],
    issueDeliveriesSumData: [],
    issueDataCount: 0,
    issueCount: 0
};

const LOAD_ISSUED_RESETSTATE = "LOAD_ISSUED_RESETSTATE";
const loadIssuedResetAction = (issuedDeliveries) => ({ type: LOAD_ISSUED_RESETSTATE, payload: issuedDeliveries });
export const resetState = () => {
    return (dispatch) => {
        return dispatch(loadIssuedResetAction(""));
    };
};
const LOAD_ISSUED_DELIVERIES = "LOAD_ISSUED_DELIVERIES";
const loadIssuedDeliveriesAction = (issuedDeliveries) => ({ type: LOAD_ISSUED_DELIVERIES, payload: issuedDeliveries });
export const loadIssuedDeliveries = (searchConditions, page = 1, maxResultCount = 50000) => {
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    return (dispatch) => {
        getIssueDeliveries(searchConditions, page, maxResultCount).then(deliveriesInfo => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            return dispatch(loadIssuedDeliveriesAction(deliveriesInfo));
        });
    };
};
const LOAD_PACKING_PRODUCTS = "LOAD_PACKING_PRODUCTS";
const loadPackingProductsAction = (packingProducts) => ({ type: LOAD_PACKING_PRODUCTS, payload: packingProducts });
export const loadPackingProducts = (issuedDeliveries, boxNo, waybillNo) => {
    return (dispatch) => {
        const packingProducts = extractPackingProducts(issuedDeliveries, boxNo, waybillNo);
        return dispatch(loadPackingProductsAction(packingProducts));
    };
};
const CHECK_ISSUED_DELIVERIES = "CHECK_ISSUED_DELIVERIES";
const checkIssuedDeliveriesAction = (selectInfo) => ({ type: CHECK_ISSUED_DELIVERIES, payload: selectInfo });
export const checkIssuedDeliveries = (selectedKeys, selectedList) => {
    return (dispatch) => {
        dispatch(checkIssuedDeliveriesAction({ selectedKeys, selectedList }));
    };
} ;
export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ISSUED_DELIVERIES:
            console.log(">>>>>>>>>> debug issuedDeliveryListReducer issuedDeliveriesInfo", action.payload);
            let originData = action.payload.issuedDeliveries;
            let data = _.groupBy(originData, (item) => {
                return item.waybillNo+'&'+item.boxNo
            });
            let issueList = [];
            Object.keys(data).map(key => {
                //同一个deliveryNo中有不同的boxNo时，根据box中的sku是否入库了，判断状态显示IC还是OW
                let normalQtys = [];
                const value = data[key];
                value.forEach(delivery => normalQtys = normalQtys.concat(delivery.createdPackingBox.packingSKUs[0].inspectedQty.normalQty));
                if(normalQtys.indexOf(null) !== -1) {
                    value[0].statusCode = 'OW';
                } else {
                    value[0].statusCode = 'IC';
                }
            });
            _.forEach(data, (item) => {
                issueList.push(item);
            });
            let issueSumList = [];
            issueList.map(item => {
                item[0].totalQty = _.sumBy(item, 'totalQty');
                issueSumList = issueSumList.concat(item[0]);
            });
            let issueDataSumCount = 0;
            issueSumList.map(eachList => {
                issueDataSumCount += eachList.totalQty;
            });
            let issueCount = 0;
            issueCount = issueList.length;
            return {
                ...state,
                issuedDeliveries: action.payload.issuedDeliveries,
                issueDeliveriesData: issueList,
                issueDeliveriesSumData: issueSumList,
                issueDataCount: issueDataSumCount,
                issueCount: issueCount,
                issuedDeliveriesCount: action.payload.issuedDeliveriesCount
            };
        case LOAD_PACKING_PRODUCTS:
            console.log(">>>>>>>>>> debug issuedDeliveryListReducer packingProducts", action.payload);
            return { ...state, packingProducts: action.payload };
        case CHECK_ISSUED_DELIVERIES:
            console.log(">>>>>>>>>> debug issuedDeliveryListReducer checkedIssuedDeliveryInfo", action.payload);
            return {
                ...state,
                selectedDeliveryKeys: action.payload.selectedKeys,
                selectedDeliveryList: action.payload.selectedList
            };
        case LOAD_ISSUED_RESETSTATE:
            return {
                issuedDeliveries: [],
                issuedDeliveriesCount: 0,
                packingProducts: [],
                selectedDeliveryKeys: [],
                selectedDeliveryList: [],
            };
        default:
            return state;
    }
};