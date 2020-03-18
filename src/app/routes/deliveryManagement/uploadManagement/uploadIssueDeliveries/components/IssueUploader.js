import React from 'react';
import {connect} from 'react-redux';

import {Button, Form, Icon, Popconfirm, Row, Select, Upload} from 'antd';
import {ExcelProcess} from '../../util/excelProcess';
import {initializeEHubMaster} from '../../../../service';
import {confirmWorkDeliveries} from '../../reducer/uploadMnagementReducer';
import EHubBrandCodeSelector from '../../../../../components/formItem/EHubBrandCodeSelector';
import {makeQueryParams} from "../../../../../util/httpUtil";
import UserInfoEntity from "../../../../../entities/UserInfoEntity";
import globalStore from "../../../../../store/configureStore";
import DownloadExcelTemplate from "../../../../../components/excel/DownloadExcelTemplate";

const FormItem = Form.Item;
const Option = Select.Option;

class IssueUploader extends React.Component {
    constructor(props) {
        super(props);
        this.eHubMaster = initializeEHubMaster();
        this.state = {
            selectedBrand: this.eHubMaster.brandList[0].brandCode,
            uploadFile: null,
            selectedShipmentPlant: '',
            selectedShipmentPlantType: '',
            plantFilterList: this.eHubMaster.plantList.filter(item => this.eHubMaster.layoutInfo.UserInfo.colleague.brands[0].brandCode.indexOf(item.brandCode) !== -1),
        };
    }

    beforeUpload = (file) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        this.setState({uploadFile: file})
    };
    uploadStatusTracer = ({file, fileList, event}) => ExcelProcess.uploadStatusTracer(file, "SHIPMENT");

    handleEHubBrandsChange = (selectedBrand) => {
        this.setState({
            selectedBrand: selectedBrand,
            plantFilterList: this.eHubMaster.plantList.filter(item => selectedBrand.indexOf(item.brandCode) !== -1),
        });
        this.props.form.resetFields(["receiptPlant"]);
    };
    handleEHubPlantsChange = (value) => {
        this.setState({
            selectedShipmentPlant: value,
            selectedShipmentPlantType: this.eHubMaster.plantList.filter(item => item.plantCode === value)[0].plantType
        });
    };

    render() {
        const {confirmWorkDeliveries} = this.props;
        const {uploadFile} = this.state;
        const {plantFilterList, selectedBrand, selectedShipmentPlantType, selectedShipmentPlant} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {xs: {span: 24}, sm: {span: 6}},
            wrapperCol: {xs: {span: 24}, sm: {span: 14}, md: {span: 6}}
        };
        const buttonLayout = {
            wrapperCol: {xs: {span: 24, offset: 0}, sm: {span: 14, offset: 6}}
        };
        const selectedValues = this.props.form.getFieldsValue(['brandCode', 'shipmentPlant', 'receiptPlant']);
        const queryString = makeQueryParams(
            ['brandCode', 'shipmentPlantId', 'receiptPlantId', 'createdBy'],
            {
                brandCode: selectedValues['brandCode'],
                shipmentPlantId: selectedValues['shipmentPlant'],
                receiptPlantId: selectedValues['receiptPlant'],
                createdBy: UserInfoEntity.getUserName()
            }
        );
        const uploadProps = {
            ...ExcelProcess.getCommonExcelProps('/work-deliveries;type=issue?' + queryString),
            beforeUpload: this.beforeUpload,
            data: { workDeliveryFile: uploadFile },
            onChange: this.uploadStatusTracer
        };
        const excelColumnsConfig = [ // download format
            {label: '快递', value: 'express'},
            {label: "运单号", value: "waybillNo"},
            {label: "箱号", value: "boxNo"},
            {label: "商品代码", value: "skuId"},
            {label: "数量", value: "qty"},
        ];
        const excelFileName = "eHubIssueDeliveryTemplate";
        return (
            <Form>
                <Row>
                    <div style={{float: 'right'}}>
                        <DownloadExcelTemplate columnConfigList={[excelColumnsConfig]}
                                               isTemplate={true}
                                               btnName={'出库模板Excel下载'}
                                               fileName={excelFileName}/>
                    </div>
                </Row>
                <EHubBrandCodeSelector refForm={this.props.form}
                                       span={6}
                                       onChange={this.handleEHubBrandsChange}
                                       formItemLayout={formItemLayout}
                                       notUseColumn={true}/>
                <FormItem
                    {...formItemLayout}
                    label="出库地"
                    hasFeedback
                >
                    {getFieldDecorator('shipmentPlant', {
                        rules: [{
                            required: true, message: '请输入出库地!',
                        }],
                    })(
                        <Select
                            id="shipmentPlant"
                            onChange={this.handleEHubPlantsChange}
                            placeholder="出库地"
                        >
                            {plantFilterList.map((plant, index) => <Option key={index} value={plant.plantCode.trim()}>{plant.plantName + '(' + plant.plantCode + ')'}</Option>) }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="入库地"
                    hasFeedback
                >
                    {getFieldDecorator('receiptPlant', {
                        rules: [{
                            required: true, message: '请输入入库地!',
                        }]
                    })(
                        <Select
                            id="receiptPlant"
                            placeholder="入库地"
                            showSearch
                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                        >
                            {
                                this.eHubMaster.allPlantList.filter(plant => plant.brandCode === selectedBrand && plant.plantCode !== selectedShipmentPlant && !(plant.plantType === 'BRW' && plant.returnPlant === false)
                                    && !(selectedShipmentPlantType === 'STD' && plant.plantType === 'OFS')).map((plant, index) =>
                                    <Option key={index} value={plant.plantCode.trim()}>{plant.plantName + '(' + plant.plantCode + ')'}</Option>) }
                        </Select>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="Excel"
                >
                    {getFieldDecorator('issueReceiptExcel', {
                        rules: [{required: true, message: '请上传excel!'}],
                    })(
                        <Upload {...uploadProps}>
                            <Button>
                                <Icon type="upload" /> 出库信息上传
                            </Button>
                        </Upload>
                    )}
                </FormItem>
                <FormItem {...buttonLayout}>
                    <Popconfirm title="是否出库确认?" onConfirm={confirmWorkDeliveries}>
                        <Button type="primary" size='default' htmlType="submit">
                            出库确认
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
})(Form.create()(IssueUploader));