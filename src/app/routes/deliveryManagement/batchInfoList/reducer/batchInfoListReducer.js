import {getBatchInfoList, updateBatchInfo} from '../service';
import console from '../../../../util/logger';

import globalStore from '../../../../../admin/store/configureStore';
import {config} from '../../../../config/config';

import {UserInfoEntity} from 'entities';

const initialState = {
    batchInfoList: [],
    pageConfig: config.pageConfig({totalCount: 0}),
    batchJobModalVisible: false,
    selectedBatchInfo: null
};
const SET_EXECUTE_BATCH_JOB_MODAL_VISIBLE = "SET_EXECUTE_BATCH_JOB_MODAL_VISIBLE";

const LOAD_BATCH_INFO_LIST = "LOAD_BATCH_INFO_LIST";
const loadBatchInfoListAction = (batchInfoList) => ({type: LOAD_BATCH_INFO_LIST, payload: batchInfoList});
export const loadBatchInfoList = () => {
    return (dispatch) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        getBatchInfoList().then(batchInfoList => {
            return dispatch(loadBatchInfoListAction(batchInfoList));
        });
    };
};

export const saveBatchInfo = (form, key) => {
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    const batchInfoList = globalStore.getState().batchInfoListReducer.batchInfoList;
    updateBatchInfo({...form.getFieldsValue(), modifiedBy: UserInfoEntity.getUserName(), jobName: batchInfoList[key].jobName, batchName: batchInfoList[key].batchName});
};

const getChineseDesription = (originDesription) => {
    const index = originDesription.split(",") ? originDesription.split(",")[0] : "0";
    switch (index) {
        case "1":
            return "退货入库数据 [优先执行]";
        case "2":
            return "外部平台出库数据 [其次执行]";
        case "3":
            return "顾客出库数据 [最后执行]";
        default:
            return "";
    }
}

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_EXECUTE_BATCH_JOB_MODAL_VISIBLE:
            console.log(">>>>>>>>>> debug batchInfoListReducer setExecuteBatchJobModal", action.payload);
            return {
                ...state,
                batchJobModalVisible: action.payload.visible,
                selectedBatchInfo: action.payload.record
            };
        case LOAD_BATCH_INFO_LIST:
            console.log(">>>>>>>>>> debug batchInfoListReducer loadBatchInfoList", action.payload._embedded.batchInfoList);
            return {
                ...state,
                batchInfoList: _.sortBy(action.payload._embedded.batchInfoList.filter(item => item.batchName === "ehub-internal-batch"), "description").map((log, index) => {
                    return {...log, modifiedBy: log.committed.modifiedBy, modified: log.committed.modified, key : index, description: getChineseDesription(log.description)};
                }),
                pageConfig: config.pageConfig({pageSize: action.payload._embedded.batchInfoList.length})
            };
        default:
            return state;
    }
};
