import React from 'react';
import {connect} from 'react-redux';
import {Table, Row, Tooltip} from 'antd';

import {DeliveryEntity} from 'entities';
import EHubDeliveryUtil from 'util/EHubDeliveryUtil';
import {config} from 'config/config';

import {PackingProductList} from "../components";
import {getDeliveryStatusBadge} from '../../deliveryCommons/deliveryStatusBadge';
import {loadIssuedDeliveries, loadPackingProducts, checkIssuedDeliveries, resetState} from '../reducer/issuedDeliveryListReducer';
import {DeliveryForm} from '../../components';

class IssuedDeliveryList extends React.Component {
    componentDidMount(){
        this.props.resetState();
    }
    onIssuedDeliveryRowClick = (record, boxNo, waybillNo, event) => {
        const {issueDeliveriesData, loadPackingProducts} = this.props;
        loadPackingProducts(issueDeliveriesData, boxNo, waybillNo);
    };
    onIssuedDeliveryRowCheck = (selectedDeliveryKeys) => {
        const { issuedDeliveries, checkIssuedDeliveries } = this.props;
        const selectedDeliveryList = selectedDeliveryKeys.map(key => {
            return issuedDeliveries.filter(delivery => {
                return key === delivery.key;
            })[0];
        });
        checkIssuedDeliveries(selectedDeliveryKeys, selectedDeliveryList);
    };
    handleSubmit = (e) => {
        e.preventDefault();
        const {form} = this.formRef.props;
        this.formRef.props.form.validateFields((err, values) => {
            if(!err) {
                const {loadIssuedDeliveries} = this.props;
                // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
                const requiredConditions =  this.formRef.props.form.getFieldsValue(['brandCode', 'shipmentPlantId', 'receiptPlantId', 'statusCode', 'waybillNo', 'styleCode', 'date']); // object type
                requiredConditions["startDateTime"] = requiredConditions["date"][0].format('YYYYMMDD000000');
                requiredConditions["finishDateTime"] = requiredConditions["date"][1].format('YYYYMMDD235959');
                for(const item in requiredConditions){
                    if( (requiredConditions[item] === undefined) || (requiredConditions[item] === "") ){
                        delete requiredConditions[item]
                    }
                }
                loadIssuedDeliveries({...requiredConditions})
            }
        })
    };
    saveFormRef = (SearchConditionComponent) => {
        return this.formRef = SearchConditionComponent;
    };
    render() {
        const {selectedDeliveryKeys, issueDeliveriesSumData, issueDataCount, loading} = this.props;
        const styles = {
            borderLine: { margin: "10px" },
            widthClear: { width: "auto" },
            btnMargin: { marginLeft: "5px" }
        };
        const columns = [
            {
                title: "运单号",
                dataIndex: "waybillNo",
                key: "waybillNo",
                width: "10%",
            }, {
                title: "箱号",
                dataIndex: "boxNo",
                key: "boxNo",
                width: "10%",
            }, {
                title: "出库日期",
                dataIndex: "issuedDate",
                key: "issuedDate",
                render: (issuedDate) => {
                    const formattedDate = window.moment(issuedDate, 'YYYY MM DD HH mm ss').format('YYYY-MM-DD');
                    return <span>{formattedDate}</span>
                },
                width: "20%",
            }, {
                title: "品牌",
                dataIndex: "deliveryBrandCode",
                key: "deliveryBrandCode",
                width: "10%",
            }, {
                title: "入库地",
                dataIndex: "receiptPlantId",
                key: "receiptPlantId",
                width: "10%",
            }, {
                title: "总出库数量",
                dataIndex: "totalQty",
                key: "totalQty",
                width: "10%",
            }, {
                title: "状态",
                dataIndex: "statusCode",
                key: "statusCode",
                filters: DeliveryEntity.getDeliveryStatusMap.map(statusItem => {
                    return { text: statusItem.text, value: statusItem.code };
                }),
                onFilter: (value, record) => record.statusCode.indexOf(value) === 0,
                render: (code) => {
                    return <Tooltip title={DeliveryEntity.getDeliveryStatusName(code)}>
                        <span>{getDeliveryStatusBadge(code, "IssuedDeliveryList")}</span>
                    </Tooltip>
                }
            }
        ];
        const pageConfig = config.pageConfig({issueDataCount});
        const rowSelection = {
            selectedRowKeys: selectedDeliveryKeys,
            onChange: this.onIssuedDeliveryRowCheck,
            hideDefaultSelections: true
        };
        return (
            <div style={styles.borderLine}>
                <Row style={{...styles.borderLine, margin: "20px"}}>
                    <DeliveryForm type="issue" onSubmit={this.handleSubmit} wrappedComponentRef={this.saveFormRef}/>
                </Row>
                <Row>
                    <Table style={{...styles.borderLine}}
                           columns={columns}
                           dataSource={EHubDeliveryUtil.orderByDateDesc(issueDeliveriesSumData, 'issuedDate')}
                           rowSelection={rowSelection}
                        //    onRowClick={this.onIssuedDeliveryRowClick}
                           pagination={pageConfig}
                           onExpandedRowsChange={(expendedRows) => {
                               if(expendedRows.length > 0) {
                                   expendedRows.shift();
                               }
                           }}
                           expandedRowRender={() => {
                               return <PackingProductList />
                           }}
                           onExpand={(expanded, record) => {
                               this.onIssuedDeliveryRowClick(record, record.boxNo, record.waybillNo)
                           }}
                           loading={loading}
                           {...config.tableStyle("")}
                    />
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        issuedDeliveries: state.issuedDeliveryList.issuedDeliveries,
        issueDeliveriesData: state.issuedDeliveryList.issueDeliveriesData,
        issueDeliveriesSumData: state.issuedDeliveryList.issueDeliveriesSumData,
        issueDataCount: state.issuedDeliveryList.issueDataCount,
        selectedDeliveryKeys: state.issuedDeliveryList.selectedDeliveryKeys,
        selectedDeliveryList: state.issuedDeliveryList.selectedDeliveryList
    });
};
export default connect(mapStateToProps, {
    loadIssuedDeliveries, loadPackingProducts, checkIssuedDeliveries, resetState
})(IssuedDeliveryList);