const initialState = {
    loading: false,
    editingKey: '',
    visible: false
};

const SET_LOADING = "SET_LOADING";
const loadSetLoadingAction = (loadingFlag) => ({type: SET_LOADING, payload: loadingFlag});
export const setLoading = (loadingFlag) => {
    return (dispatch) => {
        return dispatch(loadSetLoadingAction(loadingFlag));
    };
};

const SET_EDITABLE_COLUMN = "SET_EDITABLE_COLUMN";
const setEditableColumnAction = (key) => ({type: SET_EDITABLE_COLUMN, payload: key});
export const setEditableColumn = (key) => {
    return (dispatch) => {
        return dispatch(setEditableColumnAction(key));
    };
};

const SET_MODAL_VISIBLE = "SET_MODAL_VISIBLE";
const setModalVisibleAction = (visible) => ({type: SET_MODAL_VISIBLE, payload: visible});
export const setModalVisible = (visible) => {
    return (dispatch) => {
        return dispatch(setModalVisibleAction(visible));
    };
};

const REST_UI_STATE = "REST_UI_STATE";
const resetUiStateAction = () => ({type: REST_UI_STATE});
export const resetUiState = (visible) => {
    return (dispatch) => {
        return dispatch(resetUiStateAction(visible));
    };
};

export default (state = initialState, action) => {
    switch (action.type) {
        case SET_LOADING:
            return {
                ...state,
                loading: action.payload
            };
        case SET_EDITABLE_COLUMN:
            return {
                ...state,
                editingKey: action.payload
            };
        case SET_MODAL_VISIBLE:
            return {
                ...state,
                visible: action.payload
            };
        case REST_UI_STATE:
            return initialState;
        default:
            return state;
    }
};
