import React from 'react';
import {Route} from 'react-router-dom';

import {Icon, Layout, Menu} from 'antd';
import {config} from 'config/config';
import console from 'util/logger';
import {getLayoutInfo} from '../service';
import {EHubFooter, EHubHeader} from '../../../../share/EHubLayout';

const {Sider, Content} = Layout;
const {SubMenu} = Menu;
const MenuItemGroup = Menu.ItemGroup;

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

export default class eHubDeliveryLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {userInfo: {}, dynamicMenu: []}
    };
    componentWillMount() {
        if(JSON.parse(sessionStorage.getItem(config.isAuthKey))) {
            const userInfo = JSON.parse(sessionStorage.getItem(config.userInfoKey));
            const dynamicMenu = JSON.parse(sessionStorage.getItem(config.layoutInfo)).Pages;
            this.setState({userInfo, dynamicMenu});

            if(sessionStorage.getItem(config.layoutInfo) === null) {
                getLayoutInfo().then(res => sessionStorage.setItem(config.layoutInfo, JSON.stringify(res)));
            }
        } else {
            window.location.reload("#/auth/login");
        }
    };
    checkPageAuthority = (page, module) => {
        const {dynamicMenu} = this.state;
        if(JSON.parse(sessionStorage.getItem(config.isAuthKey))) {
            if(dynamicMenu.map(menu => menu.page).indexOf('app/' + page) !== -1) {
                return module.default;
            } else {
                window.location.href = "#/app/notFound";
            }
        } else {
            window.location.href = "#/auth/login";
        }
    };
    render() {
        console.log(">>>>>>>>>> LoginUser ", this.state.userInfo);
        const {dynamicMenu} = this.state;
        return (
            (<Layout>
                <EHubHeader backgroundColor={'#404040'}/>
                <Content style={{ padding: '0 50px',  paddingTop: '30px'}} >
                    <Layout style={{ padding: '24px 0', background: '#fff' }}>
                        <Sider width={200}>
                            <Menu
                                mode="inline"
                                defaultOpenKeys={['deliveryManagement']}
                                defaultSelectedKeys={[window.location.hash.split('#')[1].split('/')[1]]}
                                style={{ height: '100%' }}
                                onClick={(item, key, keyPath) => window.location.href = "#/" + item.key}
                            >
                                {/*https://www.mcpressonline.com/it-infrastructure/system-administration/techtip-dynamic-menu-using-tree-data-structure*/}
                                {dynamicMenu.map(level1Menu => {
                                    return (level1Menu.level === 1 && level1Menu.type === 'submenu') ?
                                        <SubMenu key={level1Menu.page} title={<span><Icon type={level1Menu.icon} />{level1Menu.name}</span>}>
                                            {dynamicMenu.filter(level2Menu => level1Menu.name === level2Menu.parentNode && level2Menu.type === 'submenu' && level2Menu.level === 2).map(level2Menu =>
                                                <MenuItemGroup key={level2Menu.page} title={level2Menu.name}>
                                                    {dynamicMenu.filter(level3Menu => level2Menu.name === level3Menu.parentNode && level3Menu.type === 'leaf' && level3Menu.level === 3).map(level3Menu =>
                                                        <Menu.Item key={level3Menu.page}>
                                                            <Icon type={level3Menu.icon} />{level3Menu.name}
                                                        </Menu.Item>)}
                                                </MenuItemGroup>)}
                                            {dynamicMenu.filter(level2Menu => level1Menu.name === level2Menu.parentNode && level2Menu.type === 'leaf' && level2Menu.level === 2).map(level2Menu =>
                                                <Menu.Item key={level2Menu.page}>
                                                    <Icon type={level2Menu.icon} />{level2Menu.name}
                                                </Menu.Item>)}
                                        </SubMenu> : (level1Menu.level === 1 && level1Menu.type === 'leaf') ?
                                            <Menu.Item key={level1Menu.page}>
                                                <Icon type={level1Menu.icon} />{level1Menu.name}
                                            </Menu.Item> : ''
                                })}
                            </Menu>
                        </Sider>
                        <Content style={{padding: '0 24px', minHeight: 280}}>
                            <Route path="/app/issuedManagement" component={asyncComponent(() => import('../../deliveryManagement/issuedManagement/container').then(module => this.checkPageAuthority('issuedManagement', module)))}/>
                            <Route path="/app/receiptManagement" component={asyncComponent(() => import('../../deliveryManagement/receiptManagement/container').then(module => this.checkPageAuthority('receiptManagement', module)))}/>
                            <Route path="/app/uploadIssueDeliveries" component={asyncComponent(() => import('../../deliveryManagement/uploadManagement/uploadIssueDeliveries/container').then(module => this.checkPageAuthority('uploadIssueDeliveries', module)))}/>
                            <Route path="/app/uploadReceiptDeliveries" component={asyncComponent(() => import('../../deliveryManagement/uploadManagement/uploadReceiptDeliveries/container').then(module => this.checkPageAuthority('uploadReceiptDeliveries', module)))}/>
                            <Route path="/app/uploadTpPlantDeliveries"
                                   component={asyncComponent(() => import('../../deliveryManagement/uploadManagement/uploadTpPlantDeliveries/container').then(module => this.checkPageAuthority('uploadTpPlantDeliveries', module)))}/>
                            <Route path="/app/externalManagement" component={asyncComponent(() => import('../../deliveryManagement/uploadManagement/externalManagement/container').then(module => this.checkPageAuthority('externalManagement', module)))}/>
                            <Route path="/app/searchTpInterfaceDelivery" component={asyncComponent(() => import('../../deliveryManagement/searchTpInterfaceDelivery/container').then(module => this.checkPageAuthority('searchTpInterfaceDelivery', module)))}/>
                            <Route path="/app/searchTpOriginalDelivery"
                                   component={asyncComponent(() => import('../../deliveryManagement/searchTpOriginalDelivery/container').then(module => this.checkPageAuthority('searchTpOriginalDelivery', module)))}/>
                            <Route path="/app/adjustmentSearch" component={asyncComponent(() => import('../../stockManagement/adjustmentStock/adjustmentSearch/container').then(module => this.checkPageAuthority('adjustmentSearch', module)))}/>
                            <Route path="/app/executeBatchInfo" component={asyncComponent(() => import('../../deliveryManagement/batchInfoList/container').then(module => this.checkPageAuthority('executeBatchInfo', module)))}/>
                            <Route path="/app/adjustmentAdd" component={asyncComponent(() => import('../../stockManagement/adjustmentStock/adjustmentAdd/container').then(module => this.checkPageAuthority('adjustmentAdd', module)))}/>
                            <Route path="/app/adjumentStockQuery" component={asyncComponent(() => import('../../stockManagement/adjumentStockQuery/container').then(module => this.checkPageAuthority('adjumentStockQuery', module)))}/>
                            <Route path="/app/compareStock" component={asyncComponent(() => import('../../stockManagement/compareStock/container').then(module => this.checkPageAuthority('compareStock', module)))}/>
                            <Route path="/app/inventoryStatus" component={asyncComponent(() => import('../../stockManagement/inventoryStatus/container').then(module => this.checkPageAuthority('inventoryStatus', module)))}/>
                            <Route path="/app/searchStock" component={asyncComponent(() => import('../../stockManagement/searchStock/container').then(module => this.checkPageAuthority('searchStock', module)))}/>
                            <Route path="/app/searchChangeStock" component={asyncComponent(() => import('../../stockManagement/searchChangeStock/container').then(module => this.checkPageAuthority('searchChangeStock', module)))}/>
                            <Route path="/app/searchTPOutOfStock" component={asyncComponent(() => import('../../productManagement/searchTPOutOfStockHeader/container').then(module => this.checkPageAuthority('searchTPOutOfStock', module)))}/>
                            <Route path="/app/searchProductInfo" component={asyncComponent(() => import('../../productManagement/searchProductInfo/container').then(module => this.checkPageAuthority('searchProductInfo', module)))}/>
                            <Route path="/app/expressCommCode" component={asyncComponent(() => import('../../staticPage/expressCommCode/container').then(module => module.default))}/>
                            <Route path="/app/plantCodeWizard" component={asyncComponent(() => import('../../staticPage/plantCodeWizard/container').then(module => module.default))}/>
                            <Route path="/app/tpEhubProductMapping" component={asyncComponent(() => import('../../productManagement/tpEhubProductMapping/container').then(module => this.checkPageAuthority('tpEhubProductMapping', module)))}/>
                            <Route component={asyncComponent(() => import('../../staticPage/notFound/container').then(module => module.default))}/>
                        </Content>
                    </Layout>
                </Content>
                <EHubFooter/>
            </Layout>)
        )
    }
}