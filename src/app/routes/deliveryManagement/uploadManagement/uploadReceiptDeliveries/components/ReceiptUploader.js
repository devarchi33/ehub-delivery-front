import React from 'react';
import {connect} from 'react-redux';

import {Button, Form, Icon, Popconfirm, Upload} from 'antd';
import {ExcelProcess} from '../../util/excelProcess';
import {confirmWorkDeliveries} from '../../reducer/uploadMnagementReducer';
import {makeQueryParams} from "../../../../../util/httpUtil";
import UserInfoEntity from "../../../../../entities/UserInfoEntity";
import globalStore from "../../../../../store/configureStore";

const FormItem = Form.Item;

class ReceiptUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {uploadFile: null}
    }

    beforeUpload = (file) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        this.setState({uploadFile: file})
    };
    uploadStatusTracer = ({file, fileList, event}) => ExcelProcess.uploadStatusTracer(file, "RECEIPT");

    render() {
        const {confirmWorkDeliveries} = this.props;
        const {uploadFile} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {xs: {span: 24}, sm: {span: 6}},
            wrapperCol: {xs: {span: 24}, sm: {span: 14}, md: {span: 6}}
        };
        const buttonLayout = {
            wrapperCol: {xs: {span: 24, offset: 0}, sm: {span: 14, offset: 6}}
        };
        const queryString = makeQueryParams(['createdBy'], {createdBy: UserInfoEntity.getUserName()});
        const uploadProps = {
            ...ExcelProcess.getCommonExcelProps('/work-deliveries;type=inspect?' + queryString),
            beforeUpload: this.beforeUpload,
            data: {workDeliveryFile: uploadFile},
            onChange: this.uploadStatusTracer
        };
        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="Excel"
                >
                    {getFieldDecorator('receiptReceiptExcel', {
                        rules: [{required: true, message: '请上传excel!'}],
                    })(
                        <Upload {...uploadProps}>
                            <Button>
                                <Icon type="upload" /> 入库信息上传
                            </Button>
                        </Upload>
                    )}
                </FormItem>
                <FormItem {...buttonLayout}>
                    <Popconfirm title="是否入库确认?" onConfirm={confirmWorkDeliveries}>
                        <Button type="primary" size='default' htmlType="submit">
                            入库确认
                        </Button>
                    </Popconfirm>
                </FormItem>
                <label style={{color:"red",fontWeight:"bold",float:"right"}}>温馨提示：请确保您所上传的箱子中的商品信息准确无误，确认完成后将不可修改!</label>
            </Form>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
    });
};
export default connect(mapStateToProps, {
    confirmWorkDeliveries
})(Form.create()(ReceiptUploader));