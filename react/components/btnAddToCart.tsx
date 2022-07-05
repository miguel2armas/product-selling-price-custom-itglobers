import React from "react";
//@ts-ignore
import { AddToCartButton, mapCatalogItemToCart } from "vtex.add-to-cart-button"
interface Props {
    selectedQuantity:number
    textContent:string
    product:any
}

const BtnAddToCart = ({product, selectedQuantity, textContent}:Props) =>{

    const selectedSeller = product.product?.items[0]?.sellers[0]
    const productB = product?.product
    const assemblyOptions = product?.assemblyOptions
    const selectedItem = product?.selectedItem
    const skuItems = mapCatalogItemToCart({product:productB, selectedItem, selectedQuantity, selectedSeller, assemblyOptions})
    
    return <AddToCartButton text={textContent} isOneClickBuy={false} available={true} disabled={false} skuItems={skuItems} showToast={() => {console.log('agregado');
    }}
    multipleAvailableSKUs={false} allSkuVariationsSelected={true} addToCartFeedback="toast"
    productLink={{linkText:product.product?.linkText, productId:product.product?.productId}} 
    onClickBehavior="add-to-cart" onClickEventPropagation="disabled"/>
}   
export default BtnAddToCart