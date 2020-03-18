import React from 'react';
import {connect} from 'react-redux';

import {Button, Form, Icon, Popconfirm, Row, Upload} from 'antd';
import {ExcelProcess} from '../../util/excelProcess';
import {confirmWorkDeliveries} from '../../reducer/uploadMnagementReducer';
import {makeQueryParams} from '../../../../../util/httpUtil';
import UserInfoEntity from '../../../../../entities/UserInfoEntity';
import globalStore from '../../../../../store/configureStore';
import DownloadExcelTemplate from '../../../../../components/excel/DownloadExcelTemplate';

const FormItem = Form.Item;

class IssueReceiptUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {uploadFile: null};
    }

    beforeUpload = (file) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        this.setState({uploadFile: file})
    };
    uploadStatusTracer = ({file, fileList, event}) => ExcelProcess.uploadStatusTracer(file, "REGISTRATION");

    render() {
        const {confirmWorkDeliveries} = this.props;
        const {uploadFile} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { xs: { span: 24 }, sm: { span: 6 } },
            wrapperCol: { xs: { span: 24 }, sm: { span: 14 } }
        };
        const buttonLayout = {
            wrapperCol: { xs: { span: 24, offset: 0 }, sm: { span: 14, offset: 6 } }
        };
        const queryString = makeQueryParams(
            ['createdBy', 'shippingCompanyId'],
            {createdBy: UserInfoEntity.getUserName(), shippingCompanyId: 1005} // todo 택배사 코드 처리방법 협의 필요함.
        );
        const uploadProps = {
            ...ExcelProcess.getCommonExcelProps('/work-deliveries;type=issue-receipt?' + queryString),
            beforeUpload: this.beforeUpload,
            data: { workDeliveryFile: uploadFile },
            onChange: this.uploadStatusTracer
        };
        const excelColumnsConfig = [ // download format
            {label: '快递', value: 'shippingCompanyId'},
            {label: '出库地', value: 'shipmentPlantId'},
            {label: "入库地", value: "receiptPlantId"},
            {label: "品牌", value: "plantBrandCode"},
            {label: "运单号", value: "waybillNo"},
            {label: "入库箱号", value: "boxNo"},
            {label: "商品代码", value: "skuId"},
            {label: "入库确定数量", value: "receiptQty"},
        ];
        const excelFileName = "eHubIssueReceiptDeliveryTemplate";
        return (
            <Form>
                <Row>
                    <div style={{float: 'right'}}>
                        <DownloadExcelTemplate columnConfigList={[excelColumnsConfig]}
                                               isTemplate={true}
                                               btnName={'入出库模板Excel下载'}
                                               fileName={excelFileName}/>
                    </div>
                </Row>
                <FormItem
                    {...formItemLayout}
                    label="Excel"
                >
                    {getFieldDecorator('issueReceiptExcel', {
                        rules: [{ required: true, message: '请上传excel!' }],
                    })(
                        <Upload {...uploadProps}>
                            <Button>
                                <Icon type="upload" /> 入出库信息上传
                            </Button>
                        </Upload>
                    )}
                </FormItem>
                <FormItem {...buttonLayout}>
                    <Popconfirm title="是否入出库确认?" onConfirm={confirmWorkDeliveries}>
                        <Button type="primary" size='default' htmlType="submit">
                            入出库确认
                        </Button>
                    </Popconfirm>
                </FormItem>
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
})(Form.create()(IssueReceiptUploader));