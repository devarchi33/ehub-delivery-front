import React from 'react';
import { connect } from 'react-redux';

import { Table, Row, Col } from 'antd';

class PackingProductList extends React.Component {
    render() {
        const { packingProducts } = this.props;
        const existsPackingProducts = packingProducts.length > 0;
        const styles = {
            borderLine: { margin: "10px" },
            widthClear: { width: "auto" },
            fieldMargin: { margin: "10px" },
            visible: { display: existsPackingProducts ? "block": "none" }
        };
        const columns = [
            {
                title: "交货号",
                dataIndex: "eHubDeliveryNo",
                key: "eHubDeliveryNo"
            }, {
                title: "品牌",
                dataIndex: "brand",
                key: "brand"
            }, {
                title: "商品",
                dataIndex: "skuId",
                key: "skuId"
            }, {
                title: "出库地",
                dataIndex: "shipmentPlantId",
                key: "shipmentPlantId"
            }, {
                title: "入库地",
                dataIndex: "receiptPlantId",
                key: "receiptPlantId"
            },{
                title: "数量",
                dataIndex: "qty",
                key: "qty"
            }
        ];
        const totalQty = packingProducts.reduce((initVal, product) => {
                return initVal + product.qty;
            }, 0);
        const invoiceNo = existsPackingProducts ? packingProducts[0].waybillNo : "";
        const boxNo = existsPackingProducts ? packingProducts[0].boxNo : "";

        return (
            <div>
                <Row type="flex" style={{...styles.borderLine, ...styles.visible}}>
                    <Col>
                        <b>箱号: </b>
                        <span style={{...styles.fieldMargin}}>{boxNo}</span>
                        <b>总出库数量: </b>
                        <span style={{...styles.fieldMargin}}>{totalQty}</span>
                    </Col>
                </Row>
                <Table style={styles.borderLine}
                       dataSource={packingProducts}
                       columns={columns}
                       rowKey={record => record.skuId+'&'+record.eHubDeliveryNo}
                />
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        packingProducts: state.issuedDeliveryList.packingProducts,
    });
};
export default connect(mapStateToProps, {
// reducer function
})(PackingProductList);