import React from 'react';
import {connect} from 'react-redux';

import {Icon, Layout, Row, Spin} from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import 'ant-design-pro/dist/ant-design-pro.css';
import {TpPlantDeliveryUploader} from '../components';
import TpPlantDeliveryInfo from '../../components/TpPlantDeliveryInfo';

const {Content} = Layout;

// uploadTpPlantDeliveries
class Index extends React.Component {
    saveFormRef = (TpPlantDeliveryUploader) => this.tpPlantUploaderForm = TpPlantDeliveryUploader;

    render() {
        const {loading} = this.props;
        return (
            <Spin spinning={loading} tip={"加载中.."}>
                <Content>
                    <Row style={{marginBottom: 20}}>
                        <PageHeader title={<p><Icon type="upload"/>&nbsp;&nbsp;&nbsp;补充入出库上传</p>}/>
                    </Row>
                    <Row>
                        <TpPlantDeliveryUploader wrappedComponentRef={this.saveFormRef}/>
                    </Row>
                    <TpPlantDeliveryInfo
                        type={this.tpPlantUploaderForm ? this.tpPlantUploaderForm.props.form.getFieldValue("tpDeliveryType") : ''}
                        platformCode={this.tpPlantUploaderForm ? this.tpPlantUploaderForm.props.form.getFieldValue("platformCode") : ''}
                        />
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
export default connect(mapStateToProps, {})(Index);