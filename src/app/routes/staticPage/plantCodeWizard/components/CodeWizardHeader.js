import React from 'react';
import { Icon } from 'antd';
import PageHeader from 'ant-design-pro/lib/PageHeader';

import 'ant-design-pro/dist/ant-design-pro.css';

export default class CodeWizardHeader extends React.Component {
    render() {
        return (
            <PageHeader
                title={<p><Icon type="code-o"/>&nbsp;&nbsp;&nbsp;Plant 代码向导</p>}
            />
        );
    }
}