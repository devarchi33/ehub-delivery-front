import React from 'react';
import {Layout} from 'antd';
import BatchInfoList from '../components/BatchInfoList';

const {Content} = Layout;
export default class BatchInfos extends React.Component {
    constructor(pros) {
        super(pros);
    };

    render() {
        return (
            <Content>
                <BatchInfoList />
            </Content>
        )
    }
}