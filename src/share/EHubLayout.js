import React from 'react';
import PropTypes from "prop-types";

import NoticeIcon from 'ant-design-pro/lib/NoticeIcon';
import moment from 'moment';
import {Layout, Menu, Dropdown, Avatar, Icon, Tag} from 'antd';
import UserInfoEntity from '../app/entities/UserInfoEntity';
import {getNotice} from './service';

import administrator from './administrator';
import { config } from '../app/config/config';

const {Header, Footer} = Layout;

function getNoticeData(notices) {
    if (notices.length === 0) {
      return {};
    }
    const newNotices = notices.map((notice) => {
      const newNotice = { ...notice };
        if (newNotice.datetime) {
            if (newNotice.type === "Todo"){
                newNotice.datetime = '';
            } else {
                newNotice.datetime = moment(notice.datetime).add(8,'hours').fromNow();
            }
        }
      // transform id to item key
      if (newNotice.id) {
        newNotice.key = newNotice.id;
      }
      if (newNotice.extra && newNotice.status) {
        const color = ({
          todo: '',
          processing: 'blue',
          urgent: 'red',
          doing: 'gold',
        })[newNotice.status];
        newNotice.extra = <Tag color={color} style={{ marginRight: 0 }}>{newNotice.extra}</Tag>;
      }
      return newNotice;
    });
    return _.groupBy(newNotices, 'type');
  }
  
  
class EHubHeader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            notices: []
        }
    };
    componentDidMount() {
        // getNotice('30,32').then(res => sessionStorage.setItem(this.IS_NOTICE, JSON.stringify(res)))
        getNotice('30,32').then(res => this.setState({notices:res}))
    }

    onItemClick = (item, tabProps) => {
        switch (item.pageName) {
            case 'receiptManagement':
                let items = item.description;
                let title = item.title;
                let waybillNo = title.match(/号(\S*)待/)[1].trim(" ");
                let receiptSearchConditions = [];
                receiptSearchConditions["brandCode"] = items.split("品牌")[0].trim(" ");
                receiptSearchConditions["shipmentPlantId"] = items.split(",")[1].split("->")[0].trim(" ");
                receiptSearchConditions["receiptPlantId"] = items.split(",")[1].split("->")[1].trim(" ");
                receiptSearchConditions["waybillNo"] = waybillNo;
                receiptSearchConditions["startDateTime"] = items.split("出库日期")[1].trim(" ").replace(/-/g, "")+"000000";
                receiptSearchConditions["finishDateTime"] = items.split("出库日期")[1].trim(" ").replace(/-/g, "")+"235959";
        
                sessionStorage.setItem(config.tempStorage.deliveryFormSearchConditions, JSON.stringify({...receiptSearchConditions}));
                window.location.href = "#/app/receiptManagement?waybill=" + waybillNo;
                break;
            case 'tpEhubProductMapping':
                window.location.href = "#/app/tpEhubProductMapping";
                break;
            case 'searchTPOutOfStock':
                window.location.href = "#/app/searchTPOutOfStock";
                break;
            default:
                break;
        }
    }
    onClear = (tabTitle) => {
        console.log(tabTitle);
        const {notices} = this.state;
        const noticeClear = _.filter(notices, function(o) { return o.type !== tabTitle; })
        this.setState({
            notices: noticeClear
        })
    }
    IS_ADMIN_MODE = "isAdminMode";
    handleMenu= (e) => {
        switch (e.key) {
            case "admin":
                sessionStorage.setItem(this.IS_ADMIN_MODE, JSON.stringify(true));
                window.location.href = "#/admin/roleUiMenuList";
                break;
            case "app":
                sessionStorage.setItem(this.IS_ADMIN_MODE, JSON.stringify(false));
                window.location.href = "#/app/issuedManagement";
                break;
            case "updatePassword":
                window.location.href = "#/auth/changePassword";
                break;
            case "logout":
                sessionStorage.clear();
                window.location.href = "#/auth/login";
                break;
        }
    };

    render() {
        const {backgroundColor} = this.props;
        const {notices} = this.state;
        const styles = {
            header: {
                padding: '120 120 120 120',
                background: backgroundColor,
                boxShadow: '0 1px 4px rgba(0, 21, 41, .08)',
                position: 'relative',
                color: '#ccc'
            },
            right: {
                float: 'right',
                height: '100%'
            },
            avatar: {
                margin: '20px 8px 20px 0',
                color: '@primary-color',
                background: 'rgba(255, 255, 255, .85)',
                verticalAlign: 'middle'
            },
            menu: {
                ':global(.anticon)': {
                    marginRight: '8px'
                },
                ':global(.antDropdownMenuItem)': {
                    width: '160px'
                }
            },
            action: {
                cursor: 'pointer',
                padding: '0 12px',
                display: 'inline-block',
                transition: 'all .3s',
                height: '100%'
            },
            logo: {
                width: '120px',
                height: '31px',
                background: '#333',
                borderRadius: '6px',
                margin: '16px 28px 16px 0',
                float: 'left'
            }
        };
        const menu = (
            <Menu style={{...styles.menu}} selectedKeys={[]} onClick={this.handleMenu}>
                <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
                <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
                {administrator.indexOf(UserInfoEntity.getUserName()) > -1 ? (
                    JSON.parse(sessionStorage.getItem(this.IS_ADMIN_MODE)) ?
                        <Menu.Item key="app"><Icon type="setting" />使用者</Menu.Item> : <Menu.Item key="admin"><Icon type="setting" />管理者</Menu.Item>
                ) : ''}
                <Menu.Item key="updatePassword" ><Icon type="edit" />修改密码</Menu.Item>
                <Menu.Divider />
                <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
            </Menu>
        );
        return(
            <Header style={{... styles.header}}>
                <div>
                    <img style={{...styles.logo}} src="../assets/img/pangpang.png"/>
                </div>
                <div style={{...styles.right}}>
                    <NoticeIcon
                        className="notice-icon"
                        count={notices.length}
                        onItemClick={this.onItemClick}
                        onClear={this.onClear}
                        popupAlign={{ offset: [20, -16] }}
                        >
                        <NoticeIcon.Tab
                            list={getNoticeData(notices)['Notice']}
                            title="Notice"
                            emptyText="你已查看所有通知"
                            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                        />
                        <NoticeIcon.Tab
                            list={getNoticeData(notices)['Todo']}
                            title="Todo"
                            emptyText="你已查看所有待办"
                            emptyImage="https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg"
                        />
                    </NoticeIcon>
                    &nbsp;
                    <Dropdown overlay={menu}>
                              <span style={{...styles.action}}>
                                  <Avatar size="small" style={{...styles.avatar}} src='https://gw.alipayobjects.com/zos/rmsportal/kZzEzemZyKLKFsojXItE.png'/>
                                  {UserInfoEntity.getUserName()}
                              </span>
                    </Dropdown>
                </div>
            </Header>
        );
    }
}

EHubHeader.propTypes = {
    backgroundColor: PropTypes.string.isRequired
};

const EHubFooter = () => (
    <Footer style={{ textAlign: 'center' }}>
        <b>eHubDelivery ©2018 Created by Pangpang</b>
    </Footer>
);

export {EHubHeader, EHubFooter};