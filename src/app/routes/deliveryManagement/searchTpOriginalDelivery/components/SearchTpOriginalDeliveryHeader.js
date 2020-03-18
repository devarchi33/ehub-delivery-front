import React from 'react';
import {Icon} from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';

import 'ant-design-pro/dist/ant-design-pro.css';

export default class TpOriginal extends React.Component {
    render() {
        return (
            <PageHeader
                title={<p><Icon type="search"/>&nbsp;&nbsp;&nbsp;TP原本数据查询</p>}
            />
        );
    }
}