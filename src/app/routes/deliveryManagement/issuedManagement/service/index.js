import React from 'react';
import { Select } from 'antd';
const Option = Select.Option;

import { DeliveryEntity } from 'entities';
import { findValueFromList } from 'util/listHelper';
import { getDeliveries, noti } from '../../service';

/**
 *
 * @param searchConditions  required
 * @param page              required
 * @param maxResultCount    required
 */
export const getIssueDeliveries = (searchConditions, page, maxResultCount) => {
    // 출고조회를 할때에 shipmentPlantId 는 항상 로그인한 유저의 plant
    return getDeliveries(searchConditions, page, maxResultCount).then(deliveriesInfo => {
        const parsedDeliveries = deliveriesInfo.deliveries.map(delivery => {
            const deliveryEntity = new DeliveryEntity(delivery);
            return {
                ...delivery,
                issuedDate: deliveryEntity.getIssueDateTime(),
            }
        });
        return {
            issuedDeliveriesCount: deliveriesInfo.totalCount,
            issuedDeliveries: parsedDeliveries
        }
    });
};
export const extractPackingProducts = (issuedDeliveries, boxNo, waybillNo) => {
    let issueData;
    issuedDeliveries.map(item => {
        if(item[0].boxNo === boxNo && item[0].waybillNo === waybillNo)
        return issueData = item;
    });
    let packingProducts = [];
    if(issueData) {
        issueData.map(item => {
            const deliveryEntity = new DeliveryEntity(item);
                const packingSKUs = deliveryEntity.getPackingSKUs();
                packingProducts = packingProducts.concat(packingSKUs.map((sku, index) => {
                    return {
                        ...sku,
                        key: index,
                        eHubDeliveryNo: deliveryEntity.getEHubDeliveryNo(),
                        brand: deliveryEntity.getSkuBrandCode(index),
                        waybillNo: deliveryEntity.getWaybillNo(),
                        boxNo: deliveryEntity.getBoxNo(),
                        normalQty: deliveryEntity.getNormalQty(index),
                        shipmentPlantId: deliveryEntity.getShipmentPlantId(),
                        receiptPlantId: deliveryEntity.getReceiptPlantId(),
                        qty: deliveryEntity.getIssuedQty(index)
                    }
                }));
        });
    } 
    return packingProducts;
};
export const findOptionsFromSelectBox = (givenList, keyword) => {
    const searchKeyword = new RegExp(keyword , "i");
    const foundList = findValueFromList(givenList, searchKeyword);
    return foundList.map((value, index) => {
        return value;
    });
};