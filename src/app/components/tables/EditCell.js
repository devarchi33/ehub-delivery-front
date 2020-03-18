import React from 'react';
import PropTypes from 'prop-types';
import { Input, Icon } from 'antd';
import './EditCell.css';

export default class EditCell extends React.Component {
    state = {
        value: this.props.value,
        editable: false
    };

    handleChange = (e) => {
        const value = e.target.value;
        this.setState({ value });
    };

    check = () => {
        const { value } = this.state;
        this.setState({ editable: false });
        if(this.props.onChange) {
            this.props.onChange(value);
        }
    };

    edit = () => {
        this.setState({ editable: true });
    };

    render() {
        const { value, editable } = this.state;
        return (
            <div className="editable-cell">
                {
                    editable ?
                        <div className="editable-cell-input-wrapper">
                            <Input value={value}
                                   onChange={this.handleChange}
                                   onPressEnter={this.check}
                            />
                            <Icon type="check"
                                  className="editable-cell-icon-check"
                                  onClick={this.check}
                            />
                        </div>
                        :
                        <div className="editable-cell-text-wrapper">
                            <span>{value || ' '}</span>
                            <Icon type="edit"
                                  className="editable-cell-icon"
                                  onClick={this.edit}
                            />
                        </div>
                }
            </div>
        )
    };
}

EditCell.propTypes = {
    onChange: PropTypes.func
};
