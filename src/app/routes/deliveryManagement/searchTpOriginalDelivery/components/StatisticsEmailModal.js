import React from 'react';
import {connect} from 'react-redux';
import {AutoComplete, Button, Col, Form, Icon, Input, Modal, notification, Row, Spin, Tag, Upload} from 'antd';
import globalStore from '../../../../store/configureStore';
import {deleteEmailAttachFile, saveEmailAttachFile, sendEmailAboutCompareResult} from '../service';
import {ExcelProcess} from '../../uploadManagement/util/excelProcess';
import UserInfoEntity from '../../../../entities/UserInfoEntity';

const Option = AutoComplete.Option;
const FormItem = Form.Item;

class StatisticsCompareModal extends React.Component {
    resetEmailModal = () => {
        globalStore.dispatch({type: "SET_EMAIL_MODAL_VISIBLE", payload: false});
        globalStore.dispatch({type: "SET_ATTACH_FILE_LIST", payload: []});
        this.props.form.setFieldsValue({emailAddress: ''});
    };

    handleClose = () => {
        this.setState({sendAddressList: []}, () => {
            deleteEmailAttachFile();
            this.resetEmailModal();
        });

    };

    sendEmail = (e) => {
        e.preventDefault();
        const {sendAddressList} = this.state;
        const {statisticsSelectedRows} = this.props;
        const addressChecker = sendAddressList.length === 0;
        if (addressChecker) {
            notification['warning']({
                message: '先输入邮件地址',
                duration: 2
            });
            return null;
        }

        this.setState({sendAddressList: []}, () => {
            sendEmailAboutCompareResult(sendAddressList, statisticsSelectedRows);
            notification['success']({
                message: '发邮件 成功',
                duration: 2
            });
            this.resetEmailModal();
        });
    };

    handleEnter = () => {
        const email = this.props.form.getFieldValue('newEmailAddress');
        if (this.emailValidator.test(email)) {
            const {sendAddressList} = this.state;
            this.setState({sendAddressList: [...sendAddressList, email]}, () => {
                const emailList = JSON.parse(localStorage.getItem(this.EMAIL_LIST));
                if ((emailList.indexOf(email) === -1)) {
                    emailList.push(email);
                    localStorage.setItem(this.EMAIL_LIST, JSON.stringify(emailList));
                }
                this.props.form.setFieldsValue({newEmailAddress: ''});
            });
        }
    };

    onSelect = (email) => {
        const {sendAddressList} = this.state;
        this.setState({sendAddressList: _.uniq([...sendAddressList, email]),});
    };

    constructor(props) {
        super(props);
        this.EMAIL_LIST = "EMAIL_LIST";
        this.emailValidator = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
        if (!localStorage.getItem(this.EMAIL_LIST)) {
            localStorage.setItem(this.EMAIL_LIST, JSON.stringify([
                "qchuang@best-inc.com", "SHIN_YOUNGHO01@eland.co.kr", "Tai.ChengZhe@elandsystems.com.cn",
                "Quan.MeiXian@eland.co.kr", "Jiang.XiaoYu@elandsystems.com.cn", "jyu.gyl@best-inc.com",
                "jgli.sh@best-inc.com", "bbyang@best-inc.com"
            ]));
        }
        this.state = {sendAddressList: []};
    }

    render() {
        const {emailModalVisible, statisticsSelectedRows, loading, attachFileList} = this.props;
        const {sendAddressList} = this.state;
        const {getFieldDecorator} = this.props.form;

        const emailList = JSON.parse(localStorage.getItem(this.EMAIL_LIST));

        const uploadProps = {
            ...ExcelProcess.getCommonExcelProps(`/email/save-attach-file?sendBy=${UserInfoEntity.getUserName()}`),
            showUploadList: true,
            multiple: true,
            beforeUpload: (file) => {
                saveEmailAttachFile(file);
                return false;
            },
            onChange: ({file, fileList, event}) => globalStore.dispatch({
                type: "SET_ATTACH_FILE_LIST",
                payload: fileList
            }),
            fileList: attachFileList,
            defaultFileList: attachFileList,
            onRemove: (file) => ExcelProcess.uploadStatusTracer(file, "REMOVE_ATTACH_FILE")
        };

        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14}
        };

        return (
            <Modal
                visible={emailModalVisible}
                width={800}
                title={<Row>
                    <Col>
                        <h3>发邮件</h3>
                    </Col>
                </Row>}
                onCancel={this.handleClose}
                footer={[
                    <Button key="send" type="primary" htmlType="submit" onClick={this.sendEmail}>传送</Button>,
                    <Button key="back" onClick={this.handleClose}>返回</Button>
                ]}
            >
                <Spin tip="附件上传中" spinning={loading}>

                    <Form>
                        <FormItem
                            {...formItemLayout}
                            label="邮件地址"
                            hasFeedback
                        >
                            {getFieldDecorator('emailAddress',
                                {
                                    rules: [{required: true, message: '请选择邮件地址!'}],
                                    initialValue: '',
                                }
                            )(
                                <AutoComplete
                                    allowClear={true}
                                    dataSource={emailList}
                                    onSelect={this.onSelect}
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    placeholder="请输入邮件地址"
                                >
                                    {emailList.filter(email => !!email).map((email, index) => {
                                        return <Option key={index} value={email}>{email}</Option>;
                                    })}
                                </AutoComplete>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="新邮件地址"
                            hasFeedback
                        >
                            {getFieldDecorator('newEmailAddress', {
                                rules: [{required: false}],
                            })(
                                <Input type="email" onPressEnter={this.handleEnter}/>
                            )}
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="发邮件信息"
                        >
                            {sendAddressList.map((emailAddress, index) => {
                                return <Tag key={emailAddress} closable={true} afterClose={() => {
                                    const tags = sendAddressList.filter(tag => tag !== emailAddress);
                                    this.setState({sendAddressList: tags});
                                }}>
                                    {emailAddress}
                                </Tag>;
                            })}
                            <h4>{statisticsSelectedRows.length > 0 ? '品牌: ' + statisticsSelectedRows.map(row => row.brandCode).reduce((initVal, record) => {
                                return initVal + ", " + record;
                            }) : '品牌: '}</h4>
                        </FormItem>
                        <FormItem
                            {...formItemLayout}
                            label="添加附件"
                        >
                            {getFieldDecorator('attachFiles', {
                                rules: [{required: false}]
                            })(
                                <Upload {...uploadProps}>
                                    <Button type="primary">
                                        <Icon type="upload"/> 附件上传
                                    </Button>
                                </Upload>
                            )}
                        </FormItem>
                    </Form>
                </Spin>
            </Modal>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        visible: state.commonReducer.visible,
        emailModalVisible: state.searchTpOriginalDeliveryReducer.emailModalVisible,
        statisticsSelectedRows: state.searchTpOriginalDeliveryReducer.statisticsSelectedRows,
        attachFileList: state.searchTpOriginalDeliveryReducer.attachFileList,
    });
};
export default connect(mapStateToProps, {})(Form.create()(StatisticsCompareModal));