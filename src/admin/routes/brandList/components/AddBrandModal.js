import React from 'react';
import {Form, Input, Modal, Select} from 'antd';
import connect from 'react-redux/es/connect/connect';
import {setModalVisible} from '../../../reducer/commonReducer';
import {createBrand} from '../reducer/brandListReducer';
import UserInfoEntity from "../../../../app/entities/UserInfoEntity";

const FormItem = Form.Item;
const Option = Select.Option;

class AddBrandModal extends React.Component {
    state = {creatingBrand : {brandCode: '', brandName: '', used: true, createdBy: UserInfoEntity.getUserName()}};

    handleOk = () => {
        const {form} = this.props;
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            createBrand(this.state.creatingBrand);
        });
    };

    render() {
        const {visible, form, setModalVisible} = this.props;
        const {creatingBrand} = this.state;
        const {getFieldDecorator} = form;

        return (
            <Modal
                visible={visible}
                title="Add Brand"
                onCancel={() => setModalVisible(false)}
                onOk={this.handleOk}
            >
                <Form layout="vertical">
                    <FormItem label="BrandCode">
                        {getFieldDecorator('brandCode', {
                            rules: [{required: true, message: 'BrandCode is required'}],
                        })(
                            <Input onChange={(e) => this.setState({creatingBrand: {...creatingBrand, brandCode: e.target.value}})}/>
                        )}
                    </FormItem>
                    <FormItem label="BrandName">
                        {getFieldDecorator('brandName', {
                            rules: [{required: true, message: 'BrandName is required!'}],
                        })(
                            <Input onChange={(e) => this.setState({creatingBrand: {...creatingBrand, brandName: e.target.value}})}/>
                        )}
                    </FormItem>
                    <FormItem label="Used">
                        {getFieldDecorator('used', {
                            rules: [{required: true}],
                        })(
                            <Select initialValue="true" onChange={(value) => this.setState({creatingBrand: {...creatingBrand, used: value}})}>
                                <Option value="true">True</Option>
                                <Option value="false">False</Option>
                            </Select>
                        )}
                    </FormItem>
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        visible: state.commonReducer.visible,
    })
};
export default connect(mapStateToProps, {
    setModalVisible
})(Form.create()(AddBrandModal));