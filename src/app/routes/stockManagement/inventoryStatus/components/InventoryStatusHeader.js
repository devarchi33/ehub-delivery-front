import React from 'react';
import PageHeader from 'ant-design-pro/lib/PageHeader';
import { Icon } from 'antd';

import 'ant-design-pro/dist/ant-design-pro.css';

export default class AdjustmentStockHeader extends React.Component {
    render() {
        return (
            <PageHeader
                title={<p><i className="fa fa-ellipsis-h"/><Icon type='area-chart'/>&nbsp;&nbsp;&nbsp;电商入出库现状</p>}
            />
        );
    }
}