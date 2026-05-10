import{_ as T,aL as Tn,bL as $t,$ as ie,bh as q,aM as a,bA as ae,dt as Ve,aY as oe,ab as Ia,ae as er,a6 as Aa,N as yi,V as Mt,bC as Le,cl as Da,a0 as it,cd as Ra,ca as _i,bB as se,bd as ve,aK as Nt,aa as ce,c0 as wa,a1 as Bt,P as k,ao as Ti,a3 as xi,aJ as xr,bK as nt,aO as Ba,a2 as J,X as Dt,du as Ci,dv as Fn,dw as Si,dl as Ei,b9 as $e,O as Fa,be as xn,ba as Ii,bb as Ai,bc as Di,b0 as Ri,aN as wi,d4 as Pn,dx as Ln,c8 as Bi,D as Fi,bR as On,f as ze,a as fe,c as Ke,bi as Mn}from"./indexed-DesBQazi.js";import"./builder-8k0w3ba1.js";import{i as Nn,C as he,a as Pi,d as Pa,j as Li,c as Cn,k as Oi,l as Rt}from"./color-CQmHOeVe.js";var tn=function(e,t){return tn=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(r,n){r.__proto__=n}||function(r,n){for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(r[i]=n[i])},tn(e,t)};function wr(e,t){if(typeof t!="function"&&t!==null)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");tn(e,t);function r(){this.constructor=e}e.prototype=t===null?Object.create(t):(r.prototype=t.prototype,new r)}function Nd(e,t,r,n){function i(s){return s instanceof r?s:new r(function(u){u(s)})}return new(r||(r=Promise))(function(s,u){function p(h){try{v(n.next(h))}catch(y){u(y)}}function m(h){try{v(n.throw(h))}catch(y){u(y)}}function v(h){h.done?s(h.value):i(h.value).then(p,m)}v((n=n.apply(e,t||[])).next())})}function Gd(e,t){var r={label:0,sent:function(){if(s[0]&1)throw s[1];return s[1]},trys:[],ops:[]},n,i,s,u=Object.create((typeof Iterator=="function"?Iterator:Object).prototype);return u.next=p(0),u.throw=p(1),u.return=p(2),typeof Symbol=="function"&&(u[Symbol.iterator]=function(){return this}),u;function p(v){return function(h){return m([v,h])}}function m(v){if(n)throw new TypeError("Generator is already executing.");for(;u&&(u=0,v[0]&&(r=0)),r;)try{if(n=1,i&&(s=v[0]&2?i.return:v[0]?i.throw||((s=i.return)&&s.call(i),0):i.next)&&!(s=s.call(i,v[1])).done)return s;switch(i=0,s&&(v=[v[0]&2,s.value]),v[0]){case 0:case 1:s=v;break;case 4:return r.label++,{value:v[1],done:!1};case 5:r.label++,i=v[1],v=[0];continue;case 7:v=r.ops.pop(),r.trys.pop();continue;default:if(s=r.trys,!(s=s.length>0&&s[s.length-1])&&(v[0]===6||v[0]===2)){r=0;continue}if(v[0]===3&&(!s||v[1]>s[0]&&v[1]<s[3])){r.label=v[1];break}if(v[0]===6&&r.label<s[1]){r.label=s[1],s=v;break}if(s&&r.label<s[2]){r.label=s[2],r.ops.push(v);break}s[2]&&r.ops.pop(),r.trys.pop();continue}v=t.call(e,r)}catch(h){v=[6,h],i=0}finally{n=s=0}if(v[0]&5)throw v[1];return{value:v[0]?v[1]:void 0,done:!0}}}function Yt(e){var t=typeof Symbol=="function"&&Symbol.iterator,r=t&&e[t],n=0;if(r)return r.call(e);if(e&&typeof e.length=="number")return{next:function(){return e&&n>=e.length&&(e=void 0),{value:e&&e[n++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function rn(e,t){var r=typeof Symbol=="function"&&e[Symbol.iterator];if(!r)return e;var n=r.call(e),i,s=[],u;try{for(;(t===void 0||t-- >0)&&!(i=n.next()).done;)s.push(i.value)}catch(p){u={error:p}}finally{try{i&&!i.done&&(r=n.return)&&r.call(n)}finally{if(u)throw u.error}}return s}function nn(e,t,r){if(r||arguments.length===2)for(var n=0,i=t.length,s;n<i;n++)(s||!(n in t))&&(s||(s=Array.prototype.slice.call(t,0,n)),s[n]=t[n]);return e.concat(s||Array.prototype.slice.call(t))}function an(e){return this instanceof an?(this.v=e,this):new an(e)}function kd(e,t,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var n=r.apply(e,t||[]),i,s=[];return i=Object.create((typeof AsyncIterator=="function"?AsyncIterator:Object).prototype),p("next"),p("throw"),p("return",u),i[Symbol.asyncIterator]=function(){return this},i;function u(f){return function(c){return Promise.resolve(c).then(f,y)}}function p(f,c){n[f]&&(i[f]=function(o){return new Promise(function(d,g){s.push([f,o,d,g])>1||m(f,o)})},c&&(i[f]=c(i[f])))}function m(f,c){try{v(n[f](c))}catch(o){x(s[0][3],o)}}function v(f){f.value instanceof an?Promise.resolve(f.value.v).then(h,y):x(s[0][2],f)}function h(f){m("next",f)}function y(f){m("throw",f)}function x(f,c){f(c),s.shift(),s.length&&m(s[0][0],s[0][1])}}function Vd(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t=e[Symbol.asyncIterator],r;return t?t.call(e):(e=typeof Yt=="function"?Yt(e):e[Symbol.iterator](),r={},n("next"),n("throw"),n("return"),r[Symbol.asyncIterator]=function(){return this},r);function n(s){r[s]=e[s]&&function(u){return new Promise(function(p,m){u=e[s](u),i(p,m,u.done,u.value)})}}function i(s,u,p,m){Promise.resolve(m).then(function(v){s({value:v,done:p})},u)}}function at(e){return typeof e=="function"}function La(e){var t=function(n){Error.call(n),n.stack=new Error().stack},r=e(t);return r.prototype=Object.create(Error.prototype),r.prototype.constructor=r,r}var Nr=La(function(e){return function(r){e(this),this.message=r?r.length+` errors occurred during unsubscription:
`+r.map(function(n,i){return i+1+") "+n.toString()}).join(`
  `):"",this.name="UnsubscriptionError",this.errors=r}});function on(e,t){if(e){var r=e.indexOf(t);0<=r&&e.splice(r,1)}}var Br=(function(){function e(t){this.initialTeardown=t,this.closed=!1,this._parentage=null,this._finalizers=null}return e.prototype.unsubscribe=function(){var t,r,n,i,s;if(!this.closed){this.closed=!0;var u=this._parentage;if(u)if(this._parentage=null,Array.isArray(u))try{for(var p=Yt(u),m=p.next();!m.done;m=p.next()){var v=m.value;v.remove(this)}}catch(o){t={error:o}}finally{try{m&&!m.done&&(r=p.return)&&r.call(p)}finally{if(t)throw t.error}}else u.remove(this);var h=this.initialTeardown;if(at(h))try{h()}catch(o){s=o instanceof Nr?o.errors:[o]}var y=this._finalizers;if(y){this._finalizers=null;try{for(var x=Yt(y),f=x.next();!f.done;f=x.next()){var c=f.value;try{Gn(c)}catch(o){s=s??[],o instanceof Nr?s=nn(nn([],rn(s)),rn(o.errors)):s.push(o)}}}catch(o){n={error:o}}finally{try{f&&!f.done&&(i=x.return)&&i.call(x)}finally{if(n)throw n.error}}}if(s)throw new Nr(s)}},e.prototype.add=function(t){var r;if(t&&t!==this)if(this.closed)Gn(t);else{if(t instanceof e){if(t.closed||t._hasParent(this))return;t._addParent(this)}(this._finalizers=(r=this._finalizers)!==null&&r!==void 0?r:[]).push(t)}},e.prototype._hasParent=function(t){var r=this._parentage;return r===t||Array.isArray(r)&&r.includes(t)},e.prototype._addParent=function(t){var r=this._parentage;this._parentage=Array.isArray(r)?(r.push(t),r):r?[r,t]:t},e.prototype._removeParent=function(t){var r=this._parentage;r===t?this._parentage=null:Array.isArray(r)&&on(r,t)},e.prototype.remove=function(t){var r=this._finalizers;r&&on(r,t),t instanceof e&&t._removeParent(this)},e.EMPTY=(function(){var t=new e;return t.closed=!0,t})(),e})(),Oa=Br.EMPTY;function Ma(e){return e instanceof Br||e&&"closed"in e&&at(e.remove)&&at(e.add)&&at(e.unsubscribe)}function Gn(e){at(e)?e():e.unsubscribe()}var Mi={Promise:void 0},Ni={setTimeout:function(e,t){for(var r=[],n=2;n<arguments.length;n++)r[n-2]=arguments[n];return setTimeout.apply(void 0,nn([e,t],rn(r)))},clearTimeout:function(e){return clearTimeout(e)},delegate:void 0};function Gi(e){Ni.setTimeout(function(){throw e})}function kn(){}function br(e){e()}var Na=(function(e){wr(t,e);function t(r){var n=e.call(this)||this;return n.isStopped=!1,r?(n.destination=r,Ma(r)&&r.add(n)):n.destination=zi,n}return t.create=function(r,n,i){return new sn(r,n,i)},t.prototype.next=function(r){this.isStopped||this._next(r)},t.prototype.error=function(r){this.isStopped||(this.isStopped=!0,this._error(r))},t.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},t.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,e.prototype.unsubscribe.call(this),this.destination=null)},t.prototype._next=function(r){this.destination.next(r)},t.prototype._error=function(r){try{this.destination.error(r)}finally{this.unsubscribe()}},t.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},t})(Br),ki=(function(){function e(t){this.partialObserver=t}return e.prototype.next=function(t){var r=this.partialObserver;if(r.next)try{r.next(t)}catch(n){ur(n)}},e.prototype.error=function(t){var r=this.partialObserver;if(r.error)try{r.error(t)}catch(n){ur(n)}else ur(t)},e.prototype.complete=function(){var t=this.partialObserver;if(t.complete)try{t.complete()}catch(r){ur(r)}},e})(),sn=(function(e){wr(t,e);function t(r,n,i){var s=e.call(this)||this,u;return at(r)||!r?u={next:r??void 0,error:n??void 0,complete:i??void 0}:u=r,s.destination=new ki(u),s}return t})(Na);function ur(e){Gi(e)}function Vi(e){throw e}var zi={closed:!0,next:kn,error:Vi,complete:kn},Ui=(function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"})();function ji(e){return e}function qi(e){return e.length===0?ji:e.length===1?e[0]:function(r){return e.reduce(function(n,i){return i(n)},r)}}var Vn=(function(){function e(t){t&&(this._subscribe=t)}return e.prototype.lift=function(t){var r=new e;return r.source=this,r.operator=t,r},e.prototype.subscribe=function(t,r,n){var i=this,s=Xi(t)?t:new sn(t,r,n);return br(function(){var u=i,p=u.operator,m=u.source;s.add(p?p.call(s,m):m?i._subscribe(s):i._trySubscribe(s))}),s},e.prototype._trySubscribe=function(t){try{return this._subscribe(t)}catch(r){t.error(r)}},e.prototype.forEach=function(t,r){var n=this;return r=zn(r),new r(function(i,s){var u=new sn({next:function(p){try{t(p)}catch(m){s(m),u.unsubscribe()}},error:s,complete:i});n.subscribe(u)})},e.prototype._subscribe=function(t){var r;return(r=this.source)===null||r===void 0?void 0:r.subscribe(t)},e.prototype[Ui]=function(){return this},e.prototype.pipe=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return qi(t)(this)},e.prototype.toPromise=function(t){var r=this;return t=zn(t),new t(function(n,i){var s;r.subscribe(function(u){return s=u},function(u){return i(u)},function(){return n(s)})})},e.create=function(t){return new e(t)},e})();function zn(e){var t;return(t=e??Mi.Promise)!==null&&t!==void 0?t:Promise}function Wi(e){return e&&at(e.next)&&at(e.error)&&at(e.complete)}function Xi(e){return e&&e instanceof Na||Wi(e)&&Ma(e)}var Hi=La(function(e){return function(){e(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"}}),un=(function(e){wr(t,e);function t(){var r=e.call(this)||this;return r.closed=!1,r.currentObservers=null,r.observers=[],r.isStopped=!1,r.hasError=!1,r.thrownError=null,r}return t.prototype.lift=function(r){var n=new Un(this,this);return n.operator=r,n},t.prototype._throwIfClosed=function(){if(this.closed)throw new Hi},t.prototype.next=function(r){var n=this;br(function(){var i,s;if(n._throwIfClosed(),!n.isStopped){n.currentObservers||(n.currentObservers=Array.from(n.observers));try{for(var u=Yt(n.currentObservers),p=u.next();!p.done;p=u.next()){var m=p.value;m.next(r)}}catch(v){i={error:v}}finally{try{p&&!p.done&&(s=u.return)&&s.call(u)}finally{if(i)throw i.error}}}})},t.prototype.error=function(r){var n=this;br(function(){if(n._throwIfClosed(),!n.isStopped){n.hasError=n.isStopped=!0,n.thrownError=r;for(var i=n.observers;i.length;)i.shift().error(r)}})},t.prototype.complete=function(){var r=this;br(function(){if(r._throwIfClosed(),!r.isStopped){r.isStopped=!0;for(var n=r.observers;n.length;)n.shift().complete()}})},t.prototype.unsubscribe=function(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null},Object.defineProperty(t.prototype,"observed",{get:function(){var r;return((r=this.observers)===null||r===void 0?void 0:r.length)>0},enumerable:!1,configurable:!0}),t.prototype._trySubscribe=function(r){return this._throwIfClosed(),e.prototype._trySubscribe.call(this,r)},t.prototype._subscribe=function(r){return this._throwIfClosed(),this._checkFinalizedStatuses(r),this._innerSubscribe(r)},t.prototype._innerSubscribe=function(r){var n=this,i=this,s=i.hasError,u=i.isStopped,p=i.observers;return s||u?Oa:(this.currentObservers=null,p.push(r),new Br(function(){n.currentObservers=null,on(p,r)}))},t.prototype._checkFinalizedStatuses=function(r){var n=this,i=n.hasError,s=n.thrownError,u=n.isStopped;i?r.error(s):u&&r.complete()},t.prototype.asObservable=function(){var r=new Vn;return r.source=this,r},t.create=function(r,n){return new Un(r,n)},t})(Vn),Un=(function(e){wr(t,e);function t(r,n){var i=e.call(this)||this;return i.destination=r,i.source=n,i}return t.prototype.next=function(r){var n,i;(i=(n=this.destination)===null||n===void 0?void 0:n.next)===null||i===void 0||i.call(n,r)},t.prototype.error=function(r){var n,i;(i=(n=this.destination)===null||n===void 0?void 0:n.error)===null||i===void 0||i.call(n,r)},t.prototype.complete=function(){var r,n;(n=(r=this.destination)===null||r===void 0?void 0:r.complete)===null||n===void 0||n.call(r)},t.prototype._subscribe=function(r){var n,i;return(i=(n=this.source)===null||n===void 0?void 0:n.subscribe(r))!==null&&i!==void 0?i:Oa},t})(un);function $i(e,t){for(let r=0,n=t*3;r<n;r+=3){const i=e[r],s=e[r+1],u=e[r+2],p=1/Math.sqrt(i*i+s*s+u*u);e[r]=i*p,e[r+1]=s*p,e[r+2]=u*p}return e}const Ne=T();function Gt(e,t,r,n){for(let i=0,s=n*3;i<s;i+=3)T.fromArray(Ne,t,r+i),T.transformMat4(Ne,Ne,e),T.toArray(Ne,t,r+i)}function Yi(e,t,r,n){for(let i=0,s=n*3;i<s;i+=3)T.fromArray(Ne,t,r+i),T.transformMat3(Ne,Ne,e),T.toArray(Ne,t,r+i)}function zd(e,t){for(let r=0,n=e.length;r<n;r+=3)T.fromArray(Ne,e,r),T.normalize(Ne,Ne),T.scale(Ne,Ne,t),T.toArray(Ne,e,r)}const jn=T(),Gr=T(),qn=T(),Ue=T(),Wn=T();function Qi(e,t,r,n,i){for(let s=0,u=i*3;s<u;s+=3){const p=t[s]*3,m=t[s+1]*3,v=t[s+2]*3;T.fromArray(jn,e,p),T.fromArray(Gr,e,m),T.fromArray(qn,e,v),T.sub(Ue,qn,Gr),T.sub(Wn,jn,Gr),T.cross(Ue,Ue,Wn),r[p]+=Ue[0],r[p+1]+=Ue[1],r[p+2]+=Ue[2],r[m]+=Ue[0],r[m+1]+=Ue[1],r[m+2]+=Ue[2],r[v]+=Ue[0],r[v+1]+=Ue[1],r[v+2]+=Ue[2]}return $i(r,n)}function kt(e,t,r=1){const n=Tn(e),i=new Int32Array(n+2),s=new Int32Array(t),u=new Int32Array(t);for(let v=0,h=t*r;v<h;v+=r)++u[e[v]];let p=0;for(let v=0;v<t;v++)i[v]=p,p+=u[v];i[t]=p;const m=new Int32Array(p);for(let v=0,h=t*r;v<h;v+=r){const y=e[v],x=i[y]+s[y];m[x]=v,++s[y]}return{indices:m,offsets:i}}const kr=T.fromArray,cr=T.transformMat4Offset;function Zi(e,t){e=Math.max(e,2);const r=Math.sqrt(e);let n=Math.ceil(r);n=n+(t-n%t)%t;const i=n>0?Math.ceil(e/n):0;return{width:n,height:i,length:n*i*t}}function Te(e,t,r,n){const{length:i,width:s,height:u}=Zi(e,t);return n=n&&n.length>=i?n:new r(i),{array:n,width:s,height:u}}const je=T(),Ki=new $t("14"),Ji=new $t("98");function Ga(e){return e>1e5?Ki:Ji}function Et(e,t,r){const n=r*3,i=Ga(t);i.reset();for(let u=0,p=t*3;u<p;u+=n)kr(je,e,u),i.includePosition(je);i.finishedIncludeStep();for(let u=0,p=t*3;u<p;u+=n)kr(je,e,u),i.radiusPosition(je);const s=i.getSphere();if(t<=14){const u=[];for(let p=0,m=t*3;p<m;p+=n)u.push(kr(T(),e,p));q.setExtrema(s,u)}return s}const Vr=ie();function Ie(e,t,r,n){if(r===1){ie.fromArray(Vr,t,n);const m=q.clone(e);return ie.isIdentity(Vr)?m:q.transform(m,m,Vr)}const i=Ga(r);i.reset();const{center:s,radius:u,extrema:p}=e;if(p&&r<=14){for(let m=0,v=r;m<v;++m)for(const h of p)cr(je,h,t,0,0,m*16+n),i.includePosition(je);i.finishedIncludeStep();for(let m=0,v=r;m<v;++m)for(const h of p)cr(je,h,t,0,0,m*16+n),i.radiusPosition(je)}else{for(let m=0,v=r;m<v;++m)cr(je,s,t,0,0,m*16+n),i.includePositionRadius(je,u);i.finishedIncludeStep();for(let m=0,v=r;m<v;++m)cr(je,s,t,0,0,m*16+n),i.radiusPositionRadius(je,u)}return i.getSphere()}const Be=new Uint8Array(772);Be[1]=1;Be[2]=1;Be[3]=1;Be[256]=1;Be[512]=1;Be[768]=1;Be[257]=2;Be[513]=2;Be[769]=2;Be[258]=2;Be[514]=2;Be[770]=2;Be[259]=2;Be[515]=2;Be[771]=2;function eo(e,t){if(t===0)return 0;const r=new Uint32Array(e.buffer,0,e.buffer.byteLength>>2),n=t-4>>2,i=4*n;let s=0;if(n<0)for(let u=0;u<t;++u)s+=e[u]&&1;else{for(let u=0;u<n;++u){const p=r[u];s+=Be[p&65535]+Be[p>>16]}for(let u=i;u<t;++u)s+=e[u]&&1}return s/t}function Ae(e,t,r){const n=Te(Math.max(1,e),1,Uint8Array,r&&r.tMarker.ref.value.array),i=eo(n.array,e),s=i===0?0:-1;return r?(a.updateIfChanged(r.uMarker,0),a.update(r.tMarker,n),a.update(r.uMarkerTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.markerAverage,i),a.updateIfChanged(r.markerStatus,s),a.updateIfChanged(r.dMarkerType,t),r):{uMarker:a.create(0),tMarker:a.create(n),uMarkerTexDim:a.create(ae.create(n.width,n.height)),markerAverage:a.create(i),markerStatus:a.create(s),dMarkerType:a.create(t)}}const Ye={kind:"null-location"};function Ud(e,t,r){return{kind:"data-location",tag:e,data:t,element:r}}function We(e,t,r,n,i=!1,s=()=>!1,u){if(e%r!==0)throw new Error("incompatible groupCount and stride");const p={location:Ye,location2:Ye,index:0,groupIndex:0,instanceIndex:0,isSecondary:!1};let m=p.groupIndex<e,v=!1,h=0,y=0,x=!1;const f=!!u;return{get hasNext(){return m},get isNextNewInstance(){return v},groupCount:e,instanceCount:t,count:e*t,stride:r,nonInstanceable:i,hasLocation2:f,move(){return m&&(p.groupIndex=h,p.instanceIndex=y,p.index=y*e+h,p.location=n(h,x?-1:y),f&&(p.location2=u(h,x?-1:y)),p.isSecondary=s(h,x?-1:y),h+=r,h===e?(++y,v=!0,y<t&&(h=0)):v=!1,m=h<e),p},reset(){p.location=Ye,p.location2=Ye,p.index=0,p.groupIndex=0,p.instanceIndex=0,p.isSecondary=!1,m=p.groupIndex<e,v=!1,h=0,y=0,x=!1},skipInstance(){m&&p.instanceIndex===y&&(++y,h=0,m=y<t)},voidInstances(){x=!0}}}const jd={get hasNext(){return!1},get isNextNewInstance(){return!1},groupCount:0,instanceCount:0,count:0,stride:0,nonInstanceable:!1,hasLocation2:!1,move(){return{location:Ye,location2:Ye,index:0,groupIndex:0,instanceIndex:0,isSecondary:!1}},reset(){},skipInstance(){},voidInstances(){}};function At(e,t){return{kind:"position-location",position:e?T.clone(e):T(),normal:t?T.clone(t):T()}}function qd(e){return!!e&&e.kind==="position-location"}const ka=Ve();function to(e,t){switch(t){case e.FRAMEBUFFER_COMPLETE:return"complete";case e.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return"incomplete attachment";case e.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return"incomplete missing attachment";case e.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return"incomplete dimensions";case e.FRAMEBUFFER_UNSUPPORTED:return"unsupported"}if(K(e))switch(t){case e.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:return"incomplete multisample";case e.RENDERBUFFER_SAMPLES:return"renderbuffer samples"}return"unknown error"}function Cr(e,t){const r=e.checkFramebufferStatus(e.FRAMEBUFFER);if(r!==e.FRAMEBUFFER_COMPLETE){const n=to(e,r);throw new Error(`Framebuffer status: ${n}${t?` (${t})`:""}`)}}function Xn(e){const t=e.createFramebuffer();if(t===null)throw new Error("Could not create WebGL framebuffer");return t}function ro(e){let t=Xn(e),r=!1;return{id:ka(),bind:()=>e.bindFramebuffer(e.FRAMEBUFFER,t),reset:()=>{t=Xn(e)},destroy:()=>{r||(e.deleteFramebuffer(t),r=!0)}}}function no(){return{id:ka(),bind:()=>{},reset:()=>{},destroy:()=>{}}}function Va(e){const t=Bu(e);if(t===null)throw new Error('Could not find support for "instanced_arrays"');const r=Pu(e);if(r===null)throw new Error('Could not find support for "element_index_uint"');const n=Fu(e);if(n===null)throw new Error('Could not find support for "standard_derivatives"');const i=Ou(e);oe&&i===null&&console.log('Could not find support for "texture_float"');const s=Mu(e);oe&&s===null&&console.log('Could not find support for "texture_float_linear"');const u=Nu(e);oe&&u===null&&console.log('Could not find support for "texture_half_float"');const p=Gu(e);oe&&p===null&&console.log('Could not find support for "texture_half_float_linear"');const m=Xu(e);oe&&m===null&&console.log('Could not find support for "depth_texture"');const v=ku(e);oe&&v===null&&console.log('Could not find support for "blend_minmax"');const h=Lu(e);oe&&h===null&&console.log('Could not find support for "vertex_array_object"');const y=Vu(e);oe&&y===null&&console.log('Could not find support for "frag_depth"');const x=zu(e);oe&&x===null&&console.log('Could not find support for "color_buffer_float"');const f=Uu(e);oe&&f===null&&console.log('Could not find support for "color_buffer_half_float"');const c=ju(e);oe&&c===null&&console.log('Could not find support for "draw_buffers"');const o=qu(e);oe&&o===null&&console.log('Could not find support for "draw_buffers_indexed"');const d=Wu(e);oe&&d===null&&console.log('Could not find support for "shader_texture_lod"');const g=Hu(e);oe&&g===null&&console.log('Could not find support for "sRGB"');const _=$u(e);oe&&_===null&&console.log('Could not find support for "disjoint_timer_query"');const l=Yu(e);oe&&l===null&&console.log('Could not find support for "multi_draw"');const b=Qu(e);oe&&b===null&&console.log('Could not find support for "draw_instanced_base_vertex_base_instance"');const I=Zu(e);oe&&I===null&&console.log('Could not find support for "multi_draw_instanced_base_vertex_base_instance"');const C=Ku(e);oe&&C===null&&console.log('Could not find support for "parallel_shader_compile"');const A=Ju(e);oe&&A===null&&console.log('Could not find support for "fbo_render_mipmap"');const D=ec(e);oe&&D===null&&console.log('Could not find support for "provoking_vertex"');const w=tc(e);oe&&w===null&&console.log('Could not find support for "clip_cull_distance"');const R=rc(e);oe&&R===null&&console.log('Could not find support for "conservative_depth"');const S=nc(e);oe&&S===null&&console.log('Could not find support for "stencil_texturing"');const E=ac(e);oe&&E===null&&console.log('Could not find support for "clip_control"');const B=ic(e);oe&&B===null&&console.log('Could not find support for "render_snorm"');const L=oc(e);oe&&L===null&&console.log('Could not find support for "render_shared_exponent"');const F=sc(e);oe&&F===null&&console.log('Could not find support for "texture_norm16"');const O=uc(e);oe&&O===null&&console.log('Could not find support for "depth_clamp"');const N=cc(e);oe&&N===null&&console.log('Could not find support for "multiview2"');const z=fc(e);return{instancedArrays:t,standardDerivatives:n,elementIndexUint:r,textureFloat:i,textureFloatLinear:s,textureHalfFloat:u,textureHalfFloatLinear:p,depthTexture:m,blendMinMax:v,vertexArrayObject:h,fragDepth:y,colorBufferFloat:x,colorBufferHalfFloat:f,drawBuffers:c,drawBuffersIndexed:o,shaderTextureLod:d,sRGB:g,disjointTimerQuery:_,multiDraw:l,drawInstancedBaseVertexBaseInstance:b,multiDrawInstancedBaseVertexBaseInstance:I,parallelShaderCompile:C,fboRenderMipmap:A,provokingVertex:D,clipCullDistance:w,conservativeDepth:R,stencilTexturing:S,clipControl:E,renderSnorm:B,renderSharedExponent:L,textureNorm16:F,depthClamp:O,multiview2:N,noNonInstancedActiveAttribs:z}}function ao(e,t){const r=Va(e);Ia(t,(n,i)=>{i==="noNonInstancedActiveAttribs"?t.noNonInstancedActiveAttribs=r.noNonInstancedActiveAttribs:n!==null&&(r[i]===null?t[i]=null:Object.assign(n,r[i]))})}function io(e,t){let r={},n=e.getParameter(e.FRONT_FACE),i=e.getParameter(e.CULL_FACE_MODE),s=e.getParameter(e.DEPTH_WRITEMASK),u=e.getParameter(e.DEPTH_CLEAR_VALUE),p=e.getParameter(e.DEPTH_FUNC),m=e.getParameter(e.COLOR_WRITEMASK),v=e.getParameter(e.COLOR_CLEAR_VALUE),h=e.getParameter(e.BLEND_SRC_RGB),y=e.getParameter(e.BLEND_DST_RGB),x=e.getParameter(e.BLEND_SRC_ALPHA),f=e.getParameter(e.BLEND_DST_ALPHA),c=e.getParameter(e.BLEND_COLOR),o=e.getParameter(e.BLEND_EQUATION_RGB),d=e.getParameter(e.BLEND_EQUATION_ALPHA),g=e.getParameter(e.STENCIL_FUNC),_=e.getParameter(e.STENCIL_VALUE_MASK),l=e.getParameter(e.STENCIL_REF),b=e.getParameter(e.STENCIL_BACK_FUNC),I=e.getParameter(e.STENCIL_BACK_VALUE_MASK),C=e.getParameter(e.STENCIL_BACK_REF),A=e.getParameter(e.STENCIL_WRITEMASK),D=e.getParameter(e.STENCIL_BACK_WRITEMASK),w=e.getParameter(e.STENCIL_FAIL),R=e.getParameter(e.STENCIL_PASS_DEPTH_PASS),S=e.getParameter(e.STENCIL_PASS_DEPTH_FAIL),E=e.getParameter(e.STENCIL_BACK_FAIL),B=e.getParameter(e.STENCIL_BACK_PASS_DEPTH_PASS),L=e.getParameter(e.STENCIL_BACK_PASS_DEPTH_FAIL),F=e.getParameter(e.MAX_VERTEX_ATTRIBS);const O=[];let N=e.getParameter(e.VIEWPORT),z=e.getParameter(e.SCISSOR_BOX),V=t.clipControl?e.getParameter(t.clipControl.CLIP_ORIGIN):-1,$=t.clipControl?e.getParameter(t.clipControl.CLIP_DEPTH_MODE):-1;const H=()=>{for(let P=0;P<F;++P)O[P]=0};return H(),{currentProgramId:-1,currentMaterialId:-1,currentRenderItemId:-1,enable:P=>{r[P]!==!0&&(e.enable(P),r[P]=!0)},disable:P=>{r[P]!==!1&&(e.disable(P),r[P]=!1)},frontFace:P=>{P!==n&&(e.frontFace(P),n=P)},cullFace:P=>{P!==i&&(e.cullFace(P),i=P)},depthMask:P=>{P!==s&&(e.depthMask(P),s=P)},clearDepth:P=>{P!==u&&(e.clearDepth(P),u=P)},depthFunc:P=>{P!==p&&(e.depthFunc(P),p=P)},colorMask:(P,M,U,W)=>{(P!==m[0]||M!==m[1]||U!==m[2]||W!==m[3])&&(e.colorMask(P,M,U,W),m[0]=P,m[1]=M,m[2]=U,m[3]=W)},clearColor:(P,M,U,W)=>{(P!==v[0]||M!==v[1]||U!==v[2]||W!==v[3])&&(e.clearColor(P,M,U,W),v[0]=P,v[1]=M,v[2]=U,v[3]=W)},blendFunc:(P,M)=>{(P!==h||M!==y||P!==x||M!==f)&&(e.blendFunc(P,M),h=P,y=M,x=P,f=M)},blendFuncSeparate:(P,M,U,W)=>{(P!==h||M!==y||U!==x||W!==f)&&(e.blendFuncSeparate(P,M,U,W),h=P,y=M,x=U,f=W)},blendEquation:P=>{(P!==o||P!==d)&&(e.blendEquation(P),o=P,d=P)},blendEquationSeparate:(P,M)=>{(P!==o||M!==d)&&(e.blendEquationSeparate(P,M),o=P,d=M)},blendColor:(P,M,U,W)=>{(P!==c[0]||M!==c[1]||U!==c[2]||W!==c[3])&&(e.blendColor(P,M,U,W),c[0]=P,c[1]=M,c[2]=U,c[3]=W)},stencilFunc:(P,M,U)=>{(P!==g||M!==l||U!==_||P!==b||M!==C||U!==I)&&(e.stencilFunc(P,M,U),g=P,l=M,_=U,b=P,C=M,I=U)},stencilFuncSeparate:(P,M,U,W)=>{P===e.FRONT?(M!==g||U!==l||W!==_)&&(e.stencilFuncSeparate(P,M,U,W),g=M,l=U,_=W):P===e.BACK?(M!==b||U!==C||W!==I)&&(e.stencilFuncSeparate(P,M,U,W),b=M,C=U,I=W):P===e.FRONT_AND_BACK&&(M!==g||U!==l||W!==_||M!==b||U!==C||W!==I)&&(e.stencilFuncSeparate(P,M,U,W),g=M,l=U,_=W,b=M,C=U,I=W)},stencilMask:P=>{(P!==A||P!==D)&&(e.stencilMask(P),A=P,D=P)},stencilMaskSeparate:(P,M)=>{P===e.FRONT?M!==A&&(e.stencilMaskSeparate(P,M),A=M):P===e.BACK?M!==D&&(e.stencilMaskSeparate(P,M),D=M):P===e.FRONT_AND_BACK&&(M!==A||M!==D)&&(e.stencilMaskSeparate(P,M),A=M,D=M)},stencilOp:(P,M,U)=>{(P!==w||M!==S||U!==R||P!==E||M!==L||U!==B)&&(e.stencilOp(P,M,U),w=P,S=M,R=U,E=P,L=M,B=U)},stencilOpSeparate:(P,M,U,W)=>{P===e.FRONT?(M!==w||U!==S||W!==R)&&(e.stencilOpSeparate(P,M,U,W),w=M,S=U,R=W):P===e.BACK?(M!==E||U!==L||W!==B)&&(e.stencilOpSeparate(P,M,U,W),E=M,L=U,B=W):P===e.FRONT_AND_BACK&&(M!==w||U!==S||W!==R||M!==E||U!==L||W!==B)&&(e.stencilOpSeparate(P,M,U,W),w=M,S=U,R=W,E=M,L=U,B=W)},enableVertexAttrib:P=>{e.enableVertexAttribArray(P),O[P]=1},clearVertexAttribsState:H,disableUnusedVertexAttribs:()=>{for(let P=0;P<F;++P)O[P]===0&&e.disableVertexAttribArray(P)},viewport:(P,M,U,W)=>{(P!==N[0]||M!==N[1]||U!==N[2]||W!==N[3])&&(e.viewport(P,M,U,W),N[0]=P,N[1]=M,N[2]=U,N[3]=W)},scissor:(P,M,U,W)=>{(P!==z[0]||M!==z[1]||U!==z[2]||W!==z[3])&&(e.scissor(P,M,U,W),z[0]=P,z[1]=M,z[2]=U,z[3]=W)},clipControl:t.clipControl?(P,M)=>{(P!==V||M!==$)&&(t.clipControl.clipControl(P,M),V=P,$=M)}:void 0,reset:()=>{r={},n=e.getParameter(e.FRONT_FACE),i=e.getParameter(e.CULL_FACE_MODE),s=e.getParameter(e.DEPTH_WRITEMASK),u=e.getParameter(e.DEPTH_CLEAR_VALUE),p=e.getParameter(e.DEPTH_FUNC),m=e.getParameter(e.COLOR_WRITEMASK),v=e.getParameter(e.COLOR_CLEAR_VALUE),h=e.getParameter(e.BLEND_SRC_RGB),y=e.getParameter(e.BLEND_DST_RGB),x=e.getParameter(e.BLEND_SRC_ALPHA),f=e.getParameter(e.BLEND_DST_ALPHA),c=e.getParameter(e.BLEND_COLOR),o=e.getParameter(e.BLEND_EQUATION_RGB),d=e.getParameter(e.BLEND_EQUATION_ALPHA),g=e.getParameter(e.STENCIL_FUNC),_=e.getParameter(e.STENCIL_VALUE_MASK),l=e.getParameter(e.STENCIL_REF),b=e.getParameter(e.STENCIL_BACK_FUNC),I=e.getParameter(e.STENCIL_BACK_VALUE_MASK),C=e.getParameter(e.STENCIL_BACK_REF),A=e.getParameter(e.STENCIL_WRITEMASK),D=e.getParameter(e.STENCIL_BACK_WRITEMASK),w=e.getParameter(e.STENCIL_FAIL),R=e.getParameter(e.STENCIL_PASS_DEPTH_PASS),S=e.getParameter(e.STENCIL_PASS_DEPTH_FAIL),E=e.getParameter(e.STENCIL_BACK_FAIL),B=e.getParameter(e.STENCIL_BACK_PASS_DEPTH_PASS),L=e.getParameter(e.STENCIL_BACK_PASS_DEPTH_FAIL),F=e.getParameter(e.MAX_VERTEX_ATTRIBS),O.length=0;for(let P=0;P<F;++P)O[P]=0;N=e.getParameter(e.VIEWPORT),z=e.getParameter(e.SCISSOR_BOX),V=t.clipControl?e.getParameter(t.clipControl.CLIP_ORIGIN):-1,$=t.clipControl?e.getParameter(t.clipControl.CLIP_DEPTH_MODE):-1}}}const oo=`
float preFogAlpha = gl_FragColor.a;
if (uFog) {
    float viewZ = depthToViewZ(uIsOrtho, fragmentDepth, uNear, uFar);
    float fogFactor = smoothstep(uFogNear, uFogFar, abs(viewZ));
    float fogAlpha = (1.0 - fogFactor) * gl_FragColor.a;
    if (!uTransparentBackground) {
        if (gl_FragColor.a < 1.0) {
            // transparent objects are blended with background color
            gl_FragColor.a = fogAlpha;
        } else {
            // mix opaque objects with background color
            gl_FragColor.rgb = mix(gl_FragColor.rgb, uFogColor, fogFactor);
        }
    } else {
        #if defined(dRenderVariant_colorDpoit) && !defined(dGeometryType_directVolume)
            if (gl_FragColor.a < 1.0) {
                // transparent objects are blended with background color
                gl_FragColor.a = fogAlpha;
            } else {
                // opaque objects need to be pre-multiplied alpha
                gl_FragColor.rgb *= fogAlpha;
                gl_FragColor.a = fogAlpha;
            }
        #else
            // pre-multiplied alpha expected for transparent background
            gl_FragColor.rgb *= fogAlpha;
            gl_FragColor.a = fogAlpha;
        #endif
    }
} else if (uTransparentBackground) {
    #if !defined(dRenderVariant_colorDpoit) && !defined(dGeometryType_directVolume)
        // pre-multiplied alpha expected for transparent background
        gl_FragColor.rgb *= gl_FragColor.a;
    #endif
}
`,so=`
if (interior) {
    material.rgb = mix(material.rgb, uInteriorColor.rgb, uInteriorColor.a);

    float isf = clamp(uInteriorSubstance.a, 0.0, 0.99); // clamp to avoid artifacts
    metalness = mix(metalness, uInteriorSubstance.r, isf);
    roughness = mix(roughness, uInteriorSubstance.g, isf);
    bumpiness = mix(bumpiness, uInteriorSubstance.b, isf);

    #ifdef dTransparentBackfaces_opaque
        material.a = 1.0;
    #endif
}
`,uo=`
#if defined(dIgnoreLight)
    #ifdef bumpEnabled
        if (uBumpFrequency > 0.0 && uBumpAmplitude > 0.0 && bumpiness > 0.0) {
            material.rgb += fbm(vModelPosition * uBumpFrequency) * uBumpAmplitude * bumpiness;
            material.rgb -= 0.5 * uBumpAmplitude * bumpiness;
        }
    #endif

    #if defined(dRenderVariant_color)
        material.rgb += material.rgb * emissive;
    #endif

    gl_FragColor = material;
#else
    #ifdef bumpEnabled
        if (uBumpFrequency > 0.0 && uBumpAmplitude > 0.0 && bumpiness > 0.0) {
            normal = perturbNormal(-vViewPosition, normal, fbm(vModelPosition * uBumpFrequency), (uBumpAmplitude * bumpiness) / uBumpFrequency);
        }
    #endif

    vec4 color = material;

    #if defined(dCelShaded)
        // clamp to avoid artifacts
        metalness = clamp(metalness, 0.0, 0.99);
        roughness = clamp(roughness, 0.05, 1.0);
    #endif

    GeometricContext geometry;
    geometry.position = -vViewPosition;
    geometry.normal = normal;
    geometry.viewDir = normalize(vViewPosition);

    PhysicalMaterial physicalMaterial;
    physicalMaterial.diffuseColor = color.rgb * (1.0 - metalness);
    #ifdef enabledFragDepth
        physicalMaterial.roughness = min(max(roughness, 0.0525), 1.0);
    #else
        vec3 dxy = max(abs(dFdx(normal)), abs(dFdy(normal)));
        float geometryRoughness = max(max(dxy.x, dxy.y), dxy.z);
        physicalMaterial.roughness = min(max(roughness, 0.0525) + geometryRoughness, 1.0);
    #endif
    physicalMaterial.specularColor = mix(vec3(0.04), color.rgb, metalness);
    physicalMaterial.specularF90 = 1.0;

    IncidentLight directLight;

    vec3 outgoingLight = vec3(0.0);

    #if defined(dCelShaded)
        float celDiffuse;
        float celSpecular;
        float celIntensity;

        #pragma unroll_loop_start
        for (int i = 0; i < dLightCount; ++i) {
            directLight.direction = uLightDirection[i];
            directLight.color = uLightColor[i] * PI; // * PI for punctual light

            celDiffuse = RECIPROCAL_PI * max(dot(geometry.normal, directLight.direction), 0.0) * (1.0 - metalness);
            celSpecular = luminance(saturate(dot(geometry.normal, directLight.direction)) * BRDF_GGX(directLight.direction, geometry.viewDir, geometry.normal, physicalMaterial.specularColor, physicalMaterial.specularF90, roughness));

            celIntensity = celDiffuse + celSpecular;
            celIntensity = ceil(celIntensity * uCelSteps) / uCelSteps;

            outgoingLight += color.rgb * directLight.color * celIntensity;
        }
        #pragma unroll_loop_end

        outgoingLight += physicalMaterial.diffuseColor * luminance(uAmbientColor);
    #else
        ReflectedLight reflectedLight = ReflectedLight(vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));

        #pragma unroll_loop_start
        for (int i = 0; i < dLightCount; ++i) {
            directLight.direction = uLightDirection[i];
            directLight.color = uLightColor[i] * PI; // * PI for punctual light
            RE_Direct_Physical(directLight, geometry, physicalMaterial, reflectedLight);
        }
        #pragma unroll_loop_end

        vec3 irradiance = uAmbientColor * PI; // * PI for punctual light
        RE_IndirectDiffuse_Physical(irradiance, geometry, physicalMaterial, reflectedLight);

        // indirect specular only metals
        vec3 radiance = uAmbientColor * metalness;
        vec3 iblIrradiance = uAmbientColor * metalness;
        vec3 clearcoatRadiance = vec3(0.0);
        RE_IndirectSpecular_Physical(radiance, iblIrradiance, clearcoatRadiance, geometry, physicalMaterial, reflectedLight);

        outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular;
    #endif
    outgoingLight = clamp(outgoingLight, 0.01, 0.99); // prevents black artifacts on specular highlight with transparent background

    #if defined(dRenderVariant_color)
        outgoingLight += color.rgb * emissive;
    #endif

    gl_FragColor = vec4(outgoingLight, color.a);
#endif

gl_FragColor.rgb *= uExposure;
`,co=`

#if defined(dColorMarker)
    if (marker > 0.0) {
        if ((uMarkerPriority == 1 && marker != 2.0) || (uMarkerPriority != 1 && marker == 1.0)) {
            gl_FragColor.rgb = mix(gl_FragColor.rgb, uHighlightColor, uHighlightStrength);
            gl_FragColor.a = max(gl_FragColor.a, uHighlightStrength * 0.002); // for direct-volume rendering
        } else {
            gl_FragColor.rgb = mix(gl_FragColor.rgb, uSelectColor, uSelectStrength);
            gl_FragColor.a = max(gl_FragColor.a, uSelectStrength * 0.002); // for direct-volume rendering
        }
    } else if (uMarkerAverage > 0.0) {
        gl_FragColor.rgb = mix(gl_FragColor.rgb, uDimColor, uDimStrength);
        gl_FragColor.a = max(gl_FragColor.a, uDimStrength * 0.002); // for direct-volume rendering
    }
#endif
`,fo=`
#if dClipObjectCount != 0 && defined(dClipping)
    #if defined(dClippingType_instance)
        vClipping = readFromTexture(tClipping, aInstance, uClippingTexDim).a;
    #elif defined(dMarkerType_groupInstance)
        vClipping = readFromTexture(tClipping, aInstance * float(uGroupCount) + group, uClippingTexDim).a;
    #endif
#endif
`,lo=`
#if defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
    #if defined(dColorType_attribute)
        vColor.rgb = aColor;
    #elif defined(dColorType_instance)
        vColor.rgb = readFromTexture(tColor, aInstance, uColorTexDim).rgb;
    #elif defined(dColorType_group)
        #if defined(dDualColor)
            vec4 color2;
            if (aColorMode == 2.0) {
                vColor.rgb = readFromTexture(tColor, group, uColorTexDim).rgb;
            } else {
                vColor.rgb = readFromTexture(tColor, group * 2.0, uColorTexDim).rgb;
                color2.rgb = readFromTexture(tColor, group * 2.0 + 1.0, uColorTexDim).rgb;
            }
        #else
            vColor.rgb = readFromTexture(tColor, group, uColorTexDim).rgb;
        #endif
    #elif defined(dColorType_groupInstance)
        #if defined(dDualColor)
            vec4 color2;
            if (aColorMode == 2.0) {
                vColor.rgb = readFromTexture(tColor, aInstance * float(uGroupCount) + group, uColorTexDim).rgb;
            } else {
                vColor.rgb = readFromTexture(tColor, (aInstance * float(uGroupCount) + group) * 2.0, uColorTexDim).rgb;
                color2.rgb = readFromTexture(tColor, (aInstance * float(uGroupCount) + group) * 2.0 + 1.0, uColorTexDim).rgb;
            }
        #else
            vColor.rgb = readFromTexture(tColor, aInstance * float(uGroupCount) + group, uColorTexDim).rgb;
        #endif
    #elif defined(dColorType_vertex)
        vColor.rgb = readFromTexture(tColor, vertexId, uColorTexDim).rgb;
    #elif defined(dColorType_vertexInstance)
        vColor.rgb = readFromTexture(tColor, int(aInstance) * uVertexCount + vertexId, uColorTexDim).rgb;
    #elif defined(dColorType_volume)
        vec3 cgridPos = (uColorGridTransform.w * (position - uColorGridTransform.xyz)) / uColorGridDim;
        vColor.rgb = texture3dFrom2dLinear(tColorGrid, cgridPos, uColorGridDim, uColorTexDim).rgb;
    #elif defined(dColorType_volumeInstance)
        vec3 cgridPos = (uColorGridTransform.w * (vModelPosition / uModelScale - uColorGridTransform.xyz)) / uColorGridDim;
        vColor.rgb = texture3dFrom2dLinear(tColorGrid, cgridPos, uColorGridDim, uColorTexDim).rgb;
    #endif

    #ifdef dUsePalette
        vPaletteV = ((vColor.r * 256.0 * 256.0 * 255.0 + vColor.g * 256.0 * 255.0 + vColor.b * 255.0) - 1.0) / PALETTE_SCALE;
    #endif

    #ifdef dOverpaint
        #if defined(dOverpaintType_instance)
            vOverpaint = readFromTexture(tOverpaint, aInstance, uOverpaintTexDim);
        #elif defined(dOverpaintType_groupInstance)
            vOverpaint = readFromTexture(tOverpaint, aInstance * float(uGroupCount) + group, uOverpaintTexDim);
        #elif defined(dOverpaintType_vertexInstance)
            vOverpaint = readFromTexture(tOverpaint, int(aInstance) * uVertexCount + vertexId, uOverpaintTexDim);
        #elif defined(dOverpaintType_volumeInstance)
            vec3 ogridPos = (uOverpaintGridTransform.w * (vModelPosition / uModelScale - uOverpaintGridTransform.xyz)) / uOverpaintGridDim;
            vOverpaint = texture3dFrom2dLinear(tOverpaintGrid, ogridPos, uOverpaintGridDim, uOverpaintTexDim);
        #endif

        // pre-mix to avoid darkening due to empty overpaint
        #ifdef dColorType_uniform
            vOverpaint.rgb = mix(uColor.rgb, vOverpaint.rgb, vOverpaint.a);
        #else
            vOverpaint.rgb = mix(vColor.rgb, vOverpaint.rgb, vOverpaint.a);
        #endif
        vOverpaint *= uOverpaintStrength;
    #endif

    #ifdef dEmissive
        #if defined(dEmissiveType_instance)
            vEmissive = readFromTexture(tEmissive, aInstance, uEmissiveTexDim).a;
        #elif defined(dEmissiveType_groupInstance)
            vEmissive = readFromTexture(tEmissive, aInstance * float(uGroupCount) + group, uEmissiveTexDim).a;
        #elif defined(dEmissiveType_vertexInstance)
            vEmissive = readFromTexture(tEmissive, int(aInstance) * uVertexCount + vertexId, uEmissiveTexDim).a;
        #elif defined(dEmissiveType_volumeInstance)
            vec3 egridPos = (uEmissiveGridTransform.w * (vModelPosition / uModelScale - uEmissiveGridTransform.xyz)) / uEmissiveGridDim;
            vEmissive = texture3dFrom2dLinear(tEmissiveGrid, egridPos, uEmissiveGridDim, uEmissiveTexDim).a;
        #endif
        vEmissive *= uEmissiveStrength;
    #endif

    #ifdef dSubstance
        #if defined(dSubstanceType_instance)
            vSubstance = readFromTexture(tSubstance, aInstance, uSubstanceTexDim);
        #elif defined(dSubstanceType_groupInstance)
            vSubstance = readFromTexture(tSubstance, aInstance * float(uGroupCount) + group, uSubstanceTexDim);
        #elif defined(dSubstanceType_vertexInstance)
            vSubstance = readFromTexture(tSubstance, int(aInstance) * uVertexCount + vertexId, uSubstanceTexDim);
        #elif defined(dSubstanceType_volumeInstance)
            vec3 sgridPos = (uSubstanceGridTransform.w * (vModelPosition / uModelScale - uSubstanceGridTransform.xyz)) / uSubstanceGridDim;
            vSubstance = texture3dFrom2dLinear(tSubstanceGrid, sgridPos, uSubstanceGridDim, uSubstanceTexDim);
        #endif

        // pre-mix to avoid artifacts due to empty substance
        vSubstance.rgb = mix(vec3(uMetalness, uRoughness, uBumpiness), vSubstance.rgb, vSubstance.a);
        vSubstance *= uSubstanceStrength;
    #endif
#elif defined(dRenderVariant_emissive)
    #ifdef dEmissive
        #if defined(dEmissiveType_instance)
            vEmissive = readFromTexture(tEmissive, aInstance, uEmissiveTexDim).a;
        #elif defined(dEmissiveType_groupInstance)
            vEmissive = readFromTexture(tEmissive, aInstance * float(uGroupCount) + group, uEmissiveTexDim).a;
        #elif defined(dEmissiveType_vertexInstance)
            vEmissive = readFromTexture(tEmissive, int(aInstance) * uVertexCount + vertexId, uEmissiveTexDim).a;
        #elif defined(dEmissiveType_volumeInstance)
            vec3 egridPos = (uEmissiveGridTransform.w * (vModelPosition / uModelScale - uEmissiveGridTransform.xyz)) / uEmissiveGridDim;
            vEmissive = texture3dFrom2dLinear(tEmissiveGrid, egridPos, uEmissiveGridDim, uEmissiveTexDim).a;
        #endif
        vEmissive *= uEmissiveStrength;
    #endif
#elif defined(dRenderVariant_pick)
    #ifdef requiredDrawBuffers
        vObject = vec4(packIntToRGB(float(uObjectId)), 1.0);
        vInstance = vec4(packIntToRGB(aInstance), 1.0);
        vGroup = vec4(packIntToRGB(group), 1.0);
    #else
        if (uPickType == 1) {
            vColor = vec4(packIntToRGB(float(uObjectId)), 1.0);
        } else if (uPickType == 2) {
            vColor = vec4(packIntToRGB(aInstance), 1.0);
        } else {
            vColor = vec4(packIntToRGB(group), 1.0);
        }
    #endif
#endif

#ifdef dTransparency
    #if defined(dTransparencyType_instance)
        vTransparency = readFromTexture(tTransparency, aInstance, uTransparencyTexDim).a;
    #elif defined(dTransparencyType_groupInstance)
        vTransparency = readFromTexture(tTransparency, aInstance * float(uGroupCount) + group, uTransparencyTexDim).a;
    #elif defined(dTransparencyType_vertexInstance)
        vTransparency = readFromTexture(tTransparency, int(aInstance) * uVertexCount + vertexId, uTransparencyTexDim).a;
    #elif defined(dTransparencyType_volumeInstance)
        vec3 tgridPos = (uTransparencyGridTransform.w * (vModelPosition / uModelScale - uTransparencyGridTransform.xyz)) / uTransparencyGridDim;
        vTransparency = texture3dFrom2dLinear(tTransparencyGrid, tgridPos, uTransparencyGridDim, uTransparencyTexDim).a;
    #endif
    vTransparency *= uTransparencyStrength;
#endif
`,mo=`
#ifdef dGeometryType_textureMesh
    float group = unpackRGBToInt(readFromTexture(tGroup, vertexId, uGeoTexDim).rgb);
#else
    float group = aGroup;
#endif
`,po=`
#if defined(dNeedsMarker)
    #if defined(dMarkerType_instance)
        vMarker = readFromTexture(tMarker, aInstance, uMarkerTexDim).a;
    #elif defined(dMarkerType_groupInstance)
        vMarker = readFromTexture(tMarker, aInstance * float(uGroupCount) + group, uMarkerTexDim).a;
    #endif
#endif
`,go=`
#if defined(dNeedsMarker)
    float marker = uMarker;
    if (uMarker == -1.0) {
        marker = floor(vMarker * 255.0 + 0.5); // rounding required to work on some cards on win
    }
#endif

#if defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
    #if defined(dUsePalette)
        vec4 material = vec4(texture2D(tPalette, vec2(vPaletteV, 0.5)).rgb, uAlpha);
    #elif defined(dColorType_uniform)
        vec4 material = vec4(uColor, uAlpha);
    #elif defined(dColorType_varying)
        vec4 material = vec4(vColor.rgb, uAlpha);
    #endif

    // mix material with overpaint
    #if defined(dOverpaint)
        material.rgb = mix(material.rgb, vOverpaint.rgb, vOverpaint.a);
    #endif

    float emissive = uEmissive;
    #ifdef dEmissive
        emissive += vEmissive;
    #endif

    float metalness = uMetalness;
    float roughness = uRoughness;
    float bumpiness = uBumpiness;
    #ifdef dSubstance
        float sf = clamp(vSubstance.a, 0.0, 0.99); // clamp to avoid artifacts
        metalness = mix(metalness, vSubstance.r, sf);
        roughness = mix(roughness, vSubstance.g, sf);
        bumpiness = mix(bumpiness, vSubstance.b, sf);
    #endif

    #if defined(dXrayShaded)
        material.a = calcXrayShadedAlpha(material.a, normal);
    #endif
#elif defined(dRenderVariant_depth)
    if (fragmentDepth > getDepth(gl_FragCoord.xy / uDrawingBufferSize)) {
        discard;
    }
    vec4 material;
    if (uRenderMask == MaskOpaque) {
        #if defined(dXrayShaded)
            discard;
        #endif
        #if defined(dTransparency)
            float dta = 1.0 - vTransparency;
            #if __VERSION__ == 100 || defined(dVaryingGroup)
                if (vTransparency < 0.1) dta = 1.0; // hard cutoff to avoid artifacts
            #endif

            if (uAlpha * dta < 1.0) {
                discard;
            }
        #else
            if (uAlpha < 1.0) {
                discard;
            }
        #endif
        material = packDepthToRGBA(fragmentDepth);
    } else if (uRenderMask == MaskTransparent) {
        float alpha = uAlpha;
        #if defined(dTransparency)
            float dta = 1.0 - vTransparency;
            alpha *= dta;
        #endif

        #ifdef dXrayShaded
            alpha = calcXrayShadedAlpha(alpha, normal);
        #else
            if (alpha == 1.0) {
                discard;
            }
        #endif
        material = packDepthWithAlphaToRGBA(fragmentDepth, alpha);
    }
#elif defined(dRenderVariant_marking)
    vec4 material;
    if(uMarkingType == 1) {
        if (marker > 0.0)
            discard;
        #ifdef enabledFragDepth
            material = packDepthToRGBA(gl_FragDepthEXT);
        #else
            material = packDepthToRGBA(gl_FragCoord.z);
        #endif
    } else {
        if (marker == 0.0)
            discard;
        float depthTest = 1.0;
        if (uMarkingDepthTest) {
            depthTest = (fragmentDepth >= getDepthPacked(gl_FragCoord.xy / uDrawingBufferSize)) ? 1.0 : 0.0;
        }
        bool isHighlight = intMod(marker, 2.0) > 0.1;
        float viewZ = depthToViewZ(uIsOrtho, fragmentDepth, uNear, uFar);
        float fogFactor = smoothstep(uFogNear, uFogFar, abs(viewZ));
        if (fogFactor == 1.0)
            discard;
        material = vec4(0.0, depthTest, isHighlight ? 1.0 : 0.0, 1.0 - fogFactor);
    }
#elif defined(dRenderVariant_emissive)
    float emissive = uEmissive;
    #ifdef dEmissive
        emissive += vEmissive;
    #endif
    vec4 material = vec4(emissive);
#endif

// apply per-group transparency
#if defined(dTransparency) && (defined(dRenderVariant_pick) || defined(dRenderVariant_color) || defined(dRenderVariant_emissive) || defined(dRenderVariant_tracing))
    float ta = 1.0 - vTransparency;
    if (vTransparency < 0.09) ta = 1.0; // hard cutoff looks better

    #if defined(dRenderVariant_pick)
        if (ta * uAlpha < uPickingAlphaThreshold)
            discard; // ignore so the element below can be picked
    #elif defined(dRenderVariant_emissive)
        if (ta < 1.0)
            discard; // emissive not supported with transparency
    #elif defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
        material.a *= ta;
    #endif
#endif
`,vo=`
#ifdef dGeometryType_image
    mat4 transform = aTransform;
#else
    mat4 transform = applyTumble(aTransform, aInstance, float(uObjectId));
#endif
mat4 model = uModel * transform;
mat4 modelView = uView * model;
#ifdef dGeometryType_textureMesh
    vec3 position = readFromTexture(tPosition, vertexId, uGeoTexDim).xyz;
#else
    vec3 position = aPosition;
#endif
#ifndef dGeometryType_image
    position = applyWiggle(position, group, aInstance);
#endif
vec4 position4 = vec4(position, 1.0);
// for accessing tColorGrid in vert shader and for clipping in frag shader
vModelPosition = (model * position4).xyz;
vec4 mvPosition = modelView * position4;
vViewPosition = mvPosition.xyz;
gl_Position = uProjection * mvPosition;
`,ho=`
#if defined(dSizeType_uniform)
    float size = uSize;
#elif defined(dSizeType_attribute)
    float size = aSize;
#elif defined(dSizeType_instance)
    float size = unpackRGBToInt(readFromTexture(tSize, aInstance, uSizeTexDim).rgb);
#elif defined(dSizeType_group)
    float size = unpackRGBToInt(readFromTexture(tSize, group, uSizeTexDim).rgb);
#elif defined(dSizeType_groupInstance)
    float size = unpackRGBToInt(readFromTexture(tSize, aInstance * float(uGroupCount) + group, uSizeTexDim).rgb);
#elif defined(dSizeType_vertex)
    float size = unpackRGBToInt(readFromTexture(tSize, vertexId, uSizeTexDim).rgb);
#elif defined(dSizeType_vertexInstance)
    float size = unpackRGBToInt(readFromTexture(tSize, int(aInstance) * uVertexCount + vertexId, uSizeTexDim).rgb);
#endif

#if defined(dSizeType_instance) || defined(dSizeType_group) || defined(dSizeType_groupInstance) || defined(dSizeType_vertex) || defined(dSizeType_vertexInstance)
    size /= 100.0; // NOTE factor also set in TypeScript
#endif

size *= uSizeFactor;
`,bo=`
float viewZ = depthToViewZ(uIsOrtho, fragmentDepth, uNear, uFar);
float fogFactor = smoothstep(uFogNear, uFogFar, abs(viewZ));
float fogAlpha = (1.0 - fogFactor) * uAlpha;
float alpha = uAlpha;
#ifdef dXrayShaded
    // add bias to make picking xray shaded elements easier
    alpha = calcXrayShadedAlpha(alpha, normal) + (0.3 * uPickingAlphaThreshold);
#endif
// if not opaque enough ignore so the element below can be picked
if (alpha < uPickingAlphaThreshold || fogAlpha < 0.1) {
    #ifdef dTransparentBackfaces_opaque
        if (!interior) discard;
    #else
        discard;
    #endif
}
`,yo=`
#if defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
    #if defined(dTransparentBackfaces_off)
        if (interior && material.a < 1.0) discard;
    #elif defined(dTransparentBackfaces_opaque)
        if (interior) material.a = 1.0;
    #endif

    #if !defined(dXrayShaded)
        if ((uRenderMask == MaskOpaque && material.a < 1.0) ||
            (uRenderMask == MaskTransparent && material.a == 1.0)
        ) {
            discard;
        }
    #endif
#endif

#if defined(dRenderVariant_depth)
    #if defined(dTransparentBackfaces_off)
        if (interior) discard;
    #endif
#endif
`,_o=`
#if defined(dClipVariant_instance) && dClipObjectCount != 0
    vec3 mCenter = (uModel * aTransform * vec4(uInvariantBoundingSphere.xyz, 1.0)).xyz;
    if (clipTest(mCenter / uModelScale)) {
        // move out of [ -w, +w ] to 'discard' in vert shader
        gl_Position.z = 2.0 * gl_Position.w;
    }
#endif
`,To=`
#if defined(dClipVariant_pixel) && dClipObjectCount != 0
    if (clipTest(vModelPosition / uModelScale))
        discard;
#endif
`,xo=`
uniform float uMetalness;
uniform float uRoughness;
uniform float uBumpiness;
#ifdef bumpEnabled
    uniform float uBumpFrequency;
    uniform float uBumpAmplitude;
#endif
uniform float uEmissive;

// Density value to estimate object thickness
uniform float uDensity;

#if defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
    #if defined(dColorType_uniform)
        uniform vec3 uColor;
    #elif defined(dColorType_varying)
        varying vec4 vColor;
    #endif

    #ifdef dUsePalette
        uniform sampler2D tPalette;
        varying float vPaletteV;
    #endif

    #ifdef dOverpaint
        varying vec4 vOverpaint;
    #endif

    #ifdef dEmissive
        varying float vEmissive;
    #endif

    #ifdef dSubstance
        varying vec4 vSubstance;
    #endif
#elif defined(dRenderVariant_emissive)
    #ifdef dEmissive
        varying float vEmissive;
    #endif
#elif defined(dRenderVariant_pick)
    #if __VERSION__ == 100 || !defined(dVaryingGroup)
        #ifdef requiredDrawBuffers
            varying vec4 vObject;
            varying vec4 vInstance;
            varying vec4 vGroup;
        #else
            varying vec4 vColor;
        #endif
    #else
        #ifdef requiredDrawBuffers
            flat in vec4 vObject;
            flat in vec4 vInstance;
            flat in vec4 vGroup;
        #else
            flat in vec4 vColor;
        #endif
    #endif
#endif

#ifdef dTransparency
    varying float vTransparency;
#endif
`,Co=`
uniform float uMetalness;
uniform float uRoughness;
uniform float uBumpiness;

#if defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
    #if defined(dColorType_uniform)
        uniform vec3 uColor;
    #elif defined(dColorType_attribute)
        varying vec4 vColor;
        attribute vec3 aColor;
    #elif defined(dColorType_texture)
        varying vec4 vColor;
        uniform vec2 uColorTexDim;
        uniform sampler2D tColor;
    #elif defined(dColorType_grid)
        varying vec4 vColor;
        uniform vec2 uColorTexDim;
        uniform vec3 uColorGridDim;
        uniform vec4 uColorGridTransform;
        uniform sampler2D tColorGrid;
    #elif defined(dColorType_direct)
        varying vec4 vColor;
    #endif

    #ifdef dUsePalette
        varying float vPaletteV;
    #endif

    #ifdef dOverpaint
        #if defined(dOverpaintType_instance) || defined(dOverpaintType_groupInstance) || defined(dOverpaintType_vertexInstance)
            varying vec4 vOverpaint;
            uniform vec2 uOverpaintTexDim;
            uniform sampler2D tOverpaint;
        #elif defined(dOverpaintType_volumeInstance)
            varying vec4 vOverpaint;
            uniform vec2 uOverpaintTexDim;
            uniform vec3 uOverpaintGridDim;
            uniform vec4 uOverpaintGridTransform;
            uniform sampler2D tOverpaintGrid;
        #endif
        uniform float uOverpaintStrength;
    #endif

    #ifdef dEmissive
        #if defined(dEmissiveType_instance) || defined(dEmissiveType_groupInstance) || defined(dEmissiveType_vertexInstance)
            varying float vEmissive;
            uniform vec2 uEmissiveTexDim;
            uniform sampler2D tEmissive;
        #elif defined(dEmissiveType_volumeInstance)
            varying float vEmissive;
            uniform vec2 uEmissiveTexDim;
            uniform vec3 uEmissiveGridDim;
            uniform vec4 uEmissiveGridTransform;
            uniform sampler2D tEmissiveGrid;
        #endif
        uniform float uEmissiveStrength;
    #endif

    #ifdef dSubstance
        #if defined(dSubstanceType_instance) || defined(dSubstanceType_groupInstance) || defined(dSubstanceType_vertexInstance)
            varying vec4 vSubstance;
            uniform vec2 uSubstanceTexDim;
            uniform sampler2D tSubstance;
        #elif defined(dSubstanceType_volumeInstance)
            varying vec4 vSubstance;
            uniform vec2 uSubstanceTexDim;
            uniform vec3 uSubstanceGridDim;
            uniform vec4 uSubstanceGridTransform;
            uniform sampler2D tSubstanceGrid;
        #endif
        uniform float uSubstanceStrength;
    #endif
#elif defined(dRenderVariant_emissive)
    #ifdef dEmissive
        #if defined(dEmissiveType_instance) || defined(dEmissiveType_groupInstance) || defined(dEmissiveType_vertexInstance)
            varying float vEmissive;
            uniform vec2 uEmissiveTexDim;
            uniform sampler2D tEmissive;
        #elif defined(dEmissiveType_volumeInstance)
            varying float vEmissive;
            uniform vec2 uEmissiveTexDim;
            uniform vec3 uEmissiveGridDim;
            uniform vec4 uEmissiveGridTransform;
            uniform sampler2D tEmissiveGrid;
        #endif
        uniform float uEmissiveStrength;
    #endif
#elif defined(dRenderVariant_pick)
    #if __VERSION__ == 100 || !defined(dVaryingGroup)
        #ifdef requiredDrawBuffers
            varying vec4 vObject;
            varying vec4 vInstance;
            varying vec4 vGroup;
        #else
            varying vec4 vColor;
        #endif
    #else
        #ifdef requiredDrawBuffers
            flat out vec4 vObject;
            flat out vec4 vInstance;
            flat out vec4 vGroup;
        #else
            flat out vec4 vColor;
        #endif
    #endif
#endif

#ifdef dTransparency
    #if defined(dTransparencyType_instance) || defined(dTransparencyType_groupInstance) || defined(dTransparencyType_vertexInstance)
        varying float vTransparency;
        uniform vec2 uTransparencyTexDim;
        uniform sampler2D tTransparency;
    #elif defined(dTransparencyType_volumeInstance)
        varying float vTransparency;
        uniform vec2 uTransparencyTexDim;
        uniform vec3 uTransparencyGridDim;
        uniform vec4 uTransparencyGridTransform;
        uniform sampler2D tTransparencyGrid;
    #endif
    uniform float uTransparencyStrength;
#endif
`,So=`
uniform float uWiggleSpeed;
uniform float uWiggleAmplitude;
uniform float uWiggleFrequency;
uniform int uWiggleMode;
uniform float uTumbleSpeed;
uniform float uTumbleAmplitude;
uniform float uTumbleFrequency;

#ifdef dWiggle
    uniform vec2 uWiggleTexDim;
    uniform sampler2D tWiggle;
    uniform float uWiggleStrength;
#endif

vec3 applyWiggle(vec3 pos, float groupId, float instanceId) {
    if (!uEnableAnimation) return pos;
    float amplitude = uWiggleAmplitude;
    #ifdef dWiggle
        #if defined(dWiggleType_instance)
            amplitude += readFromTexture(tWiggle, instanceId, uWiggleTexDim).a * uWiggleStrength;
        #elif defined(dWiggleType_groupInstance)
            amplitude += readFromTexture(tWiggle, instanceId * float(uGroupCount) + groupId, uWiggleTexDim).a * uWiggleStrength;
        #endif
    #endif
    if (amplitude > 0.0 && uWiggleSpeed > 0.0 && uWiggleFrequency > 0.0) {
        float t = uTime * uWiggleSpeed;
        vec3 s;
        if (uWiggleMode == 0) {
            // Position mode: spatial position correlates nearby atoms
            s = pos;
        } else {
            // Group mode: per-group independent noise
            // Hash groupId into a well-distributed 3D seed to avoid repetition
            s = vec3(
                fract(sin(groupId * 127.1) * 43758.5453) * 1000.0,
                fract(sin(groupId * 269.5) * 21639.7182) * 1000.0,
                fract(sin(groupId * 419.2) * 32517.3926) * 1000.0
            );
        }
        s *= uWiggleFrequency;
        pos.x += (fbm(vec3(s.x, s.y + t, s.z)) / 0.4375 - 1.0) * amplitude;
        pos.y += (fbm(vec3(s.x + 37.0, s.y, s.z + t)) / 0.4375 - 1.0) * amplitude;
        pos.z += (fbm(vec3(s.x + t, s.y + 73.0, s.z)) / 0.4375 - 1.0) * amplitude;
    }
    return pos;
}

mat4 applyTumble(mat4 transform, float instanceIndex, float objectId) {
    if (!uEnableAnimation) return transform;
    if (uTumbleAmplitude > 0.0 && uTumbleSpeed > 0.0 && uTumbleFrequency > 0.0) {
        // Scale amplitude inversely with bounding-sphere radius (Stokes-Einstein: D ~ 1/r)
        float amplitude = uTumbleAmplitude / max(uInvariantBoundingSphere.w, 1.0);
        float t = uTime * uTumbleSpeed;
        float seed = (instanceIndex * 127.1 + objectId * 311.7) * uTumbleFrequency;

        // Per-instance rotation angles from layered noise (Brownian-like)
        float angleX = (fbm(vec3(seed, t, 0.0)) / 0.4375 - 1.0) * amplitude;
        float angleY = (fbm(vec3(seed, 0.0, t)) / 0.4375 - 1.0) * amplitude;
        float angleZ = (fbm(vec3(0.0, seed, t)) / 0.4375 - 1.0) * amplitude;

        float cx = cos(angleX); float sx = sin(angleX);
        float cy = cos(angleY); float sy = sin(angleY);
        float cz = cos(angleZ); float sz = sin(angleZ);

        // Combined rotation matrix (Rz * Ry * Rx)
        mat3 rot = mat3(
            cy * cz, cx * sz + sx * sy * cz, sx * sz - cx * sy * cz,
            -cy * sz, cx * cz - sx * sy * sz, sx * cz + cx * sy * sz,
            sy, -sx * cy, cx * cy
        );

        // Per-instance translation offset from layered noise (Brownian-like)
        vec3 offset = vec3(
            (fbm(vec3(seed + 31.7, t, 0.0)) / 0.4375 - 1.0),
            (fbm(vec3(seed + 31.7, 0.0, t)) / 0.4375 - 1.0),
            (fbm(vec3(0.0, seed + 31.7, t)) / 0.4375 - 1.0)
        ) * amplitude;

        // Bounding-sphere center transformed by the linear part only (no translation)
        vec3 localCenter = mat3(transform) * uInvariantBoundingSphere.xyz;

        // Rotate basis vectors
        mat4 result = transform;
        result[0].xyz = rot * transform[0].xyz;
        result[1].xyz = rot * transform[1].xyz;
        result[2].xyz = rot * transform[2].xyz;

        // Adjust translation so rotation pivots around the transformed center
        result[3].xyz = transform[3].xyz + localCenter - rot * localCenter + offset;

        return result;
    }
    return transform;
}
`,Eo=`
vec3 quaternionTransform(const in vec4 q, const in vec3 v) {
    vec3 t = 2.0 * cross(q.xyz, v);
    return v + q.w * t + cross(q.xyz, t);
}

vec4 computePlane(const in vec3 normal, const in vec3 inPoint) {
    return vec4(normalize(normal), -dot(normal, inPoint));
}

float planeSD(const in vec4 plane, const in vec3 center) {
    return -dot(plane.xyz, center - plane.xyz * -plane.w);
}

float sphereSD(const in vec3 position, const in vec4 rotation, const in vec3 size, const in vec3 center) {
    return (
        length(quaternionTransform(vec4(-rotation.x, -rotation.y, -rotation.z, rotation.w), center - position) / size) - 1.0
    ) * min(min(size.x, size.y), size.z);
}

float cubeSD(const in vec3 position, const in vec4 rotation, const in vec3 size, const in vec3 center) {
    vec3 d = abs(quaternionTransform(vec4(-rotation.x, -rotation.y, -rotation.z, rotation.w), center - position)) - size;
    return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

float cylinderSD(const in vec3 position, const in vec4 rotation, const in vec3 size, const in vec3 center) {
    vec3 t = quaternionTransform(vec4(-rotation.x, -rotation.y, -rotation.z, rotation.w), center - position);

    vec2 d = abs(vec2(length(t.xz), t.y)) - size.xy;
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

float infiniteConeSD(const in vec3 position, const in vec4 rotation, const in vec3 size, const in vec3 center) {
    vec3 t = quaternionTransform(vec4(-rotation.x, -rotation.y, -rotation.z, rotation.w), center - position);

    float q = length(t.xy);
    return dot(size.xy, vec2(q, t.z));
}

float getSignedDistance(const in vec3 center, const in int type, const in vec3 position, const in vec4 rotation, const in vec3 scale, const in mat4 transform) {
    vec3 c = (transform * vec4(center, 1.0)).xyz;
    if (type == 1) {
        vec3 normal = quaternionTransform(rotation, vec3(0.0, 1.0, 0.0));
        vec4 plane = computePlane(normal, position);
        return planeSD(plane, c);
    } else if (type == 2) {
        return sphereSD(position, rotation, scale * 0.5, c);
    } else if (type == 3) {
        return cubeSD(position, rotation, scale * 0.5, c);
    } else if (type == 4) {
        return cylinderSD(position, rotation, scale * 0.5, c);
    } else if (type == 5) {
        return infiniteConeSD(position, rotation, scale * 0.5, c);
    } else {
        return 0.1;
    }
}

#if __VERSION__ == 100
    // 8-bit
    int bitwiseAnd(in int a, in int b) {
        int d = 128;
        int result = 0;
        for (int i = 0; i < 8; ++i) {
            if (d <= 0) break;
            if (a >= d && b >= d) result += d;
            if (a >= d) a -= d;
            if (b >= d) b -= d;
            d /= 2;
        }
        return result;
    }

    bool hasBit(const in int mask, const in int bit) {
        return bitwiseAnd(mask, bit) == 0;
    }
#else
    bool hasBit(const in int mask, const in int bit) {
        return (mask & bit) == 0;
    }
#endif

#if dClipObjectCount != 0
    bool clipTest(const in vec3 center) {
        // flag is a bit-flag for clip-objects to ignore (note, object ids start at 1 not 0)
        #if defined(dClipping)
            int flag = int(floor(vClipping * 255.0 + 0.5));
        #else
            int flag = 0;
        #endif

        #pragma unroll_loop_start
        for (int i = 0; i < dClipObjectCount; ++i) {
            if (flag == 0 || hasBit(flag, UNROLLED_LOOP_INDEX + 1)) {
                bool test = getSignedDistance(center, uClipObjectType[i], uClipObjectPosition[i], uClipObjectRotation[i], uClipObjectScale[i], uClipObjectTransform[i]) <= 0.0;
                if ((!uClipObjectInvert[i] && test) || (uClipObjectInvert[i] && !test)) {
                    return true;
                }
            }
        }
        #pragma unroll_loop_end
        return false;
    }
#endif
`,Io=`
uniform int uObjectId;
uniform int uInstanceCount;
uniform int uGroupCount;

uniform int uPickType;
uniform int uMarkingType;

uniform vec4 uCameraPlane;
uniform vec4 uLod;

#if dClipObjectCount != 0
    uniform int uClipObjectType[dClipObjectCount];
    uniform bool uClipObjectInvert[dClipObjectCount];
    uniform vec3 uClipObjectPosition[dClipObjectCount];
    uniform vec4 uClipObjectRotation[dClipObjectCount];
    uniform vec3 uClipObjectScale[dClipObjectCount];
    uniform mat4 uClipObjectTransform[dClipObjectCount];

    #if defined(dClipping)
        #if __VERSION__ == 100 || defined(dClippingType_instance) || !defined(dVaryingGroup)
            varying float vClipping;
        #else
            flat in float vClipping;
        #endif
    #endif
#endif

#if defined(dColorMarker)
    uniform vec3 uHighlightColor;
    uniform vec3 uSelectColor;
    uniform vec3 uDimColor;
    uniform float uHighlightStrength;
    uniform float uSelectStrength;
    uniform float uDimStrength;
    uniform int uMarkerPriority;
    uniform float uMarkerAverage;
#endif

#if defined(dNeedsMarker)
    uniform float uMarker;
    #if __VERSION__ == 100 || defined(dMarkerType_instance) || !defined(dVaryingGroup)
        varying float vMarker;
    #else
        flat in float vMarker;
    #endif
#endif

#if defined(dRenderVariant_colorDpoit)
    #define MAX_DPOIT_DEPTH 99999.0 // NOTE constant also set in TypeScript
    uniform sampler2D tDpoitDepth;
    uniform sampler2D tDpoitFrontColor;
#endif

varying vec3 vModelPosition;
varying vec3 vViewPosition;

uniform vec2 uViewOffset;
uniform float uModelScale;

uniform float uNear;
uniform float uFar;
uniform float uIsOrtho;

uniform bool uFog;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uFogColor;

uniform float uAlpha;
uniform float uPickingAlphaThreshold;
uniform bool uTransparentBackground;

uniform bool uDoubleSided;
bool interior;

uniform float uXrayEdgeFalloff;
uniform float uCelSteps;
uniform float uExposure;

uniform mat4 uProjection;

uniform int uRenderMask;
uniform bool uMarkingDepthTest;

uniform sampler2D tDepth;
uniform vec2 uDrawingBufferSize;

float getDepthPacked(const in vec2 coords) {
    return unpackRGBAToDepth(texture2D(tDepth, coords));
}

float getDepth(const in vec2 coords) {
    #ifdef depthTextureSupport
        return texture2D(tDepth, coords).r;
    #else
        return unpackRGBAToDepth(texture2D(tDepth, coords));
    #endif
}

float calcDepth(const in vec3 pos) {
    vec2 clipZW = pos.z * uProjection[2].zw + uProjection[3].zw;
    return 0.5 + 0.5 * clipZW.x / clipZW.y;
}

// "Bump Mapping Unparametrized Surfaces on the GPU" Morten S. Mikkelsen
// https://mmikk.github.io/papers3d/mm_sfgrad_bump.pdf
vec3 perturbNormal(in vec3 position, in vec3 normal, in float height, in float scale) {
    vec3 sigmaS = dFdx(position);
    vec3 sigmaT = dFdy(position);

    vec3 r1 = cross(sigmaT, normal);
    vec3 r2 = cross(normal, sigmaS);
    float det = dot(sigmaS, r1);
    if (det == 0.0) return normal;

    float bs = dFdx(height);
    float bt = dFdy(height);

    vec3 surfGrad = sign(det) * (bs * r1 + bt * r2);
    return normalize(abs(det) * normal - scale * surfGrad);
}

#ifdef dXrayShaded
    float calcXrayShadedAlpha(in float alpha, const in vec3 normal) {
        #if defined(dXrayShaded_on)
            alpha *= 1.0 - pow(abs(dot(normal, vec3(0.0, 0.0, 1.0))), uXrayEdgeFalloff);
        #elif defined(dXrayShaded_inverted)
            alpha *= pow(abs(dot(normal, vec3(0.0, 0.0, 1.0))), uXrayEdgeFalloff);
        #endif
        return clamp(alpha, 0.001, 0.999);
    }
#endif
`,Ao=`
uniform mat4 uProjection, uModel, uView;
uniform vec3 uCameraPosition;
uniform vec4 uCameraPlane;

uniform int uObjectId;
uniform int uVertexCount;
uniform int uInstanceCount;
uniform int uGroupCount;
uniform vec4 uInvariantBoundingSphere;
uniform vec4 uLod;

uniform bool uDoubleSided;
uniform int uPickType;
uniform float uTime;
uniform bool uEnableAnimation;

#if dClipObjectCount != 0
    uniform int uClipObjectType[dClipObjectCount];
    uniform bool uClipObjectInvert[dClipObjectCount];
    uniform vec3 uClipObjectPosition[dClipObjectCount];
    uniform vec4 uClipObjectRotation[dClipObjectCount];
    uniform vec3 uClipObjectScale[dClipObjectCount];
    uniform mat4 uClipObjectTransform[dClipObjectCount];

    #if defined(dClipping)
        uniform vec2 uClippingTexDim;
        uniform sampler2D tClipping;
        #if __VERSION__ == 100 || defined(dClippingType_instance) || !defined(dVaryingGroup)
            varying float vClipping;
        #else
            flat out float vClipping;
        #endif
    #endif
#endif

#if defined(dNeedsMarker)
    uniform float uMarker;
    uniform vec2 uMarkerTexDim;
    uniform sampler2D tMarker;
    #if __VERSION__ == 100 || defined(dMarkerType_instance) || !defined(dVaryingGroup)
        varying float vMarker;
    #else
        flat out float vMarker;
    #endif
#endif

varying vec3 vModelPosition;
varying vec3 vViewPosition;

uniform float uModelScale;

#if defined(noNonInstancedActiveAttribs)
    // int() is needed for some Safari versions
    // see https://bugs.webkit.org/show_bug.cgi?id=244152
    #define VertexID int(gl_VertexID)
#else
    attribute float aVertex;
    #define VertexID int(aVertex)
#endif

#if defined(enabledMultiDraw)
    #define DrawID gl_DrawID
#else
    #define DrawID uDrawId
#endif
`,Do=`
// TODO find a better place for these convenience defines

#if defined(dRenderVariant_colorBlended) || defined(dRenderVariant_colorWboit) || defined(dRenderVariant_colorDpoit)
    #define dRenderVariant_color
#endif

#if defined(dColorType_instance) || defined(dColorType_group) || defined(dColorType_groupInstance) || defined(dColorType_vertex) || defined(dColorType_vertexInstance)
    #define dColorType_texture
#endif

#if defined(dColorType_volume) || defined(dColorType_volumeInstance)
    #define dColorType_grid
#endif

#if defined(dColorType_attribute) || defined(dColorType_texture) || defined(dColorType_grid)
    #define dColorType_varying
#endif

#if ((defined(dRenderVariant_color) || defined(dRenderVariant_tracing)) && defined(dColorMarker)) || defined(dRenderVariant_marking)
    #define dNeedsMarker
#endif

#if defined(dXrayShaded_on) || defined(dXrayShaded_inverted)
    #define dXrayShaded
#endif

#if defined(dRenderVariant_color) || defined(dRenderVariant_tracing) || ((defined(dRenderVariant_depth) || defined(dRenderVariant_pick)) && defined(dXrayShaded))
    #define dNeedsNormal
#endif

#define MaskAll 0
#define MaskOpaque 1
#define MaskTransparent 2

//

#define PI 3.14159265
#define RECIPROCAL_PI 0.31830988618
#define EPSILON 1e-6
#define ONE_MINUS_EPSILON 1.0 - EPSILON
#define TWO_PI 6.2831853
#define HALF_PI 1.570796325

#define PALETTE_SCALE 16777214.0 // (1 << 24) - 2

#define saturate(a) clamp(a, 0.0, 1.0)

#if __VERSION__ == 100
    #define round(x) floor((x) + 0.5)
#endif

float intDiv(const in float a, const in float b) { return float(int(a) / int(b)); }
vec2 ivec2Div(const in vec2 a, const in vec2 b) { return vec2(ivec2(a) / ivec2(b)); }
float intMod(const in float a, const in float b) { return a - b * float(int(a) / int(b)); }
int imod(const in int a, const in int b) { return a - b * (a / b); }

float pow2(const in float x) { return x * x; }

vec3 packIntToRGB(in float value) {
    value = clamp(round(value), 0.0, 16777216.0 - 1.0) + 1.0;
    vec3 c = vec3(0.0);
    c.b = mod(value, 256.0);
    value = floor(value / 256.0);
    c.g = mod(value, 256.0);
    value = floor(value / 256.0);
    c.r = mod(value, 256.0);
    return c / 255.0;
}
float unpackRGBToInt(const in vec3 rgb) {
    return (floor(rgb.r * 255.0 + 0.5) * 256.0 * 256.0 + floor(rgb.g * 255.0 + 0.5) * 256.0 + floor(rgb.b * 255.0 + 0.5)) - 1.0;
}

vec2 packUnitIntervalToRG(const in float v) {
    vec2 enc;
    enc.xy = vec2(fract(v * 256.0), v);
    enc.y -= enc.x * (1.0 / 256.0);
    enc.xy *=  256.0 / 255.0;

    return enc;
}

float unpackRGToUnitInterval(const in vec2 enc) {
    return dot(enc, vec2(255.0 / (256.0 * 256.0), 255.0 / 256.0));
}

float pack2x4(vec2 v) {
    vec2 clamped_v = clamp(v, 0.0, 1.0);
    vec2 scaled_v = floor(clamped_v * 15.0 + 0.5); // round to 0–15
    float c = scaled_v.x + scaled_v.y * 16.0;
    return c / 255.0;
}

vec2 unpack2x4(float f) {
    float c = floor(f * 255.0 + 0.5);
    float lo = mod(c, 16.0);
    float hi = floor(c / 16.0);
    return vec2(lo, hi) / 15.0;
}

vec3 screenSpaceToViewSpace(const in vec3 ssPos, const in mat4 invProjection) {
    vec4 p = vec4(ssPos * 2.0 - 1.0, 1.0);
    p = invProjection * p;
    return p.xyz / p.w;
}

const float PackUpscale = 256.0 / 255.0; // fraction -> 0..1 (including 1)
const float UnpackDownscale = 255.0 / 256.0; // 0..1 -> fraction (excluding 1)
const vec3 PackFactors = vec3(256.0 * 256.0 * 256.0, 256.0 * 256.0,  256.0);
const vec4 UnpackFactors = UnpackDownscale / vec4(PackFactors, 1.0);
const float ShiftRight8 = 1.0 / 256.0;

vec4 packDepthToRGBA(const in float v) {
    vec4 r = vec4(fract(v * PackFactors), v);
    r.yzw -= r.xyz * ShiftRight8; // tidy overflow
    return r * PackUpscale;
}
float unpackRGBAToDepth(const in vec4 v) {
    return dot(v, UnpackFactors);
}

vec4 packDepthWithAlphaToRGBA(const in float depth, const in float alpha){
    vec3 r = vec3(fract(depth * PackFactors.yz), depth);
    r.yz -= r.xy * ShiftRight8; // tidy overflow
    return vec4(r * PackUpscale, alpha);
}
vec2 unpackRGBAToDepthWithAlpha(const in vec4 v) {
    return vec2(dot(v.xyz, UnpackFactors.yzw), v.w);
}

vec4 sRGBToLinear(const in vec4 c) {
    return vec4(mix(pow(c.rgb * 0.9478672986 + vec3(0.0521327014), vec3(2.4)), c.rgb * 0.0773993808, vec3(lessThanEqual(c.rgb, vec3(0.04045)))), c.a);
}
vec4 linearTosRGB(const in vec4 c) {
    return vec4(mix(pow(c.rgb, vec3(0.41666)) * 1.055 - vec3(0.055), c.rgb * 12.92, vec3(lessThanEqual(c.rgb, vec3(0.0031308)))), c.a);
}

float luminance(vec3 c) {
    // https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
    const vec3 W = vec3(0.2125, 0.7154, 0.0721);
    return dot(c, W);
}

float linearizeDepth(const in float depth, const in float near, const in float far) {
    return (2.0 * near) / (far + near - depth * (far - near));
}

float perspectiveDepthToViewZ(const in float invClipZ, const in float near, const in float far) {
    return (near * far) / ((far - near) * invClipZ - far);
}

float orthographicDepthToViewZ(const in float linearClipZ, const in float near, const in float far) {
    return linearClipZ * (near - far) - near;
}

float depthToViewZ(const in float isOrtho, const in float linearClipZ, const in float near, const in float far) {
    return isOrtho == 1.0 ? orthographicDepthToViewZ(linearClipZ, near, far) : perspectiveDepthToViewZ(linearClipZ, near, far);
}

// see https://github.com/graphitemaster/normals_revisited and https://www.shadertoy.com/view/3s33zj
mat3 adjoint(const in mat4 m) {
    return mat3(
        cross(m[1].xyz, m[2].xyz),
        cross(m[2].xyz, m[0].xyz),
        cross(m[0].xyz, m[1].xyz)
    );
}

#if __VERSION__ == 100
    // transpose

    float transpose(const in float m) {
        return m;
    }

    mat2 transpose2(const in mat2 m) {
        return mat2(
            m[0][0], m[1][0],
            m[0][1], m[1][1]
        );
    }

    mat3 transpose3(const in mat3 m) {
        return mat3(
            m[0][0], m[1][0], m[2][0],
            m[0][1], m[1][1], m[2][1],
            m[0][2], m[1][2], m[2][2]
        );
    }

    mat4 transpose4(const in mat4 m) {
        return mat4(
            m[0][0], m[1][0], m[2][0], m[3][0],
            m[0][1], m[1][1], m[2][1], m[3][1],
            m[0][2], m[1][2], m[2][2], m[3][2],
            m[0][3], m[1][3], m[2][3], m[3][3]
        );
    }

    // inverse

    float inverse(const in float m) {
        return 1.0 / m;
    }

    mat2 inverse2(const in mat2 m) {
        return mat2(m[1][1],-m[0][1],
                -m[1][0], m[0][0]) / (m[0][0]*m[1][1] - m[0][1]*m[1][0]);
    }

    mat3 inverse3(const in mat3 m) {
        float a00 = m[0][0], a01 = m[0][1], a02 = m[0][2];
        float a10 = m[1][0], a11 = m[1][1], a12 = m[1][2];
        float a20 = m[2][0], a21 = m[2][1], a22 = m[2][2];

        float b01 = a22 * a11 - a12 * a21;
        float b11 = -a22 * a10 + a12 * a20;
        float b21 = a21 * a10 - a11 * a20;

        float det = a00 * b01 + a01 * b11 + a02 * b21;

        return mat3(b01, (-a22 * a01 + a02 * a21), (a12 * a01 - a02 * a11),
                    b11, (a22 * a00 - a02 * a20), (-a12 * a00 + a02 * a10),
                    b21, (-a21 * a00 + a01 * a20), (a11 * a00 - a01 * a10)) / det;
    }

    mat4 inverse4(const in mat4 m) {
        float
            a00 = m[0][0], a01 = m[0][1], a02 = m[0][2], a03 = m[0][3],
            a10 = m[1][0], a11 = m[1][1], a12 = m[1][2], a13 = m[1][3],
            a20 = m[2][0], a21 = m[2][1], a22 = m[2][2], a23 = m[2][3],
            a30 = m[3][0], a31 = m[3][1], a32 = m[3][2], a33 = m[3][3],

            b00 = a00 * a11 - a01 * a10,
            b01 = a00 * a12 - a02 * a10,
            b02 = a00 * a13 - a03 * a10,
            b03 = a01 * a12 - a02 * a11,
            b04 = a01 * a13 - a03 * a11,
            b05 = a02 * a13 - a03 * a12,
            b06 = a20 * a31 - a21 * a30,
            b07 = a20 * a32 - a22 * a30,
            b08 = a20 * a33 - a23 * a30,
            b09 = a21 * a32 - a22 * a31,
            b10 = a21 * a33 - a23 * a31,
            b11 = a22 * a33 - a23 * a32,

            det = b00 * b11 - b01 * b10 + b02 * b09 + b03 * b08 - b04 * b07 + b05 * b06;

        return mat4(
            a11 * b11 - a12 * b10 + a13 * b09,
            a02 * b10 - a01 * b11 - a03 * b09,
            a31 * b05 - a32 * b04 + a33 * b03,
            a22 * b04 - a21 * b05 - a23 * b03,
            a12 * b08 - a10 * b11 - a13 * b07,
            a00 * b11 - a02 * b08 + a03 * b07,
            a32 * b02 - a30 * b05 - a33 * b01,
            a20 * b05 - a22 * b02 + a23 * b01,
            a10 * b10 - a11 * b08 + a13 * b06,
            a01 * b08 - a00 * b10 - a03 * b06,
            a30 * b04 - a31 * b02 + a33 * b00,
            a21 * b02 - a20 * b04 - a23 * b00,
            a11 * b07 - a10 * b09 - a12 * b06,
            a00 * b09 - a01 * b07 + a02 * b06,
            a31 * b01 - a30 * b03 - a32 * b00,
            a20 * b03 - a21 * b01 + a22 * b00) / det;
    }

    #define isNaN(x) ((x) != (x))
    #define isInf(x) ((x) == (x) + 1.0)
#else
    #define transpose2(m) transpose(m)
    #define transpose3(m) transpose(m)
    #define transpose4(m) transpose(m)

    #define inverse2(m) inverse(m)
    #define inverse3(m) inverse(m)
    #define inverse4(m) inverse(m)

    #define isNaN isnan
    #define isInf isinf
#endif

float hash(in float h) {
    return fract(sin(h) * 43758.5453123);
}

float noise(in vec3 x) {
    vec3 p = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);

    float n = p.x + p.y * 157.0 + 113.0 * p.z;
    return mix(
        mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
            mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
        mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
            mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y), f.z);
}

float fbm(in vec3 p) {
    float f = 0.0;
    f += 0.5 * noise(p);
    p *= 2.01;
    f += 0.25 * noise(p);
    p *= 2.02;
    f += 0.125 * noise(p);

    return f;
}
`,Ro=`
if (uLod.w == 0.0 && (uLod.x != 0.0 || uLod.y != 0.0)) {
    float d = (dot(uCameraPlane.xyz, vModelPosition) + uCameraPlane.w) / uModelScale;
    float ta = min(
        smoothstep(uLod.x, uLod.x + uLod.z, d),
        1.0 - smoothstep(uLod.y - uLod.z, uLod.y, d)
    );

    #if defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
        float at = 0.0;

        // shift by view-offset during multi-sample rendering to allow for blending
        vec2 coord = gl_FragCoord.xy + uViewOffset * 0.25;

        const mat4 thresholdMatrix = mat4(
            1.0 / 17.0,  9.0 / 17.0,  3.0 / 17.0, 11.0 / 17.0,
            13.0 / 17.0,  5.0 / 17.0, 15.0 / 17.0,  7.0 / 17.0,
            4.0 / 17.0, 12.0 / 17.0,  2.0 / 17.0, 10.0 / 17.0,
            16.0 / 17.0,  8.0 / 17.0, 14.0 / 17.0,  6.0 / 17.0
        );
        int ci = int(intMod(coord.x, 4.0));
        int ri = int(intMod(coord.y, 4.0));
        #if __VERSION__ == 100
            vec4 i = vec4(float(ci * 4 + ri));
            vec4 v = thresholdMatrix[0] * vec4(equal(i, vec4(0.0, 1.0, 2.0, 3.0))) +
                thresholdMatrix[1] * vec4(equal(i, vec4(4.0, 5.0, 6.0, 7.0))) +
                thresholdMatrix[2] * vec4(equal(i, vec4(8.0, 9.0, 10.0, 11.0))) +
                thresholdMatrix[3] * vec4(equal(i, vec4(12.0, 13.0, 14.0, 15.0)));
            at = v.x + v.y + v.z + v.w;
        #else
            at = thresholdMatrix[ci][ri];
        #endif

        if (ta < 0.99 && (ta < 0.01 || ta < at)) {
            discard;
        }
    #else
        if (ta < uPickingAlphaThreshold) {
            discard;
        }
    #endif
}
`,wo=`
    // floatToRgba adapted from https://github.com/equinor/glsl-float-to-rgba
    // MIT License, Copyright (c) 2020 Equinor

    float shiftRight (float v, float amt) {
    v = floor(v) + 0.5;
    return floor(v / exp2(amt));
    }
    float shiftLeft (float v, float amt) {
        return floor(v * exp2(amt) + 0.5);
    }
    float maskLast (float v, float bits) {
        return mod(v, shiftLeft(1.0, bits));
    }
    float extractBits (float num, float from, float to) {
        from = floor(from + 0.5); to = floor(to + 0.5);
        return maskLast(shiftRight(num, from), to - from);
    }

    vec4 floatToRgba(float texelFloat, bool littleEndian) {
        if (texelFloat == 0.0) return vec4(0.0, 0.0, 0.0, 0.0);
        float sign = texelFloat > 0.0 ? 0.0 : 1.0;
        texelFloat = abs(texelFloat);
        float exponent = floor(log2(texelFloat));
        float biased_exponent = exponent + 127.0;
        float fraction = ((texelFloat / exp2(exponent)) - 1.0) * 8388608.0;
        float t = biased_exponent / 2.0;
        float last_bit_of_biased_exponent = fract(t) * 2.0;
        float remaining_bits_of_biased_exponent = floor(t);
        float byte4 = extractBits(fraction, 0.0, 8.0) / 255.0;
        float byte3 = extractBits(fraction, 8.0, 16.0) / 255.0;
        float byte2 = (last_bit_of_biased_exponent * 128.0 + extractBits(fraction, 16.0, 23.0)) / 255.0;
        float byte1 = (sign * 128.0 + remaining_bits_of_biased_exponent) / 255.0;
        return (
            littleEndian
                ? vec4(byte4, byte3, byte2, byte1)
                : vec4(byte1, byte2, byte3, byte4)
        );
    }
`,Bo=`
#if dLightCount != 0
    uniform vec3 uLightDirection[dLightCount];
    uniform vec3 uLightColor[dLightCount];
#endif
uniform vec3 uAmbientColor;

struct PhysicalMaterial {
    vec3 diffuseColor;
    float roughness;
    vec3 specularColor;
    float specularF90;
};

struct IncidentLight {
    vec3 color;
    vec3 direction;
};

struct ReflectedLight {
    vec3 directDiffuse;
    vec3 directSpecular;
    vec3 indirectDiffuse;
    vec3 indirectSpecular;
};

struct GeometricContext {
    vec3 position;
    vec3 normal;
    vec3 viewDir;
};

vec3 BRDF_Lambert(const in vec3 diffuseColor) {
    return RECIPROCAL_PI * diffuseColor;
}

vec3 F_Schlick(const in vec3 f0, const in float f90, const in float dotVH) {
    // Original approximation by Christophe Schlick '94
    // float fresnel = pow( 1.0 - dotVH, 5.0 );
    // Optimized variant (presented by Epic at SIGGRAPH '13)
    // https://cdn2.unrealengine.com/Resources/files/2013SiggraphPresentationsNotes-26915738.pdf
    float fresnel = exp2((-5.55473 * dotVH - 6.98316) * dotVH);
    return f0 * (1.0 - fresnel) + (f90 * fresnel);
}

// Moving Frostbite to Physically Based Rendering 3.0 - page 12, listing 2
// https://seblagarde.files.wordpress.com/2015/07/course_notes_moving_frostbite_to_pbr_v32.pdf
float V_GGX_SmithCorrelated(const in float alpha, const in float dotNL, const in float dotNV) {
    float a2 = pow2(alpha);
    float gv = dotNL * sqrt(a2 + (1.0 - a2) * pow2(dotNV));
    float gl = dotNV * sqrt(a2 + (1.0 - a2) * pow2(dotNL));
    return 0.5 / max(gv + gl, EPSILON);
}

// Microfacet Models for Refraction through Rough Surfaces - equation (33)
// http://graphicrants.blogspot.com/2013/08/specular-brdf-reference.html
// alpha is "roughness squared" in Disney’s reparameterization
float D_GGX(const in float alpha, const in float dotNH) {
    float a2 = pow2(alpha);
    float denom = pow2(dotNH) * (a2 - 1.0) + 1.0; // avoid alpha = 0 with dotNH = 1
    return RECIPROCAL_PI * a2 / pow2(denom);
}

// GGX Distribution, Schlick Fresnel, GGX_SmithCorrelated Visibility
vec3 BRDF_GGX(const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 f0, const in float f90, const in float roughness) {
    float alpha = pow2(roughness); // UE4's roughness
    vec3 halfDir = normalize( lightDir + viewDir);
    float dotNL = saturate(dot(normal, lightDir));
    float dotNV = saturate(dot(normal, viewDir));
    float dotNH = saturate(dot(normal, halfDir));
    float dotVH = saturate(dot(viewDir, halfDir));
    vec3 F = F_Schlick(f0, f90, dotVH);
    float V = V_GGX_SmithCorrelated(alpha, dotNL, dotNV);
    float D = D_GGX(alpha, dotNH);
    return F * (V * D);
}

// Analytical approximation of the DFG LUT, one half of the
// split-sum approximation used in indirect specular lighting.
// via 'environmentBRDF' from "Physically Based Shading on Mobile"
// https://www.unrealengine.com/blog/physically-based-shading-on-mobile
vec2 DFGApprox(const in vec3 normal, const in vec3 viewDir, const in float roughness) {
    float dotNV = saturate(dot(normal, viewDir));
    const vec4 c0 = vec4(-1, -0.0275, -0.572, 0.022);
    const vec4 c1 = vec4(1, 0.0425, 1.04, -0.04);
    vec4 r = roughness * c0 + c1;
    float a004 = min(r.x * r.x, exp2(-9.28 * dotNV)) * r.x + r.y;
    vec2 fab = vec2(-1.04, 1.04) * a004 + r.zw;
    return fab;
}

// Fdez-Agüera's "Multiple-Scattering Microfacet Model for Real-Time Image Based Lighting"
// Approximates multiscattering in order to preserve energy.
// http://www.jcgt.org/published/0008/01/03/
void computeMultiscattering(const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter) {
    vec2 fab = DFGApprox(normal, viewDir, roughness);
    vec3 FssEss = specularColor * fab.x + specularF90 * fab.y;
    float Ess = fab.x + fab.y;
    float Ems = 1.0 - Ess;
    vec3 Favg = specularColor + (1.0 - specularColor) * 0.047619; // 1/21
    vec3 Fms = FssEss * Favg / (1.0 - Ems * Favg);
    singleScatter += FssEss;
    multiScatter += Fms * Ems;
}

void RE_Direct_Physical(const in IncidentLight directLight, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
    float dotNL = saturate(dot(geometry.normal, directLight.direction));
    vec3 irradiance = dotNL * directLight.color;
    reflectedLight.directSpecular += irradiance * BRDF_GGX(directLight.direction, geometry.viewDir, geometry.normal, material.specularColor, material.specularF90, material.roughness);
    reflectedLight.directDiffuse += irradiance * BRDF_Lambert(material.diffuseColor);
}

void RE_IndirectDiffuse_Physical(const in vec3 irradiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
    reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert(material.diffuseColor);
}

void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in GeometricContext geometry, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
    // Both indirect specular and indirect diffuse light accumulate here
    vec3 singleScattering = vec3(0.0);
    vec3 multiScattering = vec3(0.0);
    vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
    computeMultiscattering(geometry.normal, geometry.viewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering);
    vec3 diffuse = material.diffuseColor * (1.0 - ( singleScattering + multiScattering));
    reflectedLight.indirectSpecular += radiance * singleScattering;
    reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
    reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
`,Fo=`
varying vec3 vNormal;
`,Po=`
vec4 readFromTexture(const in sampler2D tex, const in float i, const in vec2 dim) {
    float x = intMod(i, dim.x);
    float y = floor(intDiv(i, dim.x));
    vec2 uv = (vec2(x, y) + 0.5) / dim;
    return texture2D(tex, uv);
}

vec4 readFromTexture(const in sampler2D tex, const in int i, const in vec2 dim) {
    int x = imod(i, int(dim.x));
    int y = i / int(dim.x);
    vec2 uv = (vec2(x, y) + 0.5) / dim;
    return texture2D(tex, uv);
}
`,Lo=`
    // rgbaToFloat adapted from https://github.com/ihmeuw/glsl-rgba-to-float
    // BSD 3-Clause License
    //
    // Copyright (c) 2019, Institute for Health Metrics and Evaluation All rights reserved.
    // Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:
    //  - Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
    //  - Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
    //  - Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.
    //
    // THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES,
    // INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
    // IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY,
    // OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA,
    // OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY,
    // OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED
    // OF THE POSSIBILITY OF SUCH DAMAGE.

    ivec4 floatsToBytes(vec4 inputFloats, bool littleEndian) {
        ivec4 bytes = ivec4(inputFloats * 255.0);
        return (
            littleEndian
                ? bytes.abgr
                : bytes
        );
    }

    // Break the four bytes down into an array of 32 bits.
    void bytesToBits(const in ivec4 bytes, out bool bits[32]) {
        for (int channelIndex = 0; channelIndex < 4; ++channelIndex) {
            float acc = float(bytes[channelIndex]);
            for (int indexInByte = 7; indexInByte >= 0; --indexInByte) {
                float powerOfTwo = exp2(float(indexInByte));
                bool bit = acc >= powerOfTwo;
                bits[channelIndex * 8 + (7 - indexInByte)] = bit;
                acc = mod(acc, powerOfTwo);
            }
        }
    }

    // Compute the exponent of the 32-bit float.
    float getExponent(bool bits[32]) {
        const int startIndex = 1;
        const int bitStringLength = 8;
        const int endBeforeIndex = startIndex + bitStringLength;
        float acc = 0.0;
        int pow2 = bitStringLength - 1;
        for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {
            acc += float(bits[bitIndex]) * exp2(float(pow2--));
        }
        return acc;
    }

    // Compute the mantissa of the 32-bit float.
    float getMantissa(bool bits[32], bool subnormal) {
        const int startIndex = 9;
        const int bitStringLength = 23;
        const int endBeforeIndex = startIndex + bitStringLength;
        // Leading/implicit/hidden bit convention:
        // If the number is not subnormal (with exponent 0), we add a leading 1 digit.
        float acc = float(!subnormal) * exp2(float(bitStringLength));
        int pow2 = bitStringLength - 1;
        for (int bitIndex = startIndex; bitIndex < endBeforeIndex; ++bitIndex) {
            acc += float(bits[bitIndex]) * exp2(float(pow2--));
        }
        return acc;
    }

    // Parse the float from its 32 bits.
    float bitsToFloat(bool bits[32]) {
        float signBit = float(bits[0]) * -2.0 + 1.0;
        float exponent = getExponent(bits);
        bool subnormal = abs(exponent - 0.0) < 0.01;
        float mantissa = getMantissa(bits, subnormal);
        float exponentBias = 127.0;
        return signBit * mantissa * exp2(exponent - exponentBias - 23.0);
    }

    float rgbaToFloat(vec4 texelRGBA, bool littleEndian) {
        ivec4 rgbaBytes = floatsToBytes(texelRGBA, littleEndian);
        bool bits[32];
        bytesToBits(rgbaBytes, bits);
        return bitsToFloat(bits);
    }
`,Oo=`
#if defined(dSizeType_uniform)
    uniform float uSize;
#elif defined(dSizeType_attribute)
    attribute float aSize;
#elif defined(dSizeType_instance) || defined(dSizeType_group) || defined(dSizeType_groupInstance) || defined(dSizeType_vertex) || defined(dSizeType_vertexInstance)
    uniform vec2 uSizeTexDim;
    uniform sampler2D tSize;
#endif

uniform float uSizeFactor;
`,Mo=`
vec4 texture3dFrom1dTrilinear(const in sampler2D tex, const in vec3 pos, const in vec3 gridDim, const in vec2 texDim, const in float offset) {
    float gdYZ = gridDim.z * gridDim.y;
    float gdZ = gridDim.z;
    vec3 p0 = floor(pos * gridDim);
    vec3 p1 = ceil(pos * gridDim);
    vec3 pd = (pos * gridDim - p0) / (p1 - p0);
    vec4 s000 = readFromTexture(tex, offset + p0.z + p0.y * gdZ + p0.x * gdYZ, texDim);
    vec4 s100 = readFromTexture(tex, offset + p0.z + p0.y * gdZ + p1.x * gdYZ, texDim);
    vec4 s001 = readFromTexture(tex, offset + p1.z + p0.y * gdZ + p0.x * gdYZ, texDim);
    vec4 s101 = readFromTexture(tex, offset + p1.z + p0.y * gdZ + p1.x * gdYZ, texDim);
    vec4 s010 = readFromTexture(tex, offset + p0.z + p1.y * gdZ + p0.x * gdYZ, texDim);
    vec4 s110 = readFromTexture(tex, offset + p0.z + p1.y * gdZ + p1.x * gdYZ, texDim);
    vec4 s011 = readFromTexture(tex, offset + p1.z + p1.y * gdZ + p0.x * gdYZ, texDim);
    vec4 s111 = readFromTexture(tex, offset + p1.z + p1.y * gdZ + p1.x * gdYZ, texDim);
    vec4 s00 = mix(s000, s100, pd.x);
    vec4 s01 = mix(s001, s101, pd.x);
    vec4 s10 = mix(s010, s110, pd.x);
    vec4 s11 = mix(s011, s111, pd.x);
    vec4 s0 = mix(s00, s10, pd.y);
    vec4 s1 = mix(s01, s11, pd.y);
    return mix(s0, s1, pd.z);
}
`,No=`
vec4 texture3dFrom2dLinear(sampler2D tex, vec3 pos, vec3 gridDim, vec2 texDim) {
    float zSlice0 = floor(pos.z * gridDim.z);
    float column0 = intMod(zSlice0 * gridDim.x, texDim.x) / gridDim.x;
    float row0 = floor(intDiv(zSlice0 * gridDim.x, texDim.x));
    vec2 coord0 = (vec2(column0 * gridDim.x, row0 * gridDim.y) + (pos.xy * gridDim.xy)) / texDim;
    vec4 color0 = texture2D(tex, coord0);

    float zSlice1 = zSlice0 + 1.0;
    float column1 = intMod(zSlice1 * gridDim.x, texDim.x) / gridDim.x;
    float row1 = floor(intDiv(zSlice1 * gridDim.x, texDim.x));
    vec2 coord1 = (vec2(column1 * gridDim.x, row1 * gridDim.y) + (pos.xy * gridDim.xy)) / texDim;
    vec4 color1 = texture2D(tex, coord1);

    float delta0 = abs((pos.z * gridDim.z) - zSlice0);
    return mix(color0, color1, delta0);
}
`,Go=`
vec4 texture3dFrom2dNearest(sampler2D tex, vec3 pos, vec3 gridDim, vec2 texDim) {
    float zSlice = floor(pos.z * gridDim.z + 0.5); // round to nearest z-slice
    float column = intMod(zSlice * gridDim.x, texDim.x) / gridDim.x;
    float row = floor(intDiv(zSlice * gridDim.x, texDim.x));
    vec2 coord = (vec2(column * gridDim.x, row * gridDim.y) + (pos.xy * gridDim.xy)) / texDim;
    return texture2D(tex, coord);
}
`,ko=`
#if defined(dRenderVariant_colorWboit)
    if (uRenderMask == MaskOpaque) {
        if (preFogAlpha < 1.0) {
            discard;
        }
    } else if (uRenderMask == MaskTransparent) {
        if (preFogAlpha != 1.0 && fragmentDepth < getDepth(gl_FragCoord.xy / uDrawingBufferSize)) {
            #ifdef dTransparentBackfaces_off
                if (interior) discard;
            #endif
            float alpha = gl_FragColor.a;
            float wboitWeight = alpha * clamp(pow(1.0 - fragmentDepth, 2.0), 0.01, 1.0);
            gl_FragColor = vec4(gl_FragColor.rgb * alpha * wboitWeight, alpha);
            // extra alpha is to handle pre-multiplied alpha
            #ifndef dGeometryType_directVolume
                gl_FragData[1] = vec4((uTransparentBackground ? alpha : 1.0) * alpha * wboitWeight);
            #else
                gl_FragData[1] = vec4(alpha * alpha * wboitWeight);
            #endif
        } else {
            discard;
        }
    }
#endif
`,Vo=`
#if defined(dRenderVariant_colorDpoit)
    if (uRenderMask == MaskOpaque) {
        if (preFogAlpha < 1.0) {
            discard;
        }
    } else if (uRenderMask == MaskTransparent) {
        vec2 coords = gl_FragCoord.xy / uDrawingBufferSize;
        if (preFogAlpha != 1.0 && fragmentDepth < getDepth(coords)) {
            #ifdef dTransparentBackfaces_off
                if (interior) discard;
            #endif

            // adapted from https://github.com/tsherif/webgl2examples
            // The MIT License, Copyright 2017 Tarek Sherif, Shuai Shao

            vec2 lastDepth = texture2D(tDpoitDepth, coords).rg;
            vec4 lastFrontColor = texture2D(tDpoitFrontColor, coords);

            vec4 fragColor = gl_FragColor;

            // depth value always increases
            // so we can use MAX blend equation
            gl_FragData[2].rg = vec2(-MAX_DPOIT_DEPTH);

            // front color always increases
            // so we can use MAX blend equation
            gl_FragColor = lastFrontColor;

            // back color is separately blend afterwards each pass
            gl_FragData[1] = vec4(0.0);

            float nearestDepth = -lastDepth.x;
            float furthestDepth = lastDepth.y;
            float alphaMultiplier = 1.0 - lastFrontColor.a;

            if (fragmentDepth < nearestDepth || fragmentDepth > furthestDepth) {
                // Skip this depth since it's been peeled.
                return;
            }

            if (fragmentDepth > nearestDepth && fragmentDepth < furthestDepth) {
                // This needs to be peeled.
                // The ones remaining after MAX blended for
                // all need-to-peel will be peeled next pass.
                gl_FragData[2].rg = vec2(-fragmentDepth, fragmentDepth);
                return;
            }

            // write to back and front color buffer
            if (fragmentDepth == nearestDepth) {
                gl_FragColor.rgb += fragColor.rgb * fragColor.a * alphaMultiplier;
                gl_FragColor.a = 1.0 - alphaMultiplier * (1.0 - fragColor.a);
            } else {
                gl_FragData[1] += fragColor;
            }

        } else {
            discard;
        }
    }
#endif
`,zo=`
precision highp float;
precision highp int;

#include common
#include read_from_texture
#include common_vert_params
#include color_vert_params
#include size_vert_params
#include common_clip
#include common_animation

uniform float uPixelRatio;
uniform vec4 uViewport;

attribute vec3 aPosition;
attribute mat4 aTransform;
attribute float aInstance;
attribute float aGroup;

void main(){
    int vertexId = VertexID;

    #include assign_group
    #include assign_color_varying
    #include assign_marker_varying
    #include assign_clipping_varying
    #include assign_position
    #include assign_size

    #ifdef dPointSizeAttenuation
        gl_PointSize = size * uPixelRatio * ((uViewport.w / 2.0) / -mvPosition.z) * 5.0;
    #else
        gl_PointSize = size * uPixelRatio;
    #endif
    gl_PointSize = max(1.0, gl_PointSize);

    gl_Position = uProjection * mvPosition;

    #include clip_instance
}
`,Uo=`
precision highp float;
precision highp int;

#include common
#include common_frag_params
#include color_frag_params
#include common_clip

const vec2 center = vec2(0.5);
const float radius = 0.5;

void main(){
    #include fade_lod
    #include clip_pixel

    float fragmentDepth = gl_FragCoord.z;
    #include assign_material_color

    #if defined(dPointStyle_circle)
        float dist = distance(gl_PointCoord, center);
        if (dist > radius) discard;
    #elif defined(dPointStyle_fuzzy)
        float dist = distance(gl_PointCoord, center);
        float fuzzyAlpha = 1.0 - smoothstep(0.0, radius, dist);
        if (fuzzyAlpha < 0.0001) discard;
    #endif

    #if defined(dPointStyle_fuzzy) && (defined(dRenderVariant_color) || defined(dRenderVariant_tracing))
        material.a *= fuzzyAlpha;
    #endif

    #include check_transparency

    #if defined(dRenderVariant_pick)
        #include check_picking_alpha
        #ifdef requiredDrawBuffers
            gl_FragColor = vObject;
            gl_FragData[1] = vInstance;
            gl_FragData[2] = vGroup;
            gl_FragData[3] = packDepthToRGBA(fragmentDepth);
        #else
            gl_FragColor = vColor;
        #endif
    #elif defined(dRenderVariant_depth)
        gl_FragColor = material;
    #elif defined(dRenderVariant_marking)
        gl_FragColor = material;
    #elif defined(dRenderVariant_emissive)
        gl_FragColor = material;
    #elif defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
        gl_FragColor = material;
        #include apply_marker_color

        #if defined(dRenderVariant_color)
            #include apply_fog
            #include wboit_write
            #include dpoit_write
        #elif defined(dRenderVariant_tracing)
            gl_FragData[1] = vec4(normalize(vViewPosition), emissive);
            gl_FragData[2] = vec4(material.rgb, uDensity);
        #endif
    #endif
}
`,jo=`
precision highp float;
precision highp int;

#include common
#include read_from_texture
#include common_vert_params
#include color_vert_params
#include size_vert_params
#include common_clip
#include common_animation

uniform mat4 uModelView;
uniform mat4 uInvProjection;
uniform float uIsOrtho;
uniform bool uIsAsymmetricProjection;

uniform vec2 uTexDim;
uniform sampler2D tPositionGroup;

attribute mat4 aTransform;
attribute float aInstance;

varying float vRadius;
varying vec3 vPoint;
varying vec3 vPointViewPosition;

/**
 * Bounding rectangle of a clipped, perspective-projected 3D Sphere.
 * Michael Mara, Morgan McGuire. 2013
 *
 * Specialization by Arseny Kapoulkine, MIT License Copyright (c) 2018
 * https://github.com/zeux/niagara
 *
 * Only works for for symmetric projections.
 */
void sphereProjection(const in vec3 p, const in float r, const in vec2 mapping) {
    vec3 pr = p * r;
    float pzr2 = p.z * p.z - r * r;

    float vx = sqrt(p.x * p.x + pzr2);
    float minx = ((vx * p.x - pr.z) / (vx * p.z + pr.x)) * uProjection[0][0];
    float maxx = ((vx * p.x + pr.z) / (vx * p.z - pr.x)) * uProjection[0][0];

    float vy = sqrt(p.y * p.y + pzr2);
    float miny = ((vy * p.y - pr.z) / (vy * p.z + pr.y)) * uProjection[1][1];
    float maxy = ((vy * p.y + pr.z) / (vy * p.z - pr.y)) * uProjection[1][1];

    gl_Position.xy = vec2(maxx + minx, maxy + miny) * -0.5;
    gl_Position.xy -= mapping * vec2(maxx - minx, maxy - miny) * 0.5;
    gl_Position.xy *= gl_Position.w;
}

const mat4 D = mat4(
    1.0, 0.0, 0.0, 0.0,
    0.0, 1.0, 0.0, 0.0,
    0.0, 0.0, 1.0, 0.0,
    0.0, 0.0, 0.0, -1.0
);

/**
 * Compute point size and center using the technique described in:
 * "GPU-Based Ray-Casting of Quadratic Surfaces" http://dl.acm.org/citation.cfm?id=2386396
 * by Christian Sigg, Tim Weyrich, Mario Botsch, Markus Gross.
 */
void quadraticProjection(const in vec3 position, const in float radius, const in vec2 mapping, const in mat4 transform) {
    vec2 xbc, ybc;

    mat4 T = mat4(
        radius, 0.0, 0.0, 0.0,
        0.0, radius, 0.0, 0.0,
        0.0, 0.0, radius, 0.0,
        position.x, position.y, position.z, 1.0
    );

    mat4 R = transpose4(uProjection * uModelView * transform * T);
    float A = dot(R[3], D * R[3]);
    float B = -2.0 * dot(R[0], D * R[3]);
    float C = dot(R[0], D * R[0]);
    xbc[0] = (-B - sqrt(B * B - 4.0 * A * C)) / (2.0 * A);
    xbc[1] = (-B + sqrt(B * B - 4.0 * A * C)) / (2.0 * A);
    float sx = abs(xbc[0] - xbc[1]) * 0.5;

    A = dot(R[3], D * R[3]);
    B = -2.0 * dot(R[1], D * R[3]);
    C = dot(R[1], D * R[1]);
    ybc[0] = (-B - sqrt(B * B - 4.0 * A * C)) / (2.0 * A);
    ybc[1] = (-B + sqrt(B * B - 4.0 * A * C)) / (2.0 * A);
    float sy = abs(ybc[0] - ybc[1]) * 0.5;

    gl_Position.xy = vec2(0.5 * (xbc.x + xbc.y), 0.5 * (ybc.x + ybc.y));
    gl_Position.xy -= mapping * vec2(sx, sy);
    gl_Position.xy *= gl_Position.w;
}

void main(void){
    vec2 mapping = vec2(1.0, 1.0); // vertices 2 and 5
    #if __VERSION__ == 100
        int m = imod(VertexID, 6);
    #else
        int m = VertexID % 6;
    #endif
    if (m == 0) {
        mapping = vec2(-1.0, 1.0);
    } else if (m == 1 || m == 3) {
        mapping = vec2(-1.0, -1.0);
    } else if (m == 4) {
        mapping = vec2(1.0, -1.0);
    }

    int vertexId = VertexID / 6;

    vec4 positionGroup = readFromTexture(tPositionGroup, vertexId, uTexDim);
    vec3 position = positionGroup.rgb;
    float group = positionGroup.a;

    position = applyWiggle(position, group, aInstance);
    mat4 transform = applyTumble(aTransform, aInstance, float(uObjectId));

    #include assign_color_varying
    #include assign_marker_varying
    #include assign_clipping_varying
    #include assign_size

    vRadius = size * uModelScale;

    vec4 position4 = vec4(position, 1.0);
    vModelPosition = (uModel * transform * position4).xyz; // for clipping in frag shader

    float d;
    if (uLod.w != 0.0 && (uLod.x != 0.0 || uLod.y != 0.0)) {
        if (uModelScale != 1.0) {
            vRadius *= uLod.w;
        } else {
            d = (dot(uCameraPlane.xyz, vModelPosition) + uCameraPlane.w) / uModelScale;
            float f = min(
                smoothstep(uLod.x, uLod.x + uLod.z, d),
                1.0 - smoothstep(uLod.y - uLod.z, uLod.y, d)
            ) * uLod.w;
            vRadius *= f;
        }
    }

    vec4 mvPosition = uModelView * transform * position4;

    #ifdef dApproximate
        vec4 mvCorner = vec4(mvPosition.xyz, 1.0);
        mvCorner.xy += mapping * vRadius;
        gl_Position = uProjection * mvCorner;
    #else
        if (uIsOrtho == 1.0) {
            vec4 mvCorner = vec4(mvPosition.xyz, 1.0);
            mvCorner.xy += mapping * vRadius;
            gl_Position = uProjection * mvCorner;
        } else if (uIsAsymmetricProjection) {
            gl_Position = uProjection * vec4(mvPosition.xyz, 1.0);
            quadraticProjection(position, vRadius / uModelScale, mapping, transform);
        } else {
            gl_Position = uProjection * vec4(mvPosition.xyz, 1.0);
            sphereProjection(mvPosition.xyz, vRadius, mapping);
        }
    #endif

    vec4 vPoint4 = uInvProjection * gl_Position;
    vPoint = vPoint4.xyz / vPoint4.w;
    vPointViewPosition = -mvPosition.xyz / mvPosition.w;

    if (gl_Position.z < -gl_Position.w) {
        mvPosition.z -= 2.0 * vRadius; // avoid clipping
        gl_Position.z = (uProjection * vec4(mvPosition.xyz, 1.0)).z;
    }

    if (uModelScale == 1.0) {
        if (uLod.w != 0.0 && (uLod.x != 0.0 || uLod.y != 0.0)) {
            if (d < uLod.x || d > uLod.y) {
                // move out of [ -w, +w ] to 'discard' in vert shader
                gl_Position.z = 2.0 * gl_Position.w;
            }
        }
    }

    #if defined(dClipPrimitive) && !defined(dClipVariant_instance) && dClipObjectCount != 0
        if (clipTest(vModelPosition / uModelScale)) {
            // move out of [ -w, +w ] to 'discard' in vert shader
            gl_Position.z = 2.0 * gl_Position.w;
        }
    #else
        #include clip_instance
    #endif
}
`,qo=`
precision highp float;
precision highp int;

#define bumpEnabled

#include common
#include common_frag_params
#include color_frag_params
#include light_frag_params
#include common_clip

uniform mat4 uInvView;
uniform float uAlphaThickness;

uniform vec4 uInteriorColor;
uniform vec4 uInteriorSubstance;

varying float vRadius;
varying vec3 vPoint;
varying vec3 vPointViewPosition;

#ifdef dSolidInterior
    const bool solidInterior = true;
#else
    const bool solidInterior = false;
#endif

bool SphereImpostor(out vec3 modelPos, out vec3 cameraPos, out vec3 cameraNormal, out bool interior, out float fragmentDepth){
    vec3 cameraSpherePos = -vPointViewPosition;

    vec3 rayOrigin = mix(vec3(0.0, 0.0, 0.0), vPoint, uIsOrtho);
    vec3 rayDirection = mix(normalize(vPoint), vec3(0.0, 0.0, 1.0), uIsOrtho);
    vec3 cameraSphereDir = mix(cameraSpherePos, rayOrigin - cameraSpherePos, uIsOrtho);

    float B = dot(rayDirection, cameraSphereDir);
    float det = B * B + vRadius * vRadius - dot(cameraSphereDir, cameraSphereDir);

    if (det < 0.0) return false;

    float sqrtDet = sqrt(det);
    float posT = mix(B + sqrtDet, B - sqrtDet, uIsOrtho);
    float negT = mix(B - sqrtDet, B + sqrtDet, uIsOrtho);

    cameraPos = rayDirection * negT + rayOrigin;
    modelPos = (uInvView * vec4(cameraPos, 1.0)).xyz;
    fragmentDepth = calcDepth(cameraPos);

    bool objectClipped = false;

    #if !defined(dClipPrimitive) && defined(dClipVariant_pixel) && dClipObjectCount != 0
        if (clipTest(modelPos)) {
            objectClipped = true;
            fragmentDepth = -1.0;
        }
    #endif

    if (fragmentDepth > 0.0) {
        cameraNormal = normalize(cameraPos - cameraSpherePos);
        interior = false;
        return true;
    } else if (uDoubleSided || solidInterior) {
        cameraPos = rayDirection * posT + rayOrigin;
        modelPos = (uInvView * vec4(cameraPos, 1.0)).xyz;
        fragmentDepth = calcDepth(cameraPos);
        cameraNormal = -normalize(cameraPos - cameraSpherePos);
        interior = true;
        if (fragmentDepth > 0.0) {
            #ifdef dSolidInterior
                if (!objectClipped) {
                    fragmentDepth = 0.0 + (0.0000001 / vRadius);
                    cameraNormal = -mix(normalize(vPoint), vec3(0.0, 0.0, -1.0), uIsOrtho);

                    // intersection of ray with near plane
                    float nearT = - (uNear + dot(rayOrigin, vec3(0.0, 0.0, 1.0))) / dot(rayDirection, vec3(0.0, 0.0, 1.0));
                    cameraPos = rayDirection * nearT + rayOrigin;
                    modelPos = (uInvView * vec4(cameraPos, 1.0)).xyz;
                }
            #endif
            return true;
        }
    }

    return false;
}

void main(void){
    vec3 cameraNormal;
    float fragmentDepth;

    #ifdef dApproximate
        vec3 pointDir = -vPointViewPosition - vPoint;
        if (dot(pointDir, pointDir) > vRadius * vRadius) discard;
        vec3 vViewPosition = -vPointViewPosition;
        fragmentDepth = gl_FragCoord.z;
        #if !defined(dIgnoreLight) || defined(dXrayShaded) || defined(dRenderVariant_tracing)
            pointDir.z -= cos(length(pointDir)) * vRadius * 0.5;
            cameraNormal = -normalize(pointDir);
        #endif
        interior = false;
    #else
        vec3 modelPos;
        vec3 cameraPos;
        bool hit = SphereImpostor(modelPos, cameraPos, cameraNormal, interior, fragmentDepth);
        if (!hit) discard;

        if (fragmentDepth < 0.0) discard;
        if (fragmentDepth > 1.0) discard;

        gl_FragDepthEXT = fragmentDepth;

        vec3 vModelPosition = modelPos;
        vec3 vViewPosition = cameraPos;
    #endif

    #include fade_lod
    #if !defined(dClipPrimitive) && defined(dClipVariant_pixel) && dClipObjectCount != 0
        #include clip_pixel
    #endif

    #ifdef dNeedsNormal
        vec3 normal = -cameraNormal;
    #endif

    #include assign_material_color

    #if defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
        if (uRenderMask == MaskTransparent && uAlphaThickness > 0.0) {
            material.a *= min(1.0, vRadius / (uAlphaThickness * uModelScale));
        }
    #endif

    #include check_transparency

    #if defined(dRenderVariant_pick)
        #include check_picking_alpha
        #ifdef requiredDrawBuffers
            gl_FragColor = vObject;
            gl_FragData[1] = vInstance;
            gl_FragData[2] = vGroup;
            gl_FragData[3] = packDepthToRGBA(fragmentDepth);
        #else
            gl_FragColor = vColor;
        #endif
    #elif defined(dRenderVariant_depth)
        gl_FragColor = material;
    #elif defined(dRenderVariant_marking)
        gl_FragColor = material;
    #elif defined(dRenderVariant_emissive)
        gl_FragColor = material;
    #elif defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
        #include apply_interior_color
        #include apply_light_color
        #include apply_marker_color

        #if defined(dRenderVariant_color)
            #include apply_fog
            #include wboit_write
            #include dpoit_write
        #elif defined(dRenderVariant_tracing)
            gl_FragData[1] = vec4(normal, emissive);
            gl_FragData[2] = vec4(material.rgb, uDensity);
        #endif
    #endif
}
`,Wo=`
precision highp float;
precision highp int;

#include common
#include read_from_texture
#include common_vert_params
#include color_vert_params
#include size_vert_params
#include common_clip
#include common_animation

uniform mat4 uModelView;

attribute mat4 aTransform;
attribute float aInstance;
attribute float aGroup;

attribute vec3 aMapping;
attribute vec3 aStart;
attribute vec3 aEnd;
attribute float aScale;
attribute float aCap;
attribute float aColorMode;

varying mat4 vTransform;
varying vec3 vStart;
varying vec3 vEnd;
varying float vSize;
varying float vCap;

uniform float uIsOrtho;
uniform vec3 uCameraDir;

void main() {
    int vertexId = VertexID;

    #include assign_group
    #include assign_color_varying
    #include assign_marker_varying
    #include assign_clipping_varying
    #include assign_size

    mat4 transform = applyTumble(aTransform, aInstance, float(uObjectId));
    vec3 wigStart = applyWiggle(aStart, aGroup, aInstance);
    vec3 wigEnd = applyWiggle(aEnd, aGroup, aInstance);
    mat4 modelTransform = uModel * transform;

    vTransform = modelTransform;
    vStart = (modelTransform * vec4(wigStart, 1.0)).xyz;
    vEnd = (modelTransform * vec4(wigEnd, 1.0)).xyz;
    vSize = size * aScale * uModelScale;
    vCap = aCap;

    vModelPosition = (vStart + vEnd) * 0.5;
    vec3 camDir = -mix(normalize(vModelPosition - uCameraPosition), uCameraDir, uIsOrtho);
    vec3 dir = vEnd - vStart;
    float f = aMapping.x > 0.0 ? 1.0 : 0.0;
    // ensure cylinder 'dir' is pointing towards the camera
    if(dot(camDir, dir) < 0.0) {
        dir = -dir;
        f = 1.0 - f;
    }

    vec3 left = cross(camDir, dir);
    vec3 up = cross(left, dir);
    left = vSize * normalize(left);
    up = vSize * normalize(up);

    // move vertex in object-space from center to corner
    vModelPosition += aMapping.x * dir + aMapping.y * left + aMapping.z * up;

    vec4 mvPosition = uView * vec4(vModelPosition, 1.0);
    vViewPosition = mvPosition.xyz;
    gl_Position = uProjection * mvPosition;

    if (gl_Position.z < -gl_Position.w) {
        mvPosition.z -= 2.0 * (length(vEnd - vStart) + vSize); // avoid clipping
        gl_Position.z = (uProjection * mvPosition).z;
    }

    #if defined(dDualColor) && defined(dRenderVariant_color) && (defined(dColorType_group) || defined(dColorType_groupInstance))
        // dual-color mixing
        // - for aColorMode between 0 and 1 use aColorMode to interpolate
        // - for aColorMode == 2 do nothing, i.e., use vColor
        // - for aColorMode == 3 use position on cylinder axis to interpolate
        if (aColorMode <= 1.0){
            vColor.rgb = mix(vColor.rgb, color2.rgb, aColorMode);
        } else if (aColorMode == 3.0) {
            vColor.rgb = mix(vColor.rgb, color2.rgb, mix(-0.25, 1.25, f / 1.5));
        }
    #endif

    #include clip_instance
}
`,Xo=`
precision highp float;
precision highp int;

#define bumpEnabled

uniform mat4 uView;

varying mat4 vTransform;
varying vec3 vStart;
varying vec3 vEnd;
varying float vSize;
varying float vCap;

uniform vec3 uCameraDir;
uniform vec3 uCameraPosition;
uniform mat4 uInvView;

uniform vec4 uInteriorColor;
uniform vec4 uInteriorSubstance;

#include common
#include common_frag_params
#include color_frag_params
#include light_frag_params
#include common_clip

#ifdef dSolidInterior
    const bool solidInterior = true;
#else
    const bool solidInterior = false;
#endif

// adapted from https://www.shadertoy.com/view/4lcSRn
// The MIT License, Copyright 2016 Inigo Quilez
bool CylinderImpostor(
    in vec3 rayOrigin, in vec3 rayDir,
    in vec3 start, in vec3 end, in float radius,
    out vec3 cameraNormal, out bool interior,
    out vec3 modelPosition, out vec3 viewPosition, out float fragmentDepth
){
    vec3 ba = end - start;
    vec3 oc = rayOrigin - start;

    float baba = dot(ba, ba);
    float bard = dot(ba, rayDir);
    float baoc = dot(ba, oc);

    float k2 = baba - bard * bard;
    float k1 = baba * dot(oc, rayDir) - baoc * bard;
    float k0 = baba * dot(oc, oc) - baoc * baoc - radius * radius * baba;

    float h = k1 * k1 - k2 * k0;
    if (h < 0.0) return false;

    bool topCap = (vCap > 0.9 && vCap < 1.1) || vCap >= 2.9;
    bool bottomCap = (vCap > 1.9 && vCap < 2.1) || vCap >= 2.9;

    #ifdef dSolidInterior
        bool topInterior = !topCap;
        bool bottomInterior = !bottomCap;
        topCap = true;
        bottomCap = true;
    #else
        bool topInterior = false;
        bool bottomInterior = false;
    #endif

    bool clipped = false;
    bool objectClipped = false;

    // body outside
    h = sqrt(h);
    float t = (-k1 - h) / k2;
    float y = baoc + t * bard;
    if (y > 0.0 && y < baba) {
        interior = false;
        cameraNormal = (oc + t * rayDir - ba * y / baba) / radius;
        modelPosition = rayOrigin + t * rayDir;
        viewPosition = (uView * vec4(modelPosition, 1.0)).xyz;
        fragmentDepth = calcDepth(viewPosition);
        #if defined(dClipVariant_pixel) && dClipObjectCount != 0
            if (clipTest(modelPosition)) {
                objectClipped = true;
                fragmentDepth = -1.0;
                #ifdef dSolidInterior
                    topCap = !topInterior;
                    bottomCap = !bottomInterior;
                #endif
            }
        #endif
        if (fragmentDepth > 0.0) return true;
        clipped = true;
    }

    if (!clipped) {
        if (topCap && y < 0.0) {
            // top cap
            t = -baoc / bard;
            if (abs(k1 + k2 * t) < h) {
                interior = topInterior;
                cameraNormal = -ba / baba;
                modelPosition = rayOrigin + t * rayDir;
                viewPosition = (uView * vec4(modelPosition, 1.0)).xyz;
                fragmentDepth = calcDepth(viewPosition);
                #if defined(dClipVariant_pixel) && dClipObjectCount != 0
                    if (clipTest(modelPosition)) {
                        objectClipped = true;
                        fragmentDepth = -1.0;
                        #ifdef dSolidInterior
                            topCap = !topInterior;
                            bottomCap = !bottomInterior;
                        #endif
                    }
                #endif
                if (fragmentDepth > 0.0) {
                    #ifdef dSolidInterior
                        if (interior) cameraNormal = -rayDir;
                    #endif
                    #if defined(dClipVariant_pixel) && dClipObjectCount != 0
                        return true;
                    #else
                        return !interior;
                    #endif
                }
            }
        } else if (bottomCap && y >= 0.0) {
            // bottom cap
            t = (baba - baoc) / bard;
            if (abs(k1 + k2 * t) < h) {
                interior = bottomInterior;
                cameraNormal = ba / baba;
                modelPosition = rayOrigin + t * rayDir;
                viewPosition = (uView * vec4(modelPosition, 1.0)).xyz;
                fragmentDepth = calcDepth(viewPosition);
                #if defined(dClipVariant_pixel) && dClipObjectCount != 0
                    if (clipTest(modelPosition)) {
                        objectClipped = true;
                        fragmentDepth = -1.0;
                        #ifdef dSolidInterior
                            topCap = !topInterior;
                            bottomCap = !bottomInterior;
                        #endif
                    }
                #endif
                if (fragmentDepth > 0.0) {
                    #ifdef dSolidInterior
                        if (interior) cameraNormal = -rayDir;
                    #endif
                    #if defined(dClipVariant_pixel) && dClipObjectCount != 0
                        return true;
                    #else
                        return !interior;
                    #endif
                }
            }
        }
    }

    if (uDoubleSided || solidInterior) {
        // body inside
        h = -h;
        t = (-k1 - h) / k2;
        y = baoc + t * bard;
        if (y > 0.0 && y < baba) {
            interior = true;
            cameraNormal = -(oc + t * rayDir - ba * y / baba) / radius;
            modelPosition = rayOrigin + t * rayDir;
            viewPosition = (uView * vec4(modelPosition, 1.0)).xyz;
            fragmentDepth = calcDepth(viewPosition);
            if (fragmentDepth > 0.0) {
                #ifdef dSolidInterior
                    if (!objectClipped) {
                        fragmentDepth = 0.0 + (0.0000002 / vSize);
                        cameraNormal = -rayDir;

                        // intersection of ray in model space with near plane in camera space
                        vec3 cameraRayOrigin = (uView * vec4(rayOrigin, 1.0)).xyz;
                        vec3 cameraRayDir = (uView * vec4(rayDir, 0.0)).xyz;
                        float nearT = - (uNear + cameraRayOrigin.z) / cameraRayDir.z;
                        viewPosition = cameraRayOrigin + nearT * cameraRayDir;
                        modelPosition = (uInvView * vec4(viewPosition, 1.0)).xyz;
                    }
                #endif
                return true;
            }
        }

        if (topCap && y < 0.0) {
            // top cap
            t = -baoc / bard;
            if (abs(k1 + k2 * t) < -h) {
                interior = true;
                cameraNormal = ba / baba;
                modelPosition = rayOrigin + t * rayDir;
                viewPosition = (uView * vec4(modelPosition, 1.0)).xyz;
                fragmentDepth = calcDepth(viewPosition);
                if (fragmentDepth > 0.0) {
                    #ifdef dSolidInterior
                        if (!objectClipped) {
                            fragmentDepth = 0.0 + (0.0000002 / vSize);
                            cameraNormal = -rayDir;

                            // intersection of ray in model space with near plane in camera space
                            vec3 cameraRayOrigin = (uView * vec4(rayOrigin, 1.0)).xyz;
                            vec3 cameraRayDir = (uView * vec4(rayDir, 0.0)).xyz;
                            float nearT = - (uNear + cameraRayOrigin.z) / cameraRayDir.z;
                            viewPosition = cameraRayOrigin + nearT * cameraRayDir;
                            modelPosition = (uInvView * vec4(viewPosition, 1.0)).xyz;
                        }
                    #endif
                    return true;
                }
            }
        } else if (bottomCap && y >= 0.0) {
            // bottom cap
            t = (baba - baoc) / bard;
            if (abs(k1 + k2 * t) < -h) {
                interior = true;
                cameraNormal = -ba / baba;
                modelPosition = rayOrigin + t * rayDir;
                viewPosition = (uView * vec4(modelPosition, 1.0)).xyz;
                fragmentDepth = calcDepth(viewPosition);
                if (fragmentDepth > 0.0) {
                    #ifdef dSolidInterior
                        if (!objectClipped) {
                            fragmentDepth = 0.0 + (0.0000002 / vSize);
                            cameraNormal = -rayDir;

                            // intersection of ray in model space with near plane in camera space
                            vec3 cameraRayOrigin = (uView * vec4(rayOrigin, 1.0)).xyz;
                            vec3 cameraRayDir = (uView * vec4(rayDir, 0.0)).xyz;
                            float nearT = - (uNear + cameraRayOrigin.z) / cameraRayDir.z;
                            viewPosition = cameraRayOrigin + nearT * cameraRayDir;
                            modelPosition = (uInvView * vec4(viewPosition, 1.0)).xyz;
                        }
                    #endif
                    return true;
                }
            }
        }
    }

    return false;
}

void main() {
    vec3 rayOrigin = vModelPosition;
    vec3 rayDir = mix(normalize(vModelPosition - uCameraPosition), uCameraDir, uIsOrtho);

    vec3 cameraNormal;
    vec3 modelPosition;
    vec3 viewPosition;
    float fragmentDepth;
    bool hit = CylinderImpostor(rayOrigin, rayDir, vStart, vEnd, vSize, cameraNormal, interior, modelPosition, viewPosition, fragmentDepth);
    if (!hit) discard;

    if (fragmentDepth < 0.0) discard;
    if (fragmentDepth > 1.0) discard;

    gl_FragDepthEXT = fragmentDepth;

    vec3 vViewPosition = viewPosition;
    vec3 vModelPosition = modelPosition;

    #include fade_lod
    #include clip_pixel

    #ifdef dNeedsNormal
        mat3 normalMatrix = adjoint(uView);
        vec3 normal = normalize(normalMatrix * -normalize(cameraNormal));
    #endif

    #include assign_material_color
    #include check_transparency

    #if defined(dRenderVariant_pick)
        #include check_picking_alpha
        #ifdef requiredDrawBuffers
            gl_FragColor = vObject;
            gl_FragData[1] = vInstance;
            gl_FragData[2] = vGroup;
            gl_FragData[3] = packDepthToRGBA(fragmentDepth);
        #else
            gl_FragColor = vColor;
        #endif
    #elif defined(dRenderVariant_depth)
        gl_FragColor = material;
    #elif defined(dRenderVariant_marking)
        gl_FragColor = material;
    #elif defined(dRenderVariant_emissive)
        gl_FragColor = material;
    #elif defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
        #include apply_interior_color
        #include apply_light_color
        #include apply_marker_color

        #if defined(dRenderVariant_color)
            #include apply_fog
            #include wboit_write
            #include dpoit_write
        #elif defined(dRenderVariant_tracing)
            gl_FragData[1] = vec4(normal, emissive);
            gl_FragData[2] = vec4(material.rgb, uDensity);
        #endif
    #endif
}
`,Ho=`
precision highp float;
precision highp int;

#include common
#include read_from_texture
#include common_vert_params
#include color_vert_params
#include size_vert_params
#include common_clip

uniform mat4 uModelView;

attribute vec3 aPosition;
attribute vec2 aMapping;
attribute float aDepth;
attribute vec2 aTexCoord;
attribute mat4 aTransform;
attribute float aInstance;
attribute float aGroup;

uniform float uOffsetX;
uniform float uOffsetY;
uniform float uOffsetZ;

uniform float uIsOrtho;
uniform float uPixelRatio;
uniform vec4 uViewport;
uniform mat4 uInvHeadRotation;
uniform bool uHasHeadRotation;
uniform mat4 uModelViewEye;
uniform mat4 uInvModelViewEye;
uniform bool uHasEyeCamera;

varying vec2 vTexCoord;

void main(void){
    int vertexId = VertexID;

    #include assign_group
    #include assign_color_varying
    #include assign_marker_varying
    #include assign_clipping_varying
    #include assign_size

    vTexCoord = aTexCoord;

    float scale = uModelScale;

    float offsetX = uOffsetX * scale;
    float offsetY = uOffsetY * scale;
    float offsetZ = (uOffsetZ + aDepth * 0.95) * scale;

    vec4 position4 = vec4(aPosition, 1.0);
    vec4 mvPosition = uHasEyeCamera
         ? uModelViewEye * aTransform * position4
         : uModelView * aTransform * position4;

    vModelPosition = (uModel * aTransform * position4).xyz; // for clipping in frag shader

    // TODO
    // #ifdef FIXED_SIZE
    //     if (ortho) {
    //         scale /= pixelRatio * ((uViewport.w / 2.0) / -uCameraPosition.z) * 0.1;
    //     } else {
    //         scale /= pixelRatio * ((uViewport.w / 2.0) / -mvPosition.z) * 0.1;
    //     }
    // #endif

    vec4 mvCenter = vec4(mvPosition.xyz, 1.0);

    if (vTexCoord.x == 10.0) { // indicates background plane
        // move a bit to the back, taking distance to camera into account to avoid z-fighting
        offsetZ -= 0.001 * distance(uCameraPosition, (uProjection * mvCenter).xyz);
    }

    // apply Z offset in view space
    if (!uHasEyeCamera) {
        if (uIsOrtho == 1.0) {
            mvCenter.z += offsetZ;
        } else {
            mvCenter.xyz += normalize(-mvCenter.xyz) * offsetZ;
        }
    }

    if (uHasEyeCamera) {
        mvCenter = uModelView * uInvModelViewEye * mvCenter;
    }

    // project center to clip space
    vec4 clip = uProjection * mvCenter;

    // compute corner offset in screen-space units
    vec2 cornerOffset = aMapping * size * scale;
    cornerOffset.x += offsetX;
    cornerOffset.y += offsetY;

    if (uHasHeadRotation) {
        vec3 rotatedOffset = (uInvHeadRotation * vec4(cornerOffset, 0.0, 0.0)).xyz;
        clip += uProjection * vec4(rotatedOffset, 0.0);
    } else {
        // apply offset in clip space to avoid perspective distortion on the quad
        clip.xy += vec2(uProjection[0][0], uProjection[1][1]) * cornerOffset;
    }

    gl_Position = clip;

    vViewPosition = -mvCenter.xyz;

    #include clip_instance
}
`,$o=`
precision highp float;
precision highp int;

#include common
#include common_frag_params
#include color_frag_params
#include common_clip

uniform sampler2D tFont;

uniform vec3 uBorderColor;
uniform float uBorderWidth;
uniform vec3 uBackgroundColor;
uniform float uBackgroundOpacity;

varying vec2 vTexCoord;

void main(){
    #include fade_lod
    #include clip_pixel

    float fragmentDepth = gl_FragCoord.z;

    // determine if this is a background or glyph fragment
    bool isBackground = vTexCoord.x > 1.0;

    // discard background for non-visual variants (depth, pick, marking, emissive)
    #if !defined(dRenderVariant_color) && !defined(dRenderVariant_tracing)
        if (isBackground) discard;
    #endif

    // SDF test for glyph fragments — discard pixels outside glyph+border
    float rawSdf = 0.0;
    if (!isBackground) {
        rawSdf = texture2D(tFont, vTexCoord).a;
        float sdf = rawSdf + min(uBorderWidth, 0.49); // clamp to avoid exceeding max SDF range
        if (sdf < 0.5) discard;
    }

    #ifdef enabledFragDepth
        gl_FragDepthEXT = fragmentDepth;
    #endif

    #include assign_material_color

    if (isBackground) {
        #if defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
            material = vec4(uBackgroundColor, uBackgroundOpacity * material.a);
        #endif
    } else {
        #if defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
            if (uBorderWidth > 0.0 && rawSdf < 0.5) {
                material.xyz = uBorderColor;
            } else {
                // push text fragments forward in depth so they render in front of border
                #ifdef enabledFragDepth
                    gl_FragDepthEXT = fragmentDepth - 0.0001;
                #endif
            }
        #endif
    }

    #include check_transparency

    #if defined(dRenderVariant_pick)
        #include check_picking_alpha
        #ifdef requiredDrawBuffers
            gl_FragColor = vObject;
            gl_FragData[1] = vInstance;
            gl_FragData[2] = vGroup;
            gl_FragData[3] = packDepthToRGBA(fragmentDepth);
        #else
            gl_FragColor = vColor;
        #endif
    #elif defined(dRenderVariant_depth)
        gl_FragColor = material;
    #elif defined(dRenderVariant_marking)
        gl_FragColor = material;
    #elif defined(dRenderVariant_emissive)
        gl_FragColor = material;
    #elif defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
        gl_FragColor = material;
        #include apply_marker_color

        #if defined(dRenderVariant_color)
            #include apply_fog
            #include wboit_write
            #include dpoit_write
        #elif defined(dRenderVariant_tracing)
            gl_FragData[1] = vec4(-normalize(vViewPosition), emissive);
            gl_FragData[2] = vec4(material.rgb, uDensity);
        #endif
    #endif
}
`,Yo=`
precision highp float;
precision highp int;

#include common
#include read_from_texture
#include common_vert_params
#include color_vert_params
#include size_vert_params
#include common_clip
#include common_animation

uniform float uPixelRatio;
uniform vec4 uViewport;

attribute mat4 aTransform;
attribute float aInstance;
attribute float aGroup;

attribute vec2 aMapping;
attribute vec3 aStart;
attribute vec3 aEnd;

void trimSegment(const in vec4 start, inout vec4 end) {
    // trim end segment so it terminates between the camera plane and the near plane
    // conservative estimate of the near plane
    float a = uProjection[2][2];  // 3rd entry in 3rd column
    float b = uProjection[3][2];  // 3rd entry in 4th column
    float nearEstimate = -0.5 * b / a;
    float alpha = (nearEstimate - start.z) / (end.z - start.z);
    end.xyz = mix(start.xyz, end.xyz, alpha);
}

void main(){
    float aspect = uViewport.z / uViewport.w;
    int vertexId = VertexID;

    #include assign_group
    #include assign_color_varying
    #include assign_marker_varying
    #include assign_clipping_varying
    #include assign_size

    mat4 transform = applyTumble(aTransform, aInstance, float(uObjectId));
    vec3 wigStart = applyWiggle(aStart, group, aInstance);
    vec3 wigEnd = applyWiggle(aEnd, group, aInstance);
    mat4 modelView = uView * uModel * transform;

    // camera space
    vec4 start = modelView * vec4(wigStart, 1.0);
    vec4 end = modelView * vec4(wigEnd, 1.0);

    // assign position
    vec4 position4 = vec4((aMapping.y < 0.5) ? wigStart : wigEnd, 1.0);
    vViewPosition = (aMapping.y < 0.5) ? start.xyz : end.xyz;

    vModelPosition = (uModel * transform * position4).xyz; // for clipping in frag shader

    // special case for perspective projection, and segments that terminate either in, or behind, the camera plane
    // clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
    // but we need to perform ndc-space calculations in the shader, so we must address this issue directly
    // perhaps there is a more elegant solution -- WestLangley
    bool perspective = (uProjection[2][3] == -1.0); // 4th entry in the 3rd column
    if (perspective) {
        if (start.z < 0.0 && end.z >= 0.0) {
            trimSegment(start, end);
        } else if (end.z < 0.0 && start.z >= 0.0) {
            trimSegment(end, start);
        }
    }

    // clip space
    vec4 clipStart = uProjection * start;
    vec4 clipEnd = uProjection * end;

    // ndc space
    vec2 ndcStart = clipStart.xy / clipStart.w;
    vec2 ndcEnd = clipEnd.xy / clipEnd.w;

    // direction
    vec2 dir = ndcEnd - ndcStart;

    // account for clip-space aspect ratio
    dir.x *= aspect;
    dir = normalize(dir);

    // perpendicular to dir
    vec2 offset = vec2(dir.y, - dir.x);

    // undo aspect ratio adjustment
    dir.x /= aspect;
    offset.x /= aspect;

    // sign flip
    if (aMapping.x < 0.0) offset *= -1.0;

    // calculate linewidth
    float linewidth;
    #ifdef dLineSizeAttenuation
        linewidth = size * uPixelRatio * ((uViewport.w / 2.0) / -start.z) * 5.0;
    #else
        linewidth = size * uPixelRatio;
    #endif
    linewidth = max(1.0, linewidth);

    // adjust for linewidth
    offset *= linewidth;

    // adjust for clip-space to screen-space conversion
    offset /= uViewport.w;

    // select end
    vec4 clip = (aMapping.y < 0.5) ? clipStart : clipEnd;

    // back to clip space
    offset *= clip.w;
    clip.xy += offset;
    gl_Position = clip;

    #include clip_instance
}
`,Qo=`
precision highp float;
precision highp int;

#include common
#include common_frag_params
#include color_frag_params
#include common_clip

void main(){
    #include fade_lod
    #include clip_pixel

    float fragmentDepth = gl_FragCoord.z;
    #include assign_material_color
    #include check_transparency

    #if defined(dRenderVariant_pick)
        #include check_picking_alpha
        #ifdef requiredDrawBuffers
            gl_FragColor = vObject;
            gl_FragData[1] = vInstance;
            gl_FragData[2] = vGroup;
            gl_FragData[3] = packDepthToRGBA(fragmentDepth);
        #else
            gl_FragColor = vColor;
        #endif
    #elif defined(dRenderVariant_depth)
        gl_FragColor = material;
    #elif defined(dRenderVariant_marking)
        gl_FragColor = material;
    #elif defined(dRenderVariant_emissive)
        gl_FragColor = material;
    #elif defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
        gl_FragColor = material;
        #include apply_marker_color

        #if defined(dRenderVariant_color)
            #include apply_fog
            #include wboit_write
            #include dpoit_write
        #elif defined(dRenderVariant_tracing)
            gl_FragData[1] = vec4(normalize(vViewPosition), emissive);
            gl_FragData[2] = vec4(material.rgb, uDensity);
        #endif
    #endif
}
`,Zo=`
precision highp float;
precision highp int;
precision highp sampler2D;

#include common
#include read_from_texture
#include common_vert_params
#include color_vert_params
#include common_clip
#include common_animation
#include texture3d_from_2d_linear

#ifdef dGeometryType_textureMesh
    uniform vec2 uGeoTexDim;
    uniform sampler2D tPosition;
    uniform sampler2D tGroup;
    uniform sampler2D tNormal;
#else
    attribute vec3 aPosition;
    attribute float aGroup;
    attribute vec3 aNormal;
#endif
attribute mat4 aTransform;
attribute float aInstance;

varying vec3 vNormal;

void main(){
    int vertexId = VertexID;

    #include assign_group
    #include assign_marker_varying
    #include assign_clipping_varying
    #include assign_position
    #include assign_color_varying
    #include clip_instance

    #ifdef dGeometryType_textureMesh
        vec3 normal = readFromTexture(tNormal, vertexId, uGeoTexDim).xyz;
    #else
        vec3 normal = aNormal;
    #endif
    mat3 normalMatrix = adjoint(modelView);
    vec3 transformedNormal = normalize(normalMatrix * normalize(normal));
    #if defined(dFlipSided)
        if (!uDoubleSided) { // TODO checking uDoubleSided should not be required, ASR
            transformedNormal = -transformedNormal;
        }
    #endif
    vNormal = transformedNormal;
}
`,Ko=`
precision highp float;
precision highp int;

#define bumpEnabled

#include common
#include common_frag_params
#include color_frag_params
#include light_frag_params
#include normal_frag_params
#include common_clip

uniform vec4 uInteriorColor;
uniform vec4 uInteriorSubstance;

void main() {
    #include fade_lod
    #include clip_pixel

    interior = !gl_FrontFacing;

    float fragmentDepth = gl_FragCoord.z;

    #ifdef dNeedsNormal
        #if defined(dFlatShaded)
            vec3 fdx = dFdx(vViewPosition);
            vec3 fdy = dFdy(vViewPosition);
            vec3 normal = -normalize(cross(fdx,fdy));
        #else
            vec3 normal = -normalize(vNormal);
            if (uDoubleSided) normal *= float(gl_FrontFacing) * 2.0 - 1.0;
        #endif

        #if defined(dFlipSided)
            normal *= -1.0;
        #endif
    #endif

    #include assign_material_color
    #include check_transparency

    #if defined(dRenderVariant_pick)
        #include check_picking_alpha
        #ifdef requiredDrawBuffers
            gl_FragColor = vObject;
            gl_FragData[1] = vInstance;
            gl_FragData[2] = vGroup;
            gl_FragData[3] = packDepthToRGBA(fragmentDepth);
        #else
            gl_FragColor = vColor;
        #endif
    #elif defined(dRenderVariant_depth)
        gl_FragColor = material;
    #elif defined(dRenderVariant_marking)
        gl_FragColor = material;
    #elif defined(dRenderVariant_emissive)
        gl_FragColor = material;
    #elif defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
        #include apply_interior_color
        #include apply_light_color
        #include apply_marker_color

        #if defined(dRenderVariant_color)
            #include apply_fog
            #include wboit_write
            #include dpoit_write
        #elif defined(dRenderVariant_tracing)
            gl_FragData[1] = vec4(normal, emissive);
            gl_FragData[2] = vec4(material.rgb, uDensity);
        #endif
    #endif
}
`,Jo=`
precision highp float;

attribute vec3 aPosition;
attribute mat4 aTransform;
attribute float aInstance;

uniform mat4 uModel;
uniform mat4 uModelView;
uniform mat4 uProjection;
uniform vec4 uInvariantBoundingSphere;
uniform float uModelScale;

varying vec3 vModelPosition;
varying float vInstance;
varying vec4 vBoundingSphere;
varying mat4 vTransform;

uniform vec3 uBboxSize;
uniform vec3 uBboxMin;
uniform vec3 uBboxMax;
uniform vec3 uGridDim;
uniform mat4 uTransform;

uniform mat4 uUnitToCartn;

void main() {
    vec4 unitCoord = vec4(aPosition + vec3(0.5), 1.0);
    vec4 mvPosition = uModelView * aTransform * uUnitToCartn * unitCoord;

    vModelPosition = (uModel * aTransform * uUnitToCartn * unitCoord).xyz;
    vInstance = aInstance;
    vBoundingSphere = vec4(
        (uModel * aTransform * vec4(uInvariantBoundingSphere.xyz, 1.0)).xyz,
        uModelScale * uInvariantBoundingSphere.w
    );
    vTransform = aTransform;

    gl_Position = uProjection * mvPosition;

    // move z position to near clip plane (but not too close to get precision issues)
    gl_Position.z = gl_Position.w - 0.01;
}
`,es=`
precision highp float;
precision highp int;

#include common
#include light_frag_params

#if dClipObjectCount != 0
    uniform int uClipObjectType[dClipObjectCount];
    uniform bool uClipObjectInvert[dClipObjectCount];
    uniform vec3 uClipObjectPosition[dClipObjectCount];
    uniform vec4 uClipObjectRotation[dClipObjectCount];
    uniform vec3 uClipObjectScale[dClipObjectCount];
    uniform mat4 uClipObjectTransform[dClipObjectCount];
#endif
#include common_clip

#include read_from_texture
#include texture3d_from_1d_trilinear
#include texture3d_from_2d_nearest
#include texture3d_from_2d_linear

uniform mat4 uProjection, uTransform, uModelView, uModel, uView;
uniform vec3 uCameraDir;
uniform float uModelScale;

uniform sampler2D tDepth;
uniform vec2 uDrawingBufferSize;

varying vec3 vModelPosition;
varying float vInstance;
varying vec4 vBoundingSphere;
varying mat4 vTransform;

uniform mat4 uInvView;
uniform vec3 uGridDim;
uniform vec3 uBboxSize;
uniform sampler2D tTransferTex;
uniform float uTransferScale;
uniform float uStepScale;
uniform float uJumpLength;

uniform int uObjectId;
uniform int uVertexCount;
uniform int uInstanceCount;
uniform int uGroupCount;

#if defined(dColorMarker)
    uniform vec3 uHighlightColor;
    uniform vec3 uSelectColor;
    uniform vec3 uDimColor;
    uniform float uHighlightStrength;
    uniform float uSelectStrength;
    uniform float uDimStrength;
    uniform int uMarkerPriority;
    uniform float uMarkerAverage;

    uniform float uMarker;
    uniform vec2 uMarkerTexDim;
    uniform sampler2D tMarker;
#endif

uniform float uMetalness;
uniform float uRoughness;
uniform float uEmissive;

// Density value to estimate object thickness
uniform float uDensity;

uniform bool uFog;
uniform float uFogNear;
uniform float uFogFar;
uniform vec3 uFogColor;

uniform float uAlpha;
uniform bool uTransparentBackground;
uniform float uXrayEdgeFalloff;
uniform float uCelSteps;
uniform float uExposure;

uniform int uRenderMask;

uniform float uNear;
uniform float uFar;
uniform float uIsOrtho;

uniform vec3 uCellDim;
uniform vec3 uCameraPosition;
uniform mat4 uCartnToUnit;

#if __VERSION__ != 100
    // for webgl1 this is given as a 'define'
    uniform int uMaxSteps;
#endif

#if defined(dGridTexType_2d)
    precision highp sampler2D;
    uniform sampler2D tGridTex;
    uniform vec3 uGridTexDim;
#elif defined(dGridTexType_3d)
    precision highp sampler3D;
    uniform sampler3D tGridTex;
#endif

#if defined(dColorType_uniform)
    uniform vec3 uColor;
#elif defined(dColorType_texture)
    uniform vec2 uColorTexDim;
    uniform sampler2D tColor;
#endif

#ifdef dOverpaint
    #if defined(dOverpaintType_groupInstance) || defined(dOverpaintType_vertexInstance)
        uniform vec2 uOverpaintTexDim;
        uniform sampler2D tOverpaint;
    #endif
#endif

#ifdef dUsePalette
    uniform vec2 uPaletteDomain;
    uniform sampler2D tPalette;
#endif

#if defined(dGridTexType_2d)
    vec4 textureVal(vec3 pos) {
        return texture3dFrom2dLinear(tGridTex, pos + (vec3(0.5, 0.5, 0.0) / uGridDim), uGridDim, uGridTexDim.xy);
    }
    vec4 textureGroup(vec3 pos) {
        return texture3dFrom2dNearest(tGridTex, pos + (vec3(0.5, 0.5, 0.0) / uGridDim), uGridDim, uGridTexDim.xy);
    }
#elif defined(dGridTexType_3d)
    vec4 textureVal(vec3 pos) {
        return texture(tGridTex, pos + (vec3(0.5) / uGridDim));
    }
    vec4 textureGroup(vec3 pos) {
        return texelFetch(tGridTex, ivec3(pos * uGridDim), 0);
    }
#endif

float calcDepth(const in vec3 pos) {
    vec2 clipZW = pos.z * uProjection[2].zw + uProjection[3].zw;
    return 0.5 + 0.5 * clipZW.x / clipZW.y;
}

float transferFunction(float value) {
    return texture2D(tTransferTex, vec2(value, 0.0)).a;
}

float getDepth(const in vec2 coords) {
    #ifdef depthTextureSupport
        return texture2D(tDepth, coords).r;
    #else
        return unpackRGBAToDepth(texture2D(tDepth, coords));
    #endif
}

const float gradOffset = 0.5;

vec3 v3m4(vec3 p, mat4 m) {
    return (m * vec4(p, 1.0)).xyz;
}

float preFogAlphaBlended = 0.0;

vec4 raymarch(vec3 startLoc, vec3 step, vec3 rayDir) {
    mat3 normalMatrix = adjoint(uModelView * vTransform);
    mat4 cartnToUnit = uCartnToUnit * inverse4(vTransform);
    #if defined(dClipVariant_pixel) && dClipObjectCount != 0
        mat4 modelTransform = uModel * vTransform * uTransform;
    #endif
    mat4 modelViewTransform = uModelView * vTransform * uTransform;

    vec3 scaleVol = vec3(1.0) / uGridDim;
    vec3 pos = startLoc;
    vec4 cell;
    float prevValue = -1.0;
    float value = 0.0;
    vec4 src = vec4(0.0);
    vec4 dst = vec4(0.0);
    float fragmentDepth;

    vec3 posMin = vec3(0.0);
    vec3 posMax = vec3(1.0) - vec3(1.0) / uGridDim;

    vec3 unitPos;

    vec3 nextPos;
    float nextValue;

    vec4 material;
    vec4 overpaint;
    float metalness = uMetalness;
    float roughness = uRoughness;
    float emissive = uEmissive;

    vec3 gradient = vec3(1.0);
    vec3 dx = vec3(gradOffset * scaleVol.x, 0.0, 0.0);
    vec3 dy = vec3(0.0, gradOffset * scaleVol.y, 0.0);
    vec3 dz = vec3(0.0, 0.0, gradOffset * scaleVol.z);

    float maxDist = min(vBoundingSphere.w * 2.0, uFar - uNear);
    float maxDistSq = maxDist * maxDist;

    for (int i = 0; i < uMaxSteps; ++i) {
        // break when beyond bounding-sphere or far-plane
        vec3 distVec = startLoc - pos;
        if (dot(distVec, distVec) > maxDistSq) break;

        unitPos = v3m4(pos / uModelScale, cartnToUnit);

        // continue when outside of grid
        if (unitPos.x > posMax.x || unitPos.y > posMax.y || unitPos.z > posMax.z ||
            unitPos.x < posMin.x || unitPos.y < posMin.y || unitPos.z < posMin.z
        ) {
            prevValue = value;
            pos += step;
            continue;
        }

        cell = textureVal(unitPos);
        value = cell.a; // current voxel value

        if (uJumpLength > 0.0 && value < 0.01) {
            nextPos = pos + rayDir * uJumpLength;
            nextValue = textureVal(v3m4(nextPos / uModelScale, cartnToUnit)).a;
            if (nextValue < 0.01) {
                prevValue = nextValue;
                pos = nextPos;
                continue;
            }
        }

        vec4 mvPosition = modelViewTransform * vec4(unitPos * uGridDim, 1.0);
        if (calcDepth(mvPosition.xyz) > getDepth(gl_FragCoord.xy / uDrawingBufferSize))
            break;

        #if defined(dClipVariant_pixel) && dClipObjectCount != 0
            vec3 modelPosition = v3m4(unitPos * uGridDim, modelTransform);
            if (clipTest(modelPosition)) {
                prevValue = value;
                pos += step;
                continue;
            }
        #endif

        vec3 vViewPosition = mvPosition.xyz;
        material.a = transferFunction(value);

        #ifdef dPackedGroup
            float group = unpackRGBToInt(textureGroup(floor(unitPos * uGridDim + 0.5) / uGridDim).rgb);
        #else
            vec3 g = floor(unitPos * uGridDim + 0.5);
            // note that we swap x and z because the texture is flipped around y
            #if defined(dAxisOrder_012)
                float group = g.z + g.y * uGridDim.z + g.x * uGridDim.z * uGridDim.y; // 210
            #elif defined(dAxisOrder_021)
                float group = g.y + g.z * uGridDim.y + g.x * uGridDim.y * uGridDim.z; // 120
            #elif defined(dAxisOrder_102)
                float group = g.z + g.x * uGridDim.z + g.y * uGridDim.z * uGridDim.x; // 201
            #elif defined(dAxisOrder_120)
                float group = g.x + g.z * uGridDim.x + g.y * uGridDim.x * uGridDim.z; // 021
            #elif defined(dAxisOrder_201)
                float group = g.y + g.x * uGridDim.y + g.z * uGridDim.y * uGridDim.x; // 102
            #elif defined(dAxisOrder_210)
                float group = g.x + g.y * uGridDim.x + g.z * uGridDim.x * uGridDim.y; // 012
            #endif
        #endif

        #if defined(dColorType_direct) && defined(dUsePalette)
            float paletteValue = (value - uPaletteDomain[0]) / (uPaletteDomain[1] - uPaletteDomain[0]);
            material.rgb = texture2D(tPalette, vec2(clamp(paletteValue, 0.0, 1.0), 0.0)).rgb;
        #elif defined(dColorType_uniform)
            material.rgb = uColor;
        #elif defined(dColorType_instance)
            material.rgb = readFromTexture(tColor, vInstance, uColorTexDim).rgb;
        #elif defined(dColorType_group)
            material.rgb = readFromTexture(tColor, group, uColorTexDim).rgb;
        #elif defined(dColorType_groupInstance)
            material.rgb = readFromTexture(tColor, vInstance * float(uGroupCount) + group, uColorTexDim).rgb;
        #elif defined(dColorType_vertex)
            material.rgb = texture3dFrom1dTrilinear(tColor, unitPos, uGridDim, uColorTexDim, 0.0).rgb;
        #elif defined(dColorType_vertexInstance)
            material.rgb = texture3dFrom1dTrilinear(tColor, unitPos, uGridDim, uColorTexDim, vInstance * float(uVertexCount)).rgb;
        #endif

        #ifdef dOverpaint
            #if defined(dOverpaintType_groupInstance)
                overpaint = readFromTexture(tOverpaint, vInstance * float(uGroupCount) + group, uOverpaintTexDim);
            #elif defined(dOverpaintType_vertexInstance)
                overpaint = texture3dFrom1dTrilinear(tOverpaint, unitPos, uGridDim, uOverpaintTexDim, vInstance * float(uVertexCount));
            #endif

            material.rgb = mix(material.rgb, overpaint.rgb, overpaint.a);
        #endif

        #if defined(dIgnoreLight)
            gl_FragColor.rgb = material.rgb;
        #else
            if (material.a >= 0.01) {
                #ifdef dPackedGroup
                    // compute gradient by central differences
                    gradient.x = textureVal(unitPos - dx).a - textureVal(unitPos + dx).a;
                    gradient.y = textureVal(unitPos - dy).a - textureVal(unitPos + dy).a;
                    gradient.z = textureVal(unitPos - dz).a - textureVal(unitPos + dz).a;
                #else
                    gradient = cell.xyz * 2.0 - 1.0;
                #endif
                vec3 normal = -normalize(normalMatrix * normalize(gradient));
                #include apply_light_color
            } else {
                gl_FragColor.rgb = material.rgb;
            }
        #endif

        gl_FragColor.a = material.a * uAlpha * uTransferScale;

        #if defined(dColorMarker)
            float marker = uMarker;
            if (uMarker == -1.0) {
                marker = readFromTexture(tMarker, vInstance * float(uGroupCount) + group, uMarkerTexDim).a;
                marker = floor(marker * 255.0 + 0.5); // rounding required to work on some cards on win
            }
        #endif
        #include apply_marker_color

        preFogAlphaBlended = (1.0 - preFogAlphaBlended) * gl_FragColor.a + preFogAlphaBlended;
        fragmentDepth = calcDepth(mvPosition.xyz);
        #include apply_fog

        src = gl_FragColor;

        if (!uTransparentBackground || !uFog) {
            // done in 'apply_fog' otherwise
            src.rgb *= src.a;
        }
        dst = (1.0 - dst.a) * src + dst; // standard blending

        // break if the color is opaque enough
        if (dst.a > 0.95)
            break;

        pos += step;
    }

    return dst;
}

// TODO: support float texture for higher precision values???
// TODO: support clipping exclusion texture support

void main() {
    #if defined(dRenderVariant_tracing) || defined(dRenderVariant_emissive)
        discard;
    #else
        if (gl_FrontFacing)
            discard;

        vec3 rayDir = mix(normalize(vModelPosition - uCameraPosition), uCameraDir, uIsOrtho);
        vec3 step = rayDir * uStepScale * uModelScale;

        float boundingSphereNear = distance(vBoundingSphere.xyz, uCameraPosition) - vBoundingSphere.w;
        float d = max(uNear, boundingSphereNear) - mix(0.0, distance(vModelPosition, uCameraPosition), uIsOrtho);
        vec3 start = mix(uCameraPosition, vModelPosition, uIsOrtho) + (d * rayDir);
        gl_FragColor = raymarch(start, step, rayDir);

        float fragmentDepth = calcDepth((uView * vec4(start, 1.0)).xyz);
        float preFogAlpha = clamp(preFogAlphaBlended, 0.0, 1.0);
        #include wboit_write
    #endif
}
`,ts=`
precision highp float;
precision highp int;

#include common
#include common_vert_params

attribute vec3 aPosition;
attribute vec2 aUv;
attribute mat4 aTransform;
attribute float aInstance;

varying vec2 vUv;
varying float vInstance;
varying vec3 vPosition;

void main() {
    int vertexId = VertexID;

    #include assign_position

    vUv = aUv;
    vInstance = aInstance;
    vPosition = aPosition;
}
`,rs=`
precision highp float;
precision highp int;

#include common
#include read_from_texture
#include common_frag_params
#include common_clip

uniform float uEmissive;

// Density value to estimate object thickness
uniform float uDensity;

#if defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
    #ifdef dOverpaint
        #if defined(dOverpaintType_instance) || defined(dOverpaintType_groupInstance)
            varying vec4 vOverpaint;
            uniform vec2 uOverpaintTexDim;
            uniform sampler2D tOverpaint;
        #endif
        uniform float uOverpaintStrength;
    #endif
#endif

#if defined(dRenderVariant_color) || defined(dRenderVariant_tracing) || defined(dRenderVariant_emissive)
    #ifdef dEmissive
        #if defined(dEmissiveType_instance) || defined(dEmissiveType_groupInstance)
            varying float vEmissive;
            uniform vec2 uEmissiveTexDim;
            uniform sampler2D tEmissive;
        #endif
        uniform float uEmissiveStrength;
    #endif
#endif

#ifdef dTransparency
    #if defined(dTransparencyType_instance) || defined(dTransparencyType_groupInstance)
        varying float vTransparency;
        uniform vec2 uTransparencyTexDim;
        uniform sampler2D tTransparency;
    #endif
    uniform float uTransparencyStrength;
#endif

uniform vec2 uImageTexDim;
uniform sampler2D tImageTex;
uniform sampler2D tGroupTex;
uniform sampler2D tValueTex;

uniform vec2 uMarkerTexDim;
uniform sampler2D tMarker;

varying vec2 vUv;
varying float vInstance;
varying vec3 vPosition;

#ifdef dUsePalette
    uniform sampler2D tPalette;
    uniform vec3 uPaletteDefault;
#endif

uniform int uTrimType;
uniform vec3 uTrimCenter;
uniform vec4 uTrimRotation;
uniform vec3 uTrimScale;
uniform mat4 uTrimTransform;

uniform float uIsoLevel;

#if defined(dInterpolation_catmulrom) || defined(dInterpolation_mitchell) || defined(dInterpolation_bspline)
    #define dInterpolation_cubic
#endif

#if defined(dInterpolation_cubic)
    #if defined(dInterpolation_catmulrom) || defined(dInterpolation_mitchell)
        #if defined(dInterpolation_catmulrom)
            const float B = 0.0;
            const float C = 0.5;
        #elif defined(dInterpolation_mitchell)
            const float B = 0.333;
            const float C = 0.333;
        #endif

        float cubicFilter(float x){
            float f = x;
            if (f < 0.0) {
                f = -f;
            }
            if (f < 1.0) {
                return ((12.0 - 9.0 * B - 6.0 * C) * (f * f * f) +
                    (-18.0 + 12.0 * B + 6.0 * C) * (f * f) +
                    (6.0 - 2.0 * B)) / 6.0;
            }else if (f >= 1.0 && f < 2.0){
                return ((-B - 6.0 * C) * ( f * f * f)
                    + (6.0 * B + 30.0 * C) * (f * f) +
                    (-(12.0 * B) - 48.0 * C) * f +
                    8.0 * B + 24.0 * C) / 6.0;
            }else{
                return 0.0;
            }
        }
    #elif defined(dInterpolation_bspline)
        float cubicFilter(float x) {
            float f = x;
            if (f < 0.0) {
                f = -f;
            }
            if (f >= 0.0 && f <= 1.0){
                return (2.0 / 3.0) + (0.5) * (f * f * f) - (f * f);
            } else if (f > 1.0 && f <= 2.0) {
                return 1.0 / 6.0 * pow((2.0 - f), 3.0);
            }
            return 1.0;
        }
    #endif

    vec4 biCubic(sampler2D tex, vec2 texCoord) {
        vec2 texelSize = 1.0 / uImageTexDim;
        texCoord -= texelSize / 2.0;
        vec4 nSum = vec4(0.0);
        float nDenom = 0.0;
        vec2 cell = fract(texCoord * uImageTexDim);
        for (float m = -1.0; m <= 2.0; ++m) {
            for (float n = -1.0; n <= 2.0; ++n) {
                vec4 vecData = texture2D(tex, texCoord + texelSize * vec2(m, n));
                float c = abs(cubicFilter(m - cell.x) * cubicFilter(-n + cell.y));
                nSum += vecData * c;
                nDenom += c;
            }
        }
        return nSum / nDenom;
    }
#endif

void main() {
    if (uTrimType != 0 && getSignedDistance(vPosition, uTrimType, uTrimCenter, uTrimRotation, uTrimScale, uTrimTransform) > 0.0) discard;

    #include fade_lod
    #include clip_pixel

    #if defined(dInterpolation_cubic)
        #ifdef dUsePalette
            vec4 material = texture2D(tImageTex, vUv);
            if (material.rgb != vec3(1.0)) {
                material = biCubic(tImageTex, vUv);
            }
        #else
            vec4 material = biCubic(tImageTex, vUv);
        #endif
    #else
        vec4 material = texture2D(tImageTex, vUv);
    #endif

    if (uIsoLevel >= 0.0) {
        if (texture2D(tValueTex, vUv).r < uIsoLevel) discard;

        material.a = uAlpha;
    } else {
        if (material.a == 0.0) discard;

        material.a *= uAlpha;
    }

    float fragmentDepth = gl_FragCoord.z;

    vec3 packedGroup = texture2D(tGroupTex, vUv).rgb;
    float group = packedGroup == vec3(0.0) ? -1.0 : unpackRGBToInt(packedGroup);

    // apply per-group transparency
    #if defined(dTransparency) && (defined(dRenderVariant_pick) || defined(dRenderVariant_color) || defined(dRenderVariant_emissive) || defined(dRenderVariant_tracing))
        float transparency = 0.0;
        #if defined(dTransparencyType_instance)
            transparency = readFromTexture(tTransparency, vInstance, uTransparencyTexDim).a;
        #elif defined(dTransparencyType_groupInstance)
            transparency = readFromTexture(tTransparency, vInstance * float(uGroupCount) + group, uTransparencyTexDim).a;
        #endif
        transparency *= uTransparencyStrength;

        float ta = 1.0 - transparency;
        if (transparency < 0.09) ta = 1.0; // hard cutoff looks better

        #if defined(dRenderVariant_pick)
            if (ta * uAlpha < uPickingAlphaThreshold)
                discard; // ignore so the element below can be picked
        #elif defined(dRenderVariant_emissive)
            if (ta < 1.0)
                discard; // emissive not supported with transparency
        #elif defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
            material.a *= ta;
        #endif
    #endif

    if ((uRenderMask == MaskOpaque && material.a < 1.0) ||
        (uRenderMask == MaskTransparent && material.a == 1.0)
    ) {
        discard;
    }

    #if defined(dNeedsMarker)
        float marker = uMarker;
        if (group == -1.0) {
            marker = 0.0;
        } else if (uMarker == -1.0) {
            marker = readFromTexture(tMarker, vInstance * float(uGroupCount) + group, uMarkerTexDim).a;
            marker = floor(marker * 255.0 + 0.5); // rounding required to work on some cards on win
        }
    #endif

    #if defined(dRenderVariant_color) || defined(dRenderVariant_tracing) || defined(dRenderVariant_emissive)
        float emissive = uEmissive;
        if (group == -1.0) {
            emissive = 0.0;
        } else {
            #ifdef dEmissive
                #if defined(dEmissiveType_instance)
                    emissive += readFromTexture(tEmissive, vInstance, uEmissiveTexDim).a * uEmissiveStrength;
                #elif defined(dEmissiveType_groupInstance)
                    emissive += readFromTexture(tEmissive, vInstance * float(uGroupCount) + group, uEmissiveTexDim).a * uEmissiveStrength;
                #endif
            #endif
        }
    #endif

    #if defined(dRenderVariant_pick)
        if (group == -1.0) discard;

        #include check_picking_alpha
        #ifdef requiredDrawBuffers
            gl_FragColor = vec4(packIntToRGB(float(uObjectId)), 1.0);
            gl_FragData[1] = vec4(packIntToRGB(vInstance), 1.0);
            gl_FragData[2] = vec4(packIntToRGB(group), 1.0);
            gl_FragData[3] = packDepthToRGBA(fragmentDepth);
        #else
            gl_FragColor = vColor;
            if (uPickType == 1) {
                gl_FragColor = vec4(packIntToRGB(float(uObjectId)), 1.0);
            } else if (uPickType == 2) {
                gl_FragColor = vec4(packIntToRGB(vInstance), 1.0);
            } else {
                gl_FragColor = vec4(packIntToRGB(group), 1.0);
            }
        #endif
    #elif defined(dRenderVariant_depth)
        if (uRenderMask == MaskOpaque) {
            gl_FragColor = packDepthToRGBA(fragmentDepth);
        } else if (uRenderMask == MaskTransparent) {
            gl_FragColor = packDepthWithAlphaToRGBA(fragmentDepth, material.a);
        }
    #elif defined(dRenderVariant_marking)
        if (uMarkingType == 1) {
            if (marker > 0.0)
                discard;
            gl_FragColor = packDepthToRGBA(fragmentDepth);
        } else {
            if (marker == 0.0)
                discard;
            float depthTest = 1.0;
            if (uMarkingDepthTest) {
                depthTest = (fragmentDepth >= getDepthPacked(gl_FragCoord.xy / uDrawingBufferSize)) ? 1.0 : 0.0;
            }
            bool isHighlight = intMod(marker, 2.0) > 0.1;
            float viewZ = depthToViewZ(uIsOrtho, fragmentDepth, uNear, uFar);
            float fogFactor = smoothstep(uFogNear, uFogFar, abs(viewZ));
            if (fogFactor == 1.0)
                discard;
            gl_FragColor = vec4(0.0, depthTest, isHighlight ? 1.0 : 0.0, 1.0 - fogFactor);
        }
    #elif defined(dRenderVariant_emissive)
        gl_FragColor = vec4(emissive);
    #elif defined(dRenderVariant_color) || defined(dRenderVariant_tracing)
        #ifdef dUsePalette
            if (material.rgb == vec3(1.0)) {
                material.rgb = uPaletteDefault;
            } else {
                float v = ((material.r * 256.0 * 256.0 * 255.0 + material.g * 256.0 * 255.0 + material.b * 255.0) - 1.0) / PALETTE_SCALE;
                material.rgb = texture2D(tPalette, vec2(v, 0.0)).rgb;
            }
        #endif

        // mix material with overpaint
        #if defined(dOverpaint)
            vec4 overpaint = vec4(0.0);
            if (group != -1.0) {
                #if defined(dOverpaintType_instance)
                    overpaint = readFromTexture(tOverpaint, vInstance, uOverpaintTexDim);
                #elif defined(dOverpaintType_groupInstance)
                    overpaint = readFromTexture(tOverpaint, vInstance * float(uGroupCount) + group, uOverpaintTexDim);
                #endif
                overpaint *= uOverpaintStrength;
            }
            material.rgb = mix(material.rgb, overpaint.rgb, overpaint.a);
        #endif

        gl_FragColor = material;
        #include apply_marker_color

        #if defined(dRenderVariant_color)
            #include apply_fog
            #include wboit_write
            #include dpoit_write
        #elif defined(dRenderVariant_tracing)
            gl_FragData[1] = vec4(normalize(vViewPosition), emissive);
            gl_FragData[2] = vec4(material.rgb, uDensity);
        #endif
    #endif
}
`,za=Ve(),ns={apply_fog:oo,apply_interior_color:so,apply_light_color:uo,apply_marker_color:co,assign_clipping_varying:fo,assign_color_varying:lo,assign_group:mo,assign_marker_varying:po,assign_material_color:go,assign_position:vo,assign_size:ho,check_picking_alpha:bo,check_transparency:yo,clip_instance:_o,clip_pixel:To,color_frag_params:xo,color_vert_params:Co,common_animation:So,common_clip:Eo,common_frag_params:Io,common_vert_params:Ao,common:Do,fade_lod:Ro,float_to_rgba:wo,light_frag_params:Bo,normal_frag_params:Fo,read_from_texture:Po,rgba_to_float:Lo,size_vert_params:Oo,texture3d_from_1d_trilinear:Mo,texture3d_from_2d_linear:No,texture3d_from_2d_nearest:Go,wboit_write:ko,dpoit_write:Vo},as=/^(?!\/\/)\s*#include\s+(\S+)/gm,is=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*\+\+i\s*\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g,os=/[ \t]*\/\/.*\n/g,ss=/[ \t]*\/\*[\s\S]*?\*\//g,us=/\n{2,}/g;function Hn(e){return e.replace(as,(t,r)=>{const n=ns[r];if(!n)throw new Error(`empty chunk, '${r}'`);return n}).trim().replace(os,`
`).replace(ss,`
`).replace(us,`
`)}function cs(e){return e.replace(is,fs)}function fs(e,t,r,n){let i="";for(let s=parseInt(t);s<parseInt(r);++s)i+=n.replace(/\[\s*i\s*\]/g,`[${s}]`).replace(/UNROLLED_LOOP_INDEX/g,`${s}`);return i}function ds(e,t){return t.dLightCount&&(e=e.replace(/dLightCount/g,`${t.dLightCount.ref.value}`)),t.dClipObjectCount&&(e=e.replace(/dClipObjectCount/g,`${t.dClipObjectCount.ref.value}`)),e}function $n(e,t){return cs(ds(e,t))}function ot(e,t,r,n={},i={},s){return{id:za(),name:e,vert:Hn(t),frag:Hn(r),extensions:n,outTypes:i,ignoreDefine:s}}function tr(e,t,r){var n;if(t.startsWith("color")||t==="tracing"){if(e==="dLightCount")return!!(!((n=r.dIgnoreLight)===null||n===void 0)&&n.ref.value)}else{const i=["dColorType","dUsePalette","dOverpaintType","dOverpaint","dSubstanceType","dSubstance","dColorMarker","dCelShaded","dLightCount"];return t!=="depth"&&!t.startsWith("pick")&&i.push("dXrayShaded"),t!=="emissive"&&i.push("dEmissiveType","dEmissive"),i.includes(e)}return!1}function Fr(e,t,r){return e==="dLightCount"?!0:tr(e,t,r)}const ls=ot("points",zo,Uo,{drawBuffers:"optional"},{},Fr),ms=ot("spheres",jo,qo,{fragDepth:"required",drawBuffers:"optional"},{},tr),ps=ot("cylinders",Wo,Xo,{fragDepth:"required",drawBuffers:"optional"},{},tr),gs=ot("text",Ho,$o,{fragDepth:"optional",drawBuffers:"optional"},{},Fr),vs=ot("lines",Yo,Qo,{drawBuffers:"optional"},{},Fr),Ua=ot("mesh",Zo,Ko,{drawBuffers:"optional"},{},tr),hs=ot("direct-volume",Jo,es,{fragDepth:"optional",drawBuffers:"optional"},{},tr),bs=ot("image",ts,rs,{drawBuffers:"optional"},{},Fr);function Yn(e,t){var r;if(e===void 0)return"";const n=((r=e.dRenderVariant)===null||r===void 0?void 0:r.ref.value)||"",i=[];for(const s in e){if(t?.(s,n,e))continue;const p=e[s].ref.value;p!==void 0&&(typeof p=="string"?i.push(`#define ${s}_${p}`):typeof p=="number"?i.push(`#define ${s} ${p}`):typeof p=="boolean"?p&&i.push(`#define ${s}`):er())}return i.join(`
`)+`
`}function ys(e,t){const r=[];if(t.drawBuffers){if(e.drawBuffers)r.push("#define requiredDrawBuffers");else if(t.drawBuffers==="required")throw new Error("required 'GL_EXT_draw_buffers' extension not available")}if(t.multiDraw){if(e.multiDraw)r.push("#extension GL_ANGLE_multi_draw : require"),r.push("#define enabledMultiDraw");else if(t.multiDraw==="required")throw new Error("required 'GL_ANGLE_multi_draw' extension not available")}return r.join(`
`)+`
`}function _s(e,t){const r=["#extension GL_OES_standard_derivatives : enable"];if(t.fragDepth){if(e.fragDepth)r.push("#extension GL_EXT_frag_depth : enable"),r.push("#define enabledFragDepth");else if(t.fragDepth==="required")throw new Error("required 'GL_EXT_frag_depth' extension not available")}if(t.drawBuffers){if(e.drawBuffers)r.push("#extension GL_EXT_draw_buffers : require"),r.push("#define requiredDrawBuffers"),r.push("#define gl_FragColor gl_FragData[0]");else if(t.drawBuffers==="required")throw new Error("required 'GL_EXT_draw_buffers' extension not available")}if(t.shaderTextureLod){if(e.shaderTextureLod)r.push("#extension GL_EXT_shader_texture_lod : enable"),r.push("#define enabledShaderTextureLod");else if(t.shaderTextureLod==="required")throw new Error("required 'GL_EXT_shader_texture_lod' extension not available")}return e.depthTexture&&r.push("#define depthTextureSupport"),r.join(`
`)+`
`}const Ts=`
#define attribute in
#define varying out
#define texture2D texture
`,xs=`
#define varying in
#define texture2D texture
#define textureCube texture
#define texture2DLodEXT textureLod
#define textureCubeLodEXT textureLod

#define gl_FragColor out_FragData0
#define gl_FragDepthEXT gl_FragDepth
`;function Cs(e,t){const r=["#version 300 es"];if(t.drawBuffers&&e.drawBuffers&&r.push("#define requiredDrawBuffers"),t.multiDraw){if(e.multiDraw)r.push("#extension GL_ANGLE_multi_draw : require"),r.push("#define enabledMultiDraw");else if(t.multiDraw==="required")throw new Error("required 'GL_ANGLE_multi_draw' extension not available")}if(t.clipCullDistance){if(e.clipCullDistance)r.push("#extension GL_ANGLE_clip_cull_distance : enable"),r.push("#define enabledClipCullDistance");else if(t.clipCullDistance==="required")throw new Error("required 'GL_ANGLE_clip_cull_distance' extension not available")}if(t.conservativeDepth){if(e.conservativeDepth)r.push("#extension GL_EXT_conservative_depth : enable"),r.push("#define enabledConservativeDepth");else if(t.conservativeDepth==="required")throw new Error("required 'GL_EXT_conservative_depth' extension not available")}if(t.multiview2){if(e.multiview2)r.push("#extension GL_OVR_multiview2 : require"),r.push("#define enabledMultiview2");else if(t.multiview2==="required")throw new Error("required 'GL_OVR_multiview2' extension not available")}return e.noNonInstancedActiveAttribs&&r.push("#define noNonInstancedActiveAttribs"),r.push(Ts),r.join(`
`)+`
`}function Ss(e,t,r,n){const i=["#version 300 es",`layout(location = 0) out highp ${n[0]||"vec4"} out_FragData0;`];if(r.fragDepth&&e.fragDepth&&i.push("#define enabledFragDepth"),r.drawBuffers&&e.drawBuffers){i.push("#define requiredDrawBuffers");for(let s=1,u=t.maxDrawBuffers;s<u;++s)i.push(`layout(location = ${s}) out highp ${n[s]||"vec4"} out_FragData${s};`)}return r.shaderTextureLod&&e.shaderTextureLod&&i.push("#define enabledShaderTextureLod"),e.depthTexture&&i.push("#define depthTextureSupport"),i.push(xs),i.join(`
`)+`
`}function Es(e){return e.replace(/gl_FragData\[([0-9]+)\]/g,"out_FragData$1")}function Is(e,t,r,n,i){const s=Yn(n,i.ignoreDefine),u=Yn(n,i.ignoreDefine),p=K(e)?Cs(t,i.extensions):ys(t,i.extensions),m=K(e)?Ss(t,r,i.extensions,i.outTypes):_s(t,i.extensions),v=K(e)?Es(i.frag):i.frag;return{id:za(),name:i.name,vert:`${p}${s}${$n(i.vert,n)}`,frag:`${m}${u}${$n(v,n)}`,extensions:i.extensions,outTypes:i.outTypes}}function As(e,t){switch(t){case"b":case"b[]":return e.BOOL;case"f":case"f[]":return e.FLOAT;case"i":case"i[]":return e.INT;case"v2":case"v2[]":return e.FLOAT_VEC2;case"v3":case"v3[]":return e.FLOAT_VEC3;case"v4":case"v4[]":return e.FLOAT_VEC4;case"q":case"q[]":return e.FLOAT_VEC4;case"iv2":case"iv2[]":return e.INT_VEC2;case"iv3":case"iv3[]":return e.INT_VEC3;case"iv4":case"iv4[]":return e.INT_VEC4;case"m3":case"m3[]":return e.FLOAT_MAT3;case"m4":case"m4[]":return e.FLOAT_MAT4;default:console.error(`unknown uniform kind '${t}'`)}}function Ds(e){return e.endsWith("[]")}function Rs(e,t,r){e.uniform1f(t,r)}function ws(e,t,r){e.uniform1fv(t,r)}function Bs(e,t,r){e.uniform1i(t,r)}function Fs(e,t,r){e.uniform1iv(t,r)}function Ps(e,t,r){e.uniform2fv(t,r)}function Ls(e,t,r){e.uniform3fv(t,r)}function Qn(e,t,r){e.uniform4fv(t,r)}function Os(e,t,r){e.uniform2iv(t,r)}function Ms(e,t,r){e.uniform3iv(t,r)}function Ns(e,t,r){e.uniform4iv(t,r)}function Gs(e,t,r){e.uniformMatrix3fv(t,!1,r)}function ks(e,t,r){e.uniformMatrix4fv(t,!1,r)}function Zn(e){switch(e){case"f":return Rs;case"f[]":return ws;case"i":case"t":case"b":return Bs;case"i[]":case"t[]":case"b[]":return Fs;case"v2":case"v2[]":return Ps;case"v3":case"v3[]":return Ls;case"v4":case"v4[]":return Qn;case"q":case"q[]":return Qn;case"iv2":case"iv2[]":return Os;case"iv3":case"iv3[]":return Ms;case"iv4":case"iv4[]":return Ns;case"m3":case"m3[]":return Gs;case"m4":case"m4[]":return ks}}function Vs(e){const t={};return Object.keys(e).forEach(r=>{const n=e[r];n.type==="uniform"?t[r]=Zn(n.kind):n.type==="texture"&&(t[r]=Zn("t"))}),t}function zs(e){const t={};return Object.keys(e).forEach(r=>{t[r]=a.create(Aa(e[r].ref.value))}),t}const ja=Ve();function Us(e,t){switch(t){case"static":return e.STATIC_DRAW;case"dynamic":return e.DYNAMIC_DRAW;case"stream":return e.STREAM_DRAW;default:er()}}function js(e,t){if(t instanceof Uint8Array)return e.UNSIGNED_BYTE;if(t instanceof Int8Array)return e.BYTE;if(t instanceof Uint16Array)return e.UNSIGNED_SHORT;if(t instanceof Int16Array)return e.SHORT;if(t instanceof Uint32Array)return e.UNSIGNED_INT;if(t instanceof Int32Array)return e.INT;if(t instanceof Float32Array)return e.FLOAT;er()}function qs(e,t){switch(t){case"attribute":return e.ARRAY_BUFFER;case"elements":return e.ELEMENT_ARRAY_BUFFER;case"uniform":if(K(e))return e.UNIFORM_BUFFER;throw new Error("WebGL2 is required for uniform buffers");case"pixel-pack":if(K(e))return e.PIXEL_PACK_BUFFER;throw new Error("WebGL2 is required for pixel-pack buffers")}}function Sr(e){const t=e.createBuffer();if(t===null)throw new Error("Could not create WebGL buffer");return t}function qa(e,t,r,n){let i=Sr(e);const s=Us(e,r),u=qs(e,n),p=js(e,t),m=t.BYTES_PER_ELEMENT,v=t.length;function h(x){e.bindBuffer(u,i),e.bufferData(u,x,s)}h(t);let y=!1;return{id:ja(),_usageHint:s,_bufferType:u,_dataType:p,_bpe:m,length:v,getByteCount:()=>m*v,getBuffer:()=>i,updateData:h,updateSubData:(x,f,c)=>{e.bindBuffer(u,i),c-f===x.length?e.bufferSubData(u,0,x):e.bufferSubData(u,f*m,x.subarray(f,f+c))},reset:()=>{i=Sr(e),h(t)},destroy:()=>{y||(e.deleteBuffer(i),y=!0)}}}function Ws(e,t,r){switch(t){case"float32":switch(r){case 1:return e.FLOAT;case 2:return e.FLOAT_VEC2;case 3:return e.FLOAT_VEC3;case 4:return e.FLOAT_VEC4;case 16:return e.FLOAT_MAT4}default:er()}}function Xs(e,t,r,n,i,s,u="static"){const{instancedArrays:p}=r,m=qa(e,n,u,"attribute"),{_bufferType:v,_dataType:h,_bpe:y}=m;return{...m,divisor:s,bind:x=>{if(e.bindBuffer(v,m.getBuffer()),i===16)for(let f=0;f<4;++f)t.enableVertexAttrib(x+f),e.vertexAttribPointer(x+f,4,h,!1,16*y,f*4*y),p.vertexAttribDivisor(x+f,s);else t.enableVertexAttrib(x),e.vertexAttribPointer(x,i,h,!1,0,0),p.vertexAttribDivisor(x,s)},changeOffset:(x,f)=>{const c=f*y*i;if(e.bindBuffer(v,m.getBuffer()),i===16)for(let o=0;o<4;++o)e.vertexAttribPointer(x+o,4,h,!1,16*y,o*4*y+c);else e.vertexAttribPointer(x,i,h,!1,0,c)}}}function Hs(e,t,r){const n=[];return Object.keys(t).forEach(i=>{const s=t[i];s.type==="attribute"&&(n[n.length]=[i,e.resources.attribute(r[i].ref.value,s.itemSize,s.divisor)])}),n}function $s(e,t,r="static"){const n=qa(e,t,r,"elements");return{...n,bind:()=>{e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.getBuffer())}}}function Ys(e,t,r,n){let i=Sr(e);const s=Ja(e,t,n),u=En(e,r,n),p=Ka(r,n);let m=0,v=0;function h(f,c,o,d){m=o,v=d,e.bindBuffer(e.PIXEL_PACK_BUFFER,i),e.bufferData(e.PIXEL_PACK_BUFFER,o*d*p,e.STREAM_READ),e.readPixels(f,c,o,d,u,s,0),e.bindBuffer(e.PIXEL_PACK_BUFFER,null)}function y(f){e.bindBuffer(e.PIXEL_PACK_BUFFER,i),e.getBufferSubData(e.PIXEL_PACK_BUFFER,0,f),e.bindBuffer(e.PIXEL_PACK_BUFFER,null)}let x=!1;return{id:ja(),_type:s,_format:u,_bpe:p,getByteCount:()=>p*m*v,read:h,getSubData:y,reset:()=>{i=Sr(e)},destroy:()=>{x||(e.deleteBuffer(i),x=!0)}}}const Qs=Ve();function Zs(e,t,r){const n={};return Object.keys(r).forEach(i=>{const s=r[i];if(s.type==="attribute"){const u=e.getAttribLocation(t,i);n[i]=u}else if(s.type==="uniform"){let u=e.getUniformLocation(t,i);u===null&&Ds(s.kind)&&(u=e.getUniformLocation(t,i+"[0]")),n[i]=u}else if(s.type==="texture"){const u=e.getUniformLocation(t,i);n[i]=u}}),n}function Ks(e,t,r){const n=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<n;++i){const s=e.getActiveAttrib(t,i);if(s){const{name:u,type:p}=s;if(u.startsWith("__activeAttribute")||u==="gl_InstanceID"||u==="gl_VertexID"||u==="gl_DrawID"||u==="gl_ViewID_OVR")continue;const m=r[u];if(m===void 0)throw new Error(`missing 'uniform' or 'texture' with name '${u}' in schema`);if(m.type!=="attribute")throw new Error(`'${u}' must be of type 'attribute' but is '${m.type}'`);const v=Ws(e,m.kind,m.itemSize);if(v!==p)throw new Error(`unexpected attribute type '${v}' for ${u}, expected '${p}'`)}}}function Js(e,t,r){const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const s=e.getActiveUniform(t,i);if(s){const{name:u,type:p}=s;if(u.startsWith("__activeUniform")||u==="gl_InstanceID"||u==="gl_VertexID"||u==="gl_DrawID"||u==="gl_ViewID_OVR")continue;const m=u.replace(/[[0-9]+\]$/,""),v=r[m];if(v===void 0)throw new Error(`missing 'uniform' or 'texture' with name '${u}' in schema`);if(v.type==="uniform"){if(As(e,v.kind)!==p)throw new Error(`unexpected uniform type for ${u}`)}else if(v.type==="texture"){if(v.kind==="image-float32"||v.kind==="image-uint8"){if(p!==e.SAMPLER_2D)throw new Error(`unexpected sampler type for '${u}'`)}else if(v.kind==="volume-float32"||v.kind==="volume-uint8")if(K(e)){if(p!==e.SAMPLER_3D)throw new Error(`unexpected sampler type for '${u}'`)}else throw new Error("WebGL2 is required to use SAMPLER_3D")}else throw new Error(`'${u}' must be of type 'uniform' or 'texture' but is '${v.type}'`)}}}function eu(e,t){if(!e.getProgramParameter(t,e.LINK_STATUS))throw new Error(`Could not compile WebGL program. 

${e.getProgramInfoLog(t)}`)}function cn(e){const t=e.createProgram();if(t===null)throw new Error("Could not create WebGL program");return t}function tu(e){if(typeof e!="string")throw new Error(`unknown program variant: ${e}`);return e.startsWith("color")?"color":e.startsWith("pick")?"pick":e}function ru(e,t,r,n,i,s){const{defineValues:u,shaderCode:p,schema:m}=s;let v=cn(e);const h=Qs(),y=tu(u.dRenderVariant.ref.value),x=Is(e,r,n,u,p),f=i("vert",x.vert),c=i("frag",x.frag);let o,d,g=!1,_=!1,l=!1;function b(){f.attach(v),c.attach(v),e.linkProgram(v),oe&&eu(e,v),g=!0}y==="compute"&&b();function I(){o=Zs(e,v,m),d=Vs(m),oe&&(Ks(e,v,m),Js(e,v,m)),_=!0}return{id:h,variant:y,isReady:()=>_,link:()=>{g||b()},finalize(C){return g||b(),!_&&(C||!r.parallelShaderCompile||e.getProgramParameter(v,r.parallelShaderCompile.COMPLETION_STATUS))&&I(),_},use:()=>{if(oe&&!_)throw new Error(`program not finalized: ${y}`);t.currentProgramId=h,e.useProgram(v)},setUniforms:C=>{for(let A=0,D=C.length;A<D;++A){const[w,R]=C[A];if(R){const S=o[w];S!==null&&d[w](e,S,R.ref.value)}}},uniform:(C,A)=>{const D=o[C];D!==null&&d[C](e,D,A)},bindAttributes:C=>{t.clearVertexAttribsState();for(let A=0,D=C.length;A<D;++A){const[w,R]=C[A],S=o[w];S!==-1&&R.bind(S)}t.disableUnusedVertexAttribs()},offsetAttributes:(C,A)=>{for(let D=0,w=C.length;D<w;++D){const[R,S]=C[D],E=o[R];E!==-1&&S.changeOffset(E,A)}},bindTextures:(C,A)=>{for(let D=0,w=C.length;D<w;++D){const[R,S]=C[D],E=o[R];E!=null&&(S.bind(D+A),d[R](e,E,D+A))}},reset:()=>{v=cn(e),g&&b(),_&&I()},destroy:()=>{l||(f.destroy(),c.destroy(),e.deleteProgram(v),l=!0)}}}const nu=Ve();function au(e){const t=e.split(`
`);for(let r=0;r<t.length;++r)t[r]=r+1+": "+t[r];return t.join(`
`)}function Er(e,t){const{type:r,source:n}=t,i=e.createShader(r==="vert"?e.VERTEX_SHADER:e.FRAGMENT_SHADER);if(i===null)throw new Error(`Error creating ${r} shader`);if(e.shaderSource(i,n),e.compileShader(i),oe&&e.getShaderParameter(i,e.COMPILE_STATUS)===!1)throw console.warn(`'${r}' shader info log '${e.getShaderInfoLog(i)}'
${au(n)}`),new Error(`Error compiling ${r} shader`);return i}function iu(e,t){let r=Er(e,t);return{id:nu(),attach:n=>{e.attachShader(n,r)},reset:()=>{r=Er(e,t)},destroy:()=>{e.deleteShader(r)}}}function ou(e,t=0){return{value:e,usageCount:t}}function su(e){return{free:()=>{e.usageCount-=1},value:e.value}}function Kn(e,t,r){const n=new Map,i=[];return{get:s=>{const u=e(s);let p=n.get(u);return p||(p=ou(t(s)),n.set(u,p),i.push(p.value)),p.usageCount+=1,su(p)},clear:()=>{n.forEach((s,u)=>{s.usageCount<=0&&(s.usageCount<0&&console.warn("Reference usageCount below zero."),r(s.value),n.delete(u),yi(i,s.value))})},get count(){return n.size},values:i,dispose:()=>{n.forEach(s=>r(s.value)),n.clear(),i.length=0}}}const uu=Ve();function cu(e,t){switch(t){case"depth16":return e.DEPTH_COMPONENT16;case"stencil8":return e.STENCIL_INDEX8;case"rgba4":return e.RGBA4;case"depth-stencil":return e.DEPTH_STENCIL;case"depth24":if(K(e))return e.DEPTH_COMPONENT24;throw new Error("WebGL2 needed for `depth24` renderbuffer format");case"depth32f":if(K(e))return e.DEPTH_COMPONENT32F;throw new Error("WebGL2 needed for `depth32f` renderbuffer format");case"depth24-stencil8":if(K(e))return e.DEPTH24_STENCIL8;throw new Error("WebGL2 needed for `depth24-stencil8` renderbuffer format");case"depth32f-stencil8":if(K(e))return e.DEPTH32F_STENCIL8;throw new Error("WebGL2 needed for `depth32f-stencil8` renderbuffer format")}}function fu(e){switch(e){case"depth16":return 4;case"stencil8":return 2;case"rgba4":return 4;case"depth-stencil":return 4;case"depth24":return 3;case"depth32f":return 4;case"depth24-stencil8":return 4;case"depth32f-stencil8":return 5}}function du(e,t){switch(t){case"depth":return e.DEPTH_ATTACHMENT;case"stencil":return e.STENCIL_ATTACHMENT;case"depth-stencil":return e.DEPTH_STENCIL_ATTACHMENT;case"color0":return e.COLOR_ATTACHMENT0}}function Jn(e){const t=e.createRenderbuffer();if(t===null)throw new Error("Could not create WebGL renderbuffer");return t}function lu(e,t,r,n,i){let s=Jn(e);const u=()=>e.bindRenderbuffer(e.RENDERBUFFER,s),p=cu(e,t),m=du(e,r);function v(){u(),e.renderbufferStorage(e.RENDERBUFFER,p,n,i)}v();let h=!1;return{id:uu(),getByteCount:()=>fu(t)*n*i,bind:u,attachFramebuffer:y=>{y.bind(),u(),e.framebufferRenderbuffer(e.FRAMEBUFFER,m,e.RENDERBUFFER,s),oe&&Cr(e)},detachFramebuffer:y=>{y.bind(),u(),e.framebufferRenderbuffer(e.FRAMEBUFFER,m,e.RENDERBUFFER,null),oe&&Cr(e)},setSize:(y,x)=>{n=y,i=x,v()},reset:()=>{s=Jn(e),v()},destroy:()=>{h||(e.deleteRenderbuffer(s),h=!0)}}}const mu=Ve();function ea(e){const{vertexArrayObject:t}=e;if(!t)throw new Error("VertexArrayObject not supported");const r=t.createVertexArray();if(!r)throw new Error("Could not create WebGL vertex array");return r}function ta(e){const{vertexArrayObject:t}=e;if(t===null)throw new Error("VertexArrayObject not supported");return t}function pu(e,t,r,n,i){const s=mu();let u=ea(t),p=ta(t);function m(){p.bindVertexArray(u),i&&i.bind(),r.bindAttributes(n),p.bindVertexArray(null),v=!0}let v=!1,h=!1;return{id:s,bind:()=>{v||m(),p.bindVertexArray(u)},update:m,reset:()=>{u=ea(t),p=ta(t),v=!1},destroy:()=>{h||(i&&(p.bindVertexArray(u),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null)),p.deleteVertexArray(u),h=!0)}}}function gu(e){return typeof e=="boolean"?e?1:0:typeof e=="number"?e*1e4:Da(e)}function ra(e){return{...e.value,destroy:()=>{e.free()}}}function vu(e,t,r,n,i){const s={attribute:new Set,elements:new Set,pixelPack:new Set,framebuffer:new Set,program:new Set,renderbuffer:new Set,shader:new Set,texture:new Set,cubeTexture:new Set,vertexArray:new Set};function u(y,x){return s[y].add(x),r.resourceCounts[y]+=1,{...x,destroy:()=>{x.destroy(),s[y].delete(x),r.resourceCounts[y]-=1}}}const p=Kn(y=>JSON.stringify(y),y=>u("shader",iu(e,y)),y=>{y.destroy()});function m(y,x){return ra(p.get({type:y,source:x}))}const v=new Set,h=Kn(y=>{var x;const f=[y.shaderCode.id],c=((x=y.defineValues.dRenderVariant)===null||x===void 0?void 0:x.ref.value)||"";return Object.keys(y.defineValues).forEach(o=>{var d,g;!((g=(d=y.shaderCode).ignoreDefine)===null||g===void 0)&&g.call(d,o,c,y.defineValues)||f.push(Da(o),gu(y.defineValues[o].ref.value))}),it(f).toString()},y=>{const x=ru(e,t,n,i,m,y);return x.variant!=="compute"&&v.add(x),u("program",x)},y=>{v.delete(y),y.destroy()});return{attribute:(y,x,f,c)=>u("attribute",Xs(e,t,n,y,x,f,c)),elements:(y,x)=>u("elements",$s(e,y,x)),pixelPack:(y,x)=>{if(!K(e))throw new Error("WebGL2 is required for pixel-pack buffers");return u("pixelPack",Ys(e,n,y,x))},framebuffer:()=>u("framebuffer",ro(e)),program:(y,x,f)=>ra(h.get({defineValues:y,shaderCode:x,schema:f})),renderbuffer:(y,x,f,c)=>u("renderbuffer",lu(e,y,x,f,c)),shader:m,texture:(y,x,f,c)=>u("texture",yc(e,n,y,x,f,c)),cubeTexture:(y,x,f)=>u("cubeTexture",Tc(e,y,x,f)),vertexArray:(y,x,f)=>u("vertexArray",pu(e,n,y,x,f)),getByteCounts:()=>{let y=0;s.texture.forEach(g=>{y+=g.getByteCount()});let x=0;s.cubeTexture.forEach(g=>{x+=g.getByteCount()});let f=0;s.attribute.forEach(g=>{f+=g.getByteCount()});let c=0;s.elements.forEach(g=>{c+=g.getByteCount()});let o=0;s.pixelPack.forEach(g=>{o+=g.getByteCount()});let d=0;return s.renderbuffer.forEach(g=>{d+=g.getByteCount()}),{texture:y,cubeTexture:x,attribute:f,elements:c,pixelPack:o,renderbuffer:d}},linkPrograms:y=>{for(const x of v)y&&!y.includes(x.variant)||x.link()},finalizePrograms:(y,x)=>{let f=!0,c=0;for(const _ of v)_.isReady()&&v.delete(_),(!y||y.includes(_.variant))&&(f=!1,c+=1);if(f)return!0;let o=!0,d=0;const g=Mt();for(const _ of v)if(!(y&&!y.includes(_.variant))&&(_.finalize(x)?(v.delete(_),d+=1):o=!1,!x&&Mt()-g>16)){o=!1;break}return Le&&console.log(`Finalized ${d} of ${c} programs (${y?y.join(", "):"all"}) in ${(Mt()-g).toFixed(2)} ms`),o},reset:()=>{s.attribute.forEach(y=>y.reset()),s.elements.forEach(y=>y.reset()),s.pixelPack.forEach(y=>y.reset()),s.framebuffer.forEach(y=>y.reset()),s.renderbuffer.forEach(y=>y.reset()),s.shader.forEach(y=>y.reset()),s.program.forEach(y=>y.reset()),s.vertexArray.forEach(y=>y.reset()),s.texture.forEach(y=>y.reset()),s.cubeTexture.forEach(y=>y.reset())},destroy:()=>{s.attribute.forEach(y=>y.destroy()),s.elements.forEach(y=>y.destroy()),s.pixelPack.forEach(y=>y.destroy()),s.framebuffer.forEach(y=>y.destroy()),s.renderbuffer.forEach(y=>y.destroy()),s.shader.forEach(y=>y.destroy()),s.program.forEach(y=>y.destroy()),s.vertexArray.forEach(y=>y.destroy()),s.texture.forEach(y=>y.destroy()),s.cubeTexture.forEach(y=>y.destroy()),p.clear(),h.clear(),v.clear()}}}const hu=Ve();function bu(e,t,r,n,i=!0,s="uint8",u="nearest",p="rgba"){if(p==="alpha"&&!K(e))throw new Error("cannot render to alpha format in webgl1");const m=t.framebuffer(),v=s==="fp16"?t.texture("image-float16",p,"fp16",u):s==="float32"?t.texture("image-float32",p,"float",u):t.texture("image-uint8",p,"ubyte",u),h=i?K(e)?t.renderbuffer("depth32f","depth",r,n):t.renderbuffer("depth16","depth",r,n):null;function y(){v.define(r,n),v.attachFramebuffer(m,"color0"),h&&h.attachFramebuffer(m)}y();let x=!1;return{id:hu(),texture:v,framebuffer:m,depthRenderbuffer:h,getByteCount:()=>v.getByteCount()+(h?h.getByteCount():0),getWidth:()=>r,getHeight:()=>n,bind:()=>{m.bind()},setSize:(f,c)=>{r===f&&n===c||(r=f,n=c,v.define(r,n),h&&h.setSize(r,n))},reset:()=>{y()},destroy:()=>{x||(v.destroy(),m.destroy(),h&&h.destroy(),x=!0)}}}function yu(e,t,r){return e-=e/r,e+=t/r,e}class na{add(t,r){let n=this.avgs.get(t)||r;return n=yu(n,r,this.count),this.avgs.set(t,n),n}get(t){return this.avgs.get(t)}stats(){return Object.fromEntries(this.avgs.entries())}clear(){this.avgs.clear()}constructor(t){this.count=t,this.avgs=new Map}}function _u(e){e.calls.drawInstanced=0,e.calls.drawInstancedBase=0,e.calls.multiDrawInstancedBase=0,e.calls.counts=0,e.culled.lod=0,e.culled.frustum=0,e.culled.occlusion=0}function Tu(e){return e.disjointTimerQuery?e.disjointTimerQuery.createQuery():null}function xu(e,t,r,n){var i;const s=t.disjointTimerQuery,u=(i=void 0)!==null&&i!==void 0?i:30,p=new Map,m=new Map,v=[],h=new na(u),y=new na(u);let x=[],f=null,c=!1;const o=()=>{m.clear(),v.length=0,h.clear(),y.clear(),x=[],f=null,c=!1,s&&p.forEach((g,_)=>{s.deleteQuery(_)}),p.clear()},d=()=>{if(!s)return;const g=Tu(t);g&&(s.beginQuery(s.TIME_ELAPSED,g),m.forEach((_,l)=>{_.queries.push(g)}),p.set(g,{refCount:m.size}),f=g)};return{resolve:()=>{const g=[];if(!s||!x.length||c)return g;p.forEach((l,b)=>{if(l.timeElapsed!==void 0)return;const I=s.getQueryParameter(b,s.QUERY_RESULT_AVAILABLE),C=e.getParameter(s.GPU_DISJOINT);if(I&&!C){const A=s.getQueryParameter(b,s.QUERY_RESULT);l.timeElapsed=A}(I||C)&&s.deleteQuery(b)});const _=[];for(const l of x)if(l.queries.every(b=>{var I;return((I=p.get(b))===null||I===void 0?void 0:I.timeElapsed)!==void 0})){let b=0;for(const I of l.queries){const C=p.get(I);b+=C.timeElapsed,C.refCount-=1}if(l.timeElapsed=b,l.root){const I=[],C=(D,w)=>{for(const R of D){const S=R.timeElapsed,E=R.cpu.end-R.cpu.start,B={label:R.label,gpuElapsed:S,gpuAvg:h.add(R.label,S),cpuElapsed:E,cpuAvg:y.add(R.label,E),children:[],calls:R.calls,note:R.note};w.push(B),C(R.children,B.children)}};C(l.children,I);const A=l.cpu.end-l.cpu.start;g.push({label:l.label,gpuElapsed:b,gpuAvg:h.add(l.label,b),cpuElapsed:A,cpuAvg:y.add(l.label,A),children:I,calls:l.calls,note:l.note})}}else _.push(l);return x=_,p.forEach((l,b)=>{l.refCount===0&&p.delete(b)}),g},mark:(g,_)=>{var l;if(!s)return;if(m.has(g))throw new Error(`Timer mark for '${g}' already exists`);const b=(l=_?.captureStats)!==null&&l!==void 0?l:!1;f!==null&&s.endQuery(s.TIME_ELAPSED);const I={label:g,queries:[],children:[],root:f===null,cpu:{start:Mt(),end:-1},captureStats:b};if(_?.note&&(I.note=_.note),m.set(g,I),v.length&&v[v.length-1].children.push(I),v.push(I),b){if(c)throw new Error("Already capturing stats");_u(r),c=!0}d()},markEnd:g=>{var _;if(!s)return;const l=m.get(g);if(!l)throw new Error(`Timer mark for '${g}' does not exist`);if(((_=v.pop())===null||_===void 0?void 0:_.label)!==g)throw new Error(`Timer mark for '${g}' has pending nested mark`);s.endQuery(s.TIME_ELAPSED),m.delete(g),l.cpu.end=Mt(),l.captureStats&&(l.calls={...r.calls},c=!1),x.push(l),m.size>0?d():f=null},stats:()=>({gpu:h.stats(),cpu:y.stats()}),formatedStats:()=>{const g={},_=h.stats(),l=y.stats();for(const b of Object.keys(_)){const I=`${(_[b]/1e3/1e3).toFixed(2)}`,C=`${l[b].toFixed(2)}`;g[b]=`${I} ms | CPU: ${C} ms`}return g},clear:o,destroy:()=>{o()}}}function Cu(e){const t=`${(e.gpuElapsed/1e3/1e3).toFixed(2)}`,r=`${(e.gpuAvg/1e3/1e3).toFixed(2)}`,n=`${e.cpuElapsed.toFixed(2)}`,i=`${e.cpuAvg.toFixed(2)}`;return`${e.label} ${t} ms (avg. ${r} ms) | CPU: ${n} ms (avg. ${i} ms)`}function Su(e){e.map(t=>{const r=Cu(t);t.children.length||t.calls||t.note?(console.groupCollapsed(r),t.calls&&console.log(t.calls),t.note&&console.log(t.note),Su(t.children),console.groupEnd()):console.log(r)})}function Wd(e,t){function r(i){try{return e.getContext(i,t)}catch{return null}}const n=(t?.preferWebGl1?null:r("webgl2"))||r("webgl")||r("experimental-webgl");return oe&&console.log(`isWebgl2: ${K(n)}`),n}function Wa(e,t){switch(t){case e.NO_ERROR:return"no error";case e.INVALID_ENUM:return"invalid enum";case e.INVALID_VALUE:return"invalid value";case e.INVALID_OPERATION:return"invalid operation";case e.INVALID_FRAMEBUFFER_OPERATION:return"invalid framebuffer operation";case e.OUT_OF_MEMORY:return"out of memory";case e.CONTEXT_LOST_WEBGL:return"context lost"}return"unknown error"}function Xa(e,t){const r=e.getError();r!==e.NO_ERROR&&console.log(`WebGL error: '${Wa(e,r)}'${t?` (${t})`:""}`)}function Eu(e){const t=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS);for(let i=0;i<t;++i)e.activeTexture(e.TEXTURE0+i),e.bindTexture(e.TEXTURE_2D,null),e.bindTexture(e.TEXTURE_CUBE_MAP,null),K(e)&&(e.bindTexture(e.TEXTURE_2D_ARRAY,null),e.bindTexture(e.TEXTURE_3D,null));const r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r);const n=e.getParameter(e.MAX_VERTEX_ATTRIBS);for(let i=0;i<n;++i)e.vertexAttribPointer(i,1,e.FLOAT,!1,0,0);e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),e.bindRenderbuffer(e.RENDERBUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null),K(e)&&(e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBuffer(e.PIXEL_PACK_BUFFER,null))}const Ha=new Uint8Array(4);function $a(e,t,r){e.getSyncParameter(t,e.SYNC_STATUS)===e.SIGNALED?(e.deleteSync(t),r()):Ra.setImmediate($a,e,t,r)}function Iu(e,t){const r=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0);r?Ra.setImmediate($a,e,r,t):(console.warn("Could not create a WebGLSync object"),e.readPixels(0,0,1,1,e.RGBA,e.UNSIGNED_BYTE,Ha),t())}let aa=!1;function Au(e){return new Promise(t=>{K(e)?Iu(e,t):(aa||(console.info("Sync object not supported in WebGL"),aa=!0),Ya(e),t())})}function Ya(e){e.bindFramebuffer(e.FRAMEBUFFER,null),e.readPixels(0,0,1,1,e.RGBA,e.UNSIGNED_BYTE,Ha)}function Du(e,t,r,n,i,s){if(oe&&Cr(e),s instanceof Uint8Array)e.readPixels(t,r,n,i,e.RGBA,e.UNSIGNED_BYTE,s);else if(s instanceof Float32Array)e.readPixels(t,r,n,i,e.RGBA,e.FLOAT,s);else if(s instanceof Int32Array&&K(e))e.readPixels(t,r,n,i,e.RGBA_INTEGER,e.INT,s);else throw new Error("unsupported readPixels buffer type");oe&&Xa(e)}function zr(e,t){t?e.bindFramebuffer(e.FRAMEBUFFER,t.framebuffer):e.bindFramebuffer(e.FRAMEBUFFER,null)}function fr(e,t,r){var n,i;let s=(n=t?.framebufferWidth)!==null&&n!==void 0?n:e.drawingBufferWidth;r==="screen-space"&&(s*=2);const u=(i=t?.framebufferHeight)!==null&&i!==void 0?i:e.drawingBufferHeight;return{width:s,height:u}}function Ft(e,t,r,n){const i=t==="vertex"?e.VERTEX_SHADER:e.FRAGMENT_SHADER,s=e[`${r.toUpperCase()}_${n.toUpperCase()}`];return e.getShaderPrecisionFormat(i,s)}function ia(e,t){return{lowFloat:Ft(e,t,"low","float"),mediumFloat:Ft(e,t,"medium","float"),highFloat:Ft(e,t,"high","float"),lowInt:Ft(e,t,"low","int"),mediumInt:Ft(e,t,"medium","int"),highInt:Ft(e,t,"high","int")}}function Ru(){return{resourceCounts:{attribute:0,elements:0,pixelPack:0,framebuffer:0,program:0,renderbuffer:0,shader:0,texture:0,cubeTexture:0,vertexArray:0},drawCount:0,instanceCount:0,instancedDrawCount:0,calls:{drawInstanced:0,drawInstancedBase:0,multiDrawInstancedBase:0,counts:0},culled:{lod:0,frustum:0,occlusion:0}}}function wu(e,t){return{maxTextureSize:e.getParameter(e.MAX_TEXTURE_SIZE),max3dTextureSize:K(e)?e.getParameter(e.MAX_3D_TEXTURE_SIZE):0,maxRenderbufferSize:e.getParameter(e.MAX_RENDERBUFFER_SIZE),maxDrawBuffers:t.drawBuffers?e.getParameter(t.drawBuffers.MAX_DRAW_BUFFERS):0,maxTextureImageUnits:e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),maxVertexTextureImageUnits:e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)}}function Xd(e,t={}){const r=Va(e),n=io(e,r),i=Ru(),s=wu(e,r),u=vu(e,n,i,r,s),p=xu(e,r,i);if(s.maxVertexTextureImageUnits<8)throw new Error('Need "MAX_VERTEX_TEXTURE_IMAGE_UNITS" >= 8');const m={vertex:ia(e,"vertex"),fragment:ia(e,"fragment")};oe&&console.log({parameters:s,shaderPrecisionFormats:m});const v=r.provokingVertex;v?.provokingVertex(v.FIRST_VERTEX_CONVENTION);let h=!1;const y=new un;let x=t.pixelScale||1;const f={session:void 0,layer:void 0,changed:new un,clear:()=>{f.layer=void 0,f.session=void 0,f.changed.next()}},c=new Set;return{gl:e,isWebGL2:K(e),get pixelRatio(){return(typeof window<"u"&&window.devicePixelRatio||1)*(x||1)},extensions:r,state:n,stats:i,resources:u,timer:p,get maxTextureSize(){return s.maxTextureSize},get max3dTextureSize(){return s.max3dTextureSize},get maxRenderbufferSize(){return s.maxRenderbufferSize},get maxDrawBuffers(){return s.maxDrawBuffers},get maxTextureImageUnits(){return s.maxTextureImageUnits},get shaderPrecisionFormats(){return m},namedComputeRenderables:Object.create(null),namedFramebuffers:Object.create(null),namedTextures:Object.create(null),get isContextLost(){return h||e.isContextLost()},contextRestored:y,setContextLost:()=>{h=!0,p.clear()},handleContextRestored:o=>{ao(e,r),n.reset(),n.currentMaterialId=-1,n.currentProgramId=-1,n.currentRenderItemId=-1,u.reset(),c.forEach(d=>d.reset()),o?.(),h=!1,y.next(Mt())},xr:{get session(){return f.session},changed:f.changed,set:async(o,d)=>{var g,_;if(f.session!==o&&(await((g=f.session)===null||g===void 0?void 0:g.end()),o!==void 0))try{await e.makeXRCompatible(),f.session=o,f.layer=new XRWebGLLayer(f.session,e,{antialias:!0,alpha:!0,depth:!0,framebufferScaleFactor:x*((_=d?.resolutionScale)!==null&&_!==void 0?_:1)}),await f.session.updateRenderState({baseLayer:f.layer}),f.session.addEventListener("end",f.clear),f.changed.next()}catch(l){throw o?await o.end():(f.layer=void 0,f.session=void 0),l}},end:async()=>{var o;return(o=f.session)===null||o===void 0?void 0:o.end()}},setPixelScale:o=>{x=o},createRenderTarget:(o,d,g,_,l,b)=>{const I=bu(e,u,o,d,g,_,l,b);return c.add(I),{...I,destroy:()=>{I.destroy(),c.delete(I)}}},createDrawTarget:()=>({id:-1,texture:we(e),framebuffer:no(),depthRenderbuffer:null,getByteCount:()=>0,getWidth:()=>{var o;return fr(e,f.layer,(o=f.session)===null||o===void 0?void 0:o.interactionMode).width},getHeight:()=>{var o;return fr(e,f.layer,(o=f.session)===null||o===void 0?void 0:o.interactionMode).height},bind:()=>{zr(e,f.layer)},setSize:()=>{},reset:()=>{},destroy:()=>{}}),bindDrawingBuffer:()=>zr(e,f.layer),getDrawingBufferSize:()=>{var o;return fr(e,f.layer,(o=f.session)===null||o===void 0?void 0:o.interactionMode)},readPixels:(o,d,g,_,l)=>{Du(e,o,d,g,_,l)},waitForGpuCommandsComplete:()=>Au(e),waitForGpuCommandsCompleteSync:()=>Ya(e),getFenceSync:()=>K(e)?e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0):null,checkSyncStatus:o=>K(e)?e.getSyncParameter(o,e.SYNC_STATUS)===e.SIGNALED?(e.deleteSync(o),!0):!1:!0,deleteSync:o=>{K(e)&&e.deleteSync(o)},clear:(o,d,g,_)=>{const l=fr(e,f.layer);zr(e,f.layer),n.enable(e.SCISSOR_TEST),n.depthMask(!0),n.colorMask(!0,!0,!0,!0),n.clearColor(o,d,g,_),n.viewport(0,0,l.width,l.height),n.scissor(0,0,l.width,l.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT)},checkError:o=>{Xa(e,o)},checkFramebufferStatus:o=>{Cr(e,o)},destroy:o=>{var d,g,_,l;u.destroy(),Eu(e),(d=f.session)===null||d===void 0||d.removeEventListener("end",f.clear),(g=f.session)===null||g===void 0||g.end(),y.complete(),f.changed.complete(),o?.doNotForceWebGLContextLoss||((_=e.getExtension("WEBGL_lose_context"))===null||_===void 0||_.loseContext(),(l=e.getExtension("STACKGL_destroy_context"))===null||l===void 0||l.destroy())}}}function K(e){return typeof WebGL2RenderingContext<"u"&&e instanceof WebGL2RenderingContext}function Bu(e){if(K(e))return{drawArraysInstanced:e.drawArraysInstanced.bind(e),drawElementsInstanced:e.drawElementsInstanced.bind(e),vertexAttribDivisor:e.vertexAttribDivisor.bind(e),VERTEX_ATTRIB_ARRAY_DIVISOR:e.VERTEX_ATTRIB_ARRAY_DIVISOR};{const t=e.getExtension("ANGLE_instanced_arrays");return t===null?null:{drawArraysInstanced:t.drawArraysInstancedANGLE.bind(t),drawElementsInstanced:t.drawElementsInstancedANGLE.bind(t),vertexAttribDivisor:t.vertexAttribDivisorANGLE.bind(t),VERTEX_ATTRIB_ARRAY_DIVISOR:t.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE}}}function Fu(e){if(K(e))return{FRAGMENT_SHADER_DERIVATIVE_HINT:e.FRAGMENT_SHADER_DERIVATIVE_HINT};{const t=e.getExtension("OES_standard_derivatives");return t===null?null:{FRAGMENT_SHADER_DERIVATIVE_HINT:t.FRAGMENT_SHADER_DERIVATIVE_HINT_OES}}}function Pu(e){return K(e)?{}:e.getExtension("OES_element_index_uint")}function Lu(e){if(K(e))return{VERTEX_ARRAY_BINDING:e.VERTEX_ARRAY_BINDING,bindVertexArray:e.bindVertexArray.bind(e),createVertexArray:e.createVertexArray.bind(e),deleteVertexArray:e.deleteVertexArray.bind(e),isVertexArray:e.isVertexArray.bind(e)};{const t=e.getExtension("OES_vertex_array_object");return t===null?null:{VERTEX_ARRAY_BINDING:t.VERTEX_ARRAY_BINDING_OES,bindVertexArray:t.bindVertexArrayOES.bind(t),createVertexArray:t.createVertexArrayOES.bind(t),deleteVertexArray:t.deleteVertexArrayOES.bind(t),isVertexArray:t.isVertexArrayOES.bind(t)}}}function Ou(e){return K(e)?{}:e.getExtension("OES_texture_float")}function Mu(e){return e.getExtension("OES_texture_float_linear")}function Nu(e){if(K(e))return{HALF_FLOAT:e.HALF_FLOAT};{const t=e.getExtension("OES_texture_half_float");return t===null?null:{HALF_FLOAT:t.HALF_FLOAT_OES}}}function Gu(e){return e.getExtension("OES_texture_half_float_linear")}function ku(e){if(K(e))return{MIN:e.MIN,MAX:e.MAX};{const t=e.getExtension("EXT_blend_minmax");return t===null?null:{MIN:t.MIN_EXT,MAX:t.MAX_EXT}}}function Vu(e){return K(e)?{}:e.getExtension("EXT_frag_depth")}function zu(e){if(K(e))return e.getExtension("EXT_color_buffer_float")===null?null:(e.getExtension("EXT_float_blend"),{RGBA32F:e.RGBA32F});{const t=e.getExtension("WEBGL_color_buffer_float");return t===null?(e.getExtension("OES_texture_float"),Qa(e,e.FLOAT)?{RGBA32F:34836}:null):(e.getExtension("EXT_float_blend"),{RGBA32F:t.RGBA32F_EXT})}}function Uu(e){if(K(e))return e.getExtension("EXT_color_buffer_half_float")===null?null:(e.getExtension("EXT_float_blend"),{RGBA16F:e.RGBA16F});{const t=e.getExtension("EXT_color_buffer_half_float");return t===null?(e.getExtension("OES_texture_half_float"),Qa(e,36193)?{RGBA16F:34842}:null):(e.getExtension("EXT_float_blend"),{RGBA16F:t.RGBA16F_EXT})}}function ju(e){if(K(e))return{drawBuffers:e.drawBuffers.bind(e),COLOR_ATTACHMENT0:e.COLOR_ATTACHMENT0,COLOR_ATTACHMENT1:e.COLOR_ATTACHMENT1,COLOR_ATTACHMENT2:e.COLOR_ATTACHMENT2,COLOR_ATTACHMENT3:e.COLOR_ATTACHMENT3,COLOR_ATTACHMENT4:e.COLOR_ATTACHMENT4,COLOR_ATTACHMENT5:e.COLOR_ATTACHMENT5,COLOR_ATTACHMENT6:e.COLOR_ATTACHMENT6,COLOR_ATTACHMENT7:e.COLOR_ATTACHMENT7,DRAW_BUFFER0:e.DRAW_BUFFER0,DRAW_BUFFER1:e.DRAW_BUFFER1,DRAW_BUFFER2:e.DRAW_BUFFER2,DRAW_BUFFER3:e.DRAW_BUFFER3,DRAW_BUFFER4:e.DRAW_BUFFER4,DRAW_BUFFER5:e.DRAW_BUFFER5,DRAW_BUFFER6:e.DRAW_BUFFER6,DRAW_BUFFER7:e.DRAW_BUFFER7,MAX_COLOR_ATTACHMENTS:e.MAX_COLOR_ATTACHMENTS,MAX_DRAW_BUFFERS:e.MAX_DRAW_BUFFERS};{const t=e.getExtension("WEBGL_draw_buffers");return t===null?null:{drawBuffers:t.drawBuffersWEBGL.bind(t),COLOR_ATTACHMENT0:t.COLOR_ATTACHMENT0_WEBGL,COLOR_ATTACHMENT1:t.COLOR_ATTACHMENT1_WEBGL,COLOR_ATTACHMENT2:t.COLOR_ATTACHMENT2_WEBGL,COLOR_ATTACHMENT3:t.COLOR_ATTACHMENT3_WEBGL,COLOR_ATTACHMENT4:t.COLOR_ATTACHMENT4_WEBGL,COLOR_ATTACHMENT5:t.COLOR_ATTACHMENT5_WEBGL,COLOR_ATTACHMENT6:t.COLOR_ATTACHMENT6_WEBGL,COLOR_ATTACHMENT7:t.COLOR_ATTACHMENT7_WEBGL,DRAW_BUFFER0:t.DRAW_BUFFER0_WEBGL,DRAW_BUFFER1:t.DRAW_BUFFER1_WEBGL,DRAW_BUFFER2:t.DRAW_BUFFER2_WEBGL,DRAW_BUFFER3:t.DRAW_BUFFER3_WEBGL,DRAW_BUFFER4:t.DRAW_BUFFER4_WEBGL,DRAW_BUFFER5:t.DRAW_BUFFER5_WEBGL,DRAW_BUFFER6:t.DRAW_BUFFER6_WEBGL,DRAW_BUFFER7:t.DRAW_BUFFER7_WEBGL,MAX_COLOR_ATTACHMENTS:t.MAX_COLOR_ATTACHMENTS_WEBGL,MAX_DRAW_BUFFERS:t.MAX_DRAW_BUFFERS_WEBGL}}}function qu(e){const t=e.getExtension("OES_draw_buffers_indexed");return t===null?null:{enablei:t.enableiOES.bind(t),disablei:t.disableiOES.bind(t),blendEquationi:t.blendEquationiOES.bind(t),blendEquationSeparatei:t.blendEquationSeparateiOES.bind(t),blendFunci:t.blendFunciOES.bind(t),blendFuncSeparatei:t.blendFuncSeparateiOES.bind(t),colorMaski:t.colorMaskiOES.bind(t)}}function Wu(e){return K(e)?{}:e.getExtension("EXT_shader_texture_lod")}function Xu(e){if(K(e))return{UNSIGNED_INT_24_8:e.UNSIGNED_INT_24_8};{const t=e.getExtension("WEBGL_depth_texture");return t===null?null:{UNSIGNED_INT_24_8:t.UNSIGNED_INT_24_8_WEBGL}}}function Hu(e){if(K(e))return{FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING:e.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING,SRGB8_ALPHA8:e.SRGB8_ALPHA8,SRGB8:e.SRGB8,SRGB:e.SRGB};{const t=e.getExtension("EXT_sRGB");return t===null?null:{FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING:t.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT,SRGB8_ALPHA8:t.SRGB8_ALPHA8_EXT,SRGB8:t.SRGB_ALPHA_EXT,SRGB:t.SRGB_EXT}}}function $u(e){if(K(e)){const t=e.getExtension("EXT_disjoint_timer_query_webgl2")||e.getExtension("EXT_disjoint_timer_query");return t===null?null:{QUERY_COUNTER_BITS:t.QUERY_COUNTER_BITS_EXT,CURRENT_QUERY:e.CURRENT_QUERY,QUERY_RESULT:e.QUERY_RESULT,QUERY_RESULT_AVAILABLE:e.QUERY_RESULT_AVAILABLE,TIME_ELAPSED:t.TIME_ELAPSED_EXT,TIMESTAMP:t.TIMESTAMP_EXT,GPU_DISJOINT:t.GPU_DISJOINT_EXT,createQuery:e.createQuery.bind(e),deleteQuery:e.deleteQuery.bind(e),isQuery:e.isQuery.bind(e),beginQuery:e.beginQuery.bind(e),endQuery:e.endQuery.bind(e),queryCounter:t.queryCounterEXT.bind(t),getQuery:e.getQuery.bind(e),getQueryParameter:e.getQueryParameter.bind(e)}}else{const t=e.getExtension("EXT_disjoint_timer_query");return t===null?null:{QUERY_COUNTER_BITS:t.QUERY_COUNTER_BITS_EXT,CURRENT_QUERY:t.CURRENT_QUERY_EXT,QUERY_RESULT:t.QUERY_RESULT_EXT,QUERY_RESULT_AVAILABLE:t.QUERY_RESULT_AVAILABLE_EXT,TIME_ELAPSED:t.TIME_ELAPSED_EXT,TIMESTAMP:t.TIMESTAMP_EXT,GPU_DISJOINT:t.GPU_DISJOINT_EXT,createQuery:t.createQueryEXT.bind(t),deleteQuery:t.deleteQueryEXT.bind(t),isQuery:t.isQueryEXT.bind(t),beginQuery:t.beginQueryEXT.bind(t),endQuery:t.endQueryEXT.bind(t),queryCounter:t.queryCounterEXT.bind(t),getQuery:t.getQueryEXT.bind(t),getQueryParameter:t.getQueryObjectEXT.bind(t)}}}function Yu(e){const t=e.getExtension("WEBGL_multi_draw");return t?{multiDrawArrays:t.multiDrawArraysWEBGL.bind(t),multiDrawElements:t.multiDrawElementsWEBGL.bind(t),multiDrawArraysInstanced:t.multiDrawArraysInstancedWEBGL.bind(t),multiDrawElementsInstanced:t.multiDrawElementsInstancedWEBGL.bind(t)}:null}function Qu(e){const t=e.getExtension("WEBGL_draw_instanced_base_vertex_base_instance");return t?{drawArraysInstancedBaseInstance:t.drawArraysInstancedBaseInstanceWEBGL.bind(t),drawElementsInstancedBaseVertexBaseInstance:t.drawElementsInstancedBaseVertexBaseInstanceWEBGL.bind(t)}:null}function Zu(e){const t=e.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance");return t?{multiDrawArraysInstancedBaseInstance:t.multiDrawArraysInstancedBaseInstanceWEBGL.bind(t),multiDrawElementsInstancedBaseVertexBaseInstance:t.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL.bind(t)}:null}function Ku(e){const t=e.getExtension("KHR_parallel_shader_compile");return t===null?null:{COMPLETION_STATUS:t.COMPLETION_STATUS_KHR}}function Ju(e){return K(e)?{}:e.getExtension("OES_fbo_render_mipmap")}function ec(e){if(K(e)){const t=e.getExtension("WEBGL_provoking_vertex");if(t)return{FIRST_VERTEX_CONVENTION:t.FIRST_VERTEX_CONVENTION_WEBGL,LAST_VERTEX_CONVENTION:t.LAST_VERTEX_CONVENTION_WEBGL,PROVOKING_VERTEX:t.PROVOKING_VERTEX_WEBGL,provokingVertex:t.provokingVertexWEBGL.bind(t)}}return null}function tc(e){if(K(e)){const t=e.getExtension("WEBGL_clip_cull_distance");if(t)return{MAX_CLIP_DISTANCES:t.MAX_CLIP_DISTANCES_WEBGL,MAX_CULL_DISTANCES:t.MAX_CULL_DISTANCES_WEBGL,MAX_COMBINED_CLIP_AND_CULL_DISTANCES:t.MAX_COMBINED_CLIP_AND_CULL_DISTANCES_WEBGL,CLIP_DISTANCE0:t.CLIP_DISTANCE0_WEBGL,CLIP_DISTANCE1:t.CLIP_DISTANCE1_WEBGL,CLIP_DISTANCE2:t.CLIP_DISTANCE2_WEBGL,CLIP_DISTANCE3:t.CLIP_DISTANCE3_WEBGL,CLIP_DISTANCE4:t.CLIP_DISTANCE4_WEBGL,CLIP_DISTANCE5:t.CLIP_DISTANCE5_WEBGL,CLIP_DISTANCE6:t.CLIP_DISTANCE6_WEBGL,CLIP_DISTANCE7:t.CLIP_DISTANCE7_WEBGL}}return null}function rc(e){return K(e)&&e.getExtension("EXT_conservative_depth")?{}:null}function nc(e){if(K(e)){const t=e.getExtension("WEBGL_stencil_texturing");if(t)return{DEPTH_STENCIL_TEXTURE_MODE:t.DEPTH_STENCIL_TEXTURE_MODE_WEBGL,STENCIL_INDEX:t.STENCIL_INDEX_WEBGL}}return null}function ac(e){const t=e.getExtension("EXT_clip_control");return t?{LOWER_LEFT:t.LOWER_LEFT_EXT,UPPER_LEFT:t.UPPER_LEFT_EXT,NEGATIVE_ONE_TO_ONE:t.NEGATIVE_ONE_TO_ONE_EXT,ZERO_TO_ONE:t.ZERO_TO_ONE_EXT,CLIP_ORIGIN:t.CLIP_ORIGIN_EXT,CLIP_DEPTH_MODE:t.CLIP_DEPTH_MODE_EXT,clipControl:t.clipControlEXT.bind(t)}:null}function ic(e){return K(e)&&e.getExtension("EXT_render_snorm")?{}:null}function oc(e){return K(e)&&e.getExtension("WEBGL_render_shared_exponent")?{}:null}function sc(e){const t=e.getExtension("EXT_texture_norm16");return t?{R16:t.R16_EXT,RG16:t.RG16_EXT,RGB16:t.RGB16_EXT,RGBA16:t.RGBA16_EXT,R16_SNORM:t.R16_SNORM_EXT,RG16_SNORM:t.RG16_SNORM_EXT,RGB16_SNORM:t.RGB16_SNORM_EXT,RGBA16_SNORM:t.RGBA16_SNORM_EXT}:null}function uc(e){const t=e.getExtension("EXT_depth_clamp");return t?{DEPTH_CLAMP:t.DEPTH_CLAMP_EXT}:null}function cc(e){if(K(e)){const t=e.getExtension("OVR_multiview2");if(t)return{FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS:t.FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR,FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX:t.FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR,MAX_VIEWS:t.MAX_VIEWS_OVR,FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS:t.FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR,framebufferTextureMultiview:t.framebufferTextureMultiviewOVR.bind(t)}}return null}function fc(e){if(!K(e))return!1;if(typeof navigator<"u"){const t=window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);return t?parseInt(t[1])>=85:!0}return!1}const dc=`
attribute vec4 aPosition;

void main() {
    gl_Position = aPosition;
}`,lc=`
precision mediump float;
uniform vec4 uColor;
uniform sampler2D uTexture;

void main() {
    gl_FragColor = texture2D(uTexture, vec2(0.5, 0.5)) * uColor;
}`,mc=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]);function Qa(e,t){const r=Er(e,{type:"vert",source:dc}),n=Er(e,{type:"frag",source:lc});if(!r||!n)return!1;const i=cn(e);e.attachShader(i,r),e.attachShader(i,n),e.linkProgram(i),e.useProgram(i);const s=e.getAttribLocation(i,"aPosition"),u=e.getUniformLocation(i,"uColor");if(!u)return oe&&console.log("error getting 'uColor' uniform location"),!1;const p=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,p),e.bufferData(e.ARRAY_BUFFER,mc,e.STATIC_DRAW),e.enableVertexAttribArray(s),e.vertexAttribPointer(s,2,e.FLOAT,!1,0,0);const m=e.createTexture(),v=new Uint8Array([255,255,255,255]);e.bindTexture(e.TEXTURE_2D,m),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,v);const h=e.createTexture();e.bindTexture(e.TEXTURE_2D,h),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,t,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST);const y=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,y),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,h,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)return oe&&console.log(`error creating framebuffer for '${t}'`),!1;e.bindTexture(e.TEXTURE_2D,m),e.uniform4fv(u,[0,10,20,1]),e.drawArrays(e.TRIANGLES,0,6),e.bindTexture(e.TEXTURE_2D,h),e.bindFramebuffer(e.FRAMEBUFFER,null),e.clearColor(1,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.uniform4fv(u,[0,1/10,1/20,1]),e.drawArrays(e.TRIANGLES,0,6);const f=new Uint8Array(4);if(e.readPixels(0,0,1,1,e.RGBA,e.UNSIGNED_BYTE,f),f[0]!==0||f[1]<248||f[2]<248||f[3]<254)return oe&&console.log(`not able to actually render to '${t}' texture`),!1;if(t===e.FLOAT){e.bindFramebuffer(e.FRAMEBUFFER,y);const c=new Float32Array(4);e.readPixels(0,0,1,1,e.RGBA,e.FLOAT,c);const o=e.getError();if(o)return oe&&console.log(`error reading float pixels: '${Wa(e,o)}'`),!1}return!0}const Sn=Ve();function pc(e,t){switch(t){case"image-uint8":return e.TEXTURE_2D;case"image-float32":return e.TEXTURE_2D;case"image-float16":return e.TEXTURE_2D;case"image-depth":return e.TEXTURE_2D}if(K(e))switch(t){case"image-int32":return e.TEXTURE_2D;case"volume-uint8":return e.TEXTURE_3D;case"volume-float32":return e.TEXTURE_3D;case"volume-float16":return e.TEXTURE_3D}throw new Error(`unknown texture kind '${t}'`)}function En(e,t,r){switch(t){case"alpha":return K(e)&&(r==="float"||r==="fp16")?e.RED:K(e)&&r==="int"?e.RED_INTEGER:e.ALPHA;case"rgb":return K(e)&&r==="int"?e.RGB_INTEGER:e.RGB;case"rg":if(K(e)&&(r==="float"||r==="fp16"))return e.RG;if(K(e)&&r==="int")return e.RG_INTEGER;throw new Error('texture format "rg" requires webgl2 and type "float" or int"');case"rgba":return K(e)&&r==="int"?e.RGBA_INTEGER:e.RGBA;case"depth":return e.DEPTH_COMPONENT}}function gc(e,t,r){if(K(e))switch(t){case"alpha":switch(r){case"ubyte":return e.ALPHA;case"float":return e.R32F;case"fp16":return e.R16F;case"int":return e.R32I}case"rg":switch(r){case"ubyte":return e.RG;case"float":return e.RG32F;case"fp16":return e.RG16F;case"int":return e.RG32I}case"rgb":switch(r){case"ubyte":return e.RGB;case"float":return e.RGB32F;case"fp16":return e.RGB16F;case"int":return e.RGB32I}case"rgba":switch(r){case"ubyte":return e.RGBA;case"float":return e.RGBA32F;case"fp16":return e.RGBA16F;case"int":return e.RGBA32I}case"depth":switch(r){case"ushort":return e.DEPTH_COMPONENT16;case"float":return e.DEPTH_COMPONENT32F}}return En(e,t,r)}function Za(e,t,r,n,i){return Ka(e,t)*r*n*(i||1)}function Ka(e,t){return vc(e)*hc(t)}function vc(e){switch(e){case"alpha":return 1;case"rg":return 2;case"rgb":return 3;case"rgba":return 4;case"depth":return 4}}function hc(e){switch(e){case"ubyte":return 1;case"ushort":return 2;case"float":return 4;case"fp16":return 2;case"int":return 4}}function Ja(e,t,r){switch(r){case"ubyte":return e.UNSIGNED_BYTE;case"ushort":return e.UNSIGNED_SHORT;case"float":return e.FLOAT;case"fp16":if(t.textureHalfFloat)return t.textureHalfFloat.HALF_FLOAT;throw new Error('extension "texture_half_float" unavailable');case"int":if(K(e))return e.INT;throw new Error('texture type "int" requires webgl2')}}function oa(e,t){switch(t){case"nearest":return e.NEAREST;case"linear":return e.LINEAR}}function dr(e,t,r){switch(r){case"depth":return e.DEPTH_ATTACHMENT;case"stencil":return e.STENCIL_ATTACHMENT;case"color0":case 0:return e.COLOR_ATTACHMENT0}if(t.drawBuffers)switch(r){case"color1":case 1:return t.drawBuffers.COLOR_ATTACHMENT1;case"color2":case 2:return t.drawBuffers.COLOR_ATTACHMENT2;case"color3":case 3:return t.drawBuffers.COLOR_ATTACHMENT3;case"color4":case 4:return t.drawBuffers.COLOR_ATTACHMENT4;case"color5":case 5:return t.drawBuffers.COLOR_ATTACHMENT5;case"color6":case 6:return t.drawBuffers.COLOR_ATTACHMENT6;case"color7":case 7:return t.drawBuffers.COLOR_ATTACHMENT7}throw new Error("unknown texture attachment")}function sa(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement}function bc(e,t,r){return t===r.TEXTURE_2D}function ua(e,t,r){return t===r.TEXTURE_3D}function fn(e){const t=e.createTexture();if(t===null)throw new Error("Could not create WebGL texture");return t}function yc(e,t,r,n,i,s){const u=Sn();let p=fn(e);if(r.endsWith("float32")&&i!=="float"||r.endsWith("float16")&&i!=="fp16"||r.endsWith("uint8")&&i!=="ubyte"||r.endsWith("int32")&&i!=="int"||r.endsWith("depth")&&i!=="ushort"&&i!=="float")throw new Error(`texture kind '${r}' and type '${i}' are incompatible`);if(!t.depthTexture&&n==="depth")throw new Error("extension 'WEBGL_depth_texture' needed for 'depth' texture format");const m=pc(e,r),v=oa(e,s),h=En(e,n,i),y=gc(e,n,i),x=Ja(e,t,i);function f(){e.bindTexture(m,p),e.texParameteri(m,e.TEXTURE_MAG_FILTER,v),e.texParameteri(m,e.TEXTURE_MIN_FILTER,v),e.texParameteri(m,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(m,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(m,null)}f();let c=0,o=0,d=0,g,_=!1,l=!1;function b(D,w,R){if(D===0||w===0||K(e)&&m===e.TEXTURE_3D&&R===0)throw new Error("empty textures are not allowed");if(!(c===D&&o===w&&d===(R||0)))if(c=D,o=w,d=R||0,e.bindTexture(m,p),m===e.TEXTURE_2D)e.texImage2D(m,0,y,c,o,0,h,x,null);else if(K(e)&&m===e.TEXTURE_3D&&d!==void 0)e.texImage3D(m,0,y,c,o,d,0,h,x,null);else throw new Error("unknown texture target")}b(1,1,K(e)&&m===e.TEXTURE_3D?1:0);function I(D,w=!1){if(D.width===0||D.height===0||!sa(D)&&K(e)&&ua(D,m,e)&&D.depth===0)throw new Error("empty textures are not allowed");if(e.bindTexture(m,p),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0),sa(D))c=D.width,o=D.height,e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.bindTexture(e.TEXTURE_2D,p),e.texImage2D(e.TEXTURE_2D,0,y,h,x,D);else if(bc(D,m,e)){const R=D.filter?oa(e,D.filter):v;e.texParameteri(m,e.TEXTURE_MAG_FILTER,R),e.texParameteri(m,e.TEXTURE_MIN_FILTER,R),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!!D.flipY),w?e.texSubImage2D(m,0,0,0,D.width,D.height,h,x,D.array):(c=D.width,o=D.height,e.texImage2D(m,0,y,c,o,0,h,x,D.array))}else if(K(e)&&ua(D,m,e))e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),w?e.texSubImage3D(m,0,0,0,0,D.width,D.height,D.depth,h,x,D.array):(c=D.width,o=D.height,d=D.depth,e.texImage3D(m,0,y,c,o,d,0,h,x,D.array));else throw new Error("unknown texture target");e.bindTexture(m,null),g=D}function C(){if(m!==e.TEXTURE_2D)throw new Error("mipmap only supported for 2d textures");if(K(e)||Nn(c)&&Nn(o))e.bindTexture(m,p),e.texParameteri(m,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.generateMipmap(m),e.bindTexture(m,null),_=!0;else throw new Error("mipmap unsupported for non-power-of-two textures and webgl1")}function A(D,w,R){if(D.bind(),m===e.TEXTURE_2D)e.framebufferTexture2D(e.FRAMEBUFFER,dr(e,t,w),e.TEXTURE_2D,p,0);else if(K(e)&&m===e.TEXTURE_3D){if(R===void 0)throw new Error("need `layer` to attach 3D texture");e.framebufferTextureLayer(e.FRAMEBUFFER,dr(e,t,w),p,0,R)}else throw new Error("unknown/unsupported texture target")}return{id:u,target:m,format:h,internalFormat:y,type:x,filter:v,getWidth:()=>c,getHeight:()=>o,getDepth:()=>d,getByteCount:()=>Za(n,i,c,o,d),define:b,load:I,mipmap:C,bind:D=>{e.activeTexture(e.TEXTURE0+D),e.bindTexture(m,p)},unbind:D=>{e.activeTexture(e.TEXTURE0+D),e.bindTexture(m,null)},attachFramebuffer:A,detachFramebuffer:(D,w)=>{if(D.bind(),m===e.TEXTURE_2D)e.framebufferTexture2D(e.FRAMEBUFFER,dr(e,t,w),e.TEXTURE_2D,null,0);else if(K(e)&&m===e.TEXTURE_3D)e.framebufferTextureLayer(e.FRAMEBUFFER,dr(e,t,w),null,0,0);else throw new Error("unknown texture target")},reset:()=>{p=fn(e),f();const[D,w,R]=[c,o,d];c=0,o=0,d=0,b(D,w,R),g&&I(g),_&&C()},destroy:()=>{l||(e.deleteTexture(p),l=!0)}}}function ca(e,t,r){const{resources:n}=e,i=[];return Object.keys(t).forEach(s=>{const u=t[s];if(u.type==="texture"){const p=r[s];if(p)if(u.kind==="texture")i[i.length]=[s,p.ref.value];else{const m=n.texture(u.kind,u.format,u.dataType,u.filter);m.load(p.ref.value),i[i.length]=[s,m]}}}),i}function Hd(e,t,r){const n=new Image;n.onload=function(){r.load(n),a.update(t,r)},n.src=e}function _c(e,t){switch(t){case"nx":return e.TEXTURE_CUBE_MAP_NEGATIVE_X;case"ny":return e.TEXTURE_CUBE_MAP_NEGATIVE_Y;case"nz":return e.TEXTURE_CUBE_MAP_NEGATIVE_Z;case"px":return e.TEXTURE_CUBE_MAP_POSITIVE_X;case"py":return e.TEXTURE_CUBE_MAP_POSITIVE_Y;case"pz":return e.TEXTURE_CUBE_MAP_POSITIVE_Z}}function Tc(e,t,r,n){const i=e.TEXTURE_CUBE_MAP,s=e.LINEAR,u=e.RGBA,p=e.RGBA,m=e.UNSIGNED_BYTE;let v=0,h=e.createTexture();e.bindTexture(i,h);function y(o,d,g,_){v===0&&(v=g.width),e.bindTexture(i,h),e.texImage2D(o,d,u,v,v,0,p,m,null),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.bindTexture(i,h),e.texImage2D(o,d,u,p,m,g),f+=1,f===6&&(c||(r?(e.texParameteri(i,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.generateMipmap(i)):e.texParameteri(i,e.TEXTURE_MIN_FILTER,s),e.texParameteri(i,e.TEXTURE_MAG_FILTER,s)),_||n?.(c))}const x=[];let f=0;Ia(t,(o,d)=>{if(!o)return;const g=0,_=_c(e,d),l=new Image;o instanceof File?l.src=URL.createObjectURL(o):_i(o)?o.then(b=>{l.src=URL.createObjectURL(b)}):l.src=o,x.push({cubeTarget:_,level:g,image:l}),l.addEventListener("load",()=>{y(_,g,l,!1)}),l.addEventListener("error",()=>{n?.(!0)})});let c=!1;return{id:Sn(),target:i,format:p,internalFormat:u,type:m,filter:s,getWidth:()=>v,getHeight:()=>v,getDepth:()=>0,getByteCount:()=>Za("rgba","ubyte",v,v,0)*6*(r?2:1),define:()=>{},load:()=>{},mipmap:()=>{},bind:o=>{e.activeTexture(e.TEXTURE0+o),e.bindTexture(i,h)},unbind:o=>{e.activeTexture(e.TEXTURE0+o),e.bindTexture(i,null)},attachFramebuffer:()=>{},detachFramebuffer:()=>{},reset:()=>{h=fn(e),e.bindTexture(i,h),f=0;for(const{cubeTarget:o,level:d,image:g}of x)y(o,d,g,!0)},destroy:()=>{c||(e.deleteTexture(h),c=!0)}}}const ei=-1;function $d(e){return e.format===ei}function we(e){var t;const r=(t=e?.TEXTURE_2D)!==null&&t!==void 0?t:3553;return{id:Sn(),target:r,format:ei,internalFormat:0,type:0,filter:0,getWidth:()=>0,getHeight:()=>0,getDepth:()=>0,getByteCount:()=>0,define:()=>{},load:()=>{},mipmap:()=>{},bind:n=>{e&&(e.activeTexture(e.TEXTURE0+n),e.bindTexture(r,null))},unbind:n=>{e&&(e.activeTexture(e.TEXTURE0+n),e.bindTexture(r,null))},attachFramebuffer:()=>{throw new Error("cannot attach null-texture to a framebuffer")},detachFramebuffer:()=>{throw new Error("cannot detach null-texture from a framebuffer")},reset:()=>{},destroy:()=>{}}}function st(e,t,r,n){var i;const s=xc(e,t,r,n);if(r.palette){a.updateIfChanged(s.dUsePalette,!0);const[u,p]=r.palette.domain||[0,1];a.update(s.uPaletteDomain,ae.set(s.uPaletteDomain.ref.value,u,p)),a.update(s.uPaletteDefault,he.toVec3Normalized(s.uPaletteDefault.ref.value,(i=r.palette.defaultColor)!==null&&i!==void 0?i:he(13421772))),Cc(r.palette,s.tPalette)}else a.updateIfChanged(s.dUsePalette,!1);return s}function xc(e,t,r,n){switch(r.granularity){case"uniform":return Ec(e,r.color,n);case"instance":return e.nonInstanceable?fa(e,r.color,n):Ic(e,r.color,n);case"group":return fa(e,r.color,n);case"groupInstance":return Ac(e,r.color,n);case"vertex":return Dc(t,r.color,n);case"vertexInstance":return Rc(t,r.color,n);case"volume":return da(r.grid,"volume",n);case"volumeInstance":return da(r.grid,"volumeInstance",n);case"direct":return wc(n)}}function Cc(e,t){let r=!0;const n=t.ref.value;if(e.colors.length!==n.width||n.filter!==e.filter)r=!1;else{const u=n.array;let p=0;for(const m of e.colors){const[v,h,y]=he.toRgb(m);if(u[p++]!==v||u[p++]!==h||u[p++]!==y){r=!1;break}}}if(r)return;const i=new Uint8Array(e.colors.length*3);let s=0;for(const u of e.colors){const[p,m,v]=he.toRgb(u);i[s++]=p,i[s++]=m,i[s++]=v}a.update(t,{array:i,height:1,width:e.colors.length,filter:e.filter})}function Sc(e,t){return t?(a.update(t.uColor,he.toVec3Normalized(t.uColor.ref.value,e)),a.updateIfChanged(t.dColorType,"uniform"),t):{uColor:a.create(he.toVec3Normalized(T(),e)),tColor:a.create({array:new Uint8Array(3),width:1,height:1}),tColorGrid:a.create(we()),uPaletteDomain:a.create(ae.create(0,1)),uPaletteDefault:a.create(T()),tPalette:a.create({array:new Uint8Array(3),width:1,height:1}),uColorTexDim:a.create(ae.create(1,1)),uColorGridDim:a.create(T.create(1,1,1)),uColorGridTransform:a.create(se.create(0,0,0,1)),dColorType:a.create("uniform"),dUsePalette:a.create(!1)}}function Ec(e,t,r){e.reset();const n=e.hasNext?e.move():{location:Ye,isSecondary:!1};return Sc(t(n.location,n.isSecondary),r)}function rr(e,t,r){return r?(a.update(r.tColor,e),a.update(r.uColorTexDim,ae.create(e.width,e.height)),a.updateIfChanged(r.dColorType,t),r):{uColor:a.create(T()),tColor:a.create(e),tColorGrid:a.create(we()),uPaletteDomain:a.create(ae.create(0,1)),uPaletteDefault:a.create(T()),tPalette:a.create({array:new Uint8Array(3),width:1,height:1}),uColorTexDim:a.create(ae.create(e.width,e.height)),uColorGridDim:a.create(T.create(1,1,1)),uColorGridTransform:a.create(se.create(0,0,0,1)),dColorType:a.create(t),dUsePalette:a.create(!1)}}function Ic(e,t,r){const{instanceCount:n}=e,i=Te(Math.max(1,n),3,Uint8Array,r&&r.tColor.ref.value.array);for(e.reset();e.hasNext;){const{location:s,isSecondary:u,instanceIndex:p}=e.move();he.toArray(t(s,u),i.array,p*3),e.skipInstance()}return rr(i,"instance",r)}function fa(e,t,r){const{groupCount:n,hasLocation2:i}=e,s=Te(Math.max(1,n*(i?2:1)),3,Uint8Array,r&&r.tColor.ref.value.array);e.reset();const u=i?6:3;for(;e.hasNext&&!e.isNextNewInstance;){const{location:p,location2:m,isSecondary:v,groupIndex:h}=e.move();he.toArray(t(p,v),s.array,h*u),i&&he.toArray(t(m,v),s.array,h*u+3)}return rr(s,"group",r)}function Ac(e,t,r){const{groupCount:n,instanceCount:i,hasLocation2:s}=e,u=i*n*(s?2:1),p=Te(Math.max(1,u),3,Uint8Array,r&&r.tColor.ref.value.array);e.reset();const m=s?6:3;for(;e.hasNext;){const{location:v,location2:h,isSecondary:y,index:x}=e.move();he.toArray(t(v,y),p.array,x*m),s&&he.toArray(t(h,y),p.array,x*m+3)}return rr(p,"groupInstance",r)}function Dc(e,t,r){const{groupCount:n,stride:i}=e,s=Te(Math.max(1,n),3,Uint8Array,r&&r.tColor.ref.value.array);for(e.reset(),e.voidInstances();e.hasNext&&!e.isNextNewInstance;){const{location:u,isSecondary:p,groupIndex:m}=e.move(),v=t(u,p);for(let h=0;h<i;++h)he.toArray(v,s.array,(m+h)*3)}return rr(s,"vertex",r)}function Rc(e,t,r){const{groupCount:n,instanceCount:i,stride:s}=e,u=i*n,p=Te(Math.max(1,u),3,Uint8Array,r&&r.tColor.ref.value.array);for(e.reset();e.hasNext;){const{location:m,isSecondary:v,index:h}=e.move(),y=t(m,v);for(let x=0;x<s;++x)he.toArray(y,p.array,(h+x)*3)}return rr(p,"vertexInstance",r)}function da(e,t,r){const{colors:n,dimension:i,transform:s}=e,u=n.getWidth(),p=n.getHeight();return r?(a.update(r.tColorGrid,n),a.update(r.uColorTexDim,ae.create(u,p)),a.update(r.uColorGridDim,T.clone(i)),a.update(r.uColorGridTransform,se.clone(s)),a.updateIfChanged(r.dColorType,t),r):{uColor:a.create(T()),tColor:a.create({array:new Uint8Array(3),width:1,height:1}),tColorGrid:a.create(n),uPaletteDomain:a.create(ae.create(0,1)),uPaletteDefault:a.create(T()),tPalette:a.create({array:new Uint8Array(3),width:1,height:1}),uColorTexDim:a.create(ae.create(u,p)),uColorGridDim:a.create(T.clone(i)),uColorGridTransform:a.create(se.clone(s)),dColorType:a.create(t),dUsePalette:a.create(!1)}}function wc(e){return e?(a.updateIfChanged(e.dColorType,"direct"),e):{uColor:a.create(T()),tColor:a.create({array:new Uint8Array(3),width:1,height:1}),tColorGrid:a.create(we()),uPaletteDomain:a.create(ae.create(0,1)),uPaletteDefault:a.create(T()),tPalette:a.create({array:new Uint8Array(3),width:1,height:1}),uColorTexDim:a.create(ae.create(1,1)),uColorGridDim:a.create(T.create(1,1,1)),uColorGridTransform:a.create(se.create(0,0,0,1)),dColorType:a.create("direct"),dUsePalette:a.create(!1)}}const Ur=T.transformMat4Offset,Bc=T.fromArray,Ir=ve.add;function Fc(){return{cellSize:0,cellCount:0,cellOffsets:new Uint32Array,cellSpheres:new Float32Array,cellTransform:new Float32Array,cellInstance:new Float32Array,batchSize:0,batchCount:0,batchOffsets:new Uint32Array,batchSpheres:new Float32Array,batchCell:new Uint32Array}}function Pc(e,t,r){const n=Lc(e,t),i=Oc(n,r),s=new Uint32Array(n.cellOffsets.length),u=new Float32Array(n.cellSpheres.length),p=new Float32Array(n.cellInstance.length);let m=0;for(let h=0,y=i.batchCell.length;h<y;++h){const x=i.batchCell[h],f=n.cellOffsets[x],o=n.cellOffsets[x+1]-f;s[h+1]=s[h]+o;for(let d=0;d<4;++d)u[h*4+d]=n.cellSpheres[x*4+d];for(let d=0;d<o;++d){const g=f+d,_=n.cellInstance[g];for(let l=0;l<16;++l)n.cellTransform[m*16+l]=e.transform[_*16+l];p[m]=_,m+=1}}return{cellSize:n.cellSize,cellCount:n.cellCount,cellOffsets:s,cellSpheres:u,cellTransform:n.cellTransform,cellInstance:p,batchSize:i.batchSize,batchCount:i.batchCount,batchOffsets:i.batchOffsets,batchSpheres:i.batchSpheres,batchCell:Nt(i.batchCell)}}function Lc(e,t){const{instanceCount:r,instance:n,transform:i,invariantBoundingSphere:s}=e,u=new Float32Array(r),p=new Float32Array(r),m=new Float32Array(r),v=ce.ofBounds(0,r),h=ve.setEmpty(ve()),{center:y,radius:x}=s,f=T.create(x,x,x),c=T();for(let B=0;B<r;++B)Ur(c,y,i,0,0,B*16),u[B]=c[0],p[B]=c[1],m[B]=c[2],Ir(h,c);ve.expand(h,h,f);const o={x:u,y:p,z:m,indices:v},d={box:h,sphere:q.fromBox3D(q(),h)},g=wa(o,d,T.create(t,t,t)),{array:_,offset:l,count:b}=g.buckets,I=l.length,C=new Uint32Array(I+1),A=new Float32Array(I*4),D=new Float32Array(r*16),w=new Float32Array(r),R=ve(),S=q();let E=0;for(let B=0;B<I;++B){const L=l[B],F=b[B];C[B]=L;const O=E;for(let N=L,z=L+F;N<z;++N){const V=_[N];w[E]=n[V];for(let $=0;$<16;++$)D[E*16+$]=i[V*16+$];E+=1}if(F===1)Ur(A,y,D,B*4,0,O*16),A[B*4+3]=x;else{ve.setEmpty(R);const N=O*16;for(let z=0;z<F;++z)Ur(c,y,D,0,0,z*16+N),Ir(R,c);ve.expand(R,R,f),q.fromBox3D(S,R),q.toArray(S,A,B*4)}}return C[I]=l[I-1]+b[I-1],{cellSize:t,cellCount:I,cellOffsets:C,cellSpheres:A,cellTransform:D,cellInstance:w}}function Oc(e,t){const{cellCount:r,cellSpheres:n}=e,i=new Float32Array(r),s=new Float32Array(r),u=new Float32Array(r),p=ce.ofBounds(0,r),m=ve.setEmpty(ve()),v=T();let h=0;for(let w=0;w<r;++w){const R=w*4;Bc(v,n,R),i[w]=v[0],s[w]=v[1],u[w]=v[2],Ir(m,v),h=Math.max(h,n[R+3])}const y=T.create(h,h,h);ve.expand(m,m,y);const x={x:i,y:s,z:u,indices:p},f={box:m,sphere:q.fromBox3D(q(),m)},c=wa(x,f,T.create(t,t,t)),{array:o,offset:d,count:g}=c.buckets,_=d.length,l=new Uint32Array(_+1),b=new Float32Array(_*4),I=new Uint32Array(r),C=ve(),A=q();let D=0;for(let w=0;w<_;++w){const R=d[w],S=g[w];l[w]=R;for(let E=R,B=R+S;E<B;++E)I[D]=o[E],D+=1;if(S===1){const E=o[R];b[w*4]=n[E*4],b[w*4+1]=n[E*4+1],b[w*4+2]=n[E*4+2],b[w*4+3]=n[E*4+3]}else{ve.setEmpty(C),h=0;for(let E=R,B=R+S;E<B;++E){const L=o[E];v[0]=n[L*4],v[1]=n[L*4+1],v[2]=n[L*4+2],Ir(C,v),h=Math.max(h,n[L*4+3])}T.set(y,h,h,h),ve.expand(C,C,y),q.fromBox3D(A,C),q.toArray(A,b,w*4)}}return l[_]=d[_-1]+g[_-1],{batchSize:t,batchCount:_,batchOffsets:l,batchSpheres:b,batchCell:I}}const la=Bt(),Mc=ie();function Nc(e,t){for(let r=0;r<t;r++)if(Bt.fromMat4(la,ie.fromArray(Mc,e,r*16)),Bt.determinant(la)<0)return!0;return!1}function ti(e,t,r,n,i,s){const u=Nc(e,t);if(s){a.update(s.matrix,s.matrix.ref.value);const p=s.transform.ref.value.length>=t*16?s.transform.ref.value:new Float32Array(t*16);p.set(e),a.update(s.transform,p),a.updateIfChanged(s.uInstanceCount,t),a.updateIfChanged(s.instanceCount,t);const m=s.aTransform.ref.value.length>=t*16?s.aTransform.ref.value:new Float32Array(t*16);a.update(s.aTransform,m);const v=s.extraTransform.ref.value.length>=t*16?s.extraTransform.ref.value:new Float32Array(t*16);a.update(s.extraTransform,ma(v,t));const h=s.aInstance.ref.value.length>=t?s.aInstance.ref.value:new Float32Array(t);a.update(s.aInstance,Nt(h,t)),a.update(s.hasReflection,u)}else s={aTransform:a.create(new Float32Array(t*16)),matrix:a.create(ie.identity()),transform:a.create(new Float32Array(e)),extraTransform:a.create(ma(new Float32Array(t*16),t)),uInstanceCount:a.create(t),instanceCount:a.create(t),aInstance:a.create(Nt(new Float32Array(t))),hasReflection:a.create(u),instanceGrid:a.create(Fc())};return kc(s,r,n,i),s}const In=new Float32Array(16);ie.toArray(ie.identity(),In,0);function Gc(e){return ti(new Float32Array(In),1,void 0,0,0,e)}function ma(e,t){for(let r=0;r<t;r++)e.set(In,r*16);return e}function kc(e,t,r,n){const i=e.aTransform.ref.value,s=e.aInstance.ref.value,u=e.instanceCount.ref.value,p=e.matrix.ref.value,m=e.transform.ref.value,v=e.extraTransform.ref.value;for(let h=0;h<u;h++){const y=h*16;ie.mulOffset(i,v,m,y,y,y),ie.mulOffset(i,p,i,y,0,y),s[h]=h}if(t&&u>0){const h=Pc({instanceCount:u,instance:s,transform:i,invariantBoundingSphere:t},r,n);a.update(e.instanceGrid,h),a.update(e.aInstance,h.cellInstance),a.update(e.aTransform,h.cellTransform)}else a.update(e.aInstance,s),a.update(e.aTransform,i)}const Qt=Pi({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflower:6591981,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,laserlemon:16777044,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrod:16448210,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,maroon2:8323072,maroon3:11546720,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,purple2:8323199,purple3:10494192,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});(function(){const e=new Map;return Object.keys(Qt).forEach(t=>{e.set(Qt[t],t)}),e})();const ri={Atom:"Atom Property",Chain:"Chain Property",Residue:"Residue Property",Symmetry:"Symmetry",Validation:"Validation",Misc:"Miscellaneous"},ni=he(13421772),Vc="Gives everything the same, uniform color.",ai={value:k.Color(ni),saturation:k.Numeric(0,{min:-6,max:6,step:.1}),lightness:k.Numeric(0,{min:-6,max:6,step:.1})};function zc(e){return ai}function An(e,t){let r=Ti(t.value,ni);return r=he.saturate(r,t.saturation),r=he.lighten(r,t.lightness),{factory:An,granularity:"uniform",color:()=>r,props:t,description:Vc,legend:xi([["uniform",r]])}}const Yd={name:"uniform",label:"Uniform",category:ri.Misc,factory:An,getParams:zc,defaultValues:k.getDefaultValues(ai),isApplicable:e=>!0},Uc="Gives everything the same, uniform size.",ii={value:k.Numeric(1,{min:0,max:20,step:.1})};function jc(e){return ii}function Dn(e,t){const r=t.value;return{factory:Dn,granularity:"uniform",size:()=>r,props:t,description:Uc}}const Qd={name:"uniform",label:"Uniform",category:"",factory:Dn,getParams:jc,defaultValues:k.getDefaultValues(ii),isApplicable:e=>!0};function It(e){return{...It.Zero,...e}}(function(e){e.Zero={metalness:0,roughness:0,bumpiness:0};function t(u,p,m){return p[m]=u.metalness*255,p[m+1]=u.roughness*255,p[m+2]=u.bumpiness*255,p}e.toArray=t;function r(u,p,m){return p[m]=u.metalness,p[m+1]=u.roughness,p[m+2]=u.bumpiness,p}e.toArrayNormalized=r;function n(u,p){return u.metalness===p.metalness&&u.roughness===p.roughness&&u.bumpiness===p.bumpiness}e.areEqual=n;function i({metalness:u,roughness:p,bumpiness:m}){return`M ${u.toFixed(2)} | R ${p.toFixed(2)} | B ${m.toFixed(2)}`}e.toString=i;function s(u){return k.Group({metalness:k.Numeric(0,{min:0,max:1,step:.01}),roughness:k.Numeric(1,{min:0,max:1,step:.01}),bumpiness:k.Numeric(0,{min:0,max:1,step:.01})},{...u,presets:[[{metalness:0,roughness:1,bumpiness:0},"Matte"],[{metalness:0,roughness:.2,bumpiness:0},"Plastic"],[{metalness:0,roughness:.6,bumpiness:0},"Glossy"],[{metalness:1,roughness:.6,bumpiness:0},"Metallic"]]})}e.getParam=s})(It||(It={}));function Ht(){}(function(e){e.Type={none:0,plane:1,sphere:2,cube:3,cylinder:4,infiniteCone:5},e.Params={variant:k.Select("pixel",k.arrayToOptions(["instance","pixel"])),objects:k.ObjectList({type:k.Select("plane",k.objectToOptions(e.Type,h=>xr(h))),invert:k.Boolean(!1),position:k.Vec3(T()),rotation:k.Group({axis:k.Vec3(T.create(1,0,0)),angle:k.Numeric(0,{min:-180,max:180,step:1},{description:"Angle in Degrees"})},{isExpanded:!0}),scale:k.Vec3(T.create(1,1,1)),transform:k.Mat4(ie.identity())},h=>xr(h.type))};function t(h){return{count:0,type:new Array(h).fill(1),invert:new Array(h).fill(!1),position:new Array(h*3).fill(0),rotation:new Array(h*4).fill(0),scale:new Array(h*3).fill(1),transform:new Array(h*16).fill(0)}}const r=nt(),n=nt(),i=T(),s=T(),u=ie(),p=ie();function m(h,y){const x=h.objects.length,{type:f,invert:c,position:o,rotation:d,scale:g,transform:_}=y?.objects||t(x);for(let l=0;l<x;++l){const b=h.objects[l];f[l]=e.Type[b.type],c[l]=b.invert,T.toArray(b.position,o,l*3),T.normalize(i,b.rotation.axis),nt.toArray(nt.setAxisAngle(r,i,Pa(b.rotation.angle)),d,l*4),T.toArray(b.scale,g,l*3),ie.toArray(b.transform,_,l*16)}return{variant:h.variant,objects:{count:x,type:f,invert:c,position:o,rotation:d,scale:g,transform:_}}}e.getClip=m;function v(h,y){if(h.variant!==y.variant||h.objects.count!==y.objects.count)return!1;const x=h.objects,f=y.objects;for(let c=0,o=x.count;c<o;++c)if(x.invert[c]!==f.invert[c]||x.type[c]!==f.type[c]||(T.fromArray(i,x.position,c*3),T.fromArray(s,f.position,c*3),!T.equals(i,s))||(T.fromArray(i,x.scale,c*3),T.fromArray(s,f.scale,c*3),!T.equals(i,s))||(nt.fromArray(r,x.rotation,c*4),nt.fromArray(n,f.rotation,c*4),!nt.equals(r,n))||(ie.fromArray(u,x.transform,c*16),ie.fromArray(p,f.transform,c*16),!ie.areEqual(u,p,Ba)))return!1;return!0}e.areEqual=v})(Ht||(Ht={}));const qc={custom:{},auto:{},highest:{},higher:{},high:{},medium:{},low:{},lower:{},lowest:{}},Wc=Object.keys(qc),Xc=k.arrayToOptions(Wc),Zd={smoothColors:k.MappedStatic("auto",{auto:k.Group({}),on:k.Group({resolutionFactor:k.Numeric(2,{min:.5,max:6,step:.1}),sampleStride:k.Numeric(3,{min:1,max:12,step:1})}),off:k.Group({})})};function Kd(e){return!!e.smoothColors}function Jd(e,t,r){if((e.name==="on"||e.name==="auto"&&t)&&r&&r<3){let n=3;return e.name==="on"?(r*=e.params.resolutionFactor,n=e.params.sampleStride):(r*=2-Li(0,1.1,r),r=Math.max(.5,r),r>1.2&&(n=2)),{resolution:r,stride:n}}}var X;(function(e){e.MaterialCategory={category:"Material"},e.ShadingCategory={category:"Shading"},e.CullingLodCategory={category:"Culling & LOD"},e.CustomQualityParamInfo={category:"Custom Quality",hideIf:u=>typeof u.quality<"u"&&u.quality!=="custom"},e.Params={alpha:k.Numeric(1,{min:0,max:1,step:.01},{label:"Opacity",isEssential:!0,description:"How opaque/transparent the representation is rendered."}),quality:k.Select("auto",Xc,{isEssential:!0,description:"Visual/rendering quality of the representation."}),material:It.getParam(),clip:k.Group(Ht.Params),emissive:k.Numeric(0,{min:0,max:1,step:.01}),density:k.Numeric(.2,{min:0,max:1,step:.01},{description:"Density value to estimate object thickness."}),instanceGranularity:k.Boolean(!1,{description:"Use instance granularity for marker, transparency, clipping, overpaint, substance data to save memory."}),lod:k.Vec3(T(),void 0,{...e.CullingLodCategory,description:"Level of detail.",fieldLabels:{x:"Min Distance",y:"Max Distance",z:"Overlap (Shader)"}}),cellSize:k.Numeric(200,{min:0,max:5e3,step:100},{...e.CullingLodCategory,description:"Instance grid cell size."}),batchSize:k.Numeric(2e3,{min:0,max:5e4,step:500},{...e.CullingLodCategory,description:"Instance grid batch size."})};function t(u=Qt.grey,p=1,m){m||(m=Gc());const v=We(1,m.instanceCount.ref.value,1,()=>Ye,!1,()=>!1),h={color:An({},{value:u,lightness:0,saturation:0}),size:Dn({},{value:p})};return{transform:m,locationIterator:v,theme:h}}e.createSimple=t;function r(u,p){const m=Ht.getClip(u.clip);return{alpha:a.create(u.alpha),uAlpha:a.create(u.alpha),uVertexCount:a.create(p.vertexCount),uGroupCount:a.create(p.groupCount),drawCount:a.create(p.drawCount),uMetalness:a.create(u.material.metalness),uRoughness:a.create(u.material.roughness),uBumpiness:a.create(u.material.bumpiness),uEmissive:a.create(u.emissive),uDensity:a.create(u.density),dClipObjectCount:a.create(m.objects.count),dClipVariant:a.create(m.variant),uClipObjectType:a.create(m.objects.type),uClipObjectInvert:a.create(m.objects.invert),uClipObjectPosition:a.create(m.objects.position),uClipObjectRotation:a.create(m.objects.rotation),uClipObjectScale:a.create(m.objects.scale),uClipObjectTransform:a.create(m.objects.transform),instanceGranularity:a.create(u.instanceGranularity),uLod:a.create(se.create(u.lod[0],u.lod[1],u.lod[2],0))}}e.createValues=r;function n(u,p){a.updateIfChanged(u.alpha,p.alpha),a.updateIfChanged(u.uMetalness,p.material.metalness),a.updateIfChanged(u.uRoughness,p.material.roughness),a.updateIfChanged(u.uBumpiness,p.material.bumpiness),a.updateIfChanged(u.uEmissive,p.emissive),a.updateIfChanged(u.uDensity,p.density);const m=Ht.getClip(p.clip);a.updateIfChanged(u.dClipObjectCount,m.objects.count),a.updateIfChanged(u.dClipVariant,m.variant),a.update(u.uClipObjectType,m.objects.type),a.update(u.uClipObjectInvert,m.objects.invert),a.update(u.uClipObjectPosition,m.objects.position),a.update(u.uClipObjectRotation,m.objects.rotation),a.update(u.uClipObjectScale,m.objects.scale),a.update(u.uClipObjectTransform,m.objects.transform),a.updateIfChanged(u.instanceGranularity,p.instanceGranularity),a.update(u.uLod,se.set(u.uLod.ref.value,p.lod[0],p.lod[1],p.lod[2],0))}e.updateValues=n;function i(u={}){const p=u.alpha===void 0?!0:u.alpha===1;return{disposed:!1,visible:!0,alphaFactor:1,pickable:!0,colorOnly:!1,opaque:p,writeDepth:p}}e.createRenderableState=i;function s(u,p){u.opaque=p.alpha*u.alphaFactor>=1,u.writeDepth=u.opaque}e.updateRenderableState=s})(X||(X={}));function el(e,t,r,n){for(let i=t;i<r;++i)he.toArray(n,e,i*4),e[i*4+3]=255;return!0}function tl(e,t,r){return e.fill(0,t*4,r*4),!0}function rl(e,t,r){const n=Te(Math.max(1,e),4,Uint8Array,r&&r.tOverpaint.ref.value.array);return r?(a.update(r.tOverpaint,n),a.update(r.uOverpaintTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.dOverpaint,e>0),a.updateIfChanged(r.dOverpaintType,t),r):{tOverpaint:a.create(n),uOverpaintTexDim:a.create(ae.create(n.width,n.height)),dOverpaint:a.create(e>0),tOverpaintGrid:a.create(we()),uOverpaintGridDim:a.create(T.create(1,1,1)),uOverpaintGridTransform:a.create(se.create(0,0,0,1)),dOverpaintType:a.create(t),uOverpaintStrength:a.create(1)}}const Hc={array:new Uint8Array(4),width:1,height:1};function ut(e){return{tOverpaint:a.create(Hc),uOverpaintTexDim:a.create(ae.create(1,1)),dOverpaint:a.create(!1),tOverpaintGrid:a.create(we()),uOverpaintGridDim:a.create(T.create(1,1,1)),uOverpaintGridTransform:a.create(se.create(0,0,0,1)),dOverpaintType:a.create("groupInstance"),uOverpaintStrength:a.create(1)}}function nl(e,t,r,n){for(let i=t;i<r;++i)e[i]=n*255;return!0}function $c(e,t){if(t===0||e.length<t)return 0;let r=0;for(let n=0;n<t;++n)r+=e[n];return r/(255*t)}function Yc(e,t){if(t===0||e.length<t)return 1;let r=255;for(let n=0;n<t;++n)e[n]>0&&e[n]<r&&(r=e[n]);return r/255}function al(e,t,r){e.fill(0,t,r)}function il(e,t,r){const n=Te(Math.max(1,e),1,Uint8Array,r&&r.tTransparency.ref.value.array);return r?(a.update(r.tTransparency,n),a.update(r.uTransparencyTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.dTransparency,e>0),a.updateIfChanged(r.transparencyAverage,$c(n.array,e)),a.updateIfChanged(r.transparencyMin,Yc(n.array,e)),a.updateIfChanged(r.dTransparencyType,t),r):{tTransparency:a.create(n),uTransparencyTexDim:a.create(ae.create(n.width,n.height)),dTransparency:a.create(e>0),transparencyAverage:a.create(0),transparencyMin:a.create(1),tTransparencyGrid:a.create(we()),uTransparencyGridDim:a.create(T.create(1,1,1)),uTransparencyGridTransform:a.create(se.create(0,0,0,1)),dTransparencyType:a.create(t),uTransparencyStrength:a.create(1)}}const Qc={array:new Uint8Array(1),width:1,height:1};function ct(e){return{tTransparency:a.create(Qc),uTransparencyTexDim:a.create(ae.create(1,1)),dTransparency:a.create(!1),transparencyAverage:a.create(0),transparencyMin:a.create(1),tTransparencyGrid:a.create(we()),uTransparencyGridDim:a.create(T.create(1,1,1)),uTransparencyGridTransform:a.create(se.create(0,0,0,1)),dTransparencyType:a.create("groupInstance"),uTransparencyStrength:a.create(1)}}function ol(e,t,r,n){return e.fill(n,t,r),!0}function sl(e,t,r){e.fill(0,t,r)}function ul(e,t,r){const n=Te(Math.max(1,e),1,Uint8Array,r&&r.tClipping.ref.value.array);return r?(a.update(r.tClipping,n),a.update(r.uClippingTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.dClipping,e>0),a.updateIfChanged(r.dClippingType,t),r):{tClipping:a.create(n),uClippingTexDim:a.create(ae.create(n.width,n.height)),dClipping:a.create(e>0),dClippingType:a.create(t)}}const Zc={array:new Uint8Array(1),width:1,height:1};function ft(e){return{tClipping:a.create(Zc),uClippingTexDim:a.create(ae.create(1,1)),dClipping:a.create(!1),dClippingType:a.create("groupInstance")}}function cl(e,t,r,n){for(let i=t;i<r;++i)It.toArray(n,e,i*4),e[i*4+3]=255;return!0}function fl(e,t,r){return e.fill(0,t*4,r*4),!0}function dl(e,t,r){const n=Te(Math.max(1,e),4,Uint8Array,r&&r.tSubstance.ref.value.array);return r?(a.update(r.tSubstance,n),a.update(r.uSubstanceTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.dSubstance,e>0),a.updateIfChanged(r.dSubstanceType,t),r):{tSubstance:a.create(n),uSubstanceTexDim:a.create(ae.create(n.width,n.height)),dSubstance:a.create(e>0),tSubstanceGrid:a.create(we()),uSubstanceGridDim:a.create(T.create(1,1,1)),uSubstanceGridTransform:a.create(se.create(0,0,0,1)),dSubstanceType:a.create(t),uSubstanceStrength:a.create(1)}}const Kc={array:new Uint8Array(4),width:1,height:1};function dt(e){return{tSubstance:a.create(Kc),uSubstanceTexDim:a.create(ae.create(1,1)),dSubstance:a.create(!1),tSubstanceGrid:a.create(we()),uSubstanceGridDim:a.create(T.create(1,1,1)),uSubstanceGridTransform:a.create(se.create(0,0,0,1)),dSubstanceType:a.create("groupInstance"),uSubstanceStrength:a.create(1)}}function ll(e,t,r,n){for(let i=t;i<r;++i)e[i]=n*255;return!0}function Jc(e,t){if(t===0||e.length<t)return 0;let r=0;for(let n=0;n<t;++n)r+=e[n];return r/(255*t)}function ml(e,t,r){e.fill(0,t,r)}function pl(e,t,r){const n=Te(Math.max(1,e),1,Uint8Array,r&&r.tEmissive.ref.value.array);return r?(a.update(r.tEmissive,n),a.update(r.uEmissiveTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.dEmissive,e>0),a.updateIfChanged(r.emissiveAverage,Jc(n.array,e)),a.updateIfChanged(r.dEmissiveType,t),r):{tEmissive:a.create(n),uEmissiveTexDim:a.create(ae.create(n.width,n.height)),dEmissive:a.create(e>0),emissiveAverage:a.create(0),tEmissiveGrid:a.create(we()),uEmissiveGridDim:a.create(T.create(1,1,1)),uEmissiveGridTransform:a.create(se.create(0,0,0,1)),dEmissiveType:a.create(t),uEmissiveStrength:a.create(1)}}const ef={array:new Uint8Array(1),width:1,height:1};function lt(e){return{tEmissive:a.create(ef),uEmissiveTexDim:a.create(ae.create(1,1)),dEmissive:a.create(!1),emissiveAverage:a.create(0),tEmissiveGrid:a.create(we()),uEmissiveGridDim:a.create(T.create(1,1,1)),uEmissiveGridTransform:a.create(se.create(0,0,0,1)),dEmissiveType:a.create("groupInstance"),uEmissiveStrength:a.create(1)}}function gl(e,t,r,n){for(let i=t;i<r;++i)e[i]=n*255;return!0}function tf(e,t){if(t===0||e.length<t)return 0;let r=0;for(let n=0;n<t;++n)r+=e[n];return r/(255*t)}function vl(e,t,r){e.fill(0,t,r)}function hl(e,t,r){const n=Te(Math.max(1,e),1,Uint8Array,r&&r.tWiggle.ref.value.array);return r?(a.update(r.tWiggle,n),a.update(r.uWiggleTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.dWiggle,e>0),a.updateIfChanged(r.wiggleAverage,tf(n.array,e)),a.updateIfChanged(r.dWiggleType,t),r):{tWiggle:a.create(n),uWiggleTexDim:a.create(ae.create(n.width,n.height)),dWiggle:a.create(e>0),wiggleAverage:a.create(0),dWiggleType:a.create(t),uWiggleStrength:a.create(1)}}const rf={array:new Uint8Array(1),width:1,height:1};function mt(e){return{tWiggle:a.create(rf),uWiggleTexDim:a.create(ae.create(1,1)),dWiggle:a.create(!1),wiggleAverage:a.create(0),dWiggleType:a.create("groupInstance"),uWiggleStrength:a.create(1)}}function Pr(){return k.Group({color:k.Color(he.fromRgb(76,76,76)),colorStrength:k.Numeric(1,{min:0,max:1,step:.01}),substance:It.getParam(),substanceStrength:k.Numeric(1,{min:0,max:1,step:.01})})}function bl(e,t){return e.color===t.color&&e.colorStrength===t.colorStrength&&It.areEqual(e.substance,t.substance)&&e.substanceStrength===t.substanceStrength}function oi(e,t){return he.toArrayNormalized(e.color,t,0),t[3]=e.colorStrength,t}function si(e,t){return It.toArrayNormalized(e.substance,t,0),t[3]=e.substanceStrength,t}function Lr(e){return{uInteriorColor:a.create(oi(e,se())),uInteriorSubstance:a.create(si(e,se()))}}function Or(e,t){a.update(e.uInteriorColor,oi(t,e.uInteriorColor.ref.value)),a.update(e.uInteriorSubstance,si(t,e.uInteriorSubstance.ref.value))}function Vt(){return k.Group({wiggleMode:k.Select("position",[["position","Position"],["group","Group"]],{description:"Noise seeding mode. Position: spatially correlated (nearby atoms move together). Group: per-group independent noise."}),wiggleSpeed:k.Numeric(7,{min:0,max:10,step:.1},{description:"Speed of vertex wiggle animation."}),wiggleAmplitude:k.Numeric(0,{min:0,max:5,step:.01},{description:"Amplitude of vertex wiggle animation."}),wiggleFrequency:k.Numeric(.2,{min:.01,max:2,step:.01},{description:"Spatial frequency of vertex wiggle noise (position mode). Lower values correlate nearby atoms more."}),tumbleSpeed:k.Numeric(1,{min:0,max:10,step:.1},{description:"Speed of instance tumble animation."}),tumbleAmplitude:k.Numeric(0,{min:0,max:10,step:.1},{description:"Amplitude of instance tumble animation. In Ångströms of implied surface displacement."}),tumbleFrequency:k.Numeric(.2,{min:0,max:2,step:.01},{description:"Spatial frequency multiplier for tumble noise."})})}function yl(e,t){return e.wiggleMode===t.wiggleMode&&e.wiggleSpeed===t.wiggleSpeed&&e.wiggleAmplitude===t.wiggleAmplitude&&e.wiggleFrequency===t.wiggleFrequency&&e.tumbleSpeed===t.tumbleSpeed&&e.tumbleAmplitude===t.tumbleAmplitude&&e.tumbleFrequency===t.tumbleFrequency}function zt(e){return{uWiggleSpeed:a.create(e.wiggleSpeed),uWiggleAmplitude:a.create(e.wiggleAmplitude),uWiggleFrequency:a.create(e.wiggleFrequency),uWiggleMode:a.create(e.wiggleMode==="position"?0:1),uTumbleSpeed:a.create(e.tumbleSpeed),uTumbleAmplitude:a.create(e.tumbleAmplitude),uTumbleFrequency:a.create(e.tumbleFrequency)}}function Ut(e,t){a.updateIfChanged(e.uWiggleSpeed,t.wiggleSpeed),a.updateIfChanged(e.uWiggleAmplitude,t.wiggleAmplitude),a.updateIfChanged(e.uWiggleFrequency,t.wiggleFrequency),a.updateIfChanged(e.uWiggleMode,t.wiggleMode==="position"?0:1),a.updateIfChanged(e.uTumbleSpeed,t.tumbleSpeed),a.updateIfChanged(e.uTumbleAmplitude,t.tumbleAmplitude),a.updateIfChanged(e.uTumbleFrequency,t.tumbleFrequency)}var dn;(function(e){function t(S,E,B,L,F,O,N){return N?s(S,E,B,L,F,O,N):i(S,E,B,L,F,O)}e.create=t;function r(S){const E=S?S.vertexBuffer.ref.value:new Float32Array(0),B=S?S.indexBuffer.ref.value:new Uint32Array(0),L=S?S.normalBuffer.ref.value:new Float32Array(0),F=S?S.groupBuffer.ref.value:new Float32Array(0);return t(E,B,L,F,0,0,S)}e.createEmpty=r;function n(S){return it([S.vertexCount,S.triangleCount,S.vertexBuffer.ref.version,S.indexBuffer.ref.version,S.normalBuffer.ref.version,S.groupBuffer.ref.version])}function i(S,E,B,L,F,O){const N=q();let z,V=-1,$=-1;const H={kind:"mesh",vertexCount:F,triangleCount:O,vertexBuffer:a.create(S),indexBuffer:a.create(E),normalBuffer:a.create(B),groupBuffer:a.create(L),varyingGroup:a.create(!1),get boundingSphere(){const P=n(H);if(P!==V){const M=Et(H.vertexBuffer.ref.value,H.vertexCount,1);q.copy(N,M),V=P}return N},get groupMapping(){return H.groupBuffer.ref.version!==$&&(z=kt(H.groupBuffer.ref.value,H.vertexCount),$=H.groupBuffer.ref.version),z},setBoundingSphere(P){q.copy(N,P),V=n(H)},hasBoundingSphere(){return V===n(H)},meta:{}};return H}function s(S,E,B,L,F,O,N){return N.vertexCount=F,N.triangleCount=O,a.update(N.vertexBuffer,S),a.update(N.indexBuffer,E),a.update(N.normalBuffer,B),a.update(N.groupBuffer,L),N}function u(S){const{vertexCount:E,triangleCount:B}=S,L=S.vertexBuffer.ref.value,F=S.indexBuffer.ref.value,O=S.normalBuffer.ref.value.length>=E*3?S.normalBuffer.ref.value:new Float32Array(E*3);O===S.normalBuffer.ref.value&&O.fill(0,0,E*3),Qi(L,F,O,E,B),a.update(S.normalBuffer,O)}e.computeNormals=u;function p(S,E=3){const B=S.vertexBuffer.ref.value,L=new Map,F=(z,V)=>`${z[0].toFixed(V)}|${z[1].toFixed(V)}|${z[2].toFixed(V)}`;let O=0;const N=T();for(let z=0,V=S.vertexCount;z<V;++z){T.fromArray(N,B,z*3);const $=F(N,E),H=L.get($);H!==void 0?(O+=1,L.set($,H+1)):L.set($,1)}return O}e.checkForDuplicateVertices=p;const m=Bt();function v(S,E){const B=S.vertexBuffer.ref.value;if(Gt(E,B,0,S.vertexCount),!ie.isTranslationAndUniformScaling(E)){const L=Bt.directionTransform(m,E);Yi(L,S.normalBuffer.ref.value,0,S.vertexCount)}a.update(S.vertexBuffer,B)}e.transform=v;function h(S){const{originalData:E}="kind"in S?S.meta:S.meta.ref.value;return E}e.getOriginalData=h;function y(S,E=!0){const{indexBuffer:B,vertexBuffer:L,groupBuffer:F,normalBuffer:O,triangleCount:N,vertexCount:z}=S,V=B.ref.value,$=L.ref.value,H=F.ref.value,P=O.ref.value,M=J.create(Uint32Array,3,1024,N),U=J.create(Float32Array,3,1024,$);U.currentIndex=z*3,U.elementCount=z;const W=J.create(Float32Array,3,1024,P);W.currentIndex=z*3,W.elementCount=z;const te=J.create(Float32Array,1,1024,H);te.currentIndex=z,te.elementCount=z;const j=T(),Q=T(),ne=T(),Z=T(),Y=T(),re=T();function Ee(pe){T.fromArray(j,$,pe*3),T.fromArray(Z,P,pe*3),J.add3(U,j[0],j[1],j[2]),J.add3(W,Z[0],Z[1],Z[2])}function De(pe,ke){T.fromArray(j,$,pe*3),T.fromArray(Q,$,ke*3),T.scale(j,T.add(j,j,Q),.5),T.fromArray(Z,P,pe*3),T.fromArray(Y,P,ke*3),T.scale(Z,T.add(Z,Z,Y),.5),J.add3(U,j[0],j[1],j[2]),J.add3(W,Z[0],Z[1],Z[2])}function Ge(pe,ke,ye){T.fromArray(j,$,pe*3),T.fromArray(Q,$,ke*3),T.fromArray(ne,$,ye*3),T.scale(j,T.add(j,T.add(j,j,Q),ne),1/3),T.fromArray(Z,P,pe*3),T.fromArray(Y,P,ke*3),T.fromArray(re,P,ye*3),T.scale(Z,T.add(Z,T.add(Z,Z,Y),re),1/3),J.add3(U,j[0],j[1],j[2]),J.add3(W,Z[0],Z[1],Z[2])}function Tt(pe,ke,ye,Ce,Se){++Xe,Ee(pe),De(pe,ke),De(pe,ye),J.add3(M,ue,ue+1,ue+2);for(let Re=0;Re<3;++Re)J.add(te,Ce);ue+=3,Xe+=2,Ee(ke),Ee(ye),De(pe,ke),De(pe,ye),J.add3(M,ue,ue+1,ue+3),J.add3(M,ue,ue+3,ue+2);for(let Re=0;Re<4;++Re)J.add(te,Se);ue+=4}let ue=z,Xe=0;if(E)for(let pe=0,ke=N;pe<ke;++pe){const ye=V[pe*3],Ce=V[pe*3+1],Se=V[pe*3+2],Re=H[ye],Qe=H[Ce],Je=H[Se];if(Re===Qe&&Re===Je)++Xe,J.add3(M,ye,Ce,Se);else if(Re===Qe)Tt(Se,ye,Ce,Je,Re);else if(Re===Je)Tt(Ce,Se,ye,Qe,Je);else if(Qe===Je)Tt(ye,Ce,Se,Re,Qe);else{Xe+=2,Ee(ye),De(ye,Ce),De(ye,Se),Ge(ye,Ce,Se),J.add3(M,ue,ue+1,ue+3),J.add3(M,ue,ue+3,ue+2);for(let Ze=0;Ze<4;++Ze)J.add(te,Re);ue+=4,Xe+=2,Ee(Ce),De(Ce,Se),De(Ce,ye),Ge(ye,Ce,Se),J.add3(M,ue,ue+1,ue+3),J.add3(M,ue,ue+3,ue+2);for(let Ze=0;Ze<4;++Ze)J.add(te,Qe);ue+=4,Xe+=2,Ee(Se),De(Se,Ce),De(Se,ye),Ge(ye,Ce,Se),J.add3(M,ue+3,ue+1,ue),J.add3(M,ue+2,ue+3,ue);for(let Ze=0;Ze<4;++Ze)J.add(te,Je);ue+=4}}else for(let pe=0,ke=N;pe<ke;++pe){const ye=V[pe*3],Ce=V[pe*3+1],Se=V[pe*3+2],Re=H[ye],Qe=H[Ce],Je=H[Se];if(Re!==Qe||Re!==Je){++Xe,Ee(ye),Ee(Ce),Ee(Se),J.add3(M,ue,ue+1,ue+2);const Ze=Qe===Je?Qe:Re;for(let Bn=0;Bn<3;++Bn)J.add(te,Ze);ue+=3}else++Xe,J.add3(M,ye,Ce,Se)}const be=J.compact(M),xt=J.compact(U),Fe=J.compact(W),sr=J.compact(te);return S.vertexCount=ue,S.triangleCount=Xe,a.update(L,xt),a.update(F,sr),a.update(B,be),a.update(O,Fe),S.meta.originalData={indexBuffer:V,vertexCount:z,triangleCount:N},S}e.uniformTriangleGroup=y;function x(S){const{vertexCount:E,triangleCount:B}=S,L=S.indexBuffer.ref.value,F=[];for(let O=0;O<E;++O)F[O]=[];for(let O=0;O<B;++O){const N=L[O*3],z=L[O*3+1],V=L[O*3+2];Dt(F[N],z),Dt(F[N],V),Dt(F[z],N),Dt(F[z],V),Dt(F[V],N),Dt(F[V],z)}return F}function f(S){const{triangleCount:E}=S,B=S.indexBuffer.ref.value,L=new Map,F=(O,N)=>{const z=Fn(O,N),V=L.get(z)||0;L.set(z,V+1)};for(let O=0;O<E;++O){const N=B[O*3],z=B[O*3+1],V=B[O*3+2];F(N,z),F(N,V),F(z,V)}return L}function c(S){const E=new Set,B=[0,0];return S.forEach((L,F)=>{L===1&&(Ci(B,F),E.add(B[0]),E.add(B[1]))}),E}function o(S,E,B){const L=new Map,F=(O,N)=>{L.has(O)?Dt(L.get(O),N):L.set(O,[N])};return E.forEach(O=>{const N=S[O];for(const z of N)E.has(z)&&B.get(Fn(O,z))===1&&F(O,z)}),L}function d(S,E){const{indexBuffer:B,triangleCount:L}=S,F=B.ref.value,O=J.create(Uint32Array,3,1024,L);let N=0;for(let V=0;V<L;++V){const $=F[V*3],H=F[V*3+1],P=F[V*3+2];E[$].length===2||E[H].length===2||E[P].length===2||(J.add3(O,$,H,P),N+=1)}const z=J.compact(O);return S.triangleCount=N,a.update(B,z),S}function g(S,E,B,L){var F;const{vertexBuffer:O,indexBuffer:N,normalBuffer:z,triangleCount:V}=S,$=O.ref.value,H=N.ref.value,P=z.ref.value,M=J.create(Uint32Array,3,1024,V);let U=0;for(let be=0;be<V;++be)J.add3(M,H[be*3],H[be*3+1],H[be*3+2]),U+=1;const W=T(),te=T(),j=T(),Q=T(),ne=T(),Z=T(),Y=T(),re=T(),Ee=T(),De=T(),Ge=Pa(120),Tt=new Set,ue=Array.from(B.keys()).filter(be=>B.get(be).length<2).map(be=>{const xt=B.get(be);return T.fromArray(W,$,be*3),T.fromArray(te,$,xt[0]*3),T.fromArray(j,$,xt[1]*3),T.sub(ne,te,W),T.sub(Z,j,W),[be,T.angle(ne,Z)]});ue.sort(([,be],[,xt])=>be-xt);for(const[be,xt]of ue){if(Tt.has(be)||xt>Ge)continue;const Fe=B.get(be);if(E[Fe[0]].includes(Fe[1])&&!(!((F=B.get(Fe[0]))===null||F===void 0)&&F.includes(Fe[1]))||(T.fromArray(W,$,be*3),T.fromArray(te,$,Fe[0]*3),T.fromArray(j,$,Fe[1]*3),T.sub(ne,te,W),T.sub(Z,j,W),T.add(re,ne,Z),T.squaredDistance(W,te)>=L))continue;let sr=!1;for(const pe of E[be])if(!Fe.includes(pe)&&(T.fromArray(Q,$,pe*3),T.sub(Y,Q,W),T.dot(re,Y)<0)){sr=!0;break}sr&&(T.fromArray(Ee,P,be*3),T.triangleNormal(De,W,te,j),T.dot(De,Ee)>0?J.add3(M,be,Fe[0],Fe[1]):J.add3(M,Fe[1],Fe[0],be),Tt.add(be),Tt.add(Fe[0]),Tt.add(Fe[1]),U+=1)}const Xe=J.compact(M);return S.triangleCount=U,a.update(N,Xe),S}function _(S,E,B){const{iterations:L,lambda:F}=B,O=T(),N=T(),z=T(),V=T(),$=-F;let H=new Float32Array(S.vertexBuffer.ref.value.length);const P=M=>{const U=S.vertexBuffer.ref.value;H.set(U),E.forEach((te,j)=>{if(te.length!==2)return;T.fromArray(O,U,j*3),T.fromArray(N,U,te[0]*3),T.fromArray(z,U,te[1]*3);const Q=1/T.distance(O,N),ne=1/T.distance(O,z);T.scale(N,N,Q),T.scale(z,z,ne),T.add(V,N,z),T.scale(V,V,1/(Q+ne)),T.sub(V,V,O),T.scale(V,V,M),T.add(V,O,V),T.toArray(V,H,j*3)});const W=S.vertexBuffer.ref.value;a.update(S.vertexBuffer,H),H=W};for(let M=0;M<L;++M)P(F),P($)}function l(S,E){d(S,x(S));for(let N=0;N<10;++N){const z=S.triangleCount,V=f(S),$=x(S),H=c(V),P=o($,H,V);if(g(S,$,P,E.maxNewEdgeLength*E.maxNewEdgeLength),S.triangleCount===z)break}const B=f(S),L=x(S),F=c(B),O=o(L,F,B);return _(S,O,{iterations:E.iterations,lambda:.5}),S}e.smoothEdges=l,e.Params={...X.Params,doubleSided:k.Boolean(!1,X.CustomQualityParamInfo),flipSided:k.Boolean(!1,X.ShadingCategory),flatShaded:k.Boolean(!1,X.ShadingCategory),ignoreLight:k.Boolean(!1,X.ShadingCategory),celShaded:k.Boolean(!1,X.ShadingCategory),xrayShaded:k.Select(!1,[[!1,"Off"],[!0,"On"],["inverted","Inverted"]],X.ShadingCategory),transparentBackfaces:k.Select("off",k.arrayToOptions(["off","on","opaque"]),X.ShadingCategory),bumpFrequency:k.Numeric(0,{min:0,max:10,step:.1},X.ShadingCategory),bumpAmplitude:k.Numeric(1,{min:0,max:5,step:.1},X.ShadingCategory),interior:Pr(),animation:Vt()},e.Utils={Params:e.Params,createEmpty:r,createValues:I,createValuesSimple:C,updateValues:A,updateBoundingSphere:D,createRenderableState:w,updateRenderableState:R,createPositionIterator:b};function b(S,E){const B=S.vertexCount,L=E.instanceCount.ref.value,F=At(),O=F.position,N=F.normal,z=S.vertexBuffer.ref.value,V=S.normalBuffer.ref.value,$=E.aTransform.ref.value;return We(B,L,1,(P,M)=>(M<0?(T.fromArray(O,z,P*3),T.fromArray(N,V,P*3)):(T.transformMat4Offset(O,z,$,0,P*3,M*16),T.transformDirectionOffset(N,V,$,0,P*3,M*16)),F))}function I(S,E,B,L,F){const{instanceCount:O,groupCount:N}=B,z=b(S,E),V=st(B,z,L.color),$=F.instanceGranularity?Ae(O,"instance"):Ae(O*N,"groupInstance"),H=ut(),P=ct(),M=lt(),U=dt(),W=ft(),te=mt(),j={drawCount:S.triangleCount*3,vertexCount:S.vertexCount,groupCount:N,instanceCount:O},Q=q.clone(S.boundingSphere),ne=Ie(Q,E.aTransform.ref.value,O,0);return{dGeometryType:a.create("mesh"),aPosition:S.vertexBuffer,aNormal:S.normalBuffer,aGroup:S.groupBuffer,elements:S.indexBuffer,dVaryingGroup:S.varyingGroup,boundingSphere:a.create(ne),invariantBoundingSphere:a.create(Q),uInvariantBoundingSphere:a.create(se.ofSphere(Q)),...V,...$,...H,...P,...M,...U,...W,...te,...E,...X.createValues(F,j),uDoubleSided:a.create(F.doubleSided),dFlatShaded:a.create(F.flatShaded),dFlipSided:a.create(F.flipSided),dIgnoreLight:a.create(F.ignoreLight),dCelShaded:a.create(F.celShaded),dXrayShaded:a.create(F.xrayShaded==="inverted"?"inverted":F.xrayShaded===!0?"on":"off"),dTransparentBackfaces:a.create(F.transparentBackfaces),uBumpFrequency:a.create(F.bumpFrequency),uBumpAmplitude:a.create(F.bumpAmplitude),meta:a.create(S.meta),...Lr(F.interior),...zt(F.animation)}}function C(S,E,B,L,F){const O=X.createSimple(B,L,F),N={...k.getDefaultValues(e.Params),...E};return I(S,O.transform,O.locationIterator,O.theme,N)}function A(S,E){X.updateValues(S,E),a.updateIfChanged(S.uDoubleSided,E.doubleSided),a.updateIfChanged(S.dFlatShaded,E.flatShaded),a.updateIfChanged(S.dFlipSided,E.flipSided),a.updateIfChanged(S.dIgnoreLight,E.ignoreLight),a.updateIfChanged(S.dCelShaded,E.celShaded),a.updateIfChanged(S.dXrayShaded,E.xrayShaded==="inverted"?"inverted":E.xrayShaded===!0?"on":"off"),a.updateIfChanged(S.dTransparentBackfaces,E.transparentBackfaces),a.updateIfChanged(S.uBumpFrequency,E.bumpFrequency),a.updateIfChanged(S.uBumpAmplitude,E.bumpAmplitude),Or(S,E.interior),Ut(S,E.animation)}function D(S,E){const B=q.clone(E.boundingSphere),L=Ie(B,S.aTransform.ref.value,S.instanceCount.ref.value,0);q.equals(L,S.boundingSphere.ref.value)||a.update(S.boundingSphere,L),q.equals(B,S.invariantBoundingSphere.ref.value)||(a.update(S.invariantBoundingSphere,B),a.update(S.uInvariantBoundingSphere,se.fromSphere(S.uInvariantBoundingSphere.ref.value,B)))}function w(S){const E=X.createRenderableState(S);return R(E,S),E}function R(S,E){X.updateRenderableState(S,E),S.opaque=S.opaque&&!E.xrayShaded,S.writeDepth=S.opaque}})(dn||(dn={}));const pa=T(),ga=T(),va=T();function _l(e,t){const r=t.length,n=ui(r/3);for(let i=0;i<r;i+=3)T.fromArray(pa,e,t[i]*3),T.fromArray(ga,e,t[i+1]*3),T.fromArray(va,e,t[i+2]*3),n.add(pa,ga,va);return n.getPrimitive()}const lr=T();function ui(e,t){t===void 0&&(t=e*3);const r=new Float32Array(t*3),n=new Float32Array(t*3),i=new Uint32Array(e*3);let s=0,u=0;return{add:(p,m,v)=>{T.toArray(p,r,s),T.toArray(m,r,s+3),T.toArray(v,r,s+6),T.triangleNormal(lr,p,m,v);for(let h=0;h<3;++h)T.toArray(lr,n,s+3*h),i[u+h]=s/3+h;s+=9,u+=3},addQuad:(p,m,v,h)=>{T.toArray(p,r,s),T.toArray(m,r,s+3),T.toArray(v,r,s+6),T.toArray(h,r,s+9),T.triangleNormal(lr,p,m,v);for(let x=0;x<4;++x)T.toArray(lr,n,s+3*x);const y=s/3;i[u]=y,i[u+1]=y+1,i[u+2]=y+2,i[u+3]=y+2,i[u+4]=y+3,i[u+5]=y,s+=12,u+=6},getPrimitive:()=>({vertices:r,normals:n,indices:i})}}const Pt=T(),nf=Bt();function Tl(e,t){const{vertices:r,normals:n}=e,i=Bt.directionTransform(nf,t);for(let s=0,u=r.length;s<u;s+=3)T.transformMat4(Pt,T.fromArray(Pt,r,s),t),T.toArray(Pt,r,s),T.transformMat3(Pt,T.fromArray(Pt,n,s),i),T.toArray(Pt,n,s);return e}function af(e,t){return{vertices:e,edges:t}}function xl(e){return{vertices:new Float32Array(e.vertices),edges:new Uint32Array(e.edges)}}const jr=T.zero();function Cl(e,t){const{vertices:r}=e;for(let n=0,i=r.length;n<i;n+=3)T.transformMat4(jr,T.fromArray(jr,r,n),t),T.toArray(jr,r,n);return e}function of(e,t,r=-1){const n=new Float32Array(e*3),i=r===-1?e<=4?Math.sqrt(2)/2:.6:r,s=t?1:0;for(let u=0,p=e;u<p;++u){const m=(u*2+s)/e*Math.PI;n[u*3]=Math.cos(m)*i,n[u*3+1]=Math.sin(m)*i,n[u*3+2]=0}return n}function nr(e,t,r){return e=Cn(Math.round(e),0,16777215)+1,t[r+2]=e%256,e=Math.floor(e/256),t[r+1]=e%256,e=Math.floor(e/256),t[r]=e%256,t}function ci(e,t,r){return Math.floor(e)*256*256+Math.floor(t)*256+Math.floor(r)-1}const mr=255/256,qr=T.create(256*256*256,256*256,256),sf=se.create(mr/qr[0],mr/qr[1],mr/qr[2],mr/1),ha=se();function Sl(e,t,r,n){return se.set(ha,e/255,t/255,r/255,n/255),se.dot(ha,sf)}function uf(e,t){let r=-1/0;for(let n=0,i=e.length;n<i;n+=t){const s=ci(e[n],e[n+1],e[n+2]);s>r&&(r=s)}return r}function ar(e,t,r,n){switch(Jt.getGranularity(e,r.granularity)){case"uniform":return lf(e,r.size,n);case"instance":return mf(e,r.size,n);case"group":return pf(e,r.size,n);case"groupInstance":return gf(e,r.size,n);case"vertex":return vf(t,r.size,n);case"vertexInstance":return hf(t,r.size,n)}}const jt=100;function Zt(e){switch(e.dSizeType.ref.value){case"uniform":return e.uSize.ref.value;case"instance":case"group":case"groupInstance":case"vertex":case"vertexInstance":let r=0;const n=e.tSize.ref.value.array;for(let i=0,s=n.length;i<s;i+=3){const u=ci(n[i],n[i+1],n[i+2]);r<u&&(r=u)}return r/jt}}const cf={array:new Uint8Array(3),width:1,height:1};function ff(){return{tSize:a.create(cf),uSizeTexDim:a.create(ae.create(1,1))}}function df(e,t){return t?(a.update(t.uSize,e),a.updateIfChanged(t.dSizeType,"uniform"),t):{uSize:a.create(e),...ff(),dSizeType:a.create("uniform")}}function lf(e,t,r){e.reset();const n=e.hasNext?e.move().location:Ye;return df(t(n),r)}function ir(e,t,r){return r?(a.update(r.tSize,e),a.update(r.uSizeTexDim,ae.create(e.width,e.height)),a.updateIfChanged(r.dSizeType,t),r):{uSize:a.create(0),tSize:a.create(e),uSizeTexDim:a.create(ae.create(e.width,e.height)),dSizeType:a.create(t)}}function mf(e,t,r){const{instanceCount:n}=e,i=Te(Math.max(1,n),3,Uint8Array,r&&r.tSize.ref.value.array);for(e.reset();e.hasNext&&!e.isNextNewInstance;){const s=e.move();nr(t(s.location)*jt,i.array,s.instanceIndex*3),e.skipInstance()}return ir(i,"instance",r)}function pf(e,t,r){const{groupCount:n}=e,i=Te(Math.max(1,n),3,Uint8Array,r&&r.tSize.ref.value.array);for(e.reset();e.hasNext&&!e.isNextNewInstance;){const s=e.move();nr(t(s.location)*jt,i.array,s.groupIndex*3)}return ir(i,"group",r)}function gf(e,t,r){const{groupCount:n,instanceCount:i}=e,s=i*n,u=Te(Math.max(1,s),3,Uint8Array,r&&r.tSize.ref.value.array);for(e.reset();e.hasNext;){const p=e.move();nr(t(p.location)*jt,u.array,p.index*3)}return ir(u,"groupInstance",r)}function vf(e,t,r){const{groupCount:n}=e,i=Te(Math.max(1,n),3,Uint8Array,r&&r.tSize.ref.value.array);for(e.reset();e.hasNext;){const s=e.move();nr(t(s.location)*jt,i.array,s.index*3)}return ir(i,"vertex",r)}function hf(e,t,r){const{groupCount:n,instanceCount:i}=e,s=i*n,u=Te(Math.max(1,s),3,Uint8Array,r&&r.tSize.ref.value.array);for(e.reset();e.hasNext;){const p=e.move();nr(t(p.location)*jt,u.array,p.index*3)}return ir(u,"vertexInstance",r)}var ln;(function(e){function t(c,o,d,g){return g?s(c,o,d,g):i(c,o,d)}e.create=t;function r(c){const o=c?c.centerBuffer.ref.value:new Float32Array(0),d=c?c.groupBuffer.ref.value:new Float32Array(0);return t(o,d,0,c)}e.createEmpty=r;function n(c){return it([c.pointCount,c.centerBuffer.ref.version,c.groupBuffer.ref.version])}function i(c,o,d){const g=q();let _,l=-1,b=-1;const I={kind:"points",pointCount:d,centerBuffer:a.create(c),groupBuffer:a.create(o),get boundingSphere(){const C=n(I);if(C!==l){const A=Et(I.centerBuffer.ref.value,I.pointCount,1);q.copy(g,A),l=C}return g},get groupMapping(){return I.groupBuffer.ref.version!==b&&(_=kt(I.groupBuffer.ref.value,I.pointCount),b=I.groupBuffer.ref.version),_},setBoundingSphere(C){q.copy(g,C),l=n(I)},hasBoundingSphere(){return l===n(I)}};return I}function s(c,o,d,g){return g.pointCount=d,a.update(g.centerBuffer,c),a.update(g.groupBuffer,o),g}function u(c,o){const d=c.centerBuffer.ref.value;Gt(o,d,0,c.pointCount),a.update(c.centerBuffer,d)}e.transform=u,e.StyleTypes={square:"Square",circle:"Circle",fuzzy:"Fuzzy"},e.StyleTypeNames=Object.keys(e.StyleTypes),e.Params={...X.Params,sizeFactor:k.Numeric(3,{min:0,max:10,step:.1}),pointSizeAttenuation:k.Boolean(!1),pointStyle:k.Select("square",k.objectToOptions(e.StyleTypes)),animation:Vt()},e.Utils={Params:e.Params,createEmpty:r,createValues:m,createValuesSimple:v,updateValues:h,updateBoundingSphere:y,createRenderableState:x,updateRenderableState:f,createPositionIterator:p};function p(c,o){const d=c.pointCount,g=o.instanceCount.ref.value,_=At(),l=_.position,b=c.centerBuffer.ref.value,I=o.aTransform.ref.value;return We(d,g,1,(A,D)=>(D<0?T.fromArray(l,b,A*3):T.transformMat4Offset(l,b,I,0,A*3,D*16),_))}function m(c,o,d,g,_){const{instanceCount:l,groupCount:b}=d,I=p(c,o),C=st(d,I,g.color),A=ar(d,I,g.size),D=_.instanceGranularity?Ae(l,"instance"):Ae(l*b,"groupInstance"),w=ut(),R=ct(),S=lt(),E=dt(),B=ft(),L=mt(),F={drawCount:c.pointCount,vertexCount:c.pointCount,groupCount:b,instanceCount:l},O=q.clone(c.boundingSphere),N=Ie(O,o.aTransform.ref.value,l,0);return{dGeometryType:a.create("points"),aPosition:c.centerBuffer,aGroup:c.groupBuffer,boundingSphere:a.create(N),invariantBoundingSphere:a.create(O),uInvariantBoundingSphere:a.create(se.ofSphere(O)),...C,...A,...D,...w,...R,...S,...E,...B,...L,...o,...X.createValues(_,F),uSizeFactor:a.create(_.sizeFactor),dPointSizeAttenuation:a.create(_.pointSizeAttenuation),dPointStyle:a.create(_.pointStyle),...zt(_.animation)}}function v(c,o,d,g,_){const l=X.createSimple(d,g,_),b={...k.getDefaultValues(e.Params),...o};return m(c,l.transform,l.locationIterator,l.theme,b)}function h(c,o){X.updateValues(c,o),a.updateIfChanged(c.uSizeFactor,o.sizeFactor),a.updateIfChanged(c.dPointSizeAttenuation,o.pointSizeAttenuation),a.updateIfChanged(c.dPointStyle,o.pointStyle),Ut(c,o.animation)}function y(c,o){const d=q.clone(o.boundingSphere),g=Ie(d,c.aTransform.ref.value,c.instanceCount.ref.value,0);q.equals(g,c.boundingSphere.ref.value)||a.update(c.boundingSphere,g),q.equals(d,c.invariantBoundingSphere.ref.value)||(a.update(c.invariantBoundingSphere,d),a.update(c.uInvariantBoundingSphere,se.fromSphere(c.uInvariantBoundingSphere.ref.value,d)))}function x(c){const o=X.createRenderableState(c);return f(o,c),o}function f(c,o){X.updateRenderableState(c,o),c.opaque=c.opaque&&o.pointStyle!=="fuzzy",c.writeDepth=c.opaque}})(ln||(ln={}));function ba(e,t,r,n,i,s,u){for(let p=0;p<t;p++){for(let m=0;m<r;m++)n[m]=e[m*t+p];ya(n,i,s,u,r);for(let m=0;m<r;m++)e[m*t+p]=i[m]}for(let p=0;p<r;p++){for(let m=0;m<t;m++)n[m]=e[p*t+m];ya(n,i,s,u,t);for(let m=0;m<t;m++)e[p*t+m]=Math.sqrt(i[m])}}function ya(e,t,r,n,i){r[0]=0,n[0]=Number.MIN_SAFE_INTEGER,n[1]=Number.MAX_SAFE_INTEGER;for(let s=1,u=0;s<i;s++){let p=(e[s]+s*s-(e[r[u]]+r[u]*r[u]))/(2*s-2*r[u]);for(;p<=n[u];)u--,p=(e[s]+s*s-(e[r[u]]+r[u]*r[u]))/(2*s-2*r[u]);u++,r[u]=s,n[u]=p,n[u+1]=Number.MAX_SAFE_INTEGER}for(let s=0,u=0;s<i;s++){for(;n[u+1]<s;)u++;t[s]=(s-r[u])*(s-r[u])+e[r[u]]}}const Wr={};function El(e){const t=JSON.stringify(e);return Wr[t]===void 0&&(Wr[t]=new bf(e)),Wr[t]}const fi={fontFamily:k.Select("sans-serif",[["sans-serif","Sans Serif"],["monospace","Monospace"],["serif","Serif"],["cursive","Cursive"]]),fontQuality:k.Select(3,[[0,"lower"],[1,"low"],[2,"medium"],[3,"high"],[4,"higher"]]),fontStyle:k.Select("normal",[["normal","Normal"],["italic","Italic"],["oblique","Oblique"]]),fontVariant:k.Select("normal",[["normal","Normal"],["small-caps","Small Caps"]]),fontWeight:k.Select("normal",[["normal","Normal"],["bold","Bold"]])};class bf{constructor(t={}){this.mapped={},this.scratchW=0,this.scratchH=0,this.currentX=0,this.currentY=0,this.cutoff=.5;const r={...k.getDefaultValues(fi),...t};this.props=r;const n=64*(r.fontQuality+1);this.buffer=n/8,this.radius=n/3,this.lineHeight=Math.round(n+2*this.buffer+this.radius),this.maxWidth=Math.round(this.lineHeight*.75),this.texture=Te(350*this.lineHeight*this.maxWidth,1,Uint8Array),this.scratchContext=_f(this.maxWidth,this.lineHeight,{willReadFrequently:!0}),this.scratchContext.font=`${r.fontStyle} ${r.fontVariant} ${r.fontWeight} ${n}px ${r.fontFamily}`,this.scratchContext.fillStyle="black",this.scratchContext.textBaseline="middle",this.scratchData=new Uint8Array(this.lineHeight*this.maxWidth),this.gridOuter=new Float64Array(this.lineHeight*this.maxWidth),this.gridInner=new Float64Array(this.lineHeight*this.maxWidth),this.f=new Float64Array(Math.max(this.lineHeight,this.maxWidth)),this.d=new Float64Array(Math.max(this.lineHeight,this.maxWidth)),this.z=new Float64Array(Math.max(this.lineHeight,this.maxWidth)+1),this.v=new Int16Array(Math.max(this.lineHeight,this.maxWidth)),this.middle=Math.ceil(this.lineHeight/2),this.placeholder=this.get("�")}get(t){if(this.mapped[t]===void 0){this.draw(t);const{array:r,width:n,height:i}=this.texture,s=this.scratchData;if(this.currentX+this.scratchW>n&&(this.currentX=0,this.currentY+=this.scratchH),this.currentY+this.scratchH>i)return console.warn("canvas to small"),this.placeholder;this.mapped[t]={x:this.currentX,y:this.currentY,w:this.scratchW,h:this.scratchH,nw:this.scratchW/this.lineHeight,nh:this.scratchH/this.lineHeight};for(let u=0;u<this.scratchH;++u)for(let p=0;p<this.scratchW;++p)r[n*(this.currentY+u)+this.currentX+p]=s[u*this.scratchW+p];this.currentX+=this.scratchW}return this.mapped[t]}draw(t){const r=this.lineHeight,n=this.scratchContext,i=this.scratchData,s=n.measureText(t),u=Math.min(this.maxWidth,Math.ceil(s.width+2*this.buffer)),p=u*r;n.clearRect(0,0,u,r),n.fillText(t,this.buffer,this.middle);const m=n.getImageData(0,0,u,r);for(let v=0;v<p;v++){const h=m.data[v*4+3]/255;this.gridOuter[v]=h===1?0:h===0?Number.MAX_SAFE_INTEGER:Math.pow(Math.max(0,.5-h),2),this.gridInner[v]=h===1?Number.MAX_SAFE_INTEGER:h===0?0:Math.pow(Math.max(0,h-.5),2)}ba(this.gridOuter,u,r,this.f,this.d,this.v,this.z),ba(this.gridInner,u,r,this.f,this.d,this.v,this.z);for(let v=0;v<p;v++){const h=this.gridOuter[v]-this.gridInner[v];i[v]=Math.max(0,Math.min(255,Math.round(255-255*(h/this.radius+this.cutoff))))}this.scratchW=u,this.scratchH=r}}function yf(){throw new Error("When running in Node.js and wanting to use Canvas API, call mol-util/data-source's setCanvasModule function first and pass imported `canvas` module to it.")}function _f(e,t,r){if(Si)return yf().createCanvas(e,t).getContext("2d",r);{const n=document.createElement("canvas");return n.width=e,n.height=t,n.getContext("2d",r)}}var mn;(function(e){function t(f,c,o,d,g,_,l,b,I){return I?s(f,c,o,d,g,_,l,b,I):i(f,c,o,d,g,_,l,b)}e.create=t;function r(f){const c=f?f.fontTexture.ref.value:Te(0,1,Uint8Array),o=f?f.centerBuffer.ref.value:new Float32Array(0),d=f?f.mappingBuffer.ref.value:new Float32Array(0),g=f?f.depthBuffer.ref.value:new Float32Array(0),_=f?f.indexBuffer.ref.value:new Uint32Array(0),l=f?f.groupBuffer.ref.value:new Float32Array(0),b=f?f.tcoordBuffer.ref.value:new Float32Array(0);return t(c,o,d,g,_,l,b,0,f)}e.createEmpty=r;function n(f){return it([f.charCount,f.fontTexture.ref.version,f.centerBuffer.ref.version,f.mappingBuffer.ref.version,f.depthBuffer.ref.version,f.indexBuffer.ref.version,f.groupBuffer.ref.version,f.tcoordBuffer.ref.version])}function i(f,c,o,d,g,_,l,b){const I=q();let C,A=-1,D=-1;const w={kind:"text",charCount:b,fontTexture:a.create(f),centerBuffer:a.create(c),mappingBuffer:a.create(o),depthBuffer:a.create(d),indexBuffer:a.create(g),groupBuffer:a.create(_),tcoordBuffer:a.create(l),get boundingSphere(){const R=n(w);if(R!==A){const S=Et(w.centerBuffer.ref.value,w.charCount*4,4);q.copy(I,S),A=R}return I},get groupMapping(){return w.groupBuffer.ref.version!==D&&(C=kt(w.groupBuffer.ref.value,w.charCount,4),D=w.groupBuffer.ref.version),C},setBoundingSphere(R){q.copy(I,R),A=n(w)},hasBoundingSphere(){return A===n(w)}};return w}function s(f,c,o,d,g,_,l,b,I){return I.charCount=b,a.update(I.fontTexture,f),a.update(I.centerBuffer,c),a.update(I.mappingBuffer,o),a.update(I.depthBuffer,d),a.update(I.indexBuffer,g),a.update(I.groupBuffer,_),a.update(I.tcoordBuffer,l),I}e.Params={...X.Params,...fi,sizeFactor:k.Numeric(1,{min:0,max:10,step:.1}),borderWidth:k.Numeric(0,{min:0,max:.5,step:.01}),borderColor:k.Color(Qt.grey),offsetX:k.Numeric(0,{min:0,max:10,step:.1}),offsetY:k.Numeric(0,{min:0,max:10,step:.1}),offsetZ:k.Numeric(0,{min:0,max:10,step:.1}),background:k.Boolean(!1),backgroundMargin:k.Numeric(.2,{min:0,max:1,step:.01}),backgroundColor:k.Color(Qt.grey),backgroundOpacity:k.Numeric(1,{min:0,max:1,step:.01}),tether:k.Boolean(!1),tetherLength:k.Numeric(1,{min:0,max:5,step:.1}),tetherBaseWidth:k.Numeric(.3,{min:0,max:1,step:.01}),attachment:k.Select("middle-center",[["bottom-left","bottom-left"],["bottom-center","bottom-center"],["bottom-right","bottom-right"],["middle-left","middle-left"],["middle-center","middle-center"],["middle-right","middle-right"],["top-left","top-left"],["top-center","top-center"],["top-right","top-right"]])},e.Utils={Params:e.Params,createEmpty:r,createValues:p,createValuesSimple:m,updateValues:v,updateBoundingSphere:h,createRenderableState:y,updateRenderableState:x,createPositionIterator:u};function u(f,c){const o=f.charCount*4,d=c.instanceCount.ref.value,g=At(),_=g.position,l=f.centerBuffer.ref.value,b=c.aTransform.ref.value;return We(o,d,4,(C,A)=>(A<0?T.fromArray(_,l,C*3):T.transformMat4Offset(_,l,b,0,C*3,A*16),g))}function p(f,c,o,d,g){const{instanceCount:_,groupCount:l}=o,b=u(f,c),I=st(o,b,d.color),C=ar(o,b,d.size),A=g.instanceGranularity?Ae(_,"instance"):Ae(_*l,"groupInstance"),D=ut(),w=ct(),R=lt(),S=dt(),E=ft(),B=mt(),L={drawCount:f.charCount*2*3,vertexCount:f.charCount*4,groupCount:l,instanceCount:_},F=Zt(C)*g.sizeFactor,O=_a(f.mappingBuffer.ref.value,f.depthBuffer.ref.value,f.charCount,F),N=q.expand(q(),f.boundingSphere,O),z=Ie(N,c.aTransform.ref.value,_,0);return{dGeometryType:a.create("text"),aPosition:f.centerBuffer,aMapping:f.mappingBuffer,aDepth:f.depthBuffer,aGroup:f.groupBuffer,elements:f.indexBuffer,boundingSphere:a.create(z),invariantBoundingSphere:a.create(N),uInvariantBoundingSphere:a.create(se.ofSphere(N)),...I,...C,...A,...D,...w,...R,...S,...E,...B,...c,aTexCoord:f.tcoordBuffer,tFont:f.fontTexture,padding:a.create(O),...X.createValues(g,L),uSizeFactor:a.create(g.sizeFactor),uBorderWidth:a.create(Cn(g.borderWidth,0,.5)),uBorderColor:a.create(he.toArrayNormalized(g.borderColor,T.zero(),0)),uOffsetX:a.create(g.offsetX),uOffsetY:a.create(g.offsetY),uOffsetZ:a.create(g.offsetZ),uBackgroundColor:a.create(he.toArrayNormalized(g.backgroundColor,T.zero(),0)),uBackgroundOpacity:a.create(g.backgroundOpacity)}}function m(f,c,o,d,g){const _=X.createSimple(o,d,g),l={...k.getDefaultValues(e.Params),...c};return p(f,_.transform,_.locationIterator,_.theme,l)}function v(f,c){X.updateValues(f,c),a.updateIfChanged(f.uSizeFactor,c.sizeFactor),a.updateIfChanged(f.uBorderWidth,c.borderWidth),he.fromNormalizedArray(f.uBorderColor.ref.value,0)!==c.borderColor&&(he.toArrayNormalized(c.borderColor,f.uBorderColor.ref.value,0),a.update(f.uBorderColor,f.uBorderColor.ref.value)),a.updateIfChanged(f.uOffsetX,c.offsetX),a.updateIfChanged(f.uOffsetY,c.offsetY),a.updateIfChanged(f.uOffsetZ,c.offsetZ),he.fromNormalizedArray(f.uBackgroundColor.ref.value,0)!==c.backgroundColor&&(he.toArrayNormalized(c.backgroundColor,f.uBackgroundColor.ref.value,0),a.update(f.uBackgroundColor,f.uBackgroundColor.ref.value)),a.updateIfChanged(f.uBackgroundOpacity,c.backgroundOpacity)}function h(f,c){const o=Zt(f)*f.uSizeFactor.ref.value,d=_a(f.aMapping.ref.value,f.aDepth.ref.value,c.charCount,o),g=q.expand(q(),c.boundingSphere,d),_=Ie(g,f.aTransform.ref.value,f.instanceCount.ref.value,0);q.equals(_,f.boundingSphere.ref.value)||a.update(f.boundingSphere,_),q.equals(g,f.invariantBoundingSphere.ref.value)||(a.update(f.invariantBoundingSphere,g),a.update(f.uInvariantBoundingSphere,se.fromSphere(f.uInvariantBoundingSphere.ref.value,g))),a.update(f.padding,d)}function y(f){const c=X.createRenderableState(f);return x(c,f),c}function x(f,c){X.updateRenderableState(f,c),f.pickable=!1,f.opaque=!1,f.writeDepth=!0}})(mn||(mn={}));function _a(e,t,r,n){let i=0,s=0,u=0;for(let p=0,m=r*4;p<m;++p){const v=2*p,h=Math.abs(e[v]);h>i&&(i=h);const y=Math.abs(e[v+1]);y>s&&(s=y);const x=Math.abs(t[p]);x>u&&(u=x)}return Math.max(u,n*Math.sqrt(i*i+s*s))}const Ct=J.add,pr=J.add2,Me=J.add3,Pe=T(),He=T(),Xt=T();var pn;(function(e){function t(r=2048,n=1024,i){const s=J.create(Float32Array,1,n,i?i.groupBuffer.ref.value:r),u=J.create(Float32Array,3,n,i?i.startBuffer.ref.value:r),p=J.create(Float32Array,3,n,i?i.endBuffer.ref.value:r),m=(y,x,f,c,o,d,g)=>{for(let _=0;_<4;++_)Me(u,y,x,f),Me(p,c,o,d),Ct(s,g)},v=(y,x,f)=>{for(let c=0;c<4;++c)Me(u,y[0],y[1],y[2]),Me(p,x[0],x[1],x[2]),Ct(s,f)},h=(y,x,f,c)=>{const o=T.distance(y,x),d=f%2!==0,g=Math.floor((f+1)/2),_=o/(f+.5);T.setMagnitude(Xt,T.sub(Xt,x,y),_),T.copy(Pe,y);for(let l=0;l<g;++l)T.add(Pe,Pe,Xt),d&&l===g-1?T.copy(He,x):T.add(He,Pe,Xt),m(Pe[0],Pe[1],Pe[2],He[0],He[1],He[2],c),T.add(Pe,Pe,Xt)};return{add:m,addVec:v,addFixedCountDashes:h,addFixedLengthDashes:(y,x,f,c)=>{const o=T.distance(y,x);h(y,x,o/f,c)},addCage:(y,x,f)=>{const{vertices:c,edges:o}=x;for(let d=0,g=o.length;d<g;d+=2)T.fromArray(Pe,c,o[d]*3),T.fromArray(He,c,o[d+1]*3),T.transformMat4(Pe,Pe,y),T.transformMat4(He,He,y),m(Pe[0],Pe[1],Pe[2],He[0],He[1],He[2],f)},getLines:()=>{const y=s.elementCount/4,x=s.elementCount,f=J.compact(s,!0),c=J.compact(u,!0),o=J.compact(p,!0),d=i&&y<=i.lineCount&&i.stripCount.ref.value===0?i.mappingBuffer.ref.value:new Float32Array(y*8),g=i&&y<=i.lineCount&&i.stripCount.ref.value===0?i.indexBuffer.ref.value:new Uint32Array(y*6),_=i?i.stripBuffer.ref.value:new Uint32Array(0);return(!i||y>i.lineCount||i.stripCount.ref.value>0)&&Tf(y,d,g),Kt.create(d,g,f,c,o,_,y,x,0,i)}}}e.create=t})(pn||(pn={}));function Tf(e,t,r){for(let n=0;n<e;++n){const i=n*8;t[i]=-1,t[i+1]=-1,t[i+2]=1,t[i+3]=-1,t[i+4]=-1,t[i+5]=1,t[i+6]=1,t[i+7]=1}for(let n=0;n<e;++n){const i=n*4,s=n*6;r[s]=i,r[s+1]=i+1,r[s+2]=i+2,r[s+3]=i+1,r[s+4]=i+3,r[s+5]=i+2}}var Ta;(function(e){function t(r=2048,n=1024,i){const s=J.create(Float32Array,1,n,i?i.groupBuffer.ref.value:r),u=J.create(Float32Array,3,n,i?i.startBuffer.ref.value:r),p=J.create(Float32Array,3,n,i?i.endBuffer.ref.value:r),m=J.create(Float32Array,2,n,i?i.mappingBuffer.ref.value:r),v=J.create(Uint32Array,3,n,i?i.indexBuffer.ref.value:r),h=J.create(Uint32Array,1,n,i?i.stripBuffer.ref.value:r);let y=0,x=0,f=0,c=0,o=0,d=0;const g=(_,l,b)=>{if(x===0){f=s.elementCount,c=_,o=l,d=b,x=1;return}const I=s.elementCount;x===1&&(Me(u,c,o,d),Me(p,_,l,b),Ct(s,y),pr(m,-1,-1),Me(u,c,o,d),Me(p,_,l,b),Ct(s,y),pr(m,1,-1)),Me(u,c,o,d),Me(p,_,l,b),Ct(s,y),pr(m,-1,1),Me(u,c,o,d),Me(p,_,l,b),Ct(s,y),pr(m,1,1);const C=x===1?f:I-2,A=x===1?I+2:I;Me(v,C,C+1,A),Me(v,C+1,A+1,A),c=_,o=l,d=b,x++};return{start:_=>{y=_,x=0,h.elementCount===0&&Ct(h,0)},add:(_,l,b)=>{g(_,l,b)},addVec:_=>{g(_[0],_[1],_[2])},end:()=>{x=0,Ct(h,s.elementCount)},getLines:()=>{const _=v.elementCount/2,l=s.elementCount,b=h.elementCount-1,I=J.compact(s,!0),C=J.compact(u,!0),A=J.compact(p,!0),D=J.compact(m,!0),w=J.compact(v,!0),R=J.compact(h,!0);return Kt.create(D,w,I,C,A,R,_,l,b,i)}}}e.create=t})(Ta||(Ta={}));var Kt;(function(e){function t(f,c,o,d,g,_,l,b,I,C){return C?u(f,c,o,d,g,_,l,b,I,C):s(f,c,o,d,g,_,l,b,I)}e.create=t;function r(f){const c=f?f.mappingBuffer.ref.value:new Float32Array(0),o=f?f.indexBuffer.ref.value:new Uint32Array(0),d=f?f.groupBuffer.ref.value:new Float32Array(0),g=f?f.startBuffer.ref.value:new Float32Array(0),_=f?f.endBuffer.ref.value:new Float32Array(0),l=f?f.stripBuffer.ref.value:new Uint32Array(0);return t(c,o,d,g,_,l,0,0,0,f)}e.createEmpty=r;function n(f,c){const o=f.vertexBuffer.ref.value,d=f.indexBuffer.ref.value,g=f.groupBuffer.ref.value,_=pn.create(f.triangleCount*3,f.triangleCount/10,c);for(let l=0,b=f.triangleCount*3;l<b;l+=3){const I=d[l],C=d[l+1],A=d[l+2],D=o[I*3],w=o[I*3+1],R=o[I*3+2],S=o[C*3],E=o[C*3+1],B=o[C*3+2],L=o[A*3],F=o[A*3+1],O=o[A*3+2];_.add(D,w,R,S,E,B,g[I]),_.add(D,w,R,L,F,O,g[I]),_.add(S,E,B,L,F,O,g[C])}return _.getLines()}e.fromMesh=n;function i(f){return it([f.lineCount,f.vertexCount,f.mappingBuffer.ref.version,f.indexBuffer.ref.version,f.groupBuffer.ref.version,f.startBuffer.ref.version,f.endBuffer.ref.version,f.stripCount.ref.version,f.stripBuffer.ref.version])}function s(f,c,o,d,g,_,l,b,I){const C=q();let A,D=-1,w=-1;const R={kind:"lines",lineCount:l,vertexCount:b,mappingBuffer:a.create(f),indexBuffer:a.create(c),groupBuffer:a.create(o),startBuffer:a.create(d),endBuffer:a.create(g),stripCount:a.create(I),stripBuffer:a.create(_),get boundingSphere(){const S=i(R);if(S!==D){const E=Et(R.startBuffer.ref.value,R.lineCount*4,4),B=Et(R.endBuffer.ref.value,R.lineCount*4,4);q.expandBySphere(C,E,B),D=S}return C},get groupMapping(){return R.groupBuffer.ref.version!==w&&(A=kt(R.groupBuffer.ref.value,R.lineCount,4),w=R.groupBuffer.ref.version),A},setBoundingSphere(S){q.copy(C,S),D=i(R)},hasBoundingSphere(){return D===i(R)}};return R}function u(f,c,o,d,g,_,l,b,I,C){return(l>C.lineCount||I!==C.stripCount.ref.value||I>0)&&(a.update(C.mappingBuffer,f),a.update(C.indexBuffer,c)),C.lineCount=l,C.vertexCount=b,a.update(C.groupBuffer,o),a.update(C.startBuffer,d),a.update(C.endBuffer,g),a.updateIfChanged(C.stripCount,I),a.update(C.stripBuffer,_),C}function p(f,c){const o=f.startBuffer.ref.value;Gt(c,o,0,f.vertexCount),a.update(f.startBuffer,o);const d=f.endBuffer.ref.value;Gt(c,d,0,f.vertexCount),a.update(f.endBuffer,d)}e.transform=p,e.Params={...X.Params,sizeFactor:k.Numeric(2,{min:0,max:10,step:.1}),lineSizeAttenuation:k.Boolean(!1),animation:Vt()},e.Utils={Params:e.Params,createEmpty:r,createValues:v,createValuesSimple:h,updateValues:y,updateBoundingSphere:x,createRenderableState:X.createRenderableState,updateRenderableState:X.updateRenderableState,createPositionIterator:m};function m(f,c){const o=f.lineCount*4,d=c.instanceCount.ref.value,g=At(),_=g.position,l=f.startBuffer.ref.value,b=f.endBuffer.ref.value,I=c.aTransform.ref.value;return We(o,d,2,(A,D)=>{const w=A%4===0?l:b;return D<0?T.fromArray(_,w,A*3):T.transformMat4Offset(_,w,I,0,A*3,D*16),g})}function v(f,c,o,d,g){const{instanceCount:_,groupCount:l}=o,b=m(f,c),I=st(o,b,d.color),C=ar(o,b,d.size),A=g.instanceGranularity?Ae(_,"instance"):Ae(_*l,"groupInstance"),D=ut(),w=ct(),R=lt(),S=dt(),E=ft(),B=mt(),L={drawCount:f.lineCount*2*3,vertexCount:f.vertexCount,groupCount:l,instanceCount:_},F=q.clone(f.boundingSphere),O=Ie(F,c.aTransform.ref.value,_,0);return{dGeometryType:a.create("lines"),aMapping:f.mappingBuffer,aGroup:f.groupBuffer,aStart:f.startBuffer,aEnd:f.endBuffer,elements:f.indexBuffer,boundingSphere:a.create(O),invariantBoundingSphere:a.create(F),uInvariantBoundingSphere:a.create(se.ofSphere(F)),...I,...C,...A,...D,...w,...R,...S,...E,...B,...c,...X.createValues(g,L),uSizeFactor:a.create(g.sizeFactor),dLineSizeAttenuation:a.create(g.lineSizeAttenuation),uDoubleSided:a.create(!0),dFlipSided:a.create(!1),...zt(g.animation),stripCount:f.stripCount,stripOffsets:f.stripBuffer}}function h(f,c,o,d,g){const _=X.createSimple(o,d,g),l={...k.getDefaultValues(e.Params),...c};return v(f,_.transform,_.locationIterator,_.theme,l)}function y(f,c){X.updateValues(f,c),a.updateIfChanged(f.uSizeFactor,c.sizeFactor),a.updateIfChanged(f.dLineSizeAttenuation,c.lineSizeAttenuation),Ut(f,c.animation)}function x(f,c){const o=q.clone(c.boundingSphere),d=Ie(o,f.aTransform.ref.value,f.instanceCount.ref.value,0);q.equals(d,f.boundingSphere.ref.value)||a.update(f.boundingSphere,d),q.equals(o,f.invariantBoundingSphere.ref.value)||(a.update(f.invariantBoundingSphere,o),a.update(f.uInvariantBoundingSphere,se.fromSphere(f.uInvariantBoundingSphere.ref.value,o)))}})(Kt||(Kt={}));const et=T(),tt=T(),rt=T(),Lt=T(),_e=of(4,!0);function di(e){const n=ui(12,e?36:24);for(let i=0;i<4;++i){const s=(i+1)%4;T.set(et,_e[i*3],_e[i*3+1],-.5),T.set(tt,_e[s*3],_e[s*3+1],-.5),T.set(rt,_e[s*3],_e[s*3+1],.5),T.set(Lt,_e[i*3],_e[i*3+1],.5),e?n.add(et,tt,rt):n.addQuad(et,tt,rt,Lt)}return T.set(et,_e[0],_e[1],-.5),T.set(tt,_e[3],_e[4],-.5),T.set(rt,_e[6],_e[7],-.5),T.set(Lt,_e[9],_e[10],-.5),e?n.add(rt,tt,et):n.addQuad(Lt,rt,tt,et),T.set(et,_e[0],_e[1],.5),T.set(tt,_e[3],_e[4],.5),T.set(rt,_e[6],_e[7],.5),T.set(Lt,_e[9],_e[10],.5),e?n.add(et,tt,rt):n.addQuad(et,tt,rt,Lt),n.getPrimitive()}let Xr;function xf(){return Xr||(Xr=di(!1)),Xr}let Hr;function Il(){return Hr||(Hr=di(!0)),Hr}let $r;function Al(){return $r||($r=af([.5,.5,-.5,-.5,.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,-.5,.5],[0,4,1,5,2,6,3,7,0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4])),$r}function xa(e){return e.map(t=>({x:t[0],alpha:t[1]}))}function Ca(e,t){const r=[{x:0,alpha:0},{x:0,alpha:0},...e,{x:1,alpha:0},{x:1,alpha:0}],n=256,i=t?t.ref.value.array:new Uint8Array(n);let s=0,u,p,m,v,h,y;const x=e.length+1;for(let c=0;c<x;++c){u=r[c+1].x,p=r[c+2].x,m=r[c].alpha,v=r[c+1].alpha,h=r[c+2].alpha,y=r[c+3].alpha;const o=Math.round((p-u)*n);for(let d=0;d<o;++d){const g=d/o;i[s]=Math.max(0,Oi(m,v,h,y,g,.5)*255),++s}}const f={array:i,width:256,height:1};return t?(a.update(t,f),t):a.create(f)}function Cf(e,t,r){if(r)return Sa(e,t,r.min,r.max);{const[n,i]=Ei(e);return Sa(e,t,n,i)}}function Sa(e,t,r,n){let i=(n-r)/t;i===0&&(i=1);const s=new Int32Array(t);for(let u=0,p=e.length;u<p;u++){let m=Math.floor((e[u]-r)/i);m>=t?m=t-1:m<0&&(m=0),s[m]++}return{min:r,max:n,binWidth:i,counts:s}}const Sf=T.transformMat4,wt=T.lerp;var Oe;(function(e){e.One={transform:{kind:"matrix",matrix:ie.identity()},cells:$e.create($e.Space([1,1,1],[0,1,2]),$e.Data1([0])),stats:{min:0,max:0,mean:0,sigma:0}};const t=ie(),r=ie();function n(C){if(C.transform.kind==="matrix")return ie.copy(ie(),C.transform.matrix);if(C.transform.kind==="spacegroup"){const{cells:{space:A}}=C,D=ie.fromScaling(t,T.div(T(),ve.size(T(),C.transform.fractionalBox),T.ofArray(A.dimensions))),w=ie.fromTranslation(r,C.transform.fractionalBox.min);return ie.mul3(ie(),C.transform.cell.fromFractional,w,D)}return ie.identity()}e.getGridToCartesianTransform=n;function i(C,A){return C===A}e.areEquivalent=i;function s(C){return C.cells.data.length===0}e.isEmpty=s;function u(C,A){A||(A=q());const D=C.cells.space.dimensions,w=e.getGridToCartesianTransform(C);return q.fromDimensionsAndTransform(A,D,w)}e.getBoundingSphere=u;function p(C,A){let D=C._historams;return D||(D=C._historams={}),D[A]||(D[A]=Cf(C.cells.data,A,{min:C.stats.min,max:C.stats.max})),D[A]}e.getHistogram=p;function m(C,A){const D=e.getGridToCartesianTransform(C);ie.invert(D,D);const w=T(),{stats:R}=C,{dimensions:S,get:E}=C.cells.space,B=C.cells.data,[L,F,O]=S,N=(V,$,H)=>E(B,V,$,H),z=C.periodicity==="xyz";return function($){Sf(w,$,D);const H=v(w,L,F,O,z,N);return Number.isNaN(H)?H:A==="relative"?(H-R.mean)/R.sigma:H}}e.makeGetTrilinearlyInterpolated=m;function v(C,A,D,w,R,S){const E=Math.trunc(C[0]),B=Math.trunc(C[1]),L=Math.trunc(C[2]);if(!R&&(E<0||E>=A||B<0||B>=D||L<0||L>=w))return Number.NaN;const F=C[0]-E,O=C[1]-B,N=C[2]-L,z=Math.min(E+1,A-1),V=Math.min(B+1,D-1),$=Math.min(L+1,w-1);let H=S(E,B,L),P=S(z,B,L),M=S(E,V,L),U=S(z,V,L);const W=Rt(Rt(H,P,F),Rt(M,U,F),O);H=S(E,B,$),P=S(z,B,$),M=S(E,V,$),U=S(z,V,$);const te=Rt(Rt(H,P,F),Rt(M,U,F),O);return Rt(W,te,N)}e.trilinearlyInterpolate=v;const h=T(),y=T(),x=T(),f=T(),c=T(),o=T(),d=T(),g=T();function _(C,A,D,w,R,S){const E=Math.trunc(C[0]),B=Math.trunc(C[1]),L=Math.trunc(C[2]);if(E<0||E>=A||B<0||B>=D||L<0||L>=w)return!1;const F=C[0]-E,O=C[1]-B,N=C[2]-L,z=Math.min(E+1,A-1),V=Math.min(B+1,D-1),$=Math.min(L+1,w-1);return R(E,B,L,h),R(z,B,L,y),R(E,V,L,x),R(z,V,L,f),wt(c,h,y,F),wt(o,x,f,F),wt(d,c,o,O),R(E,B,$,h),R(z,B,$,y),R(E,V,$,x),R(z,V,$,f),wt(c,h,y,F),wt(o,x,f,F),wt(g,c,o,O),wt(S,d,g,N),!0}e.trilinearlyInterpolateVec3=_;function l(C){if(C._gradients)return C._gradients;const A=b(C);return C._gradients=A,A}e.getGradients=l;function b(C){const{dimensions:A,get:D,dataOffset:w}=C.cells.space,R=C.cells.data,[S,E,B]=A,L=S*E*B,F=new Float32Array(L*3);let O=1/0,N=-1/0,z=0,V=0;for(let P=0;P<B;++P)for(let M=0;M<E;++M)for(let U=0;U<S;++U){const W=w(U,M,P)*3,te=Math.max(0,U-1),j=Math.min(S-1,U+1),Q=Math.max(0,M-1),ne=Math.min(E-1,M+1),Z=Math.max(0,P-1),Y=Math.min(B-1,P+1),re=(D(R,j,M,P)-D(R,te,M,P))/(j-te||1),Ee=(D(R,U,ne,P)-D(R,U,Q,P))/(ne-Q||1),De=(D(R,U,M,Y)-D(R,U,M,Z))/(Y-Z||1);F[W]=re,F[W+1]=Ee,F[W+2]=De;const Ge=re*re+Ee*Ee+De*De;Ge<O&&(O=Ge),Ge>N&&(N=Ge),z+=Ge,V+=Ge*Ge}O===1/0&&(O=0),N===-1/0&&(N=1),O=Math.sqrt(O),N=Math.sqrt(N);const $=z/L,H=Math.sqrt(V/L);return{values:F,magnitude:{min:O,max:N,mean:$,sigma:H}}}function I(C){const{values:A}=l(C),{dimensions:D,dataOffset:w}=C.cells.space,[R,S,E]=D,B=(L,F,O,N)=>{const z=w(L,F,O)*3;N[0]=A[z],N[1]=A[z+1],N[2]=A[z+2]};return function(F,O){return _(F,R,S,E,B,O)}}e.makeGetInterpolatedGradient=I})(Oe||(Oe={}));function Dl(e,t){return Fa.create("Create Volume",async()=>{const{header:r,values:n}=e,i=$e.Space(r.dim,[0,1,2],Float64Array);let s;if(r.dataSetIds.length===0)s=n;else{const[v,h,y]=r.dim,x=(t?.dataIndex||0)+1;let f=0,c=0;s=new Float64Array(v*h*y);for(let o=0;o<v;o++)for(let d=0;d<h;d++)for(let g=0;g<y;g++)s[f++]=n[c],c+=x}const u=$e.create(i,$e.Data1(s)),p=ie.fromTranslation(ie(),r.origin),m=ie.fromBasis(ie(),r.basisX,r.basisY,r.basisZ);return ie.mul(p,p,m),{label:t?.label,entryId:t?.entryId,grid:{transform:{kind:"matrix",matrix:p},cells:u,stats:{min:Di(s),max:Tn(s),mean:Ai(s),sigma:Ii(s)}},instances:[{transform:ie.identity()}],sourceData:Ar.create(e),customProperties:new xn,_propertyData:Object.create(null),_localPropertyData:Object.create(null)}})}var Ar;(function(e){function t(n){return n?.kind==="cube"}e.is=t;function r(n){return{kind:"cube",name:n.name,data:n}}e.create=r})(Ar||(Ar={}));function Rl(e,t){return Fa.create("Create Volume",async r=>{const{volume_data_3d_info:n,volume_data_3d:i}=e,s=Ri.create(n.spacegroup_number.value(0)||"P 1",T.ofArray(n.spacegroup_cell_size.value(0)),T.scale(T.zero(),T.ofArray(n.spacegroup_cell_angles.value(0)),Math.PI/180)),u=n.axis_order.value(0),p=$e.convertToCanonicalAxisIndicesFastToSlow(u),m=p(n.sample_count.value(0)),v=$e.Space(m,$e.invertAxisOrder(u),Float32Array),h=$e.create(v,$e.Data1(i.values.toArray({array:Float32Array}))),y=T.ofArray(p(n.origin.value(0))),x=T.ofArray(p(n.dimensions.value(0)));return{label:t?.label,entryId:t?.entryId,grid:{transform:{kind:"spacegroup",cell:s,fractionalBox:ve.create(y,T.add(T.zero(),y,x))},cells:h,stats:{min:n.min_sampled.value(0),max:n.max_sampled.value(0),mean:n.mean_sampled.value(0),sigma:n.sigma_sampled.value(0)},periodicity:T.isInteger(x)?"xyz":"none"},instances:[{transform:ie.identity()}],sourceData:Dr.create(e),customProperties:new xn,_propertyData:Object.create(null),_localPropertyData:Object.create(null)}})}var Dr;(function(e){function t(n){return n?.kind==="dscif"}e.is=t;function r(n){return{kind:"dscif",name:n._name,data:n}}e.create=r})(Dr||(Dr={}));var de;(function(e){function t(l){var b,I,C,A;return((A=(C=(I=(b=l?.grid)===null||b===void 0?void 0:b.cells)===null||I===void 0?void 0:I.space)===null||C===void 0?void 0:C.dimensions)===null||A===void 0?void 0:A.length)&&l?.instances&&l?.sourceData&&l?.customProperties&&l?._propertyData&&l?._localPropertyData}e.is=t;let r;(function(l){function b(E,B,L){return wi(w(E,L).absoluteValue,w(B,L).absoluteValue,L.sigma/100)}l.areSame=b;function I(E){return{kind:"absolute",absoluteValue:E}}l.absolute=I;function C(E){return{kind:"relative",relativeValue:E}}l.relative=C;function A(E,B){return B*E.sigma+E.mean}l.calcAbsolute=A;function D(E,B){return E.sigma===0?0:(B-E.mean)/E.sigma}l.calcRelative=D;function w(E,B){return E.kind==="absolute"?E:{kind:"absolute",absoluteValue:l.calcAbsolute(B,E.relativeValue)}}l.toAbsolute=w;function R(E,B){return E.kind==="relative"?E:{kind:"relative",relativeValue:l.calcRelative(B,E.absoluteValue)}}l.toRelative=R;function S(E){return E.kind==="relative"?`${E.relativeValue.toFixed(2)} σ`:`${E.absoluteValue.toPrecision(4)}`}l.toString=S})(r=e.IsoValue||(e.IsoValue={}));function n(l,b,I){if(I==="relative")return r.relative(b);const C=r.absolute(b);if(Dr.is(l.sourceData)){const A={min:l.sourceData.data.volume_data_3d_info.min_source.value(0),max:l.sourceData.data.volume_data_3d_info.max_source.value(0),mean:l.sourceData.data.volume_data_3d_info.mean_source.value(0),sigma:l.sourceData.data.volume_data_3d_info.sigma_source.value(0)};return e.IsoValue.toRelative(C,A)}return C}e.adjustedIsoValue=n;const i={min:-1,max:1,mean:0,sigma:.1};function s(l,b){const I=b||i,{min:C,max:A,mean:D,sigma:w}=I,R=(C-D)/w,S=(A-D)/w;let E=l;return l.kind==="absolute"?l.absoluteValue<C?E=e.IsoValue.absolute(C):l.absoluteValue>A&&(E=e.IsoValue.absolute(A)):l.relativeValue<R?E=e.IsoValue.relative(R):l.relativeValue>S&&(E=e.IsoValue.relative(S)),k.Conditioned(E,{absolute:k.Converted(B=>e.IsoValue.toAbsolute(B,Oe.One.stats).absoluteValue,B=>e.IsoValue.absolute(B),k.Numeric(D,{min:C,max:A,step:Pn(w/100,2)},{immediateUpdate:!0})),relative:k.Converted(B=>e.IsoValue.toRelative(B,Oe.One.stats).relativeValue,B=>e.IsoValue.relative(B),k.Numeric(Math.min(1,S),{min:R,max:S,step:Pn(Math.round((A-C)/w)/100,2)},{immediateUpdate:!0}))},B=>B.kind==="absolute"?"absolute":"relative",(B,L)=>L==="absolute"?e.IsoValue.toAbsolute(B,I):e.IsoValue.toRelative(B,I),{isEssential:!0})}e.createIsoValueParam=s,e.IsoValueParam=s(e.IsoValue.relative(2)),e.One={label:"",grid:Oe.One,instances:[],sourceData:{kind:"",name:"",data:{}},customProperties:new xn,_propertyData:Object.create(null),_localPropertyData:Object.create(null)};function u(l,b){return Oe.areEquivalent(l.grid,b.grid)&&p(l,b)}e.areEquivalent=u;function p(l,b){if(l.instances.length!==b.instances.length)return!1;for(let I=0,C=l.instances.length;I<C;++I)if(!ie.areEqual(l.instances[I].transform,b.instances[I].transform,Ba))return!1;return!0}e.areInstanceTransformsEqual=p;function m(l){return Oe.isEmpty(l.grid)||l.instances.length===0}e.isEmpty=m;function v(l){return Ar.is(l.sourceData)?l.sourceData.data.header.orbitals:!1}e.isOrbitals=v;function h(l,b){return{kind:"volume-loci",volume:l,instances:b}}e.Loci=h;function y(l){return!!l&&l.kind==="volume-loci"}e.isLoci=y;function x(l,b){return l.volume===b.volume&&ce.areEqual(l.instances,b.instances)}e.areLociEqual=x;function f(l){return m(l.volume)||ce.isEmpty(l.instances)}e.isLociEmpty=f;const c=new $t("98");function o(l,b){const I=Oe.getBoundingSphere(l.grid);if(b||(b=q()),l.instances.length===0)return q.copy(b,I);const C=[];for(let A=0,D=l.instances.length;A<D;++A){const{transform:w}=l.instances[A];C.push(q.transform(q(),I,w))}c.reset();for(const A of C)c.includeSphere(A);c.finishedIncludeStep();for(const A of C)c.radiusSphere(A);return c.getSphere(b)}e.getBoundingSphere=o,(function(l){function b(R,S,E){return{kind:"isosurface-loci",volume:R,isoValue:S,instances:E}}l.Loci=b;function I(R){return!!R&&R.kind==="isosurface-loci"}l.isLoci=I;function C(R,S){return R.volume===S.volume&&e.IsoValue.areSame(R.isoValue,S.isoValue,R.volume.grid.stats)&&ce.areEqual(R.instances,S.instances)}l.areLociEqual=C;function A(R){return m(R.volume)||ce.isEmpty(R.instances)}l.isLociEmpty=A;const D=ve();function w(R,S,E){const B=e.IsoValue.toAbsolute(S,R.grid.stats).absoluteValue,L=B<0,F=[0,0,0],O=R.grid.cells.space.getCoords,N=R.grid.cells.data,[z,V,$]=R.grid.cells.space.dimensions;let H=z-1,P=V-1,M=$-1,U=0,W=0,te=0;for(let Q=0,ne=N.length;Q<ne;++Q)(L&&N[Q]<=B||!L&&N[Q]>=B)&&(O(Q,F),F[0]<H&&(H=F[0]),F[1]<P&&(P=F[1]),F[2]<M&&(M=F[2]),F[0]>U&&(U=F[0]),F[1]>W&&(W=F[1]),F[2]>te&&(te=F[2]));T.set(D.min,H-1,P-1,M-1),T.set(D.max,U+1,W+1,te+1);const j=Oe.getGridToCartesianTransform(R.grid);return ve.transform(D,D,j),q.fromBox3D(E||q(),D)}l.getBoundingSphere=w})(e.Isosurface||(e.Isosurface={})),(function(l){function b(F,O){return{kind:"cell-loci",volume:F,elements:O}}l.Loci=b;function I(F){return!!F&&F.kind==="cell-loci"}l.isLoci=I;function C(F,O){if(F.volume!==O.volume||F.elements.length!==O.elements.length)return!1;for(let N=0,z=F.elements.length;N<z;++N){const V=F.elements[N],$=O.elements[N];if(!ce.areEqual(V.instances,$.instances)||!ce.areEqual(V.indices,$.indices))return!1}return!0}l.areLociEqual=C;function A(F){for(const{indices:O,instances:N}of F.elements)if(!ce.isEmpty(N)||!ce.isEmpty(O))return!1;return!0}l.isLociEmpty=A;function D(F){let O=0;for(const{indices:N,instances:z}of F.elements)O+=ce.size(N)*ce.size(z);return O}l.getLociSize=D;function w(F,O,N){return{kind:"cell-location",volume:F,cell:O,instance:N}}l.Location=w;function R(F){return!!F&&F.kind==="cell-location"}l.isLocation=R;const S=new $t("98"),E=T(),B=T();function L(F,O,N){S.reset();const z=Oe.getGridToCartesianTransform(F.grid),{getCoords:V}=F.grid.cells.space;for(const{indices:H,instances:P}of O)for(let M=0,U=ce.size(H);M<U;M++){const W=ce.getAt(H,M);V(W,E),T.transformMat4(E,E,z);for(let te=0,j=ce.size(P);te<j;te++){const Q=F.instances[ce.getAt(P,te)];T.transformMat4(B,E,Q.transform),S.includePosition(B)}}S.finishedIncludeStep();for(const{indices:H,instances:P}of O)for(let M=0,U=ce.size(H);M<U;M++){const W=ce.getAt(H,M);V(W,E),T.transformMat4(E,E,z);for(let te=0,j=ce.size(P);te<j;te++){const Q=F.instances[ce.getAt(P,te)];T.transformMat4(B,E,Q.transform),S.radiusPosition(B)}}const $=S.getSphere(N);return q.expand($,$,ie.getMaxScaleOnAxis(z)*10)}l.getBoundingSphere=L})(e.Cell||(e.Cell={})),(function(l){function b(F,O){return{kind:"segment-loci",volume:F,elements:O}}l.Loci=b;function I(F){return!!F&&F.kind==="segment-loci"}l.isLoci=I;function C(F,O){if(F.volume!==O.volume||F.elements.length!==O.elements.length)return!1;for(let N=0,z=F.elements.length;N<z;++N){const V=F.elements[N],$=O.elements[N];if(!ce.areEqual(V.instances,$.instances)||!ce.areEqual(V.segments,$.segments))return!1}return!0}l.areLociEqual=C;function A(F){for(const{segments:O,instances:N}of F.elements)if(!ce.isEmpty(N)||!ce.isEmpty(O))return!1;return!0}l.isLociEmpty=A;function D(F){let O=0;for(const{segments:N,instances:z}of F.elements)O+=ce.size(N)*ce.size(z);return O}l.getLociSize=D;const w=ve(),R=ve(),S=ve();function E(F,O,N){const z=e.Segmentation.get(F);if(z){ve.setEmpty(w);const V=Oe.getGridToCartesianTransform(F.grid);for(const{segments:$,instances:H}of O){ve.setEmpty(R);for(let P=0,M=ce.size($);P<M;P++){const U=ce.getAt($,P),W=z.bounds[U];ve.add(R,W.min),ve.add(R,W.max)}ve.transform(R,R,V);for(let P=0,M=ce.size(H);P<M;P++){const U=F.instances[ce.getAt(H,P)];ve.transform(S,R,U.transform),ve.addBox3D(w,S)}}return q.fromBox3D(N||q(),w)}else return e.getBoundingSphere(F,N)}l.getBoundingSphere=E;function B(F,O,N){return{kind:"segment-location",volume:F,segment:O,instance:N}}l.Location=B;function L(F){return!!F&&F.kind==="segment-location"}l.isLocation=L})(e.Segment||(e.Segment={})),e.PickingGranularity={set(l,b){l._propertyData.__picking_granularity__=b},get(l){var b;return(b=l._propertyData.__picking_granularity__)!==null&&b!==void 0?b:"voxel"}},e.Segmentation={set(l,b){l._propertyData.__segmentation__=b},get(l){return l._propertyData.__segmentation__}};function d(l){if(!_(l))return;const b=l.parent||l;if(!b._localPropertyData.__periodicRange__){const I=T.fromArray(T(),b.grid.cells.space.dimensions,0),C=Oe.getGridToCartesianTransform(b.grid);T.transformMat4(I,I,C);const A=T.create(1/0,1/0,1/0),D=T.create(-1/0,-1/0,-1/0),w=T();for(const{transform:R}of b.instances)ie.getTranslation(w,R),T.div(w,w,I),T.round(w,w),T.min(A,A,w),T.max(D,D,w);T.addScalar(D,D,1),b._localPropertyData.__periodicRange__={min:A,max:D}}return b._localPropertyData.__periodicRange__}e.getPeriodicRange=d;function g(l){if(!_(l))return;const b=l.parent||l;if(!b._localPropertyData.__periodicInstanceMapping__){const I=new Map,C=T.fromArray(T(),b.grid.cells.space.dimensions,0),A=Oe.getGridToCartesianTransform(b.grid);T.transformMat4(C,C,A);const{min:D}=d(b),w=T();for(let S=0,E=b.instances.length;S<E;S++){const{transform:B}=b.instances[S];ie.getTranslation(w,B),T.div(w,w,C),T.round(w,w),T.sub(w,w,D),I.set(Ln(w[0],w[1],w[2]),S)}const R=T.fromArray(T(),b.grid.cells.space.dimensions,0);b._localPropertyData.__periodicInstanceMapping__={get(S,E,B){T.set(w,S,E,B),T.div(w,w,R),T.floor(w,w);const L=I.get(Ln(w[0],w[1],w[2]));if(L===void 0)return;T.set(w,S,E,B),T.mod(w,w,R);const F=b.grid.cells.space.dataOffset(w[0],w[1],w[2]);return{instance:L,cell:F}}}}return b._localPropertyData.__periodicInstanceMapping__}e.getPeriodicMapping=g;function _(l){return l.grid.periodicity==="xyz"}e.isPeriodic=_})(de||(de={}));const Yr=xf();var gn;(function(e){function t(d,g,_,l,b,I,C,A,D,w,R){return R?i(d,g,_,l,b,I,C,A,D,w,R):n(d,g,_,l,b,I,C,A,D,w)}e.create=t;function r(d){return it([d.bboxSize.ref.version,d.gridDimension.ref.version,d.gridTexture.ref.version,d.transform.ref.version,d.gridStats.ref.version])}function n(d,g,_,l,b,I,C,A,D,w){const R=q();let S=-1;const E=I.getWidth(),B=I.getHeight(),L=I.getDepth(),F={kind:"direct-volume",gridDimension:a.create(g),gridTexture:a.create(I),gridTextureDim:a.create(T.create(E,B,L)),gridStats:a.create(se.create(C.min,C.max,C.mean,C.sigma)),bboxMin:a.create(d.min),bboxMax:a.create(d.max),bboxSize:a.create(T.sub(T(),d.max,d.min)),transform:a.create(_),cellDim:a.create(b),unitToCartn:a.create(l),cartnToUnit:a.create(ie.invert(ie(),l)),get boundingSphere(){const O=r(F);if(O!==S){const N=Ef(F.gridDimension.ref.value,F.transform.ref.value);q.copy(R,N),S=O}return R},packedGroup:a.create(A),axisOrder:a.create(D),dataType:a.create(w),setBoundingSphere(O){q.copy(R,O),S=r(F)},hasBoundingSphere(){return S===r(F)},meta:{}};return F}function i(d,g,_,l,b,I,C,A,D,w,R){const S=I.getWidth(),E=I.getHeight(),B=I.getDepth();return a.update(R.gridDimension,g),a.update(R.gridTexture,I),a.update(R.gridTextureDim,T.set(R.gridTextureDim.ref.value,S,E,B)),a.update(R.gridStats,se.set(R.gridStats.ref.value,C.min,C.max,C.mean,C.sigma)),a.update(R.bboxMin,d.min),a.update(R.bboxMax,d.max),a.update(R.bboxSize,T.sub(R.bboxSize.ref.value,d.max,d.min)),a.update(R.transform,_),a.update(R.cellDim,b),a.update(R.unitToCartn,l),a.update(R.cartnToUnit,ie.invert(ie(),l)),a.updateIfChanged(R.packedGroup,A),a.updateIfChanged(R.axisOrder,T.fromArray(R.axisOrder.ref.value,D,0)),a.updateIfChanged(R.dataType,w),R}function s(d){const g=ve(),_=T(),l=ie.identity(),b=ie.identity(),I=T(),C=we(),A=Oe.One.stats,D=!1,w=T.create(0,1,2);return t(g,_,l,b,I,C,A,D,w,"byte",d)}e.createEmpty=s,e.Params={...X.Params,ignoreLight:k.Boolean(!1,X.ShadingCategory),celShaded:k.Boolean(!1,X.ShadingCategory),xrayShaded:k.Select(!1,[[!1,"Off"],[!0,"On"],["inverted","Inverted"]],X.ShadingCategory),controlPoints:k.LineGraph([ae.create(.19,0),ae.create(.2,.05),ae.create(.25,.05),ae.create(.26,0),ae.create(.79,0),ae.create(.8,.05),ae.create(.85,.05),ae.create(.86,0)],{isEssential:!0}),stepsPerCell:k.Numeric(3,{min:1,max:10,step:1}),jumpLength:k.Numeric(0,{min:0,max:20,step:.1})},e.Utils={Params:e.Params,createEmpty:s,createValues:h,createValuesSimple:y,updateValues:x,updateBoundingSphere:f,createRenderableState:c,updateRenderableState:o,createPositionIterator:u};function u(d,g){const _=d.transform.ref.value,[l,b,I]=d.gridDimension.ref.value,C=l*b*I,A=g.instanceCount.ref.value,D=At(),w=D.position,R=g.aTransform.ref.value;return We(C,A,1,(E,B)=>{const L=Math.floor(E/I);return w[0]=Math.floor(L/b),w[1]=L%b,w[2]=E%I,T.transformMat4(w,w,_),B>=0&&T.transformMat4Offset(w,w,R,0,0,B*16),D})}function p(d,g){return Math.ceil(T.magnitude(d)*g)}function m(d,g){return Math.min(...d)*(1/g)}function v(d){return 1/d}function h(d,g,_,l,b){const{gridTexture:I,gridTextureDim:C,gridStats:A}=d,{bboxSize:D,bboxMin:w,bboxMax:R,gridDimension:S,transform:E}=d,{instanceCount:B,groupCount:L}=_,F=u(d,g),O=st(_,F,l.color),N=b.instanceGranularity?Ae(B,"instance"):Ae(B*L,"groupInstance"),z=ut(),V=ct(),$=lt(),H=dt(),P=ft(),M=mt(),[U,W,te]=S.ref.value,j={drawCount:Yr.indices.length,vertexCount:U*W*te,groupCount:L,instanceCount:B},Q=q.clone(d.boundingSphere),ne=Ie(Q,g.aTransform.ref.value,B,0),Z=xa(b.controlPoints),Y=Ca(Z);return{dGeometryType:a.create("directVolume"),...O,...N,...z,...V,...$,...H,...P,...M,...g,...X.createValues(b,j),aPosition:a.create(Yr.vertices),elements:a.create(Yr.indices),boundingSphere:a.create(ne),invariantBoundingSphere:a.create(Q),uInvariantBoundingSphere:a.create(se.ofSphere(Q)),uBboxMin:w,uBboxMax:R,uBboxSize:D,uMaxSteps:a.create(p(S.ref.value,b.stepsPerCell)),uStepScale:a.create(m(d.cellDim.ref.value,b.stepsPerCell)),uJumpLength:a.create(b.jumpLength),uTransform:E,uGridDim:S,tTransferTex:Y,uTransferScale:a.create(v(b.stepsPerCell)),dGridTexType:a.create(I.ref.value.getDepth()>0?"3d":"2d"),uGridTexDim:C,tGridTex:I,uGridStats:A,uCellDim:d.cellDim,uCartnToUnit:d.cartnToUnit,uUnitToCartn:d.unitToCartn,dPackedGroup:d.packedGroup,dAxisOrder:a.create(d.axisOrder.ref.value.join("")),dIgnoreLight:a.create(b.ignoreLight),dCelShaded:a.create(b.celShaded),dXrayShaded:a.create(b.xrayShaded==="inverted"?"inverted":b.xrayShaded===!0?"on":"off"),meta:a.create(d.meta)}}function y(d,g,_,l,b){const I=X.createSimple(_,l,b),C={...k.getDefaultValues(e.Params),...g};return h(d,I.transform,I.locationIterator,I.theme,C)}function x(d,g){X.updateValues(d,g),a.updateIfChanged(d.dIgnoreLight,g.ignoreLight),a.updateIfChanged(d.dCelShaded,g.celShaded),a.updateIfChanged(d.dXrayShaded,g.xrayShaded==="inverted"?"inverted":g.xrayShaded===!0?"on":"off");const _=xa(g.controlPoints);Ca(_,d.tTransferTex),a.updateIfChanged(d.uMaxSteps,p(d.uGridDim.ref.value,g.stepsPerCell)),a.updateIfChanged(d.uStepScale,m(d.uCellDim.ref.value,g.stepsPerCell)),a.updateIfChanged(d.uTransferScale,v(g.stepsPerCell)),a.updateIfChanged(d.uJumpLength,g.jumpLength)}function f(d,g){const _=q.clone(g.boundingSphere),l=Ie(_,d.aTransform.ref.value,d.instanceCount.ref.value,0);q.equals(l,d.boundingSphere.ref.value)||a.update(d.boundingSphere,l),q.equals(_,d.invariantBoundingSphere.ref.value)||(a.update(d.invariantBoundingSphere,_),a.update(d.uInvariantBoundingSphere,se.fromSphere(d.uInvariantBoundingSphere.ref.value,_)))}function c(d){const g=X.createRenderableState(d);return g.opaque=!1,g.writeDepth=!1,g}function o(d,g){X.updateRenderableState(d,g),d.opaque=!1,d.writeDepth=!1}})(gn||(gn={}));function Ef(e,t){return q.fromDimensionsAndTransform(q(),e,t)}var vn;(function(e){function t(l,b,I,C){return C?s(l,b,I,C):i(l,b,I)}e.create=t;function r(l){const b=l?l.centerBuffer.ref.value:new Float32Array(0),I=l?l.groupBuffer.ref.value:new Float32Array(0);return t(b,I,0,l)}e.createEmpty=r;function n(l){return it([l.sphereCount,l.centerBuffer.ref.version,l.groupBuffer.ref.version])}function i(l,b,I){const C=q();let A,D=-1,w=-1;const R=a.create(Te(1,4,Float32Array)),S=a.create(ae.create(0,0)),E=a.create([]),B=a.create(0),L={kind:"spheres",sphereCount:I,centerBuffer:a.create(l),groupBuffer:a.create(b),get boundingSphere(){const F=n(L);if(F!==D){const O=Et(L.centerBuffer.ref.value,L.sphereCount,1);q.copy(C,O),D=F}return C},get groupMapping(){return L.groupBuffer.ref.version!==w&&(A=kt(L.groupBuffer.ref.value,L.sphereCount),w=L.groupBuffer.ref.version),A},setBoundingSphere(F){q.copy(C,F),D=n(L)},hasBoundingSphere(){return D===n(L)},shaderData:{positionGroup:R,texDim:S,lodLevels:E,sizeFactor:B,update(F){var O,N;const z=(O=F?.lodLevels)!==null&&O!==void 0?O:v(E.ref.value),V=(N=F?.sizeFactor)!==null&&N!==void 0?N:B.ref.value,$=y(z,V),H=Te(L.sphereCount,4,Float32Array,R.ref.value.array),P=u(H,L.centerBuffer.ref.value,L.groupBuffer.ref.value,L.sphereCount,$),M=P?m(z,V,P,L.sphereCount):[];a.update(R,H),a.update(S,ae.set(S.ref.value,H.width,H.height)),a.update(E,M),a.update(B,V)}}};return L.shaderData.update(),L}function s(l,b,I,C){return C.sphereCount=I,a.update(C.centerBuffer,l),a.update(C.groupBuffer,b),C.shaderData.update(),C}function u(l,b,I,C,A){const{array:D}=l;if(A.length===0){for(let S=0;S<C;++S)D[S*4+0]=b[S*3+0],D[S*4+1]=b[S*3+1],D[S*4+2]=b[S*3+2],D[S*4+3]=I[S];return}const w=[0];let R=0;for(let S=0,E=A.length;S<E;++S){const B=A[S];for(let L=0;L<C;++L){let F=!1;for(let O=0;O<S;++O)if(L%A[O]===0){F=!0;break}!F&&L%B===0&&(D[R*4+0]=b[L*3+0],D[R*4+1]=b[L*3+1],D[R*4+2]=b[L*3+2],D[R*4+3]=I[L],R+=1)}w.push(R*6)}return w}function p(l,b){if(l.length!==b.length)return!1;for(let I=0,C=l.length;I<C;++I)if(l[I].maxDistance!==b[I].maxDistance||l[I].minDistance!==b[I].minDistance||l[I].overlap!==b[I].overlap||l[I].stride!==b[I].stride||l[I].scaleBias!==b[I].scaleBias)return!1;return!0}function m(l,b,I,C){return l.map((A,D)=>{const w=h(A,b);return[A.minDistance,A.maxDistance,A.overlap,I[I.length-1-D],Math.pow(Math.min(C,w),1/A.scaleBias),A.stride,A.scaleBias]})}function v(l){return l.map(b=>({minDistance:b[0],maxDistance:b[1],overlap:b[2],stride:b[5],scaleBias:b[6]}))}function h(l,b){return Math.max(1,Math.round(l.stride/Math.pow(b,l.scaleBias)))}function y(l,b){return l.map(I=>h(I,b)).reverse()}e.Params={...X.Params,sizeFactor:k.Numeric(1,{min:0,max:10,step:.1}),doubleSided:k.Boolean(!1,X.CustomQualityParamInfo),ignoreLight:k.Boolean(!1,X.ShadingCategory),celShaded:k.Boolean(!1,X.ShadingCategory),xrayShaded:k.Select(!1,[[!1,"Off"],[!0,"On"],["inverted","Inverted"]],X.ShadingCategory),transparentBackfaces:k.Select("off",k.arrayToOptions(["off","on","opaque"]),X.ShadingCategory),solidInterior:k.Boolean(!0,X.ShadingCategory),clipPrimitive:k.Boolean(!1,{...X.ShadingCategory,description:"Clip whole sphere instead of cutting it."}),approximate:k.Boolean(!1,{...X.ShadingCategory,description:"Faster rendering, but has artifacts."}),alphaThickness:k.Numeric(0,{min:0,max:20,step:1},{...X.ShadingCategory,description:"If not zero, adjusts alpha for radius."}),bumpFrequency:k.Numeric(0,{min:0,max:10,step:.1},X.ShadingCategory),bumpAmplitude:k.Numeric(1,{min:0,max:5,step:.1},X.ShadingCategory),interior:Pr(),animation:Vt(),lodLevels:k.ObjectList({minDistance:k.Numeric(0),maxDistance:k.Numeric(0),overlap:k.Numeric(0),stride:k.Numeric(0),scaleBias:k.Numeric(3,{min:.1,max:10,step:.1})},l=>`${l.stride}`,{...X.CullingLodCategory,defaultValue:[]})},e.Utils={Params:e.Params,createEmpty:r,createValues:f,createValuesSimple:c,updateValues:o,updateBoundingSphere:d,createRenderableState:g,updateRenderableState:_,createPositionIterator:x};function x(l,b){const I=l.sphereCount,C=b.instanceCount.ref.value,A=At(),D=A.position,w=l.centerBuffer.ref.value,R=b.aTransform.ref.value;return We(I,C,1,(E,B)=>(B<0?T.fromArray(D,w,E*3):T.transformMat4Offset(D,w,R,0,E*3,B*16),A))}function f(l,b,I,C,A){const{instanceCount:D,groupCount:w}=I,R=x(l,b),S=st(I,R,C.color),E=ar(I,R,C.size),B=A.instanceGranularity?Ae(D,"instance"):Ae(D*w,"groupInstance"),L=ut(),F=ct(),O=lt(),N=dt(),z=ft(),V=mt(),$={drawCount:l.sphereCount*2*3,vertexCount:l.sphereCount*6,groupCount:w,instanceCount:D},H=l.boundingSphere.radius?Zt(E)*A.sizeFactor:0,P=q.expand(q(),l.boundingSphere,H),M=Ie(P,b.aTransform.ref.value,D,0);return l.shaderData.update({lodLevels:A.lodLevels,sizeFactor:A.sizeFactor}),{dGeometryType:a.create("spheres"),uTexDim:l.shaderData.texDim,tPositionGroup:l.shaderData.positionGroup,boundingSphere:a.create(M),invariantBoundingSphere:a.create(P),uInvariantBoundingSphere:a.create(se.ofSphere(P)),...S,...E,...B,...L,...F,...O,...N,...z,...V,...b,padding:a.create(H),...X.createValues(A,$),uSizeFactor:l.shaderData.sizeFactor,uDoubleSided:a.create(A.doubleSided),dIgnoreLight:a.create(A.ignoreLight),dCelShaded:a.create(A.celShaded),dXrayShaded:a.create(A.xrayShaded==="inverted"?"inverted":A.xrayShaded===!0?"on":"off"),dTransparentBackfaces:a.create(A.transparentBackfaces),dSolidInterior:a.create(A.solidInterior),dClipPrimitive:a.create(A.clipPrimitive),dApproximate:a.create(A.approximate),uAlphaThickness:a.create(A.alphaThickness),uBumpFrequency:a.create(A.bumpFrequency),uBumpAmplitude:a.create(A.bumpAmplitude),lodLevels:l.shaderData.lodLevels,centerBuffer:l.centerBuffer,groupBuffer:l.groupBuffer,...Lr(A.interior),...zt(A.animation)}}function c(l,b,I,C,A){const D=X.createSimple(I,C,A),w={...k.getDefaultValues(e.Params),...b};return f(l,D.transform,D.locationIterator,D.theme,w)}function o(l,b){X.updateValues(l,b),a.updateIfChanged(l.uSizeFactor,b.sizeFactor),a.updateIfChanged(l.uDoubleSided,b.doubleSided),a.updateIfChanged(l.dIgnoreLight,b.ignoreLight),a.updateIfChanged(l.dCelShaded,b.celShaded),a.updateIfChanged(l.dXrayShaded,b.xrayShaded==="inverted"?"inverted":b.xrayShaded===!0?"on":"off"),a.updateIfChanged(l.dTransparentBackfaces,b.transparentBackfaces),a.updateIfChanged(l.dSolidInterior,b.solidInterior),a.updateIfChanged(l.dClipPrimitive,b.clipPrimitive),a.updateIfChanged(l.dApproximate,b.approximate),a.updateIfChanged(l.uAlphaThickness,b.alphaThickness),a.updateIfChanged(l.uBumpFrequency,b.bumpFrequency),a.updateIfChanged(l.uBumpAmplitude,b.bumpAmplitude),Or(l,b.interior),Ut(l,b.animation);const I=v(l.lodLevels.ref.value);if(!p(b.lodLevels,I)){const C=l.uVertexCount.ref.value/6,A=y(b.lodLevels,b.sizeFactor),D=u(l.tPositionGroup.ref.value,l.centerBuffer.ref.value,l.groupBuffer.ref.value,C,A),w=D?m(b.lodLevels,b.sizeFactor,D,C):[];a.update(l.tPositionGroup,l.tPositionGroup.ref.value),a.update(l.lodLevels,w)}}function d(l,b){const I=b.boundingSphere.radius?Zt(l)*l.uSizeFactor.ref.value:0,C=q.expand(q(),b.boundingSphere,I),A=Ie(C,l.aTransform.ref.value,l.instanceCount.ref.value,0);q.equals(A,l.boundingSphere.ref.value)||a.update(l.boundingSphere,A),q.equals(C,l.invariantBoundingSphere.ref.value)||(a.update(l.invariantBoundingSphere,C),a.update(l.uInvariantBoundingSphere,se.fromSphere(l.uInvariantBoundingSphere.ref.value,C))),a.update(l.padding,I)}function g(l){const b=X.createRenderableState(l);return _(b,l),b}function _(l,b){X.updateRenderableState(l,b),l.opaque=l.opaque&&!b.xrayShaded,l.writeDepth=l.opaque}})(vn||(vn={}));var hn;(function(e){class t{constructor(){this.index=0,this.textures=[]}get(){return this.textures[this.index]}set(f,c,o){this.textures[this.index]=Object.assign(this.textures[this.index]||{},{vertex:f,group:c,normal:o}),this.index=(this.index+1)%2}destroy(){for(const f of this.textures)f.vertex.destroy(),f.group.destroy(),f.normal.destroy()}}e.DoubleBuffer=t;function r(x,f,c,o,d,g,_){const l=c.getWidth(),b=c.getHeight();return _?(_.vertexCount=x,_.groupCount=f,a.update(_.geoTextureDim,ae.set(_.geoTextureDim.ref.value,l,b)),a.update(_.vertexTexture,c),a.update(_.groupTexture,o),a.update(_.normalTexture,d),_.doubleBuffer.set(c,o,d),q.copy(_.boundingSphere,g),_):{kind:"texture-mesh",vertexCount:x,groupCount:f,geoTextureDim:a.create(ae.create(l,b)),vertexTexture:a.create(c),groupTexture:a.create(o),normalTexture:a.create(d),varyingGroup:a.create(!1),doubleBuffer:new t,boundingSphere:q.clone(g),meta:{}}}e.create=r;function n(x){const f=x?x.vertexTexture.ref.value:we(),c=x?x.groupTexture.ref.value:we(),o=x?x.normalTexture.ref.value:we(),d=x?x.boundingSphere:q();return r(0,0,f,c,o,d,x)}e.createEmpty=n,e.Params={...X.Params,doubleSided:k.Boolean(!1,X.CustomQualityParamInfo),flipSided:k.Boolean(!1,X.ShadingCategory),flatShaded:k.Boolean(!1,X.ShadingCategory),ignoreLight:k.Boolean(!1,X.ShadingCategory),celShaded:k.Boolean(!1,X.ShadingCategory),xrayShaded:k.Select(!1,[[!1,"Off"],[!0,"On"],["inverted","Inverted"]],X.ShadingCategory),transparentBackfaces:k.Select("off",k.arrayToOptions(["off","on","opaque"]),X.ShadingCategory),bumpFrequency:k.Numeric(0,{min:0,max:10,step:.1},X.ShadingCategory),bumpAmplitude:k.Numeric(1,{min:0,max:5,step:.1},X.ShadingCategory),interior:Pr(),animation:Vt()},e.Utils={Params:e.Params,createEmpty:n,createValues:u,createValuesSimple:p,updateValues:m,updateBoundingSphere:v,createRenderableState:h,updateRenderableState:y,createPositionIterator:s};const i="texture-mesh";function s(x,f){const c=x.meta.webgl;if(!c)return We(1,1,1,()=>Ye);c.namedFramebuffers[i]||(c.namedFramebuffers[i]=c.resources.framebuffer());const o=c.namedFramebuffers[i],[d,g]=x.geoTextureDim.ref.value;let _;const l=()=>{if(!_){const S=new Float32Array(d*g*4);o.bind(),x.vertexTexture.ref.value.attachFramebuffer(o,0),c.readPixels(0,0,d,g,S);const E=new Float32Array(d*g*4);o.bind(),x.normalTexture.ref.value.attachFramebuffer(o,0),c.readPixels(0,0,d,g,E),_={vertices:S,normals:E}}return _},b=x.vertexCount,I=f.instanceCount.ref.value,C=At(),A=C.position,D=C.normal,w=f.aTransform.ref.value;return We(b,I,1,(S,E)=>{const{vertices:B,normals:L}=l();return E<0?(T.fromArray(A,B,S*4),T.fromArray(D,L,S*4)):(T.transformMat4Offset(A,B,w,0,S*4,E*16),T.transformDirectionOffset(D,L,w,0,S*4,E*16)),C})}function u(x,f,c,o,d){const{instanceCount:g,groupCount:_}=c,l=e.Utils.createPositionIterator(x,f),b=st(c,l,o.color),I=d.instanceGranularity?Ae(g,"instance"):Ae(g*_,"groupInstance"),C=ut(),A=ct(),D=lt(),w=dt(),R=ft(),S=mt(),E={drawCount:x.vertexCount,vertexCount:x.vertexCount,groupCount:_,instanceCount:g},B=q.clone(x.boundingSphere),L=Ie(B,f.aTransform.ref.value,g,0);return{dGeometryType:a.create("textureMesh"),uGeoTexDim:x.geoTextureDim,tPosition:x.vertexTexture,tGroup:x.groupTexture,tNormal:x.normalTexture,dVaryingGroup:x.varyingGroup,boundingSphere:a.create(L),invariantBoundingSphere:a.create(B),uInvariantBoundingSphere:a.create(se.ofSphere(B)),...b,...I,...C,...A,...D,...w,...R,...S,...f,...X.createValues(d,E),uDoubleSided:a.create(d.doubleSided),dFlatShaded:a.create(d.flatShaded),dFlipSided:a.create(d.flipSided),dIgnoreLight:a.create(d.ignoreLight),dCelShaded:a.create(d.celShaded),dXrayShaded:a.create(d.xrayShaded==="inverted"?"inverted":d.xrayShaded===!0?"on":"off"),dTransparentBackfaces:a.create(d.transparentBackfaces),uBumpFrequency:a.create(d.bumpFrequency),uBumpAmplitude:a.create(d.bumpAmplitude),meta:a.create(x.meta),...Lr(d.interior),...zt(d.animation)}}function p(x,f,c,o,d){const g=X.createSimple(c,o,d),_={...k.getDefaultValues(e.Params),...f};return u(x,g.transform,g.locationIterator,g.theme,_)}function m(x,f){X.updateValues(x,f),a.updateIfChanged(x.uDoubleSided,f.doubleSided),a.updateIfChanged(x.dFlatShaded,f.flatShaded),a.updateIfChanged(x.dFlipSided,f.flipSided),a.updateIfChanged(x.dIgnoreLight,f.ignoreLight),a.updateIfChanged(x.dCelShaded,f.celShaded),a.updateIfChanged(x.dXrayShaded,f.xrayShaded==="inverted"?"inverted":f.xrayShaded===!0?"on":"off"),a.updateIfChanged(x.dTransparentBackfaces,f.transparentBackfaces),a.updateIfChanged(x.uBumpFrequency,f.bumpFrequency),a.updateIfChanged(x.uBumpAmplitude,f.bumpAmplitude),Or(x,f.interior),Ut(x,f.animation)}function v(x,f){const c=q.clone(f.boundingSphere),o=Ie(c,x.aTransform.ref.value,x.instanceCount.ref.value,0);q.equals(o,x.boundingSphere.ref.value)||a.update(x.boundingSphere,o),q.equals(c,x.invariantBoundingSphere.ref.value)||(a.update(x.invariantBoundingSphere,c),a.update(x.uInvariantBoundingSphere,se.fromSphere(x.uInvariantBoundingSphere.ref.value,c)))}function h(x){const f=X.createRenderableState(x);return y(f,x),f}function y(x,f){X.updateRenderableState(x,f),x.opaque=x.opaque&&!f.xrayShaded,x.writeDepth=x.opaque}})(hn||(hn={}));function If(e,t){const r={},n={},i={},s={},u={},p={},m={};return Object.keys(e).forEach(v=>{const h=e[v];h.type==="attribute"&&(r[v]=t[v]),h.type==="define"&&(n[v]=t[v]),h.type==="texture"&&t[v]!==void 0&&(h.variant==="material"?s[v]=t[v]:i[v]=t[v]),h.type==="uniform"&&t[v]!==void 0&&(h.variant==="material"?p[v]=t[v]:h.variant==="buffered"?m[v]=t[v]:u[v]=t[v])}),{attributeValues:r,defineValues:n,textureValues:i,materialTextureValues:s,uniformValues:u,materialUniformValues:p,bufferedUniformValues:m}}function Af(e){const t={};return Object.keys(e).forEach(r=>{t[r]=e[r].ref.version}),t}function ge(e,t,r){return{type:"attribute",kind:e,itemSize:t,divisor:r}}function G(e,t){return{type:"uniform",kind:e,variant:t}}function me(e,t,r,n,i){return{type:"texture",kind:e,format:t,dataType:r,filter:n,variant:i}}function qt(e){return{type:"elements",kind:e}}function ee(e,t){return{type:"define",kind:e,options:t}}function le(e){return{type:"value",kind:e}}const pt={uDrawId:G("i"),uModel:G("m4"),uView:G("m4"),uInvView:G("m4"),uModelView:G("m4"),uInvModelView:G("m4"),uProjection:G("m4"),uInvProjection:G("m4"),uModelViewProjection:G("m4"),uInvModelViewProjection:G("m4"),uHasHeadRotation:G("b"),uInvHeadRotation:G("m4"),uIsAsymmetricProjection:G("b"),uHasEyeCamera:G("b"),uModelViewEye:G("m4"),uInvModelViewEye:G("m4"),uIsOrtho:G("f"),uPixelRatio:G("f"),uViewport:G("v4"),uViewOffset:G("v2"),uModelScale:G("f"),uDrawingBufferSize:G("v2"),uCameraPosition:G("v3"),uCameraDir:G("v3"),uCameraPlane:G("v4"),uNear:G("f"),uFar:G("f"),uFog:G("b"),uFogNear:G("f"),uFogFar:G("f"),uFogColor:G("v3"),uTransparentBackground:G("b"),uLightDirection:G("v3[]"),uLightColor:G("v3[]"),uAmbientColor:G("v3"),uPickingAlphaThreshold:G("f"),uHighlightColor:G("v3"),uSelectColor:G("v3"),uDimColor:G("v3"),uHighlightStrength:G("f"),uSelectStrength:G("f"),uDimStrength:G("f"),uMarkerPriority:G("i"),uMarkerAverage:G("f"),uXrayEdgeFalloff:G("f"),uCelSteps:G("f"),uExposure:G("f"),uRenderMask:G("i"),uMarkingDepthTest:G("b"),uMarkingType:G("i"),uPickType:G("i"),uTime:G("f"),uEnableAnimation:G("b")},gt={tDepth:me("texture","depth","ushort","nearest"),tDpoitDepth:me("texture","rg","float","nearest"),tDpoitFrontColor:me("texture","rgba","float","nearest"),tDpoitBackColor:me("texture","rgba","float","nearest")},vt={dLightCount:ee("number"),dColorMarker:ee("boolean")},ht={uObjectId:G("i")},Df={uColor:G("v3","material"),uColorTexDim:G("v2"),uColorGridDim:G("v3"),uColorGridTransform:G("v4"),uPaletteDomain:G("v2"),uPaletteDefault:G("v3"),tColor:me("image-uint8","rgb","ubyte","nearest"),tPalette:me("image-uint8","rgb","ubyte","nearest"),tColorGrid:me("texture","rgb","ubyte","linear"),dColorType:ee("string",["uniform","attribute","instance","group","groupInstance","vertex","vertexInstance","volume","volumeInstance","direct"]),dUsePalette:ee("boolean")},or={uSize:G("f","material"),uSizeTexDim:G("v2"),tSize:me("image-uint8","rgb","ubyte","nearest"),dSizeType:ee("string",["uniform","attribute","instance","group","groupInstance"]),uSizeFactor:G("f","material")},Rf={uMarker:G("f"),uMarkerTexDim:G("v2"),tMarker:me("image-uint8","alpha","ubyte","nearest"),markerAverage:le("number"),markerStatus:le("number"),dMarkerType:ee("string",["instance","groupInstance"])},wf={uOverpaintTexDim:G("v2"),tOverpaint:me("image-uint8","rgba","ubyte","nearest"),dOverpaint:ee("boolean"),uOverpaintGridDim:G("v3"),uOverpaintGridTransform:G("v4"),tOverpaintGrid:me("texture","rgba","ubyte","linear"),dOverpaintType:ee("string",["instance","groupInstance","volumeInstance"]),uOverpaintStrength:G("f","material")},Bf={uTransparencyTexDim:G("v2"),tTransparency:me("image-uint8","alpha","ubyte","nearest"),dTransparency:ee("boolean"),transparencyAverage:le("number"),transparencyMin:le("number"),uTransparencyGridDim:G("v3"),uTransparencyGridTransform:G("v4"),tTransparencyGrid:me("texture","alpha","ubyte","linear"),dTransparencyType:ee("string",["instance","groupInstance","volumeInstance"]),uTransparencyStrength:G("f","material")},Ff={uEmissiveTexDim:G("v2"),tEmissive:me("image-uint8","alpha","ubyte","nearest"),dEmissive:ee("boolean"),emissiveAverage:le("number"),uEmissiveGridDim:G("v3"),uEmissiveGridTransform:G("v4"),tEmissiveGrid:me("texture","alpha","ubyte","linear"),dEmissiveType:ee("string",["instance","groupInstance","volumeInstance"]),uEmissiveStrength:G("f","material")},Pf={uSubstanceTexDim:G("v2"),tSubstance:me("image-uint8","rgba","ubyte","nearest"),dSubstance:ee("boolean"),uSubstanceGridDim:G("v3"),uSubstanceGridTransform:G("v4"),tSubstanceGrid:me("texture","rgba","ubyte","linear"),dSubstanceType:ee("string",["instance","groupInstance","volumeInstance"]),uSubstanceStrength:G("f","material")},Lf={uClippingTexDim:G("v2"),tClipping:me("image-uint8","alpha","ubyte","nearest"),dClipping:ee("boolean"),dClippingType:ee("string",["instance","groupInstance"])},Of={uWiggleTexDim:G("v2"),tWiggle:me("image-uint8","alpha","ubyte","nearest"),dWiggle:ee("boolean"),wiggleAverage:le("number"),dWiggleType:ee("string",["instance","groupInstance"]),uWiggleStrength:G("f","material")},bt={dGeometryType:ee("string",["cylinders","directVolume","image","lines","mesh","points","spheres","text","textureMesh"]),...Df,...Rf,...wf,...Bf,...Ff,...Pf,...Lf,...Of,dClipObjectCount:ee("number"),dClipVariant:ee("string",["instance","pixel"]),uClipObjectType:G("i[]","material"),uClipObjectInvert:G("b[]","material"),uClipObjectPosition:G("v3[]","material"),uClipObjectRotation:G("v4[]","material"),uClipObjectScale:G("v3[]","material"),uClipObjectTransform:G("m4[]","material"),aInstance:ge("float32",1,1),aTransform:ge("float32",16,1),uAlpha:G("f","material"),uMetalness:G("f","material"),uRoughness:G("f","material"),uBumpiness:G("f","material"),uEmissive:G("f","material"),uDensity:G("f","material"),uVertexCount:G("i"),uInstanceCount:G("i"),uGroupCount:G("i"),uInvariantBoundingSphere:G("v4"),uLod:G("v4"),drawCount:le("number"),instanceCount:le("number"),alpha:le("number"),matrix:le("m4"),transform:le("float32"),extraTransform:le("float32"),hasReflection:le("boolean"),instanceGranularity:le("boolean"),boundingSphere:le("sphere"),invariantBoundingSphere:le("sphere"),instanceGrid:le("instanceGrid")},Mr={uInteriorColor:G("v4"),uInteriorSubstance:G("v4")},Wt={uWiggleSpeed:G("f","material"),uWiggleAmplitude:G("f","material"),uWiggleFrequency:G("f","material"),uWiggleMode:G("i","material"),uTumbleSpeed:G("f","material"),uTumbleAmplitude:G("f","material"),uTumbleFrequency:G("f","material")},Mf=`
precision highp float;
precision highp sampler2D;

uniform sampler2D tColor;
uniform vec2 uTexSize;

void main() {
    vec2 coords = gl_FragCoord.xy / uTexSize;
    gl_FragColor = texture2D(tColor, coords);
}
`,Nf=`
precision highp float;

attribute vec2 aPosition;
uniform vec2 uQuadScale;

void main(void) {
    vec2 position = aPosition * uQuadScale - vec2(1.0, 1.0) + uQuadScale;
    gl_Position = vec4(position, 0.0, 1.0);
}
`,Gf=3e7,kf=Ve();function Vf(e,t){const{gl:r}=e;switch(t){case"points":return r.POINTS;case"lines":return r.LINES;case"line-strip":return r.LINE_STRIP;case"line-loop":return r.LINE_LOOP;case"triangles":return r.TRIANGLES;case"triangle-strip":return r.TRIANGLE_STRIP;case"triangle-fan":return r.TRIANGLE_FAN}}const zf={color:"",pick:"",depth:"",marking:"",emissive:"",tracing:""},Uf=Object.keys(zf),jf={compute:""},qf=Object.keys(jf);function Qr(e,t,r,n,i){return r={...r,dRenderVariant:a.create(t)},i.dRenderVariant===void 0&&Object.defineProperty(i,"dRenderVariant",{value:ee("string")}),e.resources.program(r,n,i)}function Wf(){return{attributes:!1,defines:!1,elements:!1,textures:!1}}function Xf(e){e.attributes=!1,e.defines=!1,e.elements=!1,e.textures=!1}function Zr(e,t){if(e==="color")switch(t){case"blended":return"colorBlended";case"wboit":return"colorWboit";case"dpoit":return"colorDpoit"}return e}function yt(e,t,r,n,i,s,u){return li(e,t,r,n,i,s,Uf,u)}function Hf(e,t,r,n,i,s=-1){return li(e,t,r,n,i,s,qf,void 0)}function li(e,t,r,n,i,s,u,p){const m=kf(),{stats:v,state:h,resources:y}=e,{instancedArrays:x,vertexArrayObject:f,multiDrawInstancedBaseVertexBaseInstance:c,drawInstancedBaseVertexBaseInstance:o}=e.extensions;if(u=u.filter(j=>j==="tracing"?!!e.extensions.drawBuffers:!0),i.uVertexCount&&!e.extensions.noNonInstancedActiveAttribs){const j=i.uVertexCount.ref.value;i.aVertex=a.create(Nt(new Float32Array(j))),n.aVertex=ge("float32",1,0)}const{attributeValues:d,defineValues:g,textureValues:_,materialTextureValues:l,uniformValues:b,materialUniformValues:I,bufferedUniformValues:C}=If(n,i),A=Object.entries(b),D=Object.entries(I),w=Object.entries(C),R=Object.entries(zs(C)),S=Object.entries(g),E=Af(i),B=Vf(e,t),L={};for(const j of u)L[j]=Qr(e,Zr(j,p),g,r,n);const F=ca(e,n,_),O=ca(e,n,l),N=Hs(e,n,d),z=[];for(let j=0,Q=N.length;j<Q;++j){const ne=N[j];ne[1].divisor===1&&z.push(ne)}let V;const $=i.elements;$&&$.ref.value&&(V=y.elements($.ref.value));const H={};for(const j of u)H[j]=f?y.vertexArray(L[j],N,V):null;let P=i.drawCount.ref.value,M=i.instanceCount.ref.value;v.drawCount+=P,v.instanceCount+=M,v.instancedDrawCount+=M*P;const U=Wf();let W=!1,te=-1;return{id:m,materialId:s,getByteCount(){let j=0;for(let Q=0,ne=N.length;Q<ne;++Q)j+=N[Q][1].getByteCount();V&&(j+=V.getByteCount());for(let Q=0,ne=F.length;Q<ne;++Q)j+=F[Q][1].getByteCount();for(let Q=0,ne=O.length;Q<ne;++Q)j+=O[Q][1].getByteCount();return j},getProgram:j=>L[j],setTransparency:j=>{if(j!==p){p=j;for(const Q of u)L[Q].destroy(),L[Q]=Qr(e,Zr(Q,p),g,r,n)}},render:(j,Q,ne)=>{if(P===0||M===0)return;const Z=L[j];if(Z.id===te&&h.currentRenderItemId===m)Z.setUniforms(A),Z.bindTextures(F,Q);else{const Y=H[j];(Z.id!==h.currentProgramId||Z.id!==te||s===-1||s!==h.currentMaterialId)&&(Z.id!==h.currentProgramId&&Z.use(),Z.setUniforms(D),Z.bindTextures(O,Q+F.length),h.currentMaterialId=s,te=Z.id),Z.setUniforms(A),Z.setUniforms(R),Z.bindTextures(F,Q),Y?(Y.bind(),V&&V.bind()):(V&&V.bind(),Z.bindAttributes(N)),h.currentRenderItemId=m}if(oe&&e.checkFramebufferStatus(`Framebuffer error rendering item id ${m}`),ne){for(const Y of ne)if(Y.count!==0){if(Z.setUniforms(Y.uniforms),c)V?c.multiDrawElementsInstancedBaseVertexBaseInstance(B,Y.counts,0,V._dataType,Y.offsets,0,Y.instanceCounts,0,Y.baseVertices,0,Y.baseInstances,0,Y.count):c.multiDrawArraysInstancedBaseInstance(B,Y.firsts,0,Y.counts,0,Y.instanceCounts,0,Y.baseInstances,0,Y.count);else if(o)if(V)for(let re=0;re<Y.count;++re)Y.counts[re]>0&&(Z.uniform("uDrawId",re),o.drawElementsInstancedBaseVertexBaseInstance(B,Y.counts[re],V._dataType,Y.offsets[re],Y.instanceCounts[re],Y.baseVertices[re],Y.baseInstances[re]));else for(let re=0;re<Y.count;++re)Y.counts[re]>0&&(Z.uniform("uDrawId",re),o.drawArraysInstancedBaseInstance(B,Y.firsts[re],Y.counts[re],Y.instanceCounts[re],Y.baseInstances[re]));else if(V)for(let re=0;re<Y.count;++re)Y.counts[re]>0&&(Z.uniform("uDrawId",re),Z.offsetAttributes(z,Y.baseInstances[re]),x.drawElementsInstanced(B,Y.counts[re],V._dataType,Y.offsets[re],Y.instanceCounts[re]));else for(let re=0;re<Y.count;++re)Y.counts[re]>0&&(Z.uniform("uDrawId",re),Z.offsetAttributes(z,Y.baseInstances[re]),x.drawArraysInstanced(B,0,Y.counts[re],Y.instanceCounts[re]));if(Le){c?v.calls.multiDrawInstancedBase+=1:o?v.calls.drawInstancedBase+=Y.count:v.calls.drawInstanced+=Y.count;for(let re=0;re<Y.count;++re)v.calls.counts+=Y.instanceCounts[re]}}}else{let Y=0;for(;;){const re=Math.min(P-Y,Gf);if(V?x.drawElementsInstanced(B,re,V._dataType,Y*V._bpe,M):x.drawArraysInstanced(B,Y,re,M),Y+=re,Y>=P)break}Le&&(v.calls.drawInstanced+=1,v.calls.counts+=M)}oe&&e.checkError(`Draw error rendering item id ${m}`)},update:()=>{if(Xf(U),i.aVertex){const j=i.uVertexCount.ref.value;i.aVertex.ref.value.length<j&&a.update(i.aVertex,Nt(new Float32Array(j)))}for(let j=0,Q=S.length;j<Q;++j){const[ne,Z]=S[j];Z.ref.version!==E[ne]&&(U.defines=!0,E[ne]=Z.ref.version)}if(U.defines)for(const j of u)L[j].destroy(),L[j]=Qr(e,Zr(j,p),g,r,n);i.drawCount.ref.version!==E.drawCount&&(v.drawCount+=i.drawCount.ref.value-P,v.instancedDrawCount+=M*i.drawCount.ref.value-M*P,P=i.drawCount.ref.value,E.drawCount=i.drawCount.ref.version),i.instanceCount.ref.version!==E.instanceCount&&(v.instanceCount+=i.instanceCount.ref.value-M,v.instancedDrawCount+=i.instanceCount.ref.value*P-M*P,M=i.instanceCount.ref.value,E.instanceCount=i.instanceCount.ref.version);for(let j=0,Q=N.length;j<Q;++j){const[ne,Z]=N[j],Y=d[ne];if(Y.ref.version!==E[ne]){if(Z.length>=Y.ref.value.length)Z.updateSubData(Y.ref.value,0,Z.length);else{Z.destroy();const{itemSize:re,divisor:Ee}=n[ne];N[j][1]=y.attribute(Y.ref.value,re,Ee),U.attributes=!0}E[ne]=Y.ref.version}}if(V&&i.elements.ref.version!==E.elements&&(V.length>=i.elements.ref.value.length?V.updateSubData(i.elements.ref.value,0,V.length):(V.destroy(),V=y.elements(i.elements.ref.value),U.elements=!0),E.elements=i.elements.ref.version),U.attributes||U.defines||U.elements)for(const j of u){const Q=H[j];Q&&Q.destroy(),H[j]=f?y.vertexArray(L[j],N,V):null}for(let j=0,Q=F.length;j<Q;++j){const[ne,Z]=F[j],Y=_[ne];Y.ref.version!==E[ne]&&(n[ne].kind!=="texture"?(Z.load(Y.ref.value),U.textures=!0):F[j][1]=Y.ref.value,E[ne]=Y.ref.version)}for(let j=0,Q=O.length;j<Q;++j){const[ne,Z]=O[j],Y=l[ne];Y.ref.version!==E[ne]&&(n[ne].kind!=="texture"?(Z.load(Y.ref.value),U.textures=!0):O[j][1]=Y.ref.value,E[ne]=Y.ref.version)}for(let j=0,Q=w.length;j<Q;++j){const[ne,Z]=w[j];Z.ref.version!==E[ne]&&(a.update(R[j][1],Aa(Z.ref.value)),E[ne]=Z.ref.version)}},destroy:()=>{if(!W){for(const j of u){L[j].destroy();const Q=H[j];Q&&Q.destroy()}F.forEach(([j,Q])=>{n[j].kind!=="texture"&&Q.destroy()}),O.forEach(([j,Q])=>{n[j].kind!=="texture"&&Q.destroy()}),N.forEach(([j,Q])=>Q.destroy()),V&&V.destroy(),v.drawCount-=P,v.instanceCount-=M,v.instancedDrawCount-=M*P,W=!0}}}}function xe(){return xe.create(T.create(1,0,0),0)}(function(e){function t(d,g){return{normal:d,constant:g}}e.create=t;function r(d,g){return T.copy(d.normal,g.normal),d.constant=g.constant,d}e.copy=r;function n(d){return r(e(),d)}e.clone=n;function i(d,g){const _=1/T.magnitude(g.normal);return T.scale(d.normal,g.normal,_),d.constant=g.constant*_,d}e.normalize=i;function s(d,g){return T.negate(d.normal,g.normal),d.constant=-g.constant,d}e.negate=s;function u(d,g,_){return T.toArray(d.normal,g,_),g[_+3]=d.constant,g}e.toArray=u;function p(d,g,_){return T.fromArray(d.normal,g,_),d.constant=g[_+3],d}e.fromArray=p;function m(d,g,_){return T.copy(d.normal,g),d.constant=-T.dot(d.normal,_),d}e.fromNormalAndCoplanarPoint=m;function v(d,g,_,l){const b=T.triangleNormal(T(),g,_,l);return m(d,b,g),d}e.fromCoplanarPoints=v;const h=T();function y(d,g,_,l,b){T.set(h,g,_,l);const I=1/T.magnitude(h);return T.scale(d.normal,h,I),d.constant=b*I,d}e.setUnnormalized=y;function x(d,g){return T.dot(d.normal,g)+d.constant}e.distanceToPoint=x;function f(d,g){return x(d,g.center)-g.radius}e.distanceToSphere3D=f;function c(d,g,_){return T.scaleAndAdd(d,_,g.normal,-x(g,_))}e.projectPoint=c;function o(d,g,_){const l=T.dot(g.normal,_.direction);if(l===0)return!1;const b=-(T.dot(g.normal,_.origin)+g.constant)/l;return b<0?!1:(T.scaleAndAdd(d,_.origin,_.direction,b),!0)}e.intersectRay3D=o})(xe||(xe={}));function Rr(){return Rr.create(xe(),xe(),xe(),xe(),xe(),xe())}(function(e){(function(v){v[v.Right=0]="Right",v[v.Left=1]="Left",v[v.Bottom=2]="Bottom",v[v.Top=3]="Top",v[v.Far=4]="Far",v[v.Near=5]="Near"})(e.PlaneIndex||(e.PlaneIndex={}));function t(v,h,y,x,f,c){return[v,h,y,x,f,c]}e.create=t;function r(v,h){for(let y=0;y<6;++y)xe.copy(v[y],h[y]);return v}e.copy=r;function n(v){return r(e(),v)}e.clone=n;function i(v,h){const y=h[0],x=h[1],f=h[2],c=h[3],o=h[4],d=h[5],g=h[6],_=h[7],l=h[8],b=h[9],I=h[10],C=h[11],A=h[12],D=h[13],w=h[14],R=h[15];return xe.setUnnormalized(v[0],c-y,_-o,C-l,R-A),xe.setUnnormalized(v[1],c+y,_+o,C+l,R+A),xe.setUnnormalized(v[2],c+x,_+d,C+b,R+D),xe.setUnnormalized(v[3],c-x,_-d,C-b,R-D),xe.setUnnormalized(v[4],c-f,_-g,C-I,R-w),xe.setUnnormalized(v[5],c+f,_+g,C+I,R+w),v}e.fromProjectionMatrix=i;function s(v,h){const y=h.center,x=-h.radius;for(let f=0;f<6;++f)if(xe.distanceToPoint(v[f],y)<x)return!1;return!0}e.intersectsSphere3D=s;const u=T();function p(v,h){for(let y=0;y<6;++y){const x=v[y];if(u[0]=x.normal[0]>0?h.max[0]:h.min[0],u[1]=x.normal[1]>0?h.max[1]:h.min[1],u[2]=x.normal[2]>0?h.max[2]:h.min[2],xe.distanceToPoint(x,u)<0)return!1}return!0}e.intersectsBox3D=p;function m(v,h){for(let y=0;y<6;++y)if(xe.distanceToPoint(v[y],h)<0)return!1;return!0}e.containsPoint=m})(Rr||(Rr={}));const gr=xe.distanceToPoint,vr=Rr.intersectsSphere3D,hr=q.fromArray,mi=Ve();function Kr(e,t){return t&&t.instanceCounts.length>=e?t:{firsts:new Int32Array(e),counts:new Int32Array(e),offsets:new Int32Array(e),instanceCounts:new Int32Array(e),baseVertices:new Int32Array(e),baseInstances:new Uint32Array(e),count:0,uniforms:[]}}function _t(e,t,r){const n=mi();let i=Kr(0);const s=[];let u=!1,p=-1;const m=q(),v=()=>{var h;const y=(h=t.lodLevels)===null||h===void 0?void 0:h.ref.value;if(y&&y.length>0){const{cellCount:x}=t.instanceGrid.ref.value;s.length=y.length;for(let f=0,c=y.length;f<c;++f)s[f]=Kr(x,s[f]),s[f].count=0;if(t.lodLevels.ref.version!==p){for(let f=0,c=y.length;f<c;++f)s[f].uniforms.length!==1&&(s[f].uniforms.length=1,s[f].uniforms[0]=["uLod",a.create(se())]),a.update(s[f].uniforms[0][1],se.set(s[f].uniforms[0][1].ref.value,y[f][0],y[f][1],y[f][2],y[f][4]));p=t.lodLevels.ref.version}}};return v(),{id:n,materialId:e.materialId,values:t,state:r,cull:(h,y,x,f)=>{var c,o;if(u=!1,t.drawCount.ref.value===0||t.instanceCount.ref.value===0||t.instanceGrid.ref.value.cellSize<=1)return;const{cellOffsets:d,cellSpheres:g,cellCount:_,batchOffsets:l,batchSpheres:b,batchCount:I,batchCell:C,batchSize:A}=t.instanceGrid.ref.value,[D,w]=t.uLod.ref.value,R=D!==0||w!==0,S=2*A,E=(c=t.lodLevels)===null||c===void 0?void 0:c.ref.value;if(E&&E.length>0){if(((o=t.lodLevels)===null||o===void 0?void 0:o.ref.version)!==p)v();else for(let B=0,L=E.length;B<L;++B)s[B].count=0;for(let B=0;B<I;++B){const L=l[B],F=l[B+1];if(F-L===0)continue;hr(m,b,B*4);const N=gr(h,m.center);if(R&&(N+m.radius<D||N-m.radius>w)){Le&&(f.culled.lod+=d[C[F-1]+1]-d[C[L]]);continue}if(!vr(y,m)){Le&&(f.culled.frustum+=d[C[F-1]+1]-d[C[L]]);continue}if(x!==null&&x(m)){Le&&(f.culled.occlusion+=d[C[F-1]+1]-d[C[L]]);continue}for(let z=L;z<F;++z){const V=C[z],$=d[V],P=d[V+1]-$;if(P===0)continue;hr(m,g,V*4);const M=gr(h,m.center);if(R&&(M+m.radius<D||M-m.radius>w)){Le&&(f.culled.lod+=P);continue}if(!vr(y,m)){Le&&(f.culled.frustum+=P);continue}if(x!==null&&M-m.radius<S&&x(m)){Le&&(f.culled.occlusion+=P);continue}for(let U=0,W=E.length;U<W;++U){if(M+m.radius<E[U][0]||M-m.radius>E[U][1])continue;const te=s[U],j=te.count;j>0&&te.baseInstances[j-1]+te.instanceCounts[j-1]===$&&te.counts[j-1]===E[U][3]?te.instanceCounts[j-1]+=P:(te.counts[j]=E[U][3],te.instanceCounts[j]=P,te.baseInstances[j]=$,te.count+=1)}}}}else{i=Kr(_,i);const{baseInstances:B,instanceCounts:L,counts:F}=i;let O=0;for(let N=0;N<I;++N){const z=l[N],V=l[N+1];if(V-z!==0){if(hr(m,b,N*4),R){const H=gr(h,m.center);if(H+m.radius<D||H-m.radius>w){Le&&(f.culled.lod+=d[C[V-1]+1]-d[C[z]]);continue}}if(!vr(y,m)){Le&&(f.culled.frustum+=d[C[V-1]+1]-d[C[z]]);continue}if(x!==null&&x(m)){Le&&(f.culled.occlusion+=d[C[V-1]+1]-d[C[z]]);continue}for(let H=z;H<V;++H){const P=C[H],M=d[P],W=d[P+1]-M;if(W===0)continue;hr(m,g,P*4);const te=gr(h,m.center);if(R&&(te+m.radius<D||te-m.radius>w)){Le&&(f.culled.lod+=W);continue}if(!vr(y,m)){Le&&(f.culled.frustum+=W);continue}if(x!==null&&te-m.radius<S&&x(m)){Le&&(f.culled.occlusion+=W);continue}O>0&&B[O-1]+L[O-1]===M?L[O-1]+=W:(F[O]=t.drawCount.ref.value,L[O]=W,B[O]=M,O+=1)}}}i.count=O,s.length=1,s[0]=i,s[0].uniforms.length=0}u=!0},uncull:()=>{u=!1},cullSimple:(h,y,x)=>{var f,c;const o=(f=t.lodLevels)===null||f===void 0?void 0:f.ref.value;if(!(!o||o.length===0)){if(((c=t.lodLevels)===null||c===void 0?void 0:c.ref.version)!==p)v();else for(let d=0,g=o.length;d<g;++d)s[d].count=0;for(let d=0,g=o.length;d<g;++d)if(h+y<o[d][1]*x){const _=s[d],l=_.count;_.counts[l]=o[d][3],_.instanceCounts[l]=t.instanceCount.ref.value,_.baseInstances[l]=0,_.count+=1;break}u=!0}},render:(h,y)=>{t.uAlpha&&t.alpha&&a.updateIfChanged(t.uAlpha,Cn(t.alpha.ref.value*r.alphaFactor,0,1)),e.render(h,y,u?s:void 0)},getByteCount:()=>e.getByteCount(),getProgram:h=>e.getProgram(h),setTransparency:h=>e.setTransparency(h),update:()=>{e.update(),v()},dispose:()=>e.destroy()}}function $f(e,t){return{id:mi(),values:t,render:()=>{e.getProgram("compute").finalize(!0),e.render("compute",0)},update:()=>e.update(),dispose:()=>e.destroy()}}const pi=new Float32Array([1,1,-1,1,-1,-1,-1,-1,1,-1,1,1]),Yf={drawCount:le("number"),instanceCount:le("number"),aPosition:ge("float32",2,0),uQuadScale:G("v2")},Qf={drawCount:a.create(6),instanceCount:a.create(1),aPosition:a.create(pi),uQuadScale:a.create(ae.create(1,1))},Zf={...Yf,tColor:me("texture","rgba","ubyte","nearest"),uTexSize:G("v2")},Kf=ot("copy",Nf,Mf);function Jf(e,t){const r={...Qf,tColor:a.create(t),uTexSize:a.create(ae.create(t.getWidth(),t.getHeight()))},n={...Zf},i=Hf(e,"triangles",Kf,n,r);return $f(i,r)}const Jr="shared-copy";function ed(e,t){e.namedComputeRenderables[Jr]||(e.namedComputeRenderables[Jr]=Jf(e,we()));const r=e.namedComputeRenderables[Jr];return a.update(r.values.tColor,t),a.update(r.values.uTexSize,ae.set(r.values.uTexSize.ref.value,t.getWidth(),t.getHeight())),r.update(),r}const en="read-texture",Ot="read-alpha-texture";function wl(e,t,r){const{gl:n,resources:i}=e;if(!r&&t.type!==n.UNSIGNED_BYTE)throw new Error("unsupported texture type");e.namedFramebuffers[en]||(e.namedFramebuffers[en]=i.framebuffer());const s=e.namedFramebuffers[en],u=t.getWidth(),p=t.getHeight();return r||(r=new Uint8Array(u*p*4)),s.bind(),t.attachFramebuffer(s,0),e.readPixels(0,0,u,p,r),{array:r,width:u,height:p}}function Bl(e,t){const{gl:r,state:n,resources:i}=e;if(t.type!==r.UNSIGNED_BYTE)throw new Error("unsupported texture type");const s=t.getWidth(),u=t.getHeight(),p=ed(e,t);n.currentRenderItemId=-1,e.namedFramebuffers[Ot]||(e.namedFramebuffers[Ot]=i.framebuffer());const m=e.namedFramebuffers[Ot];m.bind(),e.namedTextures[Ot]||(e.namedTextures[Ot]=i.texture("image-uint8","rgba","ubyte","linear"));const v=e.namedTextures[Ot];v.define(s,u),v.attachFramebuffer(m,0),n.disable(r.CULL_FACE),n.enable(r.BLEND),n.disable(r.DEPTH_TEST),n.enable(r.SCISSOR_TEST),n.depthMask(!1),n.clearColor(0,0,0,0),n.blendFunc(r.ONE,r.ONE),n.blendEquation(r.FUNC_ADD),n.viewport(0,0,s,u),n.scissor(0,0,s,u),r.clear(r.COLOR_BUFFER_BIT),p.render();const h=new Uint8Array(s*u*4);return e.readPixels(0,0,s,u,h),{array:h,width:s,height:u}}const Ea=new Uint32Array([0,1,2,1,3,2]),td=new Float32Array([0,1,0,0,1,1,1,0]),rd={nearest:"Nearest",catmulrom:"Catmulrom (Cubic)",mitchell:"Mitchell (Cubic)",bspline:"B-Spline (Cubic)"};var bn;(function(e){function t(){return{type:0,center:T(),rotation:nt(),scale:T(),transform:ie()}}e.createEmptyTrim=t;function r(c,o,d,g,_,l,b){return b?s(c,o,d,g,_,l,b):i(c,o,d,g,_,l)}e.create=r;function n(c){return it([c.cornerBuffer.ref.version])}function i(c,o,d,g,_,l){const b=q();let I=-1;const C=c.width,A=c.height,D={kind:"image",imageTexture:a.create(c),imageTextureDim:a.create(ae.create(C,A)),cornerBuffer:a.create(o),groupTexture:a.create(d),valueTexture:a.create(g),trimType:a.create(_.type),trimCenter:a.create(_.center),trimRotation:a.create(_.rotation),trimScale:a.create(_.scale),trimTransform:a.create(_.transform),isoLevel:a.create(l),get boundingSphere(){const w=n(D);if(w!==I){const R=nd(D.cornerBuffer.ref.value);q.copy(b,R),I=w}return b},setBoundingSphere(w){q.copy(b,w),I=n(D)},hasBoundingSphere(){return I===n(D)},meta:{}};return D}function s(c,o,d,g,_,l,b){const I=c.width,C=c.height;return a.update(b.imageTexture,c),a.update(b.imageTextureDim,ae.set(b.imageTextureDim.ref.value,I,C)),a.update(b.cornerBuffer,o),a.update(b.groupTexture,d),a.update(b.valueTexture,g),a.updateIfChanged(b.trimType,_.type),a.update(b.trimCenter,T.copy(b.trimCenter.ref.value,_.center)),a.update(b.trimRotation,nt.copy(b.trimRotation.ref.value,_.rotation)),a.update(b.trimScale,T.copy(b.trimScale.ref.value,_.scale)),a.update(b.trimTransform,ie.copy(b.trimTransform.ref.value,_.transform)),a.updateIfChanged(b.isoLevel,l),b}function u(c){const o=Te(0,4,Uint8Array),d=c?c.cornerBuffer.ref.value:new Float32Array(24),g=Te(0,4,Uint8Array),_=Te(0,1,Float32Array),l=t();return r(o,d,g,_,l,-1,c)}e.createEmpty=u,e.Params={...X.Params,interpolation:k.Select("bspline",k.objectToOptions(rd))},e.Utils={Params:e.Params,createEmpty:u,createValues:m,createValuesSimple:v,updateValues:h,updateBoundingSphere:y,createRenderableState:x,updateRenderableState:f,createPositionIterator:p};function p(c,o){return We(1,1,1,()=>Ye)}function m(c,o,d,g,_){const{instanceCount:l,groupCount:b}=d,I=p(),C=st(d,I,g.color),A=_.instanceGranularity?Ae(l,"instance"):Ae(l*b,"groupInstance"),D=ut(),w=ct(),R=lt(),S=dt(),E=ft(),B=mt(),L={drawCount:Ea.length,vertexCount:pi.length/3,groupCount:b,instanceCount:l},F=q.clone(c.boundingSphere),O=Ie(F,o.aTransform.ref.value,l,0);return{dGeometryType:a.create("image"),...C,...A,...D,...w,...R,...S,...E,...B,...o,...X.createValues(_,L),aPosition:c.cornerBuffer,aUv:a.create(td),elements:a.create(Ea),aGroup:a.create(Nt(new Float32Array(4))),boundingSphere:a.create(O),invariantBoundingSphere:a.create(F),uInvariantBoundingSphere:a.create(se.ofSphere(F)),dInterpolation:a.create(_.interpolation),uImageTexDim:c.imageTextureDim,tImageTex:c.imageTexture,tGroupTex:c.groupTexture,tValueTex:c.valueTexture,uTrimType:c.trimType,uTrimCenter:c.trimCenter,uTrimRotation:c.trimRotation,uTrimScale:c.trimScale,uTrimTransform:c.trimTransform,uIsoLevel:c.isoLevel}}function v(c,o,d,g,_){const l=X.createSimple(d,g,_),b={...k.getDefaultValues(e.Params),...o};return m(c,l.transform,l.locationIterator,l.theme,b)}function h(c,o){X.updateValues(c,o),a.updateIfChanged(c.dInterpolation,o.interpolation)}function y(c,o){const d=q.clone(o.boundingSphere),g=Ie(d,c.aTransform.ref.value,c.instanceCount.ref.value,0);q.equals(g,c.boundingSphere.ref.value)||a.update(c.boundingSphere,g),q.equals(d,c.invariantBoundingSphere.ref.value)||(a.update(c.invariantBoundingSphere,d),a.update(c.uInvariantBoundingSphere,se.fromSphere(c.uInvariantBoundingSphere.ref.value,d)))}function x(c){const o=X.createRenderableState(c);return o.opaque=!1,o}function f(c,o){X.updateRenderableState(c,o),c.opaque=!1}})(bn||(bn={}));function nd(e){const t=T(),r=[];for(let s=0,u=e.length;s<u;s+=3){const p=T.fromArray(T(),e,s);r.push(p),T.add(t,t,p)}T.scale(t,t,1/(e.length/3));let n=0;for(const s of r){const u=T.distance(t,s);u>n&&(n=u)}const i=q.create(t,n);return q.setExtrema(i,r),i}var yn;(function(e){function t(c,o,d,g,_,l,b,I,C,A){return A?s(c,o,d,g,_,l,b,I,C,A):i(c,o,d,g,_,l,b,I,C)}e.create=t;function r(c){const o=c?c.mappingBuffer.ref.value:new Float32Array(0),d=c?c.indexBuffer.ref.value:new Uint32Array(0),g=c?c.groupBuffer.ref.value:new Float32Array(0),_=c?c.startBuffer.ref.value:new Float32Array(0),l=c?c.endBuffer.ref.value:new Float32Array(0),b=c?c.scaleBuffer.ref.value:new Float32Array(0),I=c?c.capBuffer.ref.value:new Float32Array(0),C=c?c.colorModeBuffer.ref.value:new Float32Array(0);return t(o,d,g,_,l,b,I,C,0,c)}e.createEmpty=r;function n(c){return it([c.cylinderCount,c.mappingBuffer.ref.version,c.indexBuffer.ref.version,c.groupBuffer.ref.version,c.startBuffer.ref.version,c.endBuffer.ref.version,c.scaleBuffer.ref.version,c.capBuffer.ref.version,c.colorModeBuffer.ref.version])}function i(c,o,d,g,_,l,b,I,C){const A=q();let D,w=-1,R=-1;const S={kind:"cylinders",cylinderCount:C,mappingBuffer:a.create(c),indexBuffer:a.create(o),groupBuffer:a.create(d),startBuffer:a.create(g),endBuffer:a.create(_),scaleBuffer:a.create(l),capBuffer:a.create(b),colorModeBuffer:a.create(I),get boundingSphere(){const E=n(S);if(E!==w){const B=Et(S.startBuffer.ref.value,S.cylinderCount*6,6),L=Et(S.endBuffer.ref.value,S.cylinderCount*6,6);q.expandBySphere(A,B,L),w=E}return A},get groupMapping(){return S.groupBuffer.ref.version!==R&&(D=kt(S.groupBuffer.ref.value,S.cylinderCount,6),R=S.groupBuffer.ref.version),D},setBoundingSphere(E){q.copy(A,E),w=n(S)},hasBoundingSphere(){return w===n(S)}};return S}function s(c,o,d,g,_,l,b,I,C,A){return C>A.cylinderCount&&(a.update(A.mappingBuffer,c),a.update(A.indexBuffer,o)),A.cylinderCount=C,a.update(A.groupBuffer,d),a.update(A.startBuffer,g),a.update(A.endBuffer,_),a.update(A.scaleBuffer,l),a.update(A.capBuffer,b),a.update(A.colorModeBuffer,I),A}function u(c,o){const d=c.startBuffer.ref.value;Gt(o,d,0,c.cylinderCount*6),a.update(c.startBuffer,d);const g=c.endBuffer.ref.value;Gt(o,g,0,c.cylinderCount*6),a.update(c.endBuffer,g)}e.transform=u,e.Params={...X.Params,sizeFactor:k.Numeric(1,{min:0,max:10,step:.1}),sizeAspectRatio:k.Numeric(1,{min:0,max:3,step:.01}),doubleSided:k.Boolean(!1,X.CustomQualityParamInfo),ignoreLight:k.Boolean(!1,X.ShadingCategory),celShaded:k.Boolean(!1,X.ShadingCategory),xrayShaded:k.Select(!1,[[!1,"Off"],[!0,"On"],["inverted","Inverted"]],X.ShadingCategory),transparentBackfaces:k.Select("off",k.arrayToOptions(["off","on","opaque"]),X.ShadingCategory),solidInterior:k.Boolean(!0,X.ShadingCategory),bumpFrequency:k.Numeric(0,{min:0,max:10,step:.1},X.ShadingCategory),bumpAmplitude:k.Numeric(1,{min:0,max:5,step:.1},X.ShadingCategory),interior:Pr(),animation:Vt(),colorMode:k.Select("default",k.arrayToOptions(["default","interpolate"]),X.ShadingCategory)},e.Utils={Params:e.Params,createEmpty:r,createValues:m,createValuesSimple:v,updateValues:h,updateBoundingSphere:y,createRenderableState:x,updateRenderableState:f,createPositionIterator:p};function p(c,o){const d=c.cylinderCount*6,g=o.instanceCount.ref.value,_=At(),l=_.position,b=c.startBuffer.ref.value,I=c.endBuffer.ref.value,C=o.aTransform.ref.value;return We(d,g,2,(D,w)=>{const R=D%6===0?b:I;return w<0?T.fromArray(l,R,D*3):T.transformMat4Offset(l,R,C,0,D*3,w*16),_})}function m(c,o,d,g,_){const{instanceCount:l,groupCount:b}=d,I=p(c,o),C=st(d,I,g.color),A=ar(d,I,g.size),D=_.instanceGranularity?Ae(l,"instance"):Ae(l*b,"groupInstance"),w=ut(),R=ct(),S=lt(),E=dt(),B=ft(),L=mt(),F={drawCount:c.cylinderCount*4*3,vertexCount:c.cylinderCount*6,groupCount:b,instanceCount:l},O=Zt(A)*_.sizeFactor,N=q.clone(c.boundingSphere),z=Ie(N,o.aTransform.ref.value,l,0);return{dGeometryType:a.create("cylinders"),aMapping:c.mappingBuffer,aGroup:c.groupBuffer,aStart:c.startBuffer,aEnd:c.endBuffer,aScale:c.scaleBuffer,aCap:c.capBuffer,aColorMode:c.colorModeBuffer,elements:c.indexBuffer,boundingSphere:a.create(z),invariantBoundingSphere:a.create(N),uInvariantBoundingSphere:a.create(se.ofSphere(N)),...C,...A,...D,...w,...R,...S,...E,...B,...L,...o,padding:a.create(O),...X.createValues(_,F),uSizeFactor:a.create(_.sizeFactor*_.sizeAspectRatio),uDoubleSided:a.create(_.doubleSided),dIgnoreLight:a.create(_.ignoreLight),dCelShaded:a.create(_.celShaded),dXrayShaded:a.create(_.xrayShaded==="inverted"?"inverted":_.xrayShaded===!0?"on":"off"),dTransparentBackfaces:a.create(_.transparentBackfaces),dSolidInterior:a.create(_.solidInterior),uBumpFrequency:a.create(_.bumpFrequency),uBumpAmplitude:a.create(_.bumpAmplitude),dDualColor:a.create(_.colorMode==="interpolate"),...Lr(_.interior),...zt(_.animation)}}function v(c,o,d,g,_){const l=X.createSimple(d,g,_),b={...k.getDefaultValues(e.Params),...o};return m(c,l.transform,l.locationIterator,l.theme,b)}function h(c,o){X.updateValues(c,o),a.updateIfChanged(c.uSizeFactor,o.sizeFactor*o.sizeAspectRatio),a.updateIfChanged(c.uDoubleSided,o.doubleSided),a.updateIfChanged(c.dIgnoreLight,o.ignoreLight),a.updateIfChanged(c.dCelShaded,o.celShaded),a.updateIfChanged(c.dXrayShaded,o.xrayShaded==="inverted"?"inverted":o.xrayShaded===!0?"on":"off"),a.updateIfChanged(c.dTransparentBackfaces,o.transparentBackfaces),a.updateIfChanged(c.dSolidInterior,o.solidInterior),a.updateIfChanged(c.uBumpFrequency,o.bumpFrequency),a.updateIfChanged(c.uBumpAmplitude,o.bumpAmplitude),a.updateIfChanged(c.dDualColor,o.colorMode==="interpolate"),Or(c,o.interior),Ut(c,o.animation)}function y(c,o){const d=q.clone(o.boundingSphere),g=Ie(d,c.aTransform.ref.value,c.instanceCount.ref.value,0);q.equals(g,c.boundingSphere.ref.value)||a.update(c.boundingSphere,g),q.equals(d,c.invariantBoundingSphere.ref.value)||(a.update(c.invariantBoundingSphere,d),a.update(c.uInvariantBoundingSphere,se.fromSphere(c.uInvariantBoundingSphere.ref.value,d)))}function x(c){const o=X.createRenderableState(c);return f(o,c),o}function f(c,o){X.updateRenderableState(c,o),c.opaque=c.opaque&&!o.xrayShaded,c.writeDepth=c.opaque}})(yn||(yn={}));var Jt;(function(e){function t(u){switch(u.kind){case"mesh":return u.triangleCount*3;case"points":return u.pointCount;case"spheres":return u.sphereCount*2*3;case"cylinders":return u.cylinderCount*4*3;case"text":return u.charCount*2*3;case"lines":return u.lineCount*2*3;case"direct-volume":return 36;case"image":return 6;case"texture-mesh":return u.vertexCount}}e.getDrawCount=t;function r(u){switch(u.kind){case"mesh":return u.vertexCount;case"points":return u.pointCount;case"spheres":return u.sphereCount*6;case"cylinders":return u.cylinderCount*6;case"text":return u.charCount*4;case"lines":return u.vertexCount;case"direct-volume":const[p,m,v]=u.gridDimension.ref.value;return p*m*v;case"image":return 4;case"texture-mesh":return u.vertexCount}}e.getVertexCount=r;function n(u){switch(u.kind){case"mesh":case"points":case"spheres":case"cylinders":case"text":case"lines":return t(u)===0?0:Tn(u.groupBuffer.ref.value)+1;case"direct-volume":return 1;case"image":return uf(u.groupTexture.ref.value.array,4)+1;case"texture-mesh":return u.groupCount}}e.getGroupCount=n;function i(u){switch(u.kind){case"mesh":return dn.Utils;case"points":return ln.Utils;case"spheres":return vn.Utils;case"cylinders":return yn.Utils;case"text":return mn.Utils;case"lines":return Kt.Utils;case"direct-volume":return gn.Utils;case"image":return bn.Utils;case"texture-mesh":return hn.Utils}}e.getUtils=i;function s(u,p){return p==="instance"&&u.nonInstanceable?"group":p}e.getGranularity=s})(Jt||(Jt={}));const ad=1,id="Assigns sizes as defined by the shape object.",gi={};function od(e){return gi}function Rn(e,t){return{factory:Rn,granularity:"groupInstance",size:r=>qe.isLocation(r)?r.shape.getSize(r.group,r.instance):ad,props:t,description:id}}const Fl={name:"shape-group",label:"Shape Group",category:"",factory:Rn,getParams:od,defaultValues:k.getDefaultValues(gi),isApplicable:e=>!!e.shape},sd=he(13421772),ud="Assigns colors as defined by the shape object.",vi={};function cd(e){return vi}function wn(e,t){return{factory:wn,granularity:"groupInstance",color:r=>qe.isLocation(r)?r.shape.getColor(r.group,r.instance):sd,props:t,description:ud}}const Pl={name:"shape-group",label:"Shape Group",category:ri.Misc,factory:wn,getParams:cd,defaultValues:k.getDefaultValues(vi),isApplicable:e=>!!e.shape},fd={...bt,aPosition:ge("float32",3,0),elements:qt("uint32"),uBboxMin:G("v3"),uBboxMax:G("v3"),uBboxSize:G("v3"),uMaxSteps:G("i"),uStepScale:G("f"),uJumpLength:G("f"),uTransform:G("m4"),uGridDim:G("v3"),tTransferTex:me("image-uint8","alpha","ubyte","linear"),uTransferScale:G("f","material"),dGridTexType:ee("string",["2d","3d"]),uGridTexDim:G("v3"),tGridTex:me("texture","rgba","ubyte","linear"),uGridStats:G("v4"),uCellDim:G("v3"),uCartnToUnit:G("m4"),uUnitToCartn:G("m4"),dPackedGroup:ee("boolean"),dAxisOrder:ee("string",["012","021","102","120","201","210"]),dIgnoreLight:ee("boolean"),dCelShaded:ee("boolean"),dXrayShaded:ee("string",["off","on","inverted"]),meta:le("unknown")};function dd(e,t,r,n,i,s,u){const p={...pt,...gt,...vt,...ht,...fd};e.isWebGL2||(p.uMaxSteps=ee("number"));const m={...r,uObjectId:a.create(t),dLightCount:a.create(u.dLightCount),dColorMarker:a.create(u.dColorMarker)},h=yt(e,"triangles",hs,p,m,i,s);return _t(h,m,n)}const ld={...bt,aGroup:ge("float32",1,0),aPosition:ge("float32",3,0),aNormal:ge("float32",3,0),elements:qt("uint32"),dVaryingGroup:ee("boolean"),dFlatShaded:ee("boolean"),uDoubleSided:G("b","material"),dFlipSided:ee("boolean"),dIgnoreLight:ee("boolean"),dCelShaded:ee("boolean"),dXrayShaded:ee("string",["off","on","inverted"]),dTransparentBackfaces:ee("string",["off","on","opaque"]),uBumpFrequency:G("f","material"),uBumpAmplitude:G("f","material"),meta:le("unknown"),...Mr,...Wt};function md(e,t,r,n,i,s,u){const p={...pt,...gt,...vt,...ht,...ld},m={...r,uObjectId:a.create(t),dLightCount:a.create(u.dLightCount),dColorMarker:a.create(u.dColorMarker)},h=yt(e,"triangles",Ua,p,m,i,s);return _t(h,m,n)}const pd={...bt,...or,aGroup:ge("float32",1,0),aPosition:ge("float32",3,0),dPointSizeAttenuation:ee("boolean"),dPointStyle:ee("string",["square","circle","fuzzy"]),...Wt};function gd(e,t,r,n,i,s,u){const p={...pt,...gt,...vt,...ht,...pd},m={...r,uObjectId:a.create(t),dLightCount:a.create(u.dLightCount),dColorMarker:a.create(u.dColorMarker)},h=yt(e,"points",ls,p,m,i,s);return _t(h,m,n)}const vd={...bt,...or,aGroup:ge("float32",1,0),aMapping:ge("float32",2,0),aStart:ge("float32",3,0),aEnd:ge("float32",3,0),elements:qt("uint32"),dLineSizeAttenuation:ee("boolean"),uDoubleSided:G("b","material"),dFlipSided:ee("boolean"),stripCount:le("number"),stripOffsets:le("uint32"),...Wt};function hd(e,t,r,n,i,s,u){const p={...pt,...gt,...vt,...ht,...vd},m={...r,uObjectId:a.create(t),dLightCount:a.create(u.dLightCount),dColorMarker:a.create(u.dColorMarker)},h=yt(e,"triangles",vs,p,m,i,s);return _t(h,m,n)}const bd={...bt,...or,uTexDim:G("v2"),tPositionGroup:me("image-float32","rgba","float","nearest"),padding:le("number"),uDoubleSided:G("b","material"),dIgnoreLight:ee("boolean"),dCelShaded:ee("boolean"),dXrayShaded:ee("string",["off","on","inverted"]),dTransparentBackfaces:ee("string",["off","on","opaque"]),dSolidInterior:ee("boolean"),dClipPrimitive:ee("boolean"),dApproximate:ee("boolean"),uAlphaThickness:G("f"),uBumpFrequency:G("f","material"),uBumpAmplitude:G("f","material"),lodLevels:le("unknown"),centerBuffer:le("float32"),groupBuffer:le("float32"),...Mr,...Wt};function yd(e,t,r,n,i,s,u){const p={...pt,...gt,...vt,...ht,...bd},m={...r,uObjectId:a.create(t),dLightCount:a.create(u.dLightCount),dColorMarker:a.create(u.dColorMarker)},h=yt(e,"triangles",ms,p,m,i,s);return _t(h,m,n)}const _d={...bt,...or,aGroup:ge("float32",1,0),aPosition:ge("float32",3,0),aMapping:ge("float32",2,0),aDepth:ge("float32",1,0),elements:qt("uint32"),aTexCoord:ge("float32",2,0),tFont:me("image-uint8","alpha","ubyte","linear"),padding:le("number"),uBorderWidth:G("f","material"),uBorderColor:G("v3","material"),uOffsetX:G("f","material"),uOffsetY:G("f","material"),uOffsetZ:G("f","material"),uBackgroundColor:G("v3","material"),uBackgroundOpacity:G("f","material")};function Td(e,t,r,n,i,s,u){const p={...pt,...gt,...vt,...ht,..._d},m={...r,uObjectId:a.create(t),dLightCount:a.create(u.dLightCount),dColorMarker:a.create(u.dColorMarker)},h=yt(e,"triangles",gs,p,m,i,s);return _t(h,m,n)}const xd={...bt,uGeoTexDim:G("v2","buffered"),tPosition:me("texture","rgb","float","nearest"),tGroup:me("texture","alpha","float","nearest"),tNormal:me("texture","rgb","float","nearest"),dVaryingGroup:ee("boolean"),dFlatShaded:ee("boolean"),uDoubleSided:G("b","material"),dFlipSided:ee("boolean"),dIgnoreLight:ee("boolean"),dCelShaded:ee("boolean"),dXrayShaded:ee("string",["off","on","inverted"]),dTransparentBackfaces:ee("string",["off","on","opaque"]),uBumpFrequency:G("f","material"),uBumpAmplitude:G("f","material"),meta:le("unknown"),...Mr,...Wt};function Cd(e,t,r,n,i,s,u){const p={...pt,...gt,...vt,...ht,...xd},m={...r,uObjectId:a.create(t),dLightCount:a.create(u.dLightCount),dColorMarker:a.create(u.dColorMarker)},h=yt(e,"triangles",Ua,p,m,i,s);return _t(h,m,n)}const Sd={...bt,aGroup:ge("float32",1,0),aPosition:ge("float32",3,0),aUv:ge("float32",2,0),elements:qt("uint32"),uImageTexDim:G("v2"),tImageTex:me("image-uint8","rgba","ubyte","nearest"),tGroupTex:me("image-uint8","rgba","ubyte","nearest"),tValueTex:me("image-float32","alpha","float","linear"),uTrimType:G("i"),uTrimCenter:G("v3"),uTrimRotation:G("q"),uTrimScale:G("v3"),uTrimTransform:G("m4"),uIsoLevel:G("f"),dInterpolation:ee("string",["nearest","catmulrom","mitchell","bspline"])};function Ed(e,t,r,n,i,s,u){const p={...pt,...gt,...vt,...ht,...Sd},m={...r,uObjectId:a.create(t),dLightCount:a.create(u.dLightCount),dColorMarker:a.create(u.dColorMarker)},h=yt(e,"triangles",bs,p,m,i,s);return _t(h,m,n)}const Id={...bt,...or,aGroup:ge("float32",1,0),aStart:ge("float32",3,0),aEnd:ge("float32",3,0),aMapping:ge("float32",3,0),aScale:ge("float32",1,0),aCap:ge("float32",1,0),aColorMode:ge("float32",1,0),elements:qt("uint32"),padding:le("number"),uDoubleSided:G("b","material"),dIgnoreLight:ee("boolean"),dCelShaded:ee("boolean"),dXrayShaded:ee("string",["off","on","inverted"]),dTransparentBackfaces:ee("string",["off","on","opaque"]),dSolidInterior:ee("boolean"),uBumpFrequency:G("f","material"),uBumpAmplitude:G("f","material"),dDualColor:ee("boolean"),...Mr,...Wt};function Ad(e,t,r,n,i,s,u){const p={...pt,...gt,...vt,...ht,...Id},m={...r,uObjectId:a.create(t),dLightCount:a.create(u.dLightCount),dColorMarker:a.create(u.dColorMarker)},h=yt(e,"triangles",ps,p,m,i,s);return _t(h,m,n)}const Dd=Ve(0,2147483647),Rd=Ve(0,2147483647);function wd(e,t,r,n){return{id:Dd(),type:e,values:t,state:r,materialId:n}}function Ll(e,t,r,n){switch(t.type){case"mesh":return md(e,t.id,t.values,t.state,t.materialId,r,n);case"points":return gd(e,t.id,t.values,t.state,t.materialId,r,n);case"spheres":return yd(e,t.id,t.values,t.state,t.materialId,r,n);case"cylinders":return Ad(e,t.id,t.values,t.state,t.materialId,r,n);case"text":return Td(e,t.id,t.values,t.state,t.materialId,r,n);case"lines":return hd(e,t.id,t.values,t.state,t.materialId,r,n);case"direct-volume":return dd(e,t.id,t.values,t.state,t.materialId,r,n);case"image":return Ed(e,t.id,t.values,t.state,t.materialId,r,n);case"texture-mesh":return Cd(e,t.id,t.values,t.state,t.materialId,r,n)}er(t.type)}var St;(function(e){function t(h,y,x,f,c,o,d,g){return{id:Fi.create22(),name:h,sourceData:y,geometry:x,transforms:d||[ie.identity()],get groupCount(){return g??Jt.getGroupCount(x)},getColor:f,getSize:c,getLabel:o}}e.create=t;function r(h){return{color:wn({},{}),size:Rn({},{})}}e.getTheme=r;function n(h){const y=h.transforms.length,x=qe.Location(h),f=(c,o)=>(x.group=c,x.instance=o,x);return We(h.groupCount,y,1,f)}e.groupIterator=n;function i(h,y,x,f,c){const o=c&&c.aTransform.ref.value.length>=h.length*16?c.aTransform.ref.value:new Float32Array(h.length*16);for(let d=0,g=h.length;d<g;++d)ie.toArray(h[d],o,d*16);return ti(o,h.length,y,x,f,c)}e.createTransform=i;function s(h,y){const x=r(),f=Jt.getUtils(h.geometry),c=Rd(),o=n(h),d=i(h.transforms,h.geometry.boundingSphere,y.cellSize,y.batchSize),g=f.createValues(h.geometry,d,o,x,y),_=f.createRenderableState(y);return wd(h.geometry.kind,g,_,c)}e.createRenderObject=s;function u(h){return{kind:"shape-loci",shape:h}}e.Loci=u;function p(h){return!!h&&h.kind==="shape-loci"}e.isLoci=p;function m(h,y){return h.shape===y.shape}e.areLociEqual=m;function v(h){return h.shape.groupCount===0}e.isLociEmpty=v})(St||(St={}));var qe;(function(e){function t(f,c=0,o=0){return{kind:"group-location",shape:f,group:c,instance:o}}e.Location=t;function r(f){return!!f&&f.kind==="group-location"}e.isLocation=r;function n(f,c){return{kind:"group-loci",shape:f,groups:c}}e.Loci=n;function i(f){return!!f&&f.kind==="group-loci"}e.isLoci=i;function s(f,c){if(f.shape!==c.shape||f.groups.length!==c.groups.length)return!1;for(let o=0,d=f.groups.length;o<d;++o){const{ids:g,instance:_}=f.groups[o],{ids:l,instance:b}=c.groups[o];if(_!==b||!ce.areEqual(g,l))return!1}return!0}e.areLociEqual=s;function u(f){return p(f)===0}e.isLociEmpty=u;function p(f){let c=0;for(const o of f.groups)c+=ce.size(o.ids);return c}e.size=p;const m=new Bi,v=T.zero();function h(f,c,o,d){const{indices:g,offsets:_}=c;for(const{ids:l,instance:b}of f)ce.forEach(l,I=>{for(let C=_[I],A=_[I+1];C<A;++C)T.fromArray(v,o,g[C]*3),T.transformMat4(v,v,d[b]),m.includeStep(v)})}function y(f,c,o,d){const{indices:g,offsets:_}=c;for(const{ids:l,instance:b}of f)ce.forEach(l,I=>{for(let C=_[I],A=_[I+1];C<A;++C)T.fromArray(v,o,g[C]*3),T.transformMat4(v,v,d[b]),m.radiusStep(v)})}function x(f,c){c||(c=q()),m.reset();let o=0;const{geometry:d,transforms:g}=f.shape;if(d.kind==="mesh"||d.kind==="points"){const _=d.kind==="mesh"?d.vertexBuffer.ref.value:d.centerBuffer.ref.value;h(f.groups,d.groupMapping,_,g),m.finishedIncludeStep(),y(f.groups,d.groupMapping,_,g)}else if(d.kind==="lines"){const _=d.startBuffer.ref.value,l=d.endBuffer.ref.value;h(f.groups,d.groupMapping,_,g),h(f.groups,d.groupMapping,l,g),m.finishedIncludeStep(),y(f.groups,d.groupMapping,_,g),y(f.groups,d.groupMapping,l,g)}else if(d.kind==="spheres"||d.kind==="text"){const _=d.centerBuffer.ref.value;h(f.groups,d.groupMapping,_,g),m.finishedIncludeStep(),y(f.groups,d.groupMapping,_,g);for(const{ids:l,instance:b}of f.groups)ce.forEach(l,I=>{const C=f.shape.getSize(I,b);o<C&&(o=C)})}else return q.copy(c,d.boundingSphere);return T.copy(c.center,m.center),c.radius=Math.sqrt(m.radiusSq),q.expand(c,c,o),c}e.getBoundingSphere=x})(qe||(qe={}));const Bd={kind:"every-loci"};function yr(e){return!!e&&e.kind==="every-loci"}const Fd={kind:"empty-loci"};function _r(e){return!!e&&e.kind==="empty-loci"}function Tr(e){return!!e&&e.kind==="data-loci"}function hi(e,t){if(!On(e.data,t.data)||e.tag!==t.tag||e.elements.length!==t.elements.length)return!1;for(let r=0,n=e.elements.length;r<n;++r)if(!On(e.elements[r],t.elements[r]))return!1;return!0}function bi(e){return e.elements.length===0}function Pd(e,t,r,n,i){return{kind:"data-loci",tag:e,data:t,elements:r,getBoundingSphere:n,getLabel:i}}var _n;(function(e){const t=new $t("98");function r(o){const d=o.loci.map(g=>p(g)).filter(g=>!!g);t.reset();for(const g of d)t.includePositionRadius(g.center,g.radius);t.finishedIncludeStep();for(const g of d)t.radiusPositionRadius(g.center,g.radius);return t.getSphere()}e.getBundleBoundingSphere=r;function n(o,d){return yr(o)&&yr(d)||_r(o)&&_r(d)?!0:Tr(o)&&Tr(d)?hi(o,d):ze.isLoci(o)&&ze.isLoci(d)?ze.areLociEqual(o,d):fe.is(o)&&fe.is(d)?fe.areEqual(o,d):Ke.isLoci(o)&&Ke.isLoci(d)?Ke.areLociEqual(o,d):St.isLoci(o)&&St.isLoci(d)?St.areLociEqual(o,d):qe.isLoci(o)&&qe.isLoci(d)?qe.areLociEqual(o,d):de.isLoci(o)&&de.isLoci(d)?de.areLociEqual(o,d):de.Isosurface.isLoci(o)&&de.Isosurface.isLoci(d)?de.Isosurface.areLociEqual(o,d):de.Cell.isLoci(o)&&de.Cell.isLoci(d)?de.Cell.areLociEqual(o,d):de.Segment.isLoci(o)&&de.Segment.isLoci(d)?de.Segment.areLociEqual(o,d):!1}e.areEqual=n;function i(o){return!!o&&o.kind==="every-loci"}e.isEvery=i;function s(o){return yr(o)?!1:_r(o)?!0:Tr(o)?bi(o):ze.isLoci(o)?ze.isLociEmpty(o):fe.is(o)?fe.isEmpty(o):Ke.isLoci(o)?Ke.isLociEmpty(o):St.isLoci(o)?St.isLociEmpty(o):qe.isLoci(o)?qe.isLociEmpty(o):de.isLoci(o)?de.isLociEmpty(o):de.Isosurface.isLoci(o)?de.Isosurface.isLociEmpty(o):de.Cell.isLoci(o)?de.Cell.isLociEmpty(o):de.Segment.isLoci(o)?de.Segment.isLociEmpty(o):!1}e.isEmpty=s;function u(o,d){return d instanceof ze&&(fe.is(o)?o=fe.remap(o,d):ze.isLoci(o)?o=ze.remapLoci(o,d):Ke.isLoci(o)&&(o=Ke.remapLoci(o,d))),o}e.remap=u;function p(o,d){var g;if(!(o.kind==="every-loci"||o.kind==="empty-loci")){if(d||(d=q()),o.kind==="structure-loci")return q.copy(d,o.structure.boundary.sphere);if(o.kind==="element-loci")return q.copy(d,fe.getBoundary(o).sphere);if(o.kind==="bond-loci")return Ke.getBoundingSphere(o,d);if(o.kind==="shape-loci")return q.copy(d,o.shape.geometry.boundingSphere);if(o.kind==="group-loci")return qe.getBoundingSphere(o,d);if(o.kind==="data-loci")return(g=o.getBoundingSphere)===null||g===void 0?void 0:g.call(o,d);if(o.kind==="volume-loci")return de.getBoundingSphere(o.volume,d);if(o.kind==="isosurface-loci")return de.Isosurface.getBoundingSphere(o.volume,o.isoValue,d);if(o.kind==="cell-loci")return de.Cell.getBoundingSphere(o.volume,o.elements,d);if(o.kind==="segment-loci")return de.Segment.getBoundingSphere(o.volume,o.elements,d)}}e.getBoundingSphere=p;const m=q.zero();function v(o,d){const g=p(o,m);return g?T.copy(d||T(),g.center):void 0}e.getCenter=v;function h(o){if(!(o.kind==="every-loci"||o.kind==="empty-loci")){if(o.kind==="structure-loci")return fe.getPrincipalAxes(ze.toStructureElementLoci(o.structure));if(o.kind==="element-loci")return fe.getPrincipalAxes(o);if(o.kind==="bond-loci")return;if(o.kind==="shape-loci")return;if(o.kind==="group-loci")return;if(o.kind==="data-loci")return;if(o.kind==="volume-loci")return;if(o.kind==="isosurface-loci")return;if(o.kind==="cell-loci")return;if(o.kind==="segment-loci")return}}e.getPrincipalAxes=h;const y={element:o=>o,residue:o=>fe.is(o)?fe.extendToWholeResidues(o,!0):o,chain:o=>fe.is(o)?fe.extendToWholeChains(o):o,entity:o=>fe.is(o)?fe.extendToWholeEntities(o):o,model:o=>fe.is(o)?fe.extendToWholeModels(o):o,operator:o=>fe.is(o)?fe.extendToWholeOperators(o):o,structure:o=>fe.is(o)?ze.toStructureElementLoci(o.structure):qe.isLoci(o)?St.Loci(o.shape):de.Cell.isLoci(o)?de.Loci(o.volume,Mn.ofLength(o.volume.instances.length)):de.Isosurface.isLoci(o)?de.Loci(o.volume,Mn.ofLength(o.volume.instances.length)):o,elementInstances:o=>fe.is(o)?fe.extendToAllInstances(o):o,residueInstances:o=>fe.is(o)?fe.extendToAllInstances(fe.extendToWholeResidues(o,!0)):o,chainInstances:o=>fe.is(o)?fe.extendToAllInstances(fe.extendToWholeChains(o)):o};e.GranularityOptions=k.objectToOptions(y,o=>{switch(o){case"element":return"Atom/Coarse Element";case"elementInstances":return["Atom/Coarse Element Instances","With Symmetry"];case"structure":return"Structure/Shape";default:return o.indexOf("Instances")?[xr(o),"With Symmetry"]:xr(o)}});function x(o){return o.replace("Instances","")}e.simpleGranularity=x;function f(o,d){return y[d](o)}e.applyGranularity=f;function c(o,d,g=!1){return(d!=="element"||g)&&Ke.isLoci(o)&&(o=Ke.toStructureElementLoci(o)),ze.isLoci(o)&&(o=ze.toStructureElementLoci(o.structure)),fe.is(o)&&(o=fe.remap(o,o.structure.root)),d&&(o=f(o,d)),o}e.normalize=c})(_n||(_n={}));const Ol=Object.freeze(Object.defineProperty({__proto__:null,DataLoci:Pd,EmptyLoci:Fd,EveryLoci:Bd,get Loci(){return _n},areDataLociEqual:hi,isDataLoci:Tr,isDataLociEmpty:bi,isEmptyLoci:_r,isEveryLoci:yr},Symbol.toStringTag,{value:"Module"}));export{nr as $,Rl as A,ma as B,ri as C,Cl as D,xl as E,Al as F,Oe as G,El as H,Kt as I,pn as J,It as K,_n as L,dn as M,Kd as N,Vn as O,ui as P,X as Q,Yd as R,Na as S,mn as T,ai as U,de as V,Pl as W,Qd as X,Fl as Y,We as Z,wr as _,un as a,Xd as a$,Te as a0,K as a1,$d as a2,ot as a3,Hf as a4,$f as a5,Qf as a6,Yf as a7,G as a8,ee as a9,Ie as aA,el as aB,nl as aC,ll as aD,cl as aE,ol as aF,gl as aG,Fd as aH,qe as aI,wd as aJ,Ae as aK,Jt as aL,st as aM,ar as aN,Rd as aO,xe as aP,Rr as aQ,Ll as aR,Hd as aS,we as aT,pi as aU,Jf as aV,Sl as aW,ci as aX,Pd as aY,Su as aZ,Wd as a_,me as aa,ge as ab,le as ac,Nf as ad,_r as ae,yr as af,Bd as ag,eo as ah,rl as ai,tl as aj,Jd as ak,il as al,al as am,$c as an,Yc as ao,pl as ap,ml as aq,Jc as ar,dl as as,fl as at,ul as au,sl as av,hl as aw,vl as ax,tf as ay,kc as az,Br as b,Ud as b0,Tr as b1,ti as b2,vn as b3,yn as b4,ln as b5,gn as b6,hn as b7,bn as b8,Gc as b9,At as ba,Ta as bb,Vt as bc,Pr as bd,Ht as be,Xc as bf,xf as bg,Gt as bh,bl as bi,yl as bj,jd as bk,Il as bl,Zd as bm,rd as bn,Ye as bo,jt as bp,wl as bq,Bl as br,Ol as bs,nn as c,rn as d,on as e,kd as f,Gd as g,an as h,at as i,Yt as j,Nd as k,Vd as l,ji as m,zd as n,Ui as o,Qi as p,_l as q,Gi as r,af as s,of as t,Tl as u,Qt as v,An as w,qd as x,St as y,Dl as z};
