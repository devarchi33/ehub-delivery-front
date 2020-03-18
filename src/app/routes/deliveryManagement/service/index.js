import {notification} from 'antd';
import {config} from 'config/config';
import {makeQueryParams, noticeHttpError} from 'util/httpUtil';
import console from 'util/logger';
import {DeliveryEntity, RequestEntity} from 'entities';

import globalStore from 'store/configureStore';

const BASE_URL = config.serverInfo;

//  공통 레벨의 서비스 함수
/**
 *
 * @param searchConditions  required
 * @param page              required
 * @param maxResultCount    required
 */
export const getDeliveries = (searchConditions, page, maxResultCount) => { // [수불 목록 조회 - PCWeb [API ID : D002]]
    const url = `${BASE_URL}/deliveries;type=pc-web`;
    const paramsKey = [
        "brandCode", "shipmentPlantId", "receiptPlantId", "statusCode", "waybillNo", "styleCode",
        "startDateTime", "finishDateTime", "page", "maxResultCount"
    ];
    const queryString = makeQueryParams(paramsKey, {...searchConditions, page, maxResultCount});
    const urlWithQueryString = `${url}?${queryString}`;

    return new RequestEntity("GET", urlWithQueryString, "getDeliveries").then(res => {
        noticeHttpError(res);
        return res.json();
    }).then(response => {
        response.items = response.items.filter(delivery => !(delivery.statusCode === DeliveryEntity.DELETED));
        if(searchConditions.styleCode) {
            response.items = response.items.map(delivery => {
                delivery.createdPackingBox.packingSKUs = delivery.createdPackingBox.packingSKUs
                    .filter(sku => sku.skuId.indexOf(searchConditions.styleCode) > -1);
                return delivery;
            });
        }
        const rowDeliveries = response.items;
        const totalCount = response.totalCount;
        // 수불별 상품의 총 합계
        const deliveryTotalQtys = rowDeliveries.map(delivery => {
            const deliveryEntity = new DeliveryEntity(delivery);
            const packingSKUs = deliveryEntity.getPackingSKUs();
            return packingSKUs.reduce((initVal, sku) => {
                return initVal + sku.qty;
            }, 0);
        });
        const deliveries = rowDeliveries.map((delivery, index) => {
            const deliveryEntity = new DeliveryEntity(delivery);
            return {
                ...delivery,
                key: index,
                boxNo: deliveryEntity.getBoxNo(),
                waybillNo: deliveryEntity.getWaybillNo(),
                statusCode: deliveryEntity.getStatusCode(),
                totalQty: deliveryTotalQtys[index]
            };
        });
        return { deliveries, totalCount };
    }).catch(error => {
        notification['error']({
            message: '查询失败',
            description: error.message,
            duration: null
        });
        console.error(error);
    });
};
export const searchWorkingDeliveries = (params, statusCode, maxResultCount = 10, page = 1) => {
    const searchParams = makeQueryParams(
        ['statusCode', 'createdBy', 'maxResultCount', 'page'],
        {...params, statusCode: statusCode, maxResultCount, page}
    );
    const urlWithQueryString = `${config.serverInfo}` + "/work-deliveries?" + searchParams;
    // Search for WorkDeliveryList
    return new RequestEntity("GET", urlWithQueryString, "searchWorkingDeliveries").then(res => {
        return res.json()
    });
};
export const searchWorkingDeliveriyBox = (params, statusCode, waybillNo, maxResultCount = 8, page = 1) => {
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    const searchParams = makeQueryParams(
        ['statusCode', 'createdBy', 'waybillNo', 'maxResultCount', 'page'],
        {...params, statusCode: statusCode, waybillNo, maxResultCount, page}
    );
    const urlWithQueryString = `${config.serverInfo}` + "/work-deliveries-box?" + searchParams;
    // Search for WorkDelivery Box
    return new RequestEntity("GET", urlWithQueryString, "searchWorkingDeliveries").then(res => {
        globalStore.dispatch({type: "SET_LOADING", payload: false});
        return res.json()
    });
};
export const searchWorkingTpPlantDeliveries = (params, tpDeliveryType, platformCode, maxResultCount = 10, page = 1) => {
    const searchParams = makeQueryParams(
        ['tpDeliveryType', 'platformCode', 'createdBy', 'maxResultCount', 'page'],
        {...params, tpDeliveryType: tpDeliveryType, platformCode: platformCode, maxResultCount, page}
    );
    const urlWithQueryString = `${config.serverInfo}` + "/work-tp-plant-deliveries?" + searchParams;
    // Search for WorkTpPlantDeliveryList
    return new RequestEntity("GET", urlWithQueryString, "searchWorkingTpPlantDeliveries").then(res => {
        return res.json()
    });
};
