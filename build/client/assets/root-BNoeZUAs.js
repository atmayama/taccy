import{r as i,j as t}from"./jsx-runtime-D5FwP9M8.js";import{l as y,n as f,o as d,p as g,_ as x,O as S,M as w,L as j,S as k}from"./components-UFyj0GOY.js";/**
 * @remix-run/react v2.15.2
 *
 * Copyright (c) Remix Software Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.md file in the root directory of this source tree.
 *
 * @license MIT
 */let a="positions";function M({getKey:e,...l}){let{isSpaMode:c}=y(),r=f(),p=d();g({getKey:e,storageKey:a});let h=i.useMemo(()=>{if(!e)return null;let s=e(r,p);return s!==r.key?s:null},[]);if(c)return null;let u=((s,m)=>{if(!window.history.state||!window.history.state.key){let o=Math.random().toString(32).slice(2);window.history.replaceState({key:o},"")}try{let n=JSON.parse(sessionStorage.getItem(s)||"{}")[m||window.history.state.key];typeof n=="number"&&window.scrollTo(0,n)}catch(o){console.error(o),sessionStorage.removeItem(s)}}).toString();return i.createElement("script",x({},l,{suppressHydrationWarning:!0,dangerouslySetInnerHTML:{__html:`(${u})(${JSON.stringify(a)}, ${JSON.stringify(h)})`}}))}const _=()=>[{rel:"preconnect",href:"https://fonts.googleapis.com"},{rel:"preconnect",href:"https://fonts.gstatic.com",crossOrigin:"anonymous"},{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"}];function I({children:e}){return t.jsxs("html",{lang:"en",children:[t.jsxs("head",{children:[t.jsx("meta",{charSet:"utf-8"}),t.jsx("meta",{name:"viewport",content:"width=device-width, initial-scale=1"}),t.jsx(w,{}),t.jsx(j,{}),t.jsx("link",{rel:"stylesheet",href:"https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=content_copy"})]}),t.jsxs("body",{children:[e,t.jsx(M,{}),t.jsx(k,{})]})]})}function R(){return t.jsx(S,{})}export{I as Layout,R as default,_ as links};
