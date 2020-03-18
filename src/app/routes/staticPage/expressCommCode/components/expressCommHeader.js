import React from 'react';
import { Icon } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';

import 'ant-design-pro/dist/ant-design-pro.css';

export default class expressCommHeader extends React.Component {
    render() {
        return (
            <PageHeader
                title={<p><Icon type="car"/>&nbsp;&nbsp;&nbsp;快递公司代码向导</p>}
            />
        );
    }
}