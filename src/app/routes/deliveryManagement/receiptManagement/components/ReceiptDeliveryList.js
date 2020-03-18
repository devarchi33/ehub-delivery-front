import React from 'react';
import {connect} from 'react-redux';
import {Col, message, Row, Table, Tooltip} from 'antd';
import Trend from 'ant-design-pro/lib/Trend';

import {DeliveryEntity} from 'entities';
import {config} from 'config/config';
import {formatDate} from 'util/timeUtil';
import EHubDeliveryUtil from 'util/EHubDeliveryUtil';
import {eHubException} from "exception/index";
import {ProductsInspectionList} from "../components";
import {parseDownloadReceiptDeliveryExcel} from '../service';
import {
    changePageConfig,
    loadReceiptDeliveries,
    processAfterClickReceiptDelivery,
    resetState
} from '../reducer/receiptDeliveryListReducer';
import {DeliveryForm} from '../../components';
import {getDeliveryStatusBadge} from '../../deliveryCommons/deliveryStatusBadge';

import 'ant-design-pro/dist/ant-design-pro.css';
import DownloadExcelTemplate from '../../../../components/excel/DownloadExcelTemplate';

class ReceiptDeliveryList extends React.Component {
    constructor(pros) {
        super(pros);
        const layoutInfo = JSON.parse(sessionStorage.getItem(config.layoutInfo));
        this.state = {
            brandList: layoutInfo.UserInfo.colleague.brands,
            plantList: layoutInfo.UserBrandUserPlants,
            allPlantList: layoutInfo.UserBrandAllPlants,
            plantFilterList: layoutInfo.UserBrandUserPlants.filter(item => layoutInfo.UserInfo.colleague.brands[0].brandCode.indexOf(item.brandCode) !== -1 ),
            allPlantFilterList: layoutInfo.UserBrandAllPlants.filter(item => layoutInfo.UserInfo.colleague.brands[0].brandCode.indexOf(item.brandCode) !== -1),
            selectedBrand:'',
            selectedRowKeys: [],
            filteredInfo: null,
            showDownloadButton: false
        }
    }

    componentDidMount(){
        this.props.resetState();
        if (this.formRef.props.form.getFieldsValue(['waybillNo'])['waybillNo'] !== ""){
            this.handleSubmit(window.event);
        }
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    };
    onDeliveryRowClick = (clickedRowInfo, boxNo, waybillNo, event) => {
        const { receiptDeliveries, processAfterClickReceiptDelivery } = this.props;
        processAfterClickReceiptDelivery(receiptDeliveries, boxNo, waybillNo);
    };
    handleSubmit = (e) => {
        e ? e.preventDefault() : null;
        this.setState({selectedRowKeys: [], filteredInfo: null});
        this.formRef.props.form.validateFields((err, values) => {
            if(!err) {
                const {loadReceiptDeliveries} = this.props;
                // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
                const requiredConditions =  this.formRef.props.form.getFieldsValue(['brandCode', 'shipmentPlantId', 'receiptPlantId', 'statusCode', 'waybillNo', 'styleCode', 'date']); // object type
                if (this.formRef.props.form.getFieldsValue(['styleCode'])['styleCode'] != ""){
                    this.setState({
                        showDownloadButton: true
                    })
                } else {
                    this.setState({
                        showDownloadButton: false
                    })
                }
                requiredConditions["startDateTime"] = requiredConditions["date"][0].format('YYYYMMDD000000');
                requiredConditions["finishDateTime"] = requiredConditions["date"][1].format('YYYYMMDD235959');
                for(const item in requiredConditions){
                    if( (requiredConditions[item] === undefined) || (requiredConditions[item] === "") ){
                        delete requiredConditions[item]
                    }
                }
                loadReceiptDeliveries({...requiredConditions})
            }
        })
    };
    handleChange = (pagination, filters, sorters) => {
        this.setState({filteredInfo: filters}, () => {
            const {totalCount, totalCountByNormalDelivery, totalCountByDirectDelivery, receiptSumByDataList, changePageConfig} = this.props;
            const dataSources = receiptSumByDataList ? receiptSumByDataList : [];
            const receiptConfirmNum = dataSources.reduce((initVal, record) => {
                return initVal + record.normalQty;
            }, 0);
            const receiptConfirmNumByNormalDelivery = dataSources.reduce((initVal, record) => {
                const normalQty = record.shippingTypeCode === '01' ? record.normalQty : 0;
                return initVal + normalQty;
            }, 0);
            const receiptConfirmNumByDirectDelivery = dataSources.reduce((initVal, record) => {
                const normalQty = record.shippingTypeCode === '16' ? record.normalQty : 0;
                return initVal + normalQty;
            }, 0);
            switch (filters.shippingTypeCode ? filters.shippingTypeCode[0] : 'all') {
                case 'all':
                    changePageConfig(totalCount, receiptConfirmNum);
                    break;
                case '01':
                    changePageConfig(totalCountByNormalDelivery, receiptConfirmNumByNormalDelivery);
                    break;
                case '16':
                    changePageConfig(totalCountByDirectDelivery, receiptConfirmNumByDirectDelivery);
                    break;
                default:
                    changePageConfig(totalCount, receiptConfirmNum);
                    break;
            }
        });
    };
    saveFormRefs = (SearchConditionComponent) => {
        return this.formRef = SearchConditionComponent;
    };
    render() {
        const {receiptDeliveries, receiptSumByDataList, loading, pageConfig} = this.props;
        let {selectedRowKeys, filteredInfo, showDownloadButton} = this.state;
        filteredInfo = filteredInfo || {};
        const styles = {
            borderLine: {margin: "10px"},
            btnMargin: {marginLeft: "5px"}
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
                title: "出库地",
                dataIndex: "shipmentPlantId",
                key: "shipmentPlantId",
                width: "5%",
            }, {
                title: "出库日期",
                dataIndex: "issuedDate",
                key: "issuedDate",
                render: (issuedDate) => {
                    return <span>{formatDate(issuedDate, 'YYYY-MM-DD')}</span>
                },
                width: "15%",
            }, {
                title: "入库日期",
                dataIndex: "receiptDate",
                key: "receiptDate",
                width: "15%",
                render: (receiptDate) => {
                    return <span>{receiptDate ? formatDate(receiptDate, 'YYYY-MM-DD') : '未入库'}</span>
                }
            }, {
                title: "品牌",
                dataIndex: "brand",
                key: "brand",
                width: "5%",
            }, {
                title: "状态",
                dataIndex: "statusCode",
                key: "statusCode",
                width: "10%",
                filters: DeliveryEntity.getDeliveryStatusMap.map(statusItem => {
                    return { text: statusItem.text, value: statusItem.code };
                }),
                onFilter: (value, record) => record.statusCode.indexOf(value) === 0,
                render: (code) => {
                    return <Tooltip title={DeliveryEntity.getDeliveryStatusName(code)}>
                        <span>{getDeliveryStatusBadge(code, "ReceiptDeliveryList")}</span>
                    </Tooltip>
                }
            }, {
                title: "总预数量",
                dataIndex: "preliminaryQty",
                key: "preliminaryQty",
                width: "5%",
            }, {
                title: "总确定数量",
                dataIndex: "normalQty",
                key: "normalQty",
                width: "5%",
            }, {
                title: "总差数量",
                dataIndex: "differenceQty",
                key: "differenceQty",
                filters: [
                    { text: "还不确定", value: "NOT_YET" }, { text: "正常", value: "NORMAL"},
                    { text: "超过", value: "EXCEED"}, { text: "未满", value: "LESS_THAN"}
                ],
                onFilter: (value, record) => {
                    switch (value) {
                        case "NOT_YET":
                            return !record.isReceipt;
                        case "NORMAL":
                            return record.differenceQty === 0;
                        case "EXCEED":
                            return record.differenceQty > 0;
                        case "LESS_THAN":
                            return record.isReceipt && record.differenceQty < 0;
                        default:
                            return record;
                    }
                },
                render: (differenceQty, record) => {
                    const flag = record.differenceQty === 0 ? '' : record.differenceQty > 0 ?'up' : 'down';
                    return record.isReceipt ? <Trend flag={flag}>{differenceQty}</Trend> : <span><b>还不确定</b></span>
                }
            }
        ];
        const dataSources = receiptSumByDataList ? receiptSumByDataList : [];
        const keys = dataSources.map(item => item.key);
        const rowSelection = {
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectChange,
            hideDefaultSelections: true,
            selections:  [{
                key: 'all-data',
                text: 'Select All',
                onSelect: () => this.setState({selectedRowKeys: [...keys]})
            }, {
                key: 'no-data',
                text: 'Select None',
                onSelect: () => this.setState({selectedRowKeys: []})
            }],
            onSelection: this.onSelection
        };

        let allKeys = selectedRowKeys ? selectedRowKeys :[];
        let AllDeliveryList = allKeys.map(key => {
            return receiptSumByDataList.filter(delivery => {
                return key === delivery.key;
            })[0];
        });
        let boxNo = [];
        let waybillNo = [];
        AllDeliveryList.map(eachList => {
            boxNo.push(eachList.boxNo);
            waybillNo.push(eachList.waybillNo);
        });

        let dataList = [];
        receiptDeliveries.map(item => {
            item.map(eachItem => {
                if(boxNo.indexOf(eachItem.boxNo) !== -1 && waybillNo.indexOf(eachItem.waybillNo) !== -1) {
                    dataList = dataList.concat(eachItem);
                }
            });
        });

        if(receiptSumByDataList !== undefined) {
            if(receiptSumByDataList.length > 0 && receiptSumByDataList[0].createdPackingBox.sapDeliveryType === 'WS') {
                columns.splice(2, 0, {
                    title: "配送类型",
                    dataIndex: "shippingTypeCode",
                    key: "shippingTypeCode",
                    filters: [{
                        text: '全部',
                        value: 'all',
                    }, {
                        text: '一般',
                        value: '01',
                    }, {
                        text: '直送',
                        value: '16',
                    }],
                    filterMultiple: false,
                    filteredValue: filteredInfo.shippingTypeCode|| null,
                    onFilter: (value, record) => value === 'all' ? record : record.shippingTypeCode.indexOf(value) === 0,
                    width: "8%",
                    render: (text, record) =>  <span>{text === '01' ? '一般配送' : '直送'}</span>
                });
            }
        }
        const excelColumnsConfig = [ // download format
            {label: '交货号', value: 'eHubDeliveryNo'},
            {label: "出库地", value: "shipmentPlantId"}, {label: "出库日期", value: "issuedDate"},
            {label: "入库地", value: "receiptPlantId"}, {label: "品牌", value: "brand"},
            {label: "运单号", value: "waybillNo"}, {label: "入库箱号", value: "boxNo"},
            {label: "商品代码", value: "skuId"}, {label: "预入库数量", value: "preliminaryQty"},
            {label: "入库确定数量", value: "normalQty"}
        ];
        const excelFileName = "eHubDeliveryReceipt";
        const excelData = parseDownloadReceiptDeliveryExcel(dataList);
        excelData.forEach(item => {
            if (item.preliminaryQty === 0) {
                item.preliminaryQty = item.preliminaryQty.toString();
            }
            if (item.normalQty === 0) {
                item.normalQty = item.normalQty.toString();
            }
        });
        return (
            <div style={styles.borderLine}>
                <Row  style={{...styles.borderLine}}>
                    <DeliveryForm type="receipt" onSubmit={this.handleSubmit} wrappedComponentRef={this.saveFormRefs}/>
                </Row>
                <Row type="flex" justify="end" style={{...styles.borderLine}}>
                    <Col>
                        <DownloadExcelTemplate columnConfigList={[excelColumnsConfig]}
                                               sheetDataList={[excelData]}
                                               btnName={'入库信息下载'}
                                               fileName={excelFileName}
                                               disabled={showDownloadButton}
                                               beforeDownload={() => {
                                                   const dataKeysList = selectedRowKeys ? selectedRowKeys.length : 0;
                                                   // 체크박스 선택여부 검사
                                                   if (dataKeysList === 0) {
                                                       const msg = '请先勾选需要下载的数据!';
                                                       message.info(msg, 2);
                                                       throw new eHubException(msg);
                                                   }
                                               }}/>
                    </Col>
                </Row>
                <Row>
                    <Table columns={columns}
                           dataSource={EHubDeliveryUtil.orderByDateDesc(receiptSumByDataList, 'issuedDate')}
                           rowSelection={rowSelection}
                           onChange={this.handleChange}
                        //    onRowClick={this.onDeliveryRowClick}
                           pagination={pageConfig}
                           onExpandedRowsChange={(expendedRows) => {
                               if(expendedRows.length > 0) {
                                   expendedRows.shift();
                               }
                           }}
                           expandedRowRender={() => {
                               return <ProductsInspectionList handleCheckedProductRow={this.handleCheckedProductRow}/>
                           }}
                           onExpand={(expanded, record) => {
                               this.onDeliveryRowClick(record, record.boxNo, record.waybillNo)
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
        receiptDeliveries: state.receiptDeliveryList.receiptDeliveries,
        receiptSumByDataList: state.receiptDeliveryList.receiptSumByDataList,
        totalCount: state.receiptDeliveryList.receiptListCount,
        totalCountByDirectDelivery: state.receiptDeliveryList.receiptCountByDirectDelivery,
        totalCountByNormalDelivery: state.receiptDeliveryList.receiptCountByNormalDelivery,
        selectedDeliveryKeys: state.receiptDeliveryList.selectedDeliveryKeys,
        selectedDeliveryList: state.receiptDeliveryList.selectedDeliveryList,
        confirmationExcelFile: state.receiptDeliveryList.confirmationExcelFile,
        pageConfig: state.receiptDeliveryList.pageConfig
    })
};
export default connect(mapStateToProps, {
    loadReceiptDeliveries, processAfterClickReceiptDelivery, resetState, changePageConfig
})(ReceiptDeliveryList);