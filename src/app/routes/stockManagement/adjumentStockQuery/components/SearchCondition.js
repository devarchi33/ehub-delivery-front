import React from 'react'
import {Button, Col, Form, Input, Row, Select} from 'antd';
import {config} from 'config/config';
import EHubBrandCodeSelector from '../../../../components/formItem/EHubBrandCodeSelector';

const FormItem = Form.Item;
const Option = Select.Option;

class SearchCondition extends React.Component {
        constructor(pros) {
        super(pros);
        const layoutInfo = JSON.parse(sessionStorage.getItem(config.layoutInfo));
        this.state = {
            plantList: layoutInfo.UserBrandUserPlants,
            plantFilterList: layoutInfo.UserBrandUserPlants.filter(item => layoutInfo.UserInfo.colleague.brands[0].brandCode.indexOf(item.brandCode) !== -1 )
        }
    }

    brandChange = (e) => {
        const { plantList } = this.state;
        this.setState({
            plantFilterList : plantList.filter(item => e.indexOf(item.brandCode) !== -1 ),
        });
        this.props.form.resetFields(["plantId"]);
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
        const {plantFilterList} = this.state;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: { span: 6 }, wrapperCol: { span: 18 }
        };
        return (
            <Form style={{ margin: 20 }} onSubmit={this.props.onSubmit} >
                    <legend>库存调整查询条件</legend>
                    <Row gutter={8}>
                        <EHubBrandCodeSelector refForm={this.props.form}
                                               span={6}
                                               onChange={this.brandChange}
                                               formItemLayout={formItemLayout}/>
                        <Col span={6}>
                            <FormItem
                                {...formItemLayout}
                                label="公司"
                                hasFeedback
                            >
                                {getFieldDecorator('plantId', {
                                    rules: [{ required: false, message: '请选择公司!'}],
                                    validateTrigger: ['onChange']
                                })(
                                    <Select placeholder="公司"
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        optionFilterProp="children"
                                        allowClear={true}
                                    >
                                        {plantFilterList.map((plant, index)=>{
                                            return <Option key={index} value={plant.plantCode}>{plant.plantName + '(' + plant.plantCode + ')'}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem
                                {...formItemLayout}
                                label="商品代码"
                                hasFeedback
                            >
                                {getFieldDecorator('skuId', {
                                    rules: [{ required: false }, {
                                        validator: this.validateInput,
                                      }],
                                    initialValue: ''
                                })(
                                    <Input placeholder="商品代码"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                <footer style={{float: 'right',marginBottom: '10px'}}>
                    <Button type="primary" className="pull-right margin-bottom-10" htmlType="submit" >
                        查询
                    </Button>
                </footer>
            </Form>
        )
    }
}

export default Form.create()(SearchCondition);