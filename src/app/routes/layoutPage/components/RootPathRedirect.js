import React from 'react';
import { config } from 'config/config';

export default class RootPathRedirect extends React.Component {
    componentDidMount() {
        sessionStorage.getItem(config.isAuthKey) ?
            window.location.href = "#/app/issuedManagement" : window.location.href = "#/auth/login";
    }
    render() {
        return <div>aaa</div>;
    };
}