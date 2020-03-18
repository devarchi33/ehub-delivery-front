import React from 'react';
import { message } from 'antd';
import { config } from 'config/config';
import { eHubException } from "exception/index";

DeliveryEntity.PLANNING = "TP";                     // 계획 수립 중
DeliveryEntity.DISTRIBUTIVE_INSTRUCTION = "DP";     // 분배 지시
DeliveryEntity.ISSUED_COMPLETE = "OW";              // 출고 완료
DeliveryEntity.RECEIPT_COMPLETE = "IW";             // 입고 완료
DeliveryEntity.INSPECTION_COMPLETE = "IC";          // 검품 완료
DeliveryEntity.DELETED = "DT";                      // 삭제됨
DeliveryEntity.WORKING = "WK";                      // 작업중

function DeliveryEntity(delivery) {
    const _assertProperties = (mandatoryProps, checkObject, checkProperty, objectPosition) => {
        if(mandatoryProps.indexOf(checkProperty) < 0) {
            const msg = "DeliveryEntity Exception, " + checkProperty + " is not a " + objectPosition +"'s property.";
            message.error(msg, 10);
            throw new eHubException(msg);
        }
        if(!checkObject.hasOwnProperty(checkProperty)) {
            const msg = "DeliveryEntity Exception, Not exist " + checkProperty + " property in " + objectPosition +" object.";
            message.error(msg, 10);
            throw new eHubException(msg);
        }
        if(checkObject[checkProperty] === undefined || checkObject[checkProperty] === null) {
            const msg = "DeliveryEntity Exception, " + objectPosition + "." + checkProperty + "'s value is null.";
            message.error(msg, 10);
            throw new eHubException(msg);
        }
    };
    const _checkDeliveryEffectiveness =(delivery, checkProperty) => {
        const mandatoryProps = [
            "eHubDeliveryNo", "shipmentPlantId", "receiptPlantId", "statusCode", "deliveryBrandCode",
            "brand", "representativeBrand", "shippingCompany", "createdPackingBox", "totalQty"
        ];
        // delivery 객체 유효성 검사
        _assertProperties(mandatoryProps, delivery, checkProperty, "delivery");
    };
    const _checkShippingCompanyEffectiveness = (shippingCompany, checkProperty) => {
        const mandatoryProps = ["shippingCompanyId", "shippingCompanyName", "waybillNo"];
        // delivery.shippingCompany 객체 유효성 검사
        _assertProperties(mandatoryProps, shippingCompany, checkProperty, "delivery.shippingCompany");
    };
    const _checkCreatedPackingBoxEffectiveness = (createdPackingBox, checkProperty) => {
        const mandatoryProps = ["boxNo", "sapDeliveryType", "shippingTypeCode", "receipt", "issue", "packingSKUs"];
        // delivery.createdPackingBox 객체 유효성 검사
        _assertProperties(mandatoryProps, createdPackingBox, checkProperty, "delivery.createdPackingBox");
    };
    const _checkReceiptOrIssueEffectiveness = (object, checkProperty) => {
        const mandatoryProps = ["dateTime", "confirmedBy"];
        // delivery.createdPackingBox.issue or delivery.createdPackingBox.receipt 객체 유효성 검사
        _assertProperties(mandatoryProps, object, checkProperty, "delivery.createdPackingBox.(issue or receipt)");
    };
    const _checkPackingSKUsEffectiveness = (packingSKUs, checkProperty) => {
        const mandatoryProps = ["skuId", "brandCode", "qty", "inspectedQty"];
        if(packingSKUs.length === 0) {
            throw new eHubException("DeliveryEntity Exception, _checkPackingSKUsEffectiveness: There is no packingSKUs.");
        }
        // delivery.createdPackingBox.packingSKUs 객체 유효성 검사
        packingSKUs.forEach(sku => {
            _assertProperties(mandatoryProps, sku, checkProperty, "delivery.createdPackingBox.packingSKUs");
        });
    };
    const _checkInsprctedQtyEffectiveness = (InspectedQty, checkProperty) => {
        const mandatoryProps = ["inspected", "normalQty", "defectQty", "differenceQty"];
        // delivery.createdPackingBox.packingSKUs.inspectedQty 객체 유효성 검사
        _assertProperties(mandatoryProps, InspectedQty, checkProperty);
    };

    const _stockQtyCheckEffectiveness = (qtyObject) => {
        if (qtyObject === null || qtyObject === undefined) {
            return false;
        }
        return true;
    };

    return {
        setInspectedQty: (productIndex, inspectedQty) => {
            const packingSKUs = new DeliveryEntity(delivery).getPackingSKUs();
            _checkPackingSKUsEffectiveness(packingSKUs, "inspectedQty");
            delivery.createdPackingBox.packingSKUs[productIndex].inspectedQty = inspectedQty;
            return delivery;
        },
        // 1depth delivery 객체 getter
        getEHubDeliveryNo: () => {
            _checkDeliveryEffectiveness(delivery, "eHubDeliveryNo");
            return delivery.eHubDeliveryNo;
        },
        getDeliveryBrandCode: () => {
            _checkDeliveryEffectiveness(delivery, "deliveryBrandCode");
            return delivery.deliveryBrandCode;
        },
        getShipmentPlantId: () => {
            _checkDeliveryEffectiveness(delivery, "shipmentPlantId");
            return delivery.shipmentPlantId;
        },
        getReceiptPlantId: () => {
            _checkDeliveryEffectiveness(delivery, "receiptPlantId");
            return delivery.receiptPlantId;
        },
        getStatusCode: () => {
            _checkDeliveryEffectiveness(delivery, "statusCode");
            return delivery.statusCode;
        },
        getRepresentativeBrand: () => { // 복합브랜드를 고려한 대표 브랜드 코드
            _checkDeliveryEffectiveness(delivery, "brand"); // 필드명 협의중
            return delivery.brand;
        },
        getShippingCompany: () => {
            _checkDeliveryEffectiveness(delivery, "shippingCompany");
            return delivery.shippingCompany;
        },
        getCreatedPackingBox: () => {
            _checkDeliveryEffectiveness(delivery, "createdPackingBox");
            return delivery.createdPackingBox;
        },
        getTotalQty: () => {
            _checkDeliveryEffectiveness(delivery, "totalQty");
            return delivery.totalQty;
        },
        // 2depth shippingCompany 객체 getter
        getShippingCompanyId: () => {
            const shippingCompany = new DeliveryEntity(delivery).getShippingCompany();
            _checkShippingCompanyEffectiveness(shippingCompany, "shippingCompanyId");
            return shippingCompany.shippingCompanyId;
        },
        getShippingCompanyName: () => {
            const shippingCompany = new DeliveryEntity(delivery).getShippingCompany();
            _checkShippingCompanyEffectiveness(shippingCompany, "shippingCompanyName");
            return shippingCompany.shippingCompanyName;
        },
        getWaybillNo: () => {
            const shippingCompany = new DeliveryEntity(delivery).getShippingCompany();
            _checkShippingCompanyEffectiveness(shippingCompany, "waybillNo");
            return shippingCompany.waybillNo;
        },
        // 2depth createdPackingBox 객체 getter
        getBoxNo: () => {
            const createdPackingBox = new DeliveryEntity(delivery).getCreatedPackingBox();
            _checkCreatedPackingBoxEffectiveness(createdPackingBox, "boxNo");
            return createdPackingBox.boxNo;
        },
        getReceipt: () => {
            const createdPackingBox = new DeliveryEntity(delivery).getCreatedPackingBox();
            _checkCreatedPackingBoxEffectiveness(createdPackingBox, "receipt");
            return createdPackingBox.receipt;
        },
        getIssue: () => {
            const createdPackingBox = new DeliveryEntity(delivery).getCreatedPackingBox();
            _checkCreatedPackingBoxEffectiveness(createdPackingBox, "issue");
            return createdPackingBox.issue;
        },
        getPackingSKUs: () => {
            const createdPackingBox = new DeliveryEntity(delivery).getCreatedPackingBox();
            _checkCreatedPackingBoxEffectiveness(createdPackingBox, "packingSKUs");
            return createdPackingBox.packingSKUs;
        },
        getShippingTypeCode: () => {
            const createdPackingBox = new DeliveryEntity(delivery).getCreatedPackingBox();
            _checkCreatedPackingBoxEffectiveness(createdPackingBox, "shippingTypeCode");
            return createdPackingBox.shippingTypeCode;
        },
        // 3depth receipt 객체 getter
        getReceiptDateTime: () => {
            const receipt = new DeliveryEntity(delivery).getReceipt();
            return receipt.dateTime;
        },
        getReceiptComfirmedBy: () => {
            const receipt = new DeliveryEntity(delivery).getReceipt();
            _checkReceiptOrIssueEffectiveness(receipt, "confirmedBy");
            return receipt.confirmedBy;
        },
        // 3depth issue 객체 getter
        getIssueDateTime: () => {
            const issue = new DeliveryEntity(delivery).getIssue();
            _checkReceiptOrIssueEffectiveness(issue, "dateTime");
            return issue.dateTime;
        },
        getIssueComfirmedBy: () => {
            const issue = new DeliveryEntity(delivery).getIssue();
            _checkReceiptOrIssueEffectiveness(issue, "confirmedBy");
            return issue.confirmedBy;
        },
        // 3depth packingSKUs 객체 getter
        getSkuId: (productIndex) => {
            const packingSKUs = new DeliveryEntity(delivery).getPackingSKUs();
            _checkPackingSKUsEffectiveness(packingSKUs, "skuId");
            return packingSKUs[productIndex].skuId;
        },
        getSkuBrandCode: (productIndex) => {
            const packingSKUs = new DeliveryEntity(delivery).getPackingSKUs();
            _checkPackingSKUsEffectiveness(packingSKUs, "brandCode");
            return packingSKUs[productIndex].brandCode;
        },
        getPreliminaryQty: (productIndex) => { // qty 필드가 입고입장일 때는 예정수량
            const packingSKUs = new DeliveryEntity(delivery).getPackingSKUs();
            _checkPackingSKUsEffectiveness(packingSKUs, "qty");
            return Number.parseInt(packingSKUs[productIndex].qty);
        },
        getIssuedQty: (productIndex) => { // qty 필드가 출고입장일 때는 출고수량을 나타냄.
            const packingSKUs = new DeliveryEntity(delivery).getPackingSKUs();
            _checkPackingSKUsEffectiveness(packingSKUs, "qty");
            return Number.parseInt(packingSKUs[productIndex].qty);
        },
        getInspectedQty: (productIndex) => { // 입고후 재고정보를 담고 있는 객체
            const packingSKUs = new DeliveryEntity(delivery).getPackingSKUs();
            _checkPackingSKUsEffectiveness(packingSKUs, "inspectedQty");
            return packingSKUs[productIndex].inspectedQty;
        },
        // 4depth InspectedQty 객체 getter
        getInspected: (productIndex) => {
            //  상품의 확인 일자
            const inspectedQty = new DeliveryEntity(delivery).getInspectedQty(productIndex);
            _checkInsprctedQtyEffectiveness(inspectedQty, "inspected");
            return inspectedQty.inspected;
        },
        getNormalQty: (productIndex) => {
            const inspectedQty = new DeliveryEntity(delivery).getInspectedQty(productIndex);
            // 출고시에는 inspectedQty 가 비어있기 때문에 그에 따른 처리
            const normalQty = inspectedQty.normalQty;
            const pass = _stockQtyCheckEffectiveness(normalQty);
            if(!pass) {
                return '';
            }
            _checkInsprctedQtyEffectiveness(inspectedQty, "normalQty");
            return Number.parseInt(normalQty);
        },
        getDefectQty: (productIndex) => {
            const inspectedQty = new DeliveryEntity(delivery).getInspectedQty(productIndex);
            // 출고시에는 inspectedQty 가 비어있기 때문에 그에 따른 처리
            const defectQty = inspectedQty.defectQty;
            const pass = _stockQtyCheckEffectiveness(defectQty);
            if(!pass) {
                return '';
            }
            _checkInsprctedQtyEffectiveness(inspectedQty, "defectQty");
            return Number.parseInt(defectQty);
        },
        getDifferenceQty: (productIndex) => {
            const inspectedQty = new DeliveryEntity(delivery).getInspectedQty(productIndex);
            // 출고시에는 inspectedQty 가 비어있기 때문에 그에 따른 처리
            const differenceQty = inspectedQty.differenceQty;
            const pass = _stockQtyCheckEffectiveness(differenceQty);
            if(!pass) {
                return '';
            }
            _checkInsprctedQtyEffectiveness(inspectedQty, "differenceQty");
            return Number.parseInt(differenceQty);
        }
    };
}

DeliveryEntity.getDeliveryStatusName = function(code) {
    switch (code) {
        case "TP":
            return "计划中";
        case "DP":
            return "分配指示";
        case "OW":
            return "出库完成";
        case "IW":
            return "入库完成";
        case "IC":
            return "检查完成";
        case "DT":
            return "删除";
        case "WK":
            return "工作中";
        default:
            throw new DeliveryEntity("Not exists status code..");
    }
};

DeliveryEntity.getDeliveryStatusMap = [{
    code: DeliveryEntity.PLANNING,
    text: DeliveryEntity.getDeliveryStatusName(DeliveryEntity.PLANNING)
}, {
    code: DeliveryEntity.DISTRIBUTIVE_INSTRUCTION,
    text: DeliveryEntity.getDeliveryStatusName(DeliveryEntity.DISTRIBUTIVE_INSTRUCTION)
}, {
    code: DeliveryEntity.ISSUED_COMPLETE,
    text: DeliveryEntity.getDeliveryStatusName(DeliveryEntity.ISSUED_COMPLETE)
}, {
    code: DeliveryEntity.RECEIPT_COMPLETE,
    text: DeliveryEntity.getDeliveryStatusName(DeliveryEntity.RECEIPT_COMPLETE)
}, {
    code: DeliveryEntity.INSPECTION_COMPLETE,
    text: DeliveryEntity.getDeliveryStatusName(DeliveryEntity.INSPECTION_COMPLETE)
}, {
    code: DeliveryEntity.DELETED,
    text: DeliveryEntity.getDeliveryStatusName(DeliveryEntity.DELETED)
}];

export default DeliveryEntity;