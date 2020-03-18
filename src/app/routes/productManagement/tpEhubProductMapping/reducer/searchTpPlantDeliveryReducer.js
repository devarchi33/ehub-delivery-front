import console from '../../../../util/logger';
import {getTpPlantDelivery} from '../service';
import globalStore from 'store/configureStore';

const initialState = {
    tpPlantDeliveries: []
};

const SEARCH_TP_PLANT_DELIVERY = "SEARCH_TP_PLANT_DELIVERY";
const searchTpPlantDeliveryAction = (result) => ({type: SEARCH_TP_PLANT_DELIVERY, payload: result});
export const searchTpPlantDelivery = (brandCode, productCd) => {
    return (dispatch) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        getTpPlantDelivery({brandCode: brandCode, productCd: productCd}).then(tpPlantDeliveries => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            const tpPlantDeliveryGroupByProductId = _.groupBy(tpPlantDeliveries, "productId");
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
        case SEARCH_TP_PLANT_DELIVERY:
            console.log(">>>>>>>>>> debug searchTpPlantDeliveryReducer searchTpPlant", action.payload);
            return {
                ...state,
                tpPlantDeliveries: action.payload.parsedDeliveries
            };
        default:
            return state;
    }
}