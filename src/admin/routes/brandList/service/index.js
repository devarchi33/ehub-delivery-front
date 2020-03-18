import React from 'react';
import {notification} from 'antd';

import {RequestEntity} from '../../../../app/entities';
import globalStore from '../../../store/configureStore';
import {config} from '../../../../app/config/config';

const BASE_URL = config.serverInfo;

const BrandRequestEntity = (method, url, name, param) => {
    return new RequestEntity(method, url, name, param).then(res => {
        if (res.status !== 200) {
            return res.json();
        } else {
            return res;
        }
    }).then(res => {
        globalStore.dispatch({type: "REST_UI_STATE"});
        if (res.status === 400) {
            notification['warning']({
                message: res.message,
                description: JSON.stringify(res.errors),
                duration: null
            });
            return null;
        }
        if (res.status === 500) {
            notification['error']({
                message: res.exception,
                description: res.message,
                duration: null
            });
            return null;
        }
        if (res.status === 200 && method !== "GET") {
            getBrandList().then(brandList => globalStore.dispatch({type: "LOAD_BRAND_LIST", payload: brandList}));
        } else if (res.status === 200 && method === "GET") {
            return res.json();
        } else {
            notification['error']({
                message: 'Contact Developer',
                duration: null
            });
            return null;
        }
    });
};

export const getBrandList = () => {
    const URL = BASE_URL.split('api')[0];
    return BrandRequestEntity("GET", `${URL}brandList?size=100`, "getBrandList");
};

export const insertBrand = (creatingBrand) => {
    return BrandRequestEntity("PUT", `${BASE_URL}/brandList`, "insertBrand", creatingBrand);
};

export const updateBrand = (creatingBrand) => {
    return BrandRequestEntity("POST", `${BASE_URL}/brandList`, "updateBrand", creatingBrand);
};