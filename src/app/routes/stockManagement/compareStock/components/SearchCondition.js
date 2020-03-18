import React from 'react'
import {Button, Col, Form, Input, notification, Row, Select} from 'antd';
import {config} from 'config/config';
import EHubBrandCodeSelector from '../../../../components/formItem/EHubBrandCodeSelector';
import DownloadExcelTemplate from "../../../../components/excel/DownloadExcelTemplate";
import connect from "react-redux/es/connect/connect";
import {eHubException} from "../../../../exception";

const FormItem = Form.Item;
const Option = Select.Option;

// searchStock form
class SearchCondition extends React.Component {
    constructor(pros) {
        super(pros);
        const layoutInfo = JSON.parse(sessionStorage.getItem(config.layoutInfo));
        this.state = {
            plantList: layoutInfo.UserBrandUserPlants,
            plantFilterList: layoutInfo.UserBrandUserPlants.filter(item => layoutInfo.UserInfo.colleague.brands[0].brandCode.indexOf(item.brandCode) !== -1)
        }
    }

    brandChange = (e) => {
        const {plantList} = this.state;
        this.setState({
            plantFilterList: plantList.filter(item => e.indexOf(item.brandCode) !== -1),
        });
        this.props.form.resetFields(["plant"]);
    };

    validateInput = (rule, value, callback) => {
        if (!value) {
            callback();
        } else if (value.replace(/^[A-Za-z0-9]+$/g, '') !== '') {
            callback('输入非法字符,请重新输入!');
        } else {
            callback();
        }
    };

    render() {
        const {rawEHubStocks, rawTpStocks} = this.props;
        const {plantFilterList} = this.state;
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 4}, wrapperCol: {span: 20}
        };
        const eHubColumnConfig = [
            {label: '款号', value: 'styleCode'},
            {label: "商品代码", value: "skuId"},
            {label: "eHUB可用库存", value: "eHubAvailableQty"},
            {label: "TP可用数量", value: "tpAvailableQty"},
            {label: "误差数量", value: "differenceQty"}
        ];
        const columnConfig = [
            {label: '款号', value: 'styleCode'},
            {label: "商品代码", value: "skuId"},
            {label: "可用库存", value: "availableQty"}
        ];
        const tpColumnConfig = [
            {label: 'TP截止日期', value: 'closingDt'},
            {label: '款号', value: 'styleCode'},
            {label: "ehub商品代码", value: "compareId"},
            {label: "Tp商品代码", value: "skuId"},
            {label: "可用库存", value: "availableQty"}
        ];
        const excelFileName = "compareEHubAndTp";
        const dataList = [
            _.intersectionBy(rawEHubStocks, rawTpStocks, 'compareId').map(stock => {
                const compareTpAvailableQty = _.find(rawTpStocks, (tpStock) => {
                    return stock.compareId === tpStock.compareId;
                }).availableQty;
                return {
                    ...stock,
                    eHubAvailableQty: stock.availableQty,
                    tpAvailableQty: compareTpAvailableQty,
                    differenceQty: stock.availableQty - compareTpAvailableQty
                };
            }),
            _.differenceBy(rawEHubStocks, rawTpStocks, "compareId"),
            _.differenceBy(rawTpStocks, rawEHubStocks, "compareId"),
            rawTpStocks
        ];
        return (
            <Form style={{margin: 20}} onSubmit={this.props.onSubmit}>
                <legend>查询条件</legend>
                <Row gutter={8}>
                    <EHubBrandCodeSelector refForm={this.props.form}
                                           span={6}
                                           onChange={this.brandChange}/>
                    <Col span={6}>
                        <FormItem
                            {...formItemLayout}
                            label="公司"
                            hasFeedback
                        >
                            {getFieldDecorator('plant', {
                                rules: [{required: true, message: '请选择公司!'}],
                                validateTrigger: ['onChange']
                            })(
                                <Select placeholder="公司"
                                        showSearch
                                        filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                        optionFilterProp="children"
                                >
                                    {plantFilterList.filter(plant => plant.plantType === 'TPW').map((plant, index) => {
                                        return <Option key={index} value={plant.plantCode}>{plant.plantName + '(' + plant.plantCode + ')'}</Option>
                                    })}
                                </Select>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                            {...formItemLayout}
                            label="款号"
                            hasFeedback
                        >
                            {getFieldDecorator('productId', {
                                rules: [{required: false}, {
                                    validator: this.validateInput,
                                }],
                                initialValue: ''
                            })(
                                <Input placeholder="款号"/>
                            )}
                        </FormItem>
                    </Col>
                    <Col span={1}>
                        <Button icon="search" type="primary" className="pull-right" htmlType="submit">
                            查询
                        </Button>
                    </Col>
                    <Col span={2}>
                        <DownloadExcelTemplate
                            columnConfigList={[eHubColumnConfig, columnConfig, tpColumnConfig, tpColumnConfig]}
                            sheetDataList={dataList}
                            sheetNameList={["eHUB和TP库存对比(商品代码相同)", "只存在于eHUB的商品代码", "只存在于TP的商品代码", "TP原库存"]}
                            styles={{marginLeft: 26}}
                            fileName={excelFileName}
                            beforeDownload={() => {
                                if (rawEHubStocks.length === 0 && rawTpStocks.length === 0) {
                                    notification['warning']({
                                        message: '请先查询数据。',
                                        duration: null
                                    });
                                    throw new eHubException("CompareStockDownloadExcel - 请先查询后下载。");
                                }
                            }}/>
                    </Col>
                </Row>
            </Form>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        rawEHubStocks: state.compareStock.rawEHubStocks,
        rawTpStocks: state.compareStock.rawTpStocks,
    });
};
export default connect(mapStateToProps, {})(Form.create()(SearchCondition));