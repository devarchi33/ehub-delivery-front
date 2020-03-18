import React from 'react';
import {Layout, Progress, Row, Table} from 'antd';
import {config} from '../../../../config/config';
import tpPlantDeliveryColumns from './tpPlantDeliveryColumns';
import connect from 'react-redux/es/connect/connect';
import {loadWorkTpPlantDeliveries, resetWorkDeliveries} from '../reducer/uploadMnagementReducer';

const {Content} = Layout;

class TpPlantDeliveryInfo extends React.Component {
    pageOnChange = (page) => {
        const {loadWorkTpPlantDeliveries, type, platformCode} = this.props;
        loadWorkTpPlantDeliveries(type, platformCode, page);
    };

    componentDidMount() {
        const {resetWorkDeliveries} = this.props;
        resetWorkDeliveries();
    }

    render() {
        const {dataSourceForTpPlantDelivery, type, confirming, confirmPercentage} = this.props;
        const styles = {borderLine: {margin: '10px'}};
        const pageConfig = config.pageConfig({
            total: dataSourceForTpPlantDelivery.totalCount,
            totalSumCount: dataSourceForTpPlantDelivery.sumQty,
            pageOnChange: this.pageOnChange
        }, type);
        return (
            <Content>
                <Row>
                    {confirming ?
                        <Row>
                            <Row>
                                <Progress percent={confirmPercentage} status="active"/>
                            </Row>
                            <Row type="flex" justify="center" align="middle">
                                <label
                                    style={{color: "#1890ff", fontWeight: "bold", float: "center"}}>正在上传，请勿关闭此页面</label>
                            </Row>
                        </Row> : ''}
                </Row>
                <Row>
                    <Table style={{...styles.borderLine}}
                           columns={tpPlantDeliveryColumns.columnsForDelivery}
                           dataSource={dataSourceForTpPlantDelivery.items ? dataSourceForTpPlantDelivery.items.map((workTpPlantDelivery, index) => {
                               return {key: index, ...workTpPlantDelivery};
                           }) : []}
                           pagination={pageConfig}
                           {...config.tableStyle('Excel')}
                    />
                </Row>
            </Content>
        );
    };
};

TpPlantDeliveryInfo.propTypes = {};

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        dataSourceForTpPlantDelivery: state.uploadManagementReducer.dataSourceForTpPlantDelivery,
        confirming: state.uploadManagementReducer.confirming,
        confirmPercentage: state.uploadManagementReducer.confirmPercentage
    });
};
export default connect(mapStateToProps, {
    resetWorkDeliveries, loadWorkTpPlantDeliveries
})(TpPlantDeliveryInfo);