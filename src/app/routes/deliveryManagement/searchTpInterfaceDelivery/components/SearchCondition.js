import React from 'react';
import {connect} from 'react-redux';
import {Button, Col, Form, Input, Row, Select} from 'antd';
import EHubDeliveryUtil from 'util/EHubDeliveryUtil';
import {EHubSearchRangePicker} from 'components/formItem'

import EHubBrandCodeSelector from '../../../../components/formItem/EHubBrandCodeSelector';
import TpDeliveryTypeSelector from '../../../../components/formItem/TpDeliveryTypeSelector';
import DownloadExcelTemplate from '../../../../components/excel/DownloadExcelTemplate';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchCondition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {selectedBrand: ''}
    }

    brandChange = (brand) => this.setState({selectedBrand: brand});

    validateInput = (rule, value, callback) => {
        if (!value) {
            callback();
        } else if (value.replace(/^[A-Za-z0-9]+$/g,'') !== '') {
            callback('输入非法字符,请重新输入!');
        } else {
            callback();
        }
    };

    render() {
        const {tpInterfaceDeliveries} = this.props;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        const excelColumnsConfig = [
            {label: "品牌", value: "brandCode"},
            {label: "出库地", value: "shipmentPlantId"}, {label: "入库地", value: "receiptPlantId"},
            {label: "商品代码", value: "skuId"}, {label: "总确定数量", value: "normalQty"}
        ];
        const excelFileName = "TpInterfaceDelivery";
        const today = EHubDeliveryUtil.daysAgo(0, 'YYYY/MM/DD');
        const startDate = EHubDeliveryUtil.daysAgo(7, 'YYYY/MM/DD');    // a week ago
        return(
            <Form onSubmit={this.props.onSubmit}>
                <legend>{"查询条件"}</legend>
                <Row gutter={8}>
                    <EHubBrandCodeSelector refForm={this.props.form} span={5} onChange={this.brandChange}/>
                    <Col span={5}>
                        <FormItem
                            {...formItemLayout}
                            label="款号"
                            hasFeedback
                        >
                            {getFieldDecorator('styleCode', {
                                rules: [{ required: false }, { validator: this.validateInput }],
                                initialValue: ''
                            })(
                                <Input placeholder="款号" />
                            )}
                        </FormItem>
                    </Col>
                    <TpDeliveryTypeSelector refForm={this.props.form} span={5} formKey='sapDeliveryType'/>
                    <EHubSearchRangePicker refForm={this.props.form} initialValue={[startDate, today]} label='SAP传送'
                                           span={9}/>
                </Row>
                <Row gutter={8}>
                    <Col span={1} offset={22}>
                        <Button type="primary" htmlType="submit" >查询</Button>
                    </Col>
                    <Col span={1}>
                        <DownloadExcelTemplate columnConfigList={[excelColumnsConfig]}
                                               sheetDataList={[tpInterfaceDeliveries]}
                                               fileName={excelFileName}/>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        tpInterfaceDeliveries: state.searchTpInterfaceDelivery.tpInterfaceDeliveries
    })
};
export default connect(mapStateToProps, {
})(Form.create()(SearchCondition));
