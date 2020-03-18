import React from 'react';
import {connect} from 'react-redux';
import {Row, Table} from 'antd';
import 'antd/dist/antd.css';

import {config} from 'config/config';
import StatisticsTpPlantDeliverySearchCondition from './StatisticsTpPlantDeliverySearchCondition';
import {searchStatisticsTpPlantDelivery} from '../reducer/searchTpOriginalDeliveryReducer';
import PlatformEntity from '../../../../entities/PlatformCodeEntity';

import 'ant-design-pro/dist/ant-design-pro.css';

class StatisticsTpPlantDeliveryList extends React.Component {
    saveFormRefs = (SearchConditionComponent) => {
        return this.formRef = SearchConditionComponent;
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {form} = this.formRef.props;
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            const {searchStatisticsTpPlantDelivery} = this.props;
            const startClosingDate = this.formRef.props.form.getFieldValue("closingDate")[0].format('YYYYMMDD');
            const endClosingDate = this.formRef.props.form.getFieldValue("closingDate")[1].format('YYYYMMDD');
            searchStatisticsTpPlantDelivery(startClosingDate, endClosingDate);
        })
    };

    render() {
        const {statisticsTpPlantDeliveryList, statisticsLoading} = this.props;
        const styles = {
            borderLine: {margin: "10px"},
            btnMargin: {marginLeft: "5px"}
        };
        const columns = [
            {
                title: "品牌",
                dataIndex: "brandCode",
                key: "brandCode",
                width: 70,
                fixed: 'left'
            }, {
                title: PlatformEntity.TMALL_OR,
                dataIndex: "tmallOrTotalSumQty",
                key: "tmallOrTotalSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "black"}}>{record.tmallOrTotalSumQty}</span>
            }, {
                title: PlatformEntity.TMALL_OR_SUCCESS,
                dataIndex: "tmallOrSuccessSumQty",
                key: "tmallOrSuccessSumQty",
                width: "5%",
                render: (text, record) => <span style={{color: "green"}}>{record.tmallOrSuccessSumQty}</span>
            }, {
                title: PlatformEntity.TMALL_OS,
                dataIndex: "tmallOsTotalSumQty",
                key: "tmallOsTotalSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "black"}}>{record.tmallOsTotalSumQty}</span>
            }, {
                title: PlatformEntity.TMALL_OS_SUCCESS,
                dataIndex: "tmallOsSuccessSumQty",
                key: "tmallOsSuccessSumQty",
                width: "5%",
                render: (text, record) => <span style={{color: "green"}}>{record.tmallOsSuccessSumQty}</span>
            }, {
                title: PlatformEntity.VIP_OR,
                dataIndex: "vipOrTotalSumQty",
                key: "vipOrTotalSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "black"}}>{record.vipOrTotalSumQty}</span>
            }, {
                title: PlatformEntity.VIP_OR_SUCCESS,
                dataIndex: "vipOrSuccessSumQty",
                key: "vipOrSuccessSumQty",
                width: "5%",
                render: (text, record) => <span style={{color: "green"}}>{record.vipOrSuccessSumQty}</span>
            }, {
                title: PlatformEntity.VIP_OS,
                dataIndex: "vipOsTotalSumQty",
                key: "vipOsTotalSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "black"}}>{record.vipOsTotalSumQty}</span>
            }, {
                title: PlatformEntity.VIP_OS_SUCCESS,
                dataIndex: "vipOsSuccessSumQty",
                key: "vipOsSuccessSumQty",
                width: "5%",
                render: (text, record) => <span style={{color: "green"}}>{record.vipOsSuccessSumQty}</span>
            }, {
                title: PlatformEntity.JD_OR,
                dataIndex: "jdOrTotalSumQty",
                key: "jdOrTotalSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "black"}}>{record.jdOrTotalSumQty}</span>
            }, {
                title: PlatformEntity.JD_OR_SUCCESS,
                dataIndex: "jdOrSuccessSumQty",
                key: "jdOrSuccessSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "green"}}>{record.jdOrSuccessSumQty}</span>
            }, {
                title: PlatformEntity.JD_OS,
                dataIndex: "jdOsTotalSumQty",
                key: "jdOsTotalSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "black"}}>{record.jdOsTotalSumQty}</span>
            }, {
                title: PlatformEntity.JD_OS_SUCCESS,
                dataIndex: "jdOsSuccessSumQty",
                key: "jdOsSuccessSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "green"}}>{record.jdOsSuccessSumQty}</span>
            }, {
                title: PlatformEntity.YOUZAN_OR,
                dataIndex: "youzanOrTotalSumQty",
                key: "youzanOrTotalSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "black"}}>{record.youzanOrTotalSumQty}</span>
            }, {
                title: PlatformEntity.YOUZAN_OR_SUCCESS,
                dataIndex: "youzanOrSuccessSumQty",
                key: "youzanOrSuccessSumQty",
                width: "6%",
                render: (text, record) => <span style={{color: "green"}}>{record.youzanOrSuccessSumQty}</span>
            }, {
                title: PlatformEntity.YOUZAN_OS,
                dataIndex: "youzanOsTotalSumQty",
                key: "youzanOsTotalSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "black"}}>{record.youzanOsTotalSumQty}</span>
            }, {
                title: PlatformEntity.YOUZAN_OS_SUCCESS,
                dataIndex: "youzanOsSuccessSumQty",
                key: "youzanOsSuccessSumQty",
                width: "6%",
                render: (text, record) => <span style={{color: "green"}}>{record.youzanOsSuccessSumQty}</span>
            }, {
                title: PlatformEntity.AIKUCUN_OR,
                dataIndex: "aikucunOrTotalSumQty",
                key: "aikucunOrTotalSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "black"}}>{record.aikucunOrTotalSumQty}</span>
            }, {
                title: PlatformEntity.AIKUCUN_OR_SUCCESS,
                dataIndex: "aikucunOrSuccessSumQty",
                key: "aikucunOrSuccessSumQty",
                width: "6%",
                render: (text, record) => <span style={{color: "green"}}>{record.aikucunOrSuccessSumQty}</span>
            }, {
                title: PlatformEntity.AIKUCUN_OS,
                dataIndex: "aikucunOsTotalSumQty",
                key: "aikucunOsTotalSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "black"}}>{record.aikucunOsTotalSumQty}</span>
            }, {
                title: PlatformEntity.AIKUCUN_OS_SUCCESS,
                dataIndex: "aikucunOsSuccessSumQty",
                key: "aikucunOsSuccessSumQty",
                width: "6%",
                render: (text, record) => <span style={{color: "green"}}>{record.aikucunOsSuccessSumQty}</span>
            }, {
                title: PlatformEntity.EXTERNAL_OS,
                dataIndex: "externalOsTotalSumQty",
                key: "externalOsTotalSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "black"}}>{record.externalOsTotalSumQty}</span>
            }, {
                title: PlatformEntity.EXTERNAL_OS_SUCCESS,
                dataIndex: "externalOsSuccessSumQty",
                key: "externalOsSuccessSumQty",
                width: "4%",
                render: (text, record) => <span style={{color: "green"}}>{record.externalOsSuccessSumQty}</span>
            }
        ];
        const pageConfig = config.pageConfig({statisticsTpPlantDeliveryList});
        return (
            <div style={styles.borderLine}>
                <Row style={{...styles.borderLine}}>
                    <StatisticsTpPlantDeliverySearchCondition onSubmit={this.handleSubmit}
                                                              wrappedComponentRef={this.saveFormRefs}/>
                </Row>
                <Row>
                    <Table columns={columns}
                           dataSource={statisticsTpPlantDeliveryList}
                           loading={{tip: "加载中...", spinning: statisticsLoading}}
                           pagination={pageConfig}
                           scroll={{ x: 2200 }}
                    />
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        statisticsLoading: state.searchTpOriginalDeliveryReducer.statisticsLoading,
        statisticsTpPlantDeliveryList: state.searchTpOriginalDeliveryReducer.statisticsTpPlantDeliveryList
    });
};
export default connect(mapStateToProps, {
    searchStatisticsTpPlantDelivery
})(StatisticsTpPlantDeliveryList);