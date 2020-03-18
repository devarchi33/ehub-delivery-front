import React from 'react';
import {Layout, Row, Spin, Table} from 'antd';
import {config} from 'config/config';
import {ExpressCommHeader} from "../components/index";
import '../expressComm.css';
import {RequestEntity} from "../../../../entities";
import {notification} from "antd/lib/index";
import {connect} from "react-redux";
import globalStore from "../../../../store/configureStore";

const {Content} = Layout;

const BASE_URL = config.serverInfo;

class expressCommCode extends React.Component {
    constructor(pros) {
        super(pros);
        this.state = {deliveryCompanies: []};
    };

    componentDidMount() {
        this.getDeliveryCompanies().then(res => {
            console.log(res);
            this.setState({deliveryCompanies: res.map((company, index) => {
                    return {key: index, ...company};
                })});
        });
    }

    getDeliveryCompanies() {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        return new RequestEntity("GET", `${BASE_URL}/company/delivery`, "getTpPlantDelivery").then(resEntity => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            if(resEntity.status === 200) {
                return resEntity.json();
            } else {
                notification['warning']({
                    message: '快递公司查询失败',
                    duration: null
                });
                return null;
            }
        });
    }

    render() {
        const {loading} = this.props;
        const {deliveryCompanies} = this.state;
        const columns = [{
            title: "快递公司代码",
            dataIndex: "companyId",
            key: "companyId",
            className:"table-align-center",
            width: '200px'
        }, {
            title: "快递公司名称",
            dataIndex: "companyName",
            key: "companyName",
            className:"table-align-center",
            width: '300px'
        }];

        return (
            <Spin tip="Loading...." spinning={loading}>
                <Content>
                    <Row>
                        <ExpressCommHeader />
                    </Row>
                    <Row>
                        <Table columns={columns}
                               dataSource={deliveryCompanies}
                               pagination={false}
                               style={{ "marginTop":"30px", "width":"500px" }}
                               bordered
                               size={'middle'}
                        />
                    </Row>
                </Content>
            </Spin>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return ({
        loading: state.commonReducer.loading
    })
};
export default connect(mapStateToProps, {
})(expressCommCode);