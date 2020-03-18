import {config} from '../../../../app/config/config';
import {initializeEHubMaster} from '../../../../app/routes/service';

const BASE_URL = config.serverInfo;

export const getDelvieryInfoByDeliveryNo = (deliveryNo = "") => {
    let url =`${BASE_URL}/deliverySearch/${deliveryNo}`

    console.log("..........url", url);
    return fetch(url).then(res => res.json()); //[API ID : D005]
};

export const updateDeliveryByDeliveryNo = (deliveryNo = "") => {
    let eHubMaster = initializeEHubMaster();
    const userName = eHubMaster.layoutInfo.UserInfo.colleague.originalColleagueKey;
    let url =`${BASE_URL}/deliveryUpdate?deliveryNo=${deliveryNo}&userName=${userName}`;

    console.log("..........url", url);
    return fetch(url); //[API ID : D008]
};

export const getDelvieryInfoByDeliveryNoAndBoxNo = (deliveryNo = "", boxNo = "") => {
    let url =`${BASE_URL}/deliverySearch/deliveryNo/${deliveryNo}/boxNo/${boxNo}`

    console.log("..........url", url);
    return fetch(url).then(res => res.json()); //[API ID : D009]
};

export const updateDeliveryByDeliveryNoAndBoxNo = (deliveryNo = "", boxNo = "") => {
    let eHubMaster = initializeEHubMaster();
    const userName = eHubMaster.layoutInfo.UserInfo.colleague.originalColleagueKey;
    let url =`${BASE_URL}/deliveryUpdateByDeliveryNoAndBoxNo?deliveryNo=${deliveryNo}&boxNo=${boxNo}&userName=${userName}`;

    console.log("..........url", url);
    return fetch(url); //[API ID : D010]
};
