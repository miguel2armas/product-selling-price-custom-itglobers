import { canUseDOM } from 'vtex.render-runtime'

const UrlBase = canUseDOM?
//@ts-ignore
window.location.origin:'';
interface DataIn{
    url:string
    urlParams:string
    bodyParams:{}
    type:string

}
console.log({UrlBase});

export const CustomHttp = (data:DataIn)=>{
    return new Promise(resolve => {
            SendCustomHttp(data, resolve)
    });
 }
const SendCustomHttp = (data:DataIn, resolve:any)=>{
    const { bodyParams, type, url, urlParams } = data;
    const returnData = {
        dataResult:null,
        codeResult:500
    };
        //@ts-ignore
        let xhr = new XMLHttpRequest();
        xhr.open(type, `${UrlBase}${url}${urlParams}`, true);
        xhr.onload = function() {
            //@ts-ignore
            if (this.readyState === XMLHttpRequest.DONE) {
                if(xhr.status<=200&&xhr.status<=220){
                const resData = JSON.parse(xhr.responseText);
                returnData.dataResult = resData;
                }
                returnData.codeResult = xhr.status;
                resolve(returnData);
            }
        }
        xhr.send(JSON.stringify(bodyParams));
}

export const FetchResponse = async(data:DataIn) =>{
    const { bodyParams, type, url, urlParams } = data;
    const response =  canUseDOM?
    //@ts-ignore
    await fetch(`${UrlBase}${url}${urlParams}`, {
        method: type,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyParams)
      }):null;

      return response ? response.json():null;
}