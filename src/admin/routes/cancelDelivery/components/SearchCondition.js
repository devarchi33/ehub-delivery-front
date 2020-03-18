import React from 'react'
import {Button, Col, Form, Input, Row} from 'antd';

const FormItem = Form.Item;

class SearchCondition extends React.Component {
        constructor(pros) {
        super(pros);
    }

    validateInput = (rule, value, callback) => {
        if(!value) {
            callback();
        }else if (value.replace(/^[A-Za-z0-9]+$/g,'') !== '') {
            callback('输入非法字符,请重新输入!');
        } else {
            callback();
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 }, wrapperCol: { span: 20 }
        };
        return (
            <Form style={{ margin: 20 }} onSubmit={this.props.onSubmit} >
                    <legend>撤销入出库查询条件</legend>
                    <Row gutter={8}>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="交货号"
                                hasFeedback
                            >
                                {getFieldDecorator('deliveryNo', {
                                    rules: [{ required: true }, {
                                        validator: this.validateInput,
                                      }],
                                    initialValue: ''
                                })(
                                    <Input placeholder="交货号"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={8}>
                            <FormItem
                                {...formItemLayout}
                                label="箱号"
                                hasFeedback
                            >
                                {getFieldDecorator('boxNo', {
                                    initialValue: ''
                                })(
                                    <Input placeholder="箱号"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                <footer style={{float: 'right',marginBottom: '10px'}}>
                    <Button type="primary" className="pull-right margin-bottom-10" htmlType="submit" >
                        查询
                    </Button>
                    <Button type="primary" className="pull-right margin-bottom-10"  onClick={this.props.onClick}>
                        撤销
                    </Button>
                </footer>
            </Form>
        )
    }
}

export default Form.create()(SearchCondition);