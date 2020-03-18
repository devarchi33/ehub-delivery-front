import React from 'react';
import jwtDecoder from 'jwt-decode';

const MODE = process.env.NODE_ENV;

const choiceServerByEnv = (localServer) => {
    if ("fundebug" in window) {
        // fundebug.appversion = "3.0.58";
        fundebug.releasestage = MODE;
        fundebug.httpTimeout = 10000;
        //不需要收集开发环境中的错误
        // fundebug.silentDev = true;
        //不需要监控资源加载错误
        fundebug.silentResource = true;
        //需要录屏功能
        fundebug.silentVideo = false;
        //记录用户行为
        fundebug.silentBehavior = false;
    }
    if(MODE === "development" || MODE === "staging") {
        return localServer
    } else if (MODE === "qa") {
        return localServer
    } else {
        return localServer
    }
};

// api version
const EHUB_API_VERSION = 'api/v1';

// ehub api server
const LOCAL_SERVER = `http://localhost:8081/${EHUB_API_VERSION}`;
const serverInfo = choiceServerByEnv(LOCAL_SERVER);


let TENANT;
let PROD_TENANT;
try {
    TENANT = jwtDecoder(JSON.parse(sessionStorage.getItem('USER_INFO'))['token']).tenantCode;
    PROD_TENANT = jwtDecoder(JSON.parse(sessionStorage.getItem('USER_INFO'))['token']).tenantCode;
} catch (exception) {
    TENANT = 'beijingeland';
    PROD_TENANT = 'eland';
}
const APP_CODE = 'EhubDelivery';

// After login, get token

// After send token, get userInfo

// Change password

class eHubDeliveryConfig {
    static colleagueTokenKey = "COLLEAGUE_TOKEN";
    static isAuthKey = "IS_AUTHENTICATED";
    static userInfoKey = "USER_INFO";
    static serverInfo = serverInfo;
    static serverToken = serverToken;
    static serverUserInfo = serverUserInfo;
    static serverPassword = serverPassword;
    static layoutInfo = "layoutInfo";
    static tempStorage = "tempStorage";
    static pageConfig = (pageInfo, type) => {
        const defaultPageConfig = {
            total: pageInfo.total,
            pageSize: pageInfo.pageSize,
            showTotal: (total, range) => {
                if (type === "SHIPMENT"){
                    return <span><b>{"共:" + total + "行, 出库总数量：" + pageInfo.totalSumCount + "件"}</b></span>
                } else if (type === "RECEIPT"){
                    return <span><b>{"共: " + total + "行, 入库总数: " + pageInfo.totalSumCount + "件"}</b></span>
                } else if (type === "REGISTRATION") {
                    return <span><b>{"共: " + total + "行," + "出库: " + pageInfo.totalSumCount + "件, 入库: " + pageInfo.totalSumCount + "件"}</b></span>
                } else if (type === "TP_PLANT_DELIVERY") {
                    return <span><b>{"共: " + total + "行, " + "数量: " + _.sumBy(pageInfo.originalTpPlantDeliveryList, 'qty') + "件"}</b></span>
                } else if (type === "CANCEL_DELIVERY"){
                    return <span><b>{"出/入库存总和: " + pageInfo.shipmentSkuQty.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')+"件, " + pageInfo.receiptSkuQty.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + "件, 出/入库交易数量：" + pageInfo.shipmentQty.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + "件, " + pageInfo.receiptQty.toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,') + "件"}</b></span>
                } else if (pageInfo.issueDataCount !== undefined){
                    return <span><b>{"共:" + total + "行, 出库总数量：" + pageInfo.issueDataCount + "件"}</b></span>
                } else if (pageInfo.receiptConfirmNum !== undefined && pageInfo.totalCount !== undefined){
                    return <span><b>{"共: " + total + "行," + "入库预数量: " + pageInfo.totalCount+"件, 入库确定总数: " + pageInfo.receiptConfirmNum + "件"}</b></span>
                } else if (pageInfo.totalSumCount !== undefined){
                    return <span><b>{"共: " + total + "行," + "数量: " + pageInfo.totalSumCount+"件"}</b></span>
                } else {
                    return <span><b>{"共: " + total + "行"}</b></span>
                }
            }
        };
        return (type === "SHIPMENT" || type === "RECEIPT" || type === "REGISTRATION" || type === "OS" || type === 'OR' || type === 'EV')
            ? {...defaultPageConfig, onChange: pageInfo.pageOnChange} : defaultPageConfig;
    };
    static tableStyle = (styleCode) => {
        switch (styleCode) {
            case "Excel": return {
                // scroll: { y: 600 },
                size: 'small',
            };
            case "SubExcel": return {
                scroll: { y: 400 },
                size: 'small',
            };
            default : return {
                scroll: { y: 600 },
                size: 'middle',
            };
        }
    };
}

export const config = eHubDeliveryConfig;
