import React, { useContext, useEffect, useState } from 'react'
import "./ProductSellingPriceCustom.css"
import { useCssHandles } from 'vtex.css-handles'
//@ts-ignore
import { ProductContext, useProduct } from 'vtex.product-context'
//@ts-ignore
import { FormattedCurrency } from 'vtex.format-currency'
//@ts-ignore
import { useRenderSession } from 'vtex.session-client';
//@ts-ignore
import { Spinner } from 'vtex.styleguide'
import { ProductContextState } from '../../typings/ProductType';
import { CustomHttp, FetchResponse } from '../../helpers/CustomHttp'
import { Session } from '../../typings/LoginType'
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
interface ResultRegions {
  dataResult: DataResult[];
  codeResult: number;
}

interface DataResult {
  id: string;
  sellers: Seller[];
}

interface Seller {
  id: string;
  name: string;
  logo: string;
}
interface SegmentRespondResult {
  codeResult:number;
  dataResult:SegmentRespond;
}
interface SegmentRespond {
  campaigns?: any;
  channel: string;
  priceTables: string;
  regionId: string;
  utm_campaign?: any;
  utm_source?: any;
  utmi_campaign?: any;
  currencyCode: string;
  currencySymbol: string;
  countryCode: string;
  cultureInfo: string;
  admin_cultureInfo: string;
  channelPrivacy: string;
}

export const ProductSellingPriceCustom = ({type}:Props) => {
  const handles = useCssHandles(CSS_HANDLES);
  const { loading, session } = useRenderSession();
  const [userSession, setUserSession] = useState({} as Session);
  const [isPriceDefault, setIsPriceDefault] = useState(false)
  const [priceSeller, setPriceSeller] = useState({} as Item)
  const [priceSellerLoading, setPriceSellerLoading] = useState(true)
  const product: ProductContextState = useContext(ProductContext) as ProductContextState;
  const productContextValue = useProduct()
  const seller = product.selectedItem?.sellers.find(seller => seller.sellerDefault)
  ?product.selectedItem?.sellers.find(seller => seller.sellerDefault):product.selectedItem?.sellers[0];
  
  console.log({productContextValue});
  
  const getDataPrice = async(email:string) =>{
    const sendHttpSegment = {
      url:"/api/segments",
      urlParams:``,
      bodyParams:{},
      type:"GET"
    }
    const resultSegment = await CustomHttp(sendHttpSegment) as SegmentRespondResult;
      if(resultSegment.dataResult.regionId){
        const sendHttpSegment = {
          url:`/api/checkout/pub/regions/${resultSegment.dataResult.regionId}`,
          urlParams:``,
          bodyParams:{},
          type:"GET"
        }
        const resultRegions = await CustomHttp(sendHttpSegment) as ResultRegions;
        const { sellers } = resultRegions.dataResult?.[0];
        if(sellers){
         const sendHttp = {
           url:"/api/checkout/pub/orderForms/simulation",
           urlParams:``,
           bodyParams:{
             clientProfileData: {
               email
             },
             items:[
                 {
                   id: product.product?.productId,
                   quantity: 1,
                   seller: sellers[0]?.name
                 }  
             ]
         },
           type:"POST"
         }
         console.log({sendHttp});
         
         const resultItemPrice = await FetchResponse(sendHttp) as ResultItemPrice;
         console.log({resultItemPrice});
         
         if(resultItemPrice.codeResult===200){
           setPriceSellerLoading(false);
           setIsPriceDefault(false);
           setPriceSeller(resultItemPrice?.dataResult?.item);
         }else{
           setIsPriceDefault(true);
         }
        }
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
        console.log({userSession});
        
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
    </span>
  )
}