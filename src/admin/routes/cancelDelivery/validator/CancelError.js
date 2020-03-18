export class CancelError {
    static getErrorMessage(response) {
        switch (response.code) {
            case "100":
                return '不能撤销的类型，请联系管理员\r\n cancelDeliveryType : '+response.message.cancelDeliveryType+"; deliveryStatus : "+response.message.deliveryStatus;
            case "101":
                return '存在部分入库的数据，请使用交货号和箱号一起撤销单据';
            default:
                return '撤销失败';
        }
    }
}