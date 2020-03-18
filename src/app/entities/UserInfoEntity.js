import { config } from 'config/config';
import { eHubException } from "exception/index";
import { INSPECT_WAREHOUSE, STUDIO, TP } from '../roles'

// private method
const _assertProperties = (mandatoryProps, checkObject, checkProperty) => {
    if(mandatoryProps.indexOf(checkProperty) < 0) {
        throw new eHubException("eHubUserInfoException, " + checkProperty + " is not a userInfo's property.");
    }
    if(!checkObject.hasOwnProperty(checkProperty)) {
        throw new eHubException("eHubUserInfoException, Not exist " + checkProperty + " property in userInfo object.");
    }
    if(checkObject[checkProperty] === undefined || checkObject[checkProperty] === null) {
        throw new eHubException("eHubUserInfoException, userInfo." + checkProperty + "'s value is null.");
    }
};
const  _checkUserInfoEffectiveness = (userInfo, checkProperty) => {
    const mandatoryProps = ["appId", "appName", "applicationId", "colleague", "tenantCode"];
    // userInfo 객체 유효성 검사
    _assertProperties(mandatoryProps, userInfo, checkProperty);
};
const _checkColleagueEffectiveness = (colleague, checkProperty) => {
    const mandatoryProps = ["brands", "colleagueKey", "colleagueNo", "name", "plant", "roles", "shops", "tenants", "userName"];
    // userInfo.colleague 객체 유효성 검사
    _assertProperties(mandatoryProps, colleague, checkProperty);
};
const _getUserInfo = () => {
    const userInfo = JSON.parse(sessionStorage.getItem(config.userInfoKey));
    if(!userInfo) {
        window.location.href = "#/auth/login";
    }
    _checkUserInfoEffectiveness(userInfo, "colleague");
    _checkColleagueEffectiveness(userInfo.colleague, "userName");
    _checkColleagueEffectiveness(userInfo.colleague, "brands");
    return userInfo;
};

class UserInfoEntity {
    static getTenant = () => {
        return _getUserInfo().colleague.tenant;
    };
    static getUserName = () => {
        return _getUserInfo().colleague.userName;
    };
    static isInspectWarehouse = () => {
        return UserInfoEntity.getTenant() === INSPECT_WAREHOUSE;
    };
    static isStudio = () => {
        return UserInfoEntity.getTenant() === STUDIO;
    };
    static canExternalIssueReceipt = () => {
        return UserInfoEntity.getTenant() === INSPECT_WAREHOUSE || UserInfoEntity.getTenant() === TP;
    }
};

export default UserInfoEntity;