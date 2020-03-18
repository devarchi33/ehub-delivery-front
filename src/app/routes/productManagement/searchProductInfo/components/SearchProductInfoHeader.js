import React from 'react';
import PageHeader from 'ant-design-pro/lib/PageHeader';

import 'ant-design-pro/dist/ant-design-pro.css';

export default class SearchProductInfoHeader extends React.Component {
    render() {
        return (
            <PageHeader
                title={<p><i className="fa fa-product-hunt"/>&nbsp;&nbsp;&nbsp;商品信息</p>}
            />
        );
    }
}