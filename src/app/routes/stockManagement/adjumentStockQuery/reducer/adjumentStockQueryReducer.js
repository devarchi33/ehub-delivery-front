import console from 'util/logger';

import globalStore from 'store/configureStore';

import {getAdjustmentStockInfo} from '../service/index';

const initialState = {
    adjustmentStockInfo: [],
    totalCount: 0
};

const CLEAR_STOCKSINFO = "CLEAR_STOCKSINFO";
const clearStocksAction = () => ({type: CLEAR_STOCKSINFO});
export const clearStocksInfo = () => {
    return (dispatch) => {
        return dispatch(clearStocksAction());
    }
};

const LOAD_ADJUSTMENTSTOCKINFO = "LOAD_ADJUSTMENTSTOCKINFO";
const loadAdjustmentStockAction = (adjustmentStockInfo) => ({type: LOAD_ADJUSTMENTSTOCKINFO, payload: adjustmentStockInfo});
export const loadAdjustmentStock = (brandCode, plantId, skuId, page, maxResultCount) => {
    return (dispatch) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        getAdjustmentStockInfo(brandCode, plantId, skuId, page, maxResultCount).then(response => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            return dispatch(loadAdjustmentStockAction(response));
        });
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_STOCKSINFO:
            console.log(">>>>>>>>>> debug adjustmentStockInfoReducer resetStockInfo");
            return initialState;
        case LOAD_ADJUSTMENTSTOCKINFO:
            console.log(">>>>>>>>>> action.payload", action.payload);
            return {
                ...state,
                adjustmentStockInfo: action.payload.items,
                totalCount: action.payload.totalCount
            };
        default:
            return state;
    }
}