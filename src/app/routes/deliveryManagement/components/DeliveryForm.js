import React from 'react';
import {connect} from 'react-redux';
import {Button, Col, Form, Input, Row, Select} from 'antd';
import {config} from 'config/config';
import {DeliveryEntity, UserInfoEntity} from 'entities';
import EHubDeliveryUtil from 'util/EHubDeliveryUtil';
import {EHubSearchRangePicker} from 'components/formItem'

import {loadIssuedDeliveries} from '../issuedManagement/reducer/issuedDeliveryListReducer';
import {loadReceiptDeliveries} from '../receiptManagement/reducer/receiptDeliveryListReducer';
import EHubBrandCodeSelector from '../../../components/formItem/EHubBrandCodeSelector';

const FormItem = Form.Item;
const Option = Select.Option;

class DeliveryForm extends React.Component {
    receiptPlantChange = (e) => {
        if (this.props.type === 'receipt')
            this.changeAllPlantFilterList(e);
    }

    brandChange = (e) => {
        const {plantList} = this.state;
        this.setState({
            plantFilterList: plantList.filter(item => e.indexOf(item.brandCode) !== -1),
            allPlantFilterList: this.allPlantList.filter(item => e.indexOf(item.brandCode) !== -1 && !(item.plantType === 'BRW' && item.returnPlant === false)),
            selectedBrand: e,
            allPlantFilterListToReceipt: this.allPlantList.filter(item => e.indexOf(item.brandCode) !== -1)
        });
        this.props.form.resetFields(["shipmentPlantId", "receiptPlantId"]);
    }
    issuePlantChange = (e) => {
        if (this.props.type === 'issue')
            this.changeAllPlantFilterList(e);
    }

    constructor(pros) {
        super(pros);
        const layoutInfo = JSON.parse(sessionStorage.getItem(config.layoutInfo));
        this.allPlantList = layoutInfo.UserBrandAllPlants;

        this.state = {
            brandList: layoutInfo.UserInfo.colleague.brands,
            plantList: layoutInfo.UserBrandUserPlants,
            plantFilterList: layoutInfo.UserBrandUserPlants.filter(item => layoutInfo.UserInfo.colleague.brands[0].brandCode.indexOf(item.brandCode) !== -1 ),
            allPlantFilterList: this.allPlantList.filter(item =>
                item.brandCode === layoutInfo.UserInfo.colleague.brands[0].brandCode && !(item.plantType === 'BRW' && item.returnPlant === false)
            ),
            selectedBrand: layoutInfo.UserInfo.colleague.brands[0].brandCode,
            allPlantFilterListToReceipt: this.allPlantList.filter(item =>
                item.brandCode === layoutInfo.UserInfo.colleague.brands[0].brandCode
            ),
        }
    }

    componentDidMount(){
        if (sessionStorage.getItem(config.tempStorage.deliveryFormSearchConditions) !== null){
            const searchCondition = JSON.parse(sessionStorage.getItem(config.tempStorage.deliveryFormSearchConditions));
            this.props.form.setFieldsValue({
                shipmentPlantId: searchCondition.shipmentPlantId,
                receiptPlantId: searchCondition.receiptPlantId,
                waybillNo: searchCondition.waybillNo
            });
            sessionStorage.removeItem(config.tempStorage.deliveryFormSearchConditions);
        }
    }

    changeAllPlantFilterList(plantCode) {
        const { selectedBrand } = this.state;
        const allPlantFilterList = this.allPlantList.filter(item =>
            item.brandCode === selectedBrand && item.plantCode !== plantCode && !(item.plantType === 'BRW' && item.returnPlant === false)
        );
        const allPlantFilterListToReceipt = this.allPlantList.filter(item =>
            item.brandCode === selectedBrand && item.plantCode !== plantCode
        );

        this.setState({ allPlantFilterList: allPlantFilterList, allPlantFilterListToReceipt: allPlantFilterListToReceipt });
    }

    validateInput = (rule, value, callback) => {
        if(!value) {
            callback();
        }else if (value.replace(/^[A-Za-z0-9]+$/g,'') !== '') {
            callback('输入非法字符,请重新输入!');
        } else {
            callback();
        }
    }

    setInitialDateRange = (type, startDateTime, endDateTime) => {
        const today = EHubDeliveryUtil.daysAgo(0, 'YYYY/MM/DD');
        const startDate = startDateTime !== undefined ? moment(startDateTime, 'YYYY-MM-DD HH:mm:ss') : EHubDeliveryUtil.daysAgo(7, 'YYYY/MM/DD');    // a week ago
        const yesterday = endDateTime !== undefined ? moment(endDateTime, 'YYYY-MM-DD HH:mm:ss') : EHubDeliveryUtil.daysAgo(1, 'YYYY/MM/DD');
        return type === 'receipt' ? [yesterday, yesterday] : [startDate, today]
    };

    render() {
        const { type } = this.props;
        let defaultBrandCd, startDateTime, finishDateTime
        if (sessionStorage.getItem(config.tempStorage.deliveryFormSearchConditions) !== null){
            const searchCondition = JSON.parse(sessionStorage.getItem(config.tempStorage.deliveryFormSearchConditions));
            defaultBrandCd = searchCondition.brandCode;
            startDateTime = searchCondition.startDateTime;
            finishDateTime = searchCondition.finishDateTime;
        }        
        const { brandList, plantFilterList, allPlantFilterList, allPlantFilterListToReceipt } = this.state;
        const { getFieldDecorator } = this.props.form;
        const styles = {
            visibleByPlant: { display: UserInfoEntity.isInspectWarehouse() ? "block" : "none" }
        };
        const formItemLayout = {
            labelCol: { span: 4 },
            wrapperCol: { span: 20 }
        };
        
        return(
            <Form onSubmit={this.props.onSubmit}>
                <legend>{type === 'issue' ? "出库查询条件" : "入库查询条件"}</legend>
                <Row gutter={8}>
                    <EHubBrandCodeSelector refForm={this.props.form} span={6} onChange={this.brandChange} type = {type} defaultBrandCd = {defaultBrandCd}/>
                    <Col span={6}>
                        <FormItem
                            {...formItemLayout}
                            label="出库地"
                            hasFeedback
                        >
                            {getFieldDecorator('shipmentPlantId', {
                                rules: [{ required: true, message: '请输入出库地!'}],
                            })(
                                <Select placeholder="出库地"
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    optionFilterProp="children"
                                    onChange={this.issuePlantChange}
                                >
                                    {type === 'issue' ?
                                        plantFilterList.map((plant, index) => {
                                            return <Option key={index} value={plant.plantCode}>{plant.plantName + '(' + plant.plantCode + ')'}</Option>
                                        }) :
                                        allPlantFilterListToReceipt.map((plant, index) => {
                                            return <Option key={index} value={plant.plantCode}>{plant.plantName + '(' + plant.plantCode + ')'}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            {...formItemLayout}
                            label="入库地"
                            hasFeedback
                        >
                            {getFieldDecorator('receiptPlantId', {
                                rules: [{ required: true, message: '请输入入库地!' }],
                            })(
                                <Select placeholder="入库地"
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    optionFilterProp="children"
                                    onChange={this.receiptPlantChange}
                                >
                                    {type === 'receipt' ?
                                        plantFilterList.map((plant, index) => {
                                            return <Option key={index} value={plant.plantCode}>{plant.plantName + '(' + plant.plantCode + ')'}</Option>
                                        }) :
                                        allPlantFilterList.filter(item => window._.map(brandList, 'brandCode').indexOf(item.brandCode) !== -1 ).map((plant, index) => {
                                            return <Option key={index} value={plant.plantCode}>{plant.plantName + '(' + plant.plantCode + ')'}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            {...formItemLayout}
                            label="状态"
                            hasFeedback
                        >
                            {getFieldDecorator('statusCode', {
                                rules: [{ required: false }],
                                initialValue: '',
                            })(
                                <Select placeholder="状态"
                                    showSearch
                                    filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                    optionFilterProp="children"
                                >
                                    <Option key={-1} value=''>All</Option>
                                    {DeliveryEntity.getDeliveryStatusMap.map((item, index) => {
                                        return <Option key={index} value={item.code}>{item.text}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row gutter={8}>
                    <Col span={6}>
                        <FormItem
                            {...formItemLayout}
                            label="运单号"
                            hasFeedback
                        >
                            {getFieldDecorator('waybillNo', {
                                rules: [{ required: false }, {
                                    validator: this.validateInput,
                                  }],
                                  initialValue: ''
                            })(
                                <Input placeholder="运单号"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            {...formItemLayout}
                            label="款号"
                            hasFeedback
                        >
                            {getFieldDecorator('styleCode', {
                                rules: [{ required: false }, {
                                    validator: this.validateInput,
                                  }],
                                  initialValue: ''
                            })(
                                <Input placeholder="款式" />
                            )}
                        </FormItem>
                    </Col>
                    <EHubSearchRangePicker refForm={this.props.form} initialValue={this.setInitialDateRange(type, startDateTime, finishDateTime)}/>
                </Row>
                <footer style={{float: 'right'}}>
                    <Button type="primary" htmlType="submit" >查询</Button>
                </footer>
            </Form>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
    })
};
export default connect(mapStateToProps, {
    loadIssuedDeliveries, loadReceiptDeliveries
})(Form.create()(DeliveryForm));
