/**
 * Created by Lee Dong-hoon 2017-10-11
 */
import React from 'react';
import { Row, Col, Layout } from 'antd';
const { Content } = Layout;

import { UserInfoEntity, DeliveryEntity } from 'entities';
import { findValueFromList } from 'util/listHelper';
import { IssueHeader, IssuedDeliveryList } from "../components";

// IssuedManagement
export default class Index extends React.Component {
    render() {
        return (
            <Content>
                <Row>
                    <IssueHeader/>
                </Row>
                <Row>
                    <Col>
                        <IssuedDeliveryList />
                    </Col>
                </Row>
            </Content>
        )
    }
}