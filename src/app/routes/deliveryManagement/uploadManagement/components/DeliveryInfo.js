import React from 'react';
import {Table, Row, Layout, Progress} from 'antd';
import {config} from '../../../../config/config';
import BoxInfo from './BoxInfo';
import issueColumns from './issueColumns';
import issueReceiptColumns from './issueReceiptColumns';
import receiptColumns from './receiptColumns';
import PropTypes from 'prop-types';
import connect from "react-redux/es/connect/connect";
import {resetWorkDeliveries, loadWorkDeliveries, loadWorkDeliveryBox} from '../reducer/uploadMnagementReducer';

const {Content} = Layout;

class DeliveryInfo extends React.Component {
    state = {expandedRowKeys: []};
    componentDidMount() {
        const {resetWorkDeliveries} = this.props;
        resetWorkDeliveries();
    }
    onExpandClick = (waybillNo) => {
        const {loadWorkDeliveryBox, type} = this.props;
        loadWorkDeliveryBox(type, waybillNo);
    };
    pageOnChange = (page) => {
        const {loadWorkDeliveries, type} = this.props;
        loadWorkDeliveries(type, page);
    };
    expandedRowChange = (expandedRowKeys) => {
        this.setState({expandedRowKeys}, () => {
            if(expandedRowKeys.length > 1) {
                expandedRowKeys.shift();
            }
        });
    };
    render () {
        const {dataSourceForDelivery, type, confirming, confirmPercentage} = this.props;
        const {expandedRowKeys} = this.state;
        const styles = {borderLine: {margin: '10px'}};
        const pageConfig = config.pageConfig({
            total: dataSourceForDelivery.totalGroupByCount,
            totalSumCount: dataSourceForDelivery.sumQty,
            pageOnChange: this.pageOnChange
        }, type);
        return (
            <Content>
                <Row>
                    {confirming ?
                        <Row>
                            <Row>
                                <Progress percent={confirmPercentage} status="active" />
                            </Row>
                            <Row type="flex" justify="center" align="middle">
                                <label style={{color:"#1890ff",fontWeight:"bold",float:"center"}}>正在上传，请勿关闭此页面</label>
                            </Row>
                        </Row>  : ''}
                </Row>
                <Row>
                    <Table style={{...styles.borderLine}}
                           columns={type === 'SHIPMENT'
                               ? issueColumns.columnsForDelivery : type === 'RECEIPT'
                                   ? receiptColumns.columnsForDelivery : issueReceiptColumns.columnsForDelivery}
                           dataSource={dataSourceForDelivery.items ? dataSourceForDelivery.items.map((workDelivery, index) => {
                               return {key: index, ...workDelivery};
                           }) : []}
                           pagination={pageConfig}
                           expandedRowKeys={expandedRowKeys}
                           onExpandedRowsChange={this.expandedRowChange}
                           expandRowByClick={true}
                           expandedRowRender={(record, index, indent, expanded) => <BoxInfo type={type}/>}
                           onExpand={(expanded, record) => this.onExpandClick(type === 'receipt' ? record.deliveryNo : record.waybillNo)}
                           {...config.tableStyle('Excel')}
                    />
                </Row>
            </Content>
        );
    };
};

DeliveryInfo.propTypes = {
    type: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        dataSourceForDelivery: state.uploadManagementReducer.dataSourceForDelivery,
        confirming: state.uploadManagementReducer.confirming,
        confirmPercentage: state.uploadManagementReducer.confirmPercentage
    });
};
export default connect(mapStateToProps, {
    resetWorkDeliveries, loadWorkDeliveries, loadWorkDeliveryBox
})(DeliveryInfo);