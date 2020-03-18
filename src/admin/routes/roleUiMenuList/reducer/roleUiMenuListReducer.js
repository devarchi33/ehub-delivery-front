import {deleteRoleUiMenu, getRoleUiMenuList, insertRoleUiMenu, updateRoleUiMenu} from '../service';
import console from '../../../../app/util/logger';

import globalStore from '../../../store/configureStore';
import UserInfoEntity from '../../../../app/entities/UserInfoEntity';
import {config} from '../../../../app/config/config';

const initialState = {
    totalCount: 0,
    roleUiMenuList: [],
    roles: [],
    pageConfig: config.pageConfig({totalCount: 0})
};

const LOAD_ROLE_UI_MENU_LIST = "LOAD_ROLE_UI_MENU_LIST";
const loadRoleUiMenuListAction = (menuObject) => ({type: LOAD_ROLE_UI_MENU_LIST, payload: menuObject});
export const loadRoleUiMenuList = () => {
    return (dispatch) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        getRoleUiMenuList().then(roleUiMenus => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            return dispatch(loadRoleUiMenuListAction(roleUiMenus));
        });
    };
};

export const saveRoleUiMenu = (form, key) => {
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    const roleUiMenuList = globalStore.getState().roleUiMenuListReducer.roleUiMenuList;
    const selectedMenu = roleUiMenuList.find(item => item.name === key);
    updateRoleUiMenu({
        ...form.getFieldsValue(),
        createdBy: UserInfoEntity.getUserName(),
        name: selectedMenu.name,
        parentNode: selectedMenu.parentNode,
        level: selectedMenu.level,
        type: selectedMenu.type
    });
};

export const createRoleUiMenu = (param) => {
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    insertRoleUiMenu(param);
};

export const removeRoleUiMenu = (key) => {
    globalStore.dispatch({type: "SET_LOADING", payload: true});
    deleteRoleUiMenu(key);
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOAD_ROLE_UI_MENU_LIST:
            console.log(">>>>>>>>>> debug roleUiMenuListReducer loadRoleUiMenuList", action.payload);
            const roleUiMenuList = action.payload.items.filter(menu => menu.page).map((menu, index) => {
                return {...menu, key: menu.name, index};
            });
            return {
                ...state,
                roleUiMenuList: roleUiMenuList,
                roles: _.uniq(_.flattenDeep(roleUiMenuList.map(menu => menu.roles))),
                pageConfig: config.pageConfig({pageSize: action.payload.totalCount})
            };
        default:
            return state;
    }
};
