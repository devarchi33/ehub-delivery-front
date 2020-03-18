import React from 'react';
import {connect} from 'react-redux';
import { Row, Col, Table, Layout, Form, Input, message, Popconfirm, notification, Spin } from 'antd';
import SearchCondition from "../../tpEhubProductMapping/components/SearchCondition";
import globalStore from '../../../../store/configureStore';
import SearchTpEhubProductMappingHeader from '../components/SearchTpEhubProductMappingHeader';
import {getMappingInfo, modifyTpProductCodeToEhubProductCode, deleteMappingInfo} from '../service/index';
import {searchTpPlantDelivery} from '../reducer/searchTpPlantDeliveryReducer';
import TpProductEntity from '../../searchTPOutOfStockHeader/entity/TpProductEntity';
import {setModalVisible} from '../../../../reducer/commonReducer';
import ProductModifyModal from '../components/ProductModifyModal';
import {registerTpProductCodeToGift} from '../../service';
import DownloadExcelTemplate from "../../../../components/excel/DownloadExcelTemplate";
import {initializeEHubMaster} from '../../../../routes/service';

const {Content} = Layout;
const EditableContext = React.createContext();
const EditableRow = ({ form, index, ...props }) => (
    <EditableContext.Provider value={form}>
        <tr {...props} />
    </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);
const FormItem = Form.Item;

class EditableCell extends React.Component {
    getInput = () => {
      if (this.props.inputType === 'number') {
        return <InputNumber />;
      }
      return <Input />;
    };
  
    validateInput = (rule, value, callback) => {
        if(!value) {
            callback();
        }else if (value.replace(/^[A-Za-z0-9]+$/g,'') !== '') {
            callback('输入非法字符,请重新输入!');
        } else {
            callback();
        }
    }

    render() {
        const {editing, dataIndex, title, inputType, record, index, ...restProps } = this.props;
        return (
            <EditableContext.Consumer>
                {(form) => {
                    const { getFieldDecorator } = form;
                    return (
                        <td {...restProps}>
                            {editing ? (
                            <FormItem style={{ margin: 0 }}>
                                {getFieldDecorator(dataIndex, {
                                rules: [{
                                    required: true,
                                    message: `Please Input ${title}!`,
                                }, {validator: this.validateInput}],
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

export class SearchTpEhubProductMapping extends React.Component{
    constructor(pros){
        super(pros);
        this.state = {
            productMappingInfo: [],
            brandCd: initializeEHubMaster().allBrandSelect[0].brandCode,
            editingKey: "",
            productCd: "",
            mappingTable: true,
            InvalidProductCdTable: false,
            visible: false,
            record: {}
        }
    }

    handleBrandCd =(e)=> {
        this.setState({
            brandCd: e
        })
    }

    handleProductCd =(e)=> {
        this.setState({
            productCd: e.target.value
        });
    }

    getInput = () => {
        if (this.props.inputType === 'number') {
          return <InputNumber />;
        }
        return <Input />;
    };

    isEditing = (record) => {
        return record.tpProductCode === this.state.editingKey;
    };
    
    edit = (record) => {
        if(record.type === "GIFT"){
            message.info("GIFT商品不支持修改~");
            return;
        }
        this.setState({
            editingKey: record.tpProductCode
        });
    };

    cancel = () => {
        this.setState({ editingKey: '' });
    };

    //修改mapping表信息
    save(form, record) {
        const {productCd} = this.state;
        form.validateFields((error, row) => {
            if (error) {
                return;
            }
            globalStore.dispatch({type: "SET_LOADING", payload: true});
            form.validateFields((error, row) => {
                if (error) {
                    return;
                }
                modifyTpProductCodeToEhubProductCode(record, row.ehubProductCode).then(res => {
                    res.json()
                    .then(rowTpProductEhubProductMapping => {
                        if (res.status === 400){
                            if (rowTpProductEhubProductMapping.code === "100"){
                                this.setState({
                                    editingKey: record.tpProductCode}, () => {
                                        notification['warning']({
                                            message: '更新失败',
                                            description: "输入的商品代码错误" + rowTpProductEhubProductMapping.message.invalidProductCode,
                                            duration: null
                                        })
                                    }
                                );
                                return;
                            }
                        }
                        if (res.status === 200) {
                            this.setState({
                                editingKey: ""
                            }, () => {notification['success']({
                                message: "商品代码修改成功",
                                description: record.tpProductCode + "=>" + rowTpProductEhubProductMapping.ehubProductCode + " 修改成功",
                                duration: null
                            })
                        });
                        }
                    })
                    globalStore.dispatch({type: "SET_LOADING", payload: false});
                    this.searchMappingInfo(record.brandCode, productCd);
                });
            });
        });
    }

    //删除mapping表信息
    delete(record) {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        deleteMappingInfo(record.brandCode, record.tpProductCode, record.ehubProductCode)
        .then(r => {
            this.searchMappingInfo(record.brandCode, record.tpProductCode);
            message.success("删除成功");
        });
    }

    //查询mapping表信息
    onSubmit = (e) => {
        e.preventDefault();
        this.formRef.props.form.validateFields((err, values) => {
            if(!err) {
                globalStore.dispatch({type: "SET_LOADING", payload: true});
                const {brandCd, productCd} = this.state;
                this.setState({
                    mappingTable: true,
                    InvalidProductCdTable: false
                });
                this.searchMappingInfo(brandCd, productCd);
            }
        })
    };

    //公共使用的查询方法
    searchMappingInfo = (brandCd, productCd) => {
        if (brandCd === "All"){
            message.warning("mapping关系不支持查询所有品牌，请选择单一品牌~");
            this.setState({
                productMappingInfo: []
            });
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            return;
        }
        getMappingInfo(brandCd, productCd).then(res => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            this.setState({
                productMappingInfo: res,
                editingKey: ''
            });
        });
    }

    //InvalidProductCode页面的功能：
    searchInvalidProductCode =(e) => {
        e.preventDefault();
        this.setState({
            InvalidProductCdTable: true,
            mappingTable: false
        });
        this.handleSubmit(e);
    }

    editProductCode  = (record) => {
        this.setState({
            record: record
        });
        const {tpPlantDeliveries, setModalVisible} = this.props;
        const {form} = this.formRef.props;
        setModalVisible(true);
        TpProductEntity.setTpProduct({...tpPlantDeliveries[record.key], skuBrandCode: form.getFieldValue('brandCode')});
    };

    registerGift = (key) => {
        const {tpPlantDeliveries} = this.props;
        const {form} = this.formRef.props;
        TpProductEntity.setTpProduct({...tpPlantDeliveries[key], skuBrandCode: form.getFieldValue('brandCode')});
        registerTpProductCodeToGift(this);
    };

    saveFormRefs = (SearchConditionComponent) => this.formRef = SearchConditionComponent;

    handleSubmit = (e) => {
        e.preventDefault();
        const {searchTpPlantDelivery} = this.props;
        const {brandCd} = this.state;
        const {form} = this.formRef.props; // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
        const params = form.getFieldsValue(['brandCode','productCd']);
        searchTpPlantDelivery(brandCd, params['productCd']);
    };

    //批量上传excel
    showModal = (e) => {
        e.preventDefault();
        this.setState({
            visible: true
        });
    }

    render(){
        const components = {
            body: {
              row: EditableFormRow,
              cell: EditableCell,
            },
        };
        const {productMappingInfo, mappingTable, InvalidProductCdTable, record, visible} = this.state;
        const {loading, tpPlantDeliveries} = this.props;
        const styles = {
            borderLine: {margin: "10px"},
            btnMargin: {marginLeft: "5px"}
        };
        const excelFileName = "TpProductCode_EHubProductMapping";
        const excelColumnsConfig = [ // download format
            {label: '商品类型', value: 'type'},
            {label: "品牌", value: "brandCode"},
            {label: "Tp商品代码", value: "tpProductCode"},
            {label: "ehub商品代码", value: "ehubProductCode"}
        ];

        let filterConfig = ["MAPPING", "GIFT"];
        this.canDelete = true;
        this.type = 'tpProductMapping';
        let ref = this;
        this.columns= [{
                title: "商品类型",
                dataIndex: "type",
                key: "type",
                className:"table-align-center",
                filters: [
                    { text: filterConfig[0], value: filterConfig[0] },
                    { text: filterConfig[1], value: filterConfig[1] },
                  ],
                onFilter: (value, record) => record.type.includes(value),
                width: "15%"
            }, {
                title: "品牌",
                dataIndex: "brandCode",
                key: "brandCode",
                className:"table-align-center",
                width: "15%"
            }, {
                title: "TP商品代码",
                dataIndex: "tpProductCode",
                key: "tpProductCode",
                className:"table-align-center",
                width: "25%"
            }, {
                title: "ehub商品代码",
                dataIndex: "ehubProductCode",
                key: "ehubProductCode",
                className:"table-align-center",
                editable: true,
                width: "25%"
            }, {
                title: 'operation',
                dataIndex: 'operation',
                width: "20%",
                render: (text, record) => {
                const editable = this.isEditing(record);
                return (
                    <div>
                    {editable ? (
                        <span>
                        <EditableContext.Consumer>
                            {form => (
                                    <a
                                        href="javascript:;"
                                        onClick={() => this.save(form, record)}
                                        style={{ marginRight: 8 }}
                                    >
                                        保存
                                    </a>
                            )}
                        </EditableContext.Consumer>
                        <Popconfirm
                            title="确定取消吗?"
                            onConfirm={() => this.cancel(record.key)}
                        >
                            <a>取消</a>
                        </Popconfirm>
                        </span>
                    ) : (
                        <a onClick={() => this.edit(record)}>修改</a>
                    )}
                    <Popconfirm
                        title="确定删除吗?"
                        onConfirm={() => this.delete(record)}
                    >
                        <a>{'  删除'}</a>
                    </Popconfirm>
                    </div>
                );
                },
            },
        ];

        const columns = this.columns.map((col) => {
            if (!col.editable) {
                return col;
            }
            return {
                ...col,
                onCell: record => ({
                    record,
                    inputType: col.dataIndex === 'age' ? 'number' : 'text',
                    dataIndex: col.dataIndex,
                    title: col.title,
                    editing: this.isEditing(record),
                }),
            };
        });

        //展示InvalidProductCode的table
        const invalidPrdColumns = [
            {
                title: "品牌",
                dataIndex: "brandCode",
                key: "brandCode",
                className:"table-align-center",
                width: "20%"
            }, {
                title: "商品代码",
                dataIndex: "productId",
                key: "productId",
                className:"table-align-center",
                width: "25%"
            }, {
                title: "原因",
                dataIndex: "errorReason",
                key: "errorReason",
                className:"table-align-center",
                width: "25%",
                render: () =>  TpProductEntity.INVALID_PRODUCT
            }, {
                title: 'operation',
                dataIndex: 'operation',
                className:"table-align-center",
                width: "30%",
                render: (text, record) => {
                    return (
                        <div className="editable-row-operations">
                            {record.statusCode === "30" ? <a onClick={() => this.editProductCode(record)}>修改</a> : ''}
                            {<Popconfirm title="是否赠品登入?" onConfirm={() => this.registerGift(record.key)}>
                                <a style={{marginLeft: 8}}>赠品登入</a>
                            </Popconfirm>}
                        </div>
                    );
                },
            }
        ];
        const pageConfig = {
            defaultPageSize: 50
        };
        return (
            <Content>
                <Row>
                    <SearchTpEhubProductMappingHeader/>
                </Row>
                <Spin spinning={loading}>
                <Row style={styles.borderLine}>
                    <SearchCondition 
                        onSubmit={this.onSubmit}
                        handleBrandCd={this.handleBrandCd.bind(this)}
                        handleProductCd={this.handleProductCd.bind(this)}
                        searchInvalidProductCode={this.searchInvalidProductCode}
                        wrappedComponentRef={this.saveFormRefs}
                        showModal={this.showModal}
                    />
                </Row>
                
                {mappingTable ? 
                    <Row type="flex" justify="end" style={{...styles.borderLine}}>
                        <Col>
                            <DownloadExcelTemplate columnConfigList={[excelColumnsConfig]}
                                                sheetDataList={[productMappingInfo]}
                                                btnName={'商品mapping信息下载'}
                                                fileName={excelFileName}/>
                        </Col>
                    </Row>
                : ''}
                <Row>
                    <Table
                        size={'small'}
                        columns={mappingTable ? columns : invalidPrdColumns}
                        dataSource={mappingTable ? productMappingInfo : tpPlantDeliveries}
                        rowKey={record => mappingTable ? record.tpProductCode+'&'+record.ehubProductCode : record.key}
                        rowClassName="editable-row"
                        components={components}
                        pagination={pageConfig}
                        scroll={{ y: 340 }}
                    />
                    <ProductModifyModal
                        visible={InvalidProductCdTable}
                        row={record}
                    />
                </Row>
                </Spin>
            </Content>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading,
        tpPlantDeliveries: state.searchTpPlantDeliveryInvalidProductCd.tpPlantDeliveries
    })
};
export default connect(mapStateToProps, {
    searchTpPlantDelivery, setModalVisible
})(SearchTpEhubProductMapping);