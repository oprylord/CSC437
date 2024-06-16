(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))s(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(r){if(r.ep)return;r.ep=!0;const n=e(r);fetch(r.href,n)}})();var Ue;class at extends Error{}at.prototype.name="InvalidTokenError";function Ys(i){return decodeURIComponent(atob(i).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Ks(i){let t=i.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Ys(t)}catch{return atob(t)}}function as(i,t){if(typeof i!="string")throw new at("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=i.split(".")[e];if(typeof s!="string")throw new at(`Invalid token specified: missing part #${e+1}`);let r;try{r=Ks(s)}catch(n){throw new at(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(r)}catch(n){throw new at(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Js="mu:context",ie=`${Js}:change`;class Zs{constructor(t,e){this._proxy=Qs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class de extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Zs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(ie,t),t}detach(t){this.removeEventListener(ie,t)}}function Qs(i,t){return new Proxy(i,{get:(s,r,n)=>{if(r==="then")return;const o=Reflect.get(s,r,n);return console.log(`Context['${r}'] => `,o),o},set:(s,r,n,o)=>{const l=i[r];console.log(`Context['${r.toString()}'] <= `,n);const a=Reflect.set(s,r,n,o);if(a){let p=new CustomEvent(ie,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(p,{property:r,oldValue:l,value:n}),t.dispatchEvent(p)}else console.log(`Context['${r}] was not set to ${n}`);return a}})}function Xs(i,t){const e=ls(t,i);return new Promise((s,r)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else r({context:t,reason:`No provider for this context "${t}:`})})}function ls(i,t){const e=`[provides="${i}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const r=t.getRootNode();if(r instanceof ShadowRoot)return ls(i,r.host)}class tr extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function cs(i="mu:message"){return(t,...e)=>t.dispatchEvent(new tr(e,i))}class pe{constructor(t,e,s="service:message",r=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=r}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function er(i){return t=>({...t,...i})}const ne="mu:auth:jwt",St=class hs extends pe{constructor(t,e){super((s,r)=>this.update(s,r),t,hs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:r}=t[1];return e(ir(s)),Zt(r);case"auth/signout":return e(Ne()),Zt(this._redirectForLogin);case"auth/redirect":return e(Ne()),Zt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};St.EVENT_TYPE="auth:message";St.dispatch=cs(St.EVENT_TYPE);let sr=St;function Zt(i,t={}){if(!i)return;const e=window.location.href,s=new URL(i,e);return Object.entries(t).forEach(([r,n])=>s.searchParams.set(r,n)),()=>{console.log("Redirecting to ",i),window.location.assign(s)}}class rr extends de{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){super({user:J.authenticateFromLocalStorage()})}connectedCallback(){new sr(this.context,this.redirect).attach(this)}}class K{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(ne),t}}class J extends K{constructor(t){super();const e=as(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new J(t);return localStorage.setItem(ne,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(ne);return t?J.authenticate(t):new K}}function ir(i){return er({user:J.authenticate(i),token:i})}function Ne(){return i=>{const t=i.user;return{user:t&&t.authenticated?K.deauthenticate(t):t,token:""}}}function nr(i){return i.authenticated?{Authorization:`Bearer ${i.token||"NO_TOKEN"}`}:{}}function or(i){return i.authenticated?as(i.token||""):{}}const gt=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:J,Provider:rr,User:K,headers:nr,payload:or},Symbol.toStringTag,{value:"Module"}));function Pt(i,t,e){const s=i.target,r=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${i.type}:`,r),s.dispatchEvent(r),i.stopPropagation()}function oe(i,t="*"){return i.composedPath().find(s=>{const r=s;return r.tagName&&r.matches(t)})}const fe=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:oe,relay:Pt},Symbol.toStringTag,{value:"Module"})),ar=new DOMParser;function yt(i,...t){const e=i.map((o,l)=>l?[t[l-1],o]:[o]).flat().join(""),s=ar.parseFromString(e,"text/html"),r=s.head.childElementCount?s.head.children:s.body.children,n=new DocumentFragment;return n.replaceChildren(...r),n}function Ft(i){const t=i.firstElementChild,e=t&&t.tagName==="TEMPLATE"?t:void 0;return{attach:s};function s(r,n={mode:"open"}){const o=r.attachShadow(n);return e&&o.appendChild(e.content.cloneNode(!0)),o}}const us=class ds extends HTMLElement{constructor(){super(),this._state={},Ft(ds.template).attach(this),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}}),this.form&&this.form.addEventListener("submit",t=>{t.preventDefault(),Pt(t,"mu-form:submit",this._state)})}set init(t){this._state=t||{},cr(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}};us.template=yt`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;let lr=us;function cr(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}const me=Object.freeze(Object.defineProperty({__proto__:null,Element:lr},Symbol.toStringTag,{value:"Module"})),ps=class fs extends pe{constructor(t){super((e,s)=>this.update(e,s),t,fs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:r}=t[1];e(ur(s,r));break}case"history/redirect":{const{href:s,state:r}=t[1];e(dr(s,r));break}}}};ps.EVENT_TYPE="history:message";let ge=ps;class je extends de{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=hr(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),ye(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ge(this.context).attach(this)}}function hr(i){const t=i.currentTarget,e=s=>s.tagName=="A"&&s.href;if(i.button===0)if(i.composed){const r=i.composedPath().find(e);return r||void 0}else{for(let s=i.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ur(i,t={}){return history.pushState(t,"",i),()=>({location:document.location,state:history.state})}function dr(i,t={}){return history.replaceState(t,"",i),()=>({location:document.location,state:history.state})}const ye=cs(ge.EVENT_TYPE),pr=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:je,Provider:je,Service:ge,dispatch:ye},Symbol.toStringTag,{value:"Module"}));class _t{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const r=new Me(this._provider,t);this._effects.push(r),e(r)}else Xs(this._target,this._contextLabel).then(r=>{const n=new Me(r,t);this._provider=r,this._effects.push(n),r.attach(o=>this._handleChange(o)),e(n)}).catch(r=>console.log(`Observer ${this._contextLabel} failed to locate a provider`,r))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),this._effects.forEach(e=>e.runEffect())}}class Me{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const _e=class ms extends HTMLElement{constructor(){super(),this._state={},this._user=new K,this._authObserver=new _t(this,"blazing:auth"),Ft(ms.template).attach(this),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",r=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;mr(r,this._state,e,this.authorization).then(n=>it(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:r}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,r=e.value;s&&(this._state[s]=r)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},it(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&ae(this.src,this.authorization).then(e=>{this._state=e,it(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&ae(this.src,this.authorization).then(r=>{this._state=r,it(r,this)});break;case"new":s&&(this._state={},it({},this));break}}};_e.observedAttributes=["src","new","action"];_e.template=yt`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;let fr=_e;function ae(i,t){return fetch(i,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${i}:`,e))}function it(i,t){const e=Object.entries(i);for(const[s,r]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!r;break;default:o.value=r;break}}}return i}function mr(i,t,e="PUT",s={}){return fetch(i,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(r=>{if(r.status!=200&&r.status!=201)throw`Form submission failed: Status ${r.status}`;return r.json()}).catch(r=>console.log("Error submitting form:",r))}const ve=Object.freeze(Object.defineProperty({__proto__:null,FormElement:fr,fetchData:ae},Symbol.toStringTag,{value:"Module"})),gs=class ys extends pe{constructor(t,e){super(e,t,ys.EVENT_TYPE,!1)}};gs.EVENT_TYPE="mu:message";let _s=gs;class gr extends de{constructor(t,e,s){super(e),this._user=new K,this._updateFn=t,this._authObserver=new _t(this,s)}connectedCallback(){const t=new _s(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const yr=Object.freeze(Object.defineProperty({__proto__:null,Provider:gr,Service:_s},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis,$e=wt.ShadowRoot&&(wt.ShadyCSS===void 0||wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,be=Symbol(),Le=new WeakMap;let vs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==be)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if($e&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Le.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Le.set(e,t))}return t}toString(){return this.cssText}};const _r=i=>new vs(typeof i=="string"?i:i+"",void 0,be),vr=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new vs(e,i,be)},$r=(i,t)=>{if($e)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=wt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},He=$e?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return _r(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:br,defineProperty:Ar,getOwnPropertyDescriptor:Er,getOwnPropertyNames:wr,getOwnPropertySymbols:xr,getPrototypeOf:Sr}=Object,Z=globalThis,Ie=Z.trustedTypes,Pr=Ie?Ie.emptyScript:"",ze=Z.reactiveElementPolyfillSupport,lt=(i,t)=>i,Ct={toAttribute(i,t){switch(t){case Boolean:i=i?Pr:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Ae=(i,t)=>!br(i,t),De={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:Ae};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Z.litPropertyMetadata??(Z.litPropertyMetadata=new WeakMap);let W=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=De){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&Ar(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=Er(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??De}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=Sr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const e=this.properties,s=[...wr(e),...xr(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(He(r))}else t!==void 0&&e.push(He(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return $r(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const r=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,r);if(n!==void 0&&r.reflect===!0){const o=(((s=r.converter)==null?void 0:s.toAttribute)!==void 0?r.converter:Ct).toAttribute(e,r.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const r=this.constructor,n=r._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=r.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:Ct;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??Ae)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(s)):this._$EU()}catch(r){throw e=!1,this._$EU(),r}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};W.elementStyles=[],W.shadowRootOptions={mode:"open"},W[lt("elementProperties")]=new Map,W[lt("finalized")]=new Map,ze==null||ze({ReactiveElement:W}),(Z.reactiveElementVersions??(Z.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const kt=globalThis,Ot=kt.trustedTypes,Fe=Ot?Ot.createPolicy("lit-html",{createHTML:i=>i}):void 0,$s="$lit$",P=`lit$${Math.random().toFixed(9).slice(2)}$`,bs="?"+P,Cr=`<${bs}>`,I=document,ut=()=>I.createComment(""),dt=i=>i===null||typeof i!="object"&&typeof i!="function",As=Array.isArray,kr=i=>As(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",Qt=`[ 	
\f\r]`,nt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Be=/-->/g,qe=/>/g,N=RegExp(`>|${Qt}(?:([^\\s"'>=/]+)(${Qt}*=${Qt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ve=/'/g,We=/"/g,Es=/^(?:script|style|textarea|title)$/i,Or=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),Xt=Or(1),Q=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Ge=new WeakMap,M=I.createTreeWalker(I,129);function ws(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return Fe!==void 0?Fe.createHTML(t):t}const Tr=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":"",o=nt;for(let l=0;l<e;l++){const a=i[l];let p,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===nt?f[1]==="!--"?o=Be:f[1]!==void 0?o=qe:f[2]!==void 0?(Es.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=r??nt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?N:f[3]==='"'?We:Ve):o===We||o===Ve?o=N:o===Be||o===qe?o=nt:(o=N,r=void 0);const h=o===N&&i[l+1].startsWith("/>")?" ":"";n+=o===nt?a+Cr:u>=0?(s.push(p),a.slice(0,u)+$s+a.slice(u)+P+h):a+P+(u===-2?l:h)}return[ws(i,n+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};let le=class xs{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=Tr(t,e);if(this.el=xs.createElement(p,s),M.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=M.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith($s)){const c=f[o++],h=r.getAttribute(u).split(P),d=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:d[2],strings:h,ctor:d[1]==="."?Ur:d[1]==="?"?Nr:d[1]==="@"?jr:Bt}),r.removeAttribute(u)}else u.startsWith(P)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Es.test(r.tagName)){const u=r.textContent.split(P),c=u.length-1;if(c>0){r.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],ut()),M.nextNode(),a.push({type:2,index:++n});r.append(u[c],ut())}}}else if(r.nodeType===8)if(r.data===bs)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(P,u+1))!==-1;)a.push({type:7,index:n}),u+=P.length-1}n++}}static createElement(t,e){const s=I.createElement("template");return s.innerHTML=t,s}};function X(i,t,e=i,s){var r,n;if(t===Q)return t;let o=s!==void 0?(r=e._$Co)==null?void 0:r[s]:e._$Cl;const l=dt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(i),o._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=o:e._$Cl=o),o!==void 0&&(t=X(i,o._$AS(i,t.values),o,s)),t}let Rr=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??I).importNode(e,!0);M.currentNode=r;let n=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new Ee(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new Mr(n,this,t)),this._$AV.push(p),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=I,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}},Ee=class Ss{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=X(this,t,e),dt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==Q&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):kr(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==$&&dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(I.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:r}=t,n=typeof r=="number"?this._$AC(t):(r.el===void 0&&(r.el=le.createElement(ws(r.h,r.h[0]),this.options)),r);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Rr(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=Ge.get(t.strings);return e===void 0&&Ge.set(t.strings,e=new le(t)),e}k(t){As(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new Ss(this.S(ut()),this.S(ut()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}},Bt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=X(this,t,e,0),o=!dt(t)||t!==this._$AH&&t!==Q,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=X(this,l[s+a],e,a),p===Q&&(p=this._$AH[a]),o||(o=!dt(p)||p!==this._$AH[a]),p===$?t=$:t!==$&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!r&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Ur=class extends Bt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}},Nr=class extends Bt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}},jr=class extends Bt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=X(this,t,e,0)??$)===Q)return;const s=this._$AH,r=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}},Mr=class{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){X(this,t)}};const Ye=kt.litHtmlPolyfillSupport;Ye==null||Ye(le,Ee),(kt.litHtmlVersions??(kt.litHtmlVersions=[])).push("3.1.3");const Lr=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new Ee(t.insertBefore(ut(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let Y=class extends W{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Lr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return Q}};Y._$litElement$=!0,Y.finalized=!0,(Ue=globalThis.litElementHydrateSupport)==null||Ue.call(globalThis,{LitElement:Y});const Ke=globalThis.litElementPolyfillSupport;Ke==null||Ke({LitElement:Y});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.5");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Hr={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:Ae},Ir=(i=Hr,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function Ps(i){return(t,e)=>typeof e=="object"?Ir(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}function zr(i){return i&&i.__esModule&&Object.prototype.hasOwnProperty.call(i,"default")?i.default:i}function Dr(i){throw new Error('Could not dynamically require "'+i+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Cs={};(function(i){var t=function(){var e=function(u,c,h,d){for(h=h||{},d=u.length;d--;h[u[d]]=c);return h},s=[1,9],r=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,d,g,m,y,Wt){var E=y.length-1;switch(m){case 1:return new g.Root({},[y[E-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[y[E-1],y[E]]);break;case 4:case 5:this.$=y[E];break;case 6:this.$=new g.Literal({value:y[E]});break;case 7:this.$=new g.Splat({name:y[E]});break;case 8:this.$=new g.Param({name:y[E]});break;case 9:this.$=new g.Optional({},[y[E-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:r,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:r,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let d=function(g,m){this.message=g,this.hash=m};throw d.prototype=Error,new d(c,h)}},parse:function(c){var h=this,d=[0],g=[null],m=[],y=this.table,Wt="",E=0,Oe=0,qs=2,Te=1,Vs=m.slice.call(arguments,1),v=Object.create(this.lexer),R={yy:{}};for(var Gt in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Gt)&&(R.yy[Gt]=this.yy[Gt]);v.setInput(c,R.yy),R.yy.lexer=v,R.yy.parser=this,typeof v.yylloc>"u"&&(v.yylloc={});var Yt=v.yylloc;m.push(Yt);var Ws=v.options&&v.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Gs=function(){var q;return q=v.lex()||Te,typeof q!="number"&&(q=h.symbols_[q]||q),q},A,U,x,Kt,B={},At,S,Re,Et;;){if(U=d[d.length-1],this.defaultActions[U]?x=this.defaultActions[U]:((A===null||typeof A>"u")&&(A=Gs()),x=y[U]&&y[U][A]),typeof x>"u"||!x.length||!x[0]){var Jt="";Et=[];for(At in y[U])this.terminals_[At]&&At>qs&&Et.push("'"+this.terminals_[At]+"'");v.showPosition?Jt="Parse error on line "+(E+1)+`:
`+v.showPosition()+`
Expecting `+Et.join(", ")+", got '"+(this.terminals_[A]||A)+"'":Jt="Parse error on line "+(E+1)+": Unexpected "+(A==Te?"end of input":"'"+(this.terminals_[A]||A)+"'"),this.parseError(Jt,{text:v.match,token:this.terminals_[A]||A,line:v.yylineno,loc:Yt,expected:Et})}if(x[0]instanceof Array&&x.length>1)throw new Error("Parse Error: multiple actions possible at state: "+U+", token: "+A);switch(x[0]){case 1:d.push(A),g.push(v.yytext),m.push(v.yylloc),d.push(x[1]),A=null,Oe=v.yyleng,Wt=v.yytext,E=v.yylineno,Yt=v.yylloc;break;case 2:if(S=this.productions_[x[1]][1],B.$=g[g.length-S],B._$={first_line:m[m.length-(S||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(S||1)].first_column,last_column:m[m.length-1].last_column},Ws&&(B._$.range=[m[m.length-(S||1)].range[0],m[m.length-1].range[1]]),Kt=this.performAction.apply(B,[Wt,Oe,E,R.yy,x[1],g,m].concat(Vs)),typeof Kt<"u")return Kt;S&&(d=d.slice(0,-1*S*2),g=g.slice(0,-1*S),m=m.slice(0,-1*S)),d.push(this.productions_[x[1]][0]),g.push(B.$),m.push(B._$),Re=y[d[d.length-2]][d[d.length-1]],d.push(Re);break;case 3:return!0}}return!0}},p=function(){var u={EOF:1,parseError:function(h,d){if(this.yy.parser)this.yy.parser.parseError(h,d);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,d=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),d.length-1&&(this.yylineno-=d.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:d?(d.length===g.length?this.yylloc.first_column:0)+g[g.length-d.length].length-d[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var d,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],d=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),d)return d;if(this._backtrack){for(var y in m)this[y]=m[y];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,d,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),y=0;y<m.length;y++)if(d=this._input.match(this.rules[m[y]]),d&&(!h||d[0].length>h[0].length)){if(h=d,g=y,this.options.backtrack_lexer){if(c=this.test_match(d,m[y]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,d,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=p;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof Dr<"u"&&(i.parser=t,i.Parser=t.Parser,i.parse=function(){return t.parse.apply(t,arguments)})})(Cs);function V(i){return function(t,e){return{displayName:i,props:t,children:e||[]}}}var ks={Root:V("Root"),Concat:V("Concat"),Literal:V("Literal"),Splat:V("Splat"),Param:V("Param"),Optional:V("Optional")},Os=Cs.parser;Os.yy=ks;var Fr=Os,Br=Object.keys(ks);function qr(i){return Br.forEach(function(t){if(typeof i[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:i}}var Ts=qr,Vr=Ts,Wr=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Rs(i){this.captures=i.captures,this.re=i.re}Rs.prototype.match=function(i){var t=this.re.exec(i),e={};if(t)return this.captures.forEach(function(s,r){typeof t[r+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[r+1])}),e};var Gr=Vr({Concat:function(i){return i.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(i){return{re:i.props.value.replace(Wr,"\\$&"),captures:[]}},Splat:function(i){return{re:"([^?]*?)",captures:[i.props.name]}},Param:function(i){return{re:"([^\\/\\?]+)",captures:[i.props.name]}},Optional:function(i){var t=this.visit(i.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(i){var t=this.visit(i.children[0]);return new Rs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Yr=Gr,Kr=Ts,Jr=Kr({Concat:function(i,t){var e=i.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(i){return decodeURI(i.props.value)},Splat:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Param:function(i,t){return t[i.props.name]?t[i.props.name]:!1},Optional:function(i,t){var e=this.visit(i.children[0],t);return e||""},Root:function(i,t){t=t||{};var e=this.visit(i.children[0],t);return e?encodeURI(e):!1}}),Zr=Jr,Qr=Fr,Xr=Yr,ti=Zr;vt.prototype=Object.create(null);vt.prototype.match=function(i){var t=Xr.visit(this.ast),e=t.match(i);return e||!1};vt.prototype.reverse=function(i){return ti.visit(this.ast,i)};function vt(i){var t;if(this?t=this:t=Object.create(vt.prototype),typeof i>"u")throw new Error("A route spec is required");return t.spec=i,t.ast=Qr.parse(i),t}var ei=vt,si=ei,ri=si;const ii=zr(ri);var ni=Object.defineProperty,oi=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&ni(t,e,r),r};class Tt extends Y{constructor(t,e){super(),this._cases=[],this._fallback=()=>Xt`
      <h1>Not Found</h1>
    `,this._cases=t.map(s=>({...s,route:new ii(s.path)})),this._historyObserver=new _t(this,e)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match),Xt`
      <main>${(()=>{if(this._match){if("view"in this._match)return this._match.view(this._match.params||{});if("redirect"in this._match){const e=this._match.redirect;if(typeof e=="string")return this.redirect(e),Xt`
              <h1>Redirecting to ${e}…</h1>
            `}}return this._fallback({})})()}</main>
    `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,r=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:r}}}redirect(t){ye(this,"history/redirect",{href:t})}}Tt.styles=vr`
    :host,
    main {
      display: contents;
    }
  `;oi([Ps()],Tt.prototype,"_match");const ai=Object.freeze(Object.defineProperty({__proto__:null,Element:Tt,Switch:Tt},Symbol.toStringTag,{value:"Module"})),Us=class Ns extends HTMLElement{constructor(){if(super(),Ft(Ns.template).attach(this),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Us.template=yt`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;let li=Us;const ci=Object.freeze(Object.defineProperty({__proto__:null,Element:li},Symbol.toStringTag,{value:"Module"})),hi=class js extends HTMLElement{constructor(){super(),this._array=[],Ft(js.template).attach(this),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ms("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),r=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=r,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{oe(t,"button.add")?Pt(t,"input-array:add"):oe(t,"button.remove")&&Pt(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],ui(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};hi.template=yt`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style>
          :host {
            display: contents;
          }
          ul {
            display: contents;
          }
          button.add {
            grid-column: input / input-end;
          }
          ::slotted(label) {
            display: contents;
          }
        </style>
      </button>
    </template>
  `;function ui(i,t){t.replaceChildren(),i.forEach((e,s)=>t.append(Ms(e)))}function Ms(i,t){const e=i===void 0?"":`value="${i}"`;return yt`
    <label>
      <input ${e} />
      <button class="remove" type="button">Remove</button>
    </label>
  `}function T(i){return Object.entries(i).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var di=Object.defineProperty,pi=Object.getOwnPropertyDescriptor,fi=(i,t,e,s)=>{for(var r=pi(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&di(t,e,r),r};class rt extends Y{constructor(t){super(),this._pending=[],this._observer=new _t(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,r])=>{console.log("Dispatching queued event",r,s),s.dispatchEvent(r)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}fi([Ps()],rt.prototype,"model");const mi={};function gi(i,t,e){switch(i[0]){case"game/create":yi(i[1],e).then(r=>t(n=>({...n,game:r})));break;case"game/select":_i(i[1],e).then(r=>t(n=>({...n,game:r})));break;case"game/all":vi(i[1],e).then(r=>t(n=>({...n,games:r})));break;case"game/addRound":$i(i[1],e).then(r=>t(n=>({...n,game:r})));break;default:const s=i[0];throw new Error(`Unhandled Auth message "${s}"`)}}function yi(i,t){return fetch("/api/games",{method:"POST",headers:{"Content-Type":"application/json",...gt.headers(t)},body:JSON.stringify(i.game)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function _i(i,t){return fetch(`/api/games/${i.GameId}`,{method:"GET",headers:gt.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function vi(i,t){return fetch("/api/games",{method:"GET",headers:{"Content-Type":"application/json",...gt.headers(t)}}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}function $i(i,t){return fetch(`/api/games/${i.GameId}`,{method:"POST",headers:{"Content-Type":"application/json",...gt.headers(t)},body:JSON.stringify(i.round)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return e})}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,we=xt.ShadowRoot&&(xt.ShadyCSS===void 0||xt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,xe=Symbol(),Je=new WeakMap;let Ls=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==xe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(we&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Je.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Je.set(e,t))}return t}toString(){return this.cssText}};const bi=i=>new Ls(typeof i=="string"?i:i+"",void 0,xe),F=(i,...t)=>{const e=i.length===1?i[0]:t.reduce((s,r,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+i[n+1],i[0]);return new Ls(e,i,xe)},Ai=(i,t)=>{if(we)i.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),r=xt.litNonce;r!==void 0&&s.setAttribute("nonce",r),s.textContent=e.cssText,i.appendChild(s)}},Ze=we?i=>i:i=>i instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return bi(e)})(i):i;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ei,defineProperty:wi,getOwnPropertyDescriptor:xi,getOwnPropertyNames:Si,getOwnPropertySymbols:Pi,getPrototypeOf:Ci}=Object,k=globalThis,Qe=k.trustedTypes,ki=Qe?Qe.emptyScript:"",te=k.reactiveElementPolyfillSupport,ct=(i,t)=>i,Rt={toAttribute(i,t){switch(t){case Boolean:i=i?ki:null;break;case Object:case Array:i=i==null?i:JSON.stringify(i)}return i},fromAttribute(i,t){let e=i;switch(t){case Boolean:e=i!==null;break;case Number:e=i===null?null:Number(i);break;case Object:case Array:try{e=JSON.parse(i)}catch{e=null}}return e}},Se=(i,t)=>!Ei(i,t),Xe={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:Se};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),k.litPropertyMetadata??(k.litPropertyMetadata=new WeakMap);class G extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Xe){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),r=this.getPropertyDescriptor(t,s,e);r!==void 0&&wi(this.prototype,t,r)}}static getPropertyDescriptor(t,e,s){const{get:r,set:n}=xi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return r==null?void 0:r.call(this)},set(o){const l=r==null?void 0:r.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Xe}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=Ci(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,s=[...Si(e),...Pi(e)];for(const r of s)this.createProperty(r,e[r])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,r]of e)this.elementProperties.set(s,r)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const r=this._$Eu(e,s);r!==void 0&&this._$Eh.set(r,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const r of s)e.unshift(Ze(r))}else t!==void 0&&e.push(Ze(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ai(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),r=this.constructor._$Eu(t,s);if(r!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Rt).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(r):this.setAttribute(r,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,r=s._$Eh.get(t);if(r!==void 0&&this._$Em!==r){const o=s.getPropertyOptions(r),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Rt;this._$Em=r,this[r]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??Se)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const r=this.constructor.elementProperties;if(r.size>0)for(const[n,o]of r)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(r=>{var n;return(n=r.hostUpdate)==null?void 0:n.call(r)}),this.update(e)):this._$EU()}catch(r){throw t=!1,this._$EU(),r}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var r;return(r=s.hostUpdated)==null?void 0:r.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}G.elementStyles=[],G.shadowRootOptions={mode:"open"},G[ct("elementProperties")]=new Map,G[ct("finalized")]=new Map,te==null||te({ReactiveElement:G}),(k.reactiveElementVersions??(k.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=globalThis,Ut=ht.trustedTypes,ts=Ut?Ut.createPolicy("lit-html",{createHTML:i=>i}):void 0,Hs="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Is="?"+C,Oi=`<${Is}>`,z=document,pt=()=>z.createComment(""),ft=i=>i===null||typeof i!="object"&&typeof i!="function",zs=Array.isArray,Ti=i=>zs(i)||typeof(i==null?void 0:i[Symbol.iterator])=="function",ee=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,es=/-->/g,ss=/>/g,j=RegExp(`>|${ee}(?:([^\\s"'>=/]+)(${ee}*=${ee}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),rs=/'/g,is=/"/g,Ds=/^(?:script|style|textarea|title)$/i,Ri=i=>(t,...e)=>({_$litType$:i,strings:t,values:e}),_=Ri(1),tt=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),ns=new WeakMap,L=z.createTreeWalker(z,129);function Fs(i,t){if(!Array.isArray(i)||!i.hasOwnProperty("raw"))throw Error("invalid template strings array");return ts!==void 0?ts.createHTML(t):t}const Ui=(i,t)=>{const e=i.length-1,s=[];let r,n=t===2?"<svg>":"",o=ot;for(let l=0;l<e;l++){const a=i[l];let p,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ot?f[1]==="!--"?o=es:f[1]!==void 0?o=ss:f[2]!==void 0?(Ds.test(f[2])&&(r=RegExp("</"+f[2],"g")),o=j):f[3]!==void 0&&(o=j):o===j?f[0]===">"?(o=r??ot,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,p=f[1],o=f[3]===void 0?j:f[3]==='"'?is:rs):o===is||o===rs?o=j:o===es||o===ss?o=ot:(o=j,r=void 0);const h=o===j&&i[l+1].startsWith("/>")?" ":"";n+=o===ot?a+Oi:u>=0?(s.push(p),a.slice(0,u)+Hs+a.slice(u)+C+h):a+C+(u===-2?l:h)}return[Fs(i,n+(i[e]||"<?>")+(t===2?"</svg>":"")),s]};class mt{constructor({strings:t,_$litType$:e},s){let r;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[p,f]=Ui(t,e);if(this.el=mt.createElement(p,s),L.currentNode=this.el.content,e===2){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=L.nextNode())!==null&&a.length<l;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(Hs)){const c=f[o++],h=r.getAttribute(u).split(C),d=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:d[2],strings:h,ctor:d[1]==="."?ji:d[1]==="?"?Mi:d[1]==="@"?Li:qt}),r.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:n}),r.removeAttribute(u));if(Ds.test(r.tagName)){const u=r.textContent.split(C),c=u.length-1;if(c>0){r.textContent=Ut?Ut.emptyScript:"";for(let h=0;h<c;h++)r.append(u[h],pt()),L.nextNode(),a.push({type:2,index:++n});r.append(u[c],pt())}}}else if(r.nodeType===8)if(r.data===Is)a.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:n}),u+=C.length-1}n++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function et(i,t,e=i,s){var o,l;if(t===tt)return t;let r=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=ft(t)?void 0:t._$litDirective$;return(r==null?void 0:r.constructor)!==n&&((l=r==null?void 0:r._$AO)==null||l.call(r,!1),n===void 0?r=void 0:(r=new n(i),r._$AT(i,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=r:e._$Cl=r),r!==void 0&&(t=et(i,r._$AS(i,t.values),r,s)),t}class Ni{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,r=((t==null?void 0:t.creationScope)??z).importNode(e,!0);L.currentNode=r;let n=L.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let p;a.type===2?p=new $t(n,n.nextSibling,this,t):a.type===1?p=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(p=new Hi(n,this,t)),this._$AV.push(p),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=L.nextNode(),o++)}return L.currentNode=z,r}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class $t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,r){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=r,this._$Cv=(r==null?void 0:r.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=et(this,t,e),ft(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==tt&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ti(t)?this.k(t):this._(t)}S(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.S(t))}_(t){this._$AH!==b&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,r=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=mt.createElement(Fs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===r)this._$AH.p(e);else{const o=new Ni(r,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=ns.get(t.strings);return e===void 0&&ns.set(t.strings,e=new mt(t)),e}k(t){zs(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,r=0;for(const n of t)r===e.length?e.push(s=new $t(this.S(pt()),this.S(pt()),this,this.options)):s=e[r],s._$AI(n),r++;r<e.length&&(this._$AR(s&&s._$AB.nextSibling,r),e.length=r)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const r=t.nextSibling;t.remove(),t=r}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class qt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,r,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=r,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,r){const n=this.strings;let o=!1;if(n===void 0)t=et(this,t,e,0),o=!ft(t)||t!==this._$AH&&t!==tt,o&&(this._$AH=t);else{const l=t;let a,p;for(t=n[0],a=0;a<n.length-1;a++)p=et(this,l[s+a],e,a),p===tt&&(p=this._$AH[a]),o||(o=!ft(p)||p!==this._$AH[a]),p===b?t=b:t!==b&&(t+=(p??"")+n[a+1]),this._$AH[a]=p}o&&!r&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class ji extends qt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Mi extends qt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Li extends qt{constructor(t,e,s,r,n){super(t,e,s,r,n),this.type=5}_$AI(t,e=this){if((t=et(this,t,e,0)??b)===tt)return;const s=this._$AH,r=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||r);r&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Hi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){et(this,t)}}const se=ht.litHtmlPolyfillSupport;se==null||se(mt,$t),(ht.litHtmlVersions??(ht.litHtmlVersions=[])).push("3.1.4");const Ii=(i,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let r=s._$litPart$;if(r===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=r=new $t(t.insertBefore(pt(),n),n,void 0,e??{})}return r._$AI(i),r};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */class H extends G{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Ii(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return tt}}var os;H._$litElement$=!0,H.finalized=!0,(os=globalThis.litElementHydrateSupport)==null||os.call(globalThis,{LitElement:H});const re=globalThis.litElementPolyfillSupport;re==null||re({LitElement:H});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.0.6");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const zi={attribute:!0,type:String,converter:Rt,reflect:!1,hasChanged:Se},Di=(i=zi,t,e)=>{const{kind:s,metadata:r}=e;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),n.set(e.name,i),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,i)},init(l){return l!==void 0&&this.P(o,void 0,i),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,i)}}throw Error("Unsupported decorator location: "+s)};function w(i){return(t,e)=>typeof e=="object"?Di(i,t,e):((s,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(r,n):void 0})(i,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Bs(i){return w({...i,state:!0,attribute:!1})}var Fi=Object.defineProperty,Bi=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Fi(t,e,r),r};const Mt=class Mt extends H{constructor(){super(...arguments),this.username="anonymous",this._authObserver=new _t(this,"majoogs:auth")}render(){return _`
      <header>
      <head>
      <link rel="stylesheet" href="../../styles/index.css">
      <link rel="stylesheet" href="../../styles/reset.css">
      <link rel="stylesheet" href="../../styles/tokens.css">
      </head>
      <header class="topbar">    
        <a href="/app" style="text-decoration:none">Minefield Mahjong!</a>
        <drop-down class="czechbox">
          <a  class="red" slot="actuator">Welcome, ${this.username}</a>

          <ul style="  list-style-type: none;">

          <li>
        <label class="czechbox2"
        @change=${qi}>
        <input type="checkbox" autocomplete="off"/>
        Dark Mode
        </label>
        </li>

          <li>
        <label class="czechbox2">
        <a class= "czechbox2" style="text-decoration:none" href="/app/login">${this.username=="anonymous"?_`Log In`:_`<a @click=${Vi}>Sign Out</a>`} </a>
        </label>
        </li>
          </ul>


      </drop-down>
        </header>


      </header>
    `}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(console.log("HELP"),this.username=t.username)})}};Mt.uses=T({"drop-down":ci.Element}),Mt.styles=F`

a.red{
  color:rgb(168,0,0);
}

.czechbox{

    color:rgb(168,0,0);
    font-size: 20px;
    text-align: right;
    border-radius: 10px;
    position: absolute;
    right: 10px;
    top: 10px;
    padding: 5px 10px;
    background-color: #383838;
    white-space: nowrap; 

    
}

.czechbox2{

    color:rgb(168,0,0);
    font-size: 20px;
    text-align: center;
    border-radius: 5px;
    right: 0px;
    top: 10px;
    padding: 5px 5px;
    background-color: #383838;
    white-space: nowrap; 
    margin: 0px 0px;    
}

  .topbar{
  font-size: 50px;
  height: 15vh;
  background-color: var(--color-background-header);
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--color-text-header); 
  }

  `;let Nt=Mt;Bi([w()],Nt.prototype,"username");function qi(i){const e=i.target.checked;fe.relay(i,"dark-mode",{checked:e})}function Vi(i){fe.relay(i,"auth:message",["auth/signout"])}var Wi=Object.defineProperty,Pe=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Wi(t,e,r),r};const Ce=class Ce extends H{constructor(){super(...arguments),this.people=[],this.a=0}render(){return _`
  <mu-form .init=${this.init}>
  <label>
    <span> ${this.people[0]}</span>
    <input name="${this.people[0]}"  type= "number" autocomplete="off" />
  </label>
  <label>
    <span>${this.people[1]}</span>
    <input name="${this.people[1]}"  type= "number" autocomplete="off" />
  </label>
  <label>
    <span>${this.people[2]}</span>
    <input name="${this.people[2]}"  type= "number" autocomplete="off" />
  </label>
  <label>
    <span>${this.people[3]}</span>
    <input name="${this.people[3]}"  type= "number" autocomplete="off" />
  </label>
</mu-form>
  
   
    `}};Ce.uses=T({"mu-form":me.Element});let st=Ce;Pe([w()],st.prototype,"init");Pe([w()],st.prototype,"people");Pe([w()],st.prototype,"a");var Gi=Object.defineProperty,Yi=Object.getOwnPropertyDescriptor,Vt=(i,t,e,s)=>{for(var r=s>1?void 0:s?Yi(t,e):t,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=(s?o(t,e,r):o(r))||r);return s&&r&&Gi(t,e,r),r};const Lt=class Lt extends rt{constructor(){super("majoogs:model"),this.gameid=""}get games(){return this.model.games}get game(){return this.model.game}get newRound(){return this.model.newRound}render(){let t=this.game;if(this.newRound,!t)return _`<div>loading...</div>`;const e=t.people.map(s=>[s,t.Scores[s]]);return _`
                <game-object
                    name="${t.id}"
                    .players="${e}"
                    .people="${t.people}"
                    .scores="${t.Scores}"
                ></game-object>
            
  

<box>
  
    ${t.Rounds.map(s=>_`
      <box_footer>
        ${Object.keys(s.RoundWinnings).map(r=>_`
        <playerbox>
        ${r} : ${s.RoundWinnings[r]}
    </playerbox>
        `)}
        </box_footer>
`)}
</box>


<box>
<box style="background:orange"> + Add a Round</box>
     <add-round
      .init=${this.newRound}
      .people=${t.people}
      @mu-form:submit=${s=>this._handleSubmit(s)}></add-round>
</box>




    `}connectedCallback(){super.connectedCallback()}_handleSubmit(t){console.log("HERE"),console.log("ME",t.detail.a);const e={Winner:"RoundOne",RoundWinnings:this.game.people.map(s=>[s,t.detail[s]?parseInt(t.detail[s]):0]),Scores:this.game.people.map(s=>{var r;return[s,parseInt((r=this.game)==null?void 0:r.Scores[s])+(t.detail[s]?parseInt(t.detail[s]):0)]})};this.dispatchMessage(["game/addRound",{GameId:this.gameid,round:e}])}attributeChangedCallback(t,e,s){console.log("Routine Page Attribute Changed",t,e,s),t==="game-id"&&e!==s&&s&&(console.log("DISPATCHING"),this.dispatchMessage(["game/select",{GameId:s}])),super.attributeChangedCallback(t,e,s)}};Lt.uses=T({"mu-form":me.Element,"add-round":st}),Lt.styles=F`

    a{
      text-decoration: none;
    }


    box {
      text-align: center;
    font-size: 30px;
    display: block;
    align-items: center;
    margin: 20px;
    width:auto;
    border:solid 7px var(--color-border);
    color: var(--color-text-header);
    font-family:"Courier New Bold", monospace;
    flex-direction: column; //trigger for this to switch between
    }


    box_footer {
        align-self: center;
        display: flex;
      }

    playerbox{
        font-size: 30px;
    justify-content: center;
    text-align: center;
    align-items: center;
    padding: 50px 20px;
    width:25%;
    border:solid 7px var(--color-border);
    }

  `;let D=Lt;Vt([w({attribute:"game-id",reflect:!0})],D.prototype,"gameid",2);Vt([w()],D.prototype,"games",1);Vt([Bs()],D.prototype,"game",1);Vt([Bs()],D.prototype,"newRound",1);const Ht=class Ht extends rt{render(){return _`
    <h2>Create a New Game</h2>
<p>Keep track of your scores with your friends!</p>
<restful-form new src="/api/games/">
  <label>
    <span>Game Name</span>
    <input name="id" autocomplete="off" />
  </label>
  <label>
    <span>Player 1:</span>
    <input name="player1" autocomplete="off" />
  </label>
  <label>
    <span>Player 2:</span>
    <input name="player2" autocomplete="off" />
  </label>
  <label>
    <span>Player 3:</span>
    <input name="player3"  autocomplete="off" />
  </label>
  <label>
    <span>Player 4:</span>
    <input name="player4" autocomplete="off" />
  </label>
</restful-form>
  
   
    `}constructor(){super("majoogs:model")}connectedCallback(){super.connectedCallback()}};Ht.uses=T({"restful-form":ve.FormElement,"mu-form":me.Element}),Ht.styles=F`
  h2{
    color: var(--color-text-header);
  }
  p{
    color: var(--color-text-header);
  }
  span{
    color: var(--color-text-header);
  }
  `;let ce=Ht;const It=class It extends rt{render(){return _`
    <h1>Register</h1>
    <restful-form new src="/auth/register">
    <label>
    <span>Username:</span>
    <input name="username" autocomplete="off" />
  </label>
  <label>
    <span>Password:</span>
    <input type="password" name="password" />
  </label>
  </restful-form>
  <p>Already signed up? Then you can
        <a href="/app/login">log in</a> instead.</p>
    `}constructor(){super("majoogs:model")}connectedCallback(){super.connectedCallback()}};It.uses=T({"restful-form":ve.FormElement}),It.styles=F`
  `;let he=It;const zt=class zt extends rt{render(){return _`
    <h1>Login</h1>
    <restful-form new src="/auth/login">
    <label>
    <span>Username:</span>
    <input name="username" autocomplete="off" />
  </label>
  <label>
    <span>Password:</span>
    <input type="password" name="password" />
  </label>
  </restful-form>
    <a href="/app/register">Register here if you haven't yet!</a>
    `}get next(){return new URLSearchParams(document.location.search).get("next")}constructor(){super("majoogs:model"),this.addEventListener("mu-rest-form:created",t=>{const e=t.detail,{token:s}=e.created,r=this.next||"/";console.log("Login successful",e,r),fe.relay(t,"auth:message",["auth/signin",{token:s,redirect:r}])})}connectedCallback(){super.connectedCallback()}};zt.uses=T({"restful-form":ve.FormElement}),zt.styles=F`
    h1{
    color: var(--color-text-header);
  }
  span{
    color: var(--color-text-header);
  }
  `;let ue=zt;var Ki=Object.defineProperty,bt=(i,t,e,s)=>{for(var r=void 0,n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ki(t,e,r),r};const ke=class ke extends H{constructor(){super(...arguments),this.summary="",this.name="",this.scores=[],this.people=[],this.players=[]}render(){return _`
      <a href="/app/game/${this.name}">
      <box>
      <h1>${this.name}</h1>
      <box_footer>
      ${this.players.map(t=>_`
        <playerbox>
          ${t[0]} 
          <br>
          ${t[1]} 
        </playerbox>`)}
        <box_footer>
    </box>
    </a>
      `}};ke.styles=F`

    a{
      color: var(--color-text-header);
      text-decoration: none;
    }

    box {
      text-align: center;
    font-size: 30px;
    display: block;
    align-items: center;
    margin: 20px;
    width:auto;
    border:solid 7px var(--color-border);
    font-family:"Courier New Bold", monospace;
    flex-direction: column; //trigger for this to switch between
    }


    box_footer {
        align-self: center;
        display: flex;
      }

    playerbox{
        font-size: 30px;
    justify-content: center;
    text-align: center;
    align-items: center;
    padding: 50px 20px;
    margin: 20px;
    width:20%;
    border:solid 7px var(--color-border);
    }

    `;let O=ke;bt([w()],O.prototype,"summary");bt([w()],O.prototype,"name");bt([w()],O.prototype,"scores");bt([w()],O.prototype,"people");bt([w()],O.prototype,"players");var Ji=Object.defineProperty,Zi=Object.getOwnPropertyDescriptor,Qi=(i,t,e,s)=>{for(var r=Zi(t,e),n=i.length-1,o;n>=0;n--)(o=i[n])&&(r=o(t,e,r)||r);return r&&Ji(t,e,r),r};const Dt=class Dt extends rt{get games(){return console.log(this.model),this.model.games}constructor(){super("majoogs:model")}render(){var t;return _`
        ${(t=this.games)==null?void 0:t.map(e=>{const s=e.people.map(r=>[r,e.Scores[r]]);return _`
                <game-object
                    name="${e.id}"
                    .players="${s}"
                    .people="${e.people}"
                    .scores="${e.Scores}"
                ></game-object>
            `})}
  
      <a href="/app/createGame" >
        <box> + Create a New Game! 
          </box>
        </a>
    `}connectedCallback(){super.connectedCallback(),this.dispatchMessage(["game/all",{}]),console.log("wedidit"),console.log(this.model)}};Dt.uses=T({"game-object":O}),Dt.styles=F`
    box {
      text-align: center;
    font-size: 30px;
    display: block;
    align-items: center;
    margin: 20px;
    width:auto;
    border:solid 7px var(--color-border);
    font-family:"Courier New Bold", monospace;
    flex-direction: column; //trigger for this to switch between
    }  `;let jt=Dt;Qi([w()],jt.prototype,"games");const Xi=[{path:"/app/createGame",view:()=>_`
    <create-view></create-view>`},{path:"/app/game/:id",view:i=>_`
    <game-view game-id=${i.id}></game-view>`},{path:"/app/login",view:()=>_`
    <login-view></login-view>`},{path:"/app/register",view:()=>_`
  <signup-view></signup-view>`},{path:"/app",view:()=>_`
    <multi-view></multi-view>`},{path:"/",redirect:"/app"}];T({"mu-auth":gt.Provider,"mu-store":class extends yr.Provider{constructor(){super(gi,mi,"majoogs:auth")}},"mu-history":pr.Provider,"mu-switch":class extends ai.Element{constructor(){super(Xi,"majoogs:history")}},"top-nav":Nt,"game-view":D,"create-view":ce,"signup-view":he,"login-view":ue,"multi-view":jt});function tn(i,t){i.classList.toggle("dark-mode",t)}document.body.addEventListener("dark-mode",i=>tn(i.currentTarget,i.detail.checked));
