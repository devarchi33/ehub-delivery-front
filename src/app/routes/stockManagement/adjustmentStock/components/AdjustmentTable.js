import React from 'react';
import { Table } from 'antd';
import EditCell from 'components/tables/EditCell';
import EditingCell from 'components/tables/EditingCell';
import console from 'util/logger';
import { updateAdjustmentStockInfo } from '../service'
import { Button } from 'antd/lib/radio';
import { removeMultiItems } from 'util/listHelper';



export default class AdjustmentTable extends React.Component {
    onCellChange = (key, dataIndex) => {
        return (value) => {
            const stockList = [...this.props.stockList];
            const target = stockList.find(item => item.key === key);
            if (target) {
                target[dataIndex] = value;
                this.props.setStockList(stockList); // update to ui
                console.log(stockList);

                // updateAdjustmentStockInfo(target); // update to server
            }
        };
    };
    
    onDelete = (key) => {
        const stockList = [...this.props.stockList];
        const removeList = [stockList.find(item => item.key === key)];
        let  removedList = removeMultiItems(stockList, removeList);
        this.props.setStockList(removedList); // update to ui
        console.log(removedList);
    }

    render() {
        const columns= [
            {
                title: "品牌",
                dataIndex: "brandCode",
                key: "brandCode",
                width: "10%",
                className:"table-align-center"
            }, {
                title: "Plant",
                dataIndex: "plant",
                key: "plant",
                width: "12%",
                className:"table-align-center"
            }, {
                title: "商品代码",
                dataIndex: "productCode",
                key: "productCode",
                width: "20%",
                className:"table-align-center"
            }, {
                title: "库存数量",
                dataIndex: "count",
                key: "count",
                width: "10%",
                className:"table-align-center"
            }, {
                title: "调整后库存数量",
                dataIndex: "adjustmentCount",
                key: "adjustmentCount",
                width: "10%",
                className:"table-align-center",
                render: (text, record) => {
                    return <EditingCell value={text} type="InputNumber"
                                     onChange={this.onCellChange(record.key, 'adjustmentCount')} />
                }
            }, {
                title: "事由",
                dataIndex: "description",
                key: "description",
                width: "15%",
                className:"table-align-center",
                render: (text, record) => {
                    return <EditingCell value={text} 
                                     onChange={this.onCellChange(record.key, 'description')} />
                }
            }, {
                title: "删除",
                dataIndex: "delete",
                key: "delete",
                className:"table-align-center",
                render: (text, record) => {
                    return <Button onClick={() => this.onDelete(record.key)}>Delete</Button>
                }
            }
        ];

        return (
            <Table columns={columns}
                   dataSource={this.props.stockList} />
        )
    };
}