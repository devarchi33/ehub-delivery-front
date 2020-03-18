/**
 * Created by donghoon 2017-10-13
 */
import React from 'react';
import {connect} from 'react-redux';

import {Layout, Row, Spin, Table} from 'antd';
import {SearchCondition, SearchProductInfoHeader} from '../components/index';
import {getProductInfo} from '../service/index'
import '../searchProduct.css'

import globalStore from 'store/configureStore';

const {Content} = Layout;

export class SearchProductInfoContainer extends React.Component {
    constructor(pros) {
        super(pros);
        this.state = {
            productInfos: [],
            searchProductCode: ""
        }
    }
    onSubmit = (e) => {
        e.preventDefault();
        const {productCode} = this.state;
        const ref = this;
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        getProductInfo(productCode)
            .then(res => {
                globalStore.dispatch({type: "SET_LOADING", payload: false});
                ref.setState({
                    searchProductCode: "",
                    productInfos: res.items.map((product, index) => {
                        return {...product, productCode: product.productCode + Math.floor(Math.random() * 100), key: index }
                    })
                });
            });
    };
    onRowClick = (record, index, event) => {
        this.setState({searchProductCode: record.productCode});
    };

    render() {
        const columns= [
            {
                title: "商品",
                dataIndex: "brandCode",
                key: "brandCode",
                className:"table-align-center"
            }, {
                title: "款式",
                dataIndex: "styleCode",
                key: "styleCode",
                className:"table-align-center"
            }, {
                title: "商品代码",
                dataIndex: "productCode",
                key: "productCode",
                className:"table-align-center"
            }, {
                title: "库存数量",
                dataIndex: "count",
                key: "count",
                className:"table-align-center"
            }
        ];
        const {searchProductCode, productInfos} = this.state;
        const {loading} = this.props;
        return (
            <Content>
                <Row>
                    <SearchProductInfoHeader/>
                </Row>
                <Row>
                    <SearchCondition onSubmit={this.onSubmit}
                                     searchProductCode={searchProductCode}/>
                </Row>
                <Row>
                    <Spin tip="Loading...." spinning={loading}>
                        <Table columns={columns}
                               dataSource={productInfos}
                               onRowClick={this.onRowClick}
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
})(SearchProductInfoContainer);