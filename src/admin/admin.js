import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import {HashRouter, Route, Switch} from 'react-router-dom';

import store from './store/configureStore';

import EHubDeliveryAdminLayout from 'routes/layout/eHubDeliveryAdminLayout';

ReactDOM.render((
    <Provider store={store}>
        <HashRouter>
            <Switch>
                <Route path="/admin" component={EHubDeliveryAdminLayout}/>
            </Switch>
        </HashRouter>
    </Provider>
), document.getElementById('admin'));