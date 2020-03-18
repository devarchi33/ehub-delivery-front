import React from 'react';
import {Layout, Row, Table} from 'antd';
import PropTypes from 'prop-types';
import {config} from 'config/config';
import connect from 'react-redux/es/connect/connect';
import issueColumns from './issueColumns';
import receiptColumns from './receiptColumns';
import issueReceiptColumns from './issueReceiptColumns';
import {loadWorkDeliveryBox} from '../reducer/uploadMnagementReducer';

const {Content} = Layout;

class BoxInfo extends React.Component {
    pageOnChange = (page) => {
        const {dataSourceForBox, loadWorkDeliveryBox, type} = this.props;
        loadWorkDeliveryBox(type, dataSourceForBox.items[0].waybillNo, page);
    };
    render() {
        const {dataSourceForBox, type, loading} = this.props;
        const styles = {borderLine: {margin: '10px'}};
        return (
            <Content>
                <Row>
                    <Table style={{...styles.borderLine}}
                           loading={loading}
                           columns={type === 'SHIPMENT'
                               ? issueColumns.columnsForBox : type === 'receipt'
                                   ? receiptColumns.columnsForBox : issueReceiptColumns.columnsForBox}
                           pagination={{pageSize: 8, total: dataSourceForBox.totalCount, onChange: this.pageOnChange}}
                           dataSource={dataSourceForBox.items ? dataSourceForBox.items.map((box, index) => {
                               return {...box, key: index};
                           }) : []}
                           {...config.tableStyle('SubExcel')}
                    />
                </Row>
            </Content>
        );
    };
};

BoxInfo.propTypes = {
    type: PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        dataSourceForBox: state.uploadManagementReducer.dataSourceForBox
    });
};
export default connect(mapStateToProps, {
    loadWorkDeliveryBox
})(BoxInfo);