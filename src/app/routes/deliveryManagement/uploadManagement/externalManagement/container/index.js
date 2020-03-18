import React from 'react';

import {Icon, Layout, Row, Spin} from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import 'ant-design-pro/dist/ant-design-pro.css';
import {IssueReceiptUploader} from '../components';

import DeliveryInfo from '../../components/DeliveryInfo';
import {connect} from "react-redux";

const {Content} = Layout;

// External Plant Delivery Mangement
class Index extends React.Component {
    render() {
        const {loading} = this.props;
        return (
            <Spin spinning={loading} tip={"加载中.."}>
                <Content>
                    <Row style={{marginBottom: 20}}>
                        <PageHeader title={<p><Icon type="upload"/>&nbsp;&nbsp;&nbsp;入出库信息上传</p>}/>
                    </Row>
                    <Row>
                        <IssueReceiptUploader/>
                    </Row>
                    <DeliveryInfo type='REGISTRATION'/>
                </Content>
            </Spin>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading
    })
};
export default connect(mapStateToProps, {
})(Index);