import React from 'react';
import {connect} from 'react-redux';
import {Button, Col, Form, Row, Select, DatePicker} from 'antd';

import EHubBrandCodeSelector from '../../../../components/formItem/EHubBrandCodeSelector';
import TpDeliveryTypeSelector from '../../../../components/formItem/TpDeliveryTypeSelector';
import DownloadExcelTemplate from '../../../../components/excel/DownloadExcelTemplate';
import EHubDeliveryUtil from "../../../../util/EHubDeliveryUtil";
import PlatformEntity from '../../../../entities/PlatformCodeEntity';

const {RangePicker} = DatePicker;
const FormItem = Form.Item;
const Option = Select.Option;

class StatisticsTpPlantDeliverySearchCondition extends React.Component {
    render() {
        const {originalTpPlantDeliveryList} = this.props;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        };
        const excelColumnsConfig = [
            {label: "TP截止日期", value: "closingDate"},
            {label: "类型", value: "deliveryType"},
            {label: "平台", value: "platformCode"},
            {label: "主品牌", value: "brandCode"},
            {label: "子品牌", value: "skuBrandCode"},
            {label: "仓库", value: "plantId"},
            {label: "商品代码", value: "productId"},
            {label: "数量", value: "qty"},
            {label: "运单号", value: "shippingNo"},
            {label: "外部编号", value: "tradeId"},
            {label: "确认时间", value: "confirmTime"},
            {label: "交货号", value: "ehubDeliveryNo"},
            {label: "生成日期", value: "ehubInterfaceDate"},
            {label: "状态", value: "statusCode"},
            {label: "原因", value: "errorReason"},
            {label: "创建人", value: "createdBy"}
        ];
        const excelFileName = "OriginalTpPlantDelivery";
        return (
            <Form onSubmit={this.props.onSubmit}>
                <Row>
                    <EHubBrandCodeSelector refForm={this.props.form} span={4}/>
                    <TpDeliveryTypeSelector refForm={this.props.form} span={4} formKey='deliveryType'
                                            formItemLayout={formItemLayout}/>
                    <Col span={4}>
                        <FormItem
                            {...formItemLayout}
                            label="平台"
                            hasFeedback
                        >
                            {getFieldDecorator('platformCode', {
                                rules: [{required: false, message: '请输入平台!'}],
                                initialValue: 'All'
                            })(
                                <Select placeholder="平台" >
                                    <Option key={'All'} value={'All'}>{'全部'}</Option>
                                    {PlatformEntity.findAllKindOfPlatform().map(platform => <Option key={platform.platformCode}>{platform.platformName}</Option>)}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={4}>
                        <FormItem
                            {...formItemLayout}
                            label="状态"
                            hasFeedback
                        >
                            {getFieldDecorator('statusCode', {
                                rules: [{required: false, message: '请输入状态!'}],
                                initialValue: 'All'
                            })(
                                <Select placeholder="状态"
                                        optionFilterProp="children"
                                >
                                    <Option key={'All'} value={'All'}>{'全部'}</Option>
                                    <Option key={'10'} value={'10'}>{'未处理'}</Option>
                                    <Option key={'20'} value={'20'}>{'已处理'}</Option>
                                    <Option key={'30'} value={'30'}>{'错误商品代码'}</Option>
                                    <Option key={'31'} value={'31'}>{'错误商品代码（被影响）'}</Option>
                                    <Option key={'32'} value={'32'}>{'库存不足'}</Option>
                                    <Option key={'33'} value={'33'}>{'库存不足（被影响）'}</Option>
                                    <Option key={'40'} value={'40'}>{'已修改'}</Option>
                                    <Option key={'50'} value={'50'}>{'异常'}</Option>
                                    <Option key={'90'} value={'90'}>{'赠品'}</Option>
                                    <Option key={'99'} value={'99'}>{'删除'}</Option>
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={8}>
                        <FormItem
                            {...formItemLayout}
                            label="TP截止日期"
                            hasFeedback
                        >
                            {getFieldDecorator('closingDate', {
                                rules: [{type: 'array', required: true}],
                                initialValue: [EHubDeliveryUtil.daysAgo(1, 'YYYYMMDD'), EHubDeliveryUtil.daysAgo(1, 'YYYYMMDD')]
                            })(
                                <RangePicker placeholder={["从日期","到日期"]}
                                    size={"default"}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span={1} offset={22}>
                        <Button type="primary" htmlType="submit">查询</Button>
                    </Col>
                    <Col span={1}>
                        <DownloadExcelTemplate columnConfigList={[excelColumnsConfig]}
                                               sheetDataList={[originalTpPlantDeliveryList]}
                                               fileName={excelFileName}/>
                    </Col>
                </Row>
            </Form>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        originalTpPlantDeliveryList: state.searchTpOriginalDeliveryReducer.originalTpPlantDeliveryList
    })
};
export default connect(mapStateToProps, {})(Form.create()(StatisticsTpPlantDeliverySearchCondition));
