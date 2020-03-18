import React from 'react';
import {connect} from 'react-redux';
import { Table, Spin, Layout, Row } from 'antd';
const { Content } = Layout;
import { SearchCondition, SearchAdjustmentStockHeader } from "../components/index";
import { config } from 'config/config';
import {loadAdjustmentStock, clearStocksInfo} from '../reducer/adjumentStockQueryReducer';

class SearchAdjustmentStock extends React.Component {
    constructor(pros) {
        super(pros);
        this.state = {
            currentPage: 1,
            searchCondition: {
                brandList:[],
                plantList:[]
            }
        }
    };

    componentDidMount(){
        const {clearStocksInfo} = this.props;
        clearStocksInfo();
    }
    searchStockAdjustmentInfo(page){
        const ref = this;
        const {loadAdjustmentStock} = this.props;
        const { form } = this.formRef.props; // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
        const params = form.getFieldsValue(['brandCode', 'plantId', 'skuId']);
        let pageSize = 10
        loadAdjustmentStock(params['brandCode'], params['plantId'], params['skuId'], page, pageSize);
        this.setState({ currentPage: page})
    }
    onSubmit = (e) => {
        e.preventDefault();
        this.formRef.props.form.validateFields((err, values) => {
            if(!err) {               
                this.searchStockAdjustmentInfo(1);
            } else {
                return;
            }
        })
    };

    saveFormRef = (SearchConditionComponent) => {
        return this.formRef = SearchConditionComponent;
    };

    pageOnChange = (page) => {
        this.searchStockAdjustmentInfo(page);
    };

    render() {
        const columns = [{
            title: "品牌",
            dataIndex: "plantBrandCode",
            key: "plantBrandCode",
            className:"table-align-center",
            width: "10%"
        }, {
            title: "公司代码",
            dataIndex: "plantId",
            key: "plantId",
            className:"table-align-center",
            width: "10%"
        }, {
            title: "商品代码",
            dataIndex: "skuId",
            key: "skuId",
            className:"table-align-center",
            width: "20%"
        }, {
            title: "调整库存",
            dataIndex: "adjustmentQty",
            key: "adjustmentQty",
            className:"table-align-center",
            width: "10%"
        }, {
            title: "调整后库存",
            dataIndex: "afterAdjustmentQty",
            key: "afterAdjustmentQty",
            className:"table-align-center",
            width: "10%"
        }, {
            title: "原因",
            dataIndex: "reason",
            key: "reason",
            className:"table-align-center",
            width: "20%"
        }, {
            title: "调整人",
            dataIndex: "committed.modifiedBy",
            key: "committed.modifiedBy",
            className:"table-align-center",
            width: "10%"
        }, {
            title: "调整日期",
            dataIndex: "adjustmentDate",
            key: "adjustmentDate",
            className:"table-align-center",
            width: "10%",
            render: text => text.substring(0,10)
        }
    ];
        const {searchCondition, currentPage} = this.state;
        const {adjustmentStockInfo, totalCount, loading} = this.props;
        const pageConfig = {
            defaultCurrent: 1,
            current: currentPage,
            defaultPageSize: 10,
            total: totalCount,
            onChange: this.pageOnChange
        };
        return (
            <Content>
                <Row>
                    <SearchAdjustmentStockHeader/>
                </Row>
                <Row>
                    <SearchCondition wrappedComponentRef={this.saveFormRef}
                                     onSubmit={this.onSubmit}
                                     searchCondition={searchCondition}
                    />
                </Row>
                <Row>
                    <Spin tip="Loading...." spinning={loading}>
                        <Table columns={columns}
                            dataSource={adjustmentStockInfo}
                            pagination={pageConfig}
                            {...config.tableStyle("Excel")}
                            rowKey={record => record.id}
                        />
                    </Spin>
                </Row>
            </Content>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        adjustmentStockInfo: state.adjustmentStockInfo.adjustmentStockInfo,
        totalCount: state.adjustmentStockInfo.totalCount
    })
};
export default connect(mapStateToProps, {
    loadAdjustmentStock, clearStocksInfo
})(SearchAdjustmentStock);