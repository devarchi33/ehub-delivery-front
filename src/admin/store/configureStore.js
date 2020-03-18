import {createStore, combineReducers,  applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {routerReducer} from 'react-router-redux';
import {composeWithDevTools} from 'redux-devtools-extension';

import commonReducer from '../reducer/commonReducer';
import batchInfoListReducer from '../routes/batchInfoList/reducer/batchInfoListReducer';
import roleUiMenuListReducer from '../routes/roleUiMenuList/reducer/roleUiMenuListReducer';
import brandListReducer from '../routes/brandList/reducer/brandListReducer';
import cancelDeliveryRecuder from '../routes/cancelDelivery/reducer/cancelDeliveryReducer';

export const rootReducer = combineReducers(
    {
        routing: routerReducer,
        commonReducer: commonReducer,
        batchInfoListReducer: batchInfoListReducer,
        roleUiMenuListReducer: roleUiMenuListReducer,
        brandListReducer: brandListReducer,
        cancelDeliveryRecuder: cancelDeliveryRecuder
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

const globalStore = createStore(rootReducer, components);

export default globalStore;