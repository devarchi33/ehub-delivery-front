import React from 'react';
import {connect} from 'react-redux';
import {Button, Col, Form, Icon, Input, Modal, Row, Switch, Upload} from 'antd';
import {searchTpPlantDelivery} from '../reducer/searchTpPlantDeliveryReducer';
import TpProductEntity from '../entity/TpProductEntity';
import {modifyTpProductCodeToEhubProductCode} from '../service';
import {setModalVisible} from '../../../../reducer/commonReducer';

import DownloadExcelTemplate from '../../../../components/excel/DownloadExcelTemplate';
import {makeQueryParams} from '../../../../util/httpUtil';
import UserInfoEntity from '../../../../entities/UserInfoEntity';
import {ExcelProcess} from '../../../deliveryManagement/uploadManagement/util/excelProcess';

const FormItem = Form.Item;

class ProductModifyModal extends React.Component {
    beforeUpload = (file) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        this.setState({uploadFile: file})
    };

    handleOk = () => {
        const {form} = this.props;
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        modifyTpProductCodeToEhubProductCode(form.getFieldValue('modifyProductId'), this).then(() => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
        });
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
        const {uploadByExcel, uploadFile} = this.state;
        const {visible, loading} = this.props;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const excelColumnsConfig = [ // download format
            {label: 'TP商品代码', value: 'tpProductCode'},
            {label: "EHub商品代码", value: "eHubProductCode"},
        ];
        const queryString = makeQueryParams(
            ['brandCode', 'createdBy'],
            {
                brandCode: this.props.form.getFieldValue('brandCode'),
                createdBy: UserInfoEntity.getUserName()
            }
        );
        const uploadProps = {
            ...ExcelProcess.getCommonExcelProps('/tp-plant-delivery/modify-by-excel?' + queryString),
            beforeUpload: this.beforeUpload,
            data: {mappingFile: uploadFile},
            onChange: this.uploadStatusTracer
        };
        const submitBtn = uploadByExcel ? null :
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
                    <Row style={{marginBottom: 6}}>
                        <Col span={4} offset={1}>
                            <div style={{float: 'right', display: uploadByExcel ? 'inline' : 'none'}}>
                                <DownloadExcelTemplate columnConfigList={[excelColumnsConfig]}
                                                       isTemplate={true}
                                                       btnName={'模板下载'}
                                                       fileName={'TpProductEHubProductMapping'}/>
                            </div>
                        </Col>
                        <Col span={2} offset={17}>
                            <Switch defaultChecked
                                    checkedChildren={<Icon type="file-excel"/>} unCheckedChildren={<Icon type="edit"/>}
                                    onChange={() => this.setState({uploadByExcel: !this.state.uploadByExcel})}/>
                        </Col>
                    </Row>
                    <Row type="flex" justify="center" align="middle">
                        <Col span={18}>
                            {uploadByExcel ?
                                <Form onSubmit={this.onSubmit}>
                                    <FormItem
                                        {...formItemLayout}
                                        label="品牌"
                                        hasFeedback
                                    >
                                        {getFieldDecorator('brandCode', {
                                            rules: [{required: true, message: '请输入品牌!'}],
                                            initialValue: TpProductEntity.getBrandCode()
                                        })(
                                            <Input disabled={true}/>
                                        )}
                                    </FormItem>
                                    <FormItem
                                        {...formItemLayout}
                                        label="Excel"
                                    >
                                        {getFieldDecorator('modifyProductExcel', {
                                            rules: [{required: true, message: '请上传excel!'}],
                                        })(
                                            <Upload {...uploadProps}>
                                                <Button>
                                                    <Icon type="upload"/> 修改Excel文件
                                                </Button>
                                            </Upload>
                                        )}
                                    </FormItem>
                                </Form> :
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
                                </Form>}
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