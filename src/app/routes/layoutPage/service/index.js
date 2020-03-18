import { config } from 'config/config';
import { noticeHttpError } from 'util/httpUtil';

const DEV_URL = config.serverInfo;

export const noti = (message, description) => notification.open({
    message: message,
    description: description,
    style: {
        width: 600,
        marginLeft: 335 - 600,
    },
});

const _getBrands = () => {
    return fetch(`${DEV_URL}/brands`).then(res => {
        noticeHttpError(res);
        return res.json();
    }).catch(error => {
        noti(error.message);
        console.error(error);
    });
};
const _getPlants = () => {
    return fetch(`${DEV_URL}/plants`).then(res => {
        noticeHttpError(res);
        return res.json();
    }).catch(error => {
        noti(error.message);
        console.error(error);
    });
};
export const getLayoutInfo = () => {
    const layoutInfo = {};
    return _getBrands().then(eHubBrands => {
        layoutInfo["eHubBrands"] = eHubBrands;
    }).then(() => {
        return _getPlants().then(eHubPlants => {
            layoutInfo["eHubPlants"] = eHubPlants;
            return layoutInfo;
        });
    });
};
