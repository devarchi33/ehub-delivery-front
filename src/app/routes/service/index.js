import {config} from '../../config/config';

export const initializeEHubMaster = () => {
    const layoutInfo = JSON.parse(sessionStorage.getItem(config.layoutInfo));
    const roleCodes = _.map(layoutInfo.UserInfo.colleague.roles,'roleCode');

    let brands = layoutInfo.UserInfo.colleague.brands;
    let allBrandSelect = [{brandCode: "All", brandName: "(全部)"}];
    brands.forEach(item => {
        allBrandSelect.push(item)
    });
    return {
        allBrandSelect: allBrandSelect,
        layoutInfo: layoutInfo,
        brandList: layoutInfo.UserInfo.colleague.brands,
        plantList: layoutInfo.UserBrandUserPlants.filter(item => !((roleCodes.indexOf('tpwsel') !== -1) && (item.plantType === 'TPW')) ),
        allPlantList: layoutInfo.UserBrandAllPlants
    }
};