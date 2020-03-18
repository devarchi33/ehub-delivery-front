import React from 'react';
import {Row, Col, Layout} from 'antd';
import {SearchTpInterfaceDeliveryHeader, TpInterfaceDeliveryList} from '../components/index';
const {Content} = Layout;

export default class SearchTpInterfaceDelivery extends React.Component {
    render() {
        return (
            <Content>
                <Row>
                    <SearchTpInterfaceDeliveryHeader/>
                </Row>
                <Row>
                    <Col>
                        <TpInterfaceDeliveryList/>
                    </Col>
                </Row>
            </Content>
        )
    }
}