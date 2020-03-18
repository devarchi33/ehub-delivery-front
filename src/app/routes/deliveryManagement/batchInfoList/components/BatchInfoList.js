import React, {Component} from 'react';
import {Card, Icon, Table} from 'antd';
import {connect} from 'react-redux';

import {loadBatchInfoList} from '../reducer/batchInfoListReducer';
import {setModalVisible} from '../../../../../admin/reducer/commonReducer';
import {formatDate} from '../../../../util/timeUtil';

import ExecuteBatchJobModal from './ExecuteBatchJobModal';

class BatchInfoList extends Component {
    constructor(props) {
        super(props);
        this.type = 'batchInfoList';
        this.canDelete = false;
        this.state={
            visible: false,
            record: []
        }
        this.columns = [
            {
                title: 'Id',
                dataIndex: 'key',
                key: 'key',
                width: '4%',
                render: (text) => <span>{text + 1}</span>
            }, {
                title: 'BatchName',
                dataIndex: 'batchName',
                key: 'batchName',
                width: '10%'
            }, {
                title: 'JobName',
                dataIndex: 'jobName',
                key: 'jobName',
                width: '10%'
            }, {
                title: 'LastActionTime',
                dataIndex: 'lastActionTime',
                key: 'lastActionTime',
                width: '12%',
                render: (lastActionTime) =>
                    <span>{lastActionTime ? formatDate(lastActionTime, 'YYYY-MM-DD HH:mm:ss') : ''}</span>
            }, {
                title: 'Description',
                dataIndex: 'description',
                key: 'description',
                width: '18%',
                editable: true
            }, {
                title: 'Address',
                dataIndex: 'address',
                key: 'address',
                editable: true
            }, {
                title: 'Used',
                dataIndex: 'used',
                key: 'used',
                width: '6%',
                render: (text) => <span>{text ? 'OK' : 'NO'}</span>,
                editable: true
            }, {
                title: 'ModifiedBy',
                dataIndex: 'modifiedBy',
                key: 'modifiedBy',
                width: '8%'
            }, {
                title: 'Modified',
                dataIndex: 'modified',
                key: 'modified',
                width: '12%',
                render: (modified) => <span>{modified ? formatDate(modified, 'YYYY-MM-DD HH:mm:ss') : ''}</span>
            }, {
                title: 'Execute',
                dataIndex: 'execute',
                key: 'execute',
                width: '12%',
                render: (record, text) => {
                    return <a onClick={() => {
                        this.setState({
                            visible: true,
                            record: text
                        })
                    }}>{'Execute   '}</a>
                }
            }
        ];
    }

    componentDidMount() {
        const {loadBatchInfoList} = this.props;
        loadBatchInfoList();
    }

    setVisible = (visible) => {
        this.setState({
            visible: visible
        });
    }

    render() {
        const {loading, batchInfoList, pageConfig} = this.props;
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                }),
            };
        });

        return (
            <div>
                <ExecuteBatchJobModal 
                    visible={this.state.visible} 
                    setVisible={this.setVisible}
                    selectedBatchInfo={this.state.record}/>
                <Card bordered={false} title={
                    <div>
                        <h3>BatchInfoList <Icon type="info-circle" style={{fontSize: 14}}/></h3>
                    </div>
                } style={{marginTop: 16}}>
                    <Table
                        size={'small'}
                        loading={loading}
                        bordered
                        pagination={pageConfig}
                        dataSource={batchInfoList}
                        columns={columns}
                    />
                </Card>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        batchInfoList: state.batchInfoListReducer.batchInfoList,
        pageConfig: state.batchInfoListReducer.pageConfig
    });
};
export default connect(mapStateToProps, {
    loadBatchInfoList, setModalVisible
})(BatchInfoList);
