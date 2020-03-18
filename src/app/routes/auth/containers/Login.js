import React from 'react';
import {connect} from 'react-redux';
import {login} from '../service';
import {config} from 'config/config';
import console from 'util/logger';
import {Button, Card, Form, Icon, Input, notification} from 'antd';
import '../login.css'

import globalStore from 'store/configureStore';
import { PlatformEntity } from '../../../entities';

const FormItem = Form.Item;

class Login extends React.Component {
    handleSignIn = (e) => {
        e.preventDefault();
        const form = this.props.form;
        form.validateFields((err, values) => {
            if (!err) {
                globalStore.dispatch({type: "SET_LOADING", payload: true});
                const {userName, password} = form.getFieldsValue(["userName", "password"]);
                login(userName, password).then(layoutInfo => {
                    if(!layoutInfo.errorMsg) {
                        //判断Brand中有无Plant信息
                        //https://lodash.com/docs/4.17.4#map
                        //https://lodash.com/docs/4.17.4#without
                        //https://lodash.com/docs/4.17.4#uniq
                        //https://lodash.com/docs/4.17.4#sortBy
                        const userbrands = layoutInfo.UserInfo.colleague.brands
                        layoutInfo.UserInfo.colleague.brands = window._.sortBy(userbrands, ['brandName'])
                        const userbrandCodes = window._.map(userbrands, 'brandCode')
                        const plants = layoutInfo.UserBrandAllPlants

                        layoutInfo.UserBrandAllPlants = window._.sortBy(plants,function(plant){
                            if(plant.plantType === 'BRW')  return 1;
                            else if(['TPW','STD','QAW'].indexOf(plant.plantType) > -1) return 2;
                            else if(['ONS','EXW','OFS'].indexOf(plant.plantType) > -1) return 3;
                            else return 4;
                        })
                        const brandsInUserPlants = window._.uniq(window._.map(layoutInfo.UserBrandUserPlants, 'brandCode'))

                        const withoutbrandsInUserPlants = window._.without(userbrandCodes, ...brandsInUserPlants)
                        if(withoutbrandsInUserPlants.length > 0) {
                            const removeBrands = userbrands.filter(brand => withoutbrandsInUserPlants.indexOf(brand.brandCode) > -1)
                            const removeBrandNames = window._.map(removeBrands, 'brandName')

                            notification['warning']({
                                message: '警告',
                                description: removeBrandNames + '品牌没有Plant信息.请联系管理者.',
                                duration: 30,
                            });
                        }
                        //Save
                        sessionStorage.setItem(config.isAuthKey, JSON.stringify(true));
                        sessionStorage.setItem(config.userInfoKey, JSON.stringify(layoutInfo.UserInfo));
                        sessionStorage.setItem(config.layoutInfo, JSON.stringify(layoutInfo));
                        PlatformEntity.findAllTpPlantEhubPlantMapping();
                        window.location.href = "#/app/issuedManagement";
                    } else {
                        console.log('layoutInfolayoutInfo',layoutInfo);
                        notification['error']({
                            message: '登录失败',
                            description: layoutInfo.errorMsg,
                            duration: 30,
                        });
                    }
                }).then(res => {
                    globalStore.dispatch({type: "SET_LOADING", payload: false});
                });
            }
        });

    };

    render() {
        const {loading} = this.props;
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.handleSignIn} className="login-form">
                <Card title="登录" >
                    <FormItem>
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: '请输入用户名!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                        )}
                    </FormItem>
                    <FormItem>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '请输入密码!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        {/* {getFieldDecorator('remember', {
                    valuePropName: 'checked',
                    initialValue: true,
                    })(
                    <Checkbox>Remember me</Checkbox>
                    )} */}
                        {/* <a className="login-form-forgot" href="">Forgot password</a> */}
                        <Button type="primary" htmlType="submit" className="login-form-button" loading={loading}>
                            登录
                        </Button>
                        {/* Or <a href="">register now!</a> */}
                    </FormItem>
                </Card>
            </Form>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading
    });
};
export default connect(mapStateToProps, {})(Form.create()(Login));
