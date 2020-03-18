import React from 'react';
import { notification } from 'antd';

export default class EHubDeliveryUtil {
    static daysAgo = (day, format) => window.moment(window.moment().subtract(day, 'days'), format);
    static getModifiedTime = (time) => window.moment(time, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss');
    static mindate = "19700101";
    static orderByDateDesc = (list, dateField) => window._.orderBy(list, [dateField], ['desc']);
    static existUploadFileCheck = (file) => {
        if(file.length === 0) {
            notification['warning']({
                message: '请先上传excel文件'
            });
            return false;
        }
        return true;
    };
    static existConfirmKeys = (confirmKeys) => {
        if(confirmKeys.length === 0) {
            notification['warning']({
                message: '请先勾选需要上传的数据'
            });
            return false;
        }
        return true;
    };
};