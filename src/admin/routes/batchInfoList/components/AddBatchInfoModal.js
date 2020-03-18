import React from 'react';
import {Form, Input, Modal, Select} from 'antd';
import connect from 'react-redux/es/connect/connect';
import {setModalVisible} from '../../../reducer/commonReducer';
import {createBatchInfo} from '../reducer/batchInfoListReducer';
import UserInfoEntity from "../../../../app/entities/UserInfoEntity";

const FormItem = Form.Item;
const TextArea = Input.TextArea;
const Option = Select.Option;

class AddBatchInfoModal extends React.Component {
    state = {createdBatchInfo : {batchName: '', jobName: '', description: '', address: '', used: true, modifiedBy: UserInfoEntity.getUserName()}};

    handleOk = () => {
        const {form} = this.props;
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            createBatchInfo(this.state.createdBatchInfo);
        });
    };

    render() {
        const {visible, form, setModalVisible} = this.props;
        const {createdBatchInfo} = this.state;
        const {getFieldDecorator} = form;

        return (
            <Modal
                visible={visible}
                title="Add Batch Job Info"
                onCancel={() => setModalVisible(false)}
                onOk={this.handleOk}
            >
                <Form layout="vertical">
                    <FormItem label="BatchName">
                        {getFieldDecorator('batchName', {
                            rules: [{required: true, message: 'BatchName is required'}],
                        })(
                            <Input onChange={(e) => this.setState({createdBatchInfo: {...createdBatchInfo, batchName: e.target.value}})}/>
                        )}
                    </FormItem>
                    <FormItem label="JobName">
                        {getFieldDecorator('jobName', {
                            rules: [{required: true, message: 'JobName is required!'}],
                        })(
                            <Input onChange={(e) => this.setState({createdBatchInfo: {...createdBatchInfo, jobName: e.target.value}})}/>
                        )}
                    </FormItem>
                    <FormItem label="Description">
                        {getFieldDecorator('description', {
                            rules: [{required: false}],
                        })(
                            <TextArea onChange={(e) => this.setState({createdBatchInfo: {...createdBatchInfo, description: e.target.value}})} />
                        )}
                    </FormItem>
                    <FormItem label="Address">
                        {getFieldDecorator('address', {
                            rules: [{required: true, message: 'Address is required!'}],
                        })(
                            <Input onChange={(e) => this.setState({createdBatchInfo: {...createdBatchInfo, address: e.target.value}})} />
                        )}
                    </FormItem>
                    <FormItem label="Used">
                        {getFieldDecorator('used', {
                            rules: [{required: true}],
                        })(
                            <Select initialValue="true" onChange={(value) => this.setState({createdBatchInfo: {...createdBatchInfo, used: value}})}>
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
})(Form.create()(AddBatchInfoModal));