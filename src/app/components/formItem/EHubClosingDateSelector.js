import React from 'react';
import {Col, DatePicker, Form} from 'antd';
import PropTypes from 'prop-types';
import EHubDeliveryUtil from "../../util/EHubDeliveryUtil";

const FormItem = Form.Item;

const EHubClosingDateSelector = (props) => {
    const {getFieldDecorator} = props.refForm;
    const formItemLayout = props.formItemLayout ? props.formItemLayout : {
        labelCol: {span: 4},
        wrapperCol: {span: 20}
    };
    const EhubFormItem = () => <FormItem
        {...formItemLayout}
        label="TP截止日期"
        hasFeedback
    >
        {getFieldDecorator('closingDate', {
            rules: [{required: true}],
            initialValue: EHubDeliveryUtil.daysAgo(1, 'YYYYMMDD')
        })(
            <DatePicker placeholder={"日期"} onChange={props.onChange ? props.onChange : () => {
            }}/>
        )}
    </FormItem>;
    const EhubClosingDateSelector = () => props.notUseColumn
        ? <EhubFormItem/>
        : <Col span={props.span ? props.span : 8}>
            <EhubFormItem/>
        </Col>;
    return (<EhubClosingDateSelector/>);
};

EHubClosingDateSelector.propTypes = {
    refForm: PropTypes.object.isRequired,
    span: PropTypes.number, // default = 8
    onChange: PropTypes.func, // default = () => {}
    formItemLayout: PropTypes.object, // default = formItemLayout
    notUseColumn: PropTypes.bool // default = false
};

export default EHubClosingDateSelector;