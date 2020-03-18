import TpProductEntity from "../searchTPOutOfStockHeader/entity/TpProductEntity";
import {RequestEntity} from "../../../entities";
import {notification} from "antd/lib/index";
import UserInfoEntity from "../../../entities/UserInfoEntity";
import {config} from "../../../config/config";

const BASE_URL = config.serverInfo;

export const registerTpProductCodeToGift = (ref) => {
    const url = `${BASE_URL}/tp-plant-delivery/gift`;
    const body = [{
        brandCode: TpProductEntity.getBrandCode(),
        sourceProductCodes: [TpProductEntity.getTpProductId()],
        modifiedBy: UserInfoEntity.getUserName()
    }];
    debugger
    return new RequestEntity("PUT", url, "getTpPlantDelivery", body)
        .then(res => res.json())
        .then(res => {
            const {searchTpPlantDelivery} = ref.props;
            if (res[0].statusCode === "90") {
                notification['success']({
                    message: "赠品登入成功",
                    description: TpProductEntity.getTpProductId() + " => " + res[0].productId + "赠品登入成功",
                    duration: null
                });
                const {form} = ref.formRef.props; // @See https://ant.design/components/form/#getFieldDecorator(id,-options)-parameters
                const params = form.getFieldsValue(['brandCode', 'errorType', 'closingDate']);
                const closingDate = moment(params['closingDate']).format('YYYYMMDD');
                searchTpPlantDelivery(params['brandCode'], params['errorType'], closingDate);
            }
            if (res.statusCode === "500") {
                notification['error']({
                    message: "赠品登入失败",
                    description: res.message,
                    duration: null
                });
            }
        });
};
