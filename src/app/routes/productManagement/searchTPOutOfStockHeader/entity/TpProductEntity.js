const TP_PRODUCT_ID = "TP_PRODUCT_ID";
export default class TpProductEntity {
    static INVALID_PRODUCT = '错误的商品代码';
    static INVALID_PRODUCT_CODE = 30;
    static OUT_OF_STOCK = '库存不足';
    static OUT_OF_STOCK_CODE = 32;
    static setTpProduct = (tpProduct) => sessionStorage.setItem(TP_PRODUCT_ID, JSON.stringify(tpProduct));
    static getTpProduct = () => JSON.parse(sessionStorage.getItem(TP_PRODUCT_ID));
    static getBrandCode = () => TpProductEntity.getTpProduct() !== null ? TpProductEntity.getTpProduct().brandCode : 'EE';
    static getSkuBrandCode = () => TpProductEntity.getTpProduct() !== null ? TpProductEntity.getTpProduct().skuBrandCode : 'EE';
    static getTpProductId = () => {
        if(TpProductEntity.getTpProduct() !== null){
            return TpProductEntity.getTpProduct().tpProductId !== null ? TpProductEntity.getTpProduct().tpProductId : TpProductEntity.getTpProduct().productId
        }else {
            return '';
        }
    };
}