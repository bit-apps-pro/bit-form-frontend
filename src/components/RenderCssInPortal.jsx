import filepondPreviewCSS from 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css?inline'
import filepondCSS from 'filepond/dist/filepond.min.css?inline'
import { useEffect } from 'react'
import tippyShiftAwayExtremeCSS from 'tippy.js/animations/shift-away-extreme.css?inline'
import tippySvgArrowCSS from 'tippy.js/dist/svg-arrow.css?inline'
import tippyCss from 'tippy.js/dist/tippy.css?inline'
import tippyLightBorderCSS from 'tippy.js/themes/light-border.css?inline'
import { select } from '../Utils/globalHelpers'

export default function RenderCssInPortal() {
   const styled = { div([str]) { return str } }

   useEffect(() => {
      const font1 = select('#bf-font-0-css')
      const font2 = select('#bf-font-1-css')

      if (font1 && font2) {
         document
            .getElementById('bit-grid-layout')
            ?.contentWindow
            ?.document
            .head
            .appendChild(document.importNode(font1))
            .appendChild(document.importNode(font2))
      }
   }, [])

   const gridLayoutStyle = styled.div`
:root {
    --b-50: #006aff;
    --g-41: #00faa7;
    --white-base: 0;
    --white-100: hsla(var(--white-base), 0%, 100%, 100%);
    --white-0-0-12: hsla(var(--white-base), 0%, 0%, 12%);
    --white-0-0-8: hsla(var(--white-base), 0%, 0%, 8%);
    --white-0-93: hsla(var(--white-base), 0%, 93%, 100%);
    --black-0: hsla(var(--white-base), 0%, 0%, 100%);
    --red-83-54: hsla(var(--white-base), 83%, 54%, 100%);
    --red-100-49: hsla(var(--white-base), 100%, 49%, 100%);
}
 
 body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: sans-serif;
 }
 body *{
    box-sizing: border-box !important;
 }
 
 .custom-conf-mdl {
  display: block !important;
  text-align: left;
}

.tippy-box[data-theme~=light-border] {
  box-shadow: 0 3px 6px -1px #00000026, 0 4px 35px -12px rgb(0 8 16 / 32%) !important;
}

.tippy-box {
  border-radius: .8em !important;
}

.tippy-backdrop {
  background: var(--dp-blue-bg) !important;
}
.isDragging {
    box-shadow: inset 0 0 4px 1px var(--b-50);
 }
.isDragging .layout{
  min-height: calc(100vh - 40px);
}
 
 .layout {
    overflow: visible;
 }

.loader{
  background: rgb(255, 255, 255);
  background-image: linear-gradient(90deg, #e9e9e9 0px, #f7f7f7 30px, #ebebeb 60px);
  background-size: 200%;
  animation: skeleton .6s infinite ease-out;
}

@keyframes skeleton {
  0% {
    background-position: calc(100%);
  }
  60%, 100% {
    background-position: -100%;
  }
}
 
 .itm-focus {
    outline: 3px solid var(--b-50);
    z-index: 9
 }
 
 .blk:focus:not(.itm-focus) {
    z-index: 9;
    outline: 3px solid var(--g-41)
 }

 .blk:hover:not(.itm-focus) {
    z-index: 999;
 }
 
 .blk:focus > .blk-icn-wrp,.blk:hover > .blk-icn-wrp,.itm-focus > .blk-icn-wrp {
    visibility: visible;
 }

 .blk:focus > .blk-icn-wrp,.itm-focus > .blk-icn-wrp {
  top: -25px;
  right: -3px;
 }

 .blk:not(.itm-focus):hover:not(:focus) > .blk-icn-wrp {
  top: -25px;
  right: 0px;
 }
 
 .blk:focus > .blk-icn-wrp button,.blk:focus > .react-resizable-handle,.blk:hover > .blk-icn-wrp button,.blk:hover > .react-resizable-handle,.itm-focus > .blk-icn-wrp button,.itm-focus > .react-resizable-handle {
    transform: scale(1)
 }
 
 .tip-btn {
    display:inline-flex;
    justify-content: center;
    align-items: center;
    font-family: "Outfit", sans-serif;
    border: 0;
    padding: 6px 15px;
    font-weight: 600;
    border-radius: 12px;
    cursor: pointer;
    background: var(--white-0-93);
    border: 1px solid var(--white-0-86)
 }
 
 .tip-btn:hover {
    background: var(--white-0-0-12)
 }
 
 .red-btn {
    background: var(--red-100-49);
    color: var(--white-100);
    border: 1px solid var(--crimson);
    text-shadow: 0 .5px 1px #101010b5
 }
 
 .red-btn:hover {
    background: var(--red-83-54)
 }

 .resize-txt {
   position: absolute;
   top: -25px;
   font-size: 12px;
   padding: 3px 6px;
   background-color: #a5a5afbd;
   border-radius: 10px;
   z-index: 1;
 }
 
 .blk-icn-wrp {
    background-color: hsl(215deg 100% 50%);
    color: white;
    right: 0;
    top: -25px;
    visibility: hidden;
    border-top-left-radius: 7px;
    border-top-right-radius: 7px;
 }
 
 .blk-wrp-btn {
    background: none;
    color: var(--white-100);
    cursor: pointer;
    outline: 0;
    width: 25px;
    height: 25px;
    border-radius: 7px;
    border: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    filter: drop-shadow(0px 1px .7px #00000032);
    transition: background .2s ease-in-out;
 }
 
 .blk-wrp-btn:hover {
    background: hsl(215deg 100% 40%);
 }
 
 .blk-wrp-btn:focus-visible {
    box-shadow: 0 0 0 2px var(--b-50) inset
 }
 
 .drag:not(.no-drg) {
    cursor: grab
 }
 
 .drag:hover:not(.blk-wrp-btn), .drag-hover:not(.blk-wrp-btn) {
  outline: 2px dashed var(--b-50);
  outline-offset: -2px;
 }
 
 .drag:active {
    cursor: grabbing
 }
 
 .no-drg {
    cursor: default
 }
 
 .react-grid-layout {
    position: relative;
 }
 
 .react-grid-item {
    transition: all 200ms ease;
    transition-property: left,top
 }
 
 .react-grid-item.cssTransforms {
    transition-property: transform
 }
 
 .react-grid-item.resizing {
    z-index: 1;
    will-change: width,height
 }
 
 .react-grid-item.react-draggable-dragging {
    background: #fff;
    transition: none;
    z-index: 3;
    will-change: transform
 }
 
 .react-grid-item.dropping {
    visibility: hidden
 }
 
 .react-grid-item.react-grid-placeholder {
    background: rgba(160,205,255,.2);
    transition-duration: 100ms;
    border: 2px dashed #0059ff;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -o-user-select: none;
    user-select: none
 }
 
 .react-grid-item>.react-resizable-handle {
    position: absolute;
    transform: scale(0)
 }
 
 .react-grid-item>.react-resizable-handle::after {
    position: absolute;
    right: 3px;
    bottom: 3px;
    content: "";
    width: 5px;
    height: 5px
 }
 
 .react-resizable-hide>.react-resizable-handle {
    display: none
 }
 
 .react-resizable {
    position: relative
 }
 
 .react-resizable-handle {
    position: absolute;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    padding: 0 1px 1px 0;
    border-radius:20px;
    background-color:var(--b-50);
    box-shadow: 0 1px 1.5px 0 #7b7a7a;
  }
  
  .react-resizable-handle-se {
    right: -8px;
    bottom: -8px;
    width: 20px;
    height: 20px;
    cursor: se-resize;
    transform: rotate(90deg);
    background-position: bottom right;
    background-position: 60% 58%;
    z-index: 1;
    background-image: url('data:image/svg+xml;utf8,<svg width="12" height="8" viewBox="0 0 21 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M0.909822 0.753938L13.0461 1.84232L6.03541 11.8085L0.909822 0.753938Z" fill="white"/><path d="M20.0902 14.2461L7.95387 13.1577L14.9646 3.19152L20.0902 14.2461Z" fill="white"/></svg>')
  }
 
  .react-resizable-handle-e {
    top: 35%;
    width: 13px;
    right: -8px;
    height: 30px;
    margin-top: -10px;
    cursor: ew-resize;
    background-position: center;
    background-repeat: no-repeat;
    background-image: url('data:image/svg+xml;utf8,<svg width="7" height="18" viewBox="0 0 29 72" fill="none" xmlns="http://www.w3.org/2000/svg"><style>.r{fill:white;width: 12px;height: 12px;rx: 10px;}</style><rect x="10" y="1" class="r" /><rect x="10" y="31" class="r" /><rect x="10" y="61" class="r" /></svg>')
 }
 .context-menu {
    display: flex;
    flex-direction: column;
    border-radius: 10px;
    position: relative;
    background-color: var(--white-100);
    z-index: 9999999;
 }
 .context-list {
    margin: 0px;
    display: block;
    width: 100%;
    list-style: none;
    padding-left: 0;
  }
  .context-item {
    position: relative;
    margin-bottom: 0px;
    width: 100%;
  }
  .context-btn {
    font-family: "Outfit", sans-serif;
    border: 0px;
    padding: 6px 6px;
    padding-right: 36px;
    width: 100%;
    border-radius: 8px;
    font-weight: 500;
    display: flex;
    align-items: center;
    position: relative;
    background-color: var(--white-100);
    cursor: pointer;
  }
  .context-btn span {
      text-align: left;
  }
  .context-btn:hover, .context-btn.active {
    background-color: var(--white-0-93);
  }
  .context-btn:hover svg, .context-btn.active svg {
    filter: drop-shadow(1px 1px 0.5px #b3b3b3);
  }
  .context-btn:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px var(--b-50) inset
  }
  .context-btn svg {
    flex-shrink: 0;
    width: 20px;
    height: 20px;
    margin-right: 10px;
    stroke: var(--black-0);
  }
  .context-btn svg:nth-of-type(2) {
    margin-right: 0;
    position: absolute;
    right: 8;
  }
  .context-btn-color { 
    color: var(--b-50)
  }
   .context-btn .tag-label{
      font-size: 10px;
      align-self: baseline;
      background-color: var(--white-0-0-8) !important;
      border-radius: 5px;
      margin-left: 3px;
      padding: 2px 4px;
   }
  .pro-badge{
    background-color: #999999;
    color: #ffffff;
    font-size: 10;
    font-weight: 700;
    border-radius: 8px;
    padding: 2px 4px;
    margin-left: 5;
   }
   .pro-badge:hover: {
      cur: pointer
   }
  .delete:hover,.delete.active { 
    color: var(--red-100-49) !important;
  }
  .delete:hover svg,.delete.active svg {
    stroke: var(--red-100-49) !important;
  }
  .right-click-context-menu{
    border:1px solid #d0d0d0;
    padding: 5px;
    box-shadow: 0px 47px 58px rgba(0, 0, 0, 0.07), 0px 19.6355px 25.6741px rgba(0, 0, 0, 0.0503198), 0px 10.4981px 17.9875px rgba(0, 0, 0, 0.0417275), 0px 5.88513px 13.1341px rgba(0, 0, 0, 0.035), 0px 3.12555px 8.79534px rgba(0, 0, 0, 0.0282725), 0px 1.30061px 4.46737px rgba(0, 0, 0, 0.0196802);
   }
   .fld-hide::after {
      position: absolute;
      top: 0;
      left: 0;
      text-align: center;  vertical-align: -50%;
      content: "";
      background-repeat: no-repeat;
      background-position: center;
      background-image: url("data:image/svg+xml, %3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50' viewBox='0 0 24 24'%3E%3Cg fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='5'%3E%3Cpath d='m3 3l18 18M10.584 10.587a2 2 0 0 0 2.828 2.83' /%3E%3Cpath d='M9.363 5.365A9.466 9.466 0 0 1 12 5c4 0 7.333 2.333 10 7c-.778 1.361-1.612 2.524-2.503 3.488m-2.14 1.861C15.726 18.449 13.942 19 12 19c-4 0-7.333-2.333-10-7c1.369-2.395 2.913-4.175 4.632-5.341' /%3E%3C/g%3E%3C/svg%3E");
      width: 100%;
      height: 100%;
      background-color: hsla(0, 0%, 0%, 20%);
   }


   .spacer-field-bg {
      position: relative;
      background-image: repeating-linear-gradient(
         45deg,                                         /* angle of the stripes */
         hsla(var(--gah),var(--gas),var(--gal),20%),    /* stripe color */
         hsla(var(--gah),var(--gas),var(--gal),5%) 5px, /* end of stripe */
         transparent 5px,                               /* start of space between stripes */
         transparent 20px                               /* end of space */
      );
      overflow: hidden;
   }
  .spacer-field-bg::before {
      content: attr(data-admin-label);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: var(--fld-lbl-c, var(--fld-inp-c));;
      font-size: 16px;
      text-align: center;
      padding: var(--fld-p);
      border-radius: var(--g-bdr-rad);
      background-color: var(--global-fld-bg-color, var(--bg-0));
      pointer-events: none; /* Prevent interaction with the text */
   }
  `

   const utils = styled.div`
  .pos-rel { position: relative}
   .g-c {
      display: -ms-grid;
      display: grid;
      place-content: center;
   }
   .f-rob {font-family: "Roboto",sans-serif}
   .f-mon {font-family:"Outfit", sans-serif !important; } 
   .wdt-200 {width: 200px !important;}
   .curp{cursor:pointer}
   .us-n {
      -webkit--ms-user-select: none;
      -webkit-user-select: none;
      -khtml--ms-user-select: none;
      -moz--ms-user-select: none;
      -o--ms-user-select: none;
      -ms-user-select: none;
      user-select: none;
   }
   .pos-abs{position:absolute;}

   .flx {display: flex }
   .flx-c {justify-content: center}
   
   .mt-1 {margin-top: 5px}
   .mr-2 {margin-right: 10px}
   .mb-2 {margin-bottom: 10px}

   .f-12{font-size:12px;}
   .svg-icn {
    fill: none;
    stroke: currentColor;
    stroke-linecap: round;
    stroke-linejoin: round;
  }
  .highlight-margin {
    background-color: rgb(255, 200, 98);
    opacity: 0.3;
    position: absolute;
    overflow: hidden;
    z-index: 999999;
  }
  .highlight-padding {
    overflow: hidden;
    background-color: rgb(86, 111, 255);
    outline: 1px dashed #003f53;
    outline-offset: -1px;
  }
  .highlight-element {
    overflow: hidden;
    background: rgb(255, 255, 103);
    outline: 1px dashed #635700;
    outline-offset: -1px;
  }
  .layout-wrapper{
    background-size: 13px 13px;
    background-image: radial-gradient(#458ff7 0.5px, #fff 0.5px);
    background-size: 10px 10px;
    font-family: var(--g-font-family)
}
/* hide default scrollbar in custom scrollbar */
.layout-wrapper > div > div::-webkit-scrollbar {
display:none;
}


`
   return (
      <style>
         {gridLayoutStyle}
         {filepondCSS}
         {filepondPreviewCSS}
         {tippyCss}
         {tippyLightBorderCSS}
         {tippyShiftAwayExtremeCSS}
         {tippySvgArrowCSS}
         {utils}
      </style>
   )
}
