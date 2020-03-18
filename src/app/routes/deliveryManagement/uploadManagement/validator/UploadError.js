export class UploadError {
    static getErrorMessage(response) {
        switch (response.code) {
            case "100":
                return 'Excel中存在无法识别的商品代码，相关商品代码信息如下，请修改或者删除后重试。 (系统暂不支持价格为零商品的入出库操作) ' + response.message.invalidProductCode;
            case "101":
                return 'Excel中存在必填项未填写的列，相关信息如下，请修改后重试';
            case "102":
                return 'Excel中存在输入了非法字符的列，相关信息如下，请修改后重试';
            case "200":
                return 'Excel中运单号不能超过13位，相关运单号信息如下，请修改后重试 '+response.message.waybillNoList;
            case "201":
                return 'Excel中同一箱子中存在重复的商品代码，相关商品代码如下，请修改后重试 ' + response.message.boxNo + '-' + response.message.productCode;
            case "202":
                return 'Excel中同一个箱子中商品代码种类不能超过400种，相关箱号如下，请修改后重试 ' + response.message.boxNo;
            case "203":
                return 'Excel中存在超过20位的箱号，相关箱号信息如下，请修改后重试'+response.message.boxNoList;
            case "301":
                return 'Excel中存在无法识别的商品代码，相关商品代码信息如下，请修改或者删除后重试。 '+response.message.productCodeList;
            case "302":
                return 'Excel中存在库存不足的商品，相关商品代码信息如下，请修改后重试,[出库/可用] '+response.message.productCodeList;
            case "303":
                return 'Excel中存在无法识别的交货号，相关交货号信息如下，请修改后重试 '+response.message.deliveryNoList;
            case "304":
                return 'Excel中存在无法识别的箱号，相关箱号信息如下，请修改后重试 '+response.message.boxNoList;
            case "305":
                return 'Excel中存在无法识别的运单号，相关运单号信息如下，请修改后重试 '+response.message.waybillNoList;
            case "306":
                return 'Excel中存在已被确认过的交货号，相关交货号信息如下，确认无误后，请联系管理者并附带上传文件 '+response.message.deliveryNoList;
            case "307":
                return 'Excel中存在已经出库过的运单号，相关运单号信息如下，请修改后重试 '+response.message.waybillNoList;
            case "308":
                return 'Excel中存在无法识别的plant，相关plant信息如下，请修改后重试 '+response.message.plantIdList;
            case "309":
                return 'Excel中存在无法识别的plant（注：入库地只支持外部平台仓库，出库地只支持检品仓库或TP物流），相关plant信息如下，请修改后重试 '+response.message.plantIdList;
            case "310":
                return 'Excel中存在无法识别的plant（注：入库地或出库地输入多个），相关plant信息如下，请修改后重试 '+response.message.plantIdList;
            case "311":
                return 'Excel中存在TP对接完成的plant，不能手动入出库，相关plant信息如下，请修改后重试 ' + response.message.plantId;
            case "312":
                return 'Excel中同一箱子中存在重复的商品代码，相关商品代码如下，请修改后重试 ' + response.message.duplicateMap;
            case "313":
                return "Excel中的无法处理的交货号（注：直送类型单据禁止对未出库的商品进行入库），相关交货号信息如下，请修改后重试 " + response.message.deliveryNoList;
            case "314":
                return "Excel中存在价格为零的商品，相关商品代码信息如下，请修改或者删除后重试。 " + response.message.productCodeList;
            case "400":
                return response.message.errorMessage;
            default:
                return '上传失败';
        }
    }
}