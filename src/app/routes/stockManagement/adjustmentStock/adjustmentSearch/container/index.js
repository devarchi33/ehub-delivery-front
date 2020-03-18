/**
 * Created by donghoon 2017-10-13
 */
import React from 'react';
import {Layout, Row, Spin} from 'antd';
import {AdjustmentStockHeader, AdjustmentTable, SearchCondition} from "../../components";
import {getAdjustmentStockInfo} from '../../service'

const {Content} = Layout;

export default class SearchAdjustmentStock extends React.Component {
    constructor(pros) {
        super(pros);
        this.state = {
            stockList: [],
            selectedRowKeys: [],
            selectedRows: [],
            loading: false
        }
    };

    uuid = () => {
        return Math.floor(Math.random() * 1000000);
    };

    onSubmit = (e) => {
        e.preventDefault();
        const ref = this;
        ref.setState({ loading: true });
        getAdjustmentStockInfo()
            .then(res => {
                ref.setState({
                    searchProductCode: "",
                    stockList: res.map(item => {
                        return {...item, key: item.id}
                    }),
                    loading: false
                });
            });
    };

    setStockList = (stockList) => {
        this.setState({stockList});
    };

    setSelectedRow = (selectedObject) => {
        this.setState({
            selectedRows: selectedObject.selectedRows,
            selectedRowKeys: selectedObject.selectedRowKeys
        });
    };

    render() {
        const {loading, stockList} = this.state;
        return (
            //库存调整目录
            <Content>
                <Row>
                    <AdjustmentStockHeader  headerMessage="库存调整查询"/>
                </Row>
                <Row>
                    <SearchCondition onSubmit={this.onSubmit}/>
                </Row>
                <Row>
                    <Spin tip="加载中" spinning={loading}>
                        <AdjustmentTable setSelectedRow={this.setSelectedRow}
                                         setStockList={this.setStockList}
                                         stockList={stockList} />
                    </Spin>
                </Row>
            </Content>
        )
    }
}