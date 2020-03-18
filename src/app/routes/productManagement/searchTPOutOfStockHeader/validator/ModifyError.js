export class ModifyError {
    static getErrorMessage(response) {
        switch (response.code) {
            case "100":
                return '输入的商品代码错误 ' + response.message.invalidProductCode;
            default:
                return '上传失败';
        }
    }
}