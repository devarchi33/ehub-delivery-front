/**
 * Created by Yuan.Yujiao 2017-09-06
 */
import React from 'react';
import {connect} from 'react-redux';

import {Col, Layout, Row, Spin, Table} from 'antd';
import {SearchCondition, SearchStockHeader} from "../components/index";
import {getStockInfo} from '../service/index'

import globalStore from 'store/configureStore';

import '../searchStock.css';
import DownloadExcelTemplate from "../../../../components/excel/DownloadExcelTemplate";

const {Content} = Layout;

class SearchStock extends React.Component {
    constructor(pros) {
        super(pros);
        this.state = {
            stockList: [],
            searchCondition: {
                brandList:[],
                plantList:[]
            }
        }
    };

    searchStockInfo(){
        const ref = this;
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        const { form } = this.formRef.props; // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
        const params = form.getFieldsValue(['brandCode', 'plant','productId']);
        getStockInfo(params['brandCode'], params['plant'], params['productId']).then(res => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            ref.setState({
                stockList: res.map((item, index) => {
                    return { key: index, ...item }
                }),
            });
        });
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.formRef.props.form.validateFields((err, values) => {
            if(!err) {
                this.searchStockInfo();
            }
        })
    };

    // handleTableChange = (pagination) => {
    //     const pager = { ...this.state.pagination }
    //     pager.current = pagination.current
    //     this.setState({pagination: pager})
    //     this.searchStockInfo(pager.current)
    // };
    saveFormRef = (SearchConditionComponent) => {
        return this.formRef = SearchConditionComponent;
    };

    render() {
        const columns = [{
            title: "仓库",
            dataIndex: "plantId",
            key: "plantId",
            className:"table-align-center"
        }, {
            title: "款号",
            dataIndex: "styleCode",
            key: "styleCode",
            className:"table-align-center"
        }, {
            title: "商品代码",
            dataIndex: "skuId",
            key: "skuId",
            className:"table-align-center"
        }, {
            title: "可用数量",
            dataIndex: "availableQty",
            key: "availableQty",
            className:"table-align-center"
        }
            // {
            //     title: "预定出库数量",
            //     dataIndex: "expectedIssueQty",
            //     key: "expectedIssueQty",
            //     className:"table-align-center"
            // }, {
            //     title: "预定入库数量",
            //     dataIndex: "expectedReceiptQty",
            //     key: "expectedReceiptQty",
            //     className:"table-align-center"
            // }
        ];
        const {searchCondition, stockList} = this.state;
        const {loading} = this.props;
        const styles = {
            borderLine: {margin: "10px"},
            btnMargin: {marginLeft: "5px"}
        };
        const excelColumnsConfig = [ // download format
            {label: '仓库', value: 'plantId'},
            {label: "款号", value: "styleCode"},
            {label: "商品代码", value: "skuId"},
            {label: "可用库存", value: "availableQty"}
        ];
        const excelFileName = "eHubStock";
        const exceptZeroStockList = stockList.filter(item => item.availableQty !== 0);
        exceptZeroStockList.forEach(item => {
            item.availableQty = item.availableQty.toString();
        });
        return (
            <Content>
                <Row>
                    <SearchStockHeader/>
                </Row>
                <Row>
                    <SearchCondition wrappedComponentRef={this.saveFormRef}
                                     onSubmit={this.onSubmit}
                                     searchCondition={searchCondition}
                    />
                </Row>
                <Row type="flex" justify="end" style={{...styles.borderLine}}>
                    <Col>
                        <DownloadExcelTemplate columnConfigList={[excelColumnsConfig]}
                                               sheetDataList={[exceptZeroStockList]}
                                               btnName={'库存信息下载'}
                                               fileName={excelFileName}/>
                    </Col>
                </Row>
                <Row>
                    <Spin tip="Loading...." spinning={loading}>
                        <Table columns={columns}
                               dataSource={stockList}
                            //    pagination={this.state.pagination}
                            //    onChange={this.handleTableChange}
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
})(SearchStock);