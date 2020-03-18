import React from 'react';
import {connect} from 'react-redux';
import {Layout, Row, Col, Table, Radio} from 'antd';
import Trend from 'ant-design-pro/lib/Trend';
const {Content} = Layout;

import {CompareStockHeader, SearchCondition}from '../components/index';
import {config} from 'config/config';


import '../compareStock.css';
import {searchCompareStock, clearStocks} from '../reducer/compareStockReducer';

class CompareStock extends React.Component {
    constructor(props) {
        super(props);
        this.state = {searchType: 'common'};
    }

    componentDidMount(){
        const {clearStocks} = this.props;
        clearStocks();
    }

    onSubmit = (e) => {
        e.preventDefault();
        this.formRef.props.form.validateFields((err, values) => {
            if(!err) {
                const {searchCompareStock} = this.props;
                const {searchType} = this.state;
                const {form} = this.formRef.props; // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
                const params = form.getFieldsValue(['brandCode', 'plant','productId']);
                searchCompareStock(params['brandCode'], params['plant'], params['productId'], searchType);
            } else {
                return;
            }
        })
    };

    saveFormRef = (SearchConditionComponent) => this.formRef = SearchConditionComponent;

    onSearchTypeChange = (e) => {
        const {clearStocks, searchCompareStock} = this.props;
        clearStocks();
        this.setState({searchType: e.target.value}, () => {
            const {form} = this.formRef.props;
            const {searchType} = this.state;
            const params = form.getFieldsValue(['brandCode', 'plant','productId']);
            searchCompareStock(params['brandCode'], params['plant'], params['productId'], searchType);
        });
    };

    render() {
        const {loading, compareStocks} = this.props;
        const {searchType} = this.state;
        const compareStockColumns = [
            {
                title: 'eHUB和TP库存对比（商品代码相同）',
                children: [ 
                    {
                        title: '款号',
                        dataIndex: 'styleCode',
                        key: 'styleCode',
                        width: '25%'
                    }, {
                        title: '商品代码',
                        dataIndex: 'skuId',
                        key: 'skuId',
                        width: '20%'
                    }, {
                        title: 'eHUB可用数量',
                        dataIndex: 'availableQty',
                        key: 'availableQty',
                        width: '15%'
                    }, {
                        title: 'TP可用数量',
                        dataIndex: 'tpAvailableQty',
                        key: 'tpAvailableQty',
                        width: '15%'
                    }, {
                        title: '误差数量',
                        dataIndex: 'differenceQty',
                        key: 'differenceQty',
                        width: '15%',
                        render: (differenceQty, record) => {
                            const flag = record.isMoreThanTp ? 'up' : record.isLessThanTp ? 'down' : '';
                            return <Trend flag={flag}>{differenceQty < 0 ? differenceQty * -1 : differenceQty}</Trend>;
                        },
                        sorter: (a, b) => a.differenceQty - b.differenceQty,
                    }
                ]
            }
        ];

        const onlyEHubStockColumns = [
            {
                title: '只存在于eHUB的商品代码',
                children: [
                    {
                        title: '款号',
                        dataIndex: 'styleCode',
                        key: 'styleCode',
                        width: '25%'
                    }, {
                        title: '商品代码',
                        dataIndex: 'skuId',
                        key: 'skuId',
                        width: '30%'
                    }, {
                        title: 'eHub可用数量',
                        dataIndex: 'availableQty',
                        key: 'availableQty',
                        width: '15%'
                    }
                ]
            }
        ];

        const onlyTpStockColumns = [
            {
                title: '只存在于TP的商品代码',
                children: [
                    {
                        title: 'TP截止日期',
                        dataIndex: 'closingDt',
                        key: 'closingDt',
                        width: '20%'
                    }, {
                        title: '款号',
                        dataIndex: 'styleCode',
                        key: 'styleCode',
                        width: '20%',
                        render: (styleCode) => styleCode ?  styleCode : "无款号"
                    }, {
                        title: 'ehub商品代码',
                        dataIndex: 'compareId',
                        key: 'compareId',
                        width: '20%'
                    }, {
                        title: 'Tp商品代码',
                        dataIndex: 'skuId',
                        key: 'skuId',
                        width: '20%'
                    }, {
                        title: 'Tp可用数量',
                        dataIndex: 'availableQty',
                        key: 'availableQty',
                        width: '20%'
                    }
                ]
            }
        ];

        const columns = searchType === "common" ? compareStockColumns
            : searchType === "onlyEhub" ? onlyEHubStockColumns
                : searchType === "onlyTp" ?  onlyTpStockColumns : onlyTpStockColumns.map(scheme => {
                    return {...scheme, title: 'TP原库存'}
                });

        return (
            <Content>
                <Row>
                    <CompareStockHeader/>
                </Row>
                <Row>
                    <Col span={24}>
                        <SearchCondition wrappedComponentRef={this.saveFormRef}
                                         onSubmit={this.onSubmit}
                        />
                    </Col>
                </Row>
                <Row style={{marginBottom: 10}}>
                    <Col span={16}>
                        <Radio.Group onChange={this.onSearchTypeChange} defaultValue="common">
                            <Radio value="common">eHUB和TP库存对比(商品代码相同)</Radio>
                            <Radio value="onlyEhub">只存在于eHUB的商品代码</Radio>
                            <Radio value="onlyTp">只存在于TP的商品代码</Radio>
                            <Radio value="rawTp">TP原库存</Radio>
                        </Radio.Group>
                    </Col>
                </Row>
                <Row gutter={20} type="flex" justify="center" align="top">
                    <Col span={24}>
                        <Table columns={columns}
                               dataSource={compareStocks}
                               loading={{tip: "查询中...", spinning: loading}}
                               pagination={config.pageConfig({compareStocks})}
                               rowKey={record => record.skuId}
                        />
                    </Col>
                </Row>

            </Content>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        compareStocks: state.compareStock.compareStocks
    });
};
export default connect(mapStateToProps, {
    searchCompareStock, clearStocks
})(CompareStock);