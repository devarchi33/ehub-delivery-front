import { message } from 'antd';
import console from './logger';

export const noticeHttpError = (response) => {
    const httpStatus = response.status.toString();
    if(httpStatus.startsWith("4") || httpStatus.startsWith("5")) {
        message.error(response.statusText, 2);
        console.error(response);
    }
};
export const makeQueryParams = (targetKeys, obj) => {
    return Object.keys(obj).filter((k) => targetKeys.includes(k)).map((k) => {
        return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k]);
    }).join('&');
};