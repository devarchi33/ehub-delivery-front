import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { syncHistoryWithStore } from 'react-router-redux';
import { HashRouter, Route, Switch } from 'react-router-dom';
import { LocaleProvider } from 'antd';



import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import store from './store/configureStore';

import Login from 'routes/auth/containers/Login';
import ChangePassword from 'routes/auth/containers/ChangePassword';
import eHubDeliveryLayout from 'routes/layoutPage/components/eHubDeliveryLayout';
import RootPathRedirect from 'routes/layoutPage/components/RootPathRedirect';

var fundebug = require("fundebug-javascript");
fundebug.apikey = "3fd83728f88e001428d914d144b92b3607e7e8ba419dfb36ee614d2c9a4f7ae6";
require("fundebug-revideo");

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    componentDidCatch(error, info) {
        this.setState({ hasError: true });
        // 将component中的报错发送到Fundebug
        fundebug.notifyError(error, {
            metaData: {
                info: info
            }
        });
    }

    render() {
        if (this.state.hasError) {
            return null;
            // Note: 也可以在出错的component处展示出错信息，返回自定义的结果。
        }
        return this.props.children;
    }
}

ReactDOM.render((
    <ErrorBoundary>
        <LocaleProvider locale={zhCN}>
            <Provider store={store}>
                <HashRouter>
                    <Switch>
                        <Route exact path="/" component={RootPathRedirect}/>
                        <Route path="/auth/login" component={Login}/>
                        <Route path="/auth/changePassword" component={ChangePassword}/>
                        <Route path="/app" component={eHubDeliveryLayout}/>
                    </Switch>
                </HashRouter>
            </Provider>
        </LocaleProvider>
    </ErrorBoundary>
), document.getElementById('root'));
