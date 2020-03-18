import {UserInfoEntity, DeliveryEntity} from 'entities';
import {config} from 'config/config';
import console from 'util/logger';

import { getDeliveries, noti } from '../../service';

const BASE_URL = config.serverInfo;

/**
 *
 * @param searchConditions  required
 * @param page              required
 * @param maxResultCount    required
 */
export const getReceiptDeliveries = (searchConditions, page, maxResultCount) => {
    // 입고조회를 할때에 receiptPlantId 는 항상 로그인한 유저의 plant
    return getDeliveries(searchConditions, page, maxResultCount).then(deliveriesInfo => {
        const parsedDeliveries = deliveriesInfo.deliveries.map(delivery => {
            const deliveryEntity = new DeliveryEntity(delivery);
            const preliminaryQty = deliveryEntity.getTotalQty();
            const normalQty = deliveryEntity.getPackingSKUs().reduce((initVal, sku) => {
                return initVal + sku.inspectedQty.normalQty;
            }, 0);
            return {
                ...delivery,
                issuedDate: deliveryEntity.getIssueDateTime(),
                receiptDate: deliveryEntity.getReceiptDateTime(),
                brand: deliveryEntity.getDeliveryBrandCode(),
                preliminaryQty,
                isReceipt: deliveryEntity.getReceipt().confirmedBy === null,
                normalQty,
                differenceQty: normalQty - preliminaryQty,
                shippingTypeCode: deliveryEntity.getShippingTypeCode()
            }
        });
        return {
            receiptDeliveriesCount: deliveriesInfo.totalCount,
            deliveries: parsedDeliveries
        }
    });
};
export const parseClickReceiptDeliveryInfo = (receiptDeliveries, deliveryIndex, waybillNo, initialState) => {
    // 수불 객체에서 박스안의 상품정보를 찾아 매핑한다.
    const parseProductList = [];
    let delivery;
    receiptDeliveries.forEach(element => {
        if(element[0].boxNo === deliveryIndex && element[0].waybillNo === waybillNo)
            return delivery = element;
    });
    if(delivery) {
        delivery.map(delivery => {
            const deliveryEntity = new DeliveryEntity(delivery);
            const packingSKUs = deliveryEntity.getPackingSKUs();
            for (let skuIndex = 0; skuIndex < packingSKUs.length; skuIndex++) {
                parseProductList.push({
                    deliveryIndex,
                    key: skuIndex,
                    eHubDeliveryNo: deliveryEntity.getEHubDeliveryNo(),
                    boxNo: deliveryEntity.getBoxNo(),
                    statusCode: deliveryEntity.getStatusCode(),
                    brand: deliveryEntity.getRepresentativeBrand(),
                    skuId: deliveryEntity.getSkuId(skuIndex),
                    receipt: deliveryEntity.getReceipt(),
                    preliminaryQty: deliveryEntity.getPreliminaryQty(skuIndex),
                    normalQty: deliveryEntity.getNormalQty(skuIndex),
                    differenceQty: deliveryEntity.getDifferenceQty(skuIndex)
                });
            }
        });
    }
    // 촬영회사의 경우 화면에서 직접 상품을 추가할수 있기때문에 수불단위의 정보를 설정
    if(UserInfoEntity.isStudio()) {
        const addNewProductInfo = {
            ...initialState.addNewProductInfo,
            deliveryIndex,
            eHubDeliveryNo: deliveryEntity.getEHubDeliveryNo(),
            boxNo: deliveryEntity.getBoxNo()
        };
        return { parseProductList, addNewProductInfo };
    }
    return { parseProductList, addNewProductInfo: {} };
};
export const parseDownloadReceiptDeliveryExcel = (selectedDeliveryList) => {
    const excelData = selectedDeliveryList.map((delivery, index) => {
        const deliveryEntity = new DeliveryEntity(delivery),
            // 수불 단위의 공통정보
            shipmentPlantId = deliveryEntity.getShipmentPlantId(),
            receiptPlantId = deliveryEntity.getReceiptPlantId(),
            issuedDate = deliveryEntity.getIssueDateTime(),
            brand = deliveryEntity.getRepresentativeBrand(),
            packingSKUs = deliveryEntity.getPackingSKUs(),
            boxNo = deliveryEntity.getBoxNo(),
            // 수불 박스의 상품정보
            packingSKUInfos = packingSKUs.map((sku, index) => {
                return {
                    key: index,
                    eHubDeliveryNo: deliveryEntity.getEHubDeliveryNo(),
                    shipmentPlantId, issuedDate, brand, boxNo,
                    skuId: deliveryEntity.getSkuId(index),
                    preliminaryQty: deliveryEntity.getPreliminaryQty(index),
                    normalQty: deliveryEntity.getNormalQty(index),
                    receiptPlantId: receiptPlantId,
                    waybillNo: deliveryEntity.getWaybillNo()
                };
            });
        return packingSKUInfos;
    }).reduce((a,b) => b.concat(a), []);

    let sortExcelData = window._.sortBy(excelData, ["waybillNo", "boxNo"]);
    console.log(">>>>>>>>>> receiptDeliveryService parseDownloadExcelData ", excelData);
    return sortExcelData;
};