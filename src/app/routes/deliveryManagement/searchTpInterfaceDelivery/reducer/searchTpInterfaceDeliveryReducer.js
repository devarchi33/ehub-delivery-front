import React from 'react';
import console from '../../../../util/logger';
import {getTpInterfaceDelivery} from '../service';

import globalStore from 'store/configureStore';

const initialState = {
    tpInterfaceDeliveries: []
};

const SEARCH_TP_INTERFACE_DELIVERY_STOCK = "SEARCH_TP_INTERFACE_DELIVERY_STOCK";
const searchTpInterfaceDeliveryAction = (result) => ({ type: SEARCH_TP_INTERFACE_DELIVERY_STOCK, payload: result });
export const searchTpInterfaceDelivery = (brandCode, styleCode, sapDeliveryType, startDateTime, finishDateTime) => {
    return (dispatch) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        getTpInterfaceDelivery({brandCode, styleCode, sapDeliveryType, startDateTime, finishDateTime}).then(tpInterfaceDeliveries => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            let parsedDeliveries;
            for (let i = 0; i < tpInterfaceDeliveries.length; i++) {
                const commonDelivery = tpInterfaceDeliveries[i];
                const packingSKUs = commonDelivery.packingSKUs;
                const deliveries = packingSKUs.map((sku, index)=> {
                    return {
                        ...sku, ...commonDelivery,
                        key: index,
                        normalQty: sku.inspectedQty.normalQty,
                        actualProcessTime: packingSKUs[index].inspectedQty.inspectedDate.substr(0,8)
                    };
                });
                parsedDeliveries = styleCode ? deliveries.filter(delivery => delivery.skuId.indexOf(styleCode) > -1) : deliveries;
            }

            return dispatch(searchTpInterfaceDeliveryAction({parsedDeliveries}));
        });
    };
};

const SEARCH_AT_FRONTSIDE = "SEARCH_AT_FRONTSIDE";
const searchAtFrontSideAction = (result) => ({type: SEARCH_AT_FRONTSIDE, payload: result});
export const searchAtFrontSide = (tpInterfaceDeliveries, searchText, searchFieldName) => {
    const reg = new RegExp(searchText, 'gi');
    return (dispatch) => {
        const parsedDeliveries = tpInterfaceDeliveries.map((record) => {
            const match = typeof(record[searchFieldName]) === 'string' ? record[searchFieldName].match(reg) : document.getElementById('searchField').textContent.match(reg);
            if (!match) {
                return null;
            }
            record[searchFieldName] = (
                <span id='searchField'>
                        {record[searchFieldName].split(new RegExp(`(?<=${searchText})|(?=${searchText})`, 'i')).map((text, i) => (
                            text.toLowerCase() === searchText.toLowerCase() ? <span key={i} className="highlight">{text}</span> : text
                        ))}
                    </span>
            );
            return record;
        }).filter(record => !!record);
        return dispatch(searchAtFrontSideAction({parsedDeliveries}));
    }
};
export default (state = initialState, action) => {
    switch (action.type) {
        case SEARCH_TP_INTERFACE_DELIVERY_STOCK:
            console.log(">>>>>>>>>> debug searchTpInterfaceDeliveryReducer searchRawStockList", action.payload);
            return {
                ...state,
                tpInterfaceDeliveries: _.orderBy(action.payload.parsedDeliveries, ['sapInterfaceDt', 'actualProcessTime'], ['desc','desc'])
            };
        case SEARCH_AT_FRONTSIDE:
            console.log(">>>>>>>>>> debug searchTpInterfaceDeliveryReducer searchAtFrontSide", action.payload);
            return {
                ...state,
                tpInterfaceDeliveries: _.orderBy(action.payload.parsedDeliveries, ['sapInterfaceDt', 'actualProcessTime'], ['desc','desc'])
            };
        default:
            return state;
    }
}