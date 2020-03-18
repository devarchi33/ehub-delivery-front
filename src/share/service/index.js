import { config } from 'config/config';
import { noticeHttpError } from 'util/httpUtil';
import {initializeEHubMaster} from '../../app/routes/service';

const BASE_URL = config.serverInfo;

export const getNotice = (statusCodes) => {
    const eHubMaster = initializeEHubMaster();
    const batchExecuteBrandList = eHubMaster.brandList.map(brand => brand.brandCode);
    const plantCds = eHubMaster.plantList.map(plant => plant.plantCode);
    let uniqPlants = window._.uniq(plantCds);
    
    // N001
    let url = `${BASE_URL}/notice/searchTpPlantDeliveryNotice?statusCodes=${statusCodes}&brandCodes=${batchExecuteBrandList}&plantCodes=${uniqPlants}`;
    return fetch(url).then(res => {
        noticeHttpError(res);
        return res.json();
    });
}
