import console from '../../../../util/logger';
import {getCompareStock} from '../service/index';

import globalStore from 'store/configureStore';

const initialState = {
    rawEHubStocks: [],
    rawTpStocks: [],
    compareStocks: []
};

const CLEAR_STOCKS = "CLEAR_STOCKS";
const clearStocksAction = () => ({type: CLEAR_STOCKS});
export const clearStocks = () => {
    return (dispatch) => {
        return dispatch(clearStocksAction());
    }
};

const SEARCH_COMPARE_STOCK = "SEARCH_COMPARE_STOCK";
const searchCompareStockAction = (result) => ({ type: SEARCH_COMPARE_STOCK, payload: result });
export const searchCompareStock = (brandCode, plantId, productId, searchType) => {
    return (dispatch) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        getCompareStock(brandCode, plantId, productId).then(res =>{
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            const rawEHubStocks = res.eHubStocks.map(stock => {
                return {
                    ehubPlantId: stock.plantId,
                    styleCode: stock.styleCode,
                    skuId: stock.skuId,
                    compareId: stock.compareId,
                    availableQty: stock.availableQty
                }
            });
            const rawTpStocks = res.tpStocks.map(stock => {
                return {
                    closingDt: stock.closingDt,
                    tpPlantId: stock.plantId,
                    styleCode: stock.styleCode,
                    skuId: stock.skuId,
                    compareId: stock.compareId,
                    availableQty: stock.availableQty
                }
            });

            let compareStocks;
            switch (searchType) {
                case "common":
                    const tpStocks = _.intersectionBy(rawTpStocks, rawEHubStocks, 'compareId');
                    compareStocks = _.intersectionBy(rawEHubStocks, rawTpStocks, 'compareId').map(stock => {
                        const tpAvailableQty = _.find(tpStocks, (tpStock) => {
                            return stock.compareId === tpStock.compareId;
                        }).availableQty;
                        const isMoreThanTp = stock.availableQty > tpAvailableQty;
                        const isLessThanTp = stock.availableQty < tpAvailableQty;
                        return { ...stock, isMoreThanTp, isLessThanTp, tpAvailableQty, differenceQty : stock.availableQty - tpAvailableQty };
                    });
                    break;
                case "onlyEhub":
                    compareStocks = _.differenceBy(rawEHubStocks, rawTpStocks, "compareId");
                    break;
                case "onlyTp":
                    compareStocks = _.differenceBy(rawTpStocks, rawEHubStocks, "compareId");
                    break;
                case "rawTp":
                    compareStocks = rawTpStocks;
                    break;
            }
            return dispatch(searchCompareStockAction({rawEHubStocks, rawTpStocks, compareStocks}));
        });
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case CLEAR_STOCKS:
            console.log(">>>>>>>>>> debug compareStockReducer clearStocks", action.payload);
            return initialState;
        case SEARCH_COMPARE_STOCK:
            console.log(">>>>>>>>>> debug compareStockReducer searchRawStockList", action.payload);
            return {
                ...state,
                rawEHubStocks: action.payload.rawEHubStocks,
                rawTpStocks: action.payload.rawTpStocks,
                compareStocks: action.payload.compareStocks
            };
        default:
            return state;
    }
}