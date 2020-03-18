import React from 'react';
import {config} from 'config/config';
import {eHubException} from 'exception';
import {notification} from "antd/lib/index";

export default class RequestEntity {
    constructor(requestType, url, name, body) {
        let headers = {'Content-Type': 'application/json'};
        if(url !== config.serverToken) {
            headers = {...headers, Authorization: 'Bearer ' + window.Cookies.get(config.colleagueTokenKey)}
        }
        const isMultipartRequest = name === 'MULTIPART_FORM_REQUEST';
        const options = {
            method: requestType,
            headers: headers,
            body: isMultipartRequest ? body : JSON.stringify(body)
        };

        // https://stanko.github.io/uploading-files-using-fetch-multipart-form-data/
        if (isMultipartRequest) delete options.headers['Content-Type'];
        return fetch(url, options).then(res => {
            if(res.status === 504) {
                throw eHubException("Internal Server Error", "RequestEntity");
            }
            if(res.status === 401) {
                notification['warning']({
                    message: '登录过期，请重新登录。',
                    duration: null
                });
                window.location.href = "#/auth/login";
            }
            return res;
        });
    }
}