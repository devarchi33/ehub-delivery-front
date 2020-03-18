import React from 'react';
import { Table, Layout, Row } from 'antd';
import {config} from 'config/config';
const { Content } = Layout;
import { CodeWizardHeader } from "../components/index";
import '../codeWizard.css';
import globalStore from "../../../../store/configureStore";
import {RequestEntity} from "../../../../entities";
import {connect} from "react-redux";

const BASE_URL = config.serverInfo;

class plantCodeWizard extends React.Component {
    constructor(pros) {
        super(pros);
        this.state = {
            brandList: [],
            plantList: []
        }
    };

    componentDidMount(){
        this.getBrandCdList();
        this.getPlantIdList();
    }

    getBrandCdList(){
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        //[API ID - G002]
        return new RequestEntity("GET", `${BASE_URL}/code_guide/brandCode`, "getBrandCode").then(resEntity => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            if(resEntity.status === 200) {
                resEntity.json().then(res => {
                    this.setState({
                        brandList: res
                    });
                })
            } else {
                notification['warning']({
                    message: 'BrandCode查询失败',
                    duration: null
                });
                return null;
            }
        });
    }

    getPlantIdList(){
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        //[API ID - G001]
        return new RequestEntity("GET", `${BASE_URL}/code_guide/plantId`, "getPlantId").then(resEntity => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            if(resEntity.status === 200) {
                resEntity.json().then(res => {
                    this.setState({
                        plantList: res
                    });
                })
            } else {
                notification['warning']({
                    message: 'Plant查询失败',
                    duration: null
                });
                return null;
            }
        });
    }

    render() {
        const{brandList, plantList}=this.state;
        const {loading} = this.props;
        let plantsArr = [];
        for (let j in plantList){
            plantsArr.push(plantList[j].split(","));
        }
        //处理数据格式
        let dataSource = [];
        for(let pl in plantsArr){
            let plantsObj = {};
            for(let i in plantsArr[pl]){
                plantsObj[i] = plantsArr[pl][i];
            }
            dataSource.push(plantsObj);
        }
        //动态显示table的列
        let columns = [{
                    title: "电商中心/品牌",
                    dataIndex: 0,
                    key: "plantId",
                    className:"table-align-center"
                },];
        for(let i=0; i<brandList.length; i++){
            columns.push({
                title: brandList[i].brandCode,
                dataIndex: i+1,
                key: i+1,
                className:"table-align-center"
            },);
        }
        return (
            <Content>
                <Row>
                    <CodeWizardHeader />
                </Row>
                <Row>
                        <Table columns={columns}
                               dataSource={dataSource}
                               loading={loading}
                               rowKey={record=> record[0]}
                               pagination={false}
                               style={{ "marginTop":"30px" }}
                               bordered
                        />
                </Row>
            </Content>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading
    })
};
export default connect(mapStateToProps, {
})(plantCodeWizard);