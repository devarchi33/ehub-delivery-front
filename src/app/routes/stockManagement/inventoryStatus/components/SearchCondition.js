import React from 'react'
import {Button, Col, Form, Input, Row, Select} from 'antd';
import {config} from 'config/config';
import EHubBrandCodeSelector from "../../../../components/formItem/EHubBrandCodeSelector";

const FormItem = Form.Item;
const Option = Select.Option;

// current stock situation form
class SearchCondition extends React.Component {
    constructor(pros){
        super(pros);
        const layoutInfo = JSON.parse(sessionStorage.getItem(config.layoutInfo));  
        this.state={
            plants: layoutInfo.UserBrandUserPlants,
            plantFilterList: layoutInfo.UserBrandUserPlants.filter(item => layoutInfo.UserInfo.colleague.brands[0].brandCode.indexOf(item.brandCode) !== -1 )            
        }
    }
        
    brandChange = (e) => {
        const { plants } = this.state;
        this.setState({
            plantFilterList : plants.filter(item => e.indexOf(item.brandCode) !== -1 ),
        });
        this.props.form.resetFields(["plant"]);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        const {plantFilterList} = this.state;
        const formItemLayout = {
            labelCol: { span: 5 }, wrapperCol: { span: 19 }
        };
        return (
            <Form style={{ margin: 20 }} onSubmit={this.props.onSubmit}>
                    <legend>库存现状查询条件</legend>

                    <Row gutter={8}>
                        <EHubBrandCodeSelector refForm={this.props.form}
                                               span={6}
                                               onChange={this.brandChange}
                                               formItemLayout={formItemLayout}/>
                        <Col span={6}>
                            <FormItem
                                {...formItemLayout}
                                hasFeedback
                                label="公司"
                            >
                                {getFieldDecorator('plant', {
                                    rules: [{
                                        required: false, message: '请输入公司!',
                                    }],
                                })(
                                    <Select placeholder="公司"  allowClear={true}
                                    >
                                        {plantFilterList.map((item, index)=>{
                                            return <Option key={item} value={item.plantCode}>{item.plantName + '(' + item.plantCode + ')'}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem
                                {...formItemLayout}
                                hasFeedback
                                label="款式"
                            >
                                {getFieldDecorator('styleCode', {
                                rules: [{
                                    required: false,  min:4, message: '款式长度不能小于4!'
                                }],
                            })(
                                <Input placeholder="款式"></Input>
                            )}
                            </FormItem>
                        </Col>
                        <Col span={6}>
                            <FormItem
                                {...formItemLayout}
                                hasFeedback
                                label="商品"
                            >
                            {getFieldDecorator('skuid', {
                                rules: [{
                                    required: false,
                                }],
                            })(
                                <Input placeholder="商品"></Input>
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