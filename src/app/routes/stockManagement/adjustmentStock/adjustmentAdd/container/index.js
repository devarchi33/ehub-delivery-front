/**
 * Created by jiang.xiaoyu 2017-12-05
 */
import React from 'react';
import {Button, Layout, message, notification, Row, Spin} from 'antd';
import {addItem} from 'util/listHelper';
import {AdjustmentStockHeader, AdjustmentTable} from '../../components';
import {AddProductForm} from '../components';
import {addAdjustment} from '../service'
import {getStockInfo} from '../../service'
import {UserInfoEntity} from 'entities';

const {Content} = Layout;

export default class SearchStock extends React.Component {
    constructor(pros) {
        super(pros);
        this.state = {
            stockList: [],
            selectedRowKeys: [],
            selectedRows: [],
            loading: false,
            confirmLoading: false,
        }
    };

    uuid = () => Math.floor(Math.random() * 1000000);

    onSave = () => {
        const adjustmentList = this.state.stockList;
        if(!adjustmentList.length > 0) {
            message.warning('没有可调整的库存数据!');
            return;
        }
        for(let i=0; i<adjustmentList.length; i++) {
            if( adjustmentList[i].adjustmentCount === '' || adjustmentList[i].description.trim() === '') {
                message.error('存在必填项未填写，请检查!');
                return;
            }
        }
        this.setState({ loading: true});
        const params = adjustmentList.map(item => {
            return {
                plantId: item.plant,
                skuId: item.productCode,
                adjustmentQty: Number.parseInt(item.adjustmentCount),
                createdBy: UserInfoEntity.getUserName(),
                plantBrandCode:  item.brandCode,
                reason: item.description,
                skuBrandCode: item.brandCode,
            }
        });
        addAdjustment( params, this ).then(isError => {
            if(!isError) {
                this.setState({ loading: false }, () => {
                    notification['success']({
                        message: '调整成功',
                        duration: null
                    });
                    this.setStockList([]);
                });
            }
        })
    };

    handleOk = (e) => {
        this.setState({ confirmLoading: true}, () => {
            this.addProductForm.props.form.validateFields((err, values) => {
                if(!err){
                    const currentProductList = this.state.stockList;
                    const {form} = this.addProductForm.props; // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
                    const params = form.getFieldsValue(['brandCode', 'plantId', 'skuId']);
                    const addedItem = {
                        key: this.uuid(), brandCode: params['brandCode'], plant: params['plantId'], productCode: params['skuId'],
                        count: 0, adjustmentCount: '', description: ''
                    };
                    let exist = false;
                    currentProductList.forEach(element => {
                        if(element.productCode === addedItem.productCode && element.plant === addedItem.plant) exist = true
                    });
                    if(!exist){
                        getStockInfo( addedItem.brandCode, addedItem.plant, addedItem.productCode ).then(res => {
                            if(res.code === "100") {
                                message.warning('没有该商品: '+res.message.invalidSku+' ,请检查商品号!');
                                this.setState({confirmLoading: false});
                                return;
                            } else {
                                addedItem.count = res.availableStockQty;
                            }
                            const addedList = addItem(currentProductList, addedItem); // Add to ui
                            this.setState({ stockList: addedList, confirmLoading: false}, () => {
                                form.resetFields(["skuId"])
                            });
                        });
                    } else {
                        notification['warning']({
                            message: '已存在',
                            description: addedItem.productCode + ' 已存在!',
                            duration: null
                        });
                        this.setState({ confirmLoading: false});
                    }
                } else {
                    this.setState({ confirmLoading: false});
                }
            });
        });
        // createAdjustmentStockInfo(addedItem); // Add to server
    };


    saveFormRef = (AddProductForm) => this.addProductForm = AddProductForm;

    setStockList = (stockList) => this.setState({ stockList });

    setSelectedRow = (selectedObject) => {
        this.setState({
            selectedRows: selectedObject.selectedRows,
            selectedRowKeys: selectedObject.selectedRowKeys
        });
    };

    render() {
        const styles = {
            borderLine: { margin: "10px" },
            btnMargin: { marginLeft: "5px" },
            btnFloat: { float: "right" },
        };
        const { stockList, loading, confirmLoading } = this.state;
        return (
            //库存调整目录
            <Content>
                <Row>
                    <AdjustmentStockHeader headerMessage="库存调整添加"/>
                </Row>
                <Row>
                    <Spin tip="加载中" spinning={loading}>
                        <AddProductForm wrappedComponentRef={this.saveFormRef}
                                        onCreate={this.handleOk}
                                        confirmLoading={confirmLoading}
                        />
                        <div style={{...styles.borderLine}} className="table-operations">
                            &nbsp;
                            <Button type="primary" style={{...styles.btnFloat}} onClick={this.onSave}>保存</Button>
                        </div>
                        <AdjustmentTable setSelectedRow={this.setSelectedRow}
                                         setStockList={this.setStockList}
                                         stockList={stockList} />
                    </Spin>
                </Row>
            </Content>
        )
    }
}