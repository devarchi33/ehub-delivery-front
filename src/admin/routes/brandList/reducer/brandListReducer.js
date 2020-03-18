import {getBrandList, insertBrand, updateBrand} from '../service';
import console from '../../../../app/util/logger';

import globalStore from '../../../store/configureStore';
import {config} from '../../../../app/config/config';

import {UserInfoEntity} from 'entities';

const initialState = {
    brandList: [],
    pageConfig: config.pageConfig({totalCount: 0})
};

const LOAD_BRAND_LIST = "LOAD_BRAND_LIST";
const loadBrandListAction = (brandList) => ({type: LOAD_BRAND_LIST, payload: brandList});
export const loadBrandList = () => {
    return (dispatch) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        getBrandList().then(brandList => {
            return dispatch(loadBrandListAction(brandList));
        });
    };
};

export const createBrand = (param) => {
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    insertBrand(param);
};

export const saveBrand = (form, key) => {
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    const brandList = globalStore.getState().brandListReducer.brandList;
    const selectedBrand = brandList.find(item => item.key === key);
    updateBrand({
        ...form.getFieldsValue(),
        createdBy: UserInfoEntity.getUserName(),
        brandCode: selectedBrand.brandCode
    });
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_BRAND_LIST:
            console.log(">>>>>>>>>> debug brandListReducer loadBrandList", action.payload._embedded.brandList);
            return {
                ...state,
                brandList: action.payload._embedded.brandList.map((log, index) => {
                    return {...log, modifiedBy: log.committed.modifiedBy, modified: log.committed.modified, key : index};
                }),
                pageConfig: config.pageConfig({pageSize: action.payload._embedded.brandList.length})
            };
        default:
            return state;
    }
};
