import React from 'react';
import {Row, Col, Layout} from 'antd';
import {SearchTPOutOfStockHeader, ProductList} from '../components';
const {Content} = Layout;

export default class ModifyTpProduct extends React.Component {
    render() {
        return (
            <Content>
                <Row>
                    <SearchTPOutOfStockHeader/>
                </Row>
                <Row>
                    <Col>
                        <ProductList/>
                    </Col>
                </Row>
            </Content>
        )
    }
}