import React from 'react';
import {connect} from 'react-redux';
import {Button, Col, Form, notification, Row, DatePicker} from 'antd';

import StatisticsCompareModal from './StatisticsCompareModal';
import {setModalVisible} from '../../../../reducer/commonReducer';
import DownloadExcelTemplate from "../../../../components/excel/DownloadExcelTemplate";
import {eHubException} from "../../../../exception";
import EHubDeliveryUtil from "../../../../util/EHubDeliveryUtil";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

class StatisticsTpPlantDeliverySearchCondition extends React.Component {
    showModal = () => {
        const {setModalVisible, statisticsTpPlantDeliveryList} = this.props;
        if (statisticsTpPlantDeliveryList.length === 0) {
            notification['warning']({
                message: '请先查询数据。',
                duration: null
            });
            throw new eHubException("先查询后下载一下。");
        }
        setModalVisible(true);
    };

    render() {
        const {statisticsTpPlantDeliveryList} = this.props;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 18}
        };
        const excelColumnsConfig = [
            {label: "品牌", value: "brandCode"},
            {label: "天猫入库", value: "tmallOrTotalSumQty"},
            {label: "天猫入库成功", value: "tmallOrSuccessSumQty"},
            {label: "天猫出库", value: "tmallOsTotalSumQty"},
            {label: "天猫出库成功", value: "tmallOsSuccessSumQty"},
            {label: "唯品会入库", value: "vipOrTotalSumQty"},
            {label: "唯品会入库成功", value: "vipOrSuccessSumQty"},
            {label: "唯品会出库", value: "vipOsTotalSumQty"},
            {label: "唯品会出库成功", value: "vipOsSuccessSumQty"},
            {label: "京东入库", value: "jsOrTotalSumQty"},
            {label: "京东入库成功", value: "jdOrSuccessSumQty"},
            {label: "京东出库", value: "jdOsTotalSumQty"},
            {label: "京东出库成功", value: "jdOsSuccessSumQty"},
            {label: "有赞入库", value: "youzanOrTotalSumQty"},
            {label: "有赞入库成功", value: "youzanOrSuccessSumQty"},
            {label: "有赞出库", value: "youzanOsTotalSumQty"},
            {label: "有赞出库成功", value: "youzanOsSuccessSumQty"},
            {label: "爱库存入库", value: "aikucunOrTotalSumQty"},
            {label: "爱库存入库成功", value: "aikucunOrSuccessSumQty"},
            {label: "爱库存出库", value: "aikucunOsTotalSumQty"},
            {label: "爱库存出库成功", value: "aikucunOsSuccessSumQty"},
            {label: "外部平台出库", value: "externalOsTotalSumQty"},
            {label: "外部平台出库成功", value: "externalOsSuccessSumQty"}
        ];
        const excelFileName = "StatisticsTpPlantDelivery";
        const {getFieldDecorator} = this.props.form;
        return (
            <Form onSubmit={this.props.onSubmit}>
                <Row>
                    <Col span={8} >
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
                    <Col span={1} offset={12}>
                        <Button type="primary" htmlType="submit">查询</Button>
                    </Col>
                    <Col span={1} style={{marginLeft: 5}}>
                        <Button type="primary" onClick={this.showModal}>对比</Button>
                    </Col>
                    <Col span={1}>
                        <DownloadExcelTemplate columnConfigList={[excelColumnsConfig]}
                                               sheetDataList={[statisticsTpPlantDeliveryList]}
                                               fileName={excelFileName}/>
                    </Col>
                </Row>
                <Row>
                    <StatisticsCompareModal closingDate={this.props.form.getFieldValue("closingDate")}/>
                </Row>
            </Form>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        visible: state.commonReducer.visible,
        statisticsTpPlantDeliveryList: state.searchTpOriginalDeliveryReducer.statisticsTpPlantDeliveryList
    })
};
export default connect(mapStateToProps, {
    setModalVisible
})(Form.create()(StatisticsTpPlantDeliverySearchCondition));
