import { config } from 'config/config';
import { RequestEntity } from "entities";

const BASE_URL = config.serverInfo;
const TOKEN_URL = config.serverToken;
const STAGING_PASSWORD_TOKEN = config.serverPassword;
const USERINFO_URL = config.serverUserInfo;

export const login = (userName, password) => {
    let url = `${TOKEN_URL}`;
    const confirmBody = {
        userName: userName,
        password: password,
    }
    return new RequestEntity("POST", url, "login", confirmBody).then(res => res.json()).then(res => {
        const layoutInfo = {};
        if(!res.success){
            if(res.error.details.indexOf("password") > -1)
                layoutInfo["errorMsg"] = "密码不正确";
            else if(res.error.details.indexOf("userName") > -1)
                layoutInfo["errorMsg"] = "用户名不存在";
            else
                layoutInfo["errorMsg"] = "登录异常";
            return layoutInfo;
        }
        //1.保存token到cooike
        window.Cookies.set(config.colleagueTokenKey, res.result.token);
        //2.调用_getUserInfo
        return _getUserInfo().then(userInfo => {
            if(!userInfo.success) {
                layoutInfo["errorMsg"] = '获取人员信息失败,请联系管理员';
                return layoutInfo;
            } else if(!userInfo.result.colleague.brands || userInfo.result.colleague.brands.length === 0) {
                layoutInfo["errorMsg"] = '人员品牌信息为空,请联系管理员';
                return layoutInfo;
            } else if(!userInfo.result.colleague.roles || userInfo.result.colleague.roles.length === 0) {
                layoutInfo["errorMsg"] = '人员角色信息为空,请联系管理员';
                return layoutInfo;
            }
            layoutInfo["UserInfo"] = userInfo.result;
            const roleCodeList = _.map(userInfo.result.colleague.roles, 'roleCode');//https://lodash.com/docs/4.17.4#map
            return _getUserPlantTypeAndPages(roleCodeList).then(plantTypeAndPage => {
                if( plantTypeAndPage.plantTypes.length === 0 || plantTypeAndPage.pages.length === 0) {
                    layoutInfo["errorMsg"] = 'plantTypes 或 pages 信息为空,请联系管理员';
                    return layoutInfo;
                }
                layoutInfo["PlantTypes"] = plantTypeAndPage.plantTypes;
                layoutInfo["Pages"] = plantTypeAndPage.pages;
                const brandCodeList = _.map(userInfo.result.colleague.brands,"brandCode");
                return _getUserAllPlants(brandCodeList).then(plants => {
                    if(plants.length === 0) {
                        layoutInfo["errorMsg"] = 'allplants 信息为空,请联系管理员'
                        return layoutInfo;
                    }
                    plants = plants.map(plant => {
                        plant.brandCode = _.trim(plant.brandCode);
                        plant.companyCode = _.trim(plant.companyCode);
                        plant.plantCode = _.trim(plant.plantCode);
                        plant.plantName = _.trim(plant.plantName);
                        plant.plantType = _.trim(plant.plantType);
                        return plant
                    });
                    layoutInfo["UserBrandAllPlants"] = plants;
                    // layoutInfo["UserBrandAllPlants"] = plants.filter(item => !(item.plantType === 'BRW' && item.returnPlant === false));
                    layoutInfo["UserBrandUserPlants"] = plants.filter(plant => plantTypeAndPage.plantTypes.indexOf(plant.plantType) > -1 );
                    return layoutInfo
                })
            })
        })
    });
};

const _getUserInfo = () => {
    let url = `${USERINFO_URL}`;
    return new RequestEntity("GET", url, "_getUserInfo").then(res => res.json());
};
const _getUserPlantTypeAndPages = (roleCodeList) => {
    let url = `${BASE_URL}/authInfo/`;
    roleCodeList.map(roleCode => url += roleCode +';')
    return new RequestEntity("GET", url, "_getUserPlantTypeAndPages").then(res => res.json());
}
const _getUserAllPlants = (brandCodeList) => {
    let url = `${BASE_URL}/authInfo/brands/`;
    brandCodeList.map(brandCode => url += brandCode +';')
    return new RequestEntity("GET", url, "_getUserPlants").then(res => res.json());
}

export const changePassword = ( userName, password, newpassword ) => {
    const confirmBodys = {
        userName: userName,
        oldPassword: password,
        newPassword: newpassword
    }

    let url =`${STAGING_PASSWORD_TOKEN}`;
    return new RequestEntity("POST", url, "changePassword", confirmBodys).then(res => res.json());
};