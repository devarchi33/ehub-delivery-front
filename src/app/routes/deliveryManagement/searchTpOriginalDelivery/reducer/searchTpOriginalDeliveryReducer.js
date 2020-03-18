import React from 'react';
import console from '../../../../util/logger';
import {getOriginalTpPlantDelivery, getStatisticsTpPlantDelivery} from '../service';

import globalStore from 'store/configureStore';
import {formatDate} from '../../../../util/timeUtil';
import { PlatformEntity } from '../../../../entities';

const initialState = {
    statisticsLoading: false,
    emailModalVisible: false,
    statisticsTpPlantDeliveryList: [],
    statisticsCompareTpPlantDeliveryList: [],
    statisticsSelectedRows: [],
    statisticsCompareResult: [],
    originalTpPlantDeliveryList: [],
    attachFileList: []
};

const SET_STATISTICS_LOADING = "SET_STATISTICS_LOADING";
const SET_EMAIL_MODAL_VISIBLE = "SET_EMAIL_MODAL_VISIBLE";
const SET_STATISTICS_COMPARE_LIST = "SET_STATISTICS_COMPARE_LIST";
const SET_STATISTICS_SELECTED_LIST = "SET_STATISTICS_SELECTED_LIST";
const SET_ATTACH_FILE_LIST = "SET_ATTACH_FILE_LIST";

const RESET_TP_ORIGINAL_DELIVERIES = "RESET_TP_ORIGINAL_DELIVERIES";
const resetTpOriginalDeliveriesAction = () => ({type: RESET_TP_ORIGINAL_DELIVERIES});
export const resetTpOriginalDeliveries = () => {
    return (dispatch) => {
        return dispatch(resetTpOriginalDeliveriesAction());
    };
};

const SEARCH_STATISTICS_TP_PLANT_DELIVERY = "SEARCH_STATISTICS_TP_PLANT_DELIVERY";
const searchStatisticsTpPlantDeliveryAction = (result) => ({
    type: SEARCH_STATISTICS_TP_PLANT_DELIVERY,
    payload: result
});
export const searchStatisticsTpPlantDelivery = (startClosingDate, endClosingDate) => {
    return (dispatch) => {
        globalStore.dispatch({type: "SET_STATISTICS_LOADING", payload: true});
        getStatisticsTpPlantDelivery(startClosingDate, endClosingDate).then(tpPlantDelivery => {
            globalStore.dispatch({type: "SET_STATISTICS_LOADING", payload: false});
            console.log("STATISTICS_TP_PLANT_DELIVERY_SERVER_RESPONSE====>", tpPlantDelivery);

            const tpPlantDeliveryGroupByBrandCd = _.groupBy(tpPlantDelivery.items, "brandCode");

            const result = Object.keys(tpPlantDeliveryGroupByBrandCd).map(brandCd => {
                const tpPlantDeliveryList = tpPlantDeliveryGroupByBrandCd[brandCd];
                return {
                    key: brandCd,
                    brandCode: brandCd,
                    tmallOrTotalSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OR' && tpPlantDelivery.platformCode === PlatformEntity .TM && tpPlantDelivery.statusCode != '99' ? tpPlantDelivery.sumQty : 0;
                    }),
                    tmallOrSuccessSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OR' && tpPlantDelivery.platformCode === PlatformEntity .TM && tpPlantDelivery.statusCode === '20' ? tpPlantDelivery.sumQty : 0;
                    }),
                    tmallOsTotalSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OS' && tpPlantDelivery.platformCode === PlatformEntity.TM && tpPlantDelivery.statusCode != '99' ? tpPlantDelivery.sumQty : 0;
                    }),
                    tmallOsSuccessSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OS' && tpPlantDelivery.platformCode === PlatformEntity.TM && tpPlantDelivery.statusCode === '20' ? tpPlantDelivery.sumQty : 0;
                    }),
                    externalOsTotalSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'EV' && tpPlantDelivery.statusCode != '99' ? tpPlantDelivery.sumQty : 0;
                    }),
                    externalOsSuccessSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'EV' && tpPlantDelivery.statusCode === '20' ? tpPlantDelivery.sumQty : 0;
                    }),
                    jdOrTotalSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OR' && tpPlantDelivery.platformCode === PlatformEntity.JD  && tpPlantDelivery.statusCode != '99' ? tpPlantDelivery.sumQty : 0;
                    }),
                    jdOrSuccessSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OR' && tpPlantDelivery.platformCode === PlatformEntity.JD && tpPlantDelivery.statusCode === '20' ? tpPlantDelivery.sumQty : 0;
                    }),
                    jdOsTotalSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OS' && tpPlantDelivery.platformCode === PlatformEntity.JD && tpPlantDelivery.statusCode != '99' ? tpPlantDelivery.sumQty : 0;
                    }),
                    jdOsSuccessSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OS' && tpPlantDelivery.platformCode === PlatformEntity.JD && tpPlantDelivery.statusCode === '20' ? tpPlantDelivery.sumQty : 0;
                    }),
                    vipOrTotalSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OR' && tpPlantDelivery.platformCode === PlatformEntity.VIP && tpPlantDelivery.statusCode != '99' ? tpPlantDelivery.sumQty : 0;
                    }),
                    vipOrSuccessSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OR' && tpPlantDelivery.platformCode === PlatformEntity.VIP && tpPlantDelivery.statusCode === '20' ? tpPlantDelivery.sumQty : 0;
                    }),
                    vipOsTotalSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OS' && tpPlantDelivery.platformCode === PlatformEntity.VIP && tpPlantDelivery.statusCode != '99' ? tpPlantDelivery.sumQty : 0;
                    }),
                    vipOsSuccessSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OS' && tpPlantDelivery.platformCode === PlatformEntity.VIP && tpPlantDelivery.statusCode === '20' ? tpPlantDelivery.sumQty : 0;
                    }),
                    youzanOrTotalSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OR' && tpPlantDelivery.platformCode === PlatformEntity.YZ  && tpPlantDelivery.statusCode != '99' ? tpPlantDelivery.sumQty : 0;
                    }),
                    youzanOrSuccessSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OR' && tpPlantDelivery.platformCode === PlatformEntity.YZ && tpPlantDelivery.statusCode === '20' ? tpPlantDelivery.sumQty : 0;
                    }),
                    youzanOsTotalSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OS' && tpPlantDelivery.platformCode === PlatformEntity.YZ && tpPlantDelivery.statusCode != '99' ? tpPlantDelivery.sumQty : 0;
                    }),
                    youzanOsSuccessSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OS' && tpPlantDelivery.platformCode === PlatformEntity.YZ && tpPlantDelivery.statusCode === '20' ? tpPlantDelivery.sumQty : 0;
                    }),
                    aikucunOrTotalSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OR' && tpPlantDelivery.platformCode === PlatformEntity.AKC && tpPlantDelivery.statusCode != '99' ? tpPlantDelivery.sumQty : 0;
                    }),
                    aikucunOrSuccessSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OR' && tpPlantDelivery.platformCode === PlatformEntity.AKC && tpPlantDelivery.statusCode === '20' ? tpPlantDelivery.sumQty : 0;
                    }),
                    aikucunOsTotalSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OS' && tpPlantDelivery.platformCode === PlatformEntity.AKC && tpPlantDelivery.statusCode != '99' ? tpPlantDelivery.sumQty : 0;
                    }),
                    aikucunOsSuccessSumQty: _.sumBy(tpPlantDeliveryList, (tpPlantDelivery) => {
                        return tpPlantDelivery.deliveryType === 'OS' && tpPlantDelivery.platformCode === PlatformEntity.AKC && tpPlantDelivery.statusCode === '20' ? tpPlantDelivery.sumQty : 0;
                    }),
                }
            });

            return dispatch(searchStatisticsTpPlantDeliveryAction(result));
        });
    };
};

const SEARCH_ORIGINAL_TP_PLANT_DELIVERY = "SEARCH_ORIGINAL_TP_PLANT_DELIVERY";
const searchOriginalTpPlantDeliveryAction = (result) => ({
    type: SEARCH_ORIGINAL_TP_PLANT_DELIVERY,
    payload: result
});
export const searchOriginalTpPlantDelivery = (searchCondition, page) => {
    return (dispatch) => {
        globalStore.dispatch({type: "SET_LOADING", payload: true});
        getOriginalTpPlantDelivery(searchCondition, page).then(tpPlantDelivery => {
            globalStore.dispatch({type: "SET_LOADING", payload: false});
            return dispatch(searchOriginalTpPlantDeliveryAction(tpPlantDelivery));
        });
    };
};


export default (state = initialState, action) => {
    const translateStatusCode = (tpPlantDelivery) => {
        let statusCode;
        switch (tpPlantDelivery.statusCode) {
            case '10':
                return statusCode = '未处理';
            case '20':
                return statusCode = '已处理';
            case '30':
                return statusCode = '错误商品代码';
            case '31':
                return statusCode = '错误商品代码（被影响）';
            case '32':
                return statusCode = '库存不足';
            case '33':
                return statusCode = '库存不足（被影响）';
            case '40':
                return statusCode = '已修改';
            case '50':
                return statusCode = '异常';
            case '90':
                return statusCode = '赠品';
            case '99':
                return statusCode = '删除';
            default:
                return statusCode = tpPlantDelivery.statusCode;
        }
    };
    switch (action.type) {
        case SET_STATISTICS_LOADING:
            console.log(">>>>>>>>>> debug searchTpOriginalDeliveryReducer setStatisticsLoading", action.payload);
            return {
                ...state,
                statisticsLoading: action.payload
            };
        case SET_EMAIL_MODAL_VISIBLE:
            console.log(">>>>>>>>>> debug searchTpOriginalDeliveryReducer setEmailModalVisible", action.payload);
            return {
                ...state,
                emailModalVisible: action.payload
            };
        case SET_STATISTICS_COMPARE_LIST:
            console.log(">>>>>>>>>> debug searchTpOriginalDeliveryReducer setStatisticsCompareList", action.payload);
            return {
                ...state,
                statisticsCompareTpPlantDeliveryList: action.payload
            };
        case SET_STATISTICS_SELECTED_LIST:
            console.log(">>>>>>>>>> debug searchTpOriginalDeliveryReducer setStatisticsSelectedList", action.payload);
            return {
                ...state,
                statisticsSelectedRows: action.payload
            };
        case SET_ATTACH_FILE_LIST:
            console.log(">>>>>>>>>> debug searchTpOriginalDeliveryReducer setAttachFileList", action.payload);
            return {
                ...state,
                attachFileList: action.payload
            };
        case RESET_TP_ORIGINAL_DELIVERIES:
            console.log(">>>>>>>>>> debug searchTpOriginalDeliveryReducer resetTpOriginalDeliveries");
            return initialState;
        case SEARCH_STATISTICS_TP_PLANT_DELIVERY:
            console.log(">>>>>>>>>> debug searchTpOriginalDeliveryReducer searchStatisticsTpPlantDelivery", action.payload);
            return {
                ...state,
                statisticsTpPlantDeliveryList: action.payload
            };
        case SEARCH_ORIGINAL_TP_PLANT_DELIVERY:
            console.log(">>>>>>>>>> debug searchTpOriginalDeliveryReducer searchOriginalTpPlantDelivery", action.payload);
            return {
                ...state,
                originalTpPlantDeliveryList: action.payload.items.map((tpPlantDelivery, index) => {
                    let statusCode = translateStatusCode(tpPlantDelivery);
                    const date = new Date(tpPlantDelivery.confirmTime);
                    return {
                        ...tpPlantDelivery,
                        ...tpPlantDelivery.committed,
                        key: index,
                        statusCode,
                        confirmTime: formatDate(date, 'YYYY-MM-DD')
                    };
                })
            };
        default:
            return state;
    }
}