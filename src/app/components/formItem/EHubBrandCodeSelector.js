import React from 'react';
import {Col, Form, Select} from 'antd';
import PropTypes from 'prop-types';
import {initializeEHubMaster} from '../../routes/service';

const FormItem = Form.Item;
const Option = Select.Option;

const EHubBrandCodeSelector = (props) => {
    const {getFieldDecorator} = props.refForm;
    const formItemLayout = props.formItemLayout ? props.formItemLayout : {
        labelCol: {span: 4},
        wrapperCol: {span: 20}
    };

    const brandListType = props.brandListType === "All" ? props.brandListType : "";

    let allBrandSelect = initializeEHubMaster().brandList;
    if (brandListType === "All"){
        let brandList = initializeEHubMaster().brandList;
        allBrandSelect = [{brandCode: "All", brandName: "(全部)"}];
        brandList.forEach(item => {
            allBrandSelect.push(item)
        });
    }

    const EhubFormItem = () => <FormItem
        {...formItemLayout}
        label="品牌"
        hasFeedback
    >
        {getFieldDecorator('brandCode', {
            rules: [{required: true, message: '请输入品牌!'}],
            initialValue: props.defaultBrandCd ? props.defaultBrandCd : allBrandSelect[0].brandCode
        })(
            <Select placeholder="品牌"
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                    optionFilterProp="children"
                    onChange={props.onChange ? props.onChange : () => {
                    }}
            >
                {allBrandSelect.map((brand, index) => {
                    return <Option key={index}
                                   value={brand.brandCode}>{brand.brandName + ' ' + brand.brandCode}</Option>
                })}
            </Select>
        )}
    </FormItem>;
    const EhubBrandSelector = () => props.notUseColumn
        ? <EhubFormItem/>
        : <Col span={props.span ? props.span : 6}>
            <EhubFormItem/>
        </Col>;
    return (<EhubBrandSelector/>);
};

EHubBrandCodeSelector.propTypes = {
    brandListType: PropTypes.string, //default = ''
    refForm: PropTypes.object.isRequired,
    span: PropTypes.number, // default = 6
    onChange: PropTypes.func, // default = () => {}
    formItemLayout: PropTypes.object, // default = formItemLayout
    notUseColumn: PropTypes.bool // default = false
};

export default EHubBrandCodeSelector;