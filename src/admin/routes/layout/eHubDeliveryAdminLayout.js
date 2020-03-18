import React from 'react';
import {Route} from 'react-router-dom';

import {Icon, Layout, Menu} from 'antd';
import {EHubFooter, EHubHeader} from '../../../share/EHubLayout';
import administrator from "../../../share/administrator";
import UserInfoEntity from "../../../app/entities/UserInfoEntity";

const {Sider, Content} = Layout;

const asyncComponent = (getComponent) => {
    return class AsyncComponent extends React.Component {
        static Componenttttt = null;
        state = {Componenttttt: AsyncComponent.Componenttttt};

        componentWillMount() {
            if (!this.state.Componenttttt) {
                getComponent().then(Componenttttt => {
                    AsyncComponent.Componenttttt = Componenttttt;
                    this.setState({Componenttttt})
                });
            }
        }
        render() {
            const {Componenttttt} = this.state;
            if (Componenttttt) {
                return <Componenttttt {...this.props} />
            }
            return null
        }
    }
};

export default class EHubDeliveryAdminLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userInfo: {}}
    };
    componentDidMount() {
        sessionStorage.setItem("isAdminMode", JSON.stringify(true));
        administrator.indexOf(UserInfoEntity.getUserName()) > -1
            ? window.open(location.hash, "_self") : window.open("#/app/issuedManagement", "_self");
    }
    checkPageAuthority = (page, module) => {
        return module.default;
    };
    render() {
        return (
            (<Layout>
                <EHubHeader backgroundColor={'#459bc7'}/>
                <Content style={{padding: '0 50px',  paddingTop: '30px'}} >
                    <Layout style={{padding: '24px 0', background: '#fff'}}>
                        <Sider width={200}>
                            <Menu
                                mode="inline"
                                theme="light"
                                defaultOpenKeys={['deliveryManagement']}
                                defaultSelectedKeys={[window.location.hash.split('#')[1].split('/')[1]]}
                                style={{ height: '100%' }}
                                onClick={(item, key, keyPath) => {
                                    window.location.href = "#/" + item.key;
                                }}
                            >
                                <Menu.Item key={'admin/brandList'}>
                                    <Icon type={'search'} />BrandList
                                </Menu.Item>
                                <Menu.Item key={'admin/roleUiMenuList'}>
                                    <Icon type={'search'} />RoleUiMenu
                                </Menu.Item>
                                <Menu.Item key={'admin/batchInfoList'}>
                                    <Icon type={'search'} />BatchInfo
                                </Menu.Item>
                                <Menu.Item key={'admin/cancelDelivery'}>
                                    <Icon type={'edit'} />CancelDelivery
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Content style={{padding: '0 24px', minHeight: 280}}>
                            <Route path="/admin/brandList" component={asyncComponent(() => import('../brandList/components/BrandList').then(module => this.checkPageAuthority('brandList', module)))}/>
                            <Route path="/admin/roleUiMenuList" component={asyncComponent(() => import('../roleUiMenuList/components/RoleUiMenuList').then(module => this.checkPageAuthority('roleUiMenuList', module)))}/>
                            <Route path="/admin/batchInfoList" component={asyncComponent(() => import('../batchInfoList/components/BatchInfoList').then(module => this.checkPageAuthority('batchInfoList', module)))}/>
                            <Route path="/admin/cancelDelivery" component={asyncComponent(() => import('../cancelDelivery/container/CancelDelivery').then(module => this.checkPageAuthority('cancelDelivery', module)))}/>
                        </Content>
                    </Layout>
                </Content>
                <EHubFooter/>
            </Layout>)
        )
    }
}