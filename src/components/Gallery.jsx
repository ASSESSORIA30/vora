import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

gsap.registerPlugin(ScrollTrigger)

const IMAGES = [
  { src:'/media/houses/model-07-exterior.webp', alt:'VORA Signature exterior', caption:'Signature · Exterior', span:'col-span-12 md:col-span-8 aspect-[16/10]' },
  { src:'/media/houses/model-02-interior.webp', alt:'Interior VORA 110', caption:'VORA 110 · Living', span:'col-span-12 md:col-span-4 aspect-[4/5]' },
  { src:'/media/houses/model-04-exterior.webp', alt:'VORA 150 exterior', caption:'VORA 150 · Residence', span:'col-span-6 md:col-span-4 aspect-square' },
  { src:'/media/houses/model-03-interior.webp', alt:'Interior VORA 130', caption:'VORA 130 · Cocina', span:'col-span-6 md:col-span-4 aspect-square' },
  { src:'/media/houses/model-05-interior.webp', alt:'Interior VORA 170', caption:'VORA 170 · Interior / exterior', span:'col-span-12 md:col-span-4 aspect-[4/5]' },
  { src:'/media/houses/model-06-exterior.webp', alt:'VORA 200 exterior', caption:'VORA 200 · Hormigón y paisaje', span:'col-span-12 md:col-span-8 aspect-[16/10]' },
  { src:'/media/houses/model-02-exterior.webp', alt:'VORA 110 exterior', caption:'VORA 110 · Balance', span:'col-span-12 md:col-span-5 aspect-[4/3]' },
  { src:'/media/houses/model-07-interior.webp', alt:'Interior VORA Signature', caption:'Signature · Quiet luxury', span:'col-span-12 md:col-span-7 aspect-[16/9]' },
]

export default function Gallery(){
  const sectionRef=useRef(null),headingRef=useRef(null)
  useEffect(()=>{const ctx=gsap.context(()=>{const split=new SplitType(headingRef.current,{types:'lines,words',lineClass:'reveal-line'});gsap.set(split.words,{yPercent:110});ScrollTrigger.create({trigger:headingRef.current,start:'top 80%',onEnter:()=>gsap.to(split.words,{yPercent:0,duration:1.3,ease:'expo.out',stagger:.04})});sectionRef.current.querySelectorAll('[data-img]').forEach(item=>{const img=item.querySelector('img');gsap.fromTo(item,{clipPath:'inset(100% 0 0 0)'},{clipPath:'inset(0% 0 0 0)',duration:1.4,ease:'expo.inOut',scrollTrigger:{trigger:item,start:'top 85%'}});gsap.fromTo(img,{yPercent:-6},{yPercent:6,ease:'none',scrollTrigger:{trigger:item,start:'top bottom',end:'bottom top',scrub:true}})})},sectionRef);return()=>ctx.revert()},[])
  return <section id="gallery" ref={sectionRef} className="relative py-24 md:py-40 bg-cream-200 overflow-hidden"><div className="max-w-[1600px] mx-auto px-6 md:px-12">
    <div className="grid grid-cols-12 gap-4 md:gap-8 mb-16 md:mb-24"><div className="col-span-12 md:col-span-4"><div className="section-label text-navy-700/50"><span className="text-gold-400">05</span> / 07 — ATMÓSFERA</div></div><div className="col-span-12 md:col-span-8"><h2 ref={headingRef} className="font-display text-display leading-[0.95] tracking-tightest">Hormigón que pesa.<br/>Espacios que <em className="italic text-gold-400 font-light">respiran.</em></h2><p className="mt-8 max-w-xl text-navy-700/70 text-lg leading-relaxed">Hormigón, piedra, madera, vidrio y luz natural. Pocos materiales, repetidos con intención, para que toda la colección se sienta parte de una misma arquitectura.</p></div></div>
    <div className="grid grid-cols-12 gap-3 md:gap-6">{IMAGES.map((img,i)=><figure key={i} data-img data-cursor="view" className={`relative overflow-hidden bg-navy-500 group cursor-view ${img.span}`}><div className="absolute inset-0"><img src={img.src} alt={img.alt} className="w-full h-full object-cover will-change-transform transition-transform duration-[1400ms] ease-out group-hover:scale-[1.035]" loading="lazy"/></div><div className="absolute inset-0 bg-gradient-to-t from-navy-800/60 via-transparent to-transparent opacity-10 group-hover:opacity-100 transition-opacity duration-500"/><figcaption className="absolute bottom-4 left-5 section-label text-cream-200 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">{img.caption}</figcaption></figure>)}</div>
  </div></section>
}
