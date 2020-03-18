import React from 'react';
import { Form, Button, Input, Select, Row, Col } from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const ButtonGroup = Button.Group;

// productInfo form
class SearchCondition extends React.Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 5 }, wrapperCol: { span: 19 }
        };
        return (
            <Form style={{ margin: 20 }}>
                <fieldset>
                    <legend>商品查询条件</legend>

                    <Row gutter={8}>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                hasFeedback
                            >
                                {getFieldDecorator('brandCode', {
                                    rules: [{
                                        required: true, message: '请输入品牌!',
                                    }],
                                })(
                                    <Select placeholder="品牌">
                                        <Option value="EE">EE</Option>
                                        <Option value="EA">EA</Option>
                                        <Option value="SA">SA</Option>
                                        <Option value="SF">SF</Option>
                                        <Option value="SM">SM</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                hasFeedback
                            >
                                {getFieldDecorator('plant', {
                                    rules: [{
                                        required: true, message: '请输入plant!',
                                    }],
                                })(
                                    <Select placeholder="款式">
                                        <Option value="SA">款式</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                hasFeedback
                            >
                                {getFieldDecorator('productCode', {
                                    rules: [{
                                        required: true, message: '请输入商品!',
                                    }],
                                })(
                                    <Input placeholder="商品"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </fieldset>
                <footer>
                    <ButtonGroup className="pull-right margin-bottom-10">
                        <Button className="margin-right-5">
                            选择
                        </Button>
                        <Button type="primary" onClick={this.props.onSubmit}>
                            查询
                        </Button>
                    </ButtonGroup>
                </footer>
            </Form>
        )
    }
}

export default Form.create()(SearchCondition);