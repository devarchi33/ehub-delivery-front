import React from 'react';
import {Col, Layout, Row} from 'antd';
import {
    OriginalTpPlantDeliveryList,
    SearchTpOriginalDeliveryHeader,
    StatisticsTpPlantDeliveryList
} from '../components/index';
import connect from "react-redux/es/connect/connect";
import {resetTpOriginalDeliveries} from "../reducer/searchTpOriginalDeliveryReducer";

const {Content} = Layout;

class SearchTpInterfaceDelivery extends React.Component {
    componentDidMount() {
        const {resetTpOriginalDeliveries} = this.props;
        resetTpOriginalDeliveries();
    }
    render() {
        return (
            <Content>
                <Row>
                    <SearchTpOriginalDeliveryHeader/>
                </Row>
                <Row>
                    <Col>
                        <StatisticsTpPlantDeliveryList/>
                        <OriginalTpPlantDeliveryList/>
                    </Col>
                </Row>
            </Content>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({});
};
export default connect(mapStateToProps, {
    resetTpOriginalDeliveries
})(SearchTpInterfaceDelivery);