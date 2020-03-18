/**
 * Created by Lee Dong-hoon 2017-09-05
 */
import React from 'react';
import {Col, Layout, Row} from 'antd';

import {ReceiptDeliveryList, ReceiptHeader} from "../components";

const {Content} = Layout;

// ReceiptManagement
export default class Index extends React.Component {
    constructor(pros) {
        super(pros);
        this.state = {
            // container state
            deliveryListLoading: false,
            // delivery list
            deliveryList: [],
            totalPageSize: 0,
            selectedDeliveryKeys: [],
            selectedDeliveryList: [],
            // product list
            productsInspectionList: [],
            selectedProductRowKeys: [],
            selectedProductItemList: []
        }
    }

    handleCheckedProductRow = (selectedProductRowKeys) => {
        const productsInspectionList = this.state.productsInspectionList;
        const selectedProductItemList = selectedProductRowKeys.map(key => {
            return productsInspectionList.filter(item => {
                return key === item.key;
            })[0];
        });
        this.setState({ selectedProductRowKeys, selectedProductItemList });
    };

    render() {
        return (
            <Content>
                <Row>
                    <ReceiptHeader/>
                </Row>
                <Row>
                    <Col>
                        <ReceiptDeliveryList/>
                    </Col>
                </Row>
            </Content>
        )
    }
}