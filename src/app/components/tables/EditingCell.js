import React from 'react';
import PropTypes from 'prop-types';
import { Input, InputNumber, Icon } from 'antd';
import './EditCell.css';
import Switch from 'antd/lib/switch';

export default class EditingCell extends React.Component {
    state = {
        value: this.props.value,
    };

    handleChange = (e) => {
        let value
        switch(this.props.type){
            case 'Input': 
                value = e.target.value; break ;
            case 'InputNumber': 
                value = e; break ;
            default: 
                value = e.target.value; break ;
        }
    //    const value = e.target.value;
        this.setState({ value });
        if(this.props.onChange) {
            this.props.onChange(value);
        }
    };

    render() {
        const { value } = this.state;
        const { type } = this.props;
        return (
            <div className="editable-cell">
            {(() => {
                switch (type) {
                    case 'Input':
                    return <Input style={{ margin: '-5px 0' }} value={value} onChange={this.handleChange} />
                    case 'InputNumber':
                    return <InputNumber style={{ margin: '-5px 0', borderColor: (value === '' ||value === undefined ) ? '#f04134' : '#d9d9d9' }} defaultValue={value} onChange={this.handleChange} />
                    default:
                    return <Input style={{ margin: '-5px 0', borderColor: (value === '' ||value === undefined ) ? '#f04134' : '#d9d9d9' }} value={value} onChange={this.handleChange} />
                }
            })()}
            </div>
        )
    };
}

EditingCell.propTypes = {
    onChange: PropTypes.func
};
