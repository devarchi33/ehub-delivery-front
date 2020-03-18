import React from 'react';
import {connect} from 'react-redux';

import {Button, Form, Select, Icon, Popconfirm, Row, Upload} from 'antd';
import globalStore from 'store/configureStore';

import {ExcelProcess} from '../../util/excelProcess';
import {initializeEHubMaster} from '../../../../service';
import {confirmWorkTpPlantDeliveries} from '../../reducer/uploadMnagementReducer';
import EHubClosingDateSelector from '../../../../../components/formItem/EHubClosingDateSelector';
import EHubBrandCodeSelector from '../../../../../components/formItem/EHubBrandCodeSelector';
import TpDeliveryTypeSelector from '../../../../../components/formItem/TpDeliveryTypeSelector';
import {makeQueryParams} from '../../../../../util/httpUtil';
import UserInfoEntity from '../../../../../entities/UserInfoEntity';
import EHubDeliveryUtil from '../../../../../util/EHubDeliveryUtil';
import DownloadExcelTemplate from "../../../../../components/excel/DownloadExcelTemplate";
import PlatformEntity from '../../../../../entities/PlatformCodeEntity';

const FormItem = Form.Item;
const Option = Select.Option;

class TpPlantDeliveryUploader extends React.Component {
    constructor(props) {
        super(props);
        this.eHubMaster = initializeEHubMaster();
        this.state = {uploadFile: null};
    }

    beforeUpload = (file) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        this.setState({uploadFile: file})
    };
    uploadStatusTracer = ({file, fileList, event}) => ExcelProcess.uploadStatusTracer(file, this.props.form.getFieldValue("tpDeliveryType"), this.props.form.getFieldValue("platformCode"));

    render() {
        const {form, confirmWorkTpPlantDeliveries} = this.props;
        const {uploadFile} = this.state;
        const {getFieldDecorator} = form;
        const formItemLayout = {
            labelCol: {xs: {span: 24}, sm: {span: 6}},
            wrapperCol: {xs: {span: 24}, sm: {span: 14}, md: {span: 6}}
        };
        const buttonLayout = {
            wrapperCol: {xs: {span: 24, offset: 0}, sm: {span: 14, offset: 6}}
        };
        const selectedBrandCode = form.getFieldValue("brandCode") ? form.getFieldValue("brandCode") : this.eHubMaster.brandList[0].brandCode;
        const filteredPlantIdList = this.eHubMaster.plantList.filter(item => (selectedBrandCode.indexOf(item.brandCode) !== -1 && item.plantType === 'TPW'));
        const queryString = makeQueryParams(
            ['tpDeliveryType', 'closingDate', 'platformCode', 'brandCode', 'tpPlantId', 'createdBy'],
            {
                tpDeliveryType: form.getFieldValue("tpDeliveryType") ? form.getFieldValue("tpDeliveryType") : 'OS',
                closingDate: form.getFieldValue("closingDate") ? form.getFieldValue("closingDate").format('YYYYMMDD') : EHubDeliveryUtil.daysAgo(1).format('YYYYMMDD'),
                platformCode: form.getFieldValue("platformCode"),
                brandCode: selectedBrandCode,
                tpPlantId: filteredPlantIdList[0]['plantCode'],
                createdBy: UserInfoEntity.getUserName()
            }
        );
        const uploadProps = {
            ...ExcelProcess.getCommonExcelProps('/work-tp-plant-deliveries?' + queryString),
            beforeUpload: this.beforeUpload,
            data: {workTpPlantDeliveryFile: uploadFile},
            onChange: this.uploadStatusTracer
        };
        const excelColumnsConfig = [ // download format
            {label: '快递', value: 'shippingCompanyId'},
            {label: "运单号", value: "shippingNo"},
            // {label: "确认时间", value: "confirmTime"}, todo 这个字段要是 Excel上输入的话，需要用户确认
            {label: "商品代码", value: "productId"},
            {label: "数量", value: "qty"},
            {label: "平台订单编号", value: "platformOrderId"},
            {label: "交易号", value: "tradeId"}
        ];
        const excelFileName = "tpPlantDeliveryTemplate";
        return (
            <Form>
                <Row>
                    <div style={{float: 'right'}}>
                        <DownloadExcelTemplate columnConfigList={[excelColumnsConfig]}
                                               isTemplate={true}
                                               btnName={'补充入出库模板Excel下载'}
                                               fileName={excelFileName}/>
                    </div>
                </Row>
                <TpDeliveryTypeSelector refForm={this.props.form} formItemLayout={formItemLayout} notUseColumn={true}/>
                <EHubBrandCodeSelector refForm={this.props.form} formItemLayout={formItemLayout} notUseColumn={true}/>
                <FormItem
                    {...formItemLayout}
                    label="平台"
                    hasFeedback
                >
                    {getFieldDecorator('platformCode', {
                        rules: [{required: true, message: '请输入平台!'}],
                        initialValue: PlatformEntity.findAllBrandDistinctPlatformList().filter(item => item.ehubBrandCode === selectedBrandCode)[0] ? PlatformEntity.findAllBrandDistinctPlatformList().filter(item => item.ehubBrandCode === selectedBrandCode)[0].platformCode : ''
                    })(
                        <Select placeholder="平台" >
                            {PlatformEntity.findAllBrandDistinctPlatformList().filter(item => item.ehubBrandCode === selectedBrandCode).map(platform => <Option key={platform.platformCode} value={platform.platformCode}>{platform.platformName}</Option>)}
                        </Select>
                    )}
                </FormItem>
                <EHubClosingDateSelector refForm={this.props.form} formItemLayout={formItemLayout} notUseColumn={true}/>
                <FormItem
                    {...formItemLayout}
                    label="Excel"
                >
                    {getFieldDecorator('tpPlantDeliveryExcel', {
                        rules: [{required: true, message: '请上传excel!'}],
                    })(
                        <Upload {...uploadProps}>
                            <Button>
                                <Icon type="upload"/> 补充入出库上传
                            </Button>
                        </Upload>
                    )}
                </FormItem>
                <FormItem {...buttonLayout}>
                    <Popconfirm title="是否补充入出库确认?" onConfirm={confirmWorkTpPlantDeliveries}>
                        <Button type="primary" size='default' htmlType="submit">
                            补充入出库确认
                        </Button>
                    </Popconfirm>
                </FormItem>
            </Form>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({});
};
export default connect(mapStateToProps, {
    confirmWorkTpPlantDeliveries
})(Form.create()(TpPlantDeliveryUploader));