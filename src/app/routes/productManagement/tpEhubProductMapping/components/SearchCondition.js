import React from 'react';
import { Form, Button, Row, Col, Input} from 'antd';
import UploadProductMappingExcel from '../components/UploadProductMappingExcel';
import EHubBrandCodeSelector from '../../../../components/formItem/EHubBrandCodeSelector';

const FormItem = Form.Item;
class SearchCondition extends React.Component {
    constructor(pros){
        super(pros);
        this.state = {
            visibleModal: false,
        }
    }

    validateInput = (rule, value, callback) => {
        if (!value) {
            callback();
        } else if (value.replace(/^[A-Za-z0-9]+$/g,'') !== '') {
            callback('输入非法字符,请重新输入!');
        } else {
            callback();
        }
    };

    showModal = () => {
        this.setState({
            visibleModal: true
        });
    }

    cancel = () => {
        this.setState({
            visibleModal: false
        });
    }

    render() {
        const {visibleModal} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        
        return (
            <Form onSubmit = {this.props.onSubmit}>
                <legend>查询条件</legend>
                <Row gutter={8}>
                    <EHubBrandCodeSelector brandListType={"All"} refForm={this.props.form} span={6} onChange={this.props.handleBrandCd} />
                    <Col span={7}>
                        <FormItem
                        {...formItemLayout}
                        label="商品代码"
                        hasFeedback
                        >
                            {getFieldDecorator('productCd', {
                                rules: [{ required: false }, { validator: this.validateInput }],
                                initialValue: ''
                            })(
                                <Input placeholder="商品代码" onChange={this.props.handleProductCd} />
                            )}
                        </FormItem>
                    </Col>
                    <Col style={{float: "right"}}>
                        <Button type="default" onClick={this.showModal}>批量添加Mapping信息</Button>
                    </Col>
                </Row>
                <Row gutter={8} justify="center">
                    <Col style={{float: 'right',marginBottom: '10px'}}>
                        <Button type="primary" className="pull-right margin-bottom-10" onClick={this.props.searchInvalidProductCode}>查询错误商品代码</Button>
                    </Col>
                    <Col style={{float: 'right',marginBottom: '10px'}}>
                        <Button type="primary" className="pull-right margin-bottom-10" htmlType="submit">查询Mapping关系</Button>
                    </Col>
                </Row>
                <Row>
                    <UploadProductMappingExcel 
                        visibleModal={visibleModal}
                        cancel={this.cancel}
                        refForm={this.props.form}
                    />
                </Row> 
            </Form>
        )
    }
}

export default Form.create()(SearchCondition);