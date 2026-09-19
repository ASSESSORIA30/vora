import { useEffect } from 'react'
import { BRAND } from '../config/brand'
import { captureAttribution } from '../lib/analytics'

export default function Analytics(){
  useEffect(()=>{
    captureAttribution()
    const load=()=>{let consent='';try{consent=localStorage.getItem('vora_consent')||''}catch{};if(consent!=='analytics')return;const {ga4Id,googleAdsId,metaPixelId}=BRAND.analytics;const gtagId=ga4Id||googleAdsId;if(gtagId&&!document.querySelector('script[data-vora-gtag]')){const s=document.createElement('script');s.async=true;s.dataset.voraGtag='1';s.src=`https://www.googletagmanager.com/gtag/js?id=${gtagId}`;document.head.appendChild(s);window.dataLayer=window.dataLayer||[];window.gtag=function(){window.dataLayer.push(arguments)};window.gtag('js',new Date());if(ga4Id)window.gtag('config',ga4Id,{send_page_view:true});if(googleAdsId)window.gtag('config',googleAdsId)}if(metaPixelId&&!document.querySelector('script[data-vora-meta]')){const f=function(){f.callMethod?f.callMethod.apply(f,arguments):f.queue.push(arguments)};if(!window.fbq){window.fbq=f;f.push=f;f.loaded=true;f.version='2.0';f.queue=[]}const s=document.createElement('script');s.async=true;s.dataset.voraMeta='1';s.src='https://connect.facebook.net/en_US/fbevents.js';document.head.appendChild(s);window.fbq('init',metaPixelId);window.fbq('track','PageView')}}
    load();const listener=()=>load();window.addEventListener('vora-consent-change',listener);return()=>window.removeEventListener('vora-consent-change',listener)
  },[])
  return null
}
