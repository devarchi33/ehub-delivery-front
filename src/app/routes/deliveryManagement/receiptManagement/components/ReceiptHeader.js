import React from 'react';
import { Icon } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';

import 'ant-design-pro/dist/ant-design-pro.css';

export default class ReceiptHeader extends React.Component {
    render() {
        return (
            <PageHeader
                title={<p><Icon type="bell"/>&nbsp;&nbsp;&nbsp;入库管理</p>}
            />
        );
    }
}