const initialState = {
    loading: false,
    visible: false
};

const SET_LOADING = "SET_LOADING";
const setLoadingAction = (loadingFlag) => ({type: SET_LOADING, payload: loadingFlag});
export const setLoading = (loadingFlag) => {
    return (dispatch) => {
        return dispatch(setLoadingAction(loadingFlag));
    };
};

const SET_MODAL_VISIBLE = "SET_MODAL_VISIBLE";
const setModalVisibleAction = (visible) => ({type: SET_MODAL_VISIBLE, payload: visible});
export const setModalVisible = (visible) => {
    return (dispatch) => {
        return dispatch(setModalVisibleAction(visible));
    };
};

const RESET_UI_STATE = "RESET_UI_STATE";
const resetUiStateAction = () => ({type: RESET_UI_STATE});
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
        case SET_MODAL_VISIBLE:
            return {
                ...state,
                visible: action.payload
            };
        case RESET_UI_STATE:
            return initialState;
        default:
            return state;
    }
};
