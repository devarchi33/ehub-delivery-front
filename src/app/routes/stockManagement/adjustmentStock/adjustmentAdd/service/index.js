import React from 'react';
import { notification } from 'antd';
import { config } from 'config/config';
import { RequestEntity } from "entities";
import console from 'util/logger';
import {AdjustmentError} from "../../validator/AdjustmentError";

const BASE_URL = config.serverInfo;

export const addAdjustment = ( adjustmentList, ref ) => {
    let url =`${BASE_URL}/stocks`;
    // 플랜트 재고 조정 [API ID : S003]
    return new RequestEntity("PUT", url, "plantStockAdjustmentList", adjustmentList)
        .then(res => res.json())
        .then(res => {
            if(res.code === "100") {
                ref.setState({ loading: false });
                notification['warning']({
                    message: '调整失败',
                    description: AdjustmentError.getErrorMessage(res),
                    duration: null
                });
                return true;
            }
            return false;
        }).catch(err => {
            ref.setState({ loading: false }, () => {
                notification['error']({
                    message: '调整失败',
                    description: err,
                    duration: null
                });
                ref.setStockList([]);
            });
        });
};