import React from 'react';
import {connect} from 'react-redux';

import {Layout, Row, Table, notification, Modal} from 'antd';
import {SearchCondition} from "../components/index";
import {updateDeliveryByDeliveryNo, updateDeliveryByDeliveryNoAndBoxNo} from '../service/index';
import {loadCancelDelvieryInfoListByDeliveryNo, loadCancelDelvieryInfoListByDeliveryNoAndBoxNo, clearDeliveryInfo} from '../reducer/cancelDeliveryReducer';

import globalStore from '../../../store/configureStore';
import { CancelError } from '../validator/CancelError';

const {Content} = Layout;
const confirm = Modal.confirm;

class CancelDelivery extends React.Component {
    constructor(pros) {
        super(pros);
        this.state = {
            shipmentType : ["WR", "ES", "OS", "EV", "WM"],
            receiptType : ["WS", "ER", "SR", "OR", "WM"],
            beforeShipmentQty: 0,
            beforeReceiptQty: 0
        }
    };

    componentDidMount(){
        const {clearDeliveryInfo} = this.props;
        clearDeliveryInfo();
    }

    searchDeliveryInfo(type){
        const {loadCancelDelvieryInfoListByDeliveryNo, loadCancelDelvieryInfoListByDeliveryNoAndBoxNo} = this.props;
        const { form } = this.formRef.props; // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
        const paramsDeliveryNo = form.getFieldsValue(['deliveryNo']);
        const paramsBoxNo = form.getFieldsValue(['boxNo']);
        if(paramsBoxNo['boxNo']){
            loadCancelDelvieryInfoListByDeliveryNoAndBoxNo(paramsDeliveryNo['deliveryNo'], paramsBoxNo['boxNo'], this, type);
        } else {
            loadCancelDelvieryInfoListByDeliveryNo(paramsDeliveryNo['deliveryNo'], this, type);
        }
    }

    updateDelvieryInfo(){
        const {cancelDeliveryList} = this.props;
        if (cancelDeliveryList.length === 0) {
            notification['warning']({
                message: '请先查询数据。',
                duration: null
            });
        } else if (cancelDeliveryList[0].statusCd == "DT"){
            notification['error']({
                message: '不能撤销已经标记删除的数据！',
                duration: null
            });
        } else {
            let ref = this;        
            let loseStock = cancelDeliveryList.filter(item => item.reciptPlantSkuQty - item.receiptQty < 0 && this.state.receiptType.indexOf(item.deliveryType) > -1
            ).map(items => items.skuId + "," + items.reciptPlantSkuQty)
            if (loseStock.length != 0){
                let msg = <span style={{color:"red"}}>撤销后会产生负库存的数据，是否继续撤销?</span>
                confirm({
                    content: msg,
                    onOk() {
                        ref.cancel();
                    },
                    onCancel() {
                      return;
                    },
                })
            } else {
                confirm({
                    content: '确定要撤销吗?',
                    onOk() {
                        ref.cancel();
                    },
                    onCancel() {
                      return;
                    },
                });
            }
        }
    }

    cancel(){
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        const { form } = this.formRef.props; // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
        const paramsDeliveryNo = form.getFieldsValue(['deliveryNo']);
        const paramsBoxNo = form.getFieldsValue(['boxNo']);
        if(paramsBoxNo['boxNo']){
            updateDeliveryByDeliveryNoAndBoxNo(paramsDeliveryNo['deliveryNo'], paramsBoxNo['boxNo']).then(res => {
                if(res && res.status === 200){
                    this.searchDeliveryInfo("update");
                } else {
                    res.json().then(r => this.promptErrorMsgAndEndLoading(r));
                }
            });
        } else {
            updateDeliveryByDeliveryNo(paramsDeliveryNo['deliveryNo']).then(res => {
                if(res && res.status === 200){
                    this.searchDeliveryInfo("update");
                } else {
                    res.json().then(r => this.promptErrorMsgAndEndLoading(r));
                }
            });
        }
    }

    promptErrorMsgAndEndLoading = (r) => {
        notification['error']({
            message: "撤销失败",
            description: CancelError.getErrorMessage(r),
            duration: null
        });
        globalStore.dispatch({type: "SET_LOADING", payload: false});
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.formRef.props.form.validateFields((err, values) => {
            if(!err) {
                this.searchDeliveryInfo("search");
            }
        })
    };
    onClick = (e) => {
        e.preventDefault();
        this.formRef.props.form.validateFields((err, values) => {
            if(!err) {
                this.updateDelvieryInfo();
            }
        })
    };

    saveFormRef = (SearchConditionComponent) => {
        return this.formRef = SearchConditionComponent;
    };

    render() {
        const { pageConfig, cancelDeliveryList, loading} = this.props;
        const {receiptType, shipmentType} = this.state;
        const columns = [{
            title: "品牌",
            dataIndex: "brandCd",
            key: "brandCd",
            className:"table-align-center"
        }, {
            title: "交货号",
            dataIndex: "deliveryNo",
            key: "deliveryNo",
            className:"table-align-center"
        }, {
            title: "设置基础库存状态",
            dataIndex: "afterTpIfStatusCd",
            key: "afterTpIfStatusCd",
            className:"table-align-center"
        }, {
            title: "运单号",
            dataIndex: "waybillNo",
            key: "waybillNo",
            className:"table-align-center"
        }, {
            title: "出库地",
            dataIndex: "shipmentPlant",
            key: "shipmentPlant",
            className:"table-align-center"
        },{
            title: "入库地",
            dataIndex: "receiptPlant",
            key: "receiptPlant",
            className:"table-align-center"
        }, {
            title: "交易类型",
            dataIndex: "deliveryType",
            key: "deliveryType",
            className:"table-align-center"
        }, {
            title: "状态",
            dataIndex: "statusCd",
            key: "statusCd",
            className:"table-align-center"
        }, {
            title: "商品代码",
            dataIndex: "skuId",
            key: "skuId",
            className:"table-align-center"
        }, {
            title: "出库地可用库存",
            dataIndex: "shipPlantSkuQty",
            key: "shipPlantSkuQty",
            className:"table-align-center",
            render: (text, record) => shipmentType.indexOf(record.deliveryType) > -1 ? text : <span style={{display: "none"}}></span>
        }, {
            title: "入库地可用库存",
            dataIndex: "reciptPlantSkuQty",
            key: "reciptPlantSkuQty",
            className:"table-align-center",
            render: (text, record) => receiptType.indexOf(record.deliveryType) > -1 ? text : <span style={{display: "none"}}></span>
        }, {
            title: "出库交易库存数",
            dataIndex: "shipmentQty",
            key: "shipmentQty",
            className:"table-align-center"
        }, {
            title: "入库交易库存数",
            dataIndex: "receiptQty",
            key: "receiptQty",
            className:"table-align-center"
        }];
        const {searchCondition} = this.state;
        return (
            <Content>
                <Row>
                    <SearchCondition wrappedComponentRef={this.saveFormRef}
                                     onSubmit={this.onSubmit}
                                     searchCondition={searchCondition}
                                     onClick={this.onClick}
                    />
                </Row>
                <Row>
                    <Table columns={columns}
                        dataSource={cancelDeliveryList}
                        rowKey={record => record.deliveryNo + "&" + record.boxNo + "&" + record.skuId}
                        pagination={pageConfig}
                        loading={loading}
                    />
                </Row>
            </Content>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        pageConfig: state.cancelDeliveryRecuder.pageConfig,
        cancelDeliveryList: state.cancelDeliveryRecuder.cancelDeliveryList,
        shipmentSkuQty: state.cancelDeliveryRecuder.shipmentSkuQty,
        receiptSkuQty: state.cancelDeliveryRecuder.receiptSkuQty
    })
};
export default connect(mapStateToProps, {
    loadCancelDelvieryInfoListByDeliveryNo, clearDeliveryInfo, loadCancelDelvieryInfoListByDeliveryNoAndBoxNo
})(CancelDelivery);