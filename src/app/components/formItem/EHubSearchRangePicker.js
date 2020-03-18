import React from 'react';
import {Col, Form, DatePicker} from 'antd';
import PropTypes from "prop-types";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

const disabledDate = (current) => {
    // Can not select days after today
    return current && current > moment().endOf('day');
};

const EHubSearchRangePicker = (props) => {
    const {getFieldDecorator} = props.refForm;
    const formItemLayout = {
        labelCol: {span: 4},
        wrapperCol: {span: 20}
    };
    return (
        <Col span={props.span ? props.span : 6}>
            <FormItem
                {...formItemLayout}
                label={props.label ? props.label : "日期"}
                hasFeedback
            >
                {getFieldDecorator('date', {
                    rules: [{type: 'array', required: true}],
                    initialValue: props.initialValue
                })(
                    <RangePicker placeholder={["从日期","到日期"]}
                                 disabledDate={props.disableDate ? props.disableDate : disabledDate}
                                 size={props.size ? props.size : "default"}/>
                )}
            </FormItem>
        </Col>
    );
};

EHubSearchRangePicker.propTypes = {
    refForm: PropTypes.object.isRequired,
    span: PropTypes.number, // default=6
    label: PropTypes.string, // default='日期'
    initialValue: PropTypes.array.isRequired,
    disableDate: PropTypes.func, //default Can not select days after today
    size: PropTypes.string // default='large'
};

export default EHubSearchRangePicker;