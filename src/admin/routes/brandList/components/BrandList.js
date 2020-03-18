import React, {Component} from 'react';
import {Card, Button, Table, Icon, Tooltip} from 'antd';
import {connect} from 'react-redux';
import {loadBrandList, saveBrand} from '../reducer/brandListReducer';
import {setModalVisible} from '../../../reducer/commonReducer';

import {ColumnOperationObject, EditableTableComponent} from '../../../components/EditableTableComponent';
import AddBrandModal from './AddBrandModal';

class BrandList extends Component {
    constructor(props) {
        super(props);
        this.canDelete = false;
        this.columns = [
            {
                title: 'Id',
                dataIndex: 'key',
                key: 'key',
                width: '4%',
                render: (text) => <span>{text + 1}</span>
            }, {
                title: 'BrandCode',
                dataIndex: 'brandCode',
                key: 'brandCode',
            }, {
                title: 'BrandName',
                dataIndex: 'brandName',
                key: 'brandName',
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
                render: (text) => <span>{text ? text.split("T")[0] + " " + text.split("T")[1].split(".")[0] : ''}</span>
            },
            ColumnOperationObject(this)
        ];
    }

    componentDidMount() {
        const {loadBrandList} = this.props;
        loadBrandList();
    }

    isEditing = (record) => record.key === this.props.editingKey;

    handleAddBrand = () => this.props.setModalVisible(true);

    save = (form, key) => {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            saveBrand(form, key);
        });
    };

    render() {
        const {loading, brandList, pageConfig, visible} = this.props;
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

        const AddButton = (
            <Button onClick={this.handleAddBrand} type="primary" style={{marginBottom: 16}}>
                Add a brand
            </Button>
        );

        return (
            <div>
                <AddBrandModal visible={visible}/>
                <Card bordered={false} title={
                    <div>
                        <h3>BrandList
                            <Tooltip title="Add new brand process">
                                <Icon type="info-circle" style={{marginLeft: 5, fontSize: 14}} onClick={() => {
                                    window.open("http://wiki.elandsystems.com.cn:8091/pages/viewpage.action?pageId=12551453","_blank");
                                }}/>
                            </Tooltip>
                        </h3>
                    </div>
                } style={{marginTop: 16}} extra={AddButton}>
                    <Table
                        size={'small'}
                        loading={loading}
                        components={EditableTableComponent}
                        bordered
                        pagination={pageConfig}
                        dataSource={brandList}
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
        brandList: state.brandListReducer.brandList,
        pageConfig: state.brandListReducer.pageConfig
    });
};
export default connect(mapStateToProps, {
    loadBrandList, setModalVisible
})(BrandList);
