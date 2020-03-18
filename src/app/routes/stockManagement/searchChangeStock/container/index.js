import React from 'react';
import {connect} from 'react-redux';

import {Col, Layout, message, Row, Spin, Table} from 'antd';
import {SearchChangeStockHeader, SearchCondition} from '../components/index';
import {getStockChangeInfo} from '../service/index';
import {config} from 'config/config';
import globalStore from 'store/configureStore';
import '../searchStock.css';
import DownloadExcelTemplate from '../../../../components/excel/DownloadExcelTemplate';

const {Content} = Layout;

class SearchChangeStock extends React.Component {
    constructor(pros) {
        super(pros);
        this.state = {
            stockChangeList: [],
            searchCondition: {
                brandList:[],
                plantList:[]
            }
        }
    };

    searchStockChangeInfo(){
        const ref = this;
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        const { form } = this.formRef.props; // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
        const params = form.getFieldsValue(['brandCode', 'plant', 'productId', 'dateTime']);
        const dateTime = moment(params['dateTime']).format('YYYY-MM-DD');
        getStockChangeInfo(params['brandCode'], params['plant'], params['productId']).then(res => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            let dataSource = [];
            if(params['dateTime'] !== undefined && params['dateTime'] !== null){
                let sumBeforeDateQty = _.sumBy(res.items.filter(item => item.dateTime <= dateTime), "shipmentQty");
                let filterByAfterDateList = res.items.filter(item => item.dateTime > dateTime);
                dataSource = _.forEach(filterByAfterDateList, item => {
                    item["baseStockQty"] = item["baseStockQty"] + sumBeforeDateQty;
                    item["baseStockDtm"] = dateTime > item["baseStockDtm"] ? dateTime : item["baseStockDtm"];
                });
            } else {
                dataSource = res.items;
            }
            ref.setState({
                stockChangeList: dataSource.map((item, index) => {
                    return { key: index, ...item }
                }),
            });
            if (res.items.length === 0) {
                message.info("未找到入出库以及调整记录");
            }
        });
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.formRef.props.form.validateFields((err, values) => {
            if(!err) {
                this.searchStockChangeInfo();
            }
        })
    };

    saveFormRef = (SearchConditionComponent) => {
        return this.formRef = SearchConditionComponent;
    };

    render() {
        const {searchCondition, stockChangeList} = this.state;
        const {loading} = this.props;
        let actualSumQty = 0;
        for(let i = 0; i < this.state.stockChangeList.length; i++) {
            if (i === 0) {
                actualSumQty += this.state.stockChangeList[i].baseStockQty;
            }
            actualSumQty += this.state.stockChangeList[i].shipmentQty;
        }
        const styles = {
            borderLine: {margin: "10px"}
        };
        const columns = [{
            title: "品牌",
            dataIndex: "brandCode",
            key: "brandCode",
            width: "8%",
            className:"table-align-center",
            render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (index === 0) {
                    var len = stockChangeList.length;
                    obj.props.rowSpan = len;
                }
                if (index !== 0) {
                    obj.props.rowSpan = 0;
                }
                return obj;
            }
        }, {
            title: "商品代码",
            dataIndex: "skuId",
            key: "skuId",
            width: "15%",
            className:"table-align-center",
            render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (index === 0) {
                    var len = stockChangeList.length;
                    obj.props.rowSpan = len;
                }
                if (index !== 0) {
                    obj.props.rowSpan = 0;
                }
                return obj;
            }
        }, {
            title: "plantId",
            dataIndex: "plantId",
            key: "plantId",
            width: "7%",
            className:"table-align-center",
            render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (index === 0) {
                    var len = stockChangeList.length;
                    obj.props.rowSpan = len;
                }
                if (index !== 0) {
                    obj.props.rowSpan = 0;
                }
                return obj;
            }
        }, {
            title: "基础库存",
            dataIndex: "baseStockQty",
            key: "baseStockQty",
            width: "10%",
            className:"table-align-center",
            render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (index === 0) {
                    var len = stockChangeList.length;
                    obj.props.rowSpan = len;
                }
                if (index !== 0) {
                    obj.props.rowSpan = 0;
                }
                return obj;
            }
        }, {
            title: "设置基础库存日期",
            dataIndex: "baseStockDtm",
            key: "baseStockDtm",
            width: "12%",
            className:"table-align-center",
            render: (value, row, index) => {
                const obj = {
                  children: value,
                  props: {},
                };
                if (index === 0) {
                    var len = stockChangeList.length;
                    obj.props.rowSpan = len;
                }
                if (index !== 0) {
                    obj.props.rowSpan = 0;
                }
                return obj;
            }
        }, {
            title: "运单号",
            dataIndex: "waybillNo",
            key: "waybillNo",
            width: "12%",
            className:"table-align-center"
        }, {
            title: "交易类型",
            dataIndex: "deliveryStatus",
            key: "deliveryStatus",
            width: "8%",
            className:"table-align-center"
        }, {
            title: "入/出库数量",
            dataIndex: "shipmentQty",
            key: "shipmentQty",
            width: "10%",
            className:"table-align-center"
        }, {
            title: "入/出库日期",
            dataIndex: "dateTime",
            key: "dateTime",
            width: "10%",
            className:"table-align-center"
        }, {
            title: "可用库存",
            dataIndex: "availableStockQty",
            key: "availableStockQty",
            width: "8%",
            className:"table-align-center",
            render: (value, row, index) => {
                let obj = {
                  children: value,
                  props: {},
                };
                if (index === 0) {
                    var len = stockChangeList.length;
                    obj.props.rowSpan = len;
                }
                if (index !== 0) {
                    obj.props.rowSpan = 0;
                }
                if(value === actualSumQty) {
                    obj = {...obj, children: <span style={{color: "#52c41a"}}>{value}</span>}
                } else {
                    obj = {...obj, children: <span style={{color: "#f5222d"}}>{value}</span>}
                }
                return obj;
            }
        }];
        const excelColumnsConfig = [ // download format
            {label: '品牌', value: 'brandCode'},
            {label: "商品代码", value: "skuId"},
            {label: "plantId", value: "plantId"},
            {label: "基础库存", value: "baseStockQty"},
            {label: "设置基础库存日期", value: "baseStockDtm"},
            {label: "运单号", value: "waybillNo"},
            {label: "交易类型", value: "deliveryStatus"},
            {label: "入/出库数量", value: "shipmentQty"},
            {label: "入/出库日期", value: "dateTime"},
            {label: "可用库存", value: "availableStockQty"}
        ];
        const excelFileName = "eHubStockChange";
        let data = stockChangeList.map((item) => {
            return {
                brandCode: item.brandCode,
                skuId: item.skuId,
                plantId: item.plantId,
                baseStockQty: item.baseStockQty.toString(),
                baseStockDtm: item.baseStockDtm,
                waybillNo: item.waybillNo,
                deliveryStatus: item.deliveryStatus,
                shipmentQty: item.shipmentQty.toString(),
                dateTime: item.dateTime,
                availableStockQty: item.availableStockQty.toString()
            };
        });
        return (
            <Content>
                <Row>
                    <SearchChangeStockHeader/>
                </Row>
                <Row>
                    <SearchCondition wrappedComponentRef={this.saveFormRef}
                                     onSubmit={this.onSubmit}
                                     searchCondition={searchCondition}
                    />
                </Row>
                <Row type="flex" justify="end" style={{ ...styles.borderLine}}>
                    <Col>
                        <DownloadExcelTemplate columnConfigList={[excelColumnsConfig]}
                                               sheetDataList={[data]}
                                               btnName={'库存变化信息下载'}
                                               fileName={excelFileName}/>
                    </Col>
                </Row>
                <Row>
                    <Spin tip="Loading...." spinning={loading}>
                        <Table columns={columns}
                               dataSource={stockChangeList}
                               bordered
                               pagination = {false}
                               {...config.tableStyle("")}
                        />
                    </Spin>
                </Row>
            </Content>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading
    })
};
export default connect(mapStateToProps, {
})(SearchChangeStock);