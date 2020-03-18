import console from '../../../../util/logger';
import {getTpPlantDelivery} from '../service';
import TpProductEntity from '../entity/TpProductEntity';
import globalStore from 'store/configureStore';

const initialState = {
    tpPlantDeliveries: []
};

const REST_UI_STATE = "REST_UI_STATE";
const resetUiStateAction = () => ({type: REST_UI_STATE});
export const resetUiState = (visible) => {
    return (dispatch) => {
        return dispatch(resetUiStateAction(visible));
    };
};

const SEARCH_TP_PLANT_DELIVERY_STOCK = "SEARCH_TP_PLANT_DELIVERY_STOCK";
const searchTpPlantDeliveryAction = (result) => ({type: SEARCH_TP_PLANT_DELIVERY_STOCK, payload: result});
export const searchTpPlantDelivery = (brandCode, errorType, closingDate) => {
    return (dispatch) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        const ttComplexBrand = ['TT','TZ','TN', 'T0'];
        const brandCodeValue = ttComplexBrand.indexOf(brandCode) > -1 ? 'TT' : brandCode;
        getTpPlantDelivery({brandCode: brandCodeValue, errorType, closingDate}).then(tpPlantDeliveries => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            const orderByClosingDtTpPlantDeliveries = _.orderBy(tpPlantDeliveries, ['closingDate'], 'asc');
            const tpPlantDeliveryGroupByProductId = errorType === TpProductEntity.OUT_OF_STOCK ?
                _.groupBy(orderByClosingDtTpPlantDeliveries, (record) => {
                    return record.productId + '&' + record.closingDate;
                })
                : _.groupBy(orderByClosingDtTpPlantDeliveries, 'productId');
            return dispatch(searchTpPlantDeliveryAction({
                parsedDeliveries: Object.keys(tpPlantDeliveryGroupByProductId).map((productId, index) => {
                    const commonTpPlantDelivery = tpPlantDeliveryGroupByProductId[productId][0];
                    return {
                        key: index,
                        sumQty: tpPlantDeliveryGroupByProductId[productId].reduce((initialValue, record) => {
                            return initialValue + record.qty;
                        }, 0),
                        ...commonTpPlantDelivery
                    }
                })
            }));
        });
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_TP_PLANT_DELIVERY_STOCK:
            console.log(">>>>>>>>>> debug searchTpPlantDeliveryReducer searchTpPlant", action.payload);
            return {
                ...state,
                tpPlantDeliveries: action.payload.parsedDeliveries
            };
        case REST_UI_STATE:
            return initialState; 
        default:
            return state;
    }
}