import { config } from 'config/config';
import {makeQueryParams} from "../../../../util/httpUtil";
import {DeliveryEntity, RequestEntity} from "../../../../entities";

const BASE_URL = config.serverInfo;

export const getTpInterfaceDelivery = (searchConditions) => {
    const url = `${BASE_URL}/deliveries;type=pc-web`;
    const paramsKey = [
        "brandCode", "sapDeliveryType", "styleCode", "startDateTime", "finishDateTime", "page", "maxResultCount"
    ];
    let queryString;
    if(searchConditions['styleCode']) {
        queryString = makeQueryParams(paramsKey, {...searchConditions, page: 1, maxResultCount: 100});
    } else {
        queryString = makeQueryParams(paramsKey, {
            brandCode : searchConditions['brandCode'],
            sapDeliveryType: searchConditions['sapDeliveryType'],
            startDateTime: searchConditions['startDateTime'], finishDateTime: searchConditions['finishDateTime'],
            page: 1, maxResultCount: 100});
    }

    const urlWithQueryString = `${url}?${queryString}`;
    return new RequestEntity("GET", urlWithQueryString, "searchTpInterfaceDelivery").then(res => res.json())
        .then(response => {
            const rowDeliveries = response.items;
            // 수불별 상품의 총 합계
            const deliveryTotalQtys = rowDeliveries.map(delivery => {
                const deliveryEntity = new DeliveryEntity(delivery);
                const packingSKUs = deliveryEntity.getPackingSKUs();
                return packingSKUs.reduce((initVal, sku) => {
                    return initVal + sku.qty;
                }, 0);
            });
            let mergedPackingSKUs = [];
            for (let i = 0; i < rowDeliveries.length; i++) {
                mergedPackingSKUs.push(rowDeliveries[i].createdPackingBox.packingSKUs)
            }
            const deliveries = rowDeliveries.map((delivery, index) => {
                const deliveryEntity = new DeliveryEntity(delivery);
                return {
                    ...delivery,
                    key: index,
                    sapDeliveryType: searchConditions['sapDeliveryType'],
                    brandCode: deliveryEntity.getDeliveryBrandCode(),
                    boxNo: deliveryEntity.getBoxNo(),
                    waybillNo: deliveryEntity.getWaybillNo(),
                    statusCode: deliveryEntity.getStatusCode(),
                    totalQty: deliveryTotalQtys[index],
                    packingSKUs: _.flatten(mergedPackingSKUs)
                };
            });
            return deliveries;
        });
};