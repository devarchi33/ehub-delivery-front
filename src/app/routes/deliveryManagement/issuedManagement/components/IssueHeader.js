import React from 'react';
import { Icon } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';

import 'ant-design-pro/dist/ant-design-pro.css';

export default class IssueHeader extends React.Component {
    render() {
        return (
            <PageHeader
                title={<p><Icon type="laptop" />&nbsp;&nbsp;&nbsp;出库管理</p>}
            />
        );
    }
}