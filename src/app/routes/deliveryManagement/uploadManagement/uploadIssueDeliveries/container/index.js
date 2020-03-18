import React from 'react';
import {connect} from 'react-redux';

import {Icon, Layout, Row, Spin} from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import 'ant-design-pro/dist/ant-design-pro.css';
import {IssueUploader} from '../components';
import DeliveryInfo from '../../components/DeliveryInfo';

const {Content} = Layout;

// uploadIssueDeliveries
class Index extends React.Component {
    render() {
        const {loading} = this.props;
        return (
            <Spin spinning={loading} tip={"加载中.."}>
                <Content>
                    <Row style={{ marginBottom: 20 }}>
                        <PageHeader title={<p><Icon type="upload"/>&nbsp;&nbsp;&nbsp;出库信息上传</p>}/>
                    </Row>
                    <Row>
                        <IssueUploader/>
                    </Row>
                    <DeliveryInfo type='SHIPMENT'/>
                </Content>
            </Spin>
        )
    }
}
const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading
    });
};
export default connect(mapStateToProps, {
})(Index);