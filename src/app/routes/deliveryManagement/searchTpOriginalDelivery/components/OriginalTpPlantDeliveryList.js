import React from 'react';
import {connect} from 'react-redux';
import {Row, Table} from 'antd';

import {config} from 'config/config';
import OriginalTpPlantDeliverySearchCondition from './OriginalTpPlantDeliverySearchCondition';
import {searchOriginalTpPlantDelivery} from '../reducer/searchTpOriginalDeliveryReducer';
import PlatformEntity from '../../../../entities/PlatformCodeEntity';

import 'ant-design-pro/dist/ant-design-pro.css';

const columns = [
    {
        title: "TP截止日期",
        dataIndex: "closingDate",
        key: "closingDate",
        width: '6%'
    }, {
        title: "类型",
        dataIndex: "deliveryType",
        key: "deliveryType",
        width: '6%',
        render: (text) => {return PlatformEntity.findTpDeliveryTypeByCode(text)}
    }, {
        title: "平台",
        dataIndex: "platformCode",
        key: "platformCode",
        width: '6%',
        render: (text) => {return PlatformEntity.findPlatformByCode(text)}
    }, {
        title: "主品牌",
        dataIndex: "brandCode",
        key: "brandCode",
        width: '4%'
    }, {
        title: "子品牌",
        dataIndex: "skuBrandCode",
        key: "skuBrandCode",
        width: '4%'
    }, {
        title: "仓库",
        dataIndex: "plantId",
        key: "plantId",
        width: '3%'
    }, {
        title: "商品代码",
        dataIndex: "productId",
        key: "productId",
        width: '8%'
    }, {
        title: "数量",
        dataIndex: "qty",
        key: "qty",
        width: '6%'
    }, {
        title: "运单号",
        dataIndex: "shippingNo",
        key: "shippingNo",
        width: '6%'
    }, {
        title: "外部编号",
        dataIndex: "tradeId",
        key: "tradeId",
        width: '6%'
    }, {
        title: "确认时间",
        dataIndex: "confirmTime",
        key: "confirmTime",
        width: '6%',
    }, {
        title: "交货号",
        dataIndex: "ehubDeliveryNo",
        key: "ehubDeliveryNo",
        width: '6%'
    }, {
        title: "生成日期",
        dataIndex: "ehubInterfaceDate",
        key: "ehubInterfaceDate",
        width: '6%'
    }, {
        title: "状态",
        dataIndex: "statusCode",
        key: "statusCode",
        width: '6%'
    }, {
        title: "原因",
        dataIndex: "errorReason",
        key: "errorReason",
        width: '15%'
    }, {
        title: "创建人",
        dataIndex: "committed.createdBy",
        key: "createdBy",
        width: '6%'
    }
];

export const OriginalTpPlantDeliveryTable = (props) => <Table columns={columns}
                                                              dataSource={props.originalTpPlantDeliveryList}
                                                              loading={{tip: "加载中...", spinning: props.loading}}
                                                              pagination={config.pageConfig({originalTpPlantDeliveryList: props.originalTpPlantDeliveryList}, "TP_PLANT_DELIVERY")}
                                                              scroll={{ x: 2200, y: 600 }}
                                                              />;

class OriginalTpPlantDeliveryList extends React.Component {
    saveFormRefs = (SearchConditionComponent) => {
        return this.formRef = SearchConditionComponent;
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const {searchOriginalTpPlantDelivery} = this.props;
        const startClosingDate = this.formRef.props.form.getFieldValue("closingDate")[0].format('YYYYMMDD');
        const endClosingDate = this.formRef.props.form.getFieldValue("closingDate")[1].format('YYYYMMDD');
        const statusCode = this.formRef.props.form.getFieldValue("statusCode");
        const platformCode = this.formRef.props.form.getFieldValue("platformCode");
        const searchCondition = this.formRef.props.form.getFieldsValue();
        
        delete searchCondition['closingDate']
        searchCondition['startClosingDate'] = startClosingDate;
        searchCondition['endClosingDate'] = endClosingDate;

        if (statusCode === 'All') {
            delete searchCondition['statusCode']
        }
        if (platformCode === 'All'){
            delete searchCondition['platformCode']
        }
        searchOriginalTpPlantDelivery({...searchCondition, closingDate}, 1);
    };

    render() {
        const {originalTpPlantDeliveryList, loading} = this.props;
        const styles = {
            borderLine: {margin: "10px"},
            btnMargin: {marginLeft: "5px"}
        };

        return (
            <div style={styles.borderLine}>
                <Row style={{...styles.borderLine}}>
                    <OriginalTpPlantDeliverySearchCondition onSubmit={this.handleSubmit}
                                                            wrappedComponentRef={this.saveFormRefs}/>
                </Row>
                <Row>
                    <OriginalTpPlantDeliveryTable originalTpPlantDeliveryList={originalTpPlantDeliveryList}
                                                  loading={loading}/>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        originalTpPlantDeliveryList: state.searchTpOriginalDeliveryReducer.originalTpPlantDeliveryList
    });
};
export default connect(mapStateToProps, {
    searchOriginalTpPlantDelivery
})(OriginalTpPlantDeliveryList);