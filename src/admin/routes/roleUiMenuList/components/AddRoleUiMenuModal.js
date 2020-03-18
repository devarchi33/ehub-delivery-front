import React from 'react';
import {Form, Input, InputNumber, Modal, Select} from 'antd';
import connect from 'react-redux/es/connect/connect';
import {setModalVisible} from '../../../reducer/commonReducer';
import {createRoleUiMenu} from '../reducer/roleUiMenuListReducer';
import UserInfoEntity from "../../../../app/entities/UserInfoEntity";

const FormItem = Form.Item;
const Option = Select.Option;

class AddRoleUiMenuModal extends React.Component {
    state = {createdRoleUiMenu : {name: '', parentNode: '', level: 1, type: 'leaf', sort: 0, page: 'app/', icon: 'rocket', createdBy: UserInfoEntity.getUserName()}};

    handleOk = () => {
        const {form} = this.props;
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            createRoleUiMenu(this.state.createdRoleUiMenu);
        });
    };

    render() {
        const {loading, visible, form, setModalVisible, roles, roleUiMenuList} = this.props;
        const {createdRoleUiMenu} = this.state;
        const {getFieldDecorator} = form;

        return (
            <Modal
                confirmLoading={loading}
                visible={visible}
                title="Add Role Ui Menu"
                onCancel={() => setModalVisible(false)}
                onOk={this.handleOk}
            >
                <Form layout="vertical">
                    <FormItem label="Name">
                        {getFieldDecorator('name', {
                            rules: [{required: true, message: 'Name is required'}],
                        })(
                            <Input onChange={(e) => this.setState({createdRoleUiMenu: {...createdRoleUiMenu, name: e.target.value}})}/>
                        )}
                    </FormItem>
                    <FormItem label="ParentNode">
                        {getFieldDecorator('parentNode', {
                            rules: [{required: true, message: 'ParentNode is required!'}],
                        })(
                            <Select onChange={(value) => this.setState({
                                createdRoleUiMenu: {
                                    ...createdRoleUiMenu,
                                    parentNode: value
                                }
                            })}>
                                {roleUiMenuList.filter(menu => menu.type === 'submenu' && menu.level === 1).map((menu, index) => {
                                    return <Option key={index} value={menu.name}>{menu.name}</Option>
                                })}
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="Level">
                        {getFieldDecorator('level', {
                            rules: [{required: false}],
                        })(
                            <InputNumber onChange={(value) => this.setState({createdRoleUiMenu: {...createdRoleUiMenu, level: value}})} />
                        )}
                    </FormItem>
                    <FormItem label="Type">
                        {getFieldDecorator('type', {
                            rules: [{required: false}],
                        })(
                            <Select onChange={(value) => this.setState({
                                createdRoleUiMenu: {
                                    ...createdRoleUiMenu,
                                    type: value
                                }
                            })}>
                                <Option value="leaf">Leaf</Option>
                                <Option value="submenu">Submenu</Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem label="Sort">
                        {getFieldDecorator('sort', {
                            rules: [{required: false}],
                        })(
                            <InputNumber onChange={(value) => this.setState({createdRoleUiMenu: {...createdRoleUiMenu, sort: value}})} />
                        )}
                    </FormItem>
                    <FormItem label="Page">
                        {getFieldDecorator('page', {
                            rules: [{required: false}],
                        })(
                            <Input onChange={(e) => this.setState({createdRoleUiMenu: {...createdRoleUiMenu, path: e.target.value}})} />
                        )}
                    </FormItem>
                    <FormItem label="Icon">
                        {getFieldDecorator('icon', {
                            rules: [{required: false}],
                        })(
                            <Input onChange={(e) => this.setState({createdRoleUiMenu: {...createdRoleUiMenu, icon: e.target.value}})} />
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
        roles: state.roleUiMenuListReducer.roles,
        roleUiMenuList: state.roleUiMenuListReducer.roleUiMenuList,
    })
};
export default connect(mapStateToProps, {
    setModalVisible
})(Form.create()(AddRoleUiMenuModal));