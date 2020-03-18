import React from 'react';
import {connect} from 'react-redux';
import {Button, Col, Form, Icon, Modal, notification, Row, Table, Upload} from 'antd';
import {setModalVisible} from '../../../../reducer/commonReducer';
import {
    resetTpOriginalDeliveries,
    searchOriginalTpPlantDelivery
} from '../reducer/searchTpOriginalDeliveryReducer';
import {OriginalTpPlantDeliveryTable} from './OriginalTpPlantDeliveryList';
import DownloadExcelTemplate from '../../../../components/excel/DownloadExcelTemplate';
import {ExcelProcess} from '../../uploadManagement/util/excelProcess';
import globalStore from '../../../../store/configureStore';
import StatisticsEmailModal from './StatisticsEmailModal';
import PlatformEntity from '../../../../entities/PlatformCodeEntity';

class StatisticsCompareModal extends React.Component {
    handleDetailSearch = (brandCode, deliveryType, platformCode) => {
        const {searchOriginalTpPlantDelivery, closingDate} = this.props;
        searchOriginalTpPlantDelivery({
            brandCode,
            deliveryType,
            platformCode,
            startClosingDate: closingDate[0].format('YYYYMMDD'),
            endClosingDate: closingDate[1].format('YYYYMMDD')
        }, 1);
    };

    handleCancel = () => {
        const {setModalVisible, resetTpOriginalDeliveries} = this.props;
        resetTpOriginalDeliveries();
        setModalVisible(false);
    };

    render() {
        const {
            visible, loading, statisticsTpPlantDeliveryList, statisticsSelectedRows,
            statisticsCompareTpPlantDeliveryList, originalTpPlantDeliveryList, closingDate
        } = this.props;
        const DetailSearchBtn = (props) => <Button size="small"
                                                   style={{display: props.display ? "inline" : "none", marginLeft: 16}}
                                                   onClick={props.onClick}>详细</Button>;
        const columns = [
            {
                title: "品牌",
                dataIndex: "brandCode",
                key: "brandCode",
                width: 70,
                fixed: 'left'
            }, {
                title: "天猫入库 - ehub",
                dataIndex: "tmallOrTotalSumQtyEhub",
                key: "tmallOrTotalSumQtyEhub",
                width: "4%",
                render: (text, record) => {
                    const isDifferent = record.tmallOrTotalSumQtyEhub != record.tmallOrTotalSumQtyTp;
                    return <Row>
                        <Col>
                            <span style={{color: isDifferent ? "red" : "black"}}>{record.tmallOrTotalSumQtyEhub}</span>
                            <DetailSearchBtn display={isDifferent}
                                             onClick={() => this.handleDetailSearch(record.brandCode, "OR", PlatformEntity.TM)}/>
                        </Col>
                    </Row>;
                }
            }, {
                title: "天猫入库 - TP",
                dataIndex: "tmallOrTotalSumQtyTp",
                key: "tmallOrTotalSumQtyTp",
                width: "4%"
            }, {
                title: "天猫出库 - ehub",
                dataIndex: "tmallOsTotalSumQtyEhub",
                key: "tmallOsTotalSumQtyEhub",
                width: "4%",
                render: (text, record) => {
                    const isDifferent = record.tmallOsTotalSumQtyEhub != record.tmallOsTotalSumQtyTp;
                    return <Row>
                        <Col>
                            <span style={{color: isDifferent ? "red" : "black"}}>{record.tmallOsTotalSumQtyEhub}</span>
                            <DetailSearchBtn display={isDifferent}
                                             onClick={() => this.handleDetailSearch(record.brandCode, "OS", PlatformEntity.TM)}/>
                        </Col>
                    </Row>
                }
            }, {
                title: "天猫出库 - TP",
                dataIndex: "tmallOsTotalSumQtyTp",
                key: "tmallOsTotalSumQtyTp",
                width: "4%"
            }, {
                title: "唯品会入库 - ehub",
                dataIndex: "vipOrTotalSumQtyEhub",
                key: "vipOrTotalSumQtyEhub",
                width: "6%",
                render: (text, record) => {
                    const isDifferent = record.vipOrTotalSumQtyEhub != record.vipOrTotalSumQtyTp;
                    return <Row>
                        <Col>
                            <span style={{color: isDifferent ? "red" : "black"}}>{record.vipOrTotalSumQtyEhub}</span>
                            <DetailSearchBtn display={isDifferent}
                                             onClick={() => this.handleDetailSearch(record.brandCode, "OR", PlatformEntity.VIP)}/>
                        </Col>
                    </Row>
                }
            }, {
                title: "唯品会入库 - TP",
                dataIndex: "vipOrTotalSumQtyTp",
                key: "vipOrTotalSumQtyTp",
                width: "4%"
            }, {
                title: "唯品会出库 - ehub",
                dataIndex: "vipOsTotalSumQtyEhub",
                key: "vipOsTotalSumQtyEhub",
                width: "6%",
                render: (text, record) => {
                    const isDifferent = record.vipOsTotalSumQtyEhub != record.vipOsTotalSumQtyTp;
                    return <Row>
                        <Col>
                            <span style={{color: isDifferent ? "red" : "black"}}>{record.vipOsTotalSumQtyEhub}</span>
                            <DetailSearchBtn display={isDifferent}
                                             onClick={() => this.handleDetailSearch(record.brandCode, "OS", PlatformEntity.VIP)}/>
                        </Col>
                    </Row>
                }
            }, {
                title: "唯品会出库 - TP",
                dataIndex: "vipOsTotalSumQtyTp",
                key: "vipOsTotalSumQtyTp",
                width: "4%"
            }, {
                title: "京东入库 - ehub",
                dataIndex: "jdOrTotalSumQtyEhub",
                key: "jdOrTotalSumQtyEhub",
                width: "4%",
                render: (text, record) => {
                    const isDifferent = record.jdOrTotalSumQtyEhub != record.jdOrTotalSumQtyTp;
                    return <Row>
                        <Col>
                            <span style={{color: isDifferent ? "red" : "black"}}>{record.jdOrTotalSumQtyEhub}</span>
                            <DetailSearchBtn display={isDifferent}
                                             onClick={() => this.handleDetailSearch(record.brandCode, "OR", PlatformEntity.JD)}/>
                        </Col>
                    </Row>
                }
            }, {
                title: "京东入库 - TP",
                dataIndex: "jdOrTotalSumQtyTp",
                key: "jdOrTotalSumQtyTp",
                width: "4%"
            }, {
                title: "京东出库 - ehub",
                dataIndex: "jdOsTotalSumQtyEhub",
                key: "jdOsTotalSumQtyEhub",
                width: "4%",
                render: (text, record) => {
                    const isDifferent = record.jdOsTotalSumQtyEhub != record.jdOsTotalSumQtyTp;
                    return <Row>
                        <Col>
                            <span style={{color: isDifferent ? "red" : "black"}}>{record.jdOsTotalSumQtyEhub}</span>
                            <DetailSearchBtn display={isDifferent}
                                             onClick={() => this.handleDetailSearch(record.brandCode, "OS", PlatformEntity.JD)}/>
                        </Col>
                    </Row>
                }
            }, {
                title: "京东出库 - TP",
                dataIndex: "jdOsTotalSumQtyTp",
                key: "jdOsTotalSumQtyTp",
                width: "4%"
            }, {
                title: "有赞入库 - ehub",
                dataIndex: "youzanOrTotalSumQtyEhub",
                key: "youzanOrTotalSumQtyEhub",
                width: "4%",
                render: (text, record) => {
                    const isDifferent = record.youzanOrTotalSumQtyEhub != record.youzanOrTotalSumQtyTp;
                    return <Row>
                        <Col>
                            <span style={{color: isDifferent ? "red" : "black"}}>{record.youzanOrTotalSumQtyEhub}</span>
                            <DetailSearchBtn display={isDifferent}
                                             onClick={() => this.handleDetailSearch(record.brandCode, "OS", PlatformEntity.YZ)}/>
                        </Col>
                    </Row>
                }
            }, {
                title: "有赞入库 - TP",
                dataIndex: "youzanOrTotalSumQtyTp",
                key: "youzanOrTotalSumQtyTp",
                width: "4%"
            }, {
                title: "有赞出库 - ehub",
                dataIndex: "youzanOsTotalSumQtyEhub",
                key: "youzanOsTotalSumQtyEhub",
                width: "4%",
                render: (text, record) => {
                    const isDifferent = record.youzanOsTotalSumQtyEhub != record.youzanOsTotalSumQtyTp;
                    return <Row>
                        <Col>
                            <span style={{color: isDifferent ? "red" : "black"}}>{record.youzanOsTotalSumQtyEhub}</span>
                            <DetailSearchBtn display={isDifferent}
                                             onClick={() => this.handleDetailSearch(record.brandCode, "OS", PlatformEntity.YZ)}/>
                        </Col>
                    </Row>
                }
            }, {
                title: "有赞出库 - TP",
                dataIndex: "youzanOsTotalSumQtyTp",
                key: "youzanOsTotalSumQtyTp",
                width: "4%"
            }, {
                title: "爱库存入库 - ehub",
                dataIndex: "aikucunOrTotalSumQtyEhub",
                key: "aikucunOrTotalSumQtyEhub",
                width: "6%",
                render: (text, record) => {
                    const isDifferent = record.aikucunOrTotalSumQtyEhub != record.aikucunOrTotalSumQtyTp;
                    return <Row>
                        <Col>
                            <span style={{color: isDifferent ? "red" : "black"}}>{record.aikucunOrTotalSumQtyEhub}</span>
                            <DetailSearchBtn display={isDifferent}
                                             onClick={() => this.handleDetailSearch(record.brandCode, "OS", PlatformEntity.AKC)}/>
                        </Col>
                    </Row>
                }
            }, {
                title: "爱库存入库 - TP",
                dataIndex: "aikucunOrTotalSumQtyTp",
                key: "aikucunOrTotalSumQtyTp",
                width: "4%"
            }, {
                title: "爱库存出库 - ehub",
                dataIndex: "aikucunOsTotalSumQtyEhub",
                key: "aikucunOsTotalSumQtyEhub",
                width: "6%",
                render: (text, record) => {
                    const isDifferent = record.aikucunOsTotalSumQtyEhub != record.aikucunOsTotalSumQtyTp;
                    return <Row>
                        <Col>
                            <span style={{color: isDifferent ? "red" : "black"}}>{record.aikucunOsTotalSumQtyEhub}</span>
                            <DetailSearchBtn display={isDifferent}
                                             onClick={() => this.handleDetailSearch(record.brandCode, "OS", PlatformEntity.AKC)}/>
                        </Col>
                    </Row>
                }
            }, {
                title: "爱库存出库 - TP",
                dataIndex: "aikucunOsTotalSumQtyTp",
                key: "aikucunOsTotalSumQtyTp",
                width: "4%"
            }, {
                title: "外部平台出库 - ehub",
                dataIndex: "externalOsTotalSumQtyEhub",
                key: "externalOsTotalSumQtyEhub",
                width: "4%",
                render: (text, record) => {
                    const isDifferent = record.externalOsTotalSumQtyEhub != record.externalOsTotalSumQtyTp;
                    return <Row>
                        <Col>
                            <span style={{color: isDifferent ? "red" : "black"}}>{record.externalOsTotalSumQtyEhub}</span>
                            <DetailSearchBtn display={isDifferent}
                                             onClick={() => this.handleDetailSearch(record.brandCode, "EV", PlatformEntity.VIP)}/>
                        </Col>
                    </Row>;
                }
            }, {
                title: "外部平台出库 - TP",
                dataIndex: "externalOsTotalSumQtyTp",
                key: "externalOsTotalSumQtyTp"
            }
        ];
        const excelColumnsConfigForResult = columns.map(column => {
            return {label: column.title, value: column.dataIndex};
        });
        const excelColumnsConfigForTemplate = columns.filter(column => {
            return !column.title.includes("ehub");
        }).map(column => {
            return {label: column.title, value: column.dataIndex};
        });
        const excelColumnsConfigForOriginal = [
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
        const rowSelectionForCompare = {
            onSelect: (record, selected, selectedRows) => globalStore.dispatch({
                type: "SET_STATISTICS_SELECTED_LIST",
                payload: selectedRows
            }),
            onChange: (selectedRowKeys) => globalStore.dispatch({
                type: "SET_STATISTICS_SELECTED_LIST",
                payload: selectedRowKeys.map(key => statisticsCompareTpPlantDeliveryList[key])
            })
        };
        return (
            <Modal
                visible={visible}
                width={1600}
                title={<Row>
                    <Col>
                        <h3>数据对比结果 - {closingDate && closingDate.length > 0 ? closingDate[0].format('YYYYMMDD') + '~' + closingDate[1].format('YYYYMMDD') : ''}</h3>
                    </Col>
                    <Col span={1} offset={14}>
                        <Upload beforeUpload={ExcelProcess.compareTpPlantDeliveryStatistics} showUploadList={false}>
                            <Button type="primary" loading={loading}>
                                <Icon type="upload"/> TP文件上传
                            </Button>
                        </Upload>
                    </Col>
                    <Col span={1} offset={1}>
                        <Button type="primary" style={{marginLeft: 10}}
                                onClick={() => {
                                    const searchChecker = statisticsCompareTpPlantDeliveryList.length === 0;
                                    const checkboxChecker = statisticsSelectedRows.length === 0;
                                    const notiMessage = searchChecker ? '先对比一下。' : checkboxChecker ? '先勾选一下。' : '';
                                    if (statisticsSelectedRows.length === 0) {
                                        notification['warning']({
                                            message: notiMessage,
                                            duration: 2
                                        });
                                        return null;
                                    }
                                    globalStore.dispatch({type: "SET_EMAIL_MODAL_VISIBLE", payload: true});
                                }}>
                            <Icon type="export"/> 发邮件
                        </Button>
                    </Col>
                    <Col span={1} offset={1}>
                        <DownloadExcelTemplate columnConfigList={[excelColumnsConfigForResult]}
                                               btnName={"对比结果下载"}
                                               sheetDataList={[statisticsCompareTpPlantDeliveryList]}
                                               fileName={"CompareTpPlantDeliveryResult"}/>
                    </Col>
                    <Col span={1} offset={1}>
                        <DownloadExcelTemplate columnConfigList={[excelColumnsConfigForOriginal]}
                                               sheetDataList={[originalTpPlantDeliveryList]}
                                               fileName={"OriginalTpPlantDelivery"}
                                               btnName={"详细结果下载"}/>
                    </Col>
                    <Col span={1} offset={1}>
                        <DownloadExcelTemplate columnConfigList={[excelColumnsConfigForTemplate]}
                                               btnName={"对比模版下载"}
                                               sheetDataList={[statisticsTpPlantDeliveryList.map(statistics => {
                                                   return {brandCode: statistics.brandCode};
                                               })]}
                                               isTemplate={true}
                                               fileName={"CompareTpPlantDeliveryTemplate"}/>
                    </Col>
                </Row>}
                onCancel={this.handleCancel}
                footer={[
                    <Button key="back" onClick={this.handleCancel}>返回</Button>
                ]}
            >
                <Row>
                    <Col>
                        <Table 
                            columns={columns} 
                            dataSource={statisticsCompareTpPlantDeliveryList}
                            rowSelection={rowSelectionForCompare}
                            scroll={{ x: 4000 }}    
                        />
                    </Col>
                </Row>
                <Row>
                    <Col>
                        <OriginalTpPlantDeliveryTable
                            style={{display: originalTpPlantDeliveryList.length > 0 ? "block" : 'none'}}
                            loading={loading}
                            originalTpPlantDeliveryList={originalTpPlantDeliveryList}/>
                    </Col>
                </Row>
                <Row>
                    <StatisticsEmailModal/>
                </Row>
            </Modal>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        visible: state.commonReducer.visible,
        statisticsTpPlantDeliveryList: state.searchTpOriginalDeliveryReducer.statisticsTpPlantDeliveryList,
        statisticsCompareTpPlantDeliveryList: state.searchTpOriginalDeliveryReducer.statisticsCompareTpPlantDeliveryList,
        statisticsSelectedRows: state.searchTpOriginalDeliveryReducer.statisticsSelectedRows,
        originalTpPlantDeliveryList: state.searchTpOriginalDeliveryReducer.originalTpPlantDeliveryList
    });
};
export default connect(mapStateToProps, {
    setModalVisible, searchOriginalTpPlantDelivery, resetTpOriginalDeliveries
})(Form.create()(StatisticsCompareModal));