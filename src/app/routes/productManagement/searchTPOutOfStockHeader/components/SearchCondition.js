import React from 'react';
import {connect} from 'react-redux';
import {Button, Col, Form, Row, Select} from 'antd';
import TpProductEntity from '../entity/TpProductEntity';
import EHubBrandCodeSelector from '../../../../components/formItem/EHubBrandCodeSelector';
import EHubClosingDateSelector from '../../../../components/formItem/EHubClosingDateSelector';

const FormItem = Form.Item;
const {Option} = Select;

class SearchCondition extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedBrand: ''
        }
    }

    brandChange = (brand) => this.setState({selectedBrand: brand});

    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 5},
            wrapperCol: {span: 19}
        };
        return(
            <Form onSubmit={this.props.onSubmit}>
                <legend>{"查询条件"}</legend>
                <Row gutter={8}>
                    <EHubBrandCodeSelector refForm={this.props.form}
                                           span={6}
                                           onChange={this.brandChange}/>
                    {/* 
                    <Col span={6}>
                        <FormItem
                            {...formItemLayout}
                            label="类型"
                            hasFeedback
                        >
                            {getFieldDecorator('errorType', {
                                rules: [{required: false}],
                                initialValue: TpProductEntity.OUT_OF_STOCK
                            })(
                                <Select placeholder="类型"
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        optionFilterProp="children"
                                >
                                    <Option key={1} value={TpProductEntity.OUT_OF_STOCK}>{TpProductEntity.OUT_OF_STOCK}</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    */}
                    <EHubClosingDateSelector refForm={this.props.form} formItemLayout={formItemLayout}/>
                </Row>
                <Row gutter={8}>
                    <Col span={1} offset={23}>
                        <Button type="primary" htmlType="submit" >查询</Button>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
    })
};
export default connect(mapStateToProps, {
})(Form.create()(SearchCondition));
