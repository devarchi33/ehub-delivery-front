import React from 'react';
import { Badge } from 'antd';
import { DeliveryEntity } from 'entities';
import { eHubException } from "exception";

export const getDeliveryStatusBadge = (code, location) => {
    switch (code) {
        case DeliveryEntity.PLANNING:
        case DeliveryEntity.DISTRIBUTIVE_INSTRUCTION:
        case DeliveryEntity.ISSUED_COMPLETE:
            return <Badge status="processing" text={code}/>;
        case DeliveryEntity.RECEIPT_COMPLETE:
        case DeliveryEntity.INSPECTION_COMPLETE:
            return <Badge status="success" text={code}/>;
        case DeliveryEntity.WORKING:
            return <Badge status="warning" text={code}/>;
        case DeliveryEntity.DELETED:
            return <Badge status="error" text={code}/>;
        default:
            throw new eHubException("Not exists status..", location);
    }
};