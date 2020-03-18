import React, {Component} from 'react';
import {Button, Card, Icon, Table} from 'antd';
import {connect} from 'react-redux';

import {loadBatchInfoList, removeBatchInfo, saveBatchInfo} from '../reducer/batchInfoListReducer';
import {setModalVisible} from '../../../reducer/commonReducer';
import {formatDate} from '../../../../app/util/timeUtil';
import {ColumnOperationObject, EditableTableComponent} from '../../../components/EditableTableComponent';

import AddBatchInfoModal from './AddBatchInfoModal';
import ExecuteBatchJobModal from './ExecuteBatchJobModal';

class BatchInfoList extends Component {
    constructor(props) {
        super(props);
        this.type = 'batchInfoList';
        this.canDelete = false;
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
            },
            ColumnOperationObject(this)
        ];
    }

    componentDidMount() {
        const {loadBatchInfoList} = this.props;
        loadBatchInfoList();
    }

    isEditing = (record) => record.key === this.props.editingKey;

    handleAddBatchInfo = () => this.props.setModalVisible(true);

    save = (form, key) => {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            saveBatchInfo(form, key);
        });
    };

    delete = (record) => removeBatchInfo(record);

    render() {
        const {loading, batchInfoList, pageConfig, visible} = this.props;
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'description' ? 'textarea' : col.dataIndex === 'used' ? 'usedSelect' :'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        const searchButton = (
            <Button onClick={this.handleAddBatchInfo} type="primary" style={{marginBottom: 16}}>
                Add a job
            </Button>
        );

        return (
            <div>
                <AddBatchInfoModal visible={visible}/>
                <ExecuteBatchJobModal/>
                <Card bordered={false} title={
                    <div>
                        <h3>BatchInfoList <Icon type="info-circle" style={{fontSize: 14}}/></h3>
                    </div>
                } style={{marginTop: 16}} extra={searchButton}>
                    <Table
                        size={'small'}
                        loading={loading}
                        components={EditableTableComponent}
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
        editingKey: state.commonReducer.editingKey,
        visible: state.commonReducer.visible,
        batchInfoList: state.batchInfoListReducer.batchInfoList,
        pageConfig: state.batchInfoListReducer.pageConfig
    });
};
export default connect(mapStateToProps, {
    loadBatchInfoList, setModalVisible
})(BatchInfoList);
