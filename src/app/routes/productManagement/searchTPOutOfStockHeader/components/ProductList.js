import React from 'react';
import {connect} from 'react-redux';
import {Button, Popconfirm, Row, Table} from 'antd';

import {config} from 'config/config';
import SearchCondition from './SearchCondition';
import ProductModifyModal from './ProductModifyModal';
import {searchTpPlantDelivery, resetUiState} from '../reducer/searchTpPlantDeliveryReducer';

import 'ant-design-pro/dist/ant-design-pro.css';
import TpProductEntity from '../entity/TpProductEntity';
import {registerTpProductCodeToGift} from '../../service';

import {setModalVisible} from '../../../../reducer/commonReducer';

class ProductList extends React.Component {

    componentDidMount(){
        const {resetUiState} = this.props;
        resetUiState();
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {searchTpPlantDelivery} = this.props;
        const {form} = this.formRef.props; // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
        const params = form.getFieldsValue(['brandCode','errorType','closingDate']);
        const closingDate = moment(params['closingDate']).format('YYYYMMDD');
        searchTpPlantDelivery(params['brandCode'], params['errorType'], closingDate);
    };

    saveFormRefs = (SearchConditionComponent) => this.formRef = SearchConditionComponent;

    editProductCode  = (key) => {
        const {tpPlantDeliveries, setModalVisible} = this.props;
        const {form} = this.formRef.props;
        setModalVisible(true);
        TpProductEntity.setTpProduct({...tpPlantDeliveries[key], skuBrandCode: form.getFieldValue('brandCode')});
    };

    registerGift = (key) => {
        const {tpPlantDeliveries} = this.props;
        const {form} = this.formRef.props;
        TpProductEntity.setTpProduct({...tpPlantDeliveries[key], skuBrandCode: form.getFieldValue('brandCode')});
        registerTpProductCodeToGift(this);
    };

    render() {
        const {tpPlantDeliveries, loading} = this.props;
        const styles = {
            borderLine: {margin: "10px"},
            btnMargin: {marginLeft: "5px"}
        };
        const columns = [
            {
                title: "品牌",
                dataIndex: "brandCode",
                key: "brandCode",
                width: "10%"
            }, {
                title: "商品代码",
                dataIndex: "productId",
                key: "productId",
                width: "20%"
            }, {
                title: "原因",
                dataIndex: "errorReason",
                key: "errorReason",
                width: "20%",
                render: (text) => {
                    if(text === 'Out of stock. Please try again after adjusting stock.') {
                        return TpProductEntity.OUT_OF_STOCK
                    } else {
                        return TpProductEntity.INVALID_PRODUCT
                    }
                }
            }, {
                title: 'operation',
                dataIndex: 'operation',
                render: (text, record) => {
                    return (
                        <div className="editable-row-operations">
                            {record.statusCode === "30" ? <Button onClick={() => this.editProductCode(record.key)}>修改</Button> : ''}
                            {<Popconfirm title="是否赠品登入?" onConfirm={() => this.registerGift(record.key)}>
                                <Button style={{marginLeft: 8}}>赠品登入</Button>
                            </Popconfirm>}
                        </div>
                    );
                },
            }
        ];
        if((tpPlantDeliveries.length > 0 && tpPlantDeliveries[0]['statusCode'] ==="32")) {
            columns.splice(3, 0, {
                title: "出库数量",
                dataIndex: "sumQty",
                key: "sumQty",
                sorter: (a, b) => a.sumQty - b.sumQty,
                width: "8%"
            });
            columns.splice(4, 0, {
                title: "可用库存",
                dataIndex: "availableStockQty",
                key: "availableStockQty",
                sorter: (a, b) => a.availableStockQty - b.availableStockQty,
                width: "8%"
            });
            columns.splice(5, 0, {
                title: "不足数量",
                dataIndex: "insufficientQty",
                key: "insufficientQty",
                sorter: (a, b) => a.insufficientQty - b.insufficientQty,
                width: "8%"
            });
            columns.splice(0, 0, {
                title: "TP截止日期",
                dataIndex: "closingDate",
                key: "closingDate",
                sorter: (a, b) => b.closingDate - a.closingDate,
                width: "8%",
                render: (text, record) => {
                    const parsedDate = moment(record.closingDate, 'YYYYMMDD').fromNow().split(" ");
                    const calculateDateFromToday = parsedDate[0];
                    const fontColorByClosingDate = calculateDateFromToday >= Number.parseInt("5") || parsedDate[1] !== '天前' ? '#C40F1F' : 'black';
                    return <p style={{color: fontColorByClosingDate}}>{text}</p>;
                }
            });
        }
        const pageConfig = config.pageConfig({tpPlantDeliveries});
        return (
            <div style={styles.borderLine}>
                <Row  style={{...styles.borderLine}}>
                    <SearchCondition onSubmit={this.handleSubmit} wrappedComponentRef={this.saveFormRefs}/>
                </Row>
                <Row>
                    <Table columns={columns}
                           dataSource={tpPlantDeliveries}
                           loading={{tip: "查询中...", spinning: loading}}
                           pagination={pageConfig}
                           {...config.tableStyle("")}
                    />
                    <ProductModifyModal/>
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        tpPlantDeliveries: state.searchTpPlantDelivery.tpPlantDeliveries
    });
};
export default connect(mapStateToProps, {
    searchTpPlantDelivery, setModalVisible, resetUiState
})(ProductList);