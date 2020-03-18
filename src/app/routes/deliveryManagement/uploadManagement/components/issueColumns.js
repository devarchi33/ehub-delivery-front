import React from 'react';
import {Badge} from 'antd';
import EHubDeliveryUtil from '../../../../util/EHubDeliveryUtil';

export default {
    columnsForDelivery: [
        {
            title: "运单号",
            dataIndex: "waybillNo",
            key: "waybillNo",
            width: "10%",
        },  {
            title: "品牌",
            dataIndex: "brandCode",
            key: "brandCode",
            width: "5%",
        }, {
            title: "出库地",
            dataIndex: "shipmentPlantId",
            key: "shipmentPlantId",
            width: "5%",
        }, {
            title: "出库数量",
            dataIndex: "shipmentQty",
            key: "shipmentQty",
            width: "5%",
        }, {
            title: "入库地",
            dataIndex: "receiptPlantId",
            key: "receiptPlantId",
            width: "5%",
        }, {
            title: "快递",
            dataIndex: "shippingCompanyId",
            key: "shippingCompanyId",
            width: "10%",
        }, {
            title: "状态",
            dataIndex: "applied",
            key: "applied",
            width: "10%",
            render: (applied, record) => {
                return applied ?
                    <Badge status="success" text='Complete'/> : <Badge status="processing" text='Working'/>
            }
        }, {
            title: "制订者",
            dataIndex: "createdBy",
            key: "createdBy",
            width: "10%",
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
            width: "30%",
        }, {
            title: "商品代码(ean)",
            dataIndex: "eanCode",
            key: "eanCode",
            width: "30%",
        }, {
            title: "出库数量",
            dataIndex: "shipmentQty",
            key: "shipmentQty",
            width: "10%",
        }
    ]
};