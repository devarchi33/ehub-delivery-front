import React from 'react';
import {connect} from 'react-redux';

import {Icon, Layout, Row, Spin} from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import 'ant-design-pro/dist/ant-design-pro.css';
import {ReceiptUploader} from '../components';

import DeliveryInfo from '../../components/DeliveryInfo';

const {Content} = Layout;

// uploadReceiptDeliveries
class Index extends React.Component {
    render() {
        const {loading} = this.props;
        return (
            <Spin spinning={loading} tip={"加载中.."}>
                <Content>
                    <Row style={{marginBottom: 20}}>
                        <PageHeader title={<p><Icon type="upload"/>&nbsp;&nbsp;&nbsp;入库信息上传</p>}/>
                    </Row>
                    <Row>
                        <ReceiptUploader/>
                    </Row>
                    <DeliveryInfo type='RECEIPT'/>
                </Content>
            </Spin>
        );
    };
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading
    });
};
export default connect(mapStateToProps, {
})(Index);