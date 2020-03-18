export class AdjustmentError {
    static getErrorMessage(response) {
        switch (response.code) {
            case "100":
                return 'skuId error ' + response.message.invalidSkuIdList;
            default:
                return '上传失败';
        }
    }
}