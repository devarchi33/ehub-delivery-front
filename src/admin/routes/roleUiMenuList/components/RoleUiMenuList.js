import React from 'react';
import {Table, Button, Card, Icon} from 'antd';
import connect from 'react-redux/es/connect/connect';
import {setModalVisible} from '../../../reducer/commonReducer';
import {loadRoleUiMenuList, saveRoleUiMenu, removeRoleUiMenu} from '../reducer/roleUiMenuListReducer';

import {ColumnOperationObject, EditableTableComponent} from '../../../components/EditableTableComponent';
import AddRoleUiMenuModal from './AddRoleUiMenuModal';

class RoleUiMenuList extends React.Component {
    constructor(props) {
        super(props);
        this.canDelete = true;
        this.columns = [
            {
                title: 'Id',
                dataIndex: 'index',
                key: 'index',
                width: '4%',
                render: (text) => <span>{text + 1}</span>
            }, {
                title: 'Name',
                dataIndex: 'name',
                key: 'name',
                width: '10%',
            }, {
                title: 'Parent Node',
                dataIndex: 'parentNode',
                key: 'parentNode',
                width: '8%',
            }, {
                title: 'Type',
                dataIndex: 'type',
                key: 'type',
                width: '7%',
            }, {
                title: 'Page',
                dataIndex: 'page',
                key: 'page',
                width: '16%',
                editable: true
            }, {
                title: 'Icon',
                dataIndex: 'icon',
                key: 'icon',
                width: '8%',
                editable: true
            }, {
                title: 'Roles',
                dataIndex: 'roles',
                key: 'roles',
                editable: true,
                render: (roleList) => <span>{_.orderBy(roleList).reduce((init, role) => {return init + ", " + role})}</span>
            }, {
                title: 'ModifiedBy',
                dataIndex: 'modifiedBy',
                key: 'modifiedBy',
                width: '8%',
            }, {
                title: 'Modified',
                dataIndex: 'modified',
                key: 'modified',
                width: '8%',
            },
            ColumnOperationObject(this)
        ];
    }

    componentDidMount() {
        const {loadRoleUiMenuList} = this.props;
        loadRoleUiMenuList();
    }

    isEditing = (record) => record.key === this.props.editingKey;

    handleAddRoleUiMenu = () => this.props.setModalVisible(true);

    save = (form, key) => {
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            saveRoleUiMenu(form, key);
        });
    };

    delete = (record) => removeRoleUiMenu(record);

    render() {
        const {roleUiMenuList, roles, loading, visible, pageConfig} = this.props;
        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'roles' ? 'roles' : 'text',
                    dataIndex: col.dataIndex,
                    roles: roles,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        const searchButton = (
            <Button onClick={this.handleAddRoleUiMenu} type="primary" style={{marginBottom: 16}}>
                Add a menu
            </Button>
        );

        return (
            <div>
                <AddRoleUiMenuModal visible={visible}/>
                <Card bordered={false} title={
                    <div>
                        <h3>RoleUiMenuList <Icon type="info-circle" style={{fontSize: 14}}/></h3>
                    </div>
                } style={{marginTop: 16}} extra={searchButton}>
                    <Table
                        size={'small'}
                        loading={loading}
                        components={EditableTableComponent}
                        pagination={pageConfig}
                        bordered
                        dataSource={roleUiMenuList}
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
        visible: state.commonReducer.visible,
        editingKey: state.commonReducer.editingKey,
        roleUiMenuList: state.roleUiMenuListReducer.roleUiMenuList,
        roles: state.roleUiMenuListReducer.roles,
        pageConfig: state.roleUiMenuListReducer.pageConfig
    });
};
export default connect(mapStateToProps, {
    loadRoleUiMenuList, setModalVisible
})(RoleUiMenuList);