import {getDelvieryInfoByDeliveryNo, getDelvieryInfoByDeliveryNoAndBoxNo} from '../service';
import console from '../../../../app/util/logger';
import {notification} from 'antd';

import globalStore from '../../../store/configureStore';
import {config} from '../../../../app/config/config';

const initialState = {
    cancelDeliveryList: [],
    pageConfig: config.pageConfig({shipmentSkuQty: 0, receiptSkuQty: 0, shipmentQty: 0, receiptQty: 0}, "CANCEL_DELIVERY"),
    shipmentSkuQty: 0,
    receiptSkuQty: 0
};

const CLEAR_DELIVERYINFO = "CLEAR_DELIVERYINFO";
const clearDeliveryAction = () => ({type: CLEAR_DELIVERYINFO});
export const clearDeliveryInfo = () => {
    return (dispatch) => {
        return dispatch(clearDeliveryAction());
    }
};

const LOAD_CANCEL_INFO_LIST = "LOAD_CANCEL_INFO_LIST";
const loadBatchInfoListAction = (cancelDeliveryList) => ({type: LOAD_CANCEL_INFO_LIST, payload: cancelDeliveryList});
export const loadCancelDelvieryInfoListByDeliveryNo = (deliveryNo, ref, type) => {
    return (dispatch) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        getDelvieryInfoByDeliveryNo(deliveryNo).then(cancelDeliveryList => {
            let uniqSkuIdDeliveryList = window._.uniqBy(cancelDeliveryList, 'skuId');
            let shipmentSkuQty = _.sumBy(uniqSkuIdDeliveryList, "shipPlantSkuQty");
            let reciptPlantSkuQty = _.sumBy(uniqSkuIdDeliveryList, "reciptPlantSkuQty");
            if (type === "search"){
                ref.setState({
                    beforeShipmentQty: shipmentSkuQty,
                    beforeReceiptQty: reciptPlantSkuQty
                });
            }
            if (type === "update") {
                let shipmentType = ["WR", "ES", "OS", "EV", "WM"];
                let receiptType = ["WS", "ER", "SR", "OR", "WM"];
                let msg = "";
                let msg1 = "入库成功撤销" + ref.props.cancelDeliveryList.length +"件商品, 库存从"+ ref.state.beforeReceiptQty +"变成"+ reciptPlantSkuQty +"件";
                let msg2 = "出库成功撤销" + ref.props.cancelDeliveryList.length +"件商品, 库存从"+ ref.state.beforeShipmentQty +"变成"+ shipmentSkuQty +"件";
                if (receiptType.indexOf(cancelDeliveryList[0].deliveryType) > -1 && shipmentType.indexOf(cancelDeliveryList[0].deliveryType) > -1){
                    msg = msg1 + ";" + msg2;
                } else if (receiptType.indexOf(cancelDeliveryList[0].deliveryType) > -1){
                    msg = msg1;
                } else {
                    msg = msg2;
                }
                notification['success']({
                    message: msg,
                    duration: null
                });
            }
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            return dispatch(loadBatchInfoListAction(cancelDeliveryList));
        });
    };
};

const loadBatchInfoListByDeliveryNoAndBoxNoAction = (cancelDeliveryList) => ({type: LOAD_CANCEL_INFO_LIST, payload: cancelDeliveryList});
export const loadCancelDelvieryInfoListByDeliveryNoAndBoxNo = (deliveryNo, boxNo, ref, type) => {
    return (dispatch) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        getDelvieryInfoByDeliveryNoAndBoxNo(deliveryNo, boxNo).then(cancelDeliveryList => {
            let uniqSkuIdDeliveryList = window._.uniqBy(cancelDeliveryList, 'skuId');
            let shipmentSkuQty = _.sumBy(uniqSkuIdDeliveryList, "shipPlantSkuQty");
            let reciptPlantSkuQty = _.sumBy(uniqSkuIdDeliveryList, "reciptPlantSkuQty");
            if (type === "search"){
                ref.setState({
                    beforeShipmentQty: shipmentSkuQty,
                    beforeReceiptQty: reciptPlantSkuQty
                });
            }
            if (type === "update") {
                notification['success']({
                    message: "撤销成功",
                    duration: null
                });
            }
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            return dispatch(loadBatchInfoListByDeliveryNoAndBoxNoAction(cancelDeliveryList));
        });
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_DELIVERYINFO:
            console.log(">>>>>>>>>> debug cancelDelieryList resetDelvieryInfo");
            return initialState;
        case LOAD_CANCEL_INFO_LIST:
            console.log(">>>>>>>>>> debug cancelDelieryList", action.payload);
            let uniqSkuIdDeliveryList = window._.uniqBy(action.payload, 'skuId');
            let shipmentSkuQty = _.sumBy(uniqSkuIdDeliveryList, "shipPlantSkuQty");
            let reciptPlantSkuQty = _.sumBy(uniqSkuIdDeliveryList, "reciptPlantSkuQty");
            let shipmentQty = _.sumBy(action.payload, "shipmentQty");
            let receiptQty = _.sumBy(action.payload, "receiptQty");

            return {
                ...state,
                cancelDeliveryList: action.payload,
                pageConfig: config.pageConfig({shipmentSkuQty: shipmentSkuQty, receiptSkuQty: reciptPlantSkuQty, shipmentQty: shipmentQty, receiptQty: receiptQty}, "CANCEL_DELIVERY"),
                shipmentSkuQty: shipmentSkuQty,
                receiptSkuQty: reciptPlantSkuQty
            };
        default:
            return state;
    }
};
