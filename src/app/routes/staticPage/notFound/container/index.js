import React from 'react';

import 'ant-design-pro/dist/ant-design-pro.css';
import {config} from "../../../../config/config";

export default class notFound extends React.Component {
    render() {
        const pageList = JSON.parse(sessionStorage.getItem(config.layoutInfo)).Pages.map(menu => menu.page);
        const currentUrl = location.hash.split("#/")[1].split("?")[0];
        return (
            <div>{pageList.indexOf(currentUrl) < 0 ? <h1 style={{textAlign:"center"}}>页面找不到，请联系管理员！</h1> : ''}</div>
        );
    }
}