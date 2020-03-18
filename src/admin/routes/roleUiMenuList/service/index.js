import React from 'react';
import {notification} from 'antd';

import {RequestEntity} from '../../../../app/entities';
import globalStore from '../../../store/configureStore';
import {config} from '../../../../app/config/config';

const BASE_URL = config.serverInfo;

const UiMenuRequestEntity = (method, url, name, param) => {
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
            getRoleUiMenuList().then(roleUiMenus => globalStore.dispatch({type: "LOAD_ROLE_UI_MENU_LIST", payload: roleUiMenus}));
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

export const getRoleUiMenuList = () => {
    return UiMenuRequestEntity("GET", `${BASE_URL}/roleUiMenuList?page=1&maxResultCount=100`, "getRoleUiMenuList");
};

export const updateRoleUiMenu = (createdRoleUiMenu) => {
    return UiMenuRequestEntity("POST", `${BASE_URL}/roleUiMenuList`, "updateRoleUiMenu", createdRoleUiMenu);
};

export const insertRoleUiMenu = (createdRoleUiMenu) => {
    return UiMenuRequestEntity("PUT", `${BASE_URL}/roleUiMenuList`, "insertRoleUiMenu", createdRoleUiMenu);
};

export const deleteRoleUiMenu = (key) => {
    return UiMenuRequestEntity("DELETE", `${BASE_URL}/roleUiMenuList?name=${key.name}&parentNode=${key.parentNode}&level=${key.level}`, "insertRoleUiMenu");
};