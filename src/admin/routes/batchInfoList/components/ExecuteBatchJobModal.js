import React from 'react';
import {Button, Checkbox, Form, Modal, notification, Popconfirm, DatePicker } from 'antd';
import connect from 'react-redux/es/connect/connect';
import globalStore from '../../../store/configureStore';

import {initializeEHubMaster} from '../../../../app/routes/service';
import {executeJob, forceExecuteJob} from '../service';
import EHubDeliveryUtil from '../../../../app/util/EHubDeliveryUtil';
import { PlatformEntity } from '../../../../app/entities';

const FormItem = Form.Item;

class ExecuteBatchJobModal extends React.Component {
    state = {
        forceFinishBtnVisible: false
    };

    handleOk = () => {
        const {form, selectedBatchInfo} = this.props;
        const {selectedBrandCodeList, selectedPlatformCodeList, endDate} = this.state;
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            executeJob(selectedBatchInfo['jobName'], selectedBrandCodeList, selectedPlatformCodeList, endDate)
                .then(existProcessingJob => {
                    if (!existProcessingJob) {
                        this.setState({forceFinishBtnVisible: true});
                        notification['warning']({
                            message: '目前存在正在执行的BatchJob，请耐心等待~',
                            duration: 5
                        });
                    } else {
                        notification['success']({
                            message: "Execute Success",
                            duration: 2
                        });
                    }
                });
        });
    };

    handleCancel = () => globalStore.dispatch({
        type: "SET_EXECUTE_BATCH_JOB_MODAL_VISIBLE",
        payload: {visible: false, record: null}
    });

    handleToggle = () => {
        const {selectedBrandCodeList} = this.state;
        const toggledList = _.difference(this.batchExecuteBrandList, selectedBrandCodeList);
        this.setState({selectedBrandCodeList: toggledList});
        this.props.form.setFieldsValue({
            brandCode: toggledList
        });
    };

    constructor(props) {
        super(props);
        this.eHubMaster = initializeEHubMaster();
        this.batchExecuteBrandList = this.eHubMaster.brandList.map(brand => brand.brandCode);
        this.state = {
            selectedBrandCodeList: [],
            selectedPlatformCodeList: [],
            endDate: EHubDeliveryUtil.daysAgo(1, "YYYYMMDD").format("YYYYMMDD")
        };
    }

    confirm = (e) => {
        this.handleOk();
    }

    forceConfirm = (e) => {
        const {selectedBatchInfo } = this.props;
        const {selectedBrandCodeList, selectedPlatformCodeList, endDate} = this.state;
        forceExecuteJob(selectedBatchInfo['jobName'], selectedBrandCodeList, selectedPlatformCodeList, endDate).then(res => {
            if (res){
                notification['success']({
                    message: "Execute Success",
                    duration: 2
                });
            } else {
                notification['error']({
                    message: "Execute Error",
                    duration: 2
                });  
            }
        });
        this.setState({forceFinishBtnVisible: false});
    } 

    cancel = (e) => {}

    render() {
        const {batchJobModalVisible, form, selectedBatchInfo} = this.props;
        const isInternalBatch = this.props.selectedBatchInfo ? this.props.selectedBatchInfo.batchName === "ehub-internal-batch" : false;
        const isEVJob = this.props.selectedBatchInfo ? this.props.selectedBatchInfo.jobName === "tpPlantB2BDeliveryJob" : false;
        
        const {selectedBrandCodeList, forceFinishBtnVisible, endDate} = this.state;
        const {getFieldDecorator} = form;
        return (
            <Modal
                visible={batchJobModalVisible}
                title={"Execute " + (selectedBatchInfo ? selectedBatchInfo.jobName : '')}
                onCancel={this.handleCancel}
                onOk={this.handleOk}
                footer={[
                    <Popconfirm
                        title="确定要执行吗？"
                        onConfirm={this.confirm}
                        onCancel={this.cancel}
                        okText="确定"
                        cancelText="取消"
                        key="sendings"
                    >
                        <Button key="send" type="primary" htmlType="submit">执行</Button>
                    </Popconfirm>,
                    <Popconfirm
                        title="确定要强制执行吗？"
                        onConfirm={this.forceConfirm}
                        onCancel={this.cancel}
                        okText="确定"
                        cancelText="取消"
                        key="forceSendings"
                    >
                        <Button key="forceFinish" type="primary" htmlType="submit" style={{display: forceFinishBtnVisible ? 'inline' : 'none'}}>强制执行</Button>
                    </Popconfirm>,
                    <Button key="back" onClick={this.handleCancel}>返回</Button>
                ]}
            >
                <Form layout="vertical">
                    <FormItem>
                        <Button onClick={this.handleToggle} size={'small'}>反选品牌</Button>
                    </FormItem>
                    <FormItem label="BrandCode">
                        {getFieldDecorator('brandCode', {
                            rules: [{required: true, message: '请选择品牌~'}],
                        })(
                            <Checkbox.Group style={{width: '100%'}}
                                            onChange={(checkedValues) => this.setState({selectedBrandCodeList: checkedValues})}>
                                {this.batchExecuteBrandList.map(brandCode => {
                                    return <Checkbox key={brandCode} value={brandCode}>{brandCode}</Checkbox>;
                                })}
                            </Checkbox.Group>
                        )}
                    </FormItem>
                    {
                        isInternalBatch && !isEVJob ? 
                        <FormItem label="PlatformCode">
                            {getFieldDecorator('platformCode', {
                                rules: [{required: true, message: '请选择平台~'}],
                            })(
                                <Checkbox.Group style={{width: '100%'}}
                                                onChange={(checkedValues) => this.setState({selectedPlatformCodeList: checkedValues})}>
                                    {PlatformEntity.findAllKindOfPlatform().map(platform => {
                                        return <Checkbox key={platform.platformCode} value={platform.platformCode}>{platform.platformName}</Checkbox>;
                                    })}
                                </Checkbox.Group>
                            )}
                        </FormItem> : ''
                    }
                    {
                        isInternalBatch ? 
                        <FormItem label="Date">
                            {getFieldDecorator('date', {
                                rules: [{required: true, message: '请选择日期~'}],
                                initialValue: moment(EHubDeliveryUtil.daysAgo(1, "YYYYMMDD"))
                            })(
                                <DatePicker onChange={(checkedDates) => this.setState({endDate: checkedDates ? checkedDates.format("YYYYMMDD") : ''})} />
                            )}
                        </FormItem> : ''
                    }
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        editingKey: state.commonReducer.editingKey,
        batchJobModalVisible: state.batchInfoListReducer.batchJobModalVisible,
        selectedBatchInfo: state.batchInfoListReducer.selectedBatchInfo
    })
};
export default connect(mapStateToProps, {})(Form.create()(ExecuteBatchJobModal));