import React from 'react';
import { connect } from 'react-redux';
import { Table, Row, Col } from 'antd';
import Trend from 'ant-design-pro/lib/Trend';

class ProductsInspectionList extends React.Component {
    render() {
        const { productsInspectionList } = this.props;
        const styles = {
            borderLine: { margin: "10px" },
            btnMargin: { marginRight: "5px" },
        };
        const columns = [
            {
                title: "交货号",
                dataIndex: "eHubDeliveryNo",
                key: "eHubDeliveryNo",
            }, {
                title: "品牌",
                dataIndex: "brand",
                key: "brand",
            }, {
                title: "商品代码",
                dataIndex: "skuId",
                key: "skuId",
                width: "28%"
            }, {
                title: "预数量",
                dataIndex: "preliminaryQty",
                key: "preliminaryQty",
            }, {
                title: "数量",
                dataIndex: "normalQty",
                key: "normalQty"
            }, {
                title: "差数量",
                dataIndex: "differenceQty",
                key: "differenceQty",
                render: (differenceQty, record) => {
                    const flag = record.differenceQty === 0 ? '' : record.differenceQty > 0 ? 'up' : 'down';
                    return record.differenceQty || record.differenceQty === 0 ? <Trend flag={flag}>{differenceQty}</Trend> 
                        : <span><b>还不确定</b></span>
                }
            }
        ];
        const productMasterInfoVisible = productsInspectionList.length > 0;
        const deliveryNo = productMasterInfoVisible ? productsInspectionList[0].eHubDeliveryNo : "";
        const boxNo = productMasterInfoVisible ? productsInspectionList[0].boxNo : "";
        const deliveryIndex = productMasterInfoVisible ? productsInspectionList[0].deliveryIndex : "";
        const rowSelection = {
            selectedRowKeys: this.props.selectedProductRowKeys,
            onChange: this.props.handleCheckedProductRow,
            hideDefaultSelections: true
        };

            return <div>
                <Row type="flex" justify="space-between"
                     style={{...styles.borderLine}} className="table-operations">
                    <Col style={{ display: productMasterInfoVisible ? "block" : "none" }}>
                        <b> BoxNo: </b>
                        <span id="boxNo">{boxNo}</span>
                        <span id="deliveryIndex" style={{display: "none"}}>{deliveryIndex}</span>
                    </Col>
                </Row>
                <Table style={{...styles.borderLine}}
                        dataSource={productsInspectionList}
                        rowSelection={rowSelection}
                        columns={columns}
                        rowKey={record => record.skuId+'&'+record.eHubDeliveryNo}
                />
        </div>
        return (
            <div>
                {pageInfo}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        productsInspectionList: state.receiptDeliveryList.productsInspectionList,
        modifyingProductInfo: state.receiptDeliveryList.modifyingProductInfo,
        receiptDeliveries: state.receiptDeliveryList.receiptDeliveries
    });
};
export default connect(mapStateToProps, {
})(ProductsInspectionList);