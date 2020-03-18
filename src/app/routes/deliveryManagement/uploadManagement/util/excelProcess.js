import React from 'react'
import {notification} from 'antd';
import * as XLSX from 'xlsx';

import {config} from '../../../../config/config.js';
import UserInfoEntity from '../../../../entities/UserInfoEntity';
import {UploadError} from '../validator/UploadError';

import globalStore from 'store/configureStore';
import {searchWorkingDeliveries, searchWorkingTpPlantDeliveries} from '../../service';
import {deleteEmailAttachFileByFileName} from '../../searchTpOriginalDelivery/service';

const BASE_URL = config.serverInfo;

const handleExcelFileByHTML5 = (file, callback) => {
    // html5 api
    const reader = new FileReader();
    // excel file read event trigger
    reader.readAsBinaryString(file);
    // file load event handler
    reader.onload = callback;
    // file read error handler
    reader.onerror = function (ex) {
        console.log(ex);
        return ex;
    };
};

const extractDataFromExcelFile = (e) => {
    const data = e.target.result;
    const workbook = XLSX.read(data, {type: 'binary'});
    // excelToJsonResult data structure ==> file[ sheet[ row{...} ]  ]
    const excelToJsonResult = workbook.SheetNames.map(sheetName => {
        return XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
    });
    // sheet extract
    return excelToJsonResult[0];
};

export class ExcelProcess {
    static getCommonExcelProps = (urlWithQueryString) => {
        return {
            name: 'file',
            action: BASE_URL + urlWithQueryString,
            accept: '.xlsx',
            showUploadList: false,
        };
    };
    static compareTpPlantDeliveryStatistics = (file) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        handleExcelFileByHTML5(file, (e) => {
            const sheet = extractDataFromExcelFile(e);
            const parsedSheet = sheet.map(item => {
                return {
                    brandCode: item['品牌'] ? item['品牌'].trim().toUpperCase() : "",
                    tmallOrTotalSumQtyTp: item['天猫入库 - TP'] ? item['天猫入库 - TP'].trim() : "0",
                    tmallOsTotalSumQtyTp: item['天猫出库 - TP'] ? item['天猫出库 - TP'].trim() : "0",
                    vipOrTotalSumQtyTp: item['唯品会入库 - TP'] ? item['唯品会入库 - TP'].trim() : "0",
                    vipOsTotalSumQtyTp: item['唯品会出库 - TP'] ? item['唯品会出库 - TP'].trim() : "0",
                    jdOrTotalSumQtyTp: item['京东入库 - TP'] ? item['京东入库 - TP'].trim() : "0",
                    jdOsTotalSumQtyTp: item['京东出库 - TP'] ? item['京东出库 - TP'].trim() : "0",
                    youzanOrTotalSumQtyTp: item['有赞入库 - TP'] ? item['有赞入库 - TP'].trim() : "0",
                    youzanOsTotalSumQtyTp: item['有赞出库 - TP'] ? item['有赞出库 - TP'].trim() : "0",
                    aikucunOrTotalSumQtyTp: item['爱库存入库 - TP'] ? item['爱库存入库 - TP'].trim() : "0",
                    aikucunOsTotalSumQtyTp: item['爱库存出库 - TP'] ? item['爱库存出库 - TP'].trim() : "0",
                    externalOsTotalSumQtyTp: item['外部平台出库 - TP'] ? item['外部平台出库 - TP'].trim() : "0",
                };
            });
            const groupByEhubList = _.groupBy(globalStore.getState().searchTpOriginalDeliveryReducer.statisticsTpPlantDeliveryList, "brandCode");
            const groupByTpList = _.groupBy(parsedSheet, "brandCode");
            //页面的品牌多余excel的品牌
            let diffEhubMoreBrandList = _.difference(Object.keys(groupByEhubList), Object.keys(groupByTpList));
            //页面的品牌少余excel的品牌
            let diffTpMoreBrandList = _.difference(Object.keys(groupByTpList), Object.keys(groupByEhubList));

            if (diffEhubMoreBrandList.length > 0) {
                for(let i=0; i<diffEhubMoreBrandList.length; i++){
                    groupByTpList[diffEhubMoreBrandList[i]] = [{brandCode: diffEhubMoreBrandList[i], tmallOrTotalSumQtyTp:0, tmallOsTotalSumQtyTp:0, vipOrTotalSumQtyTp:0, vipOsTotalSumQtyTp:0, jdOrTotalSumQtyTp:0, jdOsTotalSumQtyTp:0, youzanOrTotalSumQtyTp: 0, youzanOsTotalSumQtyTp: 0, aikucunOrTotalSumQtyTp: 0, aikucunOsTotalSumQtyTp: 0, externalOsTotalSumQtyTp: 0}];
                }
            }
            if (diffTpMoreBrandList.length > 0) {
                for(let i=0; i<diffTpMoreBrandList.length; i++){
                    groupByEhubList[diffTpMoreBrandList[i]] = [{brandCode:diffTpMoreBrandList[i], tmallOrSuccessSumQty:0, tmallOrTotalSumQty:0, tmallOsSuccessSumQty:0, tmallOsSuccessSumQty:0, vipOrSuccessSumQty: 0, vipOrTotalSumQty: 0, vipOsSuccessSumQty: 0, vipOsTotalSumQty: 0, jdOrSuccessSumQty: 0, jdOrTotalSumQty: 0, jdOsSuccessSumQty: 0, jdOsTotalSumQty: 0,youzanOrSuccessSumQty: 0, youzanOrTotalSumQty: 0, youzanOsSuccessSumQty: 0, youzanOsTotalSumQty: 0, aikucunOrSuccessSumQty: 0, aikucunOrTotalSumQty: 0, aikucunOsSuccessSumQty: 0, aikucunOsTotalSumQty: 0}];    
                }
            }
            const compareDataList = Object.keys(groupByEhubList).map(brandCode => {
                const ehub = groupByEhubList[brandCode][0];
                const tp = groupByTpList[brandCode][0];
                return {
                    brandCode: brandCode,
                    tmallOsTotalSumQtyEhub: ehub['tmallOsTotalSumQty'],
                    tmallOsTotalSumQtyTp: tp['tmallOsTotalSumQtyTp'],
                    tmallOrTotalSumQtyEhub: ehub['tmallOrTotalSumQty'],
                    tmallOrTotalSumQtyTp: tp['tmallOrTotalSumQtyTp'],
                    vipOsTotalSumQtyEhub: ehub['vipOsTotalSumQty'],
                    vipOsTotalSumQtyTp: tp['vipOsTotalSumQtyTp'],
                    vipOrTotalSumQtyEhub: ehub['vipOrTotalSumQty'],
                    vipOrTotalSumQtyTp: tp['vipOrTotalSumQtyTp'],
                    jdOsTotalSumQtyEhub: ehub['jdOsTotalSumQty'],
                    jdOsTotalSumQtyTp: tp['jdOsTotalSumQtyTp'],
                    jdOrTotalSumQtyEhub: ehub['jdOrTotalSumQty'],
                    jdOrTotalSumQtyTp: tp['jdOrTotalSumQtyTp'],
                    youzanOrTotalSumQtyEhub: ehub['youzanOrTotalSumQty'],
                    youzanOrTotalSumQtyTp: tp['youzanOrTotalSumQtyTp'],
                    youzanOsTotalSumQtyEhub: ehub['youzanOsTotalSumQty'],
                    youzanOsTotalSumQtyTp: tp['youzanOsTotalSumQtyTp'],
                    aikucunOsTotalSumQtyEhub: ehub['aikucunOsTotalSumQty'],
                    aikucunOsTotalSumQtyTp: tp['aikucunOsTotalSumQtyTp'],
                    aikucunOrTotalSumQtyEhub: ehub['aikucunOrTotalSumQty'],
                    aikucunOrTotalSumQtyTp: tp['aikucunOrTotalSumQtyTp'],
                    externalOsTotalSumQtyEhub: ehub['externalOsTotalSumQty'],
                    externalOsTotalSumQtyTp: tp['externalOsTotalSumQtyTp'],
                };
            });
            globalStore.dispatch({
                type: "SET_STATISTICS_COMPARE_LIST", payload: compareDataList.map((data, index) => {
                    return {...data, key: index};
                })
            });
        });
        globalStore.dispatch({type: "SET_LOADING", payload: false});
        return false;
    };
    static uploadStatusTracer = (file, type, platformCode) => {
        if (type === 'REMOVE_ATTACH_FILE') {
            deleteEmailAttachFileByFileName(file);
        }

        const uploadSuccess = (msg) => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            notification['success']({
                message: msg
            });
        };

        if(file.status === 'done') {
            if (type === 'MODIFY_PRODUCT_CODES') {
                uploadSuccess('修改成功');
            } else if (type === 'OS' || type === 'OR' || type === 'EV') {
                searchWorkingTpPlantDeliveries({createdBy: UserInfoEntity.getUserName()}, type, platformCode).then(response => {
                    globalStore.dispatch({type: "LOAD_WORK_TP_PLANT_DELIVERIES", payload: response});
                    uploadSuccess('上传成功');

                });
            } else {
                searchWorkingDeliveries({createdBy: UserInfoEntity.getUserName()}, type).then(response => {
                    globalStore.dispatch({type: "LOAD_WORKDELIVERIES", payload: response});
                    uploadSuccess('上传成功');
                });
            }
        }
        if(file.status === 'error') {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            if(file.response.status === 500) {
                notification['error']({
                    message: '上传失败',
                    description: file.response.message,
                    duration: null
                });
            }
            if(file.error.status === 400) {
                notification['warning']({
                    message: '上传失败',
                    description: UploadError.getErrorMessage(file.response),
                    duration: null
                });
            }
        }
    };
}