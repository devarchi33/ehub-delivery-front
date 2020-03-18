import {applyMiddleware, combineReducers, createStore} from 'redux';
import thunk from 'redux-thunk';
import {routerReducer} from 'react-router-redux';
import {composeWithDevTools} from 'redux-devtools-extension';

import commonReducer from 'reducer/commonReducer';
import {issuedDeliveryListReducer} from '../routes/deliveryManagement/issuedManagement/reducer';
import {receiptDeliveryListReducer} from '../routes/deliveryManagement/receiptManagement/reducer';
import compareStockReducer from '../routes/stockManagement/compareStock/reducer/compareStockReducer';
import searchTpInterfaceDeliveryReducer
    from '../routes/deliveryManagement/searchTpInterfaceDelivery/reducer/searchTpInterfaceDeliveryReducer';
import searchTpOriginalDeliveryReducer
    from '../routes/deliveryManagement/searchTpOriginalDelivery/reducer/searchTpOriginalDeliveryReducer';
import searchTpPlantDeliveryReducer
    from '../routes/productManagement/searchTPOutOfStockHeader/reducer/searchTpPlantDeliveryReducer';
import searchTpPlantDeliveryInvalidReducer
    from '../routes/productManagement/tpEhubProductMapping/reducer/searchTpPlantDeliveryReducer';
import uploadManagementReducer from '../routes/deliveryManagement/uploadManagement/reducer/uploadMnagementReducer';
import adjustmentStockReducer from '../routes/stockManagement/adjumentStockQuery/reducer/adjumentStockQueryReducer';
import batchInfoListReducer from '../routes/deliveryManagement/batchInfoList/reducer/batchInfoListReducer';

export const rootReducer = combineReducers(
    {
        routing: routerReducer,
        commonReducer: commonReducer,
        issuedDeliveryList: issuedDeliveryListReducer,
        receiptDeliveryList: receiptDeliveryListReducer,
        compareStock: compareStockReducer,
        searchTpInterfaceDelivery: searchTpInterfaceDeliveryReducer,
        searchTpOriginalDeliveryReducer: searchTpOriginalDeliveryReducer,
        searchTpPlantDelivery: searchTpPlantDeliveryReducer,
        searchTpPlantDeliveryInvalidProductCd: searchTpPlantDeliveryInvalidReducer,
        uploadManagementReducer: uploadManagementReducer,
        adjustmentStockInfo: adjustmentStockReducer,
        batchInfoListReducer: batchInfoListReducer
    }
);

const components = process.env.NODE_ENV === 'production' ?
    applyMiddleware(
        thunk
    ) :
    composeWithDevTools(
        applyMiddleware(
            thunk
        )
    );

const store =  createStore(rootReducer, components);

export default store;