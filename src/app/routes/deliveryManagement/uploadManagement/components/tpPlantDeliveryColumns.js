import React from 'react';
import {formatDate} from '../../../../util/timeUtil';

export default {
    columnsForDelivery: [
        {
            title: "快递",
            dataIndex: "shippingCompanyName",
            key: "shippingCompanyName",
            width: "10%",
        }, {
            title: "运单号",
            dataIndex: "shippingNo",
            key: "shippingNo",
            width: "5%",
        }, {
            title: "确认时间",
            dataIndex: "confirmTime",
            key: "confirmTime",
            width: "5%",
            render: (confirmTime) => {
                const date = new Date(confirmTime);
                return <span>{formatDate(date, 'YYYY-MM-DD')}</span>
            }
        }, {
            title: "商品代码",
            dataIndex: "productId",
            key: "productId",
            width: "5%",
        }, {
            title: "数量",
            dataIndex: "qty",
            key: "qty",
            width: "5%",
        }, {
            title: "平台订单编号",
            dataIndex: "platformOrderId",
            key: "platformOrderId",
            width: "10%",
            render: (text) => {
                return <span>{text ? text : '无'}</span>
            }
        }, {
            title: "交易号",
            dataIndex: "tradeId",
            key: "tradeId",
            width: "10%",
        }
    ]
};