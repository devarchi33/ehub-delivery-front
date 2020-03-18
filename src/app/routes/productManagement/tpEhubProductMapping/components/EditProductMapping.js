import {Form, Modal, Row, Col, Input} from 'antd';
import React from 'react';
import {connect} from 'react-redux';

const FormItem = Form.Item;

class EditProductMapping extends React.Component {
    render() {
        const {record} = this.props;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const {getFieldDecorator} = this.props.form;
        return (
            <Modal title="修改商品代码Mapping信息"
                    visible={this.props.visible}
                    onCancel={this.props.handleCancel}
                    onOk={this.props.onOk}
            >
            <Row type="flex" justify="center" align="middle">
            <Col span={18}>
                <Form onSubmit={this.props.onOk}>
                    <FormItem
                        {...formItemLayout}
                        label="类型"
                        hasFeedback
                    >
                        {getFieldDecorator('type', {
                        })(
                            <h3>{record.type}</h3>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="品牌"
                        hasFeedback
                    >
                        {getFieldDecorator('brandCd', {
                        })(
                            <h3>{record.brandCd}</h3>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="Tp商品代码"
                        hasFeedback
                    >
                        {getFieldDecorator('tpProductId', {
                        })(
                            <h3>{record.tpProductId}</h3>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="修改商品代码"
                        hasFeedback
                    >
                        {getFieldDecorator('modifyProductId', {
                            rules: [{
                                required: true, message: 'Please input modified productId!',
                            }],
                        })(
                            <Input type="text" onChange={this.props.onEdit}/>
                        )}
                    </FormItem>
                </Form>
            </Col>
        </Row>
            </Modal>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
    });
};
export default connect(mapStateToProps, {
})(Form.create()(EditProductMapping));