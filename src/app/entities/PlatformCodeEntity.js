import PlatformManageAPI from "../service/PlatformManageAPI";

export default class PlatformEntity{
    static TP_PLANT_EHUB_PLANT_MAPPING = "TP_PLANT_EHUB_PLANT_MAPPING";

    static findAllTpPlantEhubPlantMapping = () => {
        PlatformManageAPI.findAllTpPlantEhubPlantMapping()
            .then(response => {
                sessionStorage.setItem(PlatformEntity.TP_PLANT_EHUB_PLANT_MAPPING, JSON.stringify(response));
            });
    };

    static findAllKindOfPlatform = () => {
        return _.uniqBy(JSON.parse(sessionStorage.getItem(PlatformEntity.TP_PLANT_EHUB_PLANT_MAPPING)), "platformName");
    }

    static findAllBrandDistinctPlatformList = () => {
        return JSON.parse(sessionStorage.getItem(PlatformEntity.TP_PLANT_EHUB_PLANT_MAPPING));
    }

    static findPlatformByCode = (platformCode) => {
        let foundPlatform = PlatformEntity.findAllBrandDistinctPlatformList().find(item => item.platformCode === platformCode)
        return foundPlatform ? foundPlatform.platformName : '';
    }

    static tpDeliveryType = [
        {"key": "OS", "value":"出库"}, 
        {"key": "OR", "value":"入库"},
        {"key": "EV", "value":"外部出库"}
    ];

    static findTpDeliveryTypeByCode = (tpDeliverycode) => {
        let foundTpDeliveryType = PlatformEntity.tpDeliveryType.find(item => item.key === tpDeliverycode);
        return foundTpDeliveryType ? foundTpDeliveryType.value : '';
    }

    static TMALL_OR = "天猫入";
    static TMALL_OR_SUCCESS = "天猫入成功";
    static TMALL_OS = "天猫出";
    static TMALL_OS_SUCCESS = "天猫出成功";
    static VIP_OR = "唯品会入";
    static VIP_OR_SUCCESS = "唯品会入成功";
    static VIP_OS = "唯品会出";
    static VIP_OS_SUCCESS = "唯品会出成功";
    static JD_OR = "京东入";
    static JD_OR_SUCCESS = "京东入成功";
    static JD_OS = "京东出";
    static JD_OS_SUCCESS = "京东出成功";
    static YOUZAN_OR = "有赞入";
    static YOUZAN_OR_SUCCESS = "有赞入成功";
    static YOUZAN_OS = "有赞出";
    static YOUZAN_OS_SUCCESS = "有赞出成功";
    static AIKUCUN_OR = "爱库存入";
    static AIKUCUN_OR_SUCCESS = "爱库存入成功";
    static AIKUCUN_OS = "爱库存出";
    static AIKUCUN_OS_SUCCESS = "爱库存出成功";
    static EXTERNAL_OS = "外部出";
    static EXTERNAL_OS_SUCCESS = "外部出成功";

    static TM = "TM";
    static VIP = "VIP";
    static JD = "JD";
    static YZ = "YZ";
    static AKC = "AKC";

}