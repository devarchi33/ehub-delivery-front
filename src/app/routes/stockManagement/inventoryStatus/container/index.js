import React from 'react';
import {connect} from 'react-redux';

import {Layout, message, Row, Spin, Table} from 'antd';
import {InventoryStatusHeader, SearchCondition} from '../components/index';
import {getIncomingStocks} from '../service/index'
import '../inventoryStatus.css';
import globalStore from "../../../../store/configureStore";

const {Content} = Layout;

class SearchStockStatus extends React.Component {
    constructor(pros) {
        super(pros);
        this.state = {stockList: []}
    };

    getStockList = (values) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        let page = 1;
        let maxResultCount = 10;
        let brand = values.brandCode;
        let plant = values.plant;
        let style = values.styleCode;
        let skuId = values.skuid;
        const ref = this;

        getIncomingStocks(page, maxResultCount, brand, plant, style, skuId).then(res => {
            ref.setState({stockList: res}, () => {
                globalStore.dispatch({type: "SET_LOADING", payload: false});
            });
        });
    };

    onSubmit = (e) => {
        e.preventDefault();
        this.formRef.props.form.validateFields((err, values) => {
            let stylecodes = values.styleCode ? values.styleCode : '';
            let skuids =  values.skuid ? values.skuid : '';
            if(!err){
                if(stylecodes.trim() !== '' || skuids.trim() !== '')
                    this.getStockList(values);
                else
                    message.warning('商品号和款号不能同时为空!');
            }
        });
    };

    saveFormRef = (SearchConditionComponent) => this.formRef = SearchConditionComponent;

    render() {
        const columns= [
            {
                title: "公司",
                dataIndex: "plantName",
                key: "plantName",
                className: "able-align-center"
            },
            {
                title: "现库存",
                key: "currentStock",
                dataIndex: "availableQty",
                className: "able-align-center Pink",
            },
            {
                title: "移动库存",
                key: "movedStock",
                dataIndex: "shipmentQty",
                className: "able-align-center Pink",
            },
            {
                title: "入库履历",
                key: "receiptedHistory",
                className: "Gree",
                children: [
                    { title: "D+0", dataIndex: "receiptedHistory[0].qty", key: "outStockD0", className: "able-align-center backColorGree" },
                    { title: "D+1", dataIndex: "receiptedHistory[1].qty", key: "outStockD1", className: "able-align-center backColorGree" },
                    { title: "D+2", dataIndex: "receiptedHistory[2].qty", key: "outStockD2", className: "able-align-center backColorGree" },
                    { title: "D+3", dataIndex: "receiptedHistory[3].qty", key: "outStockD3", className: "able-align-center backColorGree" },
                    { title: "D+4", dataIndex: "receiptedHistory[4].qty", key: "outStockD4", className: "able-align-center backColorGree" },
                    { title: "D+5", dataIndex: "receiptedHistory[5].qty", key: "outStockD5", className: "able-align-center backColorGree" },
                ]
            }, {
                title: "出库履历",
                key: "issuedHistory",
                className: "Yell",
                children: [
                    { title: "D+0", dataIndex: "issuedHistory[0].qty", key: "inStockD0", className: "able-align-center backColorYell" },
                    { title: "D-1", dataIndex: "issuedHistory[1].qty", key: "inStockD1", className: "able-align-center backColorYell" },
                    { title: "D-2", dataIndex: "issuedHistory[2].qty", key: "inStockD2", className: "able-align-center backColorYell" },
                    { title: "D-3", dataIndex: "issuedHistory[3].qty", key: "inStockD3", className: "able-align-center backColorYell" },
                    { title: "D-4", dataIndex: "issuedHistory[4].qty", key: "inStockD4", className: "able-align-center backColorYell" },
                    { title: "D-5", dataIndex: "issuedHistory[5].qty", key: "inStockD5", className: "able-align-center backColorYell" },
                ]
            },
        ];
        const {loading} = this.props;
        const {stockList} = this.state;
        return (
            <Content>
                <Row>
                    <InventoryStatusHeader/>
                </Row>
                <Row>
                    <SearchCondition
                        onSubmit={this.onSubmit}
                        wrappedComponentRef={this.saveFormRef}
                    />
                </Row>
                <Row>
                    <Spin tip="Loading...." spinning={loading}>
                        <Table
                            columns={columns}
                            dataSource={stockList}
                            bordered
                            rowKey={record => record.availableQty}
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
})(SearchStockStatus);