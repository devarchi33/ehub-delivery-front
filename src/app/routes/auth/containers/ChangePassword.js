import React from 'react';
import {connect} from 'react-redux';
import {config} from 'config/config';
import {changePassword} from '../service';
import {Button, Card, Col, Form, Input, notification, Row} from 'antd';
import '../login.css'
import globalStore from "../../../store/configureStore";

const FormItem = Form.Item;

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        const layoutInfo = JSON.parse(sessionStorage.getItem(config.layoutInfo));
        this.username = layoutInfo.UserInfo.colleague.userName;
        this.state = {
            confirmDirty: false,
            errorTips: false
        }
    };

    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({confirmDirty: this.state.confirmDirty || !!value});
    };

    checkPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次密码不一致!');
        } else {
            callback();
        }
    };

    checkConfirm = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        callback();
    };

    goMainPage = () => {
        window.location.href = "#/app/issuedManagement";
    };

    handleUpdatePassWord = (e) => {
        e.preventDefault();
        const form = this.props.form;
        form.validateFields((err, values) => {
            if (!err) {
                const {passwordOld, password, confirm} = form.getFieldsValue(["passwordOld", "password", "confirm"]);
                if(password !== confirm){
                    this.setState({errorTips : true});
                } else {
                    globalStore.dispatch({type: "SET_LOADING", payload: true});
                    this.setState({errorTips : false}, () => {
                        changePassword(this.username, passwordOld, password)
                            .then(resInfo => {
                                if(resInfo.success){
                                    notification["success"]({
                                        message: '密码修改成功',
                                    });
                                    window.location.href = "#/app/issuedManagement";
                                } else {
                                    notification["error"]({
                                        message: '密码修改失败',
                                        description: '原密码不正确'//resInfo.error.details
                                    });
                                }
                                globalStore.dispatch({type: "SET_LOADING", payload: false});
                            });
                    });
                }
            }
        })
    };

    render() {
        const {loading} = this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleUpdatePassWord} className="login-form">
                <Card title="修改密码" >
                    <FormItem>
                        {getFieldDecorator('passwordOld', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input type="password" placeholder="旧密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码!' }, {
                                validator: this.checkConfirm,
                            }],
                        })(
                            <Input type="password" placeholder="新密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('confirm', {
                            rules: [{ required: true, message: '请输入密码!' }, {
                                validator: this.checkPassword,
                            }],
                        })(
                            <Input type="password" placeholder="确认新密码" onBlur={this.handleConfirmBlur}/>
                        )}
                    </FormItem>
                    <FormItem >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                                    确认
                                </Button>
                            </Col>
                            <Col span={12}>
                                <Button type="" className="login-form-button" onClick={this.goMainPage}>
                                    取消
                                </Button>
                            </Col>
                        </Row>
                    </FormItem>
                </Card>
            </Form>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading
    })
};
export default connect(mapStateToProps, {})(Form.create()(ChangePassword));