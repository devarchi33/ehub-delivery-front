import {deleteBatchIfo, getBatchInfoList, insertBatchIfo, updateBatchInfo} from '../service';
import console from '../../../../app/util/logger';

import globalStore from '../../../store/configureStore';
import {config} from '../../../../app/config/config';

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

export const createBatchInfo = (param) => {
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    insertBatchIfo(param);
};

export const removeBatchInfo = (key) => {
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    deleteBatchIfo(key);
};

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
                batchInfoList: action.payload._embedded.batchInfoList.map((log, index) => {
                    return {...log, modifiedBy: log.committed.modifiedBy, modified: log.committed.modified, key : index};
                }),
                pageConfig: config.pageConfig({pageSize: action.payload._embedded.batchInfoList.length})
            };
        default:
            return state;
    }
};
