import React, { useContext, useEffect, useState } from 'react'
import "./ProductSellingPriceCustom.css"
import { useCssHandles } from 'vtex.css-handles'
//@ts-ignore
import { ProductContext } from 'vtex.product-context'
//@ts-ignore
import { FormattedCurrency } from 'vtex.format-currency'
//@ts-ignore
import { useRenderSession } from 'vtex.session-client';
//@ts-ignore
import { Spinner } from 'vtex.styleguide'
import { ProductContextState } from '../../typings/ProductType';
import { CustomHttp } from '../../helpers/CustomHttp'
import { Session } from '../../typings/LoginType'
import BtnAddToCart from '../btnAddToCart'
const CSS_HANDLES = [
  "ProductSellingPriceCustom_price",
  "ProductSellingPriceCustom_price_pdp"
]
interface ResultItemPrice {
  dataResult: DataResult;
  codeResult: number;
}

interface DataResult {
  message: string;
  item: Item;
}

interface Item {
  price: number;
  priceTables: string;
  index: number;
  skuId: string;
  listPrice: number;
  costPrice: number;
  sellingPrice: number;
  priceValidUntil: string;
  tradePolicyId: string;
}
interface Props {
  type:string
}
export const ProductSellingPriceCustom = ({type}:Props) => {
  const handles = useCssHandles(CSS_HANDLES);
  const { loading, session } = useRenderSession();
  const [userSession, setUserSession] = useState({} as Session);
  const [isPriceDefault, setIsPriceDefault] = useState(false)
  const [priceSeller, setPriceSeller] = useState({} as Item)
  const [priceSellerLoading, setPriceSellerLoading] = useState(true)
  const product: ProductContextState = useContext(ProductContext) as ProductContextState;
  const seller = product.selectedItem?.sellers.find(seller => seller.sellerDefault)
  ?product.selectedItem?.sellers.find(seller => seller.sellerDefault):product.selectedItem?.sellers[0];

  const getDataPrice = async(email:string) =>{
    const sendHttp = {
      url:"/_v/external-prices/price",
      urlParams:``,
      bodyParams:{
        "item": {
            "skuId": product.selectedItem?.itemId
        },
        "context": {
            "email": email
        }
    },
      type:"POST"
    }
    const resultItemPrice = await CustomHttp(sendHttp) as ResultItemPrice;
    if(resultItemPrice.codeResult===200){
      setPriceSellerLoading(false);
      setIsPriceDefault(false);
      setPriceSeller(resultItemPrice?.dataResult?.item);
    }else{
      setIsPriceDefault(true);
    }

  }    
  useEffect(() => {
    if(!loading){
      setUserSession(session);
    }
  }, [loading, session])
  useEffect(()=>{
      if(userSession?.namespaces?.profile?.isAuthenticated?.value==="true"){
        setIsPriceDefault(false);
        getDataPrice(userSession?.namespaces?.profile?.email.value);
      }else{
        setIsPriceDefault(true);
      }
  }, [userSession])
  return (
    <span className={`${type && type ==="pdp"?handles.ProductSellingPriceCustom_price_pdp:handles.ProductSellingPriceCustom_price }`}>
      {isPriceDefault? 
      seller?.commertialOffer.Price && !loading? (
        <FormattedCurrency value={seller?.commertialOffer.Price} />
      ):(
        <Spinner color="#004393" size={20} />
      ):!priceSellerLoading?(
        <FormattedCurrency value={priceSeller?.price? (priceSeller?.price/100):0} />
      ):(
          <Spinner color="#004393" size={20} />
      )}
      {product?.selectedItem ? (<BtnAddToCart product={product} textContent={'agregar'} selectedQuantity={1} />):null}
      
    </span>
  )
}