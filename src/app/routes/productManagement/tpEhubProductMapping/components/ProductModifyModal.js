import React from 'react';
import {connect} from 'react-redux';
import {Button, Col, Form, Input, Modal, Row, notification} from 'antd';
import {searchTpPlantDelivery} from '../reducer/searchTpPlantDeliveryReducer';
import TpProductEntity from '../../searchTPOutOfStockHeader/entity/TpProductEntity';
import {setModalVisible} from '../../../../reducer/commonReducer';

import globalStore from 'store/configureStore';
import UserInfoEntity from '../../../../entities/UserInfoEntity';
import {ExcelProcess} from '../../../deliveryManagement/uploadManagement/util/excelProcess';
import { config } from 'config/config';
import {RequestEntity} from '../../../../../app/entities';

const FormItem = Form.Item;
const BASE_URL = config.serverInfo;

class ProductModifyModal extends React.Component {
    beforeUpload = (file) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        this.setState({uploadFile: file})
    };

    handleOk = () => {
        const {row, form} = this.props;
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        const url = `${BASE_URL}/tp-plant-delivery`;
        const body = [{
            brandCode: row.brandCode,
            sourceProductCode: row.productId,
            targetProductCode: form.getFieldValue('modifyProductId'),
            modifiedBy: UserInfoEntity.getUserName()
        }];
        return new RequestEntity("PUT", url, "getTpPlantDelivery", body)
            .then(res => {
                globalStore.dispatch({type: "SET_LOADING", payload: false});
                if (res.status === 400) {
                    notification['warning']({
                        message: '更新失败',
                        description: "输入的商品代码错误" + form.getFieldValue('modifyProductId'),
                        duration: null
                    });
                    return;
                }
                if (res.status === 200) {
                    notification['success']({
                        message: "商品代码修改成功",
                        description: row.productId + "=>" + form.getFieldValue('modifyProductId') + " 修改成功",
                        duration: null
                    });
                    setModalVisible(false);
                }
            })

    };

    handleCancel = () => {
        const {setModalVisible} = this.props;
        setModalVisible(false);
    };
    uploadStatusTracer = ({file, fileList, event}) => ExcelProcess.uploadStatusTracer(file, "MODIFY_PRODUCT_CODES");

    constructor(props) {
        super(props);
        this.state = {uploadByExcel: false, uploadFile: null}
    }

    render() {
        const {visible, loading} = this.props;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const submitBtn = 
            <Button key="submit" type="primary" size="large" loading={loading} onClick={this.handleOk}>
                修改
            </Button>;
        return (
            <div>
                <Modal
                    visible={visible}
                    title="修改错误商品代码"
                    onOk={this.handleOk}
                    onCancel={this.handleCancel}
                    footer={[<Button key="back" size="large" onClick={this.handleCancel}>返回</Button>, submitBtn]}
                >
                    <Row type="flex" justify="center" align="middle">
                        <Col span={18}>
                                <Form onSubmit={this.onSubmit}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="TP商品代码"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('productId', {})(
                                            <h3>{TpProductEntity.getTpProductId()}</h3>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="修改商品代码"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('modifyProductId', {
                                            rules: [{
                                                required: true, message: 'Please input modified productId!',
                                            }],
                                        })(
                                            <Input type="text"/>
                                        )}
                                    </FormItem>
                                </Form>
                        </Col>
                    </Row>
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        visible: state.commonReducer.visible,
        tpPlantDeliveries: state.searchTpPlantDelivery.tpPlantDeliveries
    });
};
export default connect(mapStateToProps, {
    searchTpPlantDelivery, setModalVisible
})(Form.create()(ProductModifyModal));