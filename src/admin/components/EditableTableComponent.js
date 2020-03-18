import {Form, Input, InputNumber, Popconfirm, Select} from 'antd';
import React from 'react';
import globalStore from '../../admin/store/configureStore';

const FormItem = Form.Item;
const Option = Select.Option;
const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {
    handleChange(value) {
        console.log(`selected ${value}`);
    }

    getInput = () => {
        const {inputType} = this.props;
        if (inputType === 'number') {
            return <InputNumber />;
        }
        if (inputType === 'textarea') {
            const TextArea = Input.TextArea;
            return <TextArea />;
        }
        if(inputType === 'usedSelect') {
            return <select>
                <option>true</option>
                <option>false</option>
            </select>
        }
        if(inputType === 'roles') {
            return <Select
                mode="tags"
                style={{width: '100%'}}
                onChange={this.handleChange}
                tokenSeparators={[',']}
            >
                {this.props.roles.map((role, index) => <Option key={index} value={role}>{role}</Option>)}
            </Select>
        }
        return <Input />;
    };

    render() {
        const {
            editing,
            dataIndex,
            title,
            inputType,
            record,
            index,
            ...restProps
        } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const {getFieldDecorator} = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                                <FormItem style={{ margin: 0 }}>
                                    {getFieldDecorator(dataIndex, {
                                        rules: [{
                                            required: true,
                                            message: `Please Input ${title}!`,
                                        }],
                                        initialValue: record[dataIndex],
                                    })(this.getInput())}
                                </FormItem>
                            ) : restProps.children}
                        </td>
                    );
                }}
            </EditableContext.Consumer>
        );
    }
}

const ColumnOperationObject = (ref) => {
    const isEditing = (record) => {
        const editingKey = globalStore.getState().commonReducer.editingKey;
        return record.key === editingKey;
    };

    const edit = (key) => globalStore.dispatch({type: "SET_EDITABLE_COLUMN", payload: key});

    const cancel = () => globalStore.dispatch({type: "SET_EDITABLE_COLUMN", payload: ''});

    return {
        dataIndex: 'operation',
        render: (text, record) => {
            const editable = isEditing(record);
            return (
                <div>
                    {editable ? (
                        <span>
                  <EditableContext.Consumer>
                    {form => (
                        <a
                            href="javascript:;"
                            onClick={() => ref.save(form, record.key)}
                            style={{marginRight: 8}}
                        >
                            Save
                        </a>
                    )}
                  </EditableContext.Consumer>
                  <Popconfirm
                      title="Sure to cancel?"
                      onConfirm={() => cancel(record.key)}
                  >
                    <a>Cancel</a>
                  </Popconfirm>
                </span>
                    ) : (
                        <div>
                            <a onClick={() => edit(record.key)}>{'Edit   '}</a>
                            {ref.type === 'batchInfoList' ?
                                <a onClick={() => {
                                    globalStore.dispatch({
                                        type: "SET_EXECUTE_BATCH_JOB_MODAL_VISIBLE",
                                        payload: {visible: true, record: record}
                                    });
                                }}>{'Execute   '}</a> : ''}
                            {ref.canDelete ? <Popconfirm
                                title="Sure to remove?"
                                onConfirm={() => ref.delete(record)}
                            >
                                <a>{'  Delete'}</a>
                            </Popconfirm> : ''}
                        </div>
                    )}
                </div>
            );
        },
    }
};

const EditableTableComponent = {
    body: {
        row: EditableFormRow,
        cell: EditableCell,
    },
};

export {ColumnOperationObject, EditableTableComponent};