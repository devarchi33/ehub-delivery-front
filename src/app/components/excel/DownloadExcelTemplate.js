// Version 2.0
import React from 'react';
import {Button, Form, notification} from 'antd';
import ExportJsonExcel from 'js-export-excel'
import {connect} from "react-redux";
import {eHubException} from "../../exception";
import {getTime_YYYYMMDD_HHmmss} from "../../util/timeUtil";

class DownloadExcelTemplate extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick = () => {
        const {fileName, sheetNameList, sheetDataList, columnConfigList, isTemplate, beforeDownload} = this.props;
        beforeDownload ?
            beforeDownload() :
            () => {
                if (!isTemplate && sheetDataList[0].length === 0) {
                    notification['warning']({
                        message: '请先查询数据。',
                        duration: null
                    });
                    throw new eHubException("先查询后下载一下。");
                }
            }

        let option = {};
        if (isTemplate) {
            option.fileName = fileName
        } else if (!isTemplate && fileName) {
            option.fileName = fileName + getTime_YYYYMMDD_HHmmss()
        } else {
            option.fileName = getTime_YYYYMMDD_HHmmss()
        }
        option.datas = [];
        for (let i = 0; i < columnConfigList.length; i++) {
            option.datas = option.datas.concat({
                sheetData: !sheetDataList ? [] : sheetDataList[i].map(function (item, index) {
                    return window._.pick(item, window._.map(columnConfigList[i], 'value'));
                }),
                sheetName: sheetNameList ? sheetNameList[i] : "sheet" + (i + 1),
                sheetHeader: window._.map(columnConfigList[i], 'label')
            })
        }

        const toExcel = new ExportJsonExcel(option); //new
        toExcel.saveExcel(); //保存
    }

    render() {
        const styles = {marginLeft: "5px"};
        return (
            <Button type='dashed' onClick={this.handleClick} disabled={this.props.disabled}
                    style={this.props.styles ? this.props.styles : styles}>
                {this.props.btnName ? this.props.btnName : '下载'}
            </Button>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return ({})
};
export default connect(mapStateToProps, {})(Form.create()(DownloadExcelTemplate));

