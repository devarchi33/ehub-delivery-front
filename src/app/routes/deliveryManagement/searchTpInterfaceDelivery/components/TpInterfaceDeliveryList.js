import React from 'react';
import {connect} from 'react-redux';
import {Table, Row, notification, Input, Button, Icon, message} from 'antd';

import {config} from 'config/config';
import SearchCondition from './SearchCondition';
import {searchTpInterfaceDelivery, searchAtFrontSide} from '../reducer/searchTpInterfaceDeliveryReducer';

import './TpInterfaceDeliveryList.css';
import 'ant-design-pro/dist/ant-design-pro.css';
import { PlatformEntity } from '../../../../entities';

const check31Days = (rangePickerDates) => {
    return Math.abs(moment.duration(rangePickerDates[0].diff(rangePickerDates[1])).asDays()) < 31;
};

class TpInterfaceDeliveryList extends React.Component {
    constructor(pros) {
        super(pros);
        const layoutInfo = JSON.parse(sessionStorage.getItem(config.layoutInfo));
        this.state = {
            brandList: layoutInfo.UserInfo.colleague.brands,
            selectedBrand:'',
            loading: false,
            selectedRowKeys: [],
            searchText: moment().year(),
            filtered: false,
            filterDropdownVisible: false
        }
    }

    handleSubmit = (e) => {
        e.preventDefault();
        const {searchTpInterfaceDelivery} = this.props;
        const {form} = this.formRef.props; // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
        const params = form.getFieldsValue(['brandCode', 'styleCode','sapDeliveryType', 'date']);
        const startDate = params["date"][0].format('YYYYMMDD000000');
        const endDate = params["date"][1].format('YYYYMMDD235959');
        if(!check31Days(params['date'])) {
            notification['warning']({
                message: '超过查询时间',
                description: '查询期间无法超过31天，请修改后重试',
                duration: null
            });
            return;
        }
        searchTpInterfaceDelivery(params['brandCode'], params['styleCode'], params['sapDeliveryType'], startDate, endDate);
    };

    saveFormRefs = (SearchConditionComponent) => this.formRef = SearchConditionComponent;

    actualProcessTimeChange = (e) => {
        if(!Number.parseInt(e.target.value)){
            message.info("只能输入TP处理日期");
            return;
        }
        if(e.target.value.length > 8) {
            message.info("无法超过8位");
            return;
        }
        this.setState({searchText: e.target.value});
    };

    actualProcessTimeSearch = () => {
        const {tpInterfaceDeliveries, searchAtFrontSide} = this.props;
        const {searchText} = this.state;
        this.setState({
            filterDropdownVisible: false,
            filtered: !!searchText,
        });
        searchAtFrontSide(tpInterfaceDeliveries, searchText, 'actualProcessTime');
    };

    render() {
        const {tpInterfaceDeliveries, loading} = this.props;
        const {searchText, filtered, filterDropdownVisible} = this.state;
        const styles = {
            borderLine: {margin: "10px"},
            btnMargin: {marginLeft: "5px"}
        };
        const columns = [
            {
                title: "品牌",
                dataIndex: "brandCode",
                key: "brandCode",
                width: "8%"
            }, {
                title: "出库地",
                dataIndex: "shipmentPlantId",
                key: "shipmentPlantId",
                width: "8%"
            }, {
                title: "入库地",
                dataIndex: "receiptPlantId",
                key: "receiptPlantId",
                width: "8%"
            }, {
                title: "类型",
                dataIndex: "sapDeliveryType",
                key: "sapDeliveryType",
                width: "8%",
                render: (text) => {return PlatformEntity.findTpDeliveryTypeByCode(text)}
            }, {
                title: "商品代码",
                dataIndex: "skuId",
                key: "skuId",
                width: "16%"
            }, {
                title: "总确定数量",
                dataIndex: "normalQty",
                key: "normalQty",
                width: "8%"
            }, {
                title: "SAP传送日期",
                dataIndex: "sapInterfaceDt",
                key: "sapInterfaceDt",
                width: "8%"
            }, {
                title: "TP处理日期",
                dataIndex: "actualProcessTime",
                key: "actualProcessTime",
                width: "8%",
                filterDropdown: (
                    <div className="custom-filter-dropdown">
                        <Input
                            ref={ele => this.searchInput = ele}
                            placeholder="TP处理日期"
                            value={searchText}
                            onChange={this.actualProcessTimeChange}
                            onPressEnter={this.onSearch}
                        />
                        <Button type="primary" onClick={this.actualProcessTimeSearch}>Search</Button>
                    </div>
                ),
                filterIcon: <Icon type="search" style={{color: filtered ? '#108ee9' : '#aaa'}} />,
                filterDropdownVisible: filterDropdownVisible,
                onFilterDropdownVisibleChange: (visible) => {
                    this.setState({
                        filterDropdownVisible: visible,
                    }, () => this.searchInput && this.searchInput.focus());
                }
            }
        ];
        const pageConfig = config.pageConfig({tpInterfaceDeliveries});
        return (
            <div style={styles.borderLine}>
                <Row  style={{...styles.borderLine}}>
                    <SearchCondition onSubmit={this.handleSubmit} wrappedComponentRef={this.saveFormRefs}/>
                </Row>
                <Row>
                    <Table columns={columns}
                           dataSource={tpInterfaceDeliveries}
                           loading={{tip: "查询中...", spinning: loading}}
                           pagination={pageConfig}
                           {...config.tableStyle("")}
                    />
                </Row>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        tpInterfaceDeliveries: state.searchTpInterfaceDelivery.tpInterfaceDeliveries
    });
};
export default connect(mapStateToProps, {
    searchTpInterfaceDelivery, searchAtFrontSide
})(TpInterfaceDeliveryList);