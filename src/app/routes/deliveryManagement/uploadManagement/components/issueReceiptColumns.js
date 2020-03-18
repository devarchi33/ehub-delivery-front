import React from 'react';
import {Badge} from 'antd';
import EHubDeliveryUtil from '../../../../util/EHubDeliveryUtil';

export default {
    columnsForDelivery: [
        {
            title: "运单号",
            dataIndex: "waybillNo",
            key: "waybillNo"
        }, {
            title: "品牌",
            dataIndex: "brandCode",
            key: "brandCode"
        }, {
            title: "出库地",
            dataIndex: "shipmentPlantId",
            key: "shipmentPlantId"
        }, {
            title: "出库数量",
            dataIndex: "shipmentQty",
            key: "shipmentQty"
        }, {
            title: "入库地",
            dataIndex: "receiptPlantId",
            key: "receiptPlantId"
        }, {
            title: "入库数量",
            dataIndex: "receiptQty",
            key: "receiptQty"
        }, {
            title: "快递",
            dataIndex: "shippingCompanyId",
            key: "shippingCompanyId"
        }, {
            title: "状态",
            dataIndex: "applied",
            key: "applied",
            render: (applied, record) => {
                return applied ?
                    <Badge status="success" text='Complete'/> : <Badge status="processing" text='Working'/>
            }
        }, {
            title: "制订者",
            dataIndex: "createdBy",
            key: "createdBy"
        }, {
            title: "修改日期",
            dataIndex: "modified",
            key: "modified",
            render: (modified) => <span>{EHubDeliveryUtil.getModifiedTime(modified)}</span>
        }
    ],
    columnsForBox: [
        {
            title: "箱号",
            dataIndex: "boxNo",
            key: "boxNo",
            width: "30%",
        },{
            title: "商品代码(sku)",
            dataIndex: "skuId",
            key: "skuId",
            width: "25%",
        }, {
            title: "商品代码(ean)",
            dataIndex: "eanCode",
            key: "eanCode",
            width: "25%",
        }, {
            title: "出库数量",
            dataIndex: "shipmentQty",
            key: "shipmentQty",
            width: "10%",
        }, {
            title: "入库数量",
            dataIndex: "receiptQty",
            key: "receiptQty",
            width: "10%",
        }
    ]
};