import React from 'react';
import {connect} from 'react-redux';
import {Button, Col, Form, Icon, Row, Upload, Modal, Select, Spin} from 'antd';
import {searchTpPlantDelivery} from '../reducer/searchTpPlantDeliveryReducer';
import {setModalVisible} from '../../../../reducer/commonReducer';

import DownloadExcelTemplate from '../../../../components/excel/DownloadExcelTemplate';
import {makeQueryParams} from '../../../../util/httpUtil';
import UserInfoEntity from '../../../../entities/UserInfoEntity';
import {ExcelProcess} from '../../../deliveryManagement/uploadManagement/util/excelProcess';
import {initializeEHubMaster} from '../../../../routes/service';
import globalStore from '../../../../store/configureStore';

const FormItem = Form.Item;
const Option = Select.Option;
const brandList = initializeEHubMaster().brandList;

class UploadProductMappingExcel extends React.Component {
    beforeUpload = (file) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        this.setState({uploadFile: file})
    };

    uploadStatusTracer = ({file, fileList, event}) => ExcelProcess.uploadStatusTracer(file, "MODIFY_PRODUCT_CODES");

    constructor(props) {
        super(props);
        this.state = {uploadByExcel: false, uploadFile: null, brandCd: brandList[0].brandCode}
    }

    handleBrandCd =(e)=> {
        this.setState({
            brandCd: e
        })
    }

    render() {
        const {uploadFile, brandCd} = this.state;
        const {visibleModal, loading} = this.props;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 8},
            wrapperCol: {span: 16}
        };
        const excelColumnsConfig = [ // download format
            {label: 'TP商品代码', value: 'tpProductCode'},
            {label: "EHub商品代码", value: "eHubProductCode"},
        ];
        const queryString = makeQueryParams(
            ['brandCode', 'createdBy'],
            {
                brandCode: brandCd,
                createdBy: UserInfoEntity.getUserName()
            }
        );
        const uploadProps = {
            ...ExcelProcess.getCommonExcelProps('/tp-plant-delivery/modify-by-excel?' + queryString),
            beforeUpload: this.beforeUpload,
            data: {mappingFile: uploadFile},
            onChange: this.uploadStatusTracer
        };
        return (
            <Modal
                visible={visibleModal}
                title={<Row>
                    <Col>
                        <h4>批量添加Mapping信息</h4>
                    </Col>
                </Row>}
                onCancel={this.props.cancel}
                footer={[<Button key="back" size="large" onClick={this.props.cancel}>返回</Button>]}
            >
                <Spin tip="Loading..." spinning={loading}>
                    <Row>
                        <Col>
                            <div style={{float: "left", display: "inline", marginBottom: 10}}>
                                <DownloadExcelTemplate columnConfigList={[excelColumnsConfig]}
                                    isTemplate={true}
                                    btnName={'上传模板下载'}
                                    fileName={'TpProductEHubProductMapping'}/>
                            </div>
                        </Col>
                    </Row>
                    <Row gutter={8}>
                        <Form span={6}>
                            <FormItem
                                {...formItemLayout}
                                label="品牌"
                            >
                                {getFieldDecorator('brandCd', {
                                    rules: [{required: true, message: '请选择品牌!'}],
                                    initialValue: brandList[0].brandCode
                                })(
                                    <Select
                                        placeholder="品牌"
                                        showSearch
                                        onChange={this.handleBrandCd}
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        style={{ width: 200 }}
                                    >
                                        {brandList.map((brand, index) => {
                                            return <Option key={index}
                                                        value={brand.brandCode}>{brand.brandName + ' ' + brand.brandCode}</Option>
                                        })}
                                    </Select>
                                )}
                            </FormItem>
                            <FormItem
                                {...formItemLayout}
                                label="Excel"
                            >
                                {getFieldDecorator('modifyProductExcel', {
                                    rules: [{required: true, message: '请上传excel!'}],
                                })(
                                    <Upload {...uploadProps}>
                                        <Button>
                                            <Icon type="upload"/> 上传Excel文件
                                        </Button>
                                    </Upload>
                                )}
                            </FormItem>
                        </Form>
                    </Row>
                </Spin>
            </Modal>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        visible: state.commonReducer.visible,
        tpPlantDeliveries: state.searchTpPlantDelivery.tpPlantDeliveries
    });
};
export default connect(mapStateToProps, {
    searchTpPlantDelivery, setModalVisible
})(Form.create()(UploadProductMappingExcel));