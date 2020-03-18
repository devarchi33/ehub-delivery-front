import React from 'react';
import {connect} from 'react-redux';
import {Button, Col, Form, Input, Row, Select, Spin} from 'antd';
import {config} from 'config/config';
import EHubBrandCodeSelector from "../../../../../components/formItem/EHubBrandCodeSelector";

const FormItem = Form.Item;
const Option = Select.Option;

class AddProductForm extends React.Component {
    constructor(pros) {
        super(pros);
        this.layoutInfo = JSON.parse(sessionStorage.getItem(config.layoutInfo));
        this.roleCodes = window._.map(this.layoutInfo.UserInfo.colleague.roles,'roleCode');
        this.plantList = this.layoutInfo.UserBrandUserPlants.filter(item => !((this.roleCodes.indexOf('tpwsel') !== -1) && (item.plantType === 'TPW')) );
        this.state = {
            plantList: this.plantList,
            plantFilterList: this.plantList.filter(item => this.layoutInfo.UserInfo.colleague.brands[0].brandCode.indexOf(item.brandCode) !== -1 )
        }
    }

    brandChange = (e) => {
        const { plantList } = this.state;
        this.setState({
            plantFilterList : plantList.filter(item => e.indexOf(item.brandCode) !== -1 ),
        });
        this.props.form.resetFields(["plantId"]);
    };

    handleOk = () => {
        this.props.onCreate();
    };

    render(){
        const {form, confirmLoading} = this.props;
        const {getFieldDecorator} = form;
        const {plantFilterList} = this.state;
        const formItemLayout = {
            labelCol: {span: 4}, wrapperCol: {span: 20}
        };
        return (
            <Form style={{ margin: 20 }}>
                <Spin spinning={confirmLoading}>
                    <Row gutter={8}>
                        <EHubBrandCodeSelector refForm={form}
                                               span={6}
                                               onChange={this.brandChange}/>
                        <Col span={6}>
                            <FormItem
                                {...formItemLayout}
                                label="公司"
                                hasFeedback
                            >
                                {getFieldDecorator('plantId', {
                                    rules: [{ required: true, message: '请选择公司!'}],
                                    validateTrigger: ['onChange']
                                })(
                                    <Select placeholder="公司"
                                            showSearch
                                            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                            optionFilterProp="children"
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
                                label="skuId"
                                hasFeedback
                            >
                                {getFieldDecorator('skuId', {
                                    rules: [{ required: true, message: '请填写款号!'}, {
                                        validator: this.validateInput,
                                    }],
                                    initialValue: ''
                                })(
                                    <Input type="text" placeholder="款号"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={2}>
                            <Button onClick={this.handleOk}>添加</Button>
                        </Col>
                    </Row>
                </Spin>
            </Form>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({});
};

export default connect(mapStateToProps, {})(Form.create()(AddProductForm));
