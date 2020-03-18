import React from 'react';
import {Col, Form, Select} from 'antd';
import PropTypes from 'prop-types';
import PlatformEntity from '../../entities/PlatformCodeEntity';

const FormItem = Form.Item;
const Option = Select.Option;

const TpDeliveryTypeSelector = (props) => {
    const {getFieldDecorator} = props.refForm;
    const formItemLayout = props.formItemLayout ? props.formItemLayout : {
        labelCol: {span: 4},
        wrapperCol: {span: 20}
    };
    const EhubFormItem = () => <FormItem
        {...formItemLayout}
        label="类型"
        hasFeedback
    >
        {getFieldDecorator(props.formKey ? props.formKey : 'tpDeliveryType', {
            rules: [{required: true}],
            initialValue: 'OS',
        })(
            <Select placeholder="类型"
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    optionFilterProp="children"
                    onChange={props.onChange ? props.onChange : () => {
                    }}
            >
                {PlatformEntity.tpDeliveryType.map(tpDeliveryType => <Option key={tpDeliveryType.key}>{tpDeliveryType.value}</Option>)}
            </Select>
        )}
    </FormItem>;
    const TpDeliveryTypeSelector = () => props.notUseColumn
        ? <EhubFormItem/>
        : <Col span={props.span ? props.span : 6}>
            <EhubFormItem/>
        </Col>;
    return (<TpDeliveryTypeSelector/>);
};

TpDeliveryTypeSelector.propTypes = {
    refForm: PropTypes.object.isRequired,
    span: PropTypes.number, // default = 6
    onChange: PropTypes.func, // default = () => {}
    formItemLayout: PropTypes.object, // default = formItemLayout
    notUseColumn: PropTypes.bool, // default = false
    formKey: PropTypes.string // default tpDeliveryType
};

export default TpDeliveryTypeSelector;