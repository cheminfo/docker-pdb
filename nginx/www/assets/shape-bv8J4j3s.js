import{b as un,r as lr,S as W,l as a,V as ae,J as ga,u as va,ae as oi,d as ce,D as pe,E as wt,O as ue,aj as ha,P as k,a7 as ci,T as si,s as _n,F as xt,ar as ui,ay as fn,av as fi,aw as di,ax as li,af as mi,al as Tn,G as pi}from"./boundary-helper-KH-LRh_7.js";import{R as gi,U as vi}from"./assets-0zqvbAZd.js";import{V as _,M as ie,f as ba,g as et,a as Et,Q as Ke,E as ya,c as J,n as hi,s as xn,T as We,e as bi,o as Cn}from"./unique-array-CoX9F7cP.js";import{C as ge,a as yi}from"./color-Uxx8oQwD.js";import{h as Ge,a as oe,n as Bt,i as Fe,S as _a,T as Ta}from"./progress-CNHmJUTQ.js";import{a as Ht,i as _i}from"./type-helpers-DMLNhE_w.js";import{f as qr,a as Xr,b as Hr,_ as _r}from"./index-DQwomA__.js";import{i as Sn,d as xa,b as Ti,c as dn,e as xi,l as Ct}from"./misc-xDrx1QBi.js";function Je(e){return typeof e=="function"}function Ca(e){var t=function(n){Error.call(n),n.stack=new Error().stack},r=e(t);return r.prototype=Object.create(Error.prototype),r.prototype.constructor=r,r}var Ir=Ca(function(e){return function(r){e(this),this.message=r?r.length+` errors occurred during unsubscription:
`+r.map(function(n,i){return i+1+") "+n.toString()}).join(`
  `):"",this.name="UnsubscriptionError",this.errors=r}});function $r(e,t){if(e){var r=e.indexOf(t);0<=r&&e.splice(r,1)}}var Tr=(function(){function e(t){this.initialTeardown=t,this.closed=!1,this._parentage=null,this._finalizers=null}return e.prototype.unsubscribe=function(){var t,r,n,i,o;if(!this.closed){this.closed=!0;var s=this._parentage;if(s)if(this._parentage=null,Array.isArray(s))try{for(var p=qr(s),m=p.next();!m.done;m=p.next()){var T=m.value;T.remove(this)}}catch(l){t={error:l}}finally{try{m&&!m.done&&(r=p.return)&&r.call(p)}finally{if(t)throw t.error}}else s.remove(this);var v=this.initialTeardown;if(Je(v))try{v()}catch(l){o=l instanceof Ir?l.errors:[l]}var y=this._finalizers;if(y){this._finalizers=null;try{for(var x=qr(y),f=x.next();!f.done;f=x.next()){var c=f.value;try{En(c)}catch(l){o=o??[],l instanceof Ir?o=Xr(Xr([],Hr(o)),Hr(l.errors)):o.push(l)}}}catch(l){n={error:l}}finally{try{f&&!f.done&&(i=x.return)&&i.call(x)}finally{if(n)throw n.error}}}if(o)throw new Ir(o)}},e.prototype.add=function(t){var r;if(t&&t!==this)if(this.closed)En(t);else{if(t instanceof e){if(t.closed||t._hasParent(this))return;t._addParent(this)}(this._finalizers=(r=this._finalizers)!==null&&r!==void 0?r:[]).push(t)}},e.prototype._hasParent=function(t){var r=this._parentage;return r===t||Array.isArray(r)&&r.includes(t)},e.prototype._addParent=function(t){var r=this._parentage;this._parentage=Array.isArray(r)?(r.push(t),r):r?[r,t]:t},e.prototype._removeParent=function(t){var r=this._parentage;r===t?this._parentage=null:Array.isArray(r)&&$r(r,t)},e.prototype.remove=function(t){var r=this._finalizers;r&&$r(r,t),t instanceof e&&t._removeParent(this)},e.EMPTY=(function(){var t=new e;return t.closed=!0,t})(),e})(),Sa=Tr.EMPTY;function Ea(e){return e instanceof Tr||e&&"closed"in e&&Je(e.remove)&&Je(e.add)&&Je(e.unsubscribe)}function En(e){Je(e)?e():e.unsubscribe()}var Ci={Promise:void 0},Si={setTimeout:function(e,t){for(var r=[],n=2;n<arguments.length;n++)r[n-2]=arguments[n];return setTimeout.apply(void 0,Xr([e,t],Hr(r)))},clearTimeout:function(e){return clearTimeout(e)},delegate:void 0};function Ei(e){Si.setTimeout(function(){throw e})}function An(){}function dr(e){e()}var Aa=(function(e){_r(t,e);function t(r){var n=e.call(this)||this;return n.isStopped=!1,r?(n.destination=r,Ea(r)&&r.add(n)):n.destination=Di,n}return t.create=function(r,n,i){return new Yr(r,n,i)},t.prototype.next=function(r){this.isStopped||this._next(r)},t.prototype.error=function(r){this.isStopped||(this.isStopped=!0,this._error(r))},t.prototype.complete=function(){this.isStopped||(this.isStopped=!0,this._complete())},t.prototype.unsubscribe=function(){this.closed||(this.isStopped=!0,e.prototype.unsubscribe.call(this),this.destination=null)},t.prototype._next=function(r){this.destination.next(r)},t.prototype._error=function(r){try{this.destination.error(r)}finally{this.unsubscribe()}},t.prototype._complete=function(){try{this.destination.complete()}finally{this.unsubscribe()}},t})(Tr),Ai=(function(){function e(t){this.partialObserver=t}return e.prototype.next=function(t){var r=this.partialObserver;if(r.next)try{r.next(t)}catch(n){tr(n)}},e.prototype.error=function(t){var r=this.partialObserver;if(r.error)try{r.error(t)}catch(n){tr(n)}else tr(t)},e.prototype.complete=function(){var t=this.partialObserver;if(t.complete)try{t.complete()}catch(r){tr(r)}},e})(),Yr=(function(e){_r(t,e);function t(r,n,i){var o=e.call(this)||this,s;return Je(r)||!r?s={next:r??void 0,error:n??void 0,complete:i??void 0}:s=r,o.destination=new Ai(s),o}return t})(Aa);function tr(e){Ei(e)}function Ii(e){throw e}var Di={closed:!0,next:An,error:Ii,complete:An},Ri=(function(){return typeof Symbol=="function"&&Symbol.observable||"@@observable"})();function Bi(e){return e}function wi(e){return e.length===0?Bi:e.length===1?e[0]:function(r){return e.reduce(function(n,i){return i(n)},r)}}var In=(function(){function e(t){t&&(this._subscribe=t)}return e.prototype.lift=function(t){var r=new e;return r.source=this,r.operator=t,r},e.prototype.subscribe=function(t,r,n){var i=this,o=Pi(t)?t:new Yr(t,r,n);return dr(function(){var s=i,p=s.operator,m=s.source;o.add(p?p.call(o,m):m?i._subscribe(o):i._trySubscribe(o))}),o},e.prototype._trySubscribe=function(t){try{return this._subscribe(t)}catch(r){t.error(r)}},e.prototype.forEach=function(t,r){var n=this;return r=Dn(r),new r(function(i,o){var s=new Yr({next:function(p){try{t(p)}catch(m){o(m),s.unsubscribe()}},error:o,complete:i});n.subscribe(s)})},e.prototype._subscribe=function(t){var r;return(r=this.source)===null||r===void 0?void 0:r.subscribe(t)},e.prototype[Ri]=function(){return this},e.prototype.pipe=function(){for(var t=[],r=0;r<arguments.length;r++)t[r]=arguments[r];return wi(t)(this)},e.prototype.toPromise=function(t){var r=this;return t=Dn(t),new t(function(n,i){var o;r.subscribe(function(s){return o=s},function(s){return i(s)},function(){return n(o)})})},e.create=function(t){return new e(t)},e})();function Dn(e){var t;return(t=e??Ci.Promise)!==null&&t!==void 0?t:Promise}function Fi(e){return e&&Je(e.next)&&Je(e.error)&&Je(e.complete)}function Pi(e){return e&&e instanceof Aa||Fi(e)&&Ea(e)}var Oi=Ca(function(e){return function(){e(this),this.name="ObjectUnsubscribedError",this.message="object unsubscribed"}}),Qr=(function(e){_r(t,e);function t(){var r=e.call(this)||this;return r.closed=!1,r.currentObservers=null,r.observers=[],r.isStopped=!1,r.hasError=!1,r.thrownError=null,r}return t.prototype.lift=function(r){var n=new Rn(this,this);return n.operator=r,n},t.prototype._throwIfClosed=function(){if(this.closed)throw new Oi},t.prototype.next=function(r){var n=this;dr(function(){var i,o;if(n._throwIfClosed(),!n.isStopped){n.currentObservers||(n.currentObservers=Array.from(n.observers));try{for(var s=qr(n.currentObservers),p=s.next();!p.done;p=s.next()){var m=p.value;m.next(r)}}catch(T){i={error:T}}finally{try{p&&!p.done&&(o=s.return)&&o.call(s)}finally{if(i)throw i.error}}}})},t.prototype.error=function(r){var n=this;dr(function(){if(n._throwIfClosed(),!n.isStopped){n.hasError=n.isStopped=!0,n.thrownError=r;for(var i=n.observers;i.length;)i.shift().error(r)}})},t.prototype.complete=function(){var r=this;dr(function(){if(r._throwIfClosed(),!r.isStopped){r.isStopped=!0;for(var n=r.observers;n.length;)n.shift().complete()}})},t.prototype.unsubscribe=function(){this.isStopped=this.closed=!0,this.observers=this.currentObservers=null},Object.defineProperty(t.prototype,"observed",{get:function(){var r;return((r=this.observers)===null||r===void 0?void 0:r.length)>0},enumerable:!1,configurable:!0}),t.prototype._trySubscribe=function(r){return this._throwIfClosed(),e.prototype._trySubscribe.call(this,r)},t.prototype._subscribe=function(r){return this._throwIfClosed(),this._checkFinalizedStatuses(r),this._innerSubscribe(r)},t.prototype._innerSubscribe=function(r){var n=this,i=this,o=i.hasError,s=i.isStopped,p=i.observers;return o||s?Sa:(this.currentObservers=null,p.push(r),new Tr(function(){n.currentObservers=null,$r(p,r)}))},t.prototype._checkFinalizedStatuses=function(r){var n=this,i=n.hasError,o=n.thrownError,s=n.isStopped;i?r.error(o):s&&r.complete()},t.prototype.asObservable=function(){var r=new In;return r.source=this,r},t.create=function(r,n){return new Rn(r,n)},t})(In),Rn=(function(e){_r(t,e);function t(r,n){var i=e.call(this)||this;return i.destination=r,i.source=n,i}return t.prototype.next=function(r){var n,i;(i=(n=this.destination)===null||n===void 0?void 0:n.next)===null||i===void 0||i.call(n,r)},t.prototype.error=function(r){var n,i;(i=(n=this.destination)===null||n===void 0?void 0:n.error)===null||i===void 0||i.call(n,r)},t.prototype.complete=function(){var r,n;(n=(r=this.destination)===null||r===void 0?void 0:r.complete)===null||n===void 0||n.call(r)},t.prototype._subscribe=function(r){var n,i;return(i=(n=this.source)===null||n===void 0?void 0:n.subscribe(r))!==null&&i!==void 0?i:Sa},t})(Qr);function Li(e,t){for(let r=0,n=t*3;r<n;r+=3){const i=e[r],o=e[r+1],s=e[r+2],p=1/Math.sqrt(i*i+o*o+s*s);e[r]=i*p,e[r+1]=o*p,e[r+2]=s*p}return e}const Le=_();function Ft(e,t,r,n){for(let i=0,o=n*3;i<o;i+=3)_.fromArray(Le,t,r+i),_.transformMat4(Le,Le,e),_.toArray(Le,t,r+i)}function Mi(e,t,r,n){for(let i=0,o=n*3;i<o;i+=3)_.fromArray(Le,t,r+i),_.transformMat3(Le,Le,e),_.toArray(Le,t,r+i)}function Ad(e,t){for(let r=0,n=e.length;r<n;r+=3)_.fromArray(Le,e,r),_.normalize(Le,Le),_.scale(Le,Le,t),_.toArray(Le,e,r)}const Bn=_(),Dr=_(),wn=_(),ke=_(),Fn=_();function Ni(e,t,r,n,i){for(let o=0,s=i*3;o<s;o+=3){const p=t[o]*3,m=t[o+1]*3,T=t[o+2]*3;_.fromArray(Bn,e,p),_.fromArray(Dr,e,m),_.fromArray(wn,e,T),_.sub(ke,wn,Dr),_.sub(Fn,Bn,Dr),_.cross(ke,ke,Fn),r[p]+=ke[0],r[p+1]+=ke[1],r[p+2]+=ke[2],r[m]+=ke[0],r[m+1]+=ke[1],r[m+2]+=ke[2],r[T]+=ke[0],r[T+1]+=ke[1],r[T+2]+=ke[2]}return Li(r,n)}function Pt(e,t,r=1){const n=un(e),i=new Int32Array(n+2),o=new Int32Array(t),s=new Int32Array(t);for(let T=0,v=t*r;T<v;T+=r)++s[e[T]];let p=0;for(let T=0;T<t;T++)i[T]=p,p+=s[T];i[t]=p;const m=new Int32Array(p);for(let T=0,v=t*r;T<v;T+=r){const y=e[T],x=i[y]+o[y];m[x]=T,++o[y]}return{indices:m,offsets:i}}const Rr=_.fromArray,rr=_.transformMat4Offset;function Gi(e,t){e=Math.max(e,2);const r=Math.sqrt(e);let n=Math.ceil(r);n=n+(t-n%t)%t;const i=n>0?Math.ceil(e/n):0;return{width:n,height:i,length:n*i*t}}function ye(e,t,r,n){const{length:i,width:o,height:s}=Gi(e,t);return n=n&&n.length>=i?n:new r(i),{array:n,width:o,height:s}}const Ve=_(),ki=new lr("14"),Vi=new lr("98");function Ia(e){return e>1e5?ki:Vi}function yt(e,t,r){const n=r*3,i=Ia(t);i.reset();for(let s=0,p=t*3;s<p;s+=n)Rr(Ve,e,s),i.includePosition(Ve);i.finishedIncludeStep();for(let s=0,p=t*3;s<p;s+=n)Rr(Ve,e,s),i.radiusPosition(Ve);const o=i.getSphere();if(t<=14){const s=[];for(let p=0,m=t*3;p<m;p+=n)s.push(Rr(_(),e,p));W.setExtrema(o,s)}return o}const Br=ie();function Se(e,t,r,n){if(r===1){ie.fromArray(Br,t,n);const m=W.clone(e);return ie.isIdentity(Br)?m:W.transform(m,m,Br)}const i=Ia(r);i.reset();const{center:o,radius:s,extrema:p}=e;if(p&&r<=14){for(let m=0,T=r;m<T;++m)for(const v of p)rr(Ve,v,t,0,0,m*16+n),i.includePosition(Ve);i.finishedIncludeStep();for(let m=0,T=r;m<T;++m)for(const v of p)rr(Ve,v,t,0,0,m*16+n),i.radiusPosition(Ve)}else{for(let m=0,T=r;m<T;++m)rr(Ve,o,t,0,0,m*16+n),i.includePositionRadius(Ve,s);i.finishedIncludeStep();for(let m=0,T=r;m<T;++m)rr(Ve,o,t,0,0,m*16+n),i.radiusPositionRadius(Ve,s)}return i.getSphere()}const Re=new Uint8Array(772);Re[1]=1;Re[2]=1;Re[3]=1;Re[256]=1;Re[512]=1;Re[768]=1;Re[257]=2;Re[513]=2;Re[769]=2;Re[258]=2;Re[514]=2;Re[770]=2;Re[259]=2;Re[515]=2;Re[771]=2;function zi(e,t){if(t===0)return 0;const r=new Uint32Array(e.buffer,0,e.buffer.byteLength>>2),n=t-4>>2,i=4*n;let o=0;if(n<0)for(let s=0;s<t;++s)o+=e[s]&&1;else{for(let s=0;s<n;++s){const p=r[s];o+=Re[p&65535]+Re[p>>16]}for(let s=i;s<t;++s)o+=e[s]&&1}return o/t}function Ee(e,t,r){const n=ye(Math.max(1,e),1,Uint8Array,r&&r.tMarker.ref.value.array),i=zi(n.array,e),o=i===0?0:-1;return r?(a.updateIfChanged(r.uMarker,0),a.update(r.tMarker,n),a.update(r.uMarkerTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.markerAverage,i),a.updateIfChanged(r.markerStatus,o),a.updateIfChanged(r.dMarkerType,t),r):{uMarker:a.create(0),tMarker:a.create(n),uMarkerTexDim:a.create(ae.create(n.width,n.height)),markerAverage:a.create(i),markerStatus:a.create(o),dMarkerType:a.create(t)}}const qe={kind:"null-location"};function Id(e,t,r){return{kind:"data-location",tag:e,data:t,element:r}}function ze(e,t,r,n,i=!1,o=()=>!1,s){if(e%r!==0)throw new Error("incompatible groupCount and stride");const p={location:qe,location2:qe,index:0,groupIndex:0,instanceIndex:0,isSecondary:!1};let m=p.groupIndex<e,T=!1,v=0,y=0,x=!1;const f=!!s;return{get hasNext(){return m},get isNextNewInstance(){return T},groupCount:e,instanceCount:t,count:e*t,stride:r,nonInstanceable:i,hasLocation2:f,move(){return m&&(p.groupIndex=v,p.instanceIndex=y,p.index=y*e+v,p.location=n(v,x?-1:y),f&&(p.location2=s(v,x?-1:y)),p.isSecondary=o(v,x?-1:y),v+=r,v===e?(++y,T=!0,y<t&&(v=0)):T=!1,m=v<e),p},reset(){p.location=qe,p.location2=qe,p.index=0,p.groupIndex=0,p.instanceIndex=0,p.isSecondary=!1,m=p.groupIndex<e,T=!1,v=0,y=0,x=!1},skipInstance(){m&&p.instanceIndex===y&&(++y,v=0,m=y<t)},voidInstances(){x=!0}}}const Dd={get hasNext(){return!1},get isNextNewInstance(){return!1},groupCount:0,instanceCount:0,count:0,stride:0,nonInstanceable:!1,hasLocation2:!1,move(){return{location:qe,location2:qe,index:0,groupIndex:0,instanceIndex:0,isSecondary:!1}},reset(){},skipInstance(){},voidInstances(){}};function Tt(e,t){return{kind:"position-location",position:e?_.clone(e):_(),normal:t?_.clone(t):_()}}function Rd(e){return!!e&&e.kind==="position-location"}const Da=Ge();function Ui(e,t){switch(t){case e.FRAMEBUFFER_COMPLETE:return"complete";case e.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return"incomplete attachment";case e.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return"incomplete missing attachment";case e.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return"incomplete dimensions";case e.FRAMEBUFFER_UNSUPPORTED:return"unsupported"}if(K(e))switch(t){case e.FRAMEBUFFER_INCOMPLETE_MULTISAMPLE:return"incomplete multisample";case e.RENDERBUFFER_SAMPLES:return"renderbuffer samples"}return"unknown error"}function mr(e,t){const r=e.checkFramebufferStatus(e.FRAMEBUFFER);if(r!==e.FRAMEBUFFER_COMPLETE){const n=Ui(e,r);throw new Error(`Framebuffer status: ${n}${t?` (${t})`:""}`)}}function Pn(e){const t=e.createFramebuffer();if(t===null)throw new Error("Could not create WebGL framebuffer");return t}function ji(e){let t=Pn(e),r=!1;return{id:Da(),bind:()=>e.bindFramebuffer(e.FRAMEBUFFER,t),reset:()=>{t=Pn(e)},destroy:()=>{r||(e.deleteFramebuffer(t),r=!0)}}}function Wi(){return{id:Da(),bind:()=>{},reset:()=>{},destroy:()=>{}}}function Ra(e){const t=bs(e);if(t===null)throw new Error('Could not find support for "instanced_arrays"');const r=_s(e);if(r===null)throw new Error('Could not find support for "element_index_uint"');const n=ys(e);if(n===null)throw new Error('Could not find support for "standard_derivatives"');const i=xs(e);oe&&i===null&&console.log('Could not find support for "texture_float"');const o=Cs(e);oe&&o===null&&console.log('Could not find support for "texture_float_linear"');const s=Ss(e);oe&&s===null&&console.log('Could not find support for "texture_half_float"');const p=Es(e);oe&&p===null&&console.log('Could not find support for "texture_half_float_linear"');const m=Ps(e);oe&&m===null&&console.log('Could not find support for "depth_texture"');const T=As(e);oe&&T===null&&console.log('Could not find support for "blend_minmax"');const v=Ts(e);oe&&v===null&&console.log('Could not find support for "vertex_array_object"');const y=Is(e);oe&&y===null&&console.log('Could not find support for "frag_depth"');const x=Ds(e);oe&&x===null&&console.log('Could not find support for "color_buffer_float"');const f=Rs(e);oe&&f===null&&console.log('Could not find support for "color_buffer_half_float"');const c=Bs(e);oe&&c===null&&console.log('Could not find support for "draw_buffers"');const l=ws(e);oe&&l===null&&console.log('Could not find support for "draw_buffers_indexed"');const d=Fs(e);oe&&d===null&&console.log('Could not find support for "shader_texture_lod"');const g=Os(e);oe&&g===null&&console.log('Could not find support for "sRGB"');const b=Ls(e);oe&&b===null&&console.log('Could not find support for "disjoint_timer_query"');const u=Ms(e);oe&&u===null&&console.log('Could not find support for "multi_draw"');const h=Ns(e);oe&&h===null&&console.log('Could not find support for "draw_instanced_base_vertex_base_instance"');const A=Gs(e);oe&&A===null&&console.log('Could not find support for "multi_draw_instanced_base_vertex_base_instance"');const C=ks(e);oe&&C===null&&console.log('Could not find support for "parallel_shader_compile"');const I=Vs(e);oe&&I===null&&console.log('Could not find support for "fbo_render_mipmap"');const D=zs(e);oe&&D===null&&console.log('Could not find support for "provoking_vertex"');const B=Us(e);oe&&B===null&&console.log('Could not find support for "clip_cull_distance"');const R=js(e);oe&&R===null&&console.log('Could not find support for "conservative_depth"');const S=Ws(e);oe&&S===null&&console.log('Could not find support for "stencil_texturing"');const E=qs(e);oe&&E===null&&console.log('Could not find support for "clip_control"');const w=Xs(e);oe&&w===null&&console.log('Could not find support for "render_snorm"');const O=Hs(e);oe&&O===null&&console.log('Could not find support for "render_shared_exponent"');const F=$s(e);oe&&F===null&&console.log('Could not find support for "texture_norm16"');const L=Ys(e);oe&&L===null&&console.log('Could not find support for "depth_clamp"');const N=Qs(e);oe&&N===null&&console.log('Could not find support for "multiview2"');const z=Zs(e);return{instancedArrays:t,standardDerivatives:n,elementIndexUint:r,textureFloat:i,textureFloatLinear:o,textureHalfFloat:s,textureHalfFloatLinear:p,depthTexture:m,blendMinMax:T,vertexArrayObject:v,fragDepth:y,colorBufferFloat:x,colorBufferHalfFloat:f,drawBuffers:c,drawBuffersIndexed:l,shaderTextureLod:d,sRGB:g,disjointTimerQuery:b,multiDraw:u,drawInstancedBaseVertexBaseInstance:h,multiDrawInstancedBaseVertexBaseInstance:A,parallelShaderCompile:C,fboRenderMipmap:I,provokingVertex:D,clipCullDistance:B,conservativeDepth:R,stencilTexturing:S,clipControl:E,renderSnorm:w,renderSharedExponent:O,textureNorm16:F,depthClamp:L,multiview2:N,noNonInstancedActiveAttribs:z}}function qi(e,t){const r=Ra(e);ga(t,(n,i)=>{i==="noNonInstancedActiveAttribs"?t.noNonInstancedActiveAttribs=r.noNonInstancedActiveAttribs:n!==null&&(r[i]===null?t[i]=null:Object.assign(n,r[i]))})}function Xi(e,t){let r={},n=e.getParameter(e.FRONT_FACE),i=e.getParameter(e.CULL_FACE_MODE),o=e.getParameter(e.DEPTH_WRITEMASK),s=e.getParameter(e.DEPTH_CLEAR_VALUE),p=e.getParameter(e.DEPTH_FUNC),m=e.getParameter(e.COLOR_WRITEMASK),T=e.getParameter(e.COLOR_CLEAR_VALUE),v=e.getParameter(e.BLEND_SRC_RGB),y=e.getParameter(e.BLEND_DST_RGB),x=e.getParameter(e.BLEND_SRC_ALPHA),f=e.getParameter(e.BLEND_DST_ALPHA),c=e.getParameter(e.BLEND_COLOR),l=e.getParameter(e.BLEND_EQUATION_RGB),d=e.getParameter(e.BLEND_EQUATION_ALPHA),g=e.getParameter(e.STENCIL_FUNC),b=e.getParameter(e.STENCIL_VALUE_MASK),u=e.getParameter(e.STENCIL_REF),h=e.getParameter(e.STENCIL_BACK_FUNC),A=e.getParameter(e.STENCIL_BACK_VALUE_MASK),C=e.getParameter(e.STENCIL_BACK_REF),I=e.getParameter(e.STENCIL_WRITEMASK),D=e.getParameter(e.STENCIL_BACK_WRITEMASK),B=e.getParameter(e.STENCIL_FAIL),R=e.getParameter(e.STENCIL_PASS_DEPTH_PASS),S=e.getParameter(e.STENCIL_PASS_DEPTH_FAIL),E=e.getParameter(e.STENCIL_BACK_FAIL),w=e.getParameter(e.STENCIL_BACK_PASS_DEPTH_PASS),O=e.getParameter(e.STENCIL_BACK_PASS_DEPTH_FAIL),F=e.getParameter(e.MAX_VERTEX_ATTRIBS);const L=[];let N=e.getParameter(e.VIEWPORT),z=e.getParameter(e.SCISSOR_BOX),V=t.clipControl?e.getParameter(t.clipControl.CLIP_ORIGIN):-1,$=t.clipControl?e.getParameter(t.clipControl.CLIP_DEPTH_MODE):-1;const H=()=>{for(let P=0;P<F;++P)L[P]=0};return H(),{currentProgramId:-1,currentMaterialId:-1,currentRenderItemId:-1,enable:P=>{r[P]!==!0&&(e.enable(P),r[P]=!0)},disable:P=>{r[P]!==!1&&(e.disable(P),r[P]=!1)},frontFace:P=>{P!==n&&(e.frontFace(P),n=P)},cullFace:P=>{P!==i&&(e.cullFace(P),i=P)},depthMask:P=>{P!==o&&(e.depthMask(P),o=P)},clearDepth:P=>{P!==s&&(e.clearDepth(P),s=P)},depthFunc:P=>{P!==p&&(e.depthFunc(P),p=P)},colorMask:(P,M,U,q)=>{(P!==m[0]||M!==m[1]||U!==m[2]||q!==m[3])&&(e.colorMask(P,M,U,q),m[0]=P,m[1]=M,m[2]=U,m[3]=q)},clearColor:(P,M,U,q)=>{(P!==T[0]||M!==T[1]||U!==T[2]||q!==T[3])&&(e.clearColor(P,M,U,q),T[0]=P,T[1]=M,T[2]=U,T[3]=q)},blendFunc:(P,M)=>{(P!==v||M!==y||P!==x||M!==f)&&(e.blendFunc(P,M),v=P,y=M,x=P,f=M)},blendFuncSeparate:(P,M,U,q)=>{(P!==v||M!==y||U!==x||q!==f)&&(e.blendFuncSeparate(P,M,U,q),v=P,y=M,x=U,f=q)},blendEquation:P=>{(P!==l||P!==d)&&(e.blendEquation(P),l=P,d=P)},blendEquationSeparate:(P,M)=>{(P!==l||M!==d)&&(e.blendEquationSeparate(P,M),l=P,d=M)},blendColor:(P,M,U,q)=>{(P!==c[0]||M!==c[1]||U!==c[2]||q!==c[3])&&(e.blendColor(P,M,U,q),c[0]=P,c[1]=M,c[2]=U,c[3]=q)},stencilFunc:(P,M,U)=>{(P!==g||M!==u||U!==b||P!==h||M!==C||U!==A)&&(e.stencilFunc(P,M,U),g=P,u=M,b=U,h=P,C=M,A=U)},stencilFuncSeparate:(P,M,U,q)=>{P===e.FRONT?(M!==g||U!==u||q!==b)&&(e.stencilFuncSeparate(P,M,U,q),g=M,u=U,b=q):P===e.BACK?(M!==h||U!==C||q!==A)&&(e.stencilFuncSeparate(P,M,U,q),h=M,C=U,A=q):P===e.FRONT_AND_BACK&&(M!==g||U!==u||q!==b||M!==h||U!==C||q!==A)&&(e.stencilFuncSeparate(P,M,U,q),g=M,u=U,b=q,h=M,C=U,A=q)},stencilMask:P=>{(P!==I||P!==D)&&(e.stencilMask(P),I=P,D=P)},stencilMaskSeparate:(P,M)=>{P===e.FRONT?M!==I&&(e.stencilMaskSeparate(P,M),I=M):P===e.BACK?M!==D&&(e.stencilMaskSeparate(P,M),D=M):P===e.FRONT_AND_BACK&&(M!==I||M!==D)&&(e.stencilMaskSeparate(P,M),I=M,D=M)},stencilOp:(P,M,U)=>{(P!==B||M!==S||U!==R||P!==E||M!==O||U!==w)&&(e.stencilOp(P,M,U),B=P,S=M,R=U,E=P,O=M,w=U)},stencilOpSeparate:(P,M,U,q)=>{P===e.FRONT?(M!==B||U!==S||q!==R)&&(e.stencilOpSeparate(P,M,U,q),B=M,S=U,R=q):P===e.BACK?(M!==E||U!==O||q!==w)&&(e.stencilOpSeparate(P,M,U,q),E=M,O=U,w=q):P===e.FRONT_AND_BACK&&(M!==B||U!==S||q!==R||M!==E||U!==O||q!==w)&&(e.stencilOpSeparate(P,M,U,q),B=M,S=U,R=q,E=M,O=U,w=q)},enableVertexAttrib:P=>{e.enableVertexAttribArray(P),L[P]=1},clearVertexAttribsState:H,disableUnusedVertexAttribs:()=>{for(let P=0;P<F;++P)L[P]===0&&e.disableVertexAttribArray(P)},viewport:(P,M,U,q)=>{(P!==N[0]||M!==N[1]||U!==N[2]||q!==N[3])&&(e.viewport(P,M,U,q),N[0]=P,N[1]=M,N[2]=U,N[3]=q)},scissor:(P,M,U,q)=>{(P!==z[0]||M!==z[1]||U!==z[2]||q!==z[3])&&(e.scissor(P,M,U,q),z[0]=P,z[1]=M,z[2]=U,z[3]=q)},clipControl:t.clipControl?(P,M)=>{(P!==V||M!==$)&&(t.clipControl.clipControl(P,M),V=P,$=M)}:void 0,reset:()=>{r={},n=e.getParameter(e.FRONT_FACE),i=e.getParameter(e.CULL_FACE_MODE),o=e.getParameter(e.DEPTH_WRITEMASK),s=e.getParameter(e.DEPTH_CLEAR_VALUE),p=e.getParameter(e.DEPTH_FUNC),m=e.getParameter(e.COLOR_WRITEMASK),T=e.getParameter(e.COLOR_CLEAR_VALUE),v=e.getParameter(e.BLEND_SRC_RGB),y=e.getParameter(e.BLEND_DST_RGB),x=e.getParameter(e.BLEND_SRC_ALPHA),f=e.getParameter(e.BLEND_DST_ALPHA),c=e.getParameter(e.BLEND_COLOR),l=e.getParameter(e.BLEND_EQUATION_RGB),d=e.getParameter(e.BLEND_EQUATION_ALPHA),g=e.getParameter(e.STENCIL_FUNC),b=e.getParameter(e.STENCIL_VALUE_MASK),u=e.getParameter(e.STENCIL_REF),h=e.getParameter(e.STENCIL_BACK_FUNC),A=e.getParameter(e.STENCIL_BACK_VALUE_MASK),C=e.getParameter(e.STENCIL_BACK_REF),I=e.getParameter(e.STENCIL_WRITEMASK),D=e.getParameter(e.STENCIL_BACK_WRITEMASK),B=e.getParameter(e.STENCIL_FAIL),R=e.getParameter(e.STENCIL_PASS_DEPTH_PASS),S=e.getParameter(e.STENCIL_PASS_DEPTH_FAIL),E=e.getParameter(e.STENCIL_BACK_FAIL),w=e.getParameter(e.STENCIL_BACK_PASS_DEPTH_PASS),O=e.getParameter(e.STENCIL_BACK_PASS_DEPTH_FAIL),F=e.getParameter(e.MAX_VERTEX_ATTRIBS),L.length=0;for(let P=0;P<F;++P)L[P]=0;N=e.getParameter(e.VIEWPORT),z=e.getParameter(e.SCISSOR_BOX),V=t.clipControl?e.getParameter(t.clipControl.CLIP_ORIGIN):-1,$=t.clipControl?e.getParameter(t.clipControl.CLIP_DEPTH_MODE):-1}}}const Hi=`
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
`,$i=`
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
`,Yi=`
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
`,Qi=`

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
`,Zi=`
#if dClipObjectCount != 0 && defined(dClipping)
    #if defined(dClippingType_instance)
        vClipping = readFromTexture(tClipping, aInstance, uClippingTexDim).a;
    #elif defined(dMarkerType_groupInstance)
        vClipping = readFromTexture(tClipping, aInstance * float(uGroupCount) + group, uClippingTexDim).a;
    #endif
#endif
`,Ki=`
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
`,Ji=`
#ifdef dGeometryType_textureMesh
    float group = unpackRGBToInt(readFromTexture(tGroup, vertexId, uGeoTexDim).rgb);
#else
    float group = aGroup;
#endif
`,eo=`
#if defined(dNeedsMarker)
    #if defined(dMarkerType_instance)
        vMarker = readFromTexture(tMarker, aInstance, uMarkerTexDim).a;
    #elif defined(dMarkerType_groupInstance)
        vMarker = readFromTexture(tMarker, aInstance * float(uGroupCount) + group, uMarkerTexDim).a;
    #endif
#endif
`,to=`
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
`,ro=`
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
`,no=`
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
`,ao=`
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
`,io=`
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
`,oo=`
#if defined(dClipVariant_instance) && dClipObjectCount != 0
    vec3 mCenter = (uModel * aTransform * vec4(uInvariantBoundingSphere.xyz, 1.0)).xyz;
    if (clipTest(mCenter / uModelScale)) {
        // move out of [ -w, +w ] to 'discard' in vert shader
        gl_Position.z = 2.0 * gl_Position.w;
    }
#endif
`,co=`
#if defined(dClipVariant_pixel) && dClipObjectCount != 0
    if (clipTest(vModelPosition / uModelScale))
        discard;
#endif
`,so=`
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
`,uo=`
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
`,fo=`
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
`,lo=`
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
`,mo=`
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
`,po=`
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
`,go=`
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
`,vo=`
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
`,ho=`
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
`,bo=`
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
`,yo=`
varying vec3 vNormal;
`,_o=`
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
`,To=`
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
`,xo=`
#if defined(dSizeType_uniform)
    uniform float uSize;
#elif defined(dSizeType_attribute)
    attribute float aSize;
#elif defined(dSizeType_instance) || defined(dSizeType_group) || defined(dSizeType_groupInstance) || defined(dSizeType_vertex) || defined(dSizeType_vertexInstance)
    uniform vec2 uSizeTexDim;
    uniform sampler2D tSize;
#endif

uniform float uSizeFactor;
`,Co=`
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
`,So=`
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
`,Eo=`
vec4 texture3dFrom2dNearest(sampler2D tex, vec3 pos, vec3 gridDim, vec2 texDim) {
    float zSlice = floor(pos.z * gridDim.z + 0.5); // round to nearest z-slice
    float column = intMod(zSlice * gridDim.x, texDim.x) / gridDim.x;
    float row = floor(intDiv(zSlice * gridDim.x, texDim.x));
    vec2 coord = (vec2(column * gridDim.x, row * gridDim.y) + (pos.xy * gridDim.xy)) / texDim;
    return texture2D(tex, coord);
}
`,Ao=`
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
`,Io=`
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
`,Do=`
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
`,Ro=`
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
`,Bo=`
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
`,wo=`
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
`,Fo=`
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
`,Po=`
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
`,Oo=`
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
`,Lo=`
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
`,Mo=`
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
`,No=`
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
`,Go=`
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
`,ko=`
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
`,Vo=`
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
`,zo=`
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
`,Uo=`
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
`,jo=`
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
`,Ba=Ge(),Wo={apply_fog:Hi,apply_interior_color:$i,apply_light_color:Yi,apply_marker_color:Qi,assign_clipping_varying:Zi,assign_color_varying:Ki,assign_group:Ji,assign_marker_varying:eo,assign_material_color:to,assign_position:ro,assign_size:no,check_picking_alpha:ao,check_transparency:io,clip_instance:oo,clip_pixel:co,color_frag_params:so,color_vert_params:uo,common_animation:fo,common_clip:lo,common_frag_params:mo,common_vert_params:po,common:go,fade_lod:vo,float_to_rgba:ho,light_frag_params:bo,normal_frag_params:yo,read_from_texture:_o,rgba_to_float:To,size_vert_params:xo,texture3d_from_1d_trilinear:Co,texture3d_from_2d_linear:So,texture3d_from_2d_nearest:Eo,wboit_write:Ao,dpoit_write:Io},qo=/^(?!\/\/)\s*#include\s+(\S+)/gm,Xo=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*\+\+i\s*\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g,Ho=/[ \t]*\/\/.*\n/g,$o=/[ \t]*\/\*[\s\S]*?\*\//g,Yo=/\n{2,}/g;function On(e){return e.replace(qo,(t,r)=>{const n=Wo[r];if(!n)throw new Error(`empty chunk, '${r}'`);return n}).trim().replace(Ho,`
`).replace($o,`
`).replace(Yo,`
`)}function Qo(e){return e.replace(Xo,Zo)}function Zo(e,t,r,n){let i="";for(let o=parseInt(t);o<parseInt(r);++o)i+=n.replace(/\[\s*i\s*\]/g,`[${o}]`).replace(/UNROLLED_LOOP_INDEX/g,`${o}`);return i}function Ko(e,t){return t.dLightCount&&(e=e.replace(/dLightCount/g,`${t.dLightCount.ref.value}`)),t.dClipObjectCount&&(e=e.replace(/dClipObjectCount/g,`${t.dClipObjectCount.ref.value}`)),e}function Ln(e,t){return Qo(Ko(e,t))}function tt(e,t,r,n={},i={},o){return{id:Ba(),name:e,vert:On(t),frag:On(r),extensions:n,outTypes:i,ignoreDefine:o}}function $t(e,t,r){var n;if(t.startsWith("color")||t==="tracing"){if(e==="dLightCount")return!!(!((n=r.dIgnoreLight)===null||n===void 0)&&n.ref.value)}else{const i=["dColorType","dUsePalette","dOverpaintType","dOverpaint","dSubstanceType","dSubstance","dColorMarker","dCelShaded","dLightCount"];return t!=="depth"&&!t.startsWith("pick")&&i.push("dXrayShaded"),t!=="emissive"&&i.push("dEmissiveType","dEmissive"),i.includes(e)}return!1}function xr(e,t,r){return e==="dLightCount"?!0:$t(e,t,r)}const Jo=tt("points",Do,Ro,{drawBuffers:"optional"},{},xr),ec=tt("spheres",Bo,wo,{fragDepth:"required",drawBuffers:"optional"},{},$t),tc=tt("cylinders",Fo,Po,{fragDepth:"required",drawBuffers:"optional"},{},$t),rc=tt("text",Oo,Lo,{fragDepth:"optional",drawBuffers:"optional"},{},xr),nc=tt("lines",Mo,No,{drawBuffers:"optional"},{},xr),wa=tt("mesh",Go,ko,{drawBuffers:"optional"},{},$t),ac=tt("direct-volume",Vo,zo,{fragDepth:"optional",drawBuffers:"optional"},{},$t),ic=tt("image",Uo,jo,{drawBuffers:"optional"},{},xr);function Mn(e,t){var r;if(e===void 0)return"";const n=((r=e.dRenderVariant)===null||r===void 0?void 0:r.ref.value)||"",i=[];for(const o in e){if(t?.(o,n,e))continue;const p=e[o].ref.value;p!==void 0&&(typeof p=="string"?i.push(`#define ${o}_${p}`):typeof p=="number"?i.push(`#define ${o} ${p}`):typeof p=="boolean"?p&&i.push(`#define ${o}`):Ht())}return i.join(`
`)+`
`}function oc(e,t){const r=[];if(t.drawBuffers){if(e.drawBuffers)r.push("#define requiredDrawBuffers");else if(t.drawBuffers==="required")throw new Error("required 'GL_EXT_draw_buffers' extension not available")}if(t.multiDraw){if(e.multiDraw)r.push("#extension GL_ANGLE_multi_draw : require"),r.push("#define enabledMultiDraw");else if(t.multiDraw==="required")throw new Error("required 'GL_ANGLE_multi_draw' extension not available")}return r.join(`
`)+`
`}function cc(e,t){const r=["#extension GL_OES_standard_derivatives : enable"];if(t.fragDepth){if(e.fragDepth)r.push("#extension GL_EXT_frag_depth : enable"),r.push("#define enabledFragDepth");else if(t.fragDepth==="required")throw new Error("required 'GL_EXT_frag_depth' extension not available")}if(t.drawBuffers){if(e.drawBuffers)r.push("#extension GL_EXT_draw_buffers : require"),r.push("#define requiredDrawBuffers"),r.push("#define gl_FragColor gl_FragData[0]");else if(t.drawBuffers==="required")throw new Error("required 'GL_EXT_draw_buffers' extension not available")}if(t.shaderTextureLod){if(e.shaderTextureLod)r.push("#extension GL_EXT_shader_texture_lod : enable"),r.push("#define enabledShaderTextureLod");else if(t.shaderTextureLod==="required")throw new Error("required 'GL_EXT_shader_texture_lod' extension not available")}return e.depthTexture&&r.push("#define depthTextureSupport"),r.join(`
`)+`
`}const sc=`
#define attribute in
#define varying out
#define texture2D texture
`,uc=`
#define varying in
#define texture2D texture
#define textureCube texture
#define texture2DLodEXT textureLod
#define textureCubeLodEXT textureLod

#define gl_FragColor out_FragData0
#define gl_FragDepthEXT gl_FragDepth
`;function fc(e,t){const r=["#version 300 es"];if(t.drawBuffers&&e.drawBuffers&&r.push("#define requiredDrawBuffers"),t.multiDraw){if(e.multiDraw)r.push("#extension GL_ANGLE_multi_draw : require"),r.push("#define enabledMultiDraw");else if(t.multiDraw==="required")throw new Error("required 'GL_ANGLE_multi_draw' extension not available")}if(t.clipCullDistance){if(e.clipCullDistance)r.push("#extension GL_ANGLE_clip_cull_distance : enable"),r.push("#define enabledClipCullDistance");else if(t.clipCullDistance==="required")throw new Error("required 'GL_ANGLE_clip_cull_distance' extension not available")}if(t.conservativeDepth){if(e.conservativeDepth)r.push("#extension GL_EXT_conservative_depth : enable"),r.push("#define enabledConservativeDepth");else if(t.conservativeDepth==="required")throw new Error("required 'GL_EXT_conservative_depth' extension not available")}if(t.multiview2){if(e.multiview2)r.push("#extension GL_OVR_multiview2 : require"),r.push("#define enabledMultiview2");else if(t.multiview2==="required")throw new Error("required 'GL_OVR_multiview2' extension not available")}return e.noNonInstancedActiveAttribs&&r.push("#define noNonInstancedActiveAttribs"),r.push(sc),r.join(`
`)+`
`}function dc(e,t,r,n){const i=["#version 300 es",`layout(location = 0) out highp ${n[0]||"vec4"} out_FragData0;`];if(r.fragDepth&&e.fragDepth&&i.push("#define enabledFragDepth"),r.drawBuffers&&e.drawBuffers){i.push("#define requiredDrawBuffers");for(let o=1,s=t.maxDrawBuffers;o<s;++o)i.push(`layout(location = ${o}) out highp ${n[o]||"vec4"} out_FragData${o};`)}return r.shaderTextureLod&&e.shaderTextureLod&&i.push("#define enabledShaderTextureLod"),e.depthTexture&&i.push("#define depthTextureSupport"),i.push(uc),i.join(`
`)+`
`}function lc(e){return e.replace(/gl_FragData\[([0-9]+)\]/g,"out_FragData$1")}function mc(e,t,r,n,i){const o=Mn(n,i.ignoreDefine),s=Mn(n,i.ignoreDefine),p=K(e)?fc(t,i.extensions):oc(t,i.extensions),m=K(e)?dc(t,r,i.extensions,i.outTypes):cc(t,i.extensions),T=K(e)?lc(i.frag):i.frag;return{id:Ba(),name:i.name,vert:`${p}${o}${Ln(i.vert,n)}`,frag:`${m}${s}${Ln(T,n)}`,extensions:i.extensions,outTypes:i.outTypes}}function pc(e,t){switch(t){case"b":case"b[]":return e.BOOL;case"f":case"f[]":return e.FLOAT;case"i":case"i[]":return e.INT;case"v2":case"v2[]":return e.FLOAT_VEC2;case"v3":case"v3[]":return e.FLOAT_VEC3;case"v4":case"v4[]":return e.FLOAT_VEC4;case"q":case"q[]":return e.FLOAT_VEC4;case"iv2":case"iv2[]":return e.INT_VEC2;case"iv3":case"iv3[]":return e.INT_VEC3;case"iv4":case"iv4[]":return e.INT_VEC4;case"m3":case"m3[]":return e.FLOAT_MAT3;case"m4":case"m4[]":return e.FLOAT_MAT4;default:console.error(`unknown uniform kind '${t}'`)}}function gc(e){return e.endsWith("[]")}function vc(e,t,r){e.uniform1f(t,r)}function hc(e,t,r){e.uniform1fv(t,r)}function bc(e,t,r){e.uniform1i(t,r)}function yc(e,t,r){e.uniform1iv(t,r)}function _c(e,t,r){e.uniform2fv(t,r)}function Tc(e,t,r){e.uniform3fv(t,r)}function Nn(e,t,r){e.uniform4fv(t,r)}function xc(e,t,r){e.uniform2iv(t,r)}function Cc(e,t,r){e.uniform3iv(t,r)}function Sc(e,t,r){e.uniform4iv(t,r)}function Ec(e,t,r){e.uniformMatrix3fv(t,!1,r)}function Ac(e,t,r){e.uniformMatrix4fv(t,!1,r)}function Gn(e){switch(e){case"f":return vc;case"f[]":return hc;case"i":case"t":case"b":return bc;case"i[]":case"t[]":case"b[]":return yc;case"v2":case"v2[]":return _c;case"v3":case"v3[]":return Tc;case"v4":case"v4[]":return Nn;case"q":case"q[]":return Nn;case"iv2":case"iv2[]":return xc;case"iv3":case"iv3[]":return Cc;case"iv4":case"iv4[]":return Sc;case"m3":case"m3[]":return Ec;case"m4":case"m4[]":return Ac}}function Ic(e){const t={};return Object.keys(e).forEach(r=>{const n=e[r];n.type==="uniform"?t[r]=Gn(n.kind):n.type==="texture"&&(t[r]=Gn("t"))}),t}function Dc(e){const t={};return Object.keys(e).forEach(r=>{t[r]=a.create(va(e[r].ref.value))}),t}const Fa=Ge();function Rc(e,t){switch(t){case"static":return e.STATIC_DRAW;case"dynamic":return e.DYNAMIC_DRAW;case"stream":return e.STREAM_DRAW;default:Ht()}}function Bc(e,t){if(t instanceof Uint8Array)return e.UNSIGNED_BYTE;if(t instanceof Int8Array)return e.BYTE;if(t instanceof Uint16Array)return e.UNSIGNED_SHORT;if(t instanceof Int16Array)return e.SHORT;if(t instanceof Uint32Array)return e.UNSIGNED_INT;if(t instanceof Int32Array)return e.INT;if(t instanceof Float32Array)return e.FLOAT;Ht()}function wc(e,t){switch(t){case"attribute":return e.ARRAY_BUFFER;case"elements":return e.ELEMENT_ARRAY_BUFFER;case"uniform":if(K(e))return e.UNIFORM_BUFFER;throw new Error("WebGL2 is required for uniform buffers");case"pixel-pack":if(K(e))return e.PIXEL_PACK_BUFFER;throw new Error("WebGL2 is required for pixel-pack buffers")}}function pr(e){const t=e.createBuffer();if(t===null)throw new Error("Could not create WebGL buffer");return t}function Pa(e,t,r,n){let i=pr(e);const o=Rc(e,r),s=wc(e,n),p=Bc(e,t),m=t.BYTES_PER_ELEMENT,T=t.length;function v(x){e.bindBuffer(s,i),e.bufferData(s,x,o)}v(t);let y=!1;return{id:Fa(),_usageHint:o,_bufferType:s,_dataType:p,_bpe:m,length:T,getByteCount:()=>m*T,getBuffer:()=>i,updateData:v,updateSubData:(x,f,c)=>{e.bindBuffer(s,i),c-f===x.length?e.bufferSubData(s,0,x):e.bufferSubData(s,f*m,x.subarray(f,f+c))},reset:()=>{i=pr(e),v(t)},destroy:()=>{y||(e.deleteBuffer(i),y=!0)}}}function Fc(e,t,r){switch(t){case"float32":switch(r){case 1:return e.FLOAT;case 2:return e.FLOAT_VEC2;case 3:return e.FLOAT_VEC3;case 4:return e.FLOAT_VEC4;case 16:return e.FLOAT_MAT4}default:Ht()}}function Pc(e,t,r,n,i,o,s="static"){const{instancedArrays:p}=r,m=Pa(e,n,s,"attribute"),{_bufferType:T,_dataType:v,_bpe:y}=m;return{...m,divisor:o,bind:x=>{if(e.bindBuffer(T,m.getBuffer()),i===16)for(let f=0;f<4;++f)t.enableVertexAttrib(x+f),e.vertexAttribPointer(x+f,4,v,!1,16*y,f*4*y),p.vertexAttribDivisor(x+f,o);else t.enableVertexAttrib(x),e.vertexAttribPointer(x,i,v,!1,0,0),p.vertexAttribDivisor(x,o)},changeOffset:(x,f)=>{const c=f*y*i;if(e.bindBuffer(T,m.getBuffer()),i===16)for(let l=0;l<4;++l)e.vertexAttribPointer(x+l,4,v,!1,16*y,l*4*y+c);else e.vertexAttribPointer(x,i,v,!1,0,c)}}}function Oc(e,t,r){const n=[];return Object.keys(t).forEach(i=>{const o=t[i];o.type==="attribute"&&(n[n.length]=[i,e.resources.attribute(r[i].ref.value,o.itemSize,o.divisor)])}),n}function Lc(e,t,r="static"){const n=Pa(e,t,r,"elements");return{...n,bind:()=>{e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n.getBuffer())}}}function Mc(e,t,r,n){let i=pr(e);const o=Ua(e,t,n),s=mn(e,r,n),p=za(r,n);let m=0,T=0;function v(f,c,l,d){m=l,T=d,e.bindBuffer(e.PIXEL_PACK_BUFFER,i),e.bufferData(e.PIXEL_PACK_BUFFER,l*d*p,e.STREAM_READ),e.readPixels(f,c,l,d,s,o,0),e.bindBuffer(e.PIXEL_PACK_BUFFER,null)}function y(f){e.bindBuffer(e.PIXEL_PACK_BUFFER,i),e.getBufferSubData(e.PIXEL_PACK_BUFFER,0,f),e.bindBuffer(e.PIXEL_PACK_BUFFER,null)}let x=!1;return{id:Fa(),_type:o,_format:s,_bpe:p,getByteCount:()=>p*m*T,read:v,getSubData:y,reset:()=>{i=pr(e)},destroy:()=>{x||(e.deleteBuffer(i),x=!0)}}}const Nc=Ge();function Gc(e,t,r){const n={};return Object.keys(r).forEach(i=>{const o=r[i];if(o.type==="attribute"){const s=e.getAttribLocation(t,i);n[i]=s}else if(o.type==="uniform"){let s=e.getUniformLocation(t,i);s===null&&gc(o.kind)&&(s=e.getUniformLocation(t,i+"[0]")),n[i]=s}else if(o.type==="texture"){const s=e.getUniformLocation(t,i);n[i]=s}}),n}function kc(e,t,r){const n=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES);for(let i=0;i<n;++i){const o=e.getActiveAttrib(t,i);if(o){const{name:s,type:p}=o;if(s.startsWith("__activeAttribute")||s==="gl_InstanceID"||s==="gl_VertexID"||s==="gl_DrawID"||s==="gl_ViewID_OVR")continue;const m=r[s];if(m===void 0)throw new Error(`missing 'uniform' or 'texture' with name '${s}' in schema`);if(m.type!=="attribute")throw new Error(`'${s}' must be of type 'attribute' but is '${m.type}'`);const T=Fc(e,m.kind,m.itemSize);if(T!==p)throw new Error(`unexpected attribute type '${T}' for ${s}, expected '${p}'`)}}}function Vc(e,t,r){const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){const o=e.getActiveUniform(t,i);if(o){const{name:s,type:p}=o;if(s.startsWith("__activeUniform")||s==="gl_InstanceID"||s==="gl_VertexID"||s==="gl_DrawID"||s==="gl_ViewID_OVR")continue;const m=s.replace(/[[0-9]+\]$/,""),T=r[m];if(T===void 0)throw new Error(`missing 'uniform' or 'texture' with name '${s}' in schema`);if(T.type==="uniform"){if(pc(e,T.kind)!==p)throw new Error(`unexpected uniform type for ${s}`)}else if(T.type==="texture"){if(T.kind==="image-float32"||T.kind==="image-uint8"){if(p!==e.SAMPLER_2D)throw new Error(`unexpected sampler type for '${s}'`)}else if(T.kind==="volume-float32"||T.kind==="volume-uint8")if(K(e)){if(p!==e.SAMPLER_3D)throw new Error(`unexpected sampler type for '${s}'`)}else throw new Error("WebGL2 is required to use SAMPLER_3D")}else throw new Error(`'${s}' must be of type 'uniform' or 'texture' but is '${T.type}'`)}}}function zc(e,t){if(!e.getProgramParameter(t,e.LINK_STATUS))throw new Error(`Could not compile WebGL program. 

${e.getProgramInfoLog(t)}`)}function Zr(e){const t=e.createProgram();if(t===null)throw new Error("Could not create WebGL program");return t}function Uc(e){if(typeof e!="string")throw new Error(`unknown program variant: ${e}`);return e.startsWith("color")?"color":e.startsWith("pick")?"pick":e}function jc(e,t,r,n,i,o){const{defineValues:s,shaderCode:p,schema:m}=o;let T=Zr(e);const v=Nc(),y=Uc(s.dRenderVariant.ref.value),x=mc(e,r,n,s,p),f=i("vert",x.vert),c=i("frag",x.frag);let l,d,g=!1,b=!1,u=!1;function h(){f.attach(T),c.attach(T),e.linkProgram(T),oe&&zc(e,T),g=!0}y==="compute"&&h();function A(){l=Gc(e,T,m),d=Ic(m),oe&&(kc(e,T,m),Vc(e,T,m)),b=!0}return{id:v,variant:y,isReady:()=>b,link:()=>{g||h()},finalize(C){return g||h(),!b&&(C||!r.parallelShaderCompile||e.getProgramParameter(T,r.parallelShaderCompile.COMPLETION_STATUS))&&A(),b},use:()=>{if(oe&&!b)throw new Error(`program not finalized: ${y}`);t.currentProgramId=v,e.useProgram(T)},setUniforms:C=>{for(let I=0,D=C.length;I<D;++I){const[B,R]=C[I];if(R){const S=l[B];S!==null&&d[B](e,S,R.ref.value)}}},uniform:(C,I)=>{const D=l[C];D!==null&&d[C](e,D,I)},bindAttributes:C=>{t.clearVertexAttribsState();for(let I=0,D=C.length;I<D;++I){const[B,R]=C[I],S=l[B];S!==-1&&R.bind(S)}t.disableUnusedVertexAttribs()},offsetAttributes:(C,I)=>{for(let D=0,B=C.length;D<B;++D){const[R,S]=C[D],E=l[R];E!==-1&&S.changeOffset(E,I)}},bindTextures:(C,I)=>{for(let D=0,B=C.length;D<B;++D){const[R,S]=C[D],E=l[R];E!=null&&(S.bind(D+I),d[R](e,E,D+I))}},reset:()=>{T=Zr(e),g&&h(),b&&A()},destroy:()=>{u||(f.destroy(),c.destroy(),e.deleteProgram(T),u=!0)}}}const Wc=Ge();function qc(e){const t=e.split(`
`);for(let r=0;r<t.length;++r)t[r]=r+1+": "+t[r];return t.join(`
`)}function gr(e,t){const{type:r,source:n}=t,i=e.createShader(r==="vert"?e.VERTEX_SHADER:e.FRAGMENT_SHADER);if(i===null)throw new Error(`Error creating ${r} shader`);if(e.shaderSource(i,n),e.compileShader(i),oe&&e.getShaderParameter(i,e.COMPILE_STATUS)===!1)throw console.warn(`'${r}' shader info log '${e.getShaderInfoLog(i)}'
${qc(n)}`),new Error(`Error compiling ${r} shader`);return i}function Xc(e,t){let r=gr(e,t);return{id:Wc(),attach:n=>{e.attachShader(n,r)},reset:()=>{r=gr(e,t)},destroy:()=>{e.deleteShader(r)}}}function Hc(e,t=0){return{value:e,usageCount:t}}function $c(e){return{free:()=>{e.usageCount-=1},value:e.value}}function kn(e,t,r){const n=new Map,i=[];return{get:o=>{const s=e(o);let p=n.get(s);return p||(p=Hc(t(o)),n.set(s,p),i.push(p.value)),p.usageCount+=1,$c(p)},clear:()=>{n.forEach((o,s)=>{o.usageCount<=0&&(o.usageCount<0&&console.warn("Reference usageCount below zero."),r(o.value),n.delete(s),oi(i,o.value))})},get count(){return n.size},values:i,dispose:()=>{n.forEach(o=>r(o.value)),n.clear(),i.length=0}}}const Yc=Ge();function Qc(e,t){switch(t){case"depth16":return e.DEPTH_COMPONENT16;case"stencil8":return e.STENCIL_INDEX8;case"rgba4":return e.RGBA4;case"depth-stencil":return e.DEPTH_STENCIL;case"depth24":if(K(e))return e.DEPTH_COMPONENT24;throw new Error("WebGL2 needed for `depth24` renderbuffer format");case"depth32f":if(K(e))return e.DEPTH_COMPONENT32F;throw new Error("WebGL2 needed for `depth32f` renderbuffer format");case"depth24-stencil8":if(K(e))return e.DEPTH24_STENCIL8;throw new Error("WebGL2 needed for `depth24-stencil8` renderbuffer format");case"depth32f-stencil8":if(K(e))return e.DEPTH32F_STENCIL8;throw new Error("WebGL2 needed for `depth32f-stencil8` renderbuffer format")}}function Zc(e){switch(e){case"depth16":return 4;case"stencil8":return 2;case"rgba4":return 4;case"depth-stencil":return 4;case"depth24":return 3;case"depth32f":return 4;case"depth24-stencil8":return 4;case"depth32f-stencil8":return 5}}function Kc(e,t){switch(t){case"depth":return e.DEPTH_ATTACHMENT;case"stencil":return e.STENCIL_ATTACHMENT;case"depth-stencil":return e.DEPTH_STENCIL_ATTACHMENT;case"color0":return e.COLOR_ATTACHMENT0}}function Vn(e){const t=e.createRenderbuffer();if(t===null)throw new Error("Could not create WebGL renderbuffer");return t}function Jc(e,t,r,n,i){let o=Vn(e);const s=()=>e.bindRenderbuffer(e.RENDERBUFFER,o),p=Qc(e,t),m=Kc(e,r);function T(){s(),e.renderbufferStorage(e.RENDERBUFFER,p,n,i)}T();let v=!1;return{id:Yc(),getByteCount:()=>Zc(t)*n*i,bind:s,attachFramebuffer:y=>{y.bind(),s(),e.framebufferRenderbuffer(e.FRAMEBUFFER,m,e.RENDERBUFFER,o),oe&&mr(e)},detachFramebuffer:y=>{y.bind(),s(),e.framebufferRenderbuffer(e.FRAMEBUFFER,m,e.RENDERBUFFER,null),oe&&mr(e)},setSize:(y,x)=>{n=y,i=x,T()},reset:()=>{o=Vn(e),T()},destroy:()=>{v||(e.deleteRenderbuffer(o),v=!0)}}}const es=Ge();function zn(e){const{vertexArrayObject:t}=e;if(!t)throw new Error("VertexArrayObject not supported");const r=t.createVertexArray();if(!r)throw new Error("Could not create WebGL vertex array");return r}function Un(e){const{vertexArrayObject:t}=e;if(t===null)throw new Error("VertexArrayObject not supported");return t}function ts(e,t,r,n,i){const o=es();let s=zn(t),p=Un(t);function m(){p.bindVertexArray(s),i&&i.bind(),r.bindAttributes(n),p.bindVertexArray(null),T=!0}let T=!1,v=!1;return{id:o,bind:()=>{T||m(),p.bindVertexArray(s)},update:m,reset:()=>{s=zn(t),p=Un(t),T=!1},destroy:()=>{v||(i&&(p.bindVertexArray(s),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null)),p.deleteVertexArray(s),v=!0)}}}function rs(e){return typeof e=="boolean"?e?1:0:typeof e=="number"?e*1e4:ba(e)}function jn(e){return{...e.value,destroy:()=>{e.free()}}}function ns(e,t,r,n,i){const o={attribute:new Set,elements:new Set,pixelPack:new Set,framebuffer:new Set,program:new Set,renderbuffer:new Set,shader:new Set,texture:new Set,cubeTexture:new Set,vertexArray:new Set};function s(y,x){return o[y].add(x),r.resourceCounts[y]+=1,{...x,destroy:()=>{x.destroy(),o[y].delete(x),r.resourceCounts[y]-=1}}}const p=kn(y=>JSON.stringify(y),y=>s("shader",Xc(e,y)),y=>{y.destroy()});function m(y,x){return jn(p.get({type:y,source:x}))}const T=new Set,v=kn(y=>{var x;const f=[y.shaderCode.id],c=((x=y.defineValues.dRenderVariant)===null||x===void 0?void 0:x.ref.value)||"";return Object.keys(y.defineValues).forEach(l=>{var d,g;!((g=(d=y.shaderCode).ignoreDefine)===null||g===void 0)&&g.call(d,l,c,y.defineValues)||f.push(ba(l),rs(y.defineValues[l].ref.value))}),et(f).toString()},y=>{const x=jc(e,t,n,i,m,y);return x.variant!=="compute"&&T.add(x),s("program",x)},y=>{T.delete(y),y.destroy()});return{attribute:(y,x,f,c)=>s("attribute",Pc(e,t,n,y,x,f,c)),elements:(y,x)=>s("elements",Lc(e,y,x)),pixelPack:(y,x)=>{if(!K(e))throw new Error("WebGL2 is required for pixel-pack buffers");return s("pixelPack",Mc(e,n,y,x))},framebuffer:()=>s("framebuffer",ji(e)),program:(y,x,f)=>jn(v.get({defineValues:y,shaderCode:x,schema:f})),renderbuffer:(y,x,f,c)=>s("renderbuffer",Jc(e,y,x,f,c)),shader:m,texture:(y,x,f,c)=>s("texture",ou(e,n,y,x,f,c)),cubeTexture:(y,x,f)=>s("cubeTexture",su(e,y,x,f)),vertexArray:(y,x,f)=>s("vertexArray",ts(e,n,y,x,f)),getByteCounts:()=>{let y=0;o.texture.forEach(g=>{y+=g.getByteCount()});let x=0;o.cubeTexture.forEach(g=>{x+=g.getByteCount()});let f=0;o.attribute.forEach(g=>{f+=g.getByteCount()});let c=0;o.elements.forEach(g=>{c+=g.getByteCount()});let l=0;o.pixelPack.forEach(g=>{l+=g.getByteCount()});let d=0;return o.renderbuffer.forEach(g=>{d+=g.getByteCount()}),{texture:y,cubeTexture:x,attribute:f,elements:c,pixelPack:l,renderbuffer:d}},linkPrograms:y=>{for(const x of T)y&&!y.includes(x.variant)||x.link()},finalizePrograms:(y,x)=>{let f=!0,c=0;for(const b of T)b.isReady()&&T.delete(b),(!y||y.includes(b.variant))&&(f=!1,c+=1);if(f)return!0;let l=!0,d=0;const g=Bt();for(const b of T)if(!(y&&!y.includes(b.variant))&&(b.finalize(x)?(T.delete(b),d+=1):l=!1,!x&&Bt()-g>16)){l=!1;break}return Fe&&console.log(`Finalized ${d} of ${c} programs (${y?y.join(", "):"all"}) in ${(Bt()-g).toFixed(2)} ms`),l},reset:()=>{o.attribute.forEach(y=>y.reset()),o.elements.forEach(y=>y.reset()),o.pixelPack.forEach(y=>y.reset()),o.framebuffer.forEach(y=>y.reset()),o.renderbuffer.forEach(y=>y.reset()),o.shader.forEach(y=>y.reset()),o.program.forEach(y=>y.reset()),o.vertexArray.forEach(y=>y.reset()),o.texture.forEach(y=>y.reset()),o.cubeTexture.forEach(y=>y.reset())},destroy:()=>{o.attribute.forEach(y=>y.destroy()),o.elements.forEach(y=>y.destroy()),o.pixelPack.forEach(y=>y.destroy()),o.framebuffer.forEach(y=>y.destroy()),o.renderbuffer.forEach(y=>y.destroy()),o.shader.forEach(y=>y.destroy()),o.program.forEach(y=>y.destroy()),o.vertexArray.forEach(y=>y.destroy()),o.texture.forEach(y=>y.destroy()),o.cubeTexture.forEach(y=>y.destroy()),p.clear(),v.clear(),T.clear()}}}const as=Ge();function is(e,t,r,n,i=!0,o="uint8",s="nearest",p="rgba"){if(p==="alpha"&&!K(e))throw new Error("cannot render to alpha format in webgl1");const m=t.framebuffer(),T=o==="fp16"?t.texture("image-float16",p,"fp16",s):o==="float32"?t.texture("image-float32",p,"float",s):t.texture("image-uint8",p,"ubyte",s),v=i?K(e)?t.renderbuffer("depth32f","depth",r,n):t.renderbuffer("depth16","depth",r,n):null;function y(){T.define(r,n),T.attachFramebuffer(m,"color0"),v&&v.attachFramebuffer(m)}y();let x=!1;return{id:as(),texture:T,framebuffer:m,depthRenderbuffer:v,getByteCount:()=>T.getByteCount()+(v?v.getByteCount():0),getWidth:()=>r,getHeight:()=>n,bind:()=>{m.bind()},setSize:(f,c)=>{r===f&&n===c||(r=f,n=c,T.define(r,n),v&&v.setSize(r,n))},reset:()=>{y()},destroy:()=>{x||(T.destroy(),m.destroy(),v&&v.destroy(),x=!0)}}}function os(e,t,r){return e-=e/r,e+=t/r,e}class Wn{add(t,r){let n=this.avgs.get(t)||r;return n=os(n,r,this.count),this.avgs.set(t,n),n}get(t){return this.avgs.get(t)}stats(){return Object.fromEntries(this.avgs.entries())}clear(){this.avgs.clear()}constructor(t){this.count=t,this.avgs=new Map}}function cs(e){e.calls.drawInstanced=0,e.calls.drawInstancedBase=0,e.calls.multiDrawInstancedBase=0,e.calls.counts=0,e.culled.lod=0,e.culled.frustum=0,e.culled.occlusion=0}function ss(e){return e.disjointTimerQuery?e.disjointTimerQuery.createQuery():null}function us(e,t,r,n){var i;const o=t.disjointTimerQuery,s=(i=void 0)!==null&&i!==void 0?i:30,p=new Map,m=new Map,T=[],v=new Wn(s),y=new Wn(s);let x=[],f=null,c=!1;const l=()=>{m.clear(),T.length=0,v.clear(),y.clear(),x=[],f=null,c=!1,o&&p.forEach((g,b)=>{o.deleteQuery(b)}),p.clear()},d=()=>{if(!o)return;const g=ss(t);g&&(o.beginQuery(o.TIME_ELAPSED,g),m.forEach((b,u)=>{b.queries.push(g)}),p.set(g,{refCount:m.size}),f=g)};return{resolve:()=>{const g=[];if(!o||!x.length||c)return g;p.forEach((u,h)=>{if(u.timeElapsed!==void 0)return;const A=o.getQueryParameter(h,o.QUERY_RESULT_AVAILABLE),C=e.getParameter(o.GPU_DISJOINT);if(A&&!C){const I=o.getQueryParameter(h,o.QUERY_RESULT);u.timeElapsed=I}(A||C)&&o.deleteQuery(h)});const b=[];for(const u of x)if(u.queries.every(h=>{var A;return((A=p.get(h))===null||A===void 0?void 0:A.timeElapsed)!==void 0})){let h=0;for(const A of u.queries){const C=p.get(A);h+=C.timeElapsed,C.refCount-=1}if(u.timeElapsed=h,u.root){const A=[],C=(D,B)=>{for(const R of D){const S=R.timeElapsed,E=R.cpu.end-R.cpu.start,w={label:R.label,gpuElapsed:S,gpuAvg:v.add(R.label,S),cpuElapsed:E,cpuAvg:y.add(R.label,E),children:[],calls:R.calls,note:R.note};B.push(w),C(R.children,w.children)}};C(u.children,A);const I=u.cpu.end-u.cpu.start;g.push({label:u.label,gpuElapsed:h,gpuAvg:v.add(u.label,h),cpuElapsed:I,cpuAvg:y.add(u.label,I),children:A,calls:u.calls,note:u.note})}}else b.push(u);return x=b,p.forEach((u,h)=>{u.refCount===0&&p.delete(h)}),g},mark:(g,b)=>{var u;if(!o)return;if(m.has(g))throw new Error(`Timer mark for '${g}' already exists`);const h=(u=b?.captureStats)!==null&&u!==void 0?u:!1;f!==null&&o.endQuery(o.TIME_ELAPSED);const A={label:g,queries:[],children:[],root:f===null,cpu:{start:Bt(),end:-1},captureStats:h};if(b?.note&&(A.note=b.note),m.set(g,A),T.length&&T[T.length-1].children.push(A),T.push(A),h){if(c)throw new Error("Already capturing stats");cs(r),c=!0}d()},markEnd:g=>{var b;if(!o)return;const u=m.get(g);if(!u)throw new Error(`Timer mark for '${g}' does not exist`);if(((b=T.pop())===null||b===void 0?void 0:b.label)!==g)throw new Error(`Timer mark for '${g}' has pending nested mark`);o.endQuery(o.TIME_ELAPSED),m.delete(g),u.cpu.end=Bt(),u.captureStats&&(u.calls={...r.calls},c=!1),x.push(u),m.size>0?d():f=null},stats:()=>({gpu:v.stats(),cpu:y.stats()}),formatedStats:()=>{const g={},b=v.stats(),u=y.stats();for(const h of Object.keys(b)){const A=`${(b[h]/1e3/1e3).toFixed(2)}`,C=`${u[h].toFixed(2)}`;g[h]=`${A} ms | CPU: ${C} ms`}return g},clear:l,destroy:()=>{l()}}}function fs(e){const t=`${(e.gpuElapsed/1e3/1e3).toFixed(2)}`,r=`${(e.gpuAvg/1e3/1e3).toFixed(2)}`,n=`${e.cpuElapsed.toFixed(2)}`,i=`${e.cpuAvg.toFixed(2)}`;return`${e.label} ${t} ms (avg. ${r} ms) | CPU: ${n} ms (avg. ${i} ms)`}function ds(e){e.map(t=>{const r=fs(t);t.children.length||t.calls||t.note?(console.groupCollapsed(r),t.calls&&console.log(t.calls),t.note&&console.log(t.note),ds(t.children),console.groupEnd()):console.log(r)})}function Bd(e,t){function r(i){try{return e.getContext(i,t)}catch{return null}}const n=(t?.preferWebGl1?null:r("webgl2"))||r("webgl")||r("experimental-webgl");return oe&&console.log(`isWebgl2: ${K(n)}`),n}function Oa(e,t){switch(t){case e.NO_ERROR:return"no error";case e.INVALID_ENUM:return"invalid enum";case e.INVALID_VALUE:return"invalid value";case e.INVALID_OPERATION:return"invalid operation";case e.INVALID_FRAMEBUFFER_OPERATION:return"invalid framebuffer operation";case e.OUT_OF_MEMORY:return"out of memory";case e.CONTEXT_LOST_WEBGL:return"context lost"}return"unknown error"}function La(e,t){const r=e.getError();r!==e.NO_ERROR&&console.log(`WebGL error: '${Oa(e,r)}'${t?` (${t})`:""}`)}function ls(e){const t=e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS);for(let i=0;i<t;++i)e.activeTexture(e.TEXTURE0+i),e.bindTexture(e.TEXTURE_2D,null),e.bindTexture(e.TEXTURE_CUBE_MAP,null),K(e)&&(e.bindTexture(e.TEXTURE_2D_ARRAY,null),e.bindTexture(e.TEXTURE_3D,null));const r=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,r);const n=e.getParameter(e.MAX_VERTEX_ATTRIBS);for(let i=0;i<n;++i)e.vertexAttribPointer(i,1,e.FLOAT,!1,0,0);e.bindBuffer(e.ARRAY_BUFFER,null),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null),e.bindRenderbuffer(e.RENDERBUFFER,null),e.bindFramebuffer(e.FRAMEBUFFER,null),K(e)&&(e.bindBuffer(e.UNIFORM_BUFFER,null),e.bindBuffer(e.PIXEL_PACK_BUFFER,null))}const Ma=new Uint8Array(4);function Na(e,t,r){e.getSyncParameter(t,e.SYNC_STATUS)===e.SIGNALED?(e.deleteSync(t),r()):_a.setImmediate(Na,e,t,r)}function ms(e,t){const r=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0);r?_a.setImmediate(Na,e,r,t):(console.warn("Could not create a WebGLSync object"),e.readPixels(0,0,1,1,e.RGBA,e.UNSIGNED_BYTE,Ma),t())}let qn=!1;function ps(e){return new Promise(t=>{K(e)?ms(e,t):(qn||(console.info("Sync object not supported in WebGL"),qn=!0),Ga(e),t())})}function Ga(e){e.bindFramebuffer(e.FRAMEBUFFER,null),e.readPixels(0,0,1,1,e.RGBA,e.UNSIGNED_BYTE,Ma)}function gs(e,t,r,n,i,o){if(oe&&mr(e),o instanceof Uint8Array)e.readPixels(t,r,n,i,e.RGBA,e.UNSIGNED_BYTE,o);else if(o instanceof Float32Array)e.readPixels(t,r,n,i,e.RGBA,e.FLOAT,o);else if(o instanceof Int32Array&&K(e))e.readPixels(t,r,n,i,e.RGBA_INTEGER,e.INT,o);else throw new Error("unsupported readPixels buffer type");oe&&La(e)}function wr(e,t){t?e.bindFramebuffer(e.FRAMEBUFFER,t.framebuffer):e.bindFramebuffer(e.FRAMEBUFFER,null)}function nr(e,t,r){var n,i;let o=(n=t?.framebufferWidth)!==null&&n!==void 0?n:e.drawingBufferWidth;r==="screen-space"&&(o*=2);const s=(i=t?.framebufferHeight)!==null&&i!==void 0?i:e.drawingBufferHeight;return{width:o,height:s}}function At(e,t,r,n){const i=t==="vertex"?e.VERTEX_SHADER:e.FRAGMENT_SHADER,o=e[`${r.toUpperCase()}_${n.toUpperCase()}`];return e.getShaderPrecisionFormat(i,o)}function Xn(e,t){return{lowFloat:At(e,t,"low","float"),mediumFloat:At(e,t,"medium","float"),highFloat:At(e,t,"high","float"),lowInt:At(e,t,"low","int"),mediumInt:At(e,t,"medium","int"),highInt:At(e,t,"high","int")}}function vs(){return{resourceCounts:{attribute:0,elements:0,pixelPack:0,framebuffer:0,program:0,renderbuffer:0,shader:0,texture:0,cubeTexture:0,vertexArray:0},drawCount:0,instanceCount:0,instancedDrawCount:0,calls:{drawInstanced:0,drawInstancedBase:0,multiDrawInstancedBase:0,counts:0},culled:{lod:0,frustum:0,occlusion:0}}}function hs(e,t){return{maxTextureSize:e.getParameter(e.MAX_TEXTURE_SIZE),max3dTextureSize:K(e)?e.getParameter(e.MAX_3D_TEXTURE_SIZE):0,maxRenderbufferSize:e.getParameter(e.MAX_RENDERBUFFER_SIZE),maxDrawBuffers:t.drawBuffers?e.getParameter(t.drawBuffers.MAX_DRAW_BUFFERS):0,maxTextureImageUnits:e.getParameter(e.MAX_TEXTURE_IMAGE_UNITS),maxVertexTextureImageUnits:e.getParameter(e.MAX_VERTEX_TEXTURE_IMAGE_UNITS)}}function wd(e,t={}){const r=Ra(e),n=Xi(e,r),i=vs(),o=hs(e,r),s=ns(e,n,i,r,o),p=us(e,r,i);if(o.maxVertexTextureImageUnits<8)throw new Error('Need "MAX_VERTEX_TEXTURE_IMAGE_UNITS" >= 8');const m={vertex:Xn(e,"vertex"),fragment:Xn(e,"fragment")};oe&&console.log({parameters:o,shaderPrecisionFormats:m});const T=r.provokingVertex;T?.provokingVertex(T.FIRST_VERTEX_CONVENTION);let v=!1;const y=new Qr;let x=t.pixelScale||1;const f={session:void 0,layer:void 0,changed:new Qr,clear:()=>{f.layer=void 0,f.session=void 0,f.changed.next()}},c=new Set;return{gl:e,isWebGL2:K(e),get pixelRatio(){return(typeof window<"u"&&window.devicePixelRatio||1)*(x||1)},extensions:r,state:n,stats:i,resources:s,timer:p,get maxTextureSize(){return o.maxTextureSize},get max3dTextureSize(){return o.max3dTextureSize},get maxRenderbufferSize(){return o.maxRenderbufferSize},get maxDrawBuffers(){return o.maxDrawBuffers},get maxTextureImageUnits(){return o.maxTextureImageUnits},get shaderPrecisionFormats(){return m},namedComputeRenderables:Object.create(null),namedFramebuffers:Object.create(null),namedTextures:Object.create(null),get isContextLost(){return v||e.isContextLost()},contextRestored:y,setContextLost:()=>{v=!0,p.clear()},handleContextRestored:l=>{qi(e,r),n.reset(),n.currentMaterialId=-1,n.currentProgramId=-1,n.currentRenderItemId=-1,s.reset(),c.forEach(d=>d.reset()),l?.(),v=!1,y.next(Bt())},xr:{get session(){return f.session},changed:f.changed,set:async(l,d)=>{var g,b;if(f.session!==l&&(await((g=f.session)===null||g===void 0?void 0:g.end()),l!==void 0))try{await e.makeXRCompatible(),f.session=l,f.layer=new XRWebGLLayer(f.session,e,{antialias:!0,alpha:!0,depth:!0,framebufferScaleFactor:x*((b=d?.resolutionScale)!==null&&b!==void 0?b:1)}),await f.session.updateRenderState({baseLayer:f.layer}),f.session.addEventListener("end",f.clear),f.changed.next()}catch(u){throw l?await l.end():(f.layer=void 0,f.session=void 0),u}},end:async()=>{var l;return(l=f.session)===null||l===void 0?void 0:l.end()}},setPixelScale:l=>{x=l},createRenderTarget:(l,d,g,b,u,h)=>{const A=is(e,s,l,d,g,b,u,h);return c.add(A),{...A,destroy:()=>{A.destroy(),c.delete(A)}}},createDrawTarget:()=>({id:-1,texture:De(e),framebuffer:Wi(),depthRenderbuffer:null,getByteCount:()=>0,getWidth:()=>{var l;return nr(e,f.layer,(l=f.session)===null||l===void 0?void 0:l.interactionMode).width},getHeight:()=>{var l;return nr(e,f.layer,(l=f.session)===null||l===void 0?void 0:l.interactionMode).height},bind:()=>{wr(e,f.layer)},setSize:()=>{},reset:()=>{},destroy:()=>{}}),bindDrawingBuffer:()=>wr(e,f.layer),getDrawingBufferSize:()=>{var l;return nr(e,f.layer,(l=f.session)===null||l===void 0?void 0:l.interactionMode)},readPixels:(l,d,g,b,u)=>{gs(e,l,d,g,b,u)},waitForGpuCommandsComplete:()=>ps(e),waitForGpuCommandsCompleteSync:()=>Ga(e),getFenceSync:()=>K(e)?e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0):null,checkSyncStatus:l=>K(e)?e.getSyncParameter(l,e.SYNC_STATUS)===e.SIGNALED?(e.deleteSync(l),!0):!1:!0,deleteSync:l=>{K(e)&&e.deleteSync(l)},clear:(l,d,g,b)=>{const u=nr(e,f.layer);wr(e,f.layer),n.enable(e.SCISSOR_TEST),n.depthMask(!0),n.colorMask(!0,!0,!0,!0),n.clearColor(l,d,g,b),n.viewport(0,0,u.width,u.height),n.scissor(0,0,u.width,u.height),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT)},checkError:l=>{La(e,l)},checkFramebufferStatus:l=>{mr(e,l)},destroy:l=>{var d,g,b,u;s.destroy(),ls(e),(d=f.session)===null||d===void 0||d.removeEventListener("end",f.clear),(g=f.session)===null||g===void 0||g.end(),y.complete(),f.changed.complete(),l?.doNotForceWebGLContextLoss||((b=e.getExtension("WEBGL_lose_context"))===null||b===void 0||b.loseContext(),(u=e.getExtension("STACKGL_destroy_context"))===null||u===void 0||u.destroy())}}}function K(e){return typeof WebGL2RenderingContext<"u"&&e instanceof WebGL2RenderingContext}function bs(e){if(K(e))return{drawArraysInstanced:e.drawArraysInstanced.bind(e),drawElementsInstanced:e.drawElementsInstanced.bind(e),vertexAttribDivisor:e.vertexAttribDivisor.bind(e),VERTEX_ATTRIB_ARRAY_DIVISOR:e.VERTEX_ATTRIB_ARRAY_DIVISOR};{const t=e.getExtension("ANGLE_instanced_arrays");return t===null?null:{drawArraysInstanced:t.drawArraysInstancedANGLE.bind(t),drawElementsInstanced:t.drawElementsInstancedANGLE.bind(t),vertexAttribDivisor:t.vertexAttribDivisorANGLE.bind(t),VERTEX_ATTRIB_ARRAY_DIVISOR:t.VERTEX_ATTRIB_ARRAY_DIVISOR_ANGLE}}}function ys(e){if(K(e))return{FRAGMENT_SHADER_DERIVATIVE_HINT:e.FRAGMENT_SHADER_DERIVATIVE_HINT};{const t=e.getExtension("OES_standard_derivatives");return t===null?null:{FRAGMENT_SHADER_DERIVATIVE_HINT:t.FRAGMENT_SHADER_DERIVATIVE_HINT_OES}}}function _s(e){return K(e)?{}:e.getExtension("OES_element_index_uint")}function Ts(e){if(K(e))return{VERTEX_ARRAY_BINDING:e.VERTEX_ARRAY_BINDING,bindVertexArray:e.bindVertexArray.bind(e),createVertexArray:e.createVertexArray.bind(e),deleteVertexArray:e.deleteVertexArray.bind(e),isVertexArray:e.isVertexArray.bind(e)};{const t=e.getExtension("OES_vertex_array_object");return t===null?null:{VERTEX_ARRAY_BINDING:t.VERTEX_ARRAY_BINDING_OES,bindVertexArray:t.bindVertexArrayOES.bind(t),createVertexArray:t.createVertexArrayOES.bind(t),deleteVertexArray:t.deleteVertexArrayOES.bind(t),isVertexArray:t.isVertexArrayOES.bind(t)}}}function xs(e){return K(e)?{}:e.getExtension("OES_texture_float")}function Cs(e){return e.getExtension("OES_texture_float_linear")}function Ss(e){if(K(e))return{HALF_FLOAT:e.HALF_FLOAT};{const t=e.getExtension("OES_texture_half_float");return t===null?null:{HALF_FLOAT:t.HALF_FLOAT_OES}}}function Es(e){return e.getExtension("OES_texture_half_float_linear")}function As(e){if(K(e))return{MIN:e.MIN,MAX:e.MAX};{const t=e.getExtension("EXT_blend_minmax");return t===null?null:{MIN:t.MIN_EXT,MAX:t.MAX_EXT}}}function Is(e){return K(e)?{}:e.getExtension("EXT_frag_depth")}function Ds(e){if(K(e))return e.getExtension("EXT_color_buffer_float")===null?null:(e.getExtension("EXT_float_blend"),{RGBA32F:e.RGBA32F});{const t=e.getExtension("WEBGL_color_buffer_float");return t===null?(e.getExtension("OES_texture_float"),ka(e,e.FLOAT)?{RGBA32F:34836}:null):(e.getExtension("EXT_float_blend"),{RGBA32F:t.RGBA32F_EXT})}}function Rs(e){if(K(e))return e.getExtension("EXT_color_buffer_half_float")===null?null:(e.getExtension("EXT_float_blend"),{RGBA16F:e.RGBA16F});{const t=e.getExtension("EXT_color_buffer_half_float");return t===null?(e.getExtension("OES_texture_half_float"),ka(e,36193)?{RGBA16F:34842}:null):(e.getExtension("EXT_float_blend"),{RGBA16F:t.RGBA16F_EXT})}}function Bs(e){if(K(e))return{drawBuffers:e.drawBuffers.bind(e),COLOR_ATTACHMENT0:e.COLOR_ATTACHMENT0,COLOR_ATTACHMENT1:e.COLOR_ATTACHMENT1,COLOR_ATTACHMENT2:e.COLOR_ATTACHMENT2,COLOR_ATTACHMENT3:e.COLOR_ATTACHMENT3,COLOR_ATTACHMENT4:e.COLOR_ATTACHMENT4,COLOR_ATTACHMENT5:e.COLOR_ATTACHMENT5,COLOR_ATTACHMENT6:e.COLOR_ATTACHMENT6,COLOR_ATTACHMENT7:e.COLOR_ATTACHMENT7,DRAW_BUFFER0:e.DRAW_BUFFER0,DRAW_BUFFER1:e.DRAW_BUFFER1,DRAW_BUFFER2:e.DRAW_BUFFER2,DRAW_BUFFER3:e.DRAW_BUFFER3,DRAW_BUFFER4:e.DRAW_BUFFER4,DRAW_BUFFER5:e.DRAW_BUFFER5,DRAW_BUFFER6:e.DRAW_BUFFER6,DRAW_BUFFER7:e.DRAW_BUFFER7,MAX_COLOR_ATTACHMENTS:e.MAX_COLOR_ATTACHMENTS,MAX_DRAW_BUFFERS:e.MAX_DRAW_BUFFERS};{const t=e.getExtension("WEBGL_draw_buffers");return t===null?null:{drawBuffers:t.drawBuffersWEBGL.bind(t),COLOR_ATTACHMENT0:t.COLOR_ATTACHMENT0_WEBGL,COLOR_ATTACHMENT1:t.COLOR_ATTACHMENT1_WEBGL,COLOR_ATTACHMENT2:t.COLOR_ATTACHMENT2_WEBGL,COLOR_ATTACHMENT3:t.COLOR_ATTACHMENT3_WEBGL,COLOR_ATTACHMENT4:t.COLOR_ATTACHMENT4_WEBGL,COLOR_ATTACHMENT5:t.COLOR_ATTACHMENT5_WEBGL,COLOR_ATTACHMENT6:t.COLOR_ATTACHMENT6_WEBGL,COLOR_ATTACHMENT7:t.COLOR_ATTACHMENT7_WEBGL,DRAW_BUFFER0:t.DRAW_BUFFER0_WEBGL,DRAW_BUFFER1:t.DRAW_BUFFER1_WEBGL,DRAW_BUFFER2:t.DRAW_BUFFER2_WEBGL,DRAW_BUFFER3:t.DRAW_BUFFER3_WEBGL,DRAW_BUFFER4:t.DRAW_BUFFER4_WEBGL,DRAW_BUFFER5:t.DRAW_BUFFER5_WEBGL,DRAW_BUFFER6:t.DRAW_BUFFER6_WEBGL,DRAW_BUFFER7:t.DRAW_BUFFER7_WEBGL,MAX_COLOR_ATTACHMENTS:t.MAX_COLOR_ATTACHMENTS_WEBGL,MAX_DRAW_BUFFERS:t.MAX_DRAW_BUFFERS_WEBGL}}}function ws(e){const t=e.getExtension("OES_draw_buffers_indexed");return t===null?null:{enablei:t.enableiOES.bind(t),disablei:t.disableiOES.bind(t),blendEquationi:t.blendEquationiOES.bind(t),blendEquationSeparatei:t.blendEquationSeparateiOES.bind(t),blendFunci:t.blendFunciOES.bind(t),blendFuncSeparatei:t.blendFuncSeparateiOES.bind(t),colorMaski:t.colorMaskiOES.bind(t)}}function Fs(e){return K(e)?{}:e.getExtension("EXT_shader_texture_lod")}function Ps(e){if(K(e))return{UNSIGNED_INT_24_8:e.UNSIGNED_INT_24_8};{const t=e.getExtension("WEBGL_depth_texture");return t===null?null:{UNSIGNED_INT_24_8:t.UNSIGNED_INT_24_8_WEBGL}}}function Os(e){if(K(e))return{FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING:e.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING,SRGB8_ALPHA8:e.SRGB8_ALPHA8,SRGB8:e.SRGB8,SRGB:e.SRGB};{const t=e.getExtension("EXT_sRGB");return t===null?null:{FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING:t.FRAMEBUFFER_ATTACHMENT_COLOR_ENCODING_EXT,SRGB8_ALPHA8:t.SRGB8_ALPHA8_EXT,SRGB8:t.SRGB_ALPHA_EXT,SRGB:t.SRGB_EXT}}}function Ls(e){if(K(e)){const t=e.getExtension("EXT_disjoint_timer_query_webgl2")||e.getExtension("EXT_disjoint_timer_query");return t===null?null:{QUERY_COUNTER_BITS:t.QUERY_COUNTER_BITS_EXT,CURRENT_QUERY:e.CURRENT_QUERY,QUERY_RESULT:e.QUERY_RESULT,QUERY_RESULT_AVAILABLE:e.QUERY_RESULT_AVAILABLE,TIME_ELAPSED:t.TIME_ELAPSED_EXT,TIMESTAMP:t.TIMESTAMP_EXT,GPU_DISJOINT:t.GPU_DISJOINT_EXT,createQuery:e.createQuery.bind(e),deleteQuery:e.deleteQuery.bind(e),isQuery:e.isQuery.bind(e),beginQuery:e.beginQuery.bind(e),endQuery:e.endQuery.bind(e),queryCounter:t.queryCounterEXT.bind(t),getQuery:e.getQuery.bind(e),getQueryParameter:e.getQueryParameter.bind(e)}}else{const t=e.getExtension("EXT_disjoint_timer_query");return t===null?null:{QUERY_COUNTER_BITS:t.QUERY_COUNTER_BITS_EXT,CURRENT_QUERY:t.CURRENT_QUERY_EXT,QUERY_RESULT:t.QUERY_RESULT_EXT,QUERY_RESULT_AVAILABLE:t.QUERY_RESULT_AVAILABLE_EXT,TIME_ELAPSED:t.TIME_ELAPSED_EXT,TIMESTAMP:t.TIMESTAMP_EXT,GPU_DISJOINT:t.GPU_DISJOINT_EXT,createQuery:t.createQueryEXT.bind(t),deleteQuery:t.deleteQueryEXT.bind(t),isQuery:t.isQueryEXT.bind(t),beginQuery:t.beginQueryEXT.bind(t),endQuery:t.endQueryEXT.bind(t),queryCounter:t.queryCounterEXT.bind(t),getQuery:t.getQueryEXT.bind(t),getQueryParameter:t.getQueryObjectEXT.bind(t)}}}function Ms(e){const t=e.getExtension("WEBGL_multi_draw");return t?{multiDrawArrays:t.multiDrawArraysWEBGL.bind(t),multiDrawElements:t.multiDrawElementsWEBGL.bind(t),multiDrawArraysInstanced:t.multiDrawArraysInstancedWEBGL.bind(t),multiDrawElementsInstanced:t.multiDrawElementsInstancedWEBGL.bind(t)}:null}function Ns(e){const t=e.getExtension("WEBGL_draw_instanced_base_vertex_base_instance");return t?{drawArraysInstancedBaseInstance:t.drawArraysInstancedBaseInstanceWEBGL.bind(t),drawElementsInstancedBaseVertexBaseInstance:t.drawElementsInstancedBaseVertexBaseInstanceWEBGL.bind(t)}:null}function Gs(e){const t=e.getExtension("WEBGL_multi_draw_instanced_base_vertex_base_instance");return t?{multiDrawArraysInstancedBaseInstance:t.multiDrawArraysInstancedBaseInstanceWEBGL.bind(t),multiDrawElementsInstancedBaseVertexBaseInstance:t.multiDrawElementsInstancedBaseVertexBaseInstanceWEBGL.bind(t)}:null}function ks(e){const t=e.getExtension("KHR_parallel_shader_compile");return t===null?null:{COMPLETION_STATUS:t.COMPLETION_STATUS_KHR}}function Vs(e){return K(e)?{}:e.getExtension("OES_fbo_render_mipmap")}function zs(e){if(K(e)){const t=e.getExtension("WEBGL_provoking_vertex");if(t)return{FIRST_VERTEX_CONVENTION:t.FIRST_VERTEX_CONVENTION_WEBGL,LAST_VERTEX_CONVENTION:t.LAST_VERTEX_CONVENTION_WEBGL,PROVOKING_VERTEX:t.PROVOKING_VERTEX_WEBGL,provokingVertex:t.provokingVertexWEBGL.bind(t)}}return null}function Us(e){if(K(e)){const t=e.getExtension("WEBGL_clip_cull_distance");if(t)return{MAX_CLIP_DISTANCES:t.MAX_CLIP_DISTANCES_WEBGL,MAX_CULL_DISTANCES:t.MAX_CULL_DISTANCES_WEBGL,MAX_COMBINED_CLIP_AND_CULL_DISTANCES:t.MAX_COMBINED_CLIP_AND_CULL_DISTANCES_WEBGL,CLIP_DISTANCE0:t.CLIP_DISTANCE0_WEBGL,CLIP_DISTANCE1:t.CLIP_DISTANCE1_WEBGL,CLIP_DISTANCE2:t.CLIP_DISTANCE2_WEBGL,CLIP_DISTANCE3:t.CLIP_DISTANCE3_WEBGL,CLIP_DISTANCE4:t.CLIP_DISTANCE4_WEBGL,CLIP_DISTANCE5:t.CLIP_DISTANCE5_WEBGL,CLIP_DISTANCE6:t.CLIP_DISTANCE6_WEBGL,CLIP_DISTANCE7:t.CLIP_DISTANCE7_WEBGL}}return null}function js(e){return K(e)&&e.getExtension("EXT_conservative_depth")?{}:null}function Ws(e){if(K(e)){const t=e.getExtension("WEBGL_stencil_texturing");if(t)return{DEPTH_STENCIL_TEXTURE_MODE:t.DEPTH_STENCIL_TEXTURE_MODE_WEBGL,STENCIL_INDEX:t.STENCIL_INDEX_WEBGL}}return null}function qs(e){const t=e.getExtension("EXT_clip_control");return t?{LOWER_LEFT:t.LOWER_LEFT_EXT,UPPER_LEFT:t.UPPER_LEFT_EXT,NEGATIVE_ONE_TO_ONE:t.NEGATIVE_ONE_TO_ONE_EXT,ZERO_TO_ONE:t.ZERO_TO_ONE_EXT,CLIP_ORIGIN:t.CLIP_ORIGIN_EXT,CLIP_DEPTH_MODE:t.CLIP_DEPTH_MODE_EXT,clipControl:t.clipControlEXT.bind(t)}:null}function Xs(e){return K(e)&&e.getExtension("EXT_render_snorm")?{}:null}function Hs(e){return K(e)&&e.getExtension("WEBGL_render_shared_exponent")?{}:null}function $s(e){const t=e.getExtension("EXT_texture_norm16");return t?{R16:t.R16_EXT,RG16:t.RG16_EXT,RGB16:t.RGB16_EXT,RGBA16:t.RGBA16_EXT,R16_SNORM:t.R16_SNORM_EXT,RG16_SNORM:t.RG16_SNORM_EXT,RGB16_SNORM:t.RGB16_SNORM_EXT,RGBA16_SNORM:t.RGBA16_SNORM_EXT}:null}function Ys(e){const t=e.getExtension("EXT_depth_clamp");return t?{DEPTH_CLAMP:t.DEPTH_CLAMP_EXT}:null}function Qs(e){if(K(e)){const t=e.getExtension("OVR_multiview2");if(t)return{FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS:t.FRAMEBUFFER_ATTACHMENT_TEXTURE_NUM_VIEWS_OVR,FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX:t.FRAMEBUFFER_ATTACHMENT_TEXTURE_BASE_VIEW_INDEX_OVR,MAX_VIEWS:t.MAX_VIEWS_OVR,FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS:t.FRAMEBUFFER_INCOMPLETE_VIEW_TARGETS_OVR,framebufferTextureMultiview:t.framebufferTextureMultiviewOVR.bind(t)}}return null}function Zs(e){if(!K(e))return!1;if(typeof navigator<"u"){const t=window.navigator.userAgent.match(/Firefox\/([0-9]+)\./);return t?parseInt(t[1])>=85:!0}return!1}const Ks=`
attribute vec4 aPosition;

void main() {
    gl_Position = aPosition;
}`,Js=`
precision mediump float;
uniform vec4 uColor;
uniform sampler2D uTexture;

void main() {
    gl_FragColor = texture2D(uTexture, vec2(0.5, 0.5)) * uColor;
}`,eu=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]);function ka(e,t){const r=gr(e,{type:"vert",source:Ks}),n=gr(e,{type:"frag",source:Js});if(!r||!n)return!1;const i=Zr(e);e.attachShader(i,r),e.attachShader(i,n),e.linkProgram(i),e.useProgram(i);const o=e.getAttribLocation(i,"aPosition"),s=e.getUniformLocation(i,"uColor");if(!s)return oe&&console.log("error getting 'uColor' uniform location"),!1;const p=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,p),e.bufferData(e.ARRAY_BUFFER,eu,e.STATIC_DRAW),e.enableVertexAttribArray(o),e.vertexAttribPointer(o,2,e.FLOAT,!1,0,0);const m=e.createTexture(),T=new Uint8Array([255,255,255,255]);e.bindTexture(e.TEXTURE_2D,m),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,e.UNSIGNED_BYTE,T);const v=e.createTexture();e.bindTexture(e.TEXTURE_2D,v),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,1,1,0,e.RGBA,t,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST);const y=e.createFramebuffer();if(e.bindFramebuffer(e.FRAMEBUFFER,y),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,v,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE)return oe&&console.log(`error creating framebuffer for '${t}'`),!1;e.bindTexture(e.TEXTURE_2D,m),e.uniform4fv(s,[0,10,20,1]),e.drawArrays(e.TRIANGLES,0,6),e.bindTexture(e.TEXTURE_2D,v),e.bindFramebuffer(e.FRAMEBUFFER,null),e.clearColor(1,0,0,1),e.clear(e.COLOR_BUFFER_BIT),e.uniform4fv(s,[0,1/10,1/20,1]),e.drawArrays(e.TRIANGLES,0,6);const f=new Uint8Array(4);if(e.readPixels(0,0,1,1,e.RGBA,e.UNSIGNED_BYTE,f),f[0]!==0||f[1]<248||f[2]<248||f[3]<254)return oe&&console.log(`not able to actually render to '${t}' texture`),!1;if(t===e.FLOAT){e.bindFramebuffer(e.FRAMEBUFFER,y);const c=new Float32Array(4);e.readPixels(0,0,1,1,e.RGBA,e.FLOAT,c);const l=e.getError();if(l)return oe&&console.log(`error reading float pixels: '${Oa(e,l)}'`),!1}return!0}const ln=Ge();function tu(e,t){switch(t){case"image-uint8":return e.TEXTURE_2D;case"image-float32":return e.TEXTURE_2D;case"image-float16":return e.TEXTURE_2D;case"image-depth":return e.TEXTURE_2D}if(K(e))switch(t){case"image-int32":return e.TEXTURE_2D;case"volume-uint8":return e.TEXTURE_3D;case"volume-float32":return e.TEXTURE_3D;case"volume-float16":return e.TEXTURE_3D}throw new Error(`unknown texture kind '${t}'`)}function mn(e,t,r){switch(t){case"alpha":return K(e)&&(r==="float"||r==="fp16")?e.RED:K(e)&&r==="int"?e.RED_INTEGER:e.ALPHA;case"rgb":return K(e)&&r==="int"?e.RGB_INTEGER:e.RGB;case"rg":if(K(e)&&(r==="float"||r==="fp16"))return e.RG;if(K(e)&&r==="int")return e.RG_INTEGER;throw new Error('texture format "rg" requires webgl2 and type "float" or int"');case"rgba":return K(e)&&r==="int"?e.RGBA_INTEGER:e.RGBA;case"depth":return e.DEPTH_COMPONENT}}function ru(e,t,r){if(K(e))switch(t){case"alpha":switch(r){case"ubyte":return e.ALPHA;case"float":return e.R32F;case"fp16":return e.R16F;case"int":return e.R32I}case"rg":switch(r){case"ubyte":return e.RG;case"float":return e.RG32F;case"fp16":return e.RG16F;case"int":return e.RG32I}case"rgb":switch(r){case"ubyte":return e.RGB;case"float":return e.RGB32F;case"fp16":return e.RGB16F;case"int":return e.RGB32I}case"rgba":switch(r){case"ubyte":return e.RGBA;case"float":return e.RGBA32F;case"fp16":return e.RGBA16F;case"int":return e.RGBA32I}case"depth":switch(r){case"ushort":return e.DEPTH_COMPONENT16;case"float":return e.DEPTH_COMPONENT32F}}return mn(e,t,r)}function Va(e,t,r,n,i){return za(e,t)*r*n*(i||1)}function za(e,t){return nu(e)*au(t)}function nu(e){switch(e){case"alpha":return 1;case"rg":return 2;case"rgb":return 3;case"rgba":return 4;case"depth":return 4}}function au(e){switch(e){case"ubyte":return 1;case"ushort":return 2;case"float":return 4;case"fp16":return 2;case"int":return 4}}function Ua(e,t,r){switch(r){case"ubyte":return e.UNSIGNED_BYTE;case"ushort":return e.UNSIGNED_SHORT;case"float":return e.FLOAT;case"fp16":if(t.textureHalfFloat)return t.textureHalfFloat.HALF_FLOAT;throw new Error('extension "texture_half_float" unavailable');case"int":if(K(e))return e.INT;throw new Error('texture type "int" requires webgl2')}}function Hn(e,t){switch(t){case"nearest":return e.NEAREST;case"linear":return e.LINEAR}}function ar(e,t,r){switch(r){case"depth":return e.DEPTH_ATTACHMENT;case"stencil":return e.STENCIL_ATTACHMENT;case"color0":case 0:return e.COLOR_ATTACHMENT0}if(t.drawBuffers)switch(r){case"color1":case 1:return t.drawBuffers.COLOR_ATTACHMENT1;case"color2":case 2:return t.drawBuffers.COLOR_ATTACHMENT2;case"color3":case 3:return t.drawBuffers.COLOR_ATTACHMENT3;case"color4":case 4:return t.drawBuffers.COLOR_ATTACHMENT4;case"color5":case 5:return t.drawBuffers.COLOR_ATTACHMENT5;case"color6":case 6:return t.drawBuffers.COLOR_ATTACHMENT6;case"color7":case 7:return t.drawBuffers.COLOR_ATTACHMENT7}throw new Error("unknown texture attachment")}function $n(e){return typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement}function iu(e,t,r){return t===r.TEXTURE_2D}function Yn(e,t,r){return t===r.TEXTURE_3D}function Kr(e){const t=e.createTexture();if(t===null)throw new Error("Could not create WebGL texture");return t}function ou(e,t,r,n,i,o){const s=ln();let p=Kr(e);if(r.endsWith("float32")&&i!=="float"||r.endsWith("float16")&&i!=="fp16"||r.endsWith("uint8")&&i!=="ubyte"||r.endsWith("int32")&&i!=="int"||r.endsWith("depth")&&i!=="ushort"&&i!=="float")throw new Error(`texture kind '${r}' and type '${i}' are incompatible`);if(!t.depthTexture&&n==="depth")throw new Error("extension 'WEBGL_depth_texture' needed for 'depth' texture format");const m=tu(e,r),T=Hn(e,o),v=mn(e,n,i),y=ru(e,n,i),x=Ua(e,t,i);function f(){e.bindTexture(m,p),e.texParameteri(m,e.TEXTURE_MAG_FILTER,T),e.texParameteri(m,e.TEXTURE_MIN_FILTER,T),e.texParameteri(m,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(m,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindTexture(m,null)}f();let c=0,l=0,d=0,g,b=!1,u=!1;function h(D,B,R){if(D===0||B===0||K(e)&&m===e.TEXTURE_3D&&R===0)throw new Error("empty textures are not allowed");if(!(c===D&&l===B&&d===(R||0)))if(c=D,l=B,d=R||0,e.bindTexture(m,p),m===e.TEXTURE_2D)e.texImage2D(m,0,y,c,l,0,v,x,null);else if(K(e)&&m===e.TEXTURE_3D&&d!==void 0)e.texImage3D(m,0,y,c,l,d,0,v,x,null);else throw new Error("unknown texture target")}h(1,1,K(e)&&m===e.TEXTURE_3D?1:0);function A(D,B=!1){if(D.width===0||D.height===0||!$n(D)&&K(e)&&Yn(D,m,e)&&D.depth===0)throw new Error("empty textures are not allowed");if(e.bindTexture(m,p),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0),$n(D))c=D.width,l=D.height,e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.bindTexture(e.TEXTURE_2D,p),e.texImage2D(e.TEXTURE_2D,0,y,v,x,D);else if(iu(D,m,e)){const R=D.filter?Hn(e,D.filter):T;e.texParameteri(m,e.TEXTURE_MAG_FILTER,R),e.texParameteri(m,e.TEXTURE_MIN_FILTER,R),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!!D.flipY),B?e.texSubImage2D(m,0,0,0,D.width,D.height,v,x,D.array):(c=D.width,l=D.height,e.texImage2D(m,0,y,c,l,0,v,x,D.array))}else if(K(e)&&Yn(D,m,e))e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),B?e.texSubImage3D(m,0,0,0,0,D.width,D.height,D.depth,v,x,D.array):(c=D.width,l=D.height,d=D.depth,e.texImage3D(m,0,y,c,l,d,0,v,x,D.array));else throw new Error("unknown texture target");e.bindTexture(m,null),g=D}function C(){if(m!==e.TEXTURE_2D)throw new Error("mipmap only supported for 2d textures");if(K(e)||Sn(c)&&Sn(l))e.bindTexture(m,p),e.texParameteri(m,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.generateMipmap(m),e.bindTexture(m,null),b=!0;else throw new Error("mipmap unsupported for non-power-of-two textures and webgl1")}function I(D,B,R){if(D.bind(),m===e.TEXTURE_2D)e.framebufferTexture2D(e.FRAMEBUFFER,ar(e,t,B),e.TEXTURE_2D,p,0);else if(K(e)&&m===e.TEXTURE_3D){if(R===void 0)throw new Error("need `layer` to attach 3D texture");e.framebufferTextureLayer(e.FRAMEBUFFER,ar(e,t,B),p,0,R)}else throw new Error("unknown/unsupported texture target")}return{id:s,target:m,format:v,internalFormat:y,type:x,filter:T,getWidth:()=>c,getHeight:()=>l,getDepth:()=>d,getByteCount:()=>Va(n,i,c,l,d),define:h,load:A,mipmap:C,bind:D=>{e.activeTexture(e.TEXTURE0+D),e.bindTexture(m,p)},unbind:D=>{e.activeTexture(e.TEXTURE0+D),e.bindTexture(m,null)},attachFramebuffer:I,detachFramebuffer:(D,B)=>{if(D.bind(),m===e.TEXTURE_2D)e.framebufferTexture2D(e.FRAMEBUFFER,ar(e,t,B),e.TEXTURE_2D,null,0);else if(K(e)&&m===e.TEXTURE_3D)e.framebufferTextureLayer(e.FRAMEBUFFER,ar(e,t,B),null,0,0);else throw new Error("unknown texture target")},reset:()=>{p=Kr(e),f();const[D,B,R]=[c,l,d];c=0,l=0,d=0,h(D,B,R),g&&A(g),b&&C()},destroy:()=>{u||(e.deleteTexture(p),u=!0)}}}function Qn(e,t,r){const{resources:n}=e,i=[];return Object.keys(t).forEach(o=>{const s=t[o];if(s.type==="texture"){const p=r[o];if(p)if(s.kind==="texture")i[i.length]=[o,p.ref.value];else{const m=n.texture(s.kind,s.format,s.dataType,s.filter);m.load(p.ref.value),i[i.length]=[o,m]}}}),i}function Fd(e,t,r){const n=new Image;n.onload=function(){r.load(n),a.update(t,r)},n.src=e}function cu(e,t){switch(t){case"nx":return e.TEXTURE_CUBE_MAP_NEGATIVE_X;case"ny":return e.TEXTURE_CUBE_MAP_NEGATIVE_Y;case"nz":return e.TEXTURE_CUBE_MAP_NEGATIVE_Z;case"px":return e.TEXTURE_CUBE_MAP_POSITIVE_X;case"py":return e.TEXTURE_CUBE_MAP_POSITIVE_Y;case"pz":return e.TEXTURE_CUBE_MAP_POSITIVE_Z}}function su(e,t,r,n){const i=e.TEXTURE_CUBE_MAP,o=e.LINEAR,s=e.RGBA,p=e.RGBA,m=e.UNSIGNED_BYTE;let T=0,v=e.createTexture();e.bindTexture(i,v);function y(l,d,g,b){T===0&&(T=g.width),e.bindTexture(i,v),e.texImage2D(l,d,s,T,T,0,p,m,null),e.pixelStorei(e.UNPACK_ALIGNMENT,4),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,0),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!1),e.bindTexture(i,v),e.texImage2D(l,d,s,p,m,g),f+=1,f===6&&(c||(r?(e.texParameteri(i,e.TEXTURE_MIN_FILTER,e.LINEAR_MIPMAP_LINEAR),e.generateMipmap(i)):e.texParameteri(i,e.TEXTURE_MIN_FILTER,o),e.texParameteri(i,e.TEXTURE_MAG_FILTER,o)),b||n?.(c))}const x=[];let f=0;ga(t,(l,d)=>{if(!l)return;const g=0,b=cu(e,d),u=new Image;l instanceof File?u.src=URL.createObjectURL(l):_i(l)?l.then(h=>{u.src=URL.createObjectURL(h)}):u.src=l,x.push({cubeTarget:b,level:g,image:u}),u.addEventListener("load",()=>{y(b,g,u,!1)}),u.addEventListener("error",()=>{n?.(!0)})});let c=!1;return{id:ln(),target:i,format:p,internalFormat:s,type:m,filter:o,getWidth:()=>T,getHeight:()=>T,getDepth:()=>0,getByteCount:()=>Va("rgba","ubyte",T,T,0)*6*(r?2:1),define:()=>{},load:()=>{},mipmap:()=>{},bind:l=>{e.activeTexture(e.TEXTURE0+l),e.bindTexture(i,v)},unbind:l=>{e.activeTexture(e.TEXTURE0+l),e.bindTexture(i,null)},attachFramebuffer:()=>{},detachFramebuffer:()=>{},reset:()=>{v=Kr(e),e.bindTexture(i,v),f=0;for(const{cubeTarget:l,level:d,image:g}of x)y(l,d,g,!0)},destroy:()=>{c||(e.deleteTexture(v),c=!0)}}}const ja=-1;function Pd(e){return e.format===ja}function De(e){var t;const r=(t=e?.TEXTURE_2D)!==null&&t!==void 0?t:3553;return{id:ln(),target:r,format:ja,internalFormat:0,type:0,filter:0,getWidth:()=>0,getHeight:()=>0,getDepth:()=>0,getByteCount:()=>0,define:()=>{},load:()=>{},mipmap:()=>{},bind:n=>{e&&(e.activeTexture(e.TEXTURE0+n),e.bindTexture(r,null))},unbind:n=>{e&&(e.activeTexture(e.TEXTURE0+n),e.bindTexture(r,null))},attachFramebuffer:()=>{throw new Error("cannot attach null-texture to a framebuffer")},detachFramebuffer:()=>{throw new Error("cannot detach null-texture from a framebuffer")},reset:()=>{},destroy:()=>{}}}function rt(e,t,r,n){var i;const o=uu(e,t,r,n);if(r.palette){a.updateIfChanged(o.dUsePalette,!0);const[s,p]=r.palette.domain||[0,1];a.update(o.uPaletteDomain,ae.set(o.uPaletteDomain.ref.value,s,p)),a.update(o.uPaletteDefault,ge.toVec3Normalized(o.uPaletteDefault.ref.value,(i=r.palette.defaultColor)!==null&&i!==void 0?i:ge(13421772))),fu(r.palette,o.tPalette)}else a.updateIfChanged(o.dUsePalette,!1);return o}function uu(e,t,r,n){switch(r.granularity){case"uniform":return lu(e,r.color,n);case"instance":return e.nonInstanceable?Zn(e,r.color,n):mu(e,r.color,n);case"group":return Zn(e,r.color,n);case"groupInstance":return pu(e,r.color,n);case"vertex":return gu(t,r.color,n);case"vertexInstance":return vu(t,r.color,n);case"volume":return Kn(r.grid,"volume",n);case"volumeInstance":return Kn(r.grid,"volumeInstance",n);case"direct":return hu(n)}}function fu(e,t){let r=!0;const n=t.ref.value;if(e.colors.length!==n.width||n.filter!==e.filter)r=!1;else{const s=n.array;let p=0;for(const m of e.colors){const[T,v,y]=ge.toRgb(m);if(s[p++]!==T||s[p++]!==v||s[p++]!==y){r=!1;break}}}if(r)return;const i=new Uint8Array(e.colors.length*3);let o=0;for(const s of e.colors){const[p,m,T]=ge.toRgb(s);i[o++]=p,i[o++]=m,i[o++]=T}a.update(t,{array:i,height:1,width:e.colors.length,filter:e.filter})}function du(e,t){return t?(a.update(t.uColor,ge.toVec3Normalized(t.uColor.ref.value,e)),a.updateIfChanged(t.dColorType,"uniform"),t):{uColor:a.create(ge.toVec3Normalized(_(),e)),tColor:a.create({array:new Uint8Array(3),width:1,height:1}),tColorGrid:a.create(De()),uPaletteDomain:a.create(ae.create(0,1)),uPaletteDefault:a.create(_()),tPalette:a.create({array:new Uint8Array(3),width:1,height:1}),uColorTexDim:a.create(ae.create(1,1)),uColorGridDim:a.create(_.create(1,1,1)),uColorGridTransform:a.create(ce.create(0,0,0,1)),dColorType:a.create("uniform"),dUsePalette:a.create(!1)}}function lu(e,t,r){e.reset();const n=e.hasNext?e.move():{location:qe,isSecondary:!1};return du(t(n.location,n.isSecondary),r)}function Yt(e,t,r){return r?(a.update(r.tColor,e),a.update(r.uColorTexDim,ae.create(e.width,e.height)),a.updateIfChanged(r.dColorType,t),r):{uColor:a.create(_()),tColor:a.create(e),tColorGrid:a.create(De()),uPaletteDomain:a.create(ae.create(0,1)),uPaletteDefault:a.create(_()),tPalette:a.create({array:new Uint8Array(3),width:1,height:1}),uColorTexDim:a.create(ae.create(e.width,e.height)),uColorGridDim:a.create(_.create(1,1,1)),uColorGridTransform:a.create(ce.create(0,0,0,1)),dColorType:a.create(t),dUsePalette:a.create(!1)}}function mu(e,t,r){const{instanceCount:n}=e,i=ye(Math.max(1,n),3,Uint8Array,r&&r.tColor.ref.value.array);for(e.reset();e.hasNext;){const{location:o,isSecondary:s,instanceIndex:p}=e.move();ge.toArray(t(o,s),i.array,p*3),e.skipInstance()}return Yt(i,"instance",r)}function Zn(e,t,r){const{groupCount:n,hasLocation2:i}=e,o=ye(Math.max(1,n*(i?2:1)),3,Uint8Array,r&&r.tColor.ref.value.array);e.reset();const s=i?6:3;for(;e.hasNext&&!e.isNextNewInstance;){const{location:p,location2:m,isSecondary:T,groupIndex:v}=e.move();ge.toArray(t(p,T),o.array,v*s),i&&ge.toArray(t(m,T),o.array,v*s+3)}return Yt(o,"group",r)}function pu(e,t,r){const{groupCount:n,instanceCount:i,hasLocation2:o}=e,s=i*n*(o?2:1),p=ye(Math.max(1,s),3,Uint8Array,r&&r.tColor.ref.value.array);e.reset();const m=o?6:3;for(;e.hasNext;){const{location:T,location2:v,isSecondary:y,index:x}=e.move();ge.toArray(t(T,y),p.array,x*m),o&&ge.toArray(t(v,y),p.array,x*m+3)}return Yt(p,"groupInstance",r)}function gu(e,t,r){const{groupCount:n,stride:i}=e,o=ye(Math.max(1,n),3,Uint8Array,r&&r.tColor.ref.value.array);for(e.reset(),e.voidInstances();e.hasNext&&!e.isNextNewInstance;){const{location:s,isSecondary:p,groupIndex:m}=e.move(),T=t(s,p);for(let v=0;v<i;++v)ge.toArray(T,o.array,(m+v)*3)}return Yt(o,"vertex",r)}function vu(e,t,r){const{groupCount:n,instanceCount:i,stride:o}=e,s=i*n,p=ye(Math.max(1,s),3,Uint8Array,r&&r.tColor.ref.value.array);for(e.reset();e.hasNext;){const{location:m,isSecondary:T,index:v}=e.move(),y=t(m,T);for(let x=0;x<o;++x)ge.toArray(y,p.array,(v+x)*3)}return Yt(p,"vertexInstance",r)}function Kn(e,t,r){const{colors:n,dimension:i,transform:o}=e,s=n.getWidth(),p=n.getHeight();return r?(a.update(r.tColorGrid,n),a.update(r.uColorTexDim,ae.create(s,p)),a.update(r.uColorGridDim,_.clone(i)),a.update(r.uColorGridTransform,ce.clone(o)),a.updateIfChanged(r.dColorType,t),r):{uColor:a.create(_()),tColor:a.create({array:new Uint8Array(3),width:1,height:1}),tColorGrid:a.create(n),uPaletteDomain:a.create(ae.create(0,1)),uPaletteDefault:a.create(_()),tPalette:a.create({array:new Uint8Array(3),width:1,height:1}),uColorTexDim:a.create(ae.create(s,p)),uColorGridDim:a.create(_.clone(i)),uColorGridTransform:a.create(ce.clone(o)),dColorType:a.create(t),dUsePalette:a.create(!1)}}function hu(e){return e?(a.updateIfChanged(e.dColorType,"direct"),e):{uColor:a.create(_()),tColor:a.create({array:new Uint8Array(3),width:1,height:1}),tColorGrid:a.create(De()),uPaletteDomain:a.create(ae.create(0,1)),uPaletteDefault:a.create(_()),tPalette:a.create({array:new Uint8Array(3),width:1,height:1}),uColorTexDim:a.create(ae.create(1,1)),uColorGridDim:a.create(_.create(1,1,1)),uColorGridTransform:a.create(ce.create(0,0,0,1)),dColorType:a.create("direct"),dUsePalette:a.create(!1)}}const Fr=_.transformMat4Offset,bu=_.fromArray,vr=pe.add;function yu(){return{cellSize:0,cellCount:0,cellOffsets:new Uint32Array,cellSpheres:new Float32Array,cellTransform:new Float32Array,cellInstance:new Float32Array,batchSize:0,batchCount:0,batchOffsets:new Uint32Array,batchSpheres:new Float32Array,batchCell:new Uint32Array}}function _u(e,t,r){const n=Tu(e,t),i=xu(n,r),o=new Uint32Array(n.cellOffsets.length),s=new Float32Array(n.cellSpheres.length),p=new Float32Array(n.cellInstance.length);let m=0;for(let v=0,y=i.batchCell.length;v<y;++v){const x=i.batchCell[v],f=n.cellOffsets[x],l=n.cellOffsets[x+1]-f;o[v+1]=o[v]+l;for(let d=0;d<4;++d)s[v*4+d]=n.cellSpheres[x*4+d];for(let d=0;d<l;++d){const g=f+d,b=n.cellInstance[g];for(let u=0;u<16;++u)n.cellTransform[m*16+u]=e.transform[b*16+u];p[m]=b,m+=1}}return{cellSize:n.cellSize,cellCount:n.cellCount,cellOffsets:o,cellSpheres:s,cellTransform:n.cellTransform,cellInstance:p,batchSize:i.batchSize,batchCount:i.batchCount,batchOffsets:i.batchOffsets,batchSpheres:i.batchSpheres,batchCell:wt(i.batchCell)}}function Tu(e,t){const{instanceCount:r,instance:n,transform:i,invariantBoundingSphere:o}=e,s=new Float32Array(r),p=new Float32Array(r),m=new Float32Array(r),T=ue.ofBounds(0,r),v=pe.setEmpty(pe()),{center:y,radius:x}=o,f=_.create(x,x,x),c=_();for(let w=0;w<r;++w)Fr(c,y,i,0,0,w*16),s[w]=c[0],p[w]=c[1],m[w]=c[2],vr(v,c);pe.expand(v,v,f);const l={x:s,y:p,z:m,indices:T},d={box:v,sphere:W.fromBox3D(W(),v)},g=ha(l,d,_.create(t,t,t)),{array:b,offset:u,count:h}=g.buckets,A=u.length,C=new Uint32Array(A+1),I=new Float32Array(A*4),D=new Float32Array(r*16),B=new Float32Array(r),R=pe(),S=W();let E=0;for(let w=0;w<A;++w){const O=u[w],F=h[w];C[w]=O;const L=E;for(let N=O,z=O+F;N<z;++N){const V=b[N];B[E]=n[V];for(let $=0;$<16;++$)D[E*16+$]=i[V*16+$];E+=1}if(F===1)Fr(I,y,D,w*4,0,L*16),I[w*4+3]=x;else{pe.setEmpty(R);const N=L*16;for(let z=0;z<F;++z)Fr(c,y,D,0,0,z*16+N),vr(R,c);pe.expand(R,R,f),W.fromBox3D(S,R),W.toArray(S,I,w*4)}}return C[A]=u[A-1]+h[A-1],{cellSize:t,cellCount:A,cellOffsets:C,cellSpheres:I,cellTransform:D,cellInstance:B}}function xu(e,t){const{cellCount:r,cellSpheres:n}=e,i=new Float32Array(r),o=new Float32Array(r),s=new Float32Array(r),p=ue.ofBounds(0,r),m=pe.setEmpty(pe()),T=_();let v=0;for(let B=0;B<r;++B){const R=B*4;bu(T,n,R),i[B]=T[0],o[B]=T[1],s[B]=T[2],vr(m,T),v=Math.max(v,n[R+3])}const y=_.create(v,v,v);pe.expand(m,m,y);const x={x:i,y:o,z:s,indices:p},f={box:m,sphere:W.fromBox3D(W(),m)},c=ha(x,f,_.create(t,t,t)),{array:l,offset:d,count:g}=c.buckets,b=d.length,u=new Uint32Array(b+1),h=new Float32Array(b*4),A=new Uint32Array(r),C=pe(),I=W();let D=0;for(let B=0;B<b;++B){const R=d[B],S=g[B];u[B]=R;for(let E=R,w=R+S;E<w;++E)A[D]=l[E],D+=1;if(S===1){const E=l[R];h[B*4]=n[E*4],h[B*4+1]=n[E*4+1],h[B*4+2]=n[E*4+2],h[B*4+3]=n[E*4+3]}else{pe.setEmpty(C),v=0;for(let E=R,w=R+S;E<w;++E){const O=l[E];T[0]=n[O*4],T[1]=n[O*4+1],T[2]=n[O*4+2],vr(C,T),v=Math.max(v,n[O*4+3])}_.set(y,v,v,v),pe.expand(C,C,y),W.fromBox3D(I,C),W.toArray(I,h,B*4)}}return u[b]=d[b-1]+g[b-1],{batchSize:t,batchCount:b,batchOffsets:u,batchSpheres:h,batchCell:A}}const Jn=Et(),Cu=ie();function Su(e,t){for(let r=0;r<t;r++)if(Et.fromMat4(Jn,ie.fromArray(Cu,e,r*16)),Et.determinant(Jn)<0)return!0;return!1}function Wa(e,t,r,n,i,o){const s=Su(e,t);if(o){a.update(o.matrix,o.matrix.ref.value);const p=o.transform.ref.value.length>=t*16?o.transform.ref.value:new Float32Array(t*16);p.set(e),a.update(o.transform,p),a.updateIfChanged(o.uInstanceCount,t),a.updateIfChanged(o.instanceCount,t);const m=o.aTransform.ref.value.length>=t*16?o.aTransform.ref.value:new Float32Array(t*16);a.update(o.aTransform,m);const T=o.extraTransform.ref.value.length>=t*16?o.extraTransform.ref.value:new Float32Array(t*16);a.update(o.extraTransform,ea(T,t));const v=o.aInstance.ref.value.length>=t?o.aInstance.ref.value:new Float32Array(t);a.update(o.aInstance,wt(v,t)),a.update(o.hasReflection,s)}else o={aTransform:a.create(new Float32Array(t*16)),matrix:a.create(ie.identity()),transform:a.create(new Float32Array(e)),extraTransform:a.create(ea(new Float32Array(t*16),t)),uInstanceCount:a.create(t),instanceCount:a.create(t),aInstance:a.create(wt(new Float32Array(t))),hasReflection:a.create(s),instanceGrid:a.create(yu())};return Au(o,r,n,i),o}const pn=new Float32Array(16);ie.toArray(ie.identity(),pn,0);function Eu(e){return Wa(new Float32Array(pn),1,void 0,0,0,e)}function ea(e,t){for(let r=0;r<t;r++)e.set(pn,r*16);return e}function Au(e,t,r,n){const i=e.aTransform.ref.value,o=e.aInstance.ref.value,s=e.instanceCount.ref.value,p=e.matrix.ref.value,m=e.transform.ref.value,T=e.extraTransform.ref.value;for(let v=0;v<s;v++){const y=v*16;ie.mulOffset(i,T,m,y,y,y),ie.mulOffset(i,p,i,y,0,y),o[v]=v}if(t&&s>0){const v=_u({instanceCount:s,instance:o,transform:i,invariantBoundingSphere:t},r,n);a.update(e.instanceGrid,v),a.update(e.aInstance,v.cellInstance),a.update(e.aTransform,v.cellTransform)}else a.update(e.aInstance,o),a.update(e.aTransform,i)}const Ut=yi({aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflower:6591981,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,laserlemon:16777044,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrod:16448210,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,maroon2:8323072,maroon3:11546720,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,purple2:8323199,purple3:10494192,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074});(function(){const e=new Map;return Object.keys(Ut).forEach(t=>{e.set(Ut[t],t)}),e})();const qa={Atom:"Atom Property",Chain:"Chain Property",Residue:"Residue Property",Symmetry:"Symmetry",Validation:"Validation",Misc:"Miscellaneous"},Xa=ge(13421772),Iu="Gives everything the same, uniform color.",Ha={value:k.Color(Xa),saturation:k.Numeric(0,{min:-6,max:6,step:.1}),lightness:k.Numeric(0,{min:-6,max:6,step:.1})};function Du(e){return Ha}function gn(e,t){let r=ci(t.value,Xa);return r=ge.saturate(r,t.saturation),r=ge.lighten(r,t.lightness),{factory:gn,granularity:"uniform",color:()=>r,props:t,description:Iu,legend:si([["uniform",r]])}}const Od={name:"uniform",label:"Uniform",category:qa.Misc,factory:gn,getParams:Du,defaultValues:k.getDefaultValues(Ha),isApplicable:e=>!0},Ru="Gives everything the same, uniform size.",$a={value:k.Numeric(1,{min:0,max:20,step:.1})};function Bu(e){return $a}function vn(e,t){const r=t.value;return{factory:vn,granularity:"uniform",size:()=>r,props:t,description:Ru}}const Ld={name:"uniform",label:"Uniform",category:"",factory:vn,getParams:Bu,defaultValues:k.getDefaultValues($a),isApplicable:e=>!0};function _t(e){return{..._t.Zero,...e}}(function(e){e.Zero={metalness:0,roughness:0,bumpiness:0};function t(s,p,m){return p[m]=s.metalness*255,p[m+1]=s.roughness*255,p[m+2]=s.bumpiness*255,p}e.toArray=t;function r(s,p,m){return p[m]=s.metalness,p[m+1]=s.roughness,p[m+2]=s.bumpiness,p}e.toArrayNormalized=r;function n(s,p){return s.metalness===p.metalness&&s.roughness===p.roughness&&s.bumpiness===p.bumpiness}e.areEqual=n;function i({metalness:s,roughness:p,bumpiness:m}){return`M ${s.toFixed(2)} | R ${p.toFixed(2)} | B ${m.toFixed(2)}`}e.toString=i;function o(s){return k.Group({metalness:k.Numeric(0,{min:0,max:1,step:.01}),roughness:k.Numeric(1,{min:0,max:1,step:.01}),bumpiness:k.Numeric(0,{min:0,max:1,step:.01})},{...s,presets:[[{metalness:0,roughness:1,bumpiness:0},"Matte"],[{metalness:0,roughness:.2,bumpiness:0},"Plastic"],[{metalness:0,roughness:.6,bumpiness:0},"Glossy"],[{metalness:1,roughness:.6,bumpiness:0},"Metallic"]]})}e.getParam=o})(_t||(_t={}));function zt(){}(function(e){e.Type={none:0,plane:1,sphere:2,cube:3,cylinder:4,infiniteCone:5},e.Params={variant:k.Select("pixel",k.arrayToOptions(["instance","pixel"])),objects:k.ObjectList({type:k.Select("plane",k.objectToOptions(e.Type,v=>_n(v))),invert:k.Boolean(!1),position:k.Vec3(_()),rotation:k.Group({axis:k.Vec3(_.create(1,0,0)),angle:k.Numeric(0,{min:-180,max:180,step:1},{description:"Angle in Degrees"})},{isExpanded:!0}),scale:k.Vec3(_.create(1,1,1)),transform:k.Mat4(ie.identity())},v=>_n(v.type))};function t(v){return{count:0,type:new Array(v).fill(1),invert:new Array(v).fill(!1),position:new Array(v*3).fill(0),rotation:new Array(v*4).fill(0),scale:new Array(v*3).fill(1),transform:new Array(v*16).fill(0)}}const r=Ke(),n=Ke(),i=_(),o=_(),s=ie(),p=ie();function m(v,y){const x=v.objects.length,{type:f,invert:c,position:l,rotation:d,scale:g,transform:b}=y?.objects||t(x);for(let u=0;u<x;++u){const h=v.objects[u];f[u]=e.Type[h.type],c[u]=h.invert,_.toArray(h.position,l,u*3),_.normalize(i,h.rotation.axis),Ke.toArray(Ke.setAxisAngle(r,i,xa(h.rotation.angle)),d,u*4),_.toArray(h.scale,g,u*3),ie.toArray(h.transform,b,u*16)}return{variant:v.variant,objects:{count:x,type:f,invert:c,position:l,rotation:d,scale:g,transform:b}}}e.getClip=m;function T(v,y){if(v.variant!==y.variant||v.objects.count!==y.objects.count)return!1;const x=v.objects,f=y.objects;for(let c=0,l=x.count;c<l;++c)if(x.invert[c]!==f.invert[c]||x.type[c]!==f.type[c]||(_.fromArray(i,x.position,c*3),_.fromArray(o,f.position,c*3),!_.equals(i,o))||(_.fromArray(i,x.scale,c*3),_.fromArray(o,f.scale,c*3),!_.equals(i,o))||(Ke.fromArray(r,x.rotation,c*4),Ke.fromArray(n,f.rotation,c*4),!Ke.equals(r,n))||(ie.fromArray(s,x.transform,c*16),ie.fromArray(p,f.transform,c*16),!ie.areEqual(s,p,ya)))return!1;return!0}e.areEqual=T})(zt||(zt={}));const wu={custom:{},auto:{},highest:{},higher:{},high:{},medium:{},low:{},lower:{},lowest:{}},Fu=Object.keys(wu),Pu=k.arrayToOptions(Fu),Md={smoothColors:k.MappedStatic("auto",{auto:k.Group({}),on:k.Group({resolutionFactor:k.Numeric(2,{min:.5,max:6,step:.1}),sampleStride:k.Numeric(3,{min:1,max:12,step:1})}),off:k.Group({})})};function Nd(e){return!!e.smoothColors}function Gd(e,t,r){if((e.name==="on"||e.name==="auto"&&t)&&r&&r<3){let n=3;return e.name==="on"?(r*=e.params.resolutionFactor,n=e.params.sampleStride):(r*=2-Ti(0,1.1,r),r=Math.max(.5,r),r>1.2&&(n=2)),{resolution:r,stride:n}}}var X;(function(e){e.MaterialCategory={category:"Material"},e.ShadingCategory={category:"Shading"},e.CullingLodCategory={category:"Culling & LOD"},e.CustomQualityParamInfo={category:"Custom Quality",hideIf:s=>typeof s.quality<"u"&&s.quality!=="custom"},e.Params={alpha:k.Numeric(1,{min:0,max:1,step:.01},{label:"Opacity",isEssential:!0,description:"How opaque/transparent the representation is rendered."}),quality:k.Select("auto",Pu,{isEssential:!0,description:"Visual/rendering quality of the representation."}),material:_t.getParam(),clip:k.Group(zt.Params),emissive:k.Numeric(0,{min:0,max:1,step:.01}),density:k.Numeric(.2,{min:0,max:1,step:.01},{description:"Density value to estimate object thickness."}),instanceGranularity:k.Boolean(!1,{description:"Use instance granularity for marker, transparency, clipping, overpaint, substance data to save memory."}),lod:k.Vec3(_(),void 0,{...e.CullingLodCategory,description:"Level of detail.",fieldLabels:{x:"Min Distance",y:"Max Distance",z:"Overlap (Shader)"}}),cellSize:k.Numeric(200,{min:0,max:5e3,step:100},{...e.CullingLodCategory,description:"Instance grid cell size."}),batchSize:k.Numeric(2e3,{min:0,max:5e4,step:500},{...e.CullingLodCategory,description:"Instance grid batch size."})};function t(s=Ut.grey,p=1,m){m||(m=Eu());const T=ze(1,m.instanceCount.ref.value,1,()=>qe,!1,()=>!1),v={color:gn({},{value:s,lightness:0,saturation:0}),size:vn({},{value:p})};return{transform:m,locationIterator:T,theme:v}}e.createSimple=t;function r(s,p){const m=zt.getClip(s.clip);return{alpha:a.create(s.alpha),uAlpha:a.create(s.alpha),uVertexCount:a.create(p.vertexCount),uGroupCount:a.create(p.groupCount),drawCount:a.create(p.drawCount),uMetalness:a.create(s.material.metalness),uRoughness:a.create(s.material.roughness),uBumpiness:a.create(s.material.bumpiness),uEmissive:a.create(s.emissive),uDensity:a.create(s.density),dClipObjectCount:a.create(m.objects.count),dClipVariant:a.create(m.variant),uClipObjectType:a.create(m.objects.type),uClipObjectInvert:a.create(m.objects.invert),uClipObjectPosition:a.create(m.objects.position),uClipObjectRotation:a.create(m.objects.rotation),uClipObjectScale:a.create(m.objects.scale),uClipObjectTransform:a.create(m.objects.transform),instanceGranularity:a.create(s.instanceGranularity),uLod:a.create(ce.create(s.lod[0],s.lod[1],s.lod[2],0))}}e.createValues=r;function n(s,p){a.updateIfChanged(s.alpha,p.alpha),a.updateIfChanged(s.uMetalness,p.material.metalness),a.updateIfChanged(s.uRoughness,p.material.roughness),a.updateIfChanged(s.uBumpiness,p.material.bumpiness),a.updateIfChanged(s.uEmissive,p.emissive),a.updateIfChanged(s.uDensity,p.density);const m=zt.getClip(p.clip);a.updateIfChanged(s.dClipObjectCount,m.objects.count),a.updateIfChanged(s.dClipVariant,m.variant),a.update(s.uClipObjectType,m.objects.type),a.update(s.uClipObjectInvert,m.objects.invert),a.update(s.uClipObjectPosition,m.objects.position),a.update(s.uClipObjectRotation,m.objects.rotation),a.update(s.uClipObjectScale,m.objects.scale),a.update(s.uClipObjectTransform,m.objects.transform),a.updateIfChanged(s.instanceGranularity,p.instanceGranularity),a.update(s.uLod,ce.set(s.uLod.ref.value,p.lod[0],p.lod[1],p.lod[2],0))}e.updateValues=n;function i(s={}){const p=s.alpha===void 0?!0:s.alpha===1;return{disposed:!1,visible:!0,alphaFactor:1,pickable:!0,colorOnly:!1,opaque:p,writeDepth:p}}e.createRenderableState=i;function o(s,p){s.opaque=p.alpha*s.alphaFactor>=1,s.writeDepth=s.opaque}e.updateRenderableState=o})(X||(X={}));function kd(e,t,r,n){for(let i=t;i<r;++i)ge.toArray(n,e,i*4),e[i*4+3]=255;return!0}function Vd(e,t,r){return e.fill(0,t*4,r*4),!0}function zd(e,t,r){const n=ye(Math.max(1,e),4,Uint8Array,r&&r.tOverpaint.ref.value.array);return r?(a.update(r.tOverpaint,n),a.update(r.uOverpaintTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.dOverpaint,e>0),a.updateIfChanged(r.dOverpaintType,t),r):{tOverpaint:a.create(n),uOverpaintTexDim:a.create(ae.create(n.width,n.height)),dOverpaint:a.create(e>0),tOverpaintGrid:a.create(De()),uOverpaintGridDim:a.create(_.create(1,1,1)),uOverpaintGridTransform:a.create(ce.create(0,0,0,1)),dOverpaintType:a.create(t),uOverpaintStrength:a.create(1)}}const Ou={array:new Uint8Array(4),width:1,height:1};function nt(e){return{tOverpaint:a.create(Ou),uOverpaintTexDim:a.create(ae.create(1,1)),dOverpaint:a.create(!1),tOverpaintGrid:a.create(De()),uOverpaintGridDim:a.create(_.create(1,1,1)),uOverpaintGridTransform:a.create(ce.create(0,0,0,1)),dOverpaintType:a.create("groupInstance"),uOverpaintStrength:a.create(1)}}function Ud(e,t,r,n){for(let i=t;i<r;++i)e[i]=n*255;return!0}function Lu(e,t){if(t===0||e.length<t)return 0;let r=0;for(let n=0;n<t;++n)r+=e[n];return r/(255*t)}function Mu(e,t){if(t===0||e.length<t)return 1;let r=255;for(let n=0;n<t;++n)e[n]>0&&e[n]<r&&(r=e[n]);return r/255}function jd(e,t,r){e.fill(0,t,r)}function Wd(e,t,r){const n=ye(Math.max(1,e),1,Uint8Array,r&&r.tTransparency.ref.value.array);return r?(a.update(r.tTransparency,n),a.update(r.uTransparencyTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.dTransparency,e>0),a.updateIfChanged(r.transparencyAverage,Lu(n.array,e)),a.updateIfChanged(r.transparencyMin,Mu(n.array,e)),a.updateIfChanged(r.dTransparencyType,t),r):{tTransparency:a.create(n),uTransparencyTexDim:a.create(ae.create(n.width,n.height)),dTransparency:a.create(e>0),transparencyAverage:a.create(0),transparencyMin:a.create(1),tTransparencyGrid:a.create(De()),uTransparencyGridDim:a.create(_.create(1,1,1)),uTransparencyGridTransform:a.create(ce.create(0,0,0,1)),dTransparencyType:a.create(t),uTransparencyStrength:a.create(1)}}const Nu={array:new Uint8Array(1),width:1,height:1};function at(e){return{tTransparency:a.create(Nu),uTransparencyTexDim:a.create(ae.create(1,1)),dTransparency:a.create(!1),transparencyAverage:a.create(0),transparencyMin:a.create(1),tTransparencyGrid:a.create(De()),uTransparencyGridDim:a.create(_.create(1,1,1)),uTransparencyGridTransform:a.create(ce.create(0,0,0,1)),dTransparencyType:a.create("groupInstance"),uTransparencyStrength:a.create(1)}}function qd(e,t,r,n){return e.fill(n,t,r),!0}function Xd(e,t,r){e.fill(0,t,r)}function Hd(e,t,r){const n=ye(Math.max(1,e),1,Uint8Array,r&&r.tClipping.ref.value.array);return r?(a.update(r.tClipping,n),a.update(r.uClippingTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.dClipping,e>0),a.updateIfChanged(r.dClippingType,t),r):{tClipping:a.create(n),uClippingTexDim:a.create(ae.create(n.width,n.height)),dClipping:a.create(e>0),dClippingType:a.create(t)}}const Gu={array:new Uint8Array(1),width:1,height:1};function it(e){return{tClipping:a.create(Gu),uClippingTexDim:a.create(ae.create(1,1)),dClipping:a.create(!1),dClippingType:a.create("groupInstance")}}function $d(e,t,r,n){for(let i=t;i<r;++i)_t.toArray(n,e,i*4),e[i*4+3]=255;return!0}function Yd(e,t,r){return e.fill(0,t*4,r*4),!0}function Qd(e,t,r){const n=ye(Math.max(1,e),4,Uint8Array,r&&r.tSubstance.ref.value.array);return r?(a.update(r.tSubstance,n),a.update(r.uSubstanceTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.dSubstance,e>0),a.updateIfChanged(r.dSubstanceType,t),r):{tSubstance:a.create(n),uSubstanceTexDim:a.create(ae.create(n.width,n.height)),dSubstance:a.create(e>0),tSubstanceGrid:a.create(De()),uSubstanceGridDim:a.create(_.create(1,1,1)),uSubstanceGridTransform:a.create(ce.create(0,0,0,1)),dSubstanceType:a.create(t),uSubstanceStrength:a.create(1)}}const ku={array:new Uint8Array(4),width:1,height:1};function ot(e){return{tSubstance:a.create(ku),uSubstanceTexDim:a.create(ae.create(1,1)),dSubstance:a.create(!1),tSubstanceGrid:a.create(De()),uSubstanceGridDim:a.create(_.create(1,1,1)),uSubstanceGridTransform:a.create(ce.create(0,0,0,1)),dSubstanceType:a.create("groupInstance"),uSubstanceStrength:a.create(1)}}function Zd(e,t,r,n){for(let i=t;i<r;++i)e[i]=n*255;return!0}function Vu(e,t){if(t===0||e.length<t)return 0;let r=0;for(let n=0;n<t;++n)r+=e[n];return r/(255*t)}function Kd(e,t,r){e.fill(0,t,r)}function Jd(e,t,r){const n=ye(Math.max(1,e),1,Uint8Array,r&&r.tEmissive.ref.value.array);return r?(a.update(r.tEmissive,n),a.update(r.uEmissiveTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.dEmissive,e>0),a.updateIfChanged(r.emissiveAverage,Vu(n.array,e)),a.updateIfChanged(r.dEmissiveType,t),r):{tEmissive:a.create(n),uEmissiveTexDim:a.create(ae.create(n.width,n.height)),dEmissive:a.create(e>0),emissiveAverage:a.create(0),tEmissiveGrid:a.create(De()),uEmissiveGridDim:a.create(_.create(1,1,1)),uEmissiveGridTransform:a.create(ce.create(0,0,0,1)),dEmissiveType:a.create(t),uEmissiveStrength:a.create(1)}}const zu={array:new Uint8Array(1),width:1,height:1};function ct(e){return{tEmissive:a.create(zu),uEmissiveTexDim:a.create(ae.create(1,1)),dEmissive:a.create(!1),emissiveAverage:a.create(0),tEmissiveGrid:a.create(De()),uEmissiveGridDim:a.create(_.create(1,1,1)),uEmissiveGridTransform:a.create(ce.create(0,0,0,1)),dEmissiveType:a.create("groupInstance"),uEmissiveStrength:a.create(1)}}function el(e,t,r,n){for(let i=t;i<r;++i)e[i]=n*255;return!0}function Uu(e,t){if(t===0||e.length<t)return 0;let r=0;for(let n=0;n<t;++n)r+=e[n];return r/(255*t)}function tl(e,t,r){e.fill(0,t,r)}function rl(e,t,r){const n=ye(Math.max(1,e),1,Uint8Array,r&&r.tWiggle.ref.value.array);return r?(a.update(r.tWiggle,n),a.update(r.uWiggleTexDim,ae.create(n.width,n.height)),a.updateIfChanged(r.dWiggle,e>0),a.updateIfChanged(r.wiggleAverage,Uu(n.array,e)),a.updateIfChanged(r.dWiggleType,t),r):{tWiggle:a.create(n),uWiggleTexDim:a.create(ae.create(n.width,n.height)),dWiggle:a.create(e>0),wiggleAverage:a.create(0),dWiggleType:a.create(t),uWiggleStrength:a.create(1)}}const ju={array:new Uint8Array(1),width:1,height:1};function st(e){return{tWiggle:a.create(ju),uWiggleTexDim:a.create(ae.create(1,1)),dWiggle:a.create(!1),wiggleAverage:a.create(0),dWiggleType:a.create("groupInstance"),uWiggleStrength:a.create(1)}}function Cr(){return k.Group({color:k.Color(ge.fromRgb(76,76,76)),colorStrength:k.Numeric(1,{min:0,max:1,step:.01}),substance:_t.getParam(),substanceStrength:k.Numeric(1,{min:0,max:1,step:.01})})}function nl(e,t){return e.color===t.color&&e.colorStrength===t.colorStrength&&_t.areEqual(e.substance,t.substance)&&e.substanceStrength===t.substanceStrength}function Ya(e,t){return ge.toArrayNormalized(e.color,t,0),t[3]=e.colorStrength,t}function Qa(e,t){return _t.toArrayNormalized(e.substance,t,0),t[3]=e.substanceStrength,t}function Sr(e){return{uInteriorColor:a.create(Ya(e,ce())),uInteriorSubstance:a.create(Qa(e,ce()))}}function Er(e,t){a.update(e.uInteriorColor,Ya(t,e.uInteriorColor.ref.value)),a.update(e.uInteriorSubstance,Qa(t,e.uInteriorSubstance.ref.value))}function Ot(){return k.Group({wiggleMode:k.Select("position",[["position","Position"],["group","Group"]],{description:"Noise seeding mode. Position: spatially correlated (nearby atoms move together). Group: per-group independent noise."}),wiggleSpeed:k.Numeric(7,{min:0,max:10,step:.1},{description:"Speed of vertex wiggle animation."}),wiggleAmplitude:k.Numeric(0,{min:0,max:5,step:.01},{description:"Amplitude of vertex wiggle animation."}),wiggleFrequency:k.Numeric(.2,{min:.01,max:2,step:.01},{description:"Spatial frequency of vertex wiggle noise (position mode). Lower values correlate nearby atoms more."}),tumbleSpeed:k.Numeric(1,{min:0,max:10,step:.1},{description:"Speed of instance tumble animation."}),tumbleAmplitude:k.Numeric(0,{min:0,max:10,step:.1},{description:"Amplitude of instance tumble animation. In Ångströms of implied surface displacement."}),tumbleFrequency:k.Numeric(.2,{min:0,max:2,step:.01},{description:"Spatial frequency multiplier for tumble noise."})})}function al(e,t){return e.wiggleMode===t.wiggleMode&&e.wiggleSpeed===t.wiggleSpeed&&e.wiggleAmplitude===t.wiggleAmplitude&&e.wiggleFrequency===t.wiggleFrequency&&e.tumbleSpeed===t.tumbleSpeed&&e.tumbleAmplitude===t.tumbleAmplitude&&e.tumbleFrequency===t.tumbleFrequency}function Lt(e){return{uWiggleSpeed:a.create(e.wiggleSpeed),uWiggleAmplitude:a.create(e.wiggleAmplitude),uWiggleFrequency:a.create(e.wiggleFrequency),uWiggleMode:a.create(e.wiggleMode==="position"?0:1),uTumbleSpeed:a.create(e.tumbleSpeed),uTumbleAmplitude:a.create(e.tumbleAmplitude),uTumbleFrequency:a.create(e.tumbleFrequency)}}function Mt(e,t){a.updateIfChanged(e.uWiggleSpeed,t.wiggleSpeed),a.updateIfChanged(e.uWiggleAmplitude,t.wiggleAmplitude),a.updateIfChanged(e.uWiggleFrequency,t.wiggleFrequency),a.updateIfChanged(e.uWiggleMode,t.wiggleMode==="position"?0:1),a.updateIfChanged(e.uTumbleSpeed,t.tumbleSpeed),a.updateIfChanged(e.uTumbleAmplitude,t.tumbleAmplitude),a.updateIfChanged(e.uTumbleFrequency,t.tumbleFrequency)}var Jr;(function(e){function t(S,E,w,O,F,L,N){return N?o(S,E,w,O,F,L,N):i(S,E,w,O,F,L)}e.create=t;function r(S){const E=S?S.vertexBuffer.ref.value:new Float32Array(0),w=S?S.indexBuffer.ref.value:new Uint32Array(0),O=S?S.normalBuffer.ref.value:new Float32Array(0),F=S?S.groupBuffer.ref.value:new Float32Array(0);return t(E,w,O,F,0,0,S)}e.createEmpty=r;function n(S){return et([S.vertexCount,S.triangleCount,S.vertexBuffer.ref.version,S.indexBuffer.ref.version,S.normalBuffer.ref.version,S.groupBuffer.ref.version])}function i(S,E,w,O,F,L){const N=W();let z,V=-1,$=-1;const H={kind:"mesh",vertexCount:F,triangleCount:L,vertexBuffer:a.create(S),indexBuffer:a.create(E),normalBuffer:a.create(w),groupBuffer:a.create(O),varyingGroup:a.create(!1),get boundingSphere(){const P=n(H);if(P!==V){const M=yt(H.vertexBuffer.ref.value,H.vertexCount,1);W.copy(N,M),V=P}return N},get groupMapping(){return H.groupBuffer.ref.version!==$&&(z=Pt(H.groupBuffer.ref.value,H.vertexCount),$=H.groupBuffer.ref.version),z},setBoundingSphere(P){W.copy(N,P),V=n(H)},hasBoundingSphere(){return V===n(H)},meta:{}};return H}function o(S,E,w,O,F,L,N){return N.vertexCount=F,N.triangleCount=L,a.update(N.vertexBuffer,S),a.update(N.indexBuffer,E),a.update(N.normalBuffer,w),a.update(N.groupBuffer,O),N}function s(S){const{vertexCount:E,triangleCount:w}=S,O=S.vertexBuffer.ref.value,F=S.indexBuffer.ref.value,L=S.normalBuffer.ref.value.length>=E*3?S.normalBuffer.ref.value:new Float32Array(E*3);L===S.normalBuffer.ref.value&&L.fill(0,0,E*3),Ni(O,F,L,E,w),a.update(S.normalBuffer,L)}e.computeNormals=s;function p(S,E=3){const w=S.vertexBuffer.ref.value,O=new Map,F=(z,V)=>`${z[0].toFixed(V)}|${z[1].toFixed(V)}|${z[2].toFixed(V)}`;let L=0;const N=_();for(let z=0,V=S.vertexCount;z<V;++z){_.fromArray(N,w,z*3);const $=F(N,E),H=O.get($);H!==void 0?(L+=1,O.set($,H+1)):O.set($,1)}return L}e.checkForDuplicateVertices=p;const m=Et();function T(S,E){const w=S.vertexBuffer.ref.value;if(Ft(E,w,0,S.vertexCount),!ie.isTranslationAndUniformScaling(E)){const O=Et.directionTransform(m,E);Mi(O,S.normalBuffer.ref.value,0,S.vertexCount)}a.update(S.vertexBuffer,w)}e.transform=T;function v(S){const{originalData:E}="kind"in S?S.meta:S.meta.ref.value;return E}e.getOriginalData=v;function y(S,E=!0){const{indexBuffer:w,vertexBuffer:O,groupBuffer:F,normalBuffer:L,triangleCount:N,vertexCount:z}=S,V=w.ref.value,$=O.ref.value,H=F.ref.value,P=L.ref.value,M=J.create(Uint32Array,3,1024,N),U=J.create(Float32Array,3,1024,$);U.currentIndex=z*3,U.elementCount=z;const q=J.create(Float32Array,3,1024,P);q.currentIndex=z*3,q.elementCount=z;const te=J.create(Float32Array,1,1024,H);te.currentIndex=z,te.elementCount=z;const j=_(),Q=_(),ne=_(),Z=_(),Y=_(),re=_();function Ce(le){_.fromArray(j,$,le*3),_.fromArray(Z,P,le*3),J.add3(U,j[0],j[1],j[2]),J.add3(q,Z[0],Z[1],Z[2])}function Ae(le,Ne){_.fromArray(j,$,le*3),_.fromArray(Q,$,Ne*3),_.scale(j,_.add(j,j,Q),.5),_.fromArray(Z,P,le*3),_.fromArray(Y,P,Ne*3),_.scale(Z,_.add(Z,Z,Y),.5),J.add3(U,j[0],j[1],j[2]),J.add3(q,Z[0],Z[1],Z[2])}function Me(le,Ne,he){_.fromArray(j,$,le*3),_.fromArray(Q,$,Ne*3),_.fromArray(ne,$,he*3),_.scale(j,_.add(j,_.add(j,j,Q),ne),1/3),_.fromArray(Z,P,le*3),_.fromArray(Y,P,Ne*3),_.fromArray(re,P,he*3),_.scale(Z,_.add(Z,_.add(Z,Z,Y),re),1/3),J.add3(U,j[0],j[1],j[2]),J.add3(q,Z[0],Z[1],Z[2])}function vt(le,Ne,he,Te,xe){++Ue,Ce(le),Ae(le,Ne),Ae(le,he),J.add3(M,se,se+1,se+2);for(let Ie=0;Ie<3;++Ie)J.add(te,Te);se+=3,Ue+=2,Ce(Ne),Ce(he),Ae(le,Ne),Ae(le,he),J.add3(M,se,se+1,se+3),J.add3(M,se,se+3,se+2);for(let Ie=0;Ie<4;++Ie)J.add(te,xe);se+=4}let se=z,Ue=0;if(E)for(let le=0,Ne=N;le<Ne;++le){const he=V[le*3],Te=V[le*3+1],xe=V[le*3+2],Ie=H[he],Xe=H[Te],$e=H[xe];if(Ie===Xe&&Ie===$e)++Ue,J.add3(M,he,Te,xe);else if(Ie===Xe)vt(xe,he,Te,$e,Ie);else if(Ie===$e)vt(Te,xe,he,Xe,$e);else if(Xe===$e)vt(he,Te,xe,Ie,Xe);else{Ue+=2,Ce(he),Ae(he,Te),Ae(he,xe),Me(he,Te,xe),J.add3(M,se,se+1,se+3),J.add3(M,se,se+3,se+2);for(let He=0;He<4;++He)J.add(te,Ie);se+=4,Ue+=2,Ce(Te),Ae(Te,xe),Ae(Te,he),Me(he,Te,xe),J.add3(M,se,se+1,se+3),J.add3(M,se,se+3,se+2);for(let He=0;He<4;++He)J.add(te,Xe);se+=4,Ue+=2,Ce(xe),Ae(xe,Te),Ae(xe,he),Me(he,Te,xe),J.add3(M,se+3,se+1,se),J.add3(M,se+2,se+3,se);for(let He=0;He<4;++He)J.add(te,$e);se+=4}}else for(let le=0,Ne=N;le<Ne;++le){const he=V[le*3],Te=V[le*3+1],xe=V[le*3+2],Ie=H[he],Xe=H[Te],$e=H[xe];if(Ie!==Xe||Ie!==$e){++Ue,Ce(he),Ce(Te),Ce(xe),J.add3(M,se,se+1,se+2);const He=Xe===$e?Xe:Ie;for(let yn=0;yn<3;++yn)J.add(te,He);se+=3}else++Ue,J.add3(M,he,Te,xe)}const ve=J.compact(M),ht=J.compact(U),Be=J.compact(q),er=J.compact(te);return S.vertexCount=se,S.triangleCount=Ue,a.update(O,ht),a.update(F,er),a.update(w,ve),a.update(L,Be),S.meta.originalData={indexBuffer:V,vertexCount:z,triangleCount:N},S}e.uniformTriangleGroup=y;function x(S){const{vertexCount:E,triangleCount:w}=S,O=S.indexBuffer.ref.value,F=[];for(let L=0;L<E;++L)F[L]=[];for(let L=0;L<w;++L){const N=O[L*3],z=O[L*3+1],V=O[L*3+2];xt(F[N],z),xt(F[N],V),xt(F[z],N),xt(F[z],V),xt(F[V],N),xt(F[V],z)}return F}function f(S){const{triangleCount:E}=S,w=S.indexBuffer.ref.value,O=new Map,F=(L,N)=>{const z=xn(L,N),V=O.get(z)||0;O.set(z,V+1)};for(let L=0;L<E;++L){const N=w[L*3],z=w[L*3+1],V=w[L*3+2];F(N,z),F(N,V),F(z,V)}return O}function c(S){const E=new Set,w=[0,0];return S.forEach((O,F)=>{O===1&&(hi(w,F),E.add(w[0]),E.add(w[1]))}),E}function l(S,E,w){const O=new Map,F=(L,N)=>{O.has(L)?xt(O.get(L),N):O.set(L,[N])};return E.forEach(L=>{const N=S[L];for(const z of N)E.has(z)&&w.get(xn(L,z))===1&&F(L,z)}),O}function d(S,E){const{indexBuffer:w,triangleCount:O}=S,F=w.ref.value,L=J.create(Uint32Array,3,1024,O);let N=0;for(let V=0;V<O;++V){const $=F[V*3],H=F[V*3+1],P=F[V*3+2];E[$].length===2||E[H].length===2||E[P].length===2||(J.add3(L,$,H,P),N+=1)}const z=J.compact(L);return S.triangleCount=N,a.update(w,z),S}function g(S,E,w,O){var F;const{vertexBuffer:L,indexBuffer:N,normalBuffer:z,triangleCount:V}=S,$=L.ref.value,H=N.ref.value,P=z.ref.value,M=J.create(Uint32Array,3,1024,V);let U=0;for(let ve=0;ve<V;++ve)J.add3(M,H[ve*3],H[ve*3+1],H[ve*3+2]),U+=1;const q=_(),te=_(),j=_(),Q=_(),ne=_(),Z=_(),Y=_(),re=_(),Ce=_(),Ae=_(),Me=xa(120),vt=new Set,se=Array.from(w.keys()).filter(ve=>w.get(ve).length<2).map(ve=>{const ht=w.get(ve);return _.fromArray(q,$,ve*3),_.fromArray(te,$,ht[0]*3),_.fromArray(j,$,ht[1]*3),_.sub(ne,te,q),_.sub(Z,j,q),[ve,_.angle(ne,Z)]});se.sort(([,ve],[,ht])=>ve-ht);for(const[ve,ht]of se){if(vt.has(ve)||ht>Me)continue;const Be=w.get(ve);if(E[Be[0]].includes(Be[1])&&!(!((F=w.get(Be[0]))===null||F===void 0)&&F.includes(Be[1]))||(_.fromArray(q,$,ve*3),_.fromArray(te,$,Be[0]*3),_.fromArray(j,$,Be[1]*3),_.sub(ne,te,q),_.sub(Z,j,q),_.add(re,ne,Z),_.squaredDistance(q,te)>=O))continue;let er=!1;for(const le of E[ve])if(!Be.includes(le)&&(_.fromArray(Q,$,le*3),_.sub(Y,Q,q),_.dot(re,Y)<0)){er=!0;break}er&&(_.fromArray(Ce,P,ve*3),_.triangleNormal(Ae,q,te,j),_.dot(Ae,Ce)>0?J.add3(M,ve,Be[0],Be[1]):J.add3(M,Be[1],Be[0],ve),vt.add(ve),vt.add(Be[0]),vt.add(Be[1]),U+=1)}const Ue=J.compact(M);return S.triangleCount=U,a.update(N,Ue),S}function b(S,E,w){const{iterations:O,lambda:F}=w,L=_(),N=_(),z=_(),V=_(),$=-F;let H=new Float32Array(S.vertexBuffer.ref.value.length);const P=M=>{const U=S.vertexBuffer.ref.value;H.set(U),E.forEach((te,j)=>{if(te.length!==2)return;_.fromArray(L,U,j*3),_.fromArray(N,U,te[0]*3),_.fromArray(z,U,te[1]*3);const Q=1/_.distance(L,N),ne=1/_.distance(L,z);_.scale(N,N,Q),_.scale(z,z,ne),_.add(V,N,z),_.scale(V,V,1/(Q+ne)),_.sub(V,V,L),_.scale(V,V,M),_.add(V,L,V),_.toArray(V,H,j*3)});const q=S.vertexBuffer.ref.value;a.update(S.vertexBuffer,H),H=q};for(let M=0;M<O;++M)P(F),P($)}function u(S,E){d(S,x(S));for(let N=0;N<10;++N){const z=S.triangleCount,V=f(S),$=x(S),H=c(V),P=l($,H,V);if(g(S,$,P,E.maxNewEdgeLength*E.maxNewEdgeLength),S.triangleCount===z)break}const w=f(S),O=x(S),F=c(w),L=l(O,F,w);return b(S,L,{iterations:E.iterations,lambda:.5}),S}e.smoothEdges=u,e.Params={...X.Params,doubleSided:k.Boolean(!1,X.CustomQualityParamInfo),flipSided:k.Boolean(!1,X.ShadingCategory),flatShaded:k.Boolean(!1,X.ShadingCategory),ignoreLight:k.Boolean(!1,X.ShadingCategory),celShaded:k.Boolean(!1,X.ShadingCategory),xrayShaded:k.Select(!1,[[!1,"Off"],[!0,"On"],["inverted","Inverted"]],X.ShadingCategory),transparentBackfaces:k.Select("off",k.arrayToOptions(["off","on","opaque"]),X.ShadingCategory),bumpFrequency:k.Numeric(0,{min:0,max:10,step:.1},X.ShadingCategory),bumpAmplitude:k.Numeric(1,{min:0,max:5,step:.1},X.ShadingCategory),interior:Cr(),animation:Ot()},e.Utils={Params:e.Params,createEmpty:r,createValues:A,createValuesSimple:C,updateValues:I,updateBoundingSphere:D,createRenderableState:B,updateRenderableState:R,createPositionIterator:h};function h(S,E){const w=S.vertexCount,O=E.instanceCount.ref.value,F=Tt(),L=F.position,N=F.normal,z=S.vertexBuffer.ref.value,V=S.normalBuffer.ref.value,$=E.aTransform.ref.value;return ze(w,O,1,(P,M)=>(M<0?(_.fromArray(L,z,P*3),_.fromArray(N,V,P*3)):(_.transformMat4Offset(L,z,$,0,P*3,M*16),_.transformDirectionOffset(N,V,$,0,P*3,M*16)),F))}function A(S,E,w,O,F){const{instanceCount:L,groupCount:N}=w,z=h(S,E),V=rt(w,z,O.color),$=F.instanceGranularity?Ee(L,"instance"):Ee(L*N,"groupInstance"),H=nt(),P=at(),M=ct(),U=ot(),q=it(),te=st(),j={drawCount:S.triangleCount*3,vertexCount:S.vertexCount,groupCount:N,instanceCount:L},Q=W.clone(S.boundingSphere),ne=Se(Q,E.aTransform.ref.value,L,0);return{dGeometryType:a.create("mesh"),aPosition:S.vertexBuffer,aNormal:S.normalBuffer,aGroup:S.groupBuffer,elements:S.indexBuffer,dVaryingGroup:S.varyingGroup,boundingSphere:a.create(ne),invariantBoundingSphere:a.create(Q),uInvariantBoundingSphere:a.create(ce.ofSphere(Q)),...V,...$,...H,...P,...M,...U,...q,...te,...E,...X.createValues(F,j),uDoubleSided:a.create(F.doubleSided),dFlatShaded:a.create(F.flatShaded),dFlipSided:a.create(F.flipSided),dIgnoreLight:a.create(F.ignoreLight),dCelShaded:a.create(F.celShaded),dXrayShaded:a.create(F.xrayShaded==="inverted"?"inverted":F.xrayShaded===!0?"on":"off"),dTransparentBackfaces:a.create(F.transparentBackfaces),uBumpFrequency:a.create(F.bumpFrequency),uBumpAmplitude:a.create(F.bumpAmplitude),meta:a.create(S.meta),...Sr(F.interior),...Lt(F.animation)}}function C(S,E,w,O,F){const L=X.createSimple(w,O,F),N={...k.getDefaultValues(e.Params),...E};return A(S,L.transform,L.locationIterator,L.theme,N)}function I(S,E){X.updateValues(S,E),a.updateIfChanged(S.uDoubleSided,E.doubleSided),a.updateIfChanged(S.dFlatShaded,E.flatShaded),a.updateIfChanged(S.dFlipSided,E.flipSided),a.updateIfChanged(S.dIgnoreLight,E.ignoreLight),a.updateIfChanged(S.dCelShaded,E.celShaded),a.updateIfChanged(S.dXrayShaded,E.xrayShaded==="inverted"?"inverted":E.xrayShaded===!0?"on":"off"),a.updateIfChanged(S.dTransparentBackfaces,E.transparentBackfaces),a.updateIfChanged(S.uBumpFrequency,E.bumpFrequency),a.updateIfChanged(S.uBumpAmplitude,E.bumpAmplitude),Er(S,E.interior),Mt(S,E.animation)}function D(S,E){const w=W.clone(E.boundingSphere),O=Se(w,S.aTransform.ref.value,S.instanceCount.ref.value,0);W.equals(O,S.boundingSphere.ref.value)||a.update(S.boundingSphere,O),W.equals(w,S.invariantBoundingSphere.ref.value)||(a.update(S.invariantBoundingSphere,w),a.update(S.uInvariantBoundingSphere,ce.fromSphere(S.uInvariantBoundingSphere.ref.value,w)))}function B(S){const E=X.createRenderableState(S);return R(E,S),E}function R(S,E){X.updateRenderableState(S,E),S.opaque=S.opaque&&!E.xrayShaded,S.writeDepth=S.opaque}})(Jr||(Jr={}));const ta=_(),ra=_(),na=_();function il(e,t){const r=t.length,n=Za(r/3);for(let i=0;i<r;i+=3)_.fromArray(ta,e,t[i]*3),_.fromArray(ra,e,t[i+1]*3),_.fromArray(na,e,t[i+2]*3),n.add(ta,ra,na);return n.getPrimitive()}const ir=_();function Za(e,t){t===void 0&&(t=e*3);const r=new Float32Array(t*3),n=new Float32Array(t*3),i=new Uint32Array(e*3);let o=0,s=0;return{add:(p,m,T)=>{_.toArray(p,r,o),_.toArray(m,r,o+3),_.toArray(T,r,o+6),_.triangleNormal(ir,p,m,T);for(let v=0;v<3;++v)_.toArray(ir,n,o+3*v),i[s+v]=o/3+v;o+=9,s+=3},addQuad:(p,m,T,v)=>{_.toArray(p,r,o),_.toArray(m,r,o+3),_.toArray(T,r,o+6),_.toArray(v,r,o+9),_.triangleNormal(ir,p,m,T);for(let x=0;x<4;++x)_.toArray(ir,n,o+3*x);const y=o/3;i[s]=y,i[s+1]=y+1,i[s+2]=y+2,i[s+3]=y+2,i[s+4]=y+3,i[s+5]=y,o+=12,s+=6},getPrimitive:()=>({vertices:r,normals:n,indices:i})}}const It=_(),Wu=Et();function ol(e,t){const{vertices:r,normals:n}=e,i=Et.directionTransform(Wu,t);for(let o=0,s=r.length;o<s;o+=3)_.transformMat4(It,_.fromArray(It,r,o),t),_.toArray(It,r,o),_.transformMat3(It,_.fromArray(It,n,o),i),_.toArray(It,n,o);return e}function qu(e,t){return{vertices:e,edges:t}}function cl(e){return{vertices:new Float32Array(e.vertices),edges:new Uint32Array(e.edges)}}const Pr=_.zero();function sl(e,t){const{vertices:r}=e;for(let n=0,i=r.length;n<i;n+=3)_.transformMat4(Pr,_.fromArray(Pr,r,n),t),_.toArray(Pr,r,n);return e}function Xu(e,t,r=-1){const n=new Float32Array(e*3),i=r===-1?e<=4?Math.sqrt(2)/2:.6:r,o=t?1:0;for(let s=0,p=e;s<p;++s){const m=(s*2+o)/e*Math.PI;n[s*3]=Math.cos(m)*i,n[s*3+1]=Math.sin(m)*i,n[s*3+2]=0}return n}function Qt(e,t,r){return e=dn(Math.round(e),0,16777215)+1,t[r+2]=e%256,e=Math.floor(e/256),t[r+1]=e%256,e=Math.floor(e/256),t[r]=e%256,t}function Ka(e,t,r){return Math.floor(e)*256*256+Math.floor(t)*256+Math.floor(r)-1}const or=255/256,Or=_.create(256*256*256,256*256,256),Hu=ce.create(or/Or[0],or/Or[1],or/Or[2],or/1),aa=ce();function ul(e,t,r,n){return ce.set(aa,e/255,t/255,r/255,n/255),ce.dot(aa,Hu)}function $u(e,t){let r=-1/0;for(let n=0,i=e.length;n<i;n+=t){const o=Ka(e[n],e[n+1],e[n+2]);o>r&&(r=o)}return r}function Zt(e,t,r,n){switch(qt.getGranularity(e,r.granularity)){case"uniform":return Ku(e,r.size,n);case"instance":return Ju(e,r.size,n);case"group":return ef(e,r.size,n);case"groupInstance":return tf(e,r.size,n);case"vertex":return rf(t,r.size,n);case"vertexInstance":return nf(t,r.size,n)}}const Nt=100;function jt(e){switch(e.dSizeType.ref.value){case"uniform":return e.uSize.ref.value;case"instance":case"group":case"groupInstance":case"vertex":case"vertexInstance":let r=0;const n=e.tSize.ref.value.array;for(let i=0,o=n.length;i<o;i+=3){const s=Ka(n[i],n[i+1],n[i+2]);r<s&&(r=s)}return r/Nt}}const Yu={array:new Uint8Array(3),width:1,height:1};function Qu(){return{tSize:a.create(Yu),uSizeTexDim:a.create(ae.create(1,1))}}function Zu(e,t){return t?(a.update(t.uSize,e),a.updateIfChanged(t.dSizeType,"uniform"),t):{uSize:a.create(e),...Qu(),dSizeType:a.create("uniform")}}function Ku(e,t,r){e.reset();const n=e.hasNext?e.move().location:qe;return Zu(t(n),r)}function Kt(e,t,r){return r?(a.update(r.tSize,e),a.update(r.uSizeTexDim,ae.create(e.width,e.height)),a.updateIfChanged(r.dSizeType,t),r):{uSize:a.create(0),tSize:a.create(e),uSizeTexDim:a.create(ae.create(e.width,e.height)),dSizeType:a.create(t)}}function Ju(e,t,r){const{instanceCount:n}=e,i=ye(Math.max(1,n),3,Uint8Array,r&&r.tSize.ref.value.array);for(e.reset();e.hasNext&&!e.isNextNewInstance;){const o=e.move();Qt(t(o.location)*Nt,i.array,o.instanceIndex*3),e.skipInstance()}return Kt(i,"instance",r)}function ef(e,t,r){const{groupCount:n}=e,i=ye(Math.max(1,n),3,Uint8Array,r&&r.tSize.ref.value.array);for(e.reset();e.hasNext&&!e.isNextNewInstance;){const o=e.move();Qt(t(o.location)*Nt,i.array,o.groupIndex*3)}return Kt(i,"group",r)}function tf(e,t,r){const{groupCount:n,instanceCount:i}=e,o=i*n,s=ye(Math.max(1,o),3,Uint8Array,r&&r.tSize.ref.value.array);for(e.reset();e.hasNext;){const p=e.move();Qt(t(p.location)*Nt,s.array,p.index*3)}return Kt(s,"groupInstance",r)}function rf(e,t,r){const{groupCount:n}=e,i=ye(Math.max(1,n),3,Uint8Array,r&&r.tSize.ref.value.array);for(e.reset();e.hasNext;){const o=e.move();Qt(t(o.location)*Nt,i.array,o.index*3)}return Kt(i,"vertex",r)}function nf(e,t,r){const{groupCount:n,instanceCount:i}=e,o=i*n,s=ye(Math.max(1,o),3,Uint8Array,r&&r.tSize.ref.value.array);for(e.reset();e.hasNext;){const p=e.move();Qt(t(p.location)*Nt,s.array,p.index*3)}return Kt(s,"vertexInstance",r)}var en;(function(e){function t(c,l,d,g){return g?o(c,l,d,g):i(c,l,d)}e.create=t;function r(c){const l=c?c.centerBuffer.ref.value:new Float32Array(0),d=c?c.groupBuffer.ref.value:new Float32Array(0);return t(l,d,0,c)}e.createEmpty=r;function n(c){return et([c.pointCount,c.centerBuffer.ref.version,c.groupBuffer.ref.version])}function i(c,l,d){const g=W();let b,u=-1,h=-1;const A={kind:"points",pointCount:d,centerBuffer:a.create(c),groupBuffer:a.create(l),get boundingSphere(){const C=n(A);if(C!==u){const I=yt(A.centerBuffer.ref.value,A.pointCount,1);W.copy(g,I),u=C}return g},get groupMapping(){return A.groupBuffer.ref.version!==h&&(b=Pt(A.groupBuffer.ref.value,A.pointCount),h=A.groupBuffer.ref.version),b},setBoundingSphere(C){W.copy(g,C),u=n(A)},hasBoundingSphere(){return u===n(A)}};return A}function o(c,l,d,g){return g.pointCount=d,a.update(g.centerBuffer,c),a.update(g.groupBuffer,l),g}function s(c,l){const d=c.centerBuffer.ref.value;Ft(l,d,0,c.pointCount),a.update(c.centerBuffer,d)}e.transform=s,e.StyleTypes={square:"Square",circle:"Circle",fuzzy:"Fuzzy"},e.StyleTypeNames=Object.keys(e.StyleTypes),e.Params={...X.Params,sizeFactor:k.Numeric(3,{min:0,max:10,step:.1}),pointSizeAttenuation:k.Boolean(!1),pointStyle:k.Select("square",k.objectToOptions(e.StyleTypes)),animation:Ot()},e.Utils={Params:e.Params,createEmpty:r,createValues:m,createValuesSimple:T,updateValues:v,updateBoundingSphere:y,createRenderableState:x,updateRenderableState:f,createPositionIterator:p};function p(c,l){const d=c.pointCount,g=l.instanceCount.ref.value,b=Tt(),u=b.position,h=c.centerBuffer.ref.value,A=l.aTransform.ref.value;return ze(d,g,1,(I,D)=>(D<0?_.fromArray(u,h,I*3):_.transformMat4Offset(u,h,A,0,I*3,D*16),b))}function m(c,l,d,g,b){const{instanceCount:u,groupCount:h}=d,A=p(c,l),C=rt(d,A,g.color),I=Zt(d,A,g.size),D=b.instanceGranularity?Ee(u,"instance"):Ee(u*h,"groupInstance"),B=nt(),R=at(),S=ct(),E=ot(),w=it(),O=st(),F={drawCount:c.pointCount,vertexCount:c.pointCount,groupCount:h,instanceCount:u},L=W.clone(c.boundingSphere),N=Se(L,l.aTransform.ref.value,u,0);return{dGeometryType:a.create("points"),aPosition:c.centerBuffer,aGroup:c.groupBuffer,boundingSphere:a.create(N),invariantBoundingSphere:a.create(L),uInvariantBoundingSphere:a.create(ce.ofSphere(L)),...C,...I,...D,...B,...R,...S,...E,...w,...O,...l,...X.createValues(b,F),uSizeFactor:a.create(b.sizeFactor),dPointSizeAttenuation:a.create(b.pointSizeAttenuation),dPointStyle:a.create(b.pointStyle),...Lt(b.animation)}}function T(c,l,d,g,b){const u=X.createSimple(d,g,b),h={...k.getDefaultValues(e.Params),...l};return m(c,u.transform,u.locationIterator,u.theme,h)}function v(c,l){X.updateValues(c,l),a.updateIfChanged(c.uSizeFactor,l.sizeFactor),a.updateIfChanged(c.dPointSizeAttenuation,l.pointSizeAttenuation),a.updateIfChanged(c.dPointStyle,l.pointStyle),Mt(c,l.animation)}function y(c,l){const d=W.clone(l.boundingSphere),g=Se(d,c.aTransform.ref.value,c.instanceCount.ref.value,0);W.equals(g,c.boundingSphere.ref.value)||a.update(c.boundingSphere,g),W.equals(d,c.invariantBoundingSphere.ref.value)||(a.update(c.invariantBoundingSphere,d),a.update(c.uInvariantBoundingSphere,ce.fromSphere(c.uInvariantBoundingSphere.ref.value,d)))}function x(c){const l=X.createRenderableState(c);return f(l,c),l}function f(c,l){X.updateRenderableState(c,l),c.opaque=c.opaque&&l.pointStyle!=="fuzzy",c.writeDepth=c.opaque}})(en||(en={}));function ia(e,t,r,n,i,o,s){for(let p=0;p<t;p++){for(let m=0;m<r;m++)n[m]=e[m*t+p];oa(n,i,o,s,r);for(let m=0;m<r;m++)e[m*t+p]=i[m]}for(let p=0;p<r;p++){for(let m=0;m<t;m++)n[m]=e[p*t+m];oa(n,i,o,s,t);for(let m=0;m<t;m++)e[p*t+m]=Math.sqrt(i[m])}}function oa(e,t,r,n,i){r[0]=0,n[0]=Number.MIN_SAFE_INTEGER,n[1]=Number.MAX_SAFE_INTEGER;for(let o=1,s=0;o<i;o++){let p=(e[o]+o*o-(e[r[s]]+r[s]*r[s]))/(2*o-2*r[s]);for(;p<=n[s];)s--,p=(e[o]+o*o-(e[r[s]]+r[s]*r[s]))/(2*o-2*r[s]);s++,r[s]=o,n[s]=p,n[s+1]=Number.MAX_SAFE_INTEGER}for(let o=0,s=0;o<i;o++){for(;n[s+1]<o;)s++;t[o]=(o-r[s])*(o-r[s])+e[r[s]]}}const Lr={};function fl(e){const t=JSON.stringify(e);return Lr[t]===void 0&&(Lr[t]=new af(e)),Lr[t]}const Ja={fontFamily:k.Select("sans-serif",[["sans-serif","Sans Serif"],["monospace","Monospace"],["serif","Serif"],["cursive","Cursive"]]),fontQuality:k.Select(3,[[0,"lower"],[1,"low"],[2,"medium"],[3,"high"],[4,"higher"]]),fontStyle:k.Select("normal",[["normal","Normal"],["italic","Italic"],["oblique","Oblique"]]),fontVariant:k.Select("normal",[["normal","Normal"],["small-caps","Small Caps"]]),fontWeight:k.Select("normal",[["normal","Normal"],["bold","Bold"]])};class af{constructor(t={}){this.mapped={},this.scratchW=0,this.scratchH=0,this.currentX=0,this.currentY=0,this.cutoff=.5;const r={...k.getDefaultValues(Ja),...t};this.props=r;const n=64*(r.fontQuality+1);this.buffer=n/8,this.radius=n/3,this.lineHeight=Math.round(n+2*this.buffer+this.radius),this.maxWidth=Math.round(this.lineHeight*.75),this.texture=ye(350*this.lineHeight*this.maxWidth,1,Uint8Array),this.scratchContext=cf(this.maxWidth,this.lineHeight,{willReadFrequently:!0}),this.scratchContext.font=`${r.fontStyle} ${r.fontVariant} ${r.fontWeight} ${n}px ${r.fontFamily}`,this.scratchContext.fillStyle="black",this.scratchContext.textBaseline="middle",this.scratchData=new Uint8Array(this.lineHeight*this.maxWidth),this.gridOuter=new Float64Array(this.lineHeight*this.maxWidth),this.gridInner=new Float64Array(this.lineHeight*this.maxWidth),this.f=new Float64Array(Math.max(this.lineHeight,this.maxWidth)),this.d=new Float64Array(Math.max(this.lineHeight,this.maxWidth)),this.z=new Float64Array(Math.max(this.lineHeight,this.maxWidth)+1),this.v=new Int16Array(Math.max(this.lineHeight,this.maxWidth)),this.middle=Math.ceil(this.lineHeight/2),this.placeholder=this.get("�")}get(t){if(this.mapped[t]===void 0){this.draw(t);const{array:r,width:n,height:i}=this.texture,o=this.scratchData;if(this.currentX+this.scratchW>n&&(this.currentX=0,this.currentY+=this.scratchH),this.currentY+this.scratchH>i)return console.warn("canvas to small"),this.placeholder;this.mapped[t]={x:this.currentX,y:this.currentY,w:this.scratchW,h:this.scratchH,nw:this.scratchW/this.lineHeight,nh:this.scratchH/this.lineHeight};for(let s=0;s<this.scratchH;++s)for(let p=0;p<this.scratchW;++p)r[n*(this.currentY+s)+this.currentX+p]=o[s*this.scratchW+p];this.currentX+=this.scratchW}return this.mapped[t]}draw(t){const r=this.lineHeight,n=this.scratchContext,i=this.scratchData,o=n.measureText(t),s=Math.min(this.maxWidth,Math.ceil(o.width+2*this.buffer)),p=s*r;n.clearRect(0,0,s,r),n.fillText(t,this.buffer,this.middle);const m=n.getImageData(0,0,s,r);for(let T=0;T<p;T++){const v=m.data[T*4+3]/255;this.gridOuter[T]=v===1?0:v===0?Number.MAX_SAFE_INTEGER:Math.pow(Math.max(0,.5-v),2),this.gridInner[T]=v===1?Number.MAX_SAFE_INTEGER:v===0?0:Math.pow(Math.max(0,v-.5),2)}ia(this.gridOuter,s,r,this.f,this.d,this.v,this.z),ia(this.gridInner,s,r,this.f,this.d,this.v,this.z);for(let T=0;T<p;T++){const v=this.gridOuter[T]-this.gridInner[T];i[T]=Math.max(0,Math.min(255,Math.round(255-255*(v/this.radius+this.cutoff))))}this.scratchW=s,this.scratchH=r}}function of(){throw new Error("When running in Node.js and wanting to use Canvas API, call mol-util/data-source's setCanvasModule function first and pass imported `canvas` module to it.")}function cf(e,t,r){if(gi)return of().createCanvas(e,t).getContext("2d",r);{const n=document.createElement("canvas");return n.width=e,n.height=t,n.getContext("2d",r)}}var tn;(function(e){function t(f,c,l,d,g,b,u,h,A){return A?o(f,c,l,d,g,b,u,h,A):i(f,c,l,d,g,b,u,h)}e.create=t;function r(f){const c=f?f.fontTexture.ref.value:ye(0,1,Uint8Array),l=f?f.centerBuffer.ref.value:new Float32Array(0),d=f?f.mappingBuffer.ref.value:new Float32Array(0),g=f?f.depthBuffer.ref.value:new Float32Array(0),b=f?f.indexBuffer.ref.value:new Uint32Array(0),u=f?f.groupBuffer.ref.value:new Float32Array(0),h=f?f.tcoordBuffer.ref.value:new Float32Array(0);return t(c,l,d,g,b,u,h,0,f)}e.createEmpty=r;function n(f){return et([f.charCount,f.fontTexture.ref.version,f.centerBuffer.ref.version,f.mappingBuffer.ref.version,f.depthBuffer.ref.version,f.indexBuffer.ref.version,f.groupBuffer.ref.version,f.tcoordBuffer.ref.version])}function i(f,c,l,d,g,b,u,h){const A=W();let C,I=-1,D=-1;const B={kind:"text",charCount:h,fontTexture:a.create(f),centerBuffer:a.create(c),mappingBuffer:a.create(l),depthBuffer:a.create(d),indexBuffer:a.create(g),groupBuffer:a.create(b),tcoordBuffer:a.create(u),get boundingSphere(){const R=n(B);if(R!==I){const S=yt(B.centerBuffer.ref.value,B.charCount*4,4);W.copy(A,S),I=R}return A},get groupMapping(){return B.groupBuffer.ref.version!==D&&(C=Pt(B.groupBuffer.ref.value,B.charCount,4),D=B.groupBuffer.ref.version),C},setBoundingSphere(R){W.copy(A,R),I=n(B)},hasBoundingSphere(){return I===n(B)}};return B}function o(f,c,l,d,g,b,u,h,A){return A.charCount=h,a.update(A.fontTexture,f),a.update(A.centerBuffer,c),a.update(A.mappingBuffer,l),a.update(A.depthBuffer,d),a.update(A.indexBuffer,g),a.update(A.groupBuffer,b),a.update(A.tcoordBuffer,u),A}e.Params={...X.Params,...Ja,sizeFactor:k.Numeric(1,{min:0,max:10,step:.1}),borderWidth:k.Numeric(0,{min:0,max:.5,step:.01}),borderColor:k.Color(Ut.grey),offsetX:k.Numeric(0,{min:0,max:10,step:.1}),offsetY:k.Numeric(0,{min:0,max:10,step:.1}),offsetZ:k.Numeric(0,{min:0,max:10,step:.1}),background:k.Boolean(!1),backgroundMargin:k.Numeric(.2,{min:0,max:1,step:.01}),backgroundColor:k.Color(Ut.grey),backgroundOpacity:k.Numeric(1,{min:0,max:1,step:.01}),tether:k.Boolean(!1),tetherLength:k.Numeric(1,{min:0,max:5,step:.1}),tetherBaseWidth:k.Numeric(.3,{min:0,max:1,step:.01}),attachment:k.Select("middle-center",[["bottom-left","bottom-left"],["bottom-center","bottom-center"],["bottom-right","bottom-right"],["middle-left","middle-left"],["middle-center","middle-center"],["middle-right","middle-right"],["top-left","top-left"],["top-center","top-center"],["top-right","top-right"]])},e.Utils={Params:e.Params,createEmpty:r,createValues:p,createValuesSimple:m,updateValues:T,updateBoundingSphere:v,createRenderableState:y,updateRenderableState:x,createPositionIterator:s};function s(f,c){const l=f.charCount*4,d=c.instanceCount.ref.value,g=Tt(),b=g.position,u=f.centerBuffer.ref.value,h=c.aTransform.ref.value;return ze(l,d,4,(C,I)=>(I<0?_.fromArray(b,u,C*3):_.transformMat4Offset(b,u,h,0,C*3,I*16),g))}function p(f,c,l,d,g){const{instanceCount:b,groupCount:u}=l,h=s(f,c),A=rt(l,h,d.color),C=Zt(l,h,d.size),I=g.instanceGranularity?Ee(b,"instance"):Ee(b*u,"groupInstance"),D=nt(),B=at(),R=ct(),S=ot(),E=it(),w=st(),O={drawCount:f.charCount*2*3,vertexCount:f.charCount*4,groupCount:u,instanceCount:b},F=jt(C)*g.sizeFactor,L=ca(f.mappingBuffer.ref.value,f.depthBuffer.ref.value,f.charCount,F),N=W.expand(W(),f.boundingSphere,L),z=Se(N,c.aTransform.ref.value,b,0);return{dGeometryType:a.create("text"),aPosition:f.centerBuffer,aMapping:f.mappingBuffer,aDepth:f.depthBuffer,aGroup:f.groupBuffer,elements:f.indexBuffer,boundingSphere:a.create(z),invariantBoundingSphere:a.create(N),uInvariantBoundingSphere:a.create(ce.ofSphere(N)),...A,...C,...I,...D,...B,...R,...S,...E,...w,...c,aTexCoord:f.tcoordBuffer,tFont:f.fontTexture,padding:a.create(L),...X.createValues(g,O),uSizeFactor:a.create(g.sizeFactor),uBorderWidth:a.create(dn(g.borderWidth,0,.5)),uBorderColor:a.create(ge.toArrayNormalized(g.borderColor,_.zero(),0)),uOffsetX:a.create(g.offsetX),uOffsetY:a.create(g.offsetY),uOffsetZ:a.create(g.offsetZ),uBackgroundColor:a.create(ge.toArrayNormalized(g.backgroundColor,_.zero(),0)),uBackgroundOpacity:a.create(g.backgroundOpacity)}}function m(f,c,l,d,g){const b=X.createSimple(l,d,g),u={...k.getDefaultValues(e.Params),...c};return p(f,b.transform,b.locationIterator,b.theme,u)}function T(f,c){X.updateValues(f,c),a.updateIfChanged(f.uSizeFactor,c.sizeFactor),a.updateIfChanged(f.uBorderWidth,c.borderWidth),ge.fromNormalizedArray(f.uBorderColor.ref.value,0)!==c.borderColor&&(ge.toArrayNormalized(c.borderColor,f.uBorderColor.ref.value,0),a.update(f.uBorderColor,f.uBorderColor.ref.value)),a.updateIfChanged(f.uOffsetX,c.offsetX),a.updateIfChanged(f.uOffsetY,c.offsetY),a.updateIfChanged(f.uOffsetZ,c.offsetZ),ge.fromNormalizedArray(f.uBackgroundColor.ref.value,0)!==c.backgroundColor&&(ge.toArrayNormalized(c.backgroundColor,f.uBackgroundColor.ref.value,0),a.update(f.uBackgroundColor,f.uBackgroundColor.ref.value)),a.updateIfChanged(f.uBackgroundOpacity,c.backgroundOpacity)}function v(f,c){const l=jt(f)*f.uSizeFactor.ref.value,d=ca(f.aMapping.ref.value,f.aDepth.ref.value,c.charCount,l),g=W.expand(W(),c.boundingSphere,d),b=Se(g,f.aTransform.ref.value,f.instanceCount.ref.value,0);W.equals(b,f.boundingSphere.ref.value)||a.update(f.boundingSphere,b),W.equals(g,f.invariantBoundingSphere.ref.value)||(a.update(f.invariantBoundingSphere,g),a.update(f.uInvariantBoundingSphere,ce.fromSphere(f.uInvariantBoundingSphere.ref.value,g))),a.update(f.padding,d)}function y(f){const c=X.createRenderableState(f);return x(c,f),c}function x(f,c){X.updateRenderableState(f,c),f.pickable=!1,f.opaque=!1,f.writeDepth=!0}})(tn||(tn={}));function ca(e,t,r,n){let i=0,o=0,s=0;for(let p=0,m=r*4;p<m;++p){const T=2*p,v=Math.abs(e[T]);v>i&&(i=v);const y=Math.abs(e[T+1]);y>o&&(o=y);const x=Math.abs(t[p]);x>s&&(s=x)}return Math.max(s,n*Math.sqrt(i*i+o*o))}const bt=J.add,cr=J.add2,Oe=J.add3,we=_(),je=_(),Vt=_();var rn;(function(e){function t(r=2048,n=1024,i){const o=J.create(Float32Array,1,n,i?i.groupBuffer.ref.value:r),s=J.create(Float32Array,3,n,i?i.startBuffer.ref.value:r),p=J.create(Float32Array,3,n,i?i.endBuffer.ref.value:r),m=(y,x,f,c,l,d,g)=>{for(let b=0;b<4;++b)Oe(s,y,x,f),Oe(p,c,l,d),bt(o,g)},T=(y,x,f)=>{for(let c=0;c<4;++c)Oe(s,y[0],y[1],y[2]),Oe(p,x[0],x[1],x[2]),bt(o,f)},v=(y,x,f,c)=>{const l=_.distance(y,x),d=f%2!==0,g=Math.floor((f+1)/2),b=l/(f+.5);_.setMagnitude(Vt,_.sub(Vt,x,y),b),_.copy(we,y);for(let u=0;u<g;++u)_.add(we,we,Vt),d&&u===g-1?_.copy(je,x):_.add(je,we,Vt),m(we[0],we[1],we[2],je[0],je[1],je[2],c),_.add(we,we,Vt)};return{add:m,addVec:T,addFixedCountDashes:v,addFixedLengthDashes:(y,x,f,c)=>{const l=_.distance(y,x);v(y,x,l/f,c)},addCage:(y,x,f)=>{const{vertices:c,edges:l}=x;for(let d=0,g=l.length;d<g;d+=2)_.fromArray(we,c,l[d]*3),_.fromArray(je,c,l[d+1]*3),_.transformMat4(we,we,y),_.transformMat4(je,je,y),m(we[0],we[1],we[2],je[0],je[1],je[2],f)},getLines:()=>{const y=o.elementCount/4,x=o.elementCount,f=J.compact(o,!0),c=J.compact(s,!0),l=J.compact(p,!0),d=i&&y<=i.lineCount&&i.stripCount.ref.value===0?i.mappingBuffer.ref.value:new Float32Array(y*8),g=i&&y<=i.lineCount&&i.stripCount.ref.value===0?i.indexBuffer.ref.value:new Uint32Array(y*6),b=i?i.stripBuffer.ref.value:new Uint32Array(0);return(!i||y>i.lineCount||i.stripCount.ref.value>0)&&sf(y,d,g),Wt.create(d,g,f,c,l,b,y,x,0,i)}}}e.create=t})(rn||(rn={}));function sf(e,t,r){for(let n=0;n<e;++n){const i=n*8;t[i]=-1,t[i+1]=-1,t[i+2]=1,t[i+3]=-1,t[i+4]=-1,t[i+5]=1,t[i+6]=1,t[i+7]=1}for(let n=0;n<e;++n){const i=n*4,o=n*6;r[o]=i,r[o+1]=i+1,r[o+2]=i+2,r[o+3]=i+1,r[o+4]=i+3,r[o+5]=i+2}}var sa;(function(e){function t(r=2048,n=1024,i){const o=J.create(Float32Array,1,n,i?i.groupBuffer.ref.value:r),s=J.create(Float32Array,3,n,i?i.startBuffer.ref.value:r),p=J.create(Float32Array,3,n,i?i.endBuffer.ref.value:r),m=J.create(Float32Array,2,n,i?i.mappingBuffer.ref.value:r),T=J.create(Uint32Array,3,n,i?i.indexBuffer.ref.value:r),v=J.create(Uint32Array,1,n,i?i.stripBuffer.ref.value:r);let y=0,x=0,f=0,c=0,l=0,d=0;const g=(b,u,h)=>{if(x===0){f=o.elementCount,c=b,l=u,d=h,x=1;return}const A=o.elementCount;x===1&&(Oe(s,c,l,d),Oe(p,b,u,h),bt(o,y),cr(m,-1,-1),Oe(s,c,l,d),Oe(p,b,u,h),bt(o,y),cr(m,1,-1)),Oe(s,c,l,d),Oe(p,b,u,h),bt(o,y),cr(m,-1,1),Oe(s,c,l,d),Oe(p,b,u,h),bt(o,y),cr(m,1,1);const C=x===1?f:A-2,I=x===1?A+2:A;Oe(T,C,C+1,I),Oe(T,C+1,I+1,I),c=b,l=u,d=h,x++};return{start:b=>{y=b,x=0,v.elementCount===0&&bt(v,0)},add:(b,u,h)=>{g(b,u,h)},addVec:b=>{g(b[0],b[1],b[2])},end:()=>{x=0,bt(v,o.elementCount)},getLines:()=>{const b=T.elementCount/2,u=o.elementCount,h=v.elementCount-1,A=J.compact(o,!0),C=J.compact(s,!0),I=J.compact(p,!0),D=J.compact(m,!0),B=J.compact(T,!0),R=J.compact(v,!0);return Wt.create(D,B,A,C,I,R,b,u,h,i)}}}e.create=t})(sa||(sa={}));var Wt;(function(e){function t(f,c,l,d,g,b,u,h,A,C){return C?s(f,c,l,d,g,b,u,h,A,C):o(f,c,l,d,g,b,u,h,A)}e.create=t;function r(f){const c=f?f.mappingBuffer.ref.value:new Float32Array(0),l=f?f.indexBuffer.ref.value:new Uint32Array(0),d=f?f.groupBuffer.ref.value:new Float32Array(0),g=f?f.startBuffer.ref.value:new Float32Array(0),b=f?f.endBuffer.ref.value:new Float32Array(0),u=f?f.stripBuffer.ref.value:new Uint32Array(0);return t(c,l,d,g,b,u,0,0,0,f)}e.createEmpty=r;function n(f,c){const l=f.vertexBuffer.ref.value,d=f.indexBuffer.ref.value,g=f.groupBuffer.ref.value,b=rn.create(f.triangleCount*3,f.triangleCount/10,c);for(let u=0,h=f.triangleCount*3;u<h;u+=3){const A=d[u],C=d[u+1],I=d[u+2],D=l[A*3],B=l[A*3+1],R=l[A*3+2],S=l[C*3],E=l[C*3+1],w=l[C*3+2],O=l[I*3],F=l[I*3+1],L=l[I*3+2];b.add(D,B,R,S,E,w,g[A]),b.add(D,B,R,O,F,L,g[A]),b.add(S,E,w,O,F,L,g[C])}return b.getLines()}e.fromMesh=n;function i(f){return et([f.lineCount,f.vertexCount,f.mappingBuffer.ref.version,f.indexBuffer.ref.version,f.groupBuffer.ref.version,f.startBuffer.ref.version,f.endBuffer.ref.version,f.stripCount.ref.version,f.stripBuffer.ref.version])}function o(f,c,l,d,g,b,u,h,A){const C=W();let I,D=-1,B=-1;const R={kind:"lines",lineCount:u,vertexCount:h,mappingBuffer:a.create(f),indexBuffer:a.create(c),groupBuffer:a.create(l),startBuffer:a.create(d),endBuffer:a.create(g),stripCount:a.create(A),stripBuffer:a.create(b),get boundingSphere(){const S=i(R);if(S!==D){const E=yt(R.startBuffer.ref.value,R.lineCount*4,4),w=yt(R.endBuffer.ref.value,R.lineCount*4,4);W.expandBySphere(C,E,w),D=S}return C},get groupMapping(){return R.groupBuffer.ref.version!==B&&(I=Pt(R.groupBuffer.ref.value,R.lineCount,4),B=R.groupBuffer.ref.version),I},setBoundingSphere(S){W.copy(C,S),D=i(R)},hasBoundingSphere(){return D===i(R)}};return R}function s(f,c,l,d,g,b,u,h,A,C){return(u>C.lineCount||A!==C.stripCount.ref.value||A>0)&&(a.update(C.mappingBuffer,f),a.update(C.indexBuffer,c)),C.lineCount=u,C.vertexCount=h,a.update(C.groupBuffer,l),a.update(C.startBuffer,d),a.update(C.endBuffer,g),a.updateIfChanged(C.stripCount,A),a.update(C.stripBuffer,b),C}function p(f,c){const l=f.startBuffer.ref.value;Ft(c,l,0,f.vertexCount),a.update(f.startBuffer,l);const d=f.endBuffer.ref.value;Ft(c,d,0,f.vertexCount),a.update(f.endBuffer,d)}e.transform=p,e.Params={...X.Params,sizeFactor:k.Numeric(2,{min:0,max:10,step:.1}),lineSizeAttenuation:k.Boolean(!1),animation:Ot()},e.Utils={Params:e.Params,createEmpty:r,createValues:T,createValuesSimple:v,updateValues:y,updateBoundingSphere:x,createRenderableState:X.createRenderableState,updateRenderableState:X.updateRenderableState,createPositionIterator:m};function m(f,c){const l=f.lineCount*4,d=c.instanceCount.ref.value,g=Tt(),b=g.position,u=f.startBuffer.ref.value,h=f.endBuffer.ref.value,A=c.aTransform.ref.value;return ze(l,d,2,(I,D)=>{const B=I%4===0?u:h;return D<0?_.fromArray(b,B,I*3):_.transformMat4Offset(b,B,A,0,I*3,D*16),g})}function T(f,c,l,d,g){const{instanceCount:b,groupCount:u}=l,h=m(f,c),A=rt(l,h,d.color),C=Zt(l,h,d.size),I=g.instanceGranularity?Ee(b,"instance"):Ee(b*u,"groupInstance"),D=nt(),B=at(),R=ct(),S=ot(),E=it(),w=st(),O={drawCount:f.lineCount*2*3,vertexCount:f.vertexCount,groupCount:u,instanceCount:b},F=W.clone(f.boundingSphere),L=Se(F,c.aTransform.ref.value,b,0);return{dGeometryType:a.create("lines"),aMapping:f.mappingBuffer,aGroup:f.groupBuffer,aStart:f.startBuffer,aEnd:f.endBuffer,elements:f.indexBuffer,boundingSphere:a.create(L),invariantBoundingSphere:a.create(F),uInvariantBoundingSphere:a.create(ce.ofSphere(F)),...A,...C,...I,...D,...B,...R,...S,...E,...w,...c,...X.createValues(g,O),uSizeFactor:a.create(g.sizeFactor),dLineSizeAttenuation:a.create(g.lineSizeAttenuation),uDoubleSided:a.create(!0),dFlipSided:a.create(!1),...Lt(g.animation),stripCount:f.stripCount,stripOffsets:f.stripBuffer}}function v(f,c,l,d,g){const b=X.createSimple(l,d,g),u={...k.getDefaultValues(e.Params),...c};return T(f,b.transform,b.locationIterator,b.theme,u)}function y(f,c){X.updateValues(f,c),a.updateIfChanged(f.uSizeFactor,c.sizeFactor),a.updateIfChanged(f.dLineSizeAttenuation,c.lineSizeAttenuation),Mt(f,c.animation)}function x(f,c){const l=W.clone(c.boundingSphere),d=Se(l,f.aTransform.ref.value,f.instanceCount.ref.value,0);W.equals(d,f.boundingSphere.ref.value)||a.update(f.boundingSphere,d),W.equals(l,f.invariantBoundingSphere.ref.value)||(a.update(f.invariantBoundingSphere,l),a.update(f.uInvariantBoundingSphere,ce.fromSphere(f.uInvariantBoundingSphere.ref.value,l)))}})(Wt||(Wt={}));const Ye=_(),Qe=_(),Ze=_(),Dt=_(),be=Xu(4,!0);function ei(e){const n=Za(12,e?36:24);for(let i=0;i<4;++i){const o=(i+1)%4;_.set(Ye,be[i*3],be[i*3+1],-.5),_.set(Qe,be[o*3],be[o*3+1],-.5),_.set(Ze,be[o*3],be[o*3+1],.5),_.set(Dt,be[i*3],be[i*3+1],.5),e?n.add(Ye,Qe,Ze):n.addQuad(Ye,Qe,Ze,Dt)}return _.set(Ye,be[0],be[1],-.5),_.set(Qe,be[3],be[4],-.5),_.set(Ze,be[6],be[7],-.5),_.set(Dt,be[9],be[10],-.5),e?n.add(Ze,Qe,Ye):n.addQuad(Dt,Ze,Qe,Ye),_.set(Ye,be[0],be[1],.5),_.set(Qe,be[3],be[4],.5),_.set(Ze,be[6],be[7],.5),_.set(Dt,be[9],be[10],.5),e?n.add(Ye,Qe,Ze):n.addQuad(Ye,Qe,Ze,Dt),n.getPrimitive()}let Mr;function uf(){return Mr||(Mr=ei(!1)),Mr}let Nr;function dl(){return Nr||(Nr=ei(!0)),Nr}let Gr;function ll(){return Gr||(Gr=qu([.5,.5,-.5,-.5,.5,-.5,-.5,-.5,-.5,.5,-.5,-.5,.5,.5,.5,-.5,.5,.5,-.5,-.5,.5,.5,-.5,.5],[0,4,1,5,2,6,3,7,0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4])),Gr}function ua(e){return e.map(t=>({x:t[0],alpha:t[1]}))}function fa(e,t){const r=[{x:0,alpha:0},{x:0,alpha:0},...e,{x:1,alpha:0},{x:1,alpha:0}],n=256,i=t?t.ref.value.array:new Uint8Array(n);let o=0,s,p,m,T,v,y;const x=e.length+1;for(let c=0;c<x;++c){s=r[c+1].x,p=r[c+2].x,m=r[c].alpha,T=r[c+1].alpha,v=r[c+2].alpha,y=r[c+3].alpha;const l=Math.round((p-s)*n);for(let d=0;d<l;++d){const g=d/l;i[o]=Math.max(0,xi(m,T,v,y,g,.5)*255),++o}}const f={array:i,width:256,height:1};return t?(a.update(t,f),t):a.create(f)}function ff(e,t,r){if(r)return da(e,t,r.min,r.max);{const[n,i]=ui(e);return da(e,t,n,i)}}function da(e,t,r,n){let i=(n-r)/t;i===0&&(i=1);const o=new Int32Array(t);for(let s=0,p=e.length;s<p;s++){let m=Math.floor((e[s]-r)/i);m>=t?m=t-1:m<0&&(m=0),o[m]++}return{min:r,max:n,binWidth:i,counts:o}}const df=_.transformMat4,St=_.lerp;var Pe;(function(e){e.One={transform:{kind:"matrix",matrix:ie.identity()},cells:We.create(We.Space([1,1,1],[0,1,2]),We.Data1([0])),stats:{min:0,max:0,mean:0,sigma:0}};const t=ie(),r=ie();function n(C){if(C.transform.kind==="matrix")return ie.copy(ie(),C.transform.matrix);if(C.transform.kind==="spacegroup"){const{cells:{space:I}}=C,D=ie.fromScaling(t,_.div(_(),pe.size(_(),C.transform.fractionalBox),_.ofArray(I.dimensions))),B=ie.fromTranslation(r,C.transform.fractionalBox.min);return ie.mul3(ie(),C.transform.cell.fromFractional,B,D)}return ie.identity()}e.getGridToCartesianTransform=n;function i(C,I){return C===I}e.areEquivalent=i;function o(C){return C.cells.data.length===0}e.isEmpty=o;function s(C,I){I||(I=W());const D=C.cells.space.dimensions,B=e.getGridToCartesianTransform(C);return W.fromDimensionsAndTransform(I,D,B)}e.getBoundingSphere=s;function p(C,I){let D=C._historams;return D||(D=C._historams={}),D[I]||(D[I]=ff(C.cells.data,I,{min:C.stats.min,max:C.stats.max})),D[I]}e.getHistogram=p;function m(C,I){const D=e.getGridToCartesianTransform(C);ie.invert(D,D);const B=_(),{stats:R}=C,{dimensions:S,get:E}=C.cells.space,w=C.cells.data,[O,F,L]=S,N=(V,$,H)=>E(w,V,$,H),z=C.periodicity==="xyz";return function($){df(B,$,D);const H=T(B,O,F,L,z,N);return Number.isNaN(H)?H:I==="relative"?(H-R.mean)/R.sigma:H}}e.makeGetTrilinearlyInterpolated=m;function T(C,I,D,B,R,S){const E=Math.trunc(C[0]),w=Math.trunc(C[1]),O=Math.trunc(C[2]);if(!R&&(E<0||E>=I||w<0||w>=D||O<0||O>=B))return Number.NaN;const F=C[0]-E,L=C[1]-w,N=C[2]-O,z=Math.min(E+1,I-1),V=Math.min(w+1,D-1),$=Math.min(O+1,B-1);let H=S(E,w,O),P=S(z,w,O),M=S(E,V,O),U=S(z,V,O);const q=Ct(Ct(H,P,F),Ct(M,U,F),L);H=S(E,w,$),P=S(z,w,$),M=S(E,V,$),U=S(z,V,$);const te=Ct(Ct(H,P,F),Ct(M,U,F),L);return Ct(q,te,N)}e.trilinearlyInterpolate=T;const v=_(),y=_(),x=_(),f=_(),c=_(),l=_(),d=_(),g=_();function b(C,I,D,B,R,S){const E=Math.trunc(C[0]),w=Math.trunc(C[1]),O=Math.trunc(C[2]);if(E<0||E>=I||w<0||w>=D||O<0||O>=B)return!1;const F=C[0]-E,L=C[1]-w,N=C[2]-O,z=Math.min(E+1,I-1),V=Math.min(w+1,D-1),$=Math.min(O+1,B-1);return R(E,w,O,v),R(z,w,O,y),R(E,V,O,x),R(z,V,O,f),St(c,v,y,F),St(l,x,f,F),St(d,c,l,L),R(E,w,$,v),R(z,w,$,y),R(E,V,$,x),R(z,V,$,f),St(c,v,y,F),St(l,x,f,F),St(g,c,l,L),St(S,d,g,N),!0}e.trilinearlyInterpolateVec3=b;function u(C){if(C._gradients)return C._gradients;const I=h(C);return C._gradients=I,I}e.getGradients=u;function h(C){const{dimensions:I,get:D,dataOffset:B}=C.cells.space,R=C.cells.data,[S,E,w]=I,O=S*E*w,F=new Float32Array(O*3);let L=1/0,N=-1/0,z=0,V=0;for(let P=0;P<w;++P)for(let M=0;M<E;++M)for(let U=0;U<S;++U){const q=B(U,M,P)*3,te=Math.max(0,U-1),j=Math.min(S-1,U+1),Q=Math.max(0,M-1),ne=Math.min(E-1,M+1),Z=Math.max(0,P-1),Y=Math.min(w-1,P+1),re=(D(R,j,M,P)-D(R,te,M,P))/(j-te||1),Ce=(D(R,U,ne,P)-D(R,U,Q,P))/(ne-Q||1),Ae=(D(R,U,M,Y)-D(R,U,M,Z))/(Y-Z||1);F[q]=re,F[q+1]=Ce,F[q+2]=Ae;const Me=re*re+Ce*Ce+Ae*Ae;Me<L&&(L=Me),Me>N&&(N=Me),z+=Me,V+=Me*Me}L===1/0&&(L=0),N===-1/0&&(N=1),L=Math.sqrt(L),N=Math.sqrt(N);const $=z/O,H=Math.sqrt(V/O);return{values:F,magnitude:{min:L,max:N,mean:$,sigma:H}}}function A(C){const{values:I}=u(C),{dimensions:D,dataOffset:B}=C.cells.space,[R,S,E]=D,w=(O,F,L,N)=>{const z=B(O,F,L)*3;N[0]=I[z],N[1]=I[z+1],N[2]=I[z+2]};return function(F,L){return b(F,R,S,E,w,L)}}e.makeGetInterpolatedGradient=A})(Pe||(Pe={}));function ml(e,t){return Ta.create("Create Volume",async()=>{const{header:r,values:n}=e,i=We.Space(r.dim,[0,1,2],Float64Array);let o;if(r.dataSetIds.length===0)o=n;else{const[T,v,y]=r.dim,x=(t?.dataIndex||0)+1;let f=0,c=0;o=new Float64Array(T*v*y);for(let l=0;l<T;l++)for(let d=0;d<v;d++)for(let g=0;g<y;g++)o[f++]=n[c],c+=x}const s=We.create(i,We.Data1(o)),p=ie.fromTranslation(ie(),r.origin),m=ie.fromBasis(ie(),r.basisX,r.basisY,r.basisZ);return ie.mul(p,p,m),{label:t?.label,entryId:t?.entryId,grid:{transform:{kind:"matrix",matrix:p},cells:s,stats:{min:li(o),max:un(o),mean:di(o),sigma:fi(o)}},instances:[{transform:ie.identity()}],sourceData:hr.create(e),customProperties:new fn,_propertyData:Object.create(null),_localPropertyData:Object.create(null)}})}var hr;(function(e){function t(n){return n?.kind==="cube"}e.is=t;function r(n){return{kind:"cube",name:n.name,data:n}}e.create=r})(hr||(hr={}));function pl(e,t){return Ta.create("Create Volume",async r=>{const{volume_data_3d_info:n,volume_data_3d:i}=e,o=mi.create(n.spacegroup_number.value(0)||"P 1",_.ofArray(n.spacegroup_cell_size.value(0)),_.scale(_.zero(),_.ofArray(n.spacegroup_cell_angles.value(0)),Math.PI/180)),s=n.axis_order.value(0),p=We.convertToCanonicalAxisIndicesFastToSlow(s),m=p(n.sample_count.value(0)),T=We.Space(m,We.invertAxisOrder(s),Float32Array),v=We.create(T,We.Data1(i.values.toArray({array:Float32Array}))),y=_.ofArray(p(n.origin.value(0))),x=_.ofArray(p(n.dimensions.value(0)));return{label:t?.label,entryId:t?.entryId,grid:{transform:{kind:"spacegroup",cell:o,fractionalBox:pe.create(y,_.add(_.zero(),y,x))},cells:v,stats:{min:n.min_sampled.value(0),max:n.max_sampled.value(0),mean:n.mean_sampled.value(0),sigma:n.sigma_sampled.value(0)},periodicity:_.isInteger(x)?"xyz":"none"},instances:[{transform:ie.identity()}],sourceData:br.create(e),customProperties:new fn,_propertyData:Object.create(null),_localPropertyData:Object.create(null)}})}var br;(function(e){function t(n){return n?.kind==="dscif"}e.is=t;function r(n){return{kind:"dscif",name:n._name,data:n}}e.create=r})(br||(br={}));var la;(function(e){function t(u){var h,A,C,I;return((I=(C=(A=(h=u?.grid)===null||h===void 0?void 0:h.cells)===null||A===void 0?void 0:A.space)===null||C===void 0?void 0:C.dimensions)===null||I===void 0?void 0:I.length)&&u?.instances&&u?.sourceData&&u?.customProperties&&u?._propertyData&&u?._localPropertyData}e.is=t;let r;(function(u){function h(E,w,O){return bi(B(E,O).absoluteValue,B(w,O).absoluteValue,O.sigma/100)}u.areSame=h;function A(E){return{kind:"absolute",absoluteValue:E}}u.absolute=A;function C(E){return{kind:"relative",relativeValue:E}}u.relative=C;function I(E,w){return w*E.sigma+E.mean}u.calcAbsolute=I;function D(E,w){return E.sigma===0?0:(w-E.mean)/E.sigma}u.calcRelative=D;function B(E,w){return E.kind==="absolute"?E:{kind:"absolute",absoluteValue:u.calcAbsolute(w,E.relativeValue)}}u.toAbsolute=B;function R(E,w){return E.kind==="relative"?E:{kind:"relative",relativeValue:u.calcRelative(w,E.absoluteValue)}}u.toRelative=R;function S(E){return E.kind==="relative"?`${E.relativeValue.toFixed(2)} σ`:`${E.absoluteValue.toPrecision(4)}`}u.toString=S})(r=e.IsoValue||(e.IsoValue={}));function n(u,h,A){if(A==="relative")return r.relative(h);const C=r.absolute(h);if(br.is(u.sourceData)){const I={min:u.sourceData.data.volume_data_3d_info.min_source.value(0),max:u.sourceData.data.volume_data_3d_info.max_source.value(0),mean:u.sourceData.data.volume_data_3d_info.mean_source.value(0),sigma:u.sourceData.data.volume_data_3d_info.sigma_source.value(0)};return e.IsoValue.toRelative(C,I)}return C}e.adjustedIsoValue=n;const i={min:-1,max:1,mean:0,sigma:.1};function o(u,h){const A=h||i,{min:C,max:I,mean:D,sigma:B}=A,R=(C-D)/B,S=(I-D)/B;let E=u;return u.kind==="absolute"?u.absoluteValue<C?E=e.IsoValue.absolute(C):u.absoluteValue>I&&(E=e.IsoValue.absolute(I)):u.relativeValue<R?E=e.IsoValue.relative(R):u.relativeValue>S&&(E=e.IsoValue.relative(S)),k.Conditioned(E,{absolute:k.Converted(w=>e.IsoValue.toAbsolute(w,Pe.One.stats).absoluteValue,w=>e.IsoValue.absolute(w),k.Numeric(D,{min:C,max:I,step:Tn(B/100,2)},{immediateUpdate:!0})),relative:k.Converted(w=>e.IsoValue.toRelative(w,Pe.One.stats).relativeValue,w=>e.IsoValue.relative(w),k.Numeric(Math.min(1,S),{min:R,max:S,step:Tn(Math.round((I-C)/B)/100,2)},{immediateUpdate:!0}))},w=>w.kind==="absolute"?"absolute":"relative",(w,O)=>O==="absolute"?e.IsoValue.toAbsolute(w,A):e.IsoValue.toRelative(w,A),{isEssential:!0})}e.createIsoValueParam=o,e.IsoValueParam=o(e.IsoValue.relative(2)),e.One={label:"",grid:Pe.One,instances:[],sourceData:{kind:"",name:"",data:{}},customProperties:new fn,_propertyData:Object.create(null),_localPropertyData:Object.create(null)};function s(u,h){return Pe.areEquivalent(u.grid,h.grid)&&p(u,h)}e.areEquivalent=s;function p(u,h){if(u.instances.length!==h.instances.length)return!1;for(let A=0,C=u.instances.length;A<C;++A)if(!ie.areEqual(u.instances[A].transform,h.instances[A].transform,ya))return!1;return!0}e.areInstanceTransformsEqual=p;function m(u){return Pe.isEmpty(u.grid)||u.instances.length===0}e.isEmpty=m;function T(u){return hr.is(u.sourceData)?u.sourceData.data.header.orbitals:!1}e.isOrbitals=T;function v(u,h){return{kind:"volume-loci",volume:u,instances:h}}e.Loci=v;function y(u){return!!u&&u.kind==="volume-loci"}e.isLoci=y;function x(u,h){return u.volume===h.volume&&ue.areEqual(u.instances,h.instances)}e.areLociEqual=x;function f(u){return m(u.volume)||ue.isEmpty(u.instances)}e.isLociEmpty=f;const c=new lr("98");function l(u,h){const A=Pe.getBoundingSphere(u.grid);if(h||(h=W()),u.instances.length===0)return W.copy(h,A);const C=[];for(let I=0,D=u.instances.length;I<D;++I){const{transform:B}=u.instances[I];C.push(W.transform(W(),A,B))}c.reset();for(const I of C)c.includeSphere(I);c.finishedIncludeStep();for(const I of C)c.radiusSphere(I);return c.getSphere(h)}e.getBoundingSphere=l,(function(u){function h(R,S,E){return{kind:"isosurface-loci",volume:R,isoValue:S,instances:E}}u.Loci=h;function A(R){return!!R&&R.kind==="isosurface-loci"}u.isLoci=A;function C(R,S){return R.volume===S.volume&&e.IsoValue.areSame(R.isoValue,S.isoValue,R.volume.grid.stats)&&ue.areEqual(R.instances,S.instances)}u.areLociEqual=C;function I(R){return m(R.volume)||ue.isEmpty(R.instances)}u.isLociEmpty=I;const D=pe();function B(R,S,E){const w=e.IsoValue.toAbsolute(S,R.grid.stats).absoluteValue,O=w<0,F=[0,0,0],L=R.grid.cells.space.getCoords,N=R.grid.cells.data,[z,V,$]=R.grid.cells.space.dimensions;let H=z-1,P=V-1,M=$-1,U=0,q=0,te=0;for(let Q=0,ne=N.length;Q<ne;++Q)(O&&N[Q]<=w||!O&&N[Q]>=w)&&(L(Q,F),F[0]<H&&(H=F[0]),F[1]<P&&(P=F[1]),F[2]<M&&(M=F[2]),F[0]>U&&(U=F[0]),F[1]>q&&(q=F[1]),F[2]>te&&(te=F[2]));_.set(D.min,H-1,P-1,M-1),_.set(D.max,U+1,q+1,te+1);const j=Pe.getGridToCartesianTransform(R.grid);return pe.transform(D,D,j),W.fromBox3D(E||W(),D)}u.getBoundingSphere=B})(e.Isosurface||(e.Isosurface={})),(function(u){function h(F,L){return{kind:"cell-loci",volume:F,elements:L}}u.Loci=h;function A(F){return!!F&&F.kind==="cell-loci"}u.isLoci=A;function C(F,L){if(F.volume!==L.volume||F.elements.length!==L.elements.length)return!1;for(let N=0,z=F.elements.length;N<z;++N){const V=F.elements[N],$=L.elements[N];if(!ue.areEqual(V.instances,$.instances)||!ue.areEqual(V.indices,$.indices))return!1}return!0}u.areLociEqual=C;function I(F){for(const{indices:L,instances:N}of F.elements)if(!ue.isEmpty(N)||!ue.isEmpty(L))return!1;return!0}u.isLociEmpty=I;function D(F){let L=0;for(const{indices:N,instances:z}of F.elements)L+=ue.size(N)*ue.size(z);return L}u.getLociSize=D;function B(F,L,N){return{kind:"cell-location",volume:F,cell:L,instance:N}}u.Location=B;function R(F){return!!F&&F.kind==="cell-location"}u.isLocation=R;const S=new lr("98"),E=_(),w=_();function O(F,L,N){S.reset();const z=Pe.getGridToCartesianTransform(F.grid),{getCoords:V}=F.grid.cells.space;for(const{indices:H,instances:P}of L)for(let M=0,U=ue.size(H);M<U;M++){const q=ue.getAt(H,M);V(q,E),_.transformMat4(E,E,z);for(let te=0,j=ue.size(P);te<j;te++){const Q=F.instances[ue.getAt(P,te)];_.transformMat4(w,E,Q.transform),S.includePosition(w)}}S.finishedIncludeStep();for(const{indices:H,instances:P}of L)for(let M=0,U=ue.size(H);M<U;M++){const q=ue.getAt(H,M);V(q,E),_.transformMat4(E,E,z);for(let te=0,j=ue.size(P);te<j;te++){const Q=F.instances[ue.getAt(P,te)];_.transformMat4(w,E,Q.transform),S.radiusPosition(w)}}const $=S.getSphere(N);return W.expand($,$,ie.getMaxScaleOnAxis(z)*10)}u.getBoundingSphere=O})(e.Cell||(e.Cell={})),(function(u){function h(F,L){return{kind:"segment-loci",volume:F,elements:L}}u.Loci=h;function A(F){return!!F&&F.kind==="segment-loci"}u.isLoci=A;function C(F,L){if(F.volume!==L.volume||F.elements.length!==L.elements.length)return!1;for(let N=0,z=F.elements.length;N<z;++N){const V=F.elements[N],$=L.elements[N];if(!ue.areEqual(V.instances,$.instances)||!ue.areEqual(V.segments,$.segments))return!1}return!0}u.areLociEqual=C;function I(F){for(const{segments:L,instances:N}of F.elements)if(!ue.isEmpty(N)||!ue.isEmpty(L))return!1;return!0}u.isLociEmpty=I;function D(F){let L=0;for(const{segments:N,instances:z}of F.elements)L+=ue.size(N)*ue.size(z);return L}u.getLociSize=D;const B=pe(),R=pe(),S=pe();function E(F,L,N){const z=e.Segmentation.get(F);if(z){pe.setEmpty(B);const V=Pe.getGridToCartesianTransform(F.grid);for(const{segments:$,instances:H}of L){pe.setEmpty(R);for(let P=0,M=ue.size($);P<M;P++){const U=ue.getAt($,P),q=z.bounds[U];pe.add(R,q.min),pe.add(R,q.max)}pe.transform(R,R,V);for(let P=0,M=ue.size(H);P<M;P++){const U=F.instances[ue.getAt(H,P)];pe.transform(S,R,U.transform),pe.addBox3D(B,S)}}return W.fromBox3D(N||W(),B)}else return e.getBoundingSphere(F,N)}u.getBoundingSphere=E;function w(F,L,N){return{kind:"segment-location",volume:F,segment:L,instance:N}}u.Location=w;function O(F){return!!F&&F.kind==="segment-location"}u.isLocation=O})(e.Segment||(e.Segment={})),e.PickingGranularity={set(u,h){u._propertyData.__picking_granularity__=h},get(u){var h;return(h=u._propertyData.__picking_granularity__)!==null&&h!==void 0?h:"voxel"}},e.Segmentation={set(u,h){u._propertyData.__segmentation__=h},get(u){return u._propertyData.__segmentation__}};function d(u){if(!b(u))return;const h=u.parent||u;if(!h._localPropertyData.__periodicRange__){const A=_.fromArray(_(),h.grid.cells.space.dimensions,0),C=Pe.getGridToCartesianTransform(h.grid);_.transformMat4(A,A,C);const I=_.create(1/0,1/0,1/0),D=_.create(-1/0,-1/0,-1/0),B=_();for(const{transform:R}of h.instances)ie.getTranslation(B,R),_.div(B,B,A),_.round(B,B),_.min(I,I,B),_.max(D,D,B);_.addScalar(D,D,1),h._localPropertyData.__periodicRange__={min:I,max:D}}return h._localPropertyData.__periodicRange__}e.getPeriodicRange=d;function g(u){if(!b(u))return;const h=u.parent||u;if(!h._localPropertyData.__periodicInstanceMapping__){const A=new Map,C=_.fromArray(_(),h.grid.cells.space.dimensions,0),I=Pe.getGridToCartesianTransform(h.grid);_.transformMat4(C,C,I);const{min:D}=d(h),B=_();for(let S=0,E=h.instances.length;S<E;S++){const{transform:w}=h.instances[S];ie.getTranslation(B,w),_.div(B,B,C),_.round(B,B),_.sub(B,B,D),A.set(Cn(B[0],B[1],B[2]),S)}const R=_.fromArray(_(),h.grid.cells.space.dimensions,0);h._localPropertyData.__periodicInstanceMapping__={get(S,E,w){_.set(B,S,E,w),_.div(B,B,R),_.floor(B,B);const O=A.get(Cn(B[0],B[1],B[2]));if(O===void 0)return;_.set(B,S,E,w),_.mod(B,B,R);const F=h.grid.cells.space.dataOffset(B[0],B[1],B[2]);return{instance:O,cell:F}}}}return h._localPropertyData.__periodicInstanceMapping__}e.getPeriodicMapping=g;function b(u){return u.grid.periodicity==="xyz"}e.isPeriodic=b})(la||(la={}));const kr=uf();var nn;(function(e){function t(d,g,b,u,h,A,C,I,D,B,R){return R?i(d,g,b,u,h,A,C,I,D,B,R):n(d,g,b,u,h,A,C,I,D,B)}e.create=t;function r(d){return et([d.bboxSize.ref.version,d.gridDimension.ref.version,d.gridTexture.ref.version,d.transform.ref.version,d.gridStats.ref.version])}function n(d,g,b,u,h,A,C,I,D,B){const R=W();let S=-1;const E=A.getWidth(),w=A.getHeight(),O=A.getDepth(),F={kind:"direct-volume",gridDimension:a.create(g),gridTexture:a.create(A),gridTextureDim:a.create(_.create(E,w,O)),gridStats:a.create(ce.create(C.min,C.max,C.mean,C.sigma)),bboxMin:a.create(d.min),bboxMax:a.create(d.max),bboxSize:a.create(_.sub(_(),d.max,d.min)),transform:a.create(b),cellDim:a.create(h),unitToCartn:a.create(u),cartnToUnit:a.create(ie.invert(ie(),u)),get boundingSphere(){const L=r(F);if(L!==S){const N=lf(F.gridDimension.ref.value,F.transform.ref.value);W.copy(R,N),S=L}return R},packedGroup:a.create(I),axisOrder:a.create(D),dataType:a.create(B),setBoundingSphere(L){W.copy(R,L),S=r(F)},hasBoundingSphere(){return S===r(F)},meta:{}};return F}function i(d,g,b,u,h,A,C,I,D,B,R){const S=A.getWidth(),E=A.getHeight(),w=A.getDepth();return a.update(R.gridDimension,g),a.update(R.gridTexture,A),a.update(R.gridTextureDim,_.set(R.gridTextureDim.ref.value,S,E,w)),a.update(R.gridStats,ce.set(R.gridStats.ref.value,C.min,C.max,C.mean,C.sigma)),a.update(R.bboxMin,d.min),a.update(R.bboxMax,d.max),a.update(R.bboxSize,_.sub(R.bboxSize.ref.value,d.max,d.min)),a.update(R.transform,b),a.update(R.cellDim,h),a.update(R.unitToCartn,u),a.update(R.cartnToUnit,ie.invert(ie(),u)),a.updateIfChanged(R.packedGroup,I),a.updateIfChanged(R.axisOrder,_.fromArray(R.axisOrder.ref.value,D,0)),a.updateIfChanged(R.dataType,B),R}function o(d){const g=pe(),b=_(),u=ie.identity(),h=ie.identity(),A=_(),C=De(),I=Pe.One.stats,D=!1,B=_.create(0,1,2);return t(g,b,u,h,A,C,I,D,B,"byte",d)}e.createEmpty=o,e.Params={...X.Params,ignoreLight:k.Boolean(!1,X.ShadingCategory),celShaded:k.Boolean(!1,X.ShadingCategory),xrayShaded:k.Select(!1,[[!1,"Off"],[!0,"On"],["inverted","Inverted"]],X.ShadingCategory),controlPoints:k.LineGraph([ae.create(.19,0),ae.create(.2,.05),ae.create(.25,.05),ae.create(.26,0),ae.create(.79,0),ae.create(.8,.05),ae.create(.85,.05),ae.create(.86,0)],{isEssential:!0}),stepsPerCell:k.Numeric(3,{min:1,max:10,step:1}),jumpLength:k.Numeric(0,{min:0,max:20,step:.1})},e.Utils={Params:e.Params,createEmpty:o,createValues:v,createValuesSimple:y,updateValues:x,updateBoundingSphere:f,createRenderableState:c,updateRenderableState:l,createPositionIterator:s};function s(d,g){const b=d.transform.ref.value,[u,h,A]=d.gridDimension.ref.value,C=u*h*A,I=g.instanceCount.ref.value,D=Tt(),B=D.position,R=g.aTransform.ref.value;return ze(C,I,1,(E,w)=>{const O=Math.floor(E/A);return B[0]=Math.floor(O/h),B[1]=O%h,B[2]=E%A,_.transformMat4(B,B,b),w>=0&&_.transformMat4Offset(B,B,R,0,0,w*16),D})}function p(d,g){return Math.ceil(_.magnitude(d)*g)}function m(d,g){return Math.min(...d)*(1/g)}function T(d){return 1/d}function v(d,g,b,u,h){const{gridTexture:A,gridTextureDim:C,gridStats:I}=d,{bboxSize:D,bboxMin:B,bboxMax:R,gridDimension:S,transform:E}=d,{instanceCount:w,groupCount:O}=b,F=s(d,g),L=rt(b,F,u.color),N=h.instanceGranularity?Ee(w,"instance"):Ee(w*O,"groupInstance"),z=nt(),V=at(),$=ct(),H=ot(),P=it(),M=st(),[U,q,te]=S.ref.value,j={drawCount:kr.indices.length,vertexCount:U*q*te,groupCount:O,instanceCount:w},Q=W.clone(d.boundingSphere),ne=Se(Q,g.aTransform.ref.value,w,0),Z=ua(h.controlPoints),Y=fa(Z);return{dGeometryType:a.create("directVolume"),...L,...N,...z,...V,...$,...H,...P,...M,...g,...X.createValues(h,j),aPosition:a.create(kr.vertices),elements:a.create(kr.indices),boundingSphere:a.create(ne),invariantBoundingSphere:a.create(Q),uInvariantBoundingSphere:a.create(ce.ofSphere(Q)),uBboxMin:B,uBboxMax:R,uBboxSize:D,uMaxSteps:a.create(p(S.ref.value,h.stepsPerCell)),uStepScale:a.create(m(d.cellDim.ref.value,h.stepsPerCell)),uJumpLength:a.create(h.jumpLength),uTransform:E,uGridDim:S,tTransferTex:Y,uTransferScale:a.create(T(h.stepsPerCell)),dGridTexType:a.create(A.ref.value.getDepth()>0?"3d":"2d"),uGridTexDim:C,tGridTex:A,uGridStats:I,uCellDim:d.cellDim,uCartnToUnit:d.cartnToUnit,uUnitToCartn:d.unitToCartn,dPackedGroup:d.packedGroup,dAxisOrder:a.create(d.axisOrder.ref.value.join("")),dIgnoreLight:a.create(h.ignoreLight),dCelShaded:a.create(h.celShaded),dXrayShaded:a.create(h.xrayShaded==="inverted"?"inverted":h.xrayShaded===!0?"on":"off"),meta:a.create(d.meta)}}function y(d,g,b,u,h){const A=X.createSimple(b,u,h),C={...k.getDefaultValues(e.Params),...g};return v(d,A.transform,A.locationIterator,A.theme,C)}function x(d,g){X.updateValues(d,g),a.updateIfChanged(d.dIgnoreLight,g.ignoreLight),a.updateIfChanged(d.dCelShaded,g.celShaded),a.updateIfChanged(d.dXrayShaded,g.xrayShaded==="inverted"?"inverted":g.xrayShaded===!0?"on":"off");const b=ua(g.controlPoints);fa(b,d.tTransferTex),a.updateIfChanged(d.uMaxSteps,p(d.uGridDim.ref.value,g.stepsPerCell)),a.updateIfChanged(d.uStepScale,m(d.uCellDim.ref.value,g.stepsPerCell)),a.updateIfChanged(d.uTransferScale,T(g.stepsPerCell)),a.updateIfChanged(d.uJumpLength,g.jumpLength)}function f(d,g){const b=W.clone(g.boundingSphere),u=Se(b,d.aTransform.ref.value,d.instanceCount.ref.value,0);W.equals(u,d.boundingSphere.ref.value)||a.update(d.boundingSphere,u),W.equals(b,d.invariantBoundingSphere.ref.value)||(a.update(d.invariantBoundingSphere,b),a.update(d.uInvariantBoundingSphere,ce.fromSphere(d.uInvariantBoundingSphere.ref.value,b)))}function c(d){const g=X.createRenderableState(d);return g.opaque=!1,g.writeDepth=!1,g}function l(d,g){X.updateRenderableState(d,g),d.opaque=!1,d.writeDepth=!1}})(nn||(nn={}));function lf(e,t){return W.fromDimensionsAndTransform(W(),e,t)}var an;(function(e){function t(u,h,A,C){return C?o(u,h,A,C):i(u,h,A)}e.create=t;function r(u){const h=u?u.centerBuffer.ref.value:new Float32Array(0),A=u?u.groupBuffer.ref.value:new Float32Array(0);return t(h,A,0,u)}e.createEmpty=r;function n(u){return et([u.sphereCount,u.centerBuffer.ref.version,u.groupBuffer.ref.version])}function i(u,h,A){const C=W();let I,D=-1,B=-1;const R=a.create(ye(1,4,Float32Array)),S=a.create(ae.create(0,0)),E=a.create([]),w=a.create(0),O={kind:"spheres",sphereCount:A,centerBuffer:a.create(u),groupBuffer:a.create(h),get boundingSphere(){const F=n(O);if(F!==D){const L=yt(O.centerBuffer.ref.value,O.sphereCount,1);W.copy(C,L),D=F}return C},get groupMapping(){return O.groupBuffer.ref.version!==B&&(I=Pt(O.groupBuffer.ref.value,O.sphereCount),B=O.groupBuffer.ref.version),I},setBoundingSphere(F){W.copy(C,F),D=n(O)},hasBoundingSphere(){return D===n(O)},shaderData:{positionGroup:R,texDim:S,lodLevels:E,sizeFactor:w,update(F){var L,N;const z=(L=F?.lodLevels)!==null&&L!==void 0?L:T(E.ref.value),V=(N=F?.sizeFactor)!==null&&N!==void 0?N:w.ref.value,$=y(z,V),H=ye(O.sphereCount,4,Float32Array,R.ref.value.array),P=s(H,O.centerBuffer.ref.value,O.groupBuffer.ref.value,O.sphereCount,$),M=P?m(z,V,P,O.sphereCount):[];a.update(R,H),a.update(S,ae.set(S.ref.value,H.width,H.height)),a.update(E,M),a.update(w,V)}}};return O.shaderData.update(),O}function o(u,h,A,C){return C.sphereCount=A,a.update(C.centerBuffer,u),a.update(C.groupBuffer,h),C.shaderData.update(),C}function s(u,h,A,C,I){const{array:D}=u;if(I.length===0){for(let S=0;S<C;++S)D[S*4+0]=h[S*3+0],D[S*4+1]=h[S*3+1],D[S*4+2]=h[S*3+2],D[S*4+3]=A[S];return}const B=[0];let R=0;for(let S=0,E=I.length;S<E;++S){const w=I[S];for(let O=0;O<C;++O){let F=!1;for(let L=0;L<S;++L)if(O%I[L]===0){F=!0;break}!F&&O%w===0&&(D[R*4+0]=h[O*3+0],D[R*4+1]=h[O*3+1],D[R*4+2]=h[O*3+2],D[R*4+3]=A[O],R+=1)}B.push(R*6)}return B}function p(u,h){if(u.length!==h.length)return!1;for(let A=0,C=u.length;A<C;++A)if(u[A].maxDistance!==h[A].maxDistance||u[A].minDistance!==h[A].minDistance||u[A].overlap!==h[A].overlap||u[A].stride!==h[A].stride||u[A].scaleBias!==h[A].scaleBias)return!1;return!0}function m(u,h,A,C){return u.map((I,D)=>{const B=v(I,h);return[I.minDistance,I.maxDistance,I.overlap,A[A.length-1-D],Math.pow(Math.min(C,B),1/I.scaleBias),I.stride,I.scaleBias]})}function T(u){return u.map(h=>({minDistance:h[0],maxDistance:h[1],overlap:h[2],stride:h[5],scaleBias:h[6]}))}function v(u,h){return Math.max(1,Math.round(u.stride/Math.pow(h,u.scaleBias)))}function y(u,h){return u.map(A=>v(A,h)).reverse()}e.Params={...X.Params,sizeFactor:k.Numeric(1,{min:0,max:10,step:.1}),doubleSided:k.Boolean(!1,X.CustomQualityParamInfo),ignoreLight:k.Boolean(!1,X.ShadingCategory),celShaded:k.Boolean(!1,X.ShadingCategory),xrayShaded:k.Select(!1,[[!1,"Off"],[!0,"On"],["inverted","Inverted"]],X.ShadingCategory),transparentBackfaces:k.Select("off",k.arrayToOptions(["off","on","opaque"]),X.ShadingCategory),solidInterior:k.Boolean(!0,X.ShadingCategory),clipPrimitive:k.Boolean(!1,{...X.ShadingCategory,description:"Clip whole sphere instead of cutting it."}),approximate:k.Boolean(!1,{...X.ShadingCategory,description:"Faster rendering, but has artifacts."}),alphaThickness:k.Numeric(0,{min:0,max:20,step:1},{...X.ShadingCategory,description:"If not zero, adjusts alpha for radius."}),bumpFrequency:k.Numeric(0,{min:0,max:10,step:.1},X.ShadingCategory),bumpAmplitude:k.Numeric(1,{min:0,max:5,step:.1},X.ShadingCategory),interior:Cr(),animation:Ot(),lodLevels:k.ObjectList({minDistance:k.Numeric(0),maxDistance:k.Numeric(0),overlap:k.Numeric(0),stride:k.Numeric(0),scaleBias:k.Numeric(3,{min:.1,max:10,step:.1})},u=>`${u.stride}`,{...X.CullingLodCategory,defaultValue:[]})},e.Utils={Params:e.Params,createEmpty:r,createValues:f,createValuesSimple:c,updateValues:l,updateBoundingSphere:d,createRenderableState:g,updateRenderableState:b,createPositionIterator:x};function x(u,h){const A=u.sphereCount,C=h.instanceCount.ref.value,I=Tt(),D=I.position,B=u.centerBuffer.ref.value,R=h.aTransform.ref.value;return ze(A,C,1,(E,w)=>(w<0?_.fromArray(D,B,E*3):_.transformMat4Offset(D,B,R,0,E*3,w*16),I))}function f(u,h,A,C,I){const{instanceCount:D,groupCount:B}=A,R=x(u,h),S=rt(A,R,C.color),E=Zt(A,R,C.size),w=I.instanceGranularity?Ee(D,"instance"):Ee(D*B,"groupInstance"),O=nt(),F=at(),L=ct(),N=ot(),z=it(),V=st(),$={drawCount:u.sphereCount*2*3,vertexCount:u.sphereCount*6,groupCount:B,instanceCount:D},H=u.boundingSphere.radius?jt(E)*I.sizeFactor:0,P=W.expand(W(),u.boundingSphere,H),M=Se(P,h.aTransform.ref.value,D,0);return u.shaderData.update({lodLevels:I.lodLevels,sizeFactor:I.sizeFactor}),{dGeometryType:a.create("spheres"),uTexDim:u.shaderData.texDim,tPositionGroup:u.shaderData.positionGroup,boundingSphere:a.create(M),invariantBoundingSphere:a.create(P),uInvariantBoundingSphere:a.create(ce.ofSphere(P)),...S,...E,...w,...O,...F,...L,...N,...z,...V,...h,padding:a.create(H),...X.createValues(I,$),uSizeFactor:u.shaderData.sizeFactor,uDoubleSided:a.create(I.doubleSided),dIgnoreLight:a.create(I.ignoreLight),dCelShaded:a.create(I.celShaded),dXrayShaded:a.create(I.xrayShaded==="inverted"?"inverted":I.xrayShaded===!0?"on":"off"),dTransparentBackfaces:a.create(I.transparentBackfaces),dSolidInterior:a.create(I.solidInterior),dClipPrimitive:a.create(I.clipPrimitive),dApproximate:a.create(I.approximate),uAlphaThickness:a.create(I.alphaThickness),uBumpFrequency:a.create(I.bumpFrequency),uBumpAmplitude:a.create(I.bumpAmplitude),lodLevels:u.shaderData.lodLevels,centerBuffer:u.centerBuffer,groupBuffer:u.groupBuffer,...Sr(I.interior),...Lt(I.animation)}}function c(u,h,A,C,I){const D=X.createSimple(A,C,I),B={...k.getDefaultValues(e.Params),...h};return f(u,D.transform,D.locationIterator,D.theme,B)}function l(u,h){X.updateValues(u,h),a.updateIfChanged(u.uSizeFactor,h.sizeFactor),a.updateIfChanged(u.uDoubleSided,h.doubleSided),a.updateIfChanged(u.dIgnoreLight,h.ignoreLight),a.updateIfChanged(u.dCelShaded,h.celShaded),a.updateIfChanged(u.dXrayShaded,h.xrayShaded==="inverted"?"inverted":h.xrayShaded===!0?"on":"off"),a.updateIfChanged(u.dTransparentBackfaces,h.transparentBackfaces),a.updateIfChanged(u.dSolidInterior,h.solidInterior),a.updateIfChanged(u.dClipPrimitive,h.clipPrimitive),a.updateIfChanged(u.dApproximate,h.approximate),a.updateIfChanged(u.uAlphaThickness,h.alphaThickness),a.updateIfChanged(u.uBumpFrequency,h.bumpFrequency),a.updateIfChanged(u.uBumpAmplitude,h.bumpAmplitude),Er(u,h.interior),Mt(u,h.animation);const A=T(u.lodLevels.ref.value);if(!p(h.lodLevels,A)){const C=u.uVertexCount.ref.value/6,I=y(h.lodLevels,h.sizeFactor),D=s(u.tPositionGroup.ref.value,u.centerBuffer.ref.value,u.groupBuffer.ref.value,C,I),B=D?m(h.lodLevels,h.sizeFactor,D,C):[];a.update(u.tPositionGroup,u.tPositionGroup.ref.value),a.update(u.lodLevels,B)}}function d(u,h){const A=h.boundingSphere.radius?jt(u)*u.uSizeFactor.ref.value:0,C=W.expand(W(),h.boundingSphere,A),I=Se(C,u.aTransform.ref.value,u.instanceCount.ref.value,0);W.equals(I,u.boundingSphere.ref.value)||a.update(u.boundingSphere,I),W.equals(C,u.invariantBoundingSphere.ref.value)||(a.update(u.invariantBoundingSphere,C),a.update(u.uInvariantBoundingSphere,ce.fromSphere(u.uInvariantBoundingSphere.ref.value,C))),a.update(u.padding,A)}function g(u){const h=X.createRenderableState(u);return b(h,u),h}function b(u,h){X.updateRenderableState(u,h),u.opaque=u.opaque&&!h.xrayShaded,u.writeDepth=u.opaque}})(an||(an={}));var on;(function(e){class t{constructor(){this.index=0,this.textures=[]}get(){return this.textures[this.index]}set(f,c,l){this.textures[this.index]=Object.assign(this.textures[this.index]||{},{vertex:f,group:c,normal:l}),this.index=(this.index+1)%2}destroy(){for(const f of this.textures)f.vertex.destroy(),f.group.destroy(),f.normal.destroy()}}e.DoubleBuffer=t;function r(x,f,c,l,d,g,b){const u=c.getWidth(),h=c.getHeight();return b?(b.vertexCount=x,b.groupCount=f,a.update(b.geoTextureDim,ae.set(b.geoTextureDim.ref.value,u,h)),a.update(b.vertexTexture,c),a.update(b.groupTexture,l),a.update(b.normalTexture,d),b.doubleBuffer.set(c,l,d),W.copy(b.boundingSphere,g),b):{kind:"texture-mesh",vertexCount:x,groupCount:f,geoTextureDim:a.create(ae.create(u,h)),vertexTexture:a.create(c),groupTexture:a.create(l),normalTexture:a.create(d),varyingGroup:a.create(!1),doubleBuffer:new t,boundingSphere:W.clone(g),meta:{}}}e.create=r;function n(x){const f=x?x.vertexTexture.ref.value:De(),c=x?x.groupTexture.ref.value:De(),l=x?x.normalTexture.ref.value:De(),d=x?x.boundingSphere:W();return r(0,0,f,c,l,d,x)}e.createEmpty=n,e.Params={...X.Params,doubleSided:k.Boolean(!1,X.CustomQualityParamInfo),flipSided:k.Boolean(!1,X.ShadingCategory),flatShaded:k.Boolean(!1,X.ShadingCategory),ignoreLight:k.Boolean(!1,X.ShadingCategory),celShaded:k.Boolean(!1,X.ShadingCategory),xrayShaded:k.Select(!1,[[!1,"Off"],[!0,"On"],["inverted","Inverted"]],X.ShadingCategory),transparentBackfaces:k.Select("off",k.arrayToOptions(["off","on","opaque"]),X.ShadingCategory),bumpFrequency:k.Numeric(0,{min:0,max:10,step:.1},X.ShadingCategory),bumpAmplitude:k.Numeric(1,{min:0,max:5,step:.1},X.ShadingCategory),interior:Cr(),animation:Ot()},e.Utils={Params:e.Params,createEmpty:n,createValues:s,createValuesSimple:p,updateValues:m,updateBoundingSphere:T,createRenderableState:v,updateRenderableState:y,createPositionIterator:o};const i="texture-mesh";function o(x,f){const c=x.meta.webgl;if(!c)return ze(1,1,1,()=>qe);c.namedFramebuffers[i]||(c.namedFramebuffers[i]=c.resources.framebuffer());const l=c.namedFramebuffers[i],[d,g]=x.geoTextureDim.ref.value;let b;const u=()=>{if(!b){const S=new Float32Array(d*g*4);l.bind(),x.vertexTexture.ref.value.attachFramebuffer(l,0),c.readPixels(0,0,d,g,S);const E=new Float32Array(d*g*4);l.bind(),x.normalTexture.ref.value.attachFramebuffer(l,0),c.readPixels(0,0,d,g,E),b={vertices:S,normals:E}}return b},h=x.vertexCount,A=f.instanceCount.ref.value,C=Tt(),I=C.position,D=C.normal,B=f.aTransform.ref.value;return ze(h,A,1,(S,E)=>{const{vertices:w,normals:O}=u();return E<0?(_.fromArray(I,w,S*4),_.fromArray(D,O,S*4)):(_.transformMat4Offset(I,w,B,0,S*4,E*16),_.transformDirectionOffset(D,O,B,0,S*4,E*16)),C})}function s(x,f,c,l,d){const{instanceCount:g,groupCount:b}=c,u=e.Utils.createPositionIterator(x,f),h=rt(c,u,l.color),A=d.instanceGranularity?Ee(g,"instance"):Ee(g*b,"groupInstance"),C=nt(),I=at(),D=ct(),B=ot(),R=it(),S=st(),E={drawCount:x.vertexCount,vertexCount:x.vertexCount,groupCount:b,instanceCount:g},w=W.clone(x.boundingSphere),O=Se(w,f.aTransform.ref.value,g,0);return{dGeometryType:a.create("textureMesh"),uGeoTexDim:x.geoTextureDim,tPosition:x.vertexTexture,tGroup:x.groupTexture,tNormal:x.normalTexture,dVaryingGroup:x.varyingGroup,boundingSphere:a.create(O),invariantBoundingSphere:a.create(w),uInvariantBoundingSphere:a.create(ce.ofSphere(w)),...h,...A,...C,...I,...D,...B,...R,...S,...f,...X.createValues(d,E),uDoubleSided:a.create(d.doubleSided),dFlatShaded:a.create(d.flatShaded),dFlipSided:a.create(d.flipSided),dIgnoreLight:a.create(d.ignoreLight),dCelShaded:a.create(d.celShaded),dXrayShaded:a.create(d.xrayShaded==="inverted"?"inverted":d.xrayShaded===!0?"on":"off"),dTransparentBackfaces:a.create(d.transparentBackfaces),uBumpFrequency:a.create(d.bumpFrequency),uBumpAmplitude:a.create(d.bumpAmplitude),meta:a.create(x.meta),...Sr(d.interior),...Lt(d.animation)}}function p(x,f,c,l,d){const g=X.createSimple(c,l,d),b={...k.getDefaultValues(e.Params),...f};return s(x,g.transform,g.locationIterator,g.theme,b)}function m(x,f){X.updateValues(x,f),a.updateIfChanged(x.uDoubleSided,f.doubleSided),a.updateIfChanged(x.dFlatShaded,f.flatShaded),a.updateIfChanged(x.dFlipSided,f.flipSided),a.updateIfChanged(x.dIgnoreLight,f.ignoreLight),a.updateIfChanged(x.dCelShaded,f.celShaded),a.updateIfChanged(x.dXrayShaded,f.xrayShaded==="inverted"?"inverted":f.xrayShaded===!0?"on":"off"),a.updateIfChanged(x.dTransparentBackfaces,f.transparentBackfaces),a.updateIfChanged(x.uBumpFrequency,f.bumpFrequency),a.updateIfChanged(x.uBumpAmplitude,f.bumpAmplitude),Er(x,f.interior),Mt(x,f.animation)}function T(x,f){const c=W.clone(f.boundingSphere),l=Se(c,x.aTransform.ref.value,x.instanceCount.ref.value,0);W.equals(l,x.boundingSphere.ref.value)||a.update(x.boundingSphere,l),W.equals(c,x.invariantBoundingSphere.ref.value)||(a.update(x.invariantBoundingSphere,c),a.update(x.uInvariantBoundingSphere,ce.fromSphere(x.uInvariantBoundingSphere.ref.value,c)))}function v(x){const f=X.createRenderableState(x);return y(f,x),f}function y(x,f){X.updateRenderableState(x,f),x.opaque=x.opaque&&!f.xrayShaded,x.writeDepth=x.opaque}})(on||(on={}));function mf(e,t){const r={},n={},i={},o={},s={},p={},m={};return Object.keys(e).forEach(T=>{const v=e[T];v.type==="attribute"&&(r[T]=t[T]),v.type==="define"&&(n[T]=t[T]),v.type==="texture"&&t[T]!==void 0&&(v.variant==="material"?o[T]=t[T]:i[T]=t[T]),v.type==="uniform"&&t[T]!==void 0&&(v.variant==="material"?p[T]=t[T]:v.variant==="buffered"?m[T]=t[T]:s[T]=t[T])}),{attributeValues:r,defineValues:n,textureValues:i,materialTextureValues:o,uniformValues:s,materialUniformValues:p,bufferedUniformValues:m}}function pf(e){const t={};return Object.keys(e).forEach(r=>{t[r]=e[r].ref.version}),t}function me(e,t,r){return{type:"attribute",kind:e,itemSize:t,divisor:r}}function G(e,t){return{type:"uniform",kind:e,variant:t}}function de(e,t,r,n,i){return{type:"texture",kind:e,format:t,dataType:r,filter:n,variant:i}}function Gt(e){return{type:"elements",kind:e}}function ee(e,t){return{type:"define",kind:e,options:t}}function fe(e){return{type:"value",kind:e}}const ut={uDrawId:G("i"),uModel:G("m4"),uView:G("m4"),uInvView:G("m4"),uModelView:G("m4"),uInvModelView:G("m4"),uProjection:G("m4"),uInvProjection:G("m4"),uModelViewProjection:G("m4"),uInvModelViewProjection:G("m4"),uHasHeadRotation:G("b"),uInvHeadRotation:G("m4"),uIsAsymmetricProjection:G("b"),uHasEyeCamera:G("b"),uModelViewEye:G("m4"),uInvModelViewEye:G("m4"),uIsOrtho:G("f"),uPixelRatio:G("f"),uViewport:G("v4"),uViewOffset:G("v2"),uModelScale:G("f"),uDrawingBufferSize:G("v2"),uCameraPosition:G("v3"),uCameraDir:G("v3"),uCameraPlane:G("v4"),uNear:G("f"),uFar:G("f"),uFog:G("b"),uFogNear:G("f"),uFogFar:G("f"),uFogColor:G("v3"),uTransparentBackground:G("b"),uLightDirection:G("v3[]"),uLightColor:G("v3[]"),uAmbientColor:G("v3"),uPickingAlphaThreshold:G("f"),uHighlightColor:G("v3"),uSelectColor:G("v3"),uDimColor:G("v3"),uHighlightStrength:G("f"),uSelectStrength:G("f"),uDimStrength:G("f"),uMarkerPriority:G("i"),uMarkerAverage:G("f"),uXrayEdgeFalloff:G("f"),uCelSteps:G("f"),uExposure:G("f"),uRenderMask:G("i"),uMarkingDepthTest:G("b"),uMarkingType:G("i"),uPickType:G("i"),uTime:G("f"),uEnableAnimation:G("b")},ft={tDepth:de("texture","depth","ushort","nearest"),tDpoitDepth:de("texture","rg","float","nearest"),tDpoitFrontColor:de("texture","rgba","float","nearest"),tDpoitBackColor:de("texture","rgba","float","nearest")},dt={dLightCount:ee("number"),dColorMarker:ee("boolean")},lt={uObjectId:G("i")},gf={uColor:G("v3","material"),uColorTexDim:G("v2"),uColorGridDim:G("v3"),uColorGridTransform:G("v4"),uPaletteDomain:G("v2"),uPaletteDefault:G("v3"),tColor:de("image-uint8","rgb","ubyte","nearest"),tPalette:de("image-uint8","rgb","ubyte","nearest"),tColorGrid:de("texture","rgb","ubyte","linear"),dColorType:ee("string",["uniform","attribute","instance","group","groupInstance","vertex","vertexInstance","volume","volumeInstance","direct"]),dUsePalette:ee("boolean")},Jt={uSize:G("f","material"),uSizeTexDim:G("v2"),tSize:de("image-uint8","rgb","ubyte","nearest"),dSizeType:ee("string",["uniform","attribute","instance","group","groupInstance"]),uSizeFactor:G("f","material")},vf={uMarker:G("f"),uMarkerTexDim:G("v2"),tMarker:de("image-uint8","alpha","ubyte","nearest"),markerAverage:fe("number"),markerStatus:fe("number"),dMarkerType:ee("string",["instance","groupInstance"])},hf={uOverpaintTexDim:G("v2"),tOverpaint:de("image-uint8","rgba","ubyte","nearest"),dOverpaint:ee("boolean"),uOverpaintGridDim:G("v3"),uOverpaintGridTransform:G("v4"),tOverpaintGrid:de("texture","rgba","ubyte","linear"),dOverpaintType:ee("string",["instance","groupInstance","volumeInstance"]),uOverpaintStrength:G("f","material")},bf={uTransparencyTexDim:G("v2"),tTransparency:de("image-uint8","alpha","ubyte","nearest"),dTransparency:ee("boolean"),transparencyAverage:fe("number"),transparencyMin:fe("number"),uTransparencyGridDim:G("v3"),uTransparencyGridTransform:G("v4"),tTransparencyGrid:de("texture","alpha","ubyte","linear"),dTransparencyType:ee("string",["instance","groupInstance","volumeInstance"]),uTransparencyStrength:G("f","material")},yf={uEmissiveTexDim:G("v2"),tEmissive:de("image-uint8","alpha","ubyte","nearest"),dEmissive:ee("boolean"),emissiveAverage:fe("number"),uEmissiveGridDim:G("v3"),uEmissiveGridTransform:G("v4"),tEmissiveGrid:de("texture","alpha","ubyte","linear"),dEmissiveType:ee("string",["instance","groupInstance","volumeInstance"]),uEmissiveStrength:G("f","material")},_f={uSubstanceTexDim:G("v2"),tSubstance:de("image-uint8","rgba","ubyte","nearest"),dSubstance:ee("boolean"),uSubstanceGridDim:G("v3"),uSubstanceGridTransform:G("v4"),tSubstanceGrid:de("texture","rgba","ubyte","linear"),dSubstanceType:ee("string",["instance","groupInstance","volumeInstance"]),uSubstanceStrength:G("f","material")},Tf={uClippingTexDim:G("v2"),tClipping:de("image-uint8","alpha","ubyte","nearest"),dClipping:ee("boolean"),dClippingType:ee("string",["instance","groupInstance"])},xf={uWiggleTexDim:G("v2"),tWiggle:de("image-uint8","alpha","ubyte","nearest"),dWiggle:ee("boolean"),wiggleAverage:fe("number"),dWiggleType:ee("string",["instance","groupInstance"]),uWiggleStrength:G("f","material")},mt={dGeometryType:ee("string",["cylinders","directVolume","image","lines","mesh","points","spheres","text","textureMesh"]),...gf,...vf,...hf,...bf,...yf,..._f,...Tf,...xf,dClipObjectCount:ee("number"),dClipVariant:ee("string",["instance","pixel"]),uClipObjectType:G("i[]","material"),uClipObjectInvert:G("b[]","material"),uClipObjectPosition:G("v3[]","material"),uClipObjectRotation:G("v4[]","material"),uClipObjectScale:G("v3[]","material"),uClipObjectTransform:G("m4[]","material"),aInstance:me("float32",1,1),aTransform:me("float32",16,1),uAlpha:G("f","material"),uMetalness:G("f","material"),uRoughness:G("f","material"),uBumpiness:G("f","material"),uEmissive:G("f","material"),uDensity:G("f","material"),uVertexCount:G("i"),uInstanceCount:G("i"),uGroupCount:G("i"),uInvariantBoundingSphere:G("v4"),uLod:G("v4"),drawCount:fe("number"),instanceCount:fe("number"),alpha:fe("number"),matrix:fe("m4"),transform:fe("float32"),extraTransform:fe("float32"),hasReflection:fe("boolean"),instanceGranularity:fe("boolean"),boundingSphere:fe("sphere"),invariantBoundingSphere:fe("sphere"),instanceGrid:fe("instanceGrid")},Ar={uInteriorColor:G("v4"),uInteriorSubstance:G("v4")},kt={uWiggleSpeed:G("f","material"),uWiggleAmplitude:G("f","material"),uWiggleFrequency:G("f","material"),uWiggleMode:G("i","material"),uTumbleSpeed:G("f","material"),uTumbleAmplitude:G("f","material"),uTumbleFrequency:G("f","material")},Cf=`
precision highp float;
precision highp sampler2D;

uniform sampler2D tColor;
uniform vec2 uTexSize;

void main() {
    vec2 coords = gl_FragCoord.xy / uTexSize;
    gl_FragColor = texture2D(tColor, coords);
}
`,Sf=`
precision highp float;

attribute vec2 aPosition;
uniform vec2 uQuadScale;

void main(void) {
    vec2 position = aPosition * uQuadScale - vec2(1.0, 1.0) + uQuadScale;
    gl_Position = vec4(position, 0.0, 1.0);
}
`,Ef=3e7,Af=Ge();function If(e,t){const{gl:r}=e;switch(t){case"points":return r.POINTS;case"lines":return r.LINES;case"line-strip":return r.LINE_STRIP;case"line-loop":return r.LINE_LOOP;case"triangles":return r.TRIANGLES;case"triangle-strip":return r.TRIANGLE_STRIP;case"triangle-fan":return r.TRIANGLE_FAN}}const Df={color:"",pick:"",depth:"",marking:"",emissive:"",tracing:""},Rf=Object.keys(Df),Bf={compute:""},wf=Object.keys(Bf);function Vr(e,t,r,n,i){return r={...r,dRenderVariant:a.create(t)},i.dRenderVariant===void 0&&Object.defineProperty(i,"dRenderVariant",{value:ee("string")}),e.resources.program(r,n,i)}function Ff(){return{attributes:!1,defines:!1,elements:!1,textures:!1}}function Pf(e){e.attributes=!1,e.defines=!1,e.elements=!1,e.textures=!1}function zr(e,t){if(e==="color")switch(t){case"blended":return"colorBlended";case"wboit":return"colorWboit";case"dpoit":return"colorDpoit"}return e}function pt(e,t,r,n,i,o,s){return ti(e,t,r,n,i,o,Rf,s)}function Of(e,t,r,n,i,o=-1){return ti(e,t,r,n,i,o,wf,void 0)}function ti(e,t,r,n,i,o,s,p){const m=Af(),{stats:T,state:v,resources:y}=e,{instancedArrays:x,vertexArrayObject:f,multiDrawInstancedBaseVertexBaseInstance:c,drawInstancedBaseVertexBaseInstance:l}=e.extensions;if(s=s.filter(j=>j==="tracing"?!!e.extensions.drawBuffers:!0),i.uVertexCount&&!e.extensions.noNonInstancedActiveAttribs){const j=i.uVertexCount.ref.value;i.aVertex=a.create(wt(new Float32Array(j))),n.aVertex=me("float32",1,0)}const{attributeValues:d,defineValues:g,textureValues:b,materialTextureValues:u,uniformValues:h,materialUniformValues:A,bufferedUniformValues:C}=mf(n,i),I=Object.entries(h),D=Object.entries(A),B=Object.entries(C),R=Object.entries(Dc(C)),S=Object.entries(g),E=pf(i),w=If(e,t),O={};for(const j of s)O[j]=Vr(e,zr(j,p),g,r,n);const F=Qn(e,n,b),L=Qn(e,n,u),N=Oc(e,n,d),z=[];for(let j=0,Q=N.length;j<Q;++j){const ne=N[j];ne[1].divisor===1&&z.push(ne)}let V;const $=i.elements;$&&$.ref.value&&(V=y.elements($.ref.value));const H={};for(const j of s)H[j]=f?y.vertexArray(O[j],N,V):null;let P=i.drawCount.ref.value,M=i.instanceCount.ref.value;T.drawCount+=P,T.instanceCount+=M,T.instancedDrawCount+=M*P;const U=Ff();let q=!1,te=-1;return{id:m,materialId:o,getByteCount(){let j=0;for(let Q=0,ne=N.length;Q<ne;++Q)j+=N[Q][1].getByteCount();V&&(j+=V.getByteCount());for(let Q=0,ne=F.length;Q<ne;++Q)j+=F[Q][1].getByteCount();for(let Q=0,ne=L.length;Q<ne;++Q)j+=L[Q][1].getByteCount();return j},getProgram:j=>O[j],setTransparency:j=>{if(j!==p){p=j;for(const Q of s)O[Q].destroy(),O[Q]=Vr(e,zr(Q,p),g,r,n)}},render:(j,Q,ne)=>{if(P===0||M===0)return;const Z=O[j];if(Z.id===te&&v.currentRenderItemId===m)Z.setUniforms(I),Z.bindTextures(F,Q);else{const Y=H[j];(Z.id!==v.currentProgramId||Z.id!==te||o===-1||o!==v.currentMaterialId)&&(Z.id!==v.currentProgramId&&Z.use(),Z.setUniforms(D),Z.bindTextures(L,Q+F.length),v.currentMaterialId=o,te=Z.id),Z.setUniforms(I),Z.setUniforms(R),Z.bindTextures(F,Q),Y?(Y.bind(),V&&V.bind()):(V&&V.bind(),Z.bindAttributes(N)),v.currentRenderItemId=m}if(oe&&e.checkFramebufferStatus(`Framebuffer error rendering item id ${m}`),ne){for(const Y of ne)if(Y.count!==0){if(Z.setUniforms(Y.uniforms),c)V?c.multiDrawElementsInstancedBaseVertexBaseInstance(w,Y.counts,0,V._dataType,Y.offsets,0,Y.instanceCounts,0,Y.baseVertices,0,Y.baseInstances,0,Y.count):c.multiDrawArraysInstancedBaseInstance(w,Y.firsts,0,Y.counts,0,Y.instanceCounts,0,Y.baseInstances,0,Y.count);else if(l)if(V)for(let re=0;re<Y.count;++re)Y.counts[re]>0&&(Z.uniform("uDrawId",re),l.drawElementsInstancedBaseVertexBaseInstance(w,Y.counts[re],V._dataType,Y.offsets[re],Y.instanceCounts[re],Y.baseVertices[re],Y.baseInstances[re]));else for(let re=0;re<Y.count;++re)Y.counts[re]>0&&(Z.uniform("uDrawId",re),l.drawArraysInstancedBaseInstance(w,Y.firsts[re],Y.counts[re],Y.instanceCounts[re],Y.baseInstances[re]));else if(V)for(let re=0;re<Y.count;++re)Y.counts[re]>0&&(Z.uniform("uDrawId",re),Z.offsetAttributes(z,Y.baseInstances[re]),x.drawElementsInstanced(w,Y.counts[re],V._dataType,Y.offsets[re],Y.instanceCounts[re]));else for(let re=0;re<Y.count;++re)Y.counts[re]>0&&(Z.uniform("uDrawId",re),Z.offsetAttributes(z,Y.baseInstances[re]),x.drawArraysInstanced(w,0,Y.counts[re],Y.instanceCounts[re]));if(Fe){c?T.calls.multiDrawInstancedBase+=1:l?T.calls.drawInstancedBase+=Y.count:T.calls.drawInstanced+=Y.count;for(let re=0;re<Y.count;++re)T.calls.counts+=Y.instanceCounts[re]}}}else{let Y=0;for(;;){const re=Math.min(P-Y,Ef);if(V?x.drawElementsInstanced(w,re,V._dataType,Y*V._bpe,M):x.drawArraysInstanced(w,Y,re,M),Y+=re,Y>=P)break}Fe&&(T.calls.drawInstanced+=1,T.calls.counts+=M)}oe&&e.checkError(`Draw error rendering item id ${m}`)},update:()=>{if(Pf(U),i.aVertex){const j=i.uVertexCount.ref.value;i.aVertex.ref.value.length<j&&a.update(i.aVertex,wt(new Float32Array(j)))}for(let j=0,Q=S.length;j<Q;++j){const[ne,Z]=S[j];Z.ref.version!==E[ne]&&(U.defines=!0,E[ne]=Z.ref.version)}if(U.defines)for(const j of s)O[j].destroy(),O[j]=Vr(e,zr(j,p),g,r,n);i.drawCount.ref.version!==E.drawCount&&(T.drawCount+=i.drawCount.ref.value-P,T.instancedDrawCount+=M*i.drawCount.ref.value-M*P,P=i.drawCount.ref.value,E.drawCount=i.drawCount.ref.version),i.instanceCount.ref.version!==E.instanceCount&&(T.instanceCount+=i.instanceCount.ref.value-M,T.instancedDrawCount+=i.instanceCount.ref.value*P-M*P,M=i.instanceCount.ref.value,E.instanceCount=i.instanceCount.ref.version);for(let j=0,Q=N.length;j<Q;++j){const[ne,Z]=N[j],Y=d[ne];if(Y.ref.version!==E[ne]){if(Z.length>=Y.ref.value.length)Z.updateSubData(Y.ref.value,0,Z.length);else{Z.destroy();const{itemSize:re,divisor:Ce}=n[ne];N[j][1]=y.attribute(Y.ref.value,re,Ce),U.attributes=!0}E[ne]=Y.ref.version}}if(V&&i.elements.ref.version!==E.elements&&(V.length>=i.elements.ref.value.length?V.updateSubData(i.elements.ref.value,0,V.length):(V.destroy(),V=y.elements(i.elements.ref.value),U.elements=!0),E.elements=i.elements.ref.version),U.attributes||U.defines||U.elements)for(const j of s){const Q=H[j];Q&&Q.destroy(),H[j]=f?y.vertexArray(O[j],N,V):null}for(let j=0,Q=F.length;j<Q;++j){const[ne,Z]=F[j],Y=b[ne];Y.ref.version!==E[ne]&&(n[ne].kind!=="texture"?(Z.load(Y.ref.value),U.textures=!0):F[j][1]=Y.ref.value,E[ne]=Y.ref.version)}for(let j=0,Q=L.length;j<Q;++j){const[ne,Z]=L[j],Y=u[ne];Y.ref.version!==E[ne]&&(n[ne].kind!=="texture"?(Z.load(Y.ref.value),U.textures=!0):L[j][1]=Y.ref.value,E[ne]=Y.ref.version)}for(let j=0,Q=B.length;j<Q;++j){const[ne,Z]=B[j];Z.ref.version!==E[ne]&&(a.update(R[j][1],va(Z.ref.value)),E[ne]=Z.ref.version)}},destroy:()=>{if(!q){for(const j of s){O[j].destroy();const Q=H[j];Q&&Q.destroy()}F.forEach(([j,Q])=>{n[j].kind!=="texture"&&Q.destroy()}),L.forEach(([j,Q])=>{n[j].kind!=="texture"&&Q.destroy()}),N.forEach(([j,Q])=>Q.destroy()),V&&V.destroy(),T.drawCount-=P,T.instanceCount-=M,T.instancedDrawCount-=M*P,q=!0}}}}function _e(){return _e.create(_.create(1,0,0),0)}(function(e){function t(d,g){return{normal:d,constant:g}}e.create=t;function r(d,g){return _.copy(d.normal,g.normal),d.constant=g.constant,d}e.copy=r;function n(d){return r(e(),d)}e.clone=n;function i(d,g){const b=1/_.magnitude(g.normal);return _.scale(d.normal,g.normal,b),d.constant=g.constant*b,d}e.normalize=i;function o(d,g){return _.negate(d.normal,g.normal),d.constant=-g.constant,d}e.negate=o;function s(d,g,b){return _.toArray(d.normal,g,b),g[b+3]=d.constant,g}e.toArray=s;function p(d,g,b){return _.fromArray(d.normal,g,b),d.constant=g[b+3],d}e.fromArray=p;function m(d,g,b){return _.copy(d.normal,g),d.constant=-_.dot(d.normal,b),d}e.fromNormalAndCoplanarPoint=m;function T(d,g,b,u){const h=_.triangleNormal(_(),g,b,u);return m(d,h,g),d}e.fromCoplanarPoints=T;const v=_();function y(d,g,b,u,h){_.set(v,g,b,u);const A=1/_.magnitude(v);return _.scale(d.normal,v,A),d.constant=h*A,d}e.setUnnormalized=y;function x(d,g){return _.dot(d.normal,g)+d.constant}e.distanceToPoint=x;function f(d,g){return x(d,g.center)-g.radius}e.distanceToSphere3D=f;function c(d,g,b){return _.scaleAndAdd(d,b,g.normal,-x(g,b))}e.projectPoint=c;function l(d,g,b){const u=_.dot(g.normal,b.direction);if(u===0)return!1;const h=-(_.dot(g.normal,b.origin)+g.constant)/u;return h<0?!1:(_.scaleAndAdd(d,b.origin,b.direction,h),!0)}e.intersectRay3D=l})(_e||(_e={}));function yr(){return yr.create(_e(),_e(),_e(),_e(),_e(),_e())}(function(e){(function(T){T[T.Right=0]="Right",T[T.Left=1]="Left",T[T.Bottom=2]="Bottom",T[T.Top=3]="Top",T[T.Far=4]="Far",T[T.Near=5]="Near"})(e.PlaneIndex||(e.PlaneIndex={}));function t(T,v,y,x,f,c){return[T,v,y,x,f,c]}e.create=t;function r(T,v){for(let y=0;y<6;++y)_e.copy(T[y],v[y]);return T}e.copy=r;function n(T){return r(e(),T)}e.clone=n;function i(T,v){const y=v[0],x=v[1],f=v[2],c=v[3],l=v[4],d=v[5],g=v[6],b=v[7],u=v[8],h=v[9],A=v[10],C=v[11],I=v[12],D=v[13],B=v[14],R=v[15];return _e.setUnnormalized(T[0],c-y,b-l,C-u,R-I),_e.setUnnormalized(T[1],c+y,b+l,C+u,R+I),_e.setUnnormalized(T[2],c+x,b+d,C+h,R+D),_e.setUnnormalized(T[3],c-x,b-d,C-h,R-D),_e.setUnnormalized(T[4],c-f,b-g,C-A,R-B),_e.setUnnormalized(T[5],c+f,b+g,C+A,R+B),T}e.fromProjectionMatrix=i;function o(T,v){const y=v.center,x=-v.radius;for(let f=0;f<6;++f)if(_e.distanceToPoint(T[f],y)<x)return!1;return!0}e.intersectsSphere3D=o;const s=_();function p(T,v){for(let y=0;y<6;++y){const x=T[y];if(s[0]=x.normal[0]>0?v.max[0]:v.min[0],s[1]=x.normal[1]>0?v.max[1]:v.min[1],s[2]=x.normal[2]>0?v.max[2]:v.min[2],_e.distanceToPoint(x,s)<0)return!1}return!0}e.intersectsBox3D=p;function m(T,v){for(let y=0;y<6;++y)if(_e.distanceToPoint(T[y],v)<0)return!1;return!0}e.containsPoint=m})(yr||(yr={}));const sr=_e.distanceToPoint,ur=yr.intersectsSphere3D,fr=W.fromArray,ri=Ge();function Ur(e,t){return t&&t.instanceCounts.length>=e?t:{firsts:new Int32Array(e),counts:new Int32Array(e),offsets:new Int32Array(e),instanceCounts:new Int32Array(e),baseVertices:new Int32Array(e),baseInstances:new Uint32Array(e),count:0,uniforms:[]}}function gt(e,t,r){const n=ri();let i=Ur(0);const o=[];let s=!1,p=-1;const m=W(),T=()=>{var v;const y=(v=t.lodLevels)===null||v===void 0?void 0:v.ref.value;if(y&&y.length>0){const{cellCount:x}=t.instanceGrid.ref.value;o.length=y.length;for(let f=0,c=y.length;f<c;++f)o[f]=Ur(x,o[f]),o[f].count=0;if(t.lodLevels.ref.version!==p){for(let f=0,c=y.length;f<c;++f)o[f].uniforms.length!==1&&(o[f].uniforms.length=1,o[f].uniforms[0]=["uLod",a.create(ce())]),a.update(o[f].uniforms[0][1],ce.set(o[f].uniforms[0][1].ref.value,y[f][0],y[f][1],y[f][2],y[f][4]));p=t.lodLevels.ref.version}}};return T(),{id:n,materialId:e.materialId,values:t,state:r,cull:(v,y,x,f)=>{var c,l;if(s=!1,t.drawCount.ref.value===0||t.instanceCount.ref.value===0||t.instanceGrid.ref.value.cellSize<=1)return;const{cellOffsets:d,cellSpheres:g,cellCount:b,batchOffsets:u,batchSpheres:h,batchCount:A,batchCell:C,batchSize:I}=t.instanceGrid.ref.value,[D,B]=t.uLod.ref.value,R=D!==0||B!==0,S=2*I,E=(c=t.lodLevels)===null||c===void 0?void 0:c.ref.value;if(E&&E.length>0){if(((l=t.lodLevels)===null||l===void 0?void 0:l.ref.version)!==p)T();else for(let w=0,O=E.length;w<O;++w)o[w].count=0;for(let w=0;w<A;++w){const O=u[w],F=u[w+1];if(F-O===0)continue;fr(m,h,w*4);const N=sr(v,m.center);if(R&&(N+m.radius<D||N-m.radius>B)){Fe&&(f.culled.lod+=d[C[F-1]+1]-d[C[O]]);continue}if(!ur(y,m)){Fe&&(f.culled.frustum+=d[C[F-1]+1]-d[C[O]]);continue}if(x!==null&&x(m)){Fe&&(f.culled.occlusion+=d[C[F-1]+1]-d[C[O]]);continue}for(let z=O;z<F;++z){const V=C[z],$=d[V],P=d[V+1]-$;if(P===0)continue;fr(m,g,V*4);const M=sr(v,m.center);if(R&&(M+m.radius<D||M-m.radius>B)){Fe&&(f.culled.lod+=P);continue}if(!ur(y,m)){Fe&&(f.culled.frustum+=P);continue}if(x!==null&&M-m.radius<S&&x(m)){Fe&&(f.culled.occlusion+=P);continue}for(let U=0,q=E.length;U<q;++U){if(M+m.radius<E[U][0]||M-m.radius>E[U][1])continue;const te=o[U],j=te.count;j>0&&te.baseInstances[j-1]+te.instanceCounts[j-1]===$&&te.counts[j-1]===E[U][3]?te.instanceCounts[j-1]+=P:(te.counts[j]=E[U][3],te.instanceCounts[j]=P,te.baseInstances[j]=$,te.count+=1)}}}}else{i=Ur(b,i);const{baseInstances:w,instanceCounts:O,counts:F}=i;let L=0;for(let N=0;N<A;++N){const z=u[N],V=u[N+1];if(V-z!==0){if(fr(m,h,N*4),R){const H=sr(v,m.center);if(H+m.radius<D||H-m.radius>B){Fe&&(f.culled.lod+=d[C[V-1]+1]-d[C[z]]);continue}}if(!ur(y,m)){Fe&&(f.culled.frustum+=d[C[V-1]+1]-d[C[z]]);continue}if(x!==null&&x(m)){Fe&&(f.culled.occlusion+=d[C[V-1]+1]-d[C[z]]);continue}for(let H=z;H<V;++H){const P=C[H],M=d[P],q=d[P+1]-M;if(q===0)continue;fr(m,g,P*4);const te=sr(v,m.center);if(R&&(te+m.radius<D||te-m.radius>B)){Fe&&(f.culled.lod+=q);continue}if(!ur(y,m)){Fe&&(f.culled.frustum+=q);continue}if(x!==null&&te-m.radius<S&&x(m)){Fe&&(f.culled.occlusion+=q);continue}L>0&&w[L-1]+O[L-1]===M?O[L-1]+=q:(F[L]=t.drawCount.ref.value,O[L]=q,w[L]=M,L+=1)}}}i.count=L,o.length=1,o[0]=i,o[0].uniforms.length=0}s=!0},uncull:()=>{s=!1},cullSimple:(v,y,x)=>{var f,c;const l=(f=t.lodLevels)===null||f===void 0?void 0:f.ref.value;if(!(!l||l.length===0)){if(((c=t.lodLevels)===null||c===void 0?void 0:c.ref.version)!==p)T();else for(let d=0,g=l.length;d<g;++d)o[d].count=0;for(let d=0,g=l.length;d<g;++d)if(v+y<l[d][1]*x){const b=o[d],u=b.count;b.counts[u]=l[d][3],b.instanceCounts[u]=t.instanceCount.ref.value,b.baseInstances[u]=0,b.count+=1;break}s=!0}},render:(v,y)=>{t.uAlpha&&t.alpha&&a.updateIfChanged(t.uAlpha,dn(t.alpha.ref.value*r.alphaFactor,0,1)),e.render(v,y,s?o:void 0)},getByteCount:()=>e.getByteCount(),getProgram:v=>e.getProgram(v),setTransparency:v=>e.setTransparency(v),update:()=>{e.update(),T()},dispose:()=>e.destroy()}}function Lf(e,t){return{id:ri(),values:t,render:()=>{e.getProgram("compute").finalize(!0),e.render("compute",0)},update:()=>e.update(),dispose:()=>e.destroy()}}const ni=new Float32Array([1,1,-1,1,-1,-1,-1,-1,1,-1,1,1]),Mf={drawCount:fe("number"),instanceCount:fe("number"),aPosition:me("float32",2,0),uQuadScale:G("v2")},Nf={drawCount:a.create(6),instanceCount:a.create(1),aPosition:a.create(ni),uQuadScale:a.create(ae.create(1,1))},Gf={...Mf,tColor:de("texture","rgba","ubyte","nearest"),uTexSize:G("v2")},kf=tt("copy",Sf,Cf);function Vf(e,t){const r={...Nf,tColor:a.create(t),uTexSize:a.create(ae.create(t.getWidth(),t.getHeight()))},n={...Gf},i=Of(e,"triangles",kf,n,r);return Lf(i,r)}const jr="shared-copy";function zf(e,t){e.namedComputeRenderables[jr]||(e.namedComputeRenderables[jr]=Vf(e,De()));const r=e.namedComputeRenderables[jr];return a.update(r.values.tColor,t),a.update(r.values.uTexSize,ae.set(r.values.uTexSize.ref.value,t.getWidth(),t.getHeight())),r.update(),r}const Wr="read-texture",Rt="read-alpha-texture";function gl(e,t,r){const{gl:n,resources:i}=e;if(!r&&t.type!==n.UNSIGNED_BYTE)throw new Error("unsupported texture type");e.namedFramebuffers[Wr]||(e.namedFramebuffers[Wr]=i.framebuffer());const o=e.namedFramebuffers[Wr],s=t.getWidth(),p=t.getHeight();return r||(r=new Uint8Array(s*p*4)),o.bind(),t.attachFramebuffer(o,0),e.readPixels(0,0,s,p,r),{array:r,width:s,height:p}}function vl(e,t){const{gl:r,state:n,resources:i}=e;if(t.type!==r.UNSIGNED_BYTE)throw new Error("unsupported texture type");const o=t.getWidth(),s=t.getHeight(),p=zf(e,t);n.currentRenderItemId=-1,e.namedFramebuffers[Rt]||(e.namedFramebuffers[Rt]=i.framebuffer());const m=e.namedFramebuffers[Rt];m.bind(),e.namedTextures[Rt]||(e.namedTextures[Rt]=i.texture("image-uint8","rgba","ubyte","linear"));const T=e.namedTextures[Rt];T.define(o,s),T.attachFramebuffer(m,0),n.disable(r.CULL_FACE),n.enable(r.BLEND),n.disable(r.DEPTH_TEST),n.enable(r.SCISSOR_TEST),n.depthMask(!1),n.clearColor(0,0,0,0),n.blendFunc(r.ONE,r.ONE),n.blendEquation(r.FUNC_ADD),n.viewport(0,0,o,s),n.scissor(0,0,o,s),r.clear(r.COLOR_BUFFER_BIT),p.render();const v=new Uint8Array(o*s*4);return e.readPixels(0,0,o,s,v),{array:v,width:o,height:s}}const ma=new Uint32Array([0,1,2,1,3,2]),Uf=new Float32Array([0,1,0,0,1,1,1,0]),jf={nearest:"Nearest",catmulrom:"Catmulrom (Cubic)",mitchell:"Mitchell (Cubic)",bspline:"B-Spline (Cubic)"};var cn;(function(e){function t(){return{type:0,center:_(),rotation:Ke(),scale:_(),transform:ie()}}e.createEmptyTrim=t;function r(c,l,d,g,b,u,h){return h?o(c,l,d,g,b,u,h):i(c,l,d,g,b,u)}e.create=r;function n(c){return et([c.cornerBuffer.ref.version])}function i(c,l,d,g,b,u){const h=W();let A=-1;const C=c.width,I=c.height,D={kind:"image",imageTexture:a.create(c),imageTextureDim:a.create(ae.create(C,I)),cornerBuffer:a.create(l),groupTexture:a.create(d),valueTexture:a.create(g),trimType:a.create(b.type),trimCenter:a.create(b.center),trimRotation:a.create(b.rotation),trimScale:a.create(b.scale),trimTransform:a.create(b.transform),isoLevel:a.create(u),get boundingSphere(){const B=n(D);if(B!==A){const R=Wf(D.cornerBuffer.ref.value);W.copy(h,R),A=B}return h},setBoundingSphere(B){W.copy(h,B),A=n(D)},hasBoundingSphere(){return A===n(D)},meta:{}};return D}function o(c,l,d,g,b,u,h){const A=c.width,C=c.height;return a.update(h.imageTexture,c),a.update(h.imageTextureDim,ae.set(h.imageTextureDim.ref.value,A,C)),a.update(h.cornerBuffer,l),a.update(h.groupTexture,d),a.update(h.valueTexture,g),a.updateIfChanged(h.trimType,b.type),a.update(h.trimCenter,_.copy(h.trimCenter.ref.value,b.center)),a.update(h.trimRotation,Ke.copy(h.trimRotation.ref.value,b.rotation)),a.update(h.trimScale,_.copy(h.trimScale.ref.value,b.scale)),a.update(h.trimTransform,ie.copy(h.trimTransform.ref.value,b.transform)),a.updateIfChanged(h.isoLevel,u),h}function s(c){const l=ye(0,4,Uint8Array),d=c?c.cornerBuffer.ref.value:new Float32Array(24),g=ye(0,4,Uint8Array),b=ye(0,1,Float32Array),u=t();return r(l,d,g,b,u,-1,c)}e.createEmpty=s,e.Params={...X.Params,interpolation:k.Select("bspline",k.objectToOptions(jf))},e.Utils={Params:e.Params,createEmpty:s,createValues:m,createValuesSimple:T,updateValues:v,updateBoundingSphere:y,createRenderableState:x,updateRenderableState:f,createPositionIterator:p};function p(c,l){return ze(1,1,1,()=>qe)}function m(c,l,d,g,b){const{instanceCount:u,groupCount:h}=d,A=p(),C=rt(d,A,g.color),I=b.instanceGranularity?Ee(u,"instance"):Ee(u*h,"groupInstance"),D=nt(),B=at(),R=ct(),S=ot(),E=it(),w=st(),O={drawCount:ma.length,vertexCount:ni.length/3,groupCount:h,instanceCount:u},F=W.clone(c.boundingSphere),L=Se(F,l.aTransform.ref.value,u,0);return{dGeometryType:a.create("image"),...C,...I,...D,...B,...R,...S,...E,...w,...l,...X.createValues(b,O),aPosition:c.cornerBuffer,aUv:a.create(Uf),elements:a.create(ma),aGroup:a.create(wt(new Float32Array(4))),boundingSphere:a.create(L),invariantBoundingSphere:a.create(F),uInvariantBoundingSphere:a.create(ce.ofSphere(F)),dInterpolation:a.create(b.interpolation),uImageTexDim:c.imageTextureDim,tImageTex:c.imageTexture,tGroupTex:c.groupTexture,tValueTex:c.valueTexture,uTrimType:c.trimType,uTrimCenter:c.trimCenter,uTrimRotation:c.trimRotation,uTrimScale:c.trimScale,uTrimTransform:c.trimTransform,uIsoLevel:c.isoLevel}}function T(c,l,d,g,b){const u=X.createSimple(d,g,b),h={...k.getDefaultValues(e.Params),...l};return m(c,u.transform,u.locationIterator,u.theme,h)}function v(c,l){X.updateValues(c,l),a.updateIfChanged(c.dInterpolation,l.interpolation)}function y(c,l){const d=W.clone(l.boundingSphere),g=Se(d,c.aTransform.ref.value,c.instanceCount.ref.value,0);W.equals(g,c.boundingSphere.ref.value)||a.update(c.boundingSphere,g),W.equals(d,c.invariantBoundingSphere.ref.value)||(a.update(c.invariantBoundingSphere,d),a.update(c.uInvariantBoundingSphere,ce.fromSphere(c.uInvariantBoundingSphere.ref.value,d)))}function x(c){const l=X.createRenderableState(c);return l.opaque=!1,l}function f(c,l){X.updateRenderableState(c,l),c.opaque=!1}})(cn||(cn={}));function Wf(e){const t=_(),r=[];for(let o=0,s=e.length;o<s;o+=3){const p=_.fromArray(_(),e,o);r.push(p),_.add(t,t,p)}_.scale(t,t,1/(e.length/3));let n=0;for(const o of r){const s=_.distance(t,o);s>n&&(n=s)}const i=W.create(t,n);return W.setExtrema(i,r),i}var sn;(function(e){function t(c,l,d,g,b,u,h,A,C,I){return I?o(c,l,d,g,b,u,h,A,C,I):i(c,l,d,g,b,u,h,A,C)}e.create=t;function r(c){const l=c?c.mappingBuffer.ref.value:new Float32Array(0),d=c?c.indexBuffer.ref.value:new Uint32Array(0),g=c?c.groupBuffer.ref.value:new Float32Array(0),b=c?c.startBuffer.ref.value:new Float32Array(0),u=c?c.endBuffer.ref.value:new Float32Array(0),h=c?c.scaleBuffer.ref.value:new Float32Array(0),A=c?c.capBuffer.ref.value:new Float32Array(0),C=c?c.colorModeBuffer.ref.value:new Float32Array(0);return t(l,d,g,b,u,h,A,C,0,c)}e.createEmpty=r;function n(c){return et([c.cylinderCount,c.mappingBuffer.ref.version,c.indexBuffer.ref.version,c.groupBuffer.ref.version,c.startBuffer.ref.version,c.endBuffer.ref.version,c.scaleBuffer.ref.version,c.capBuffer.ref.version,c.colorModeBuffer.ref.version])}function i(c,l,d,g,b,u,h,A,C){const I=W();let D,B=-1,R=-1;const S={kind:"cylinders",cylinderCount:C,mappingBuffer:a.create(c),indexBuffer:a.create(l),groupBuffer:a.create(d),startBuffer:a.create(g),endBuffer:a.create(b),scaleBuffer:a.create(u),capBuffer:a.create(h),colorModeBuffer:a.create(A),get boundingSphere(){const E=n(S);if(E!==B){const w=yt(S.startBuffer.ref.value,S.cylinderCount*6,6),O=yt(S.endBuffer.ref.value,S.cylinderCount*6,6);W.expandBySphere(I,w,O),B=E}return I},get groupMapping(){return S.groupBuffer.ref.version!==R&&(D=Pt(S.groupBuffer.ref.value,S.cylinderCount,6),R=S.groupBuffer.ref.version),D},setBoundingSphere(E){W.copy(I,E),B=n(S)},hasBoundingSphere(){return B===n(S)}};return S}function o(c,l,d,g,b,u,h,A,C,I){return C>I.cylinderCount&&(a.update(I.mappingBuffer,c),a.update(I.indexBuffer,l)),I.cylinderCount=C,a.update(I.groupBuffer,d),a.update(I.startBuffer,g),a.update(I.endBuffer,b),a.update(I.scaleBuffer,u),a.update(I.capBuffer,h),a.update(I.colorModeBuffer,A),I}function s(c,l){const d=c.startBuffer.ref.value;Ft(l,d,0,c.cylinderCount*6),a.update(c.startBuffer,d);const g=c.endBuffer.ref.value;Ft(l,g,0,c.cylinderCount*6),a.update(c.endBuffer,g)}e.transform=s,e.Params={...X.Params,sizeFactor:k.Numeric(1,{min:0,max:10,step:.1}),sizeAspectRatio:k.Numeric(1,{min:0,max:3,step:.01}),doubleSided:k.Boolean(!1,X.CustomQualityParamInfo),ignoreLight:k.Boolean(!1,X.ShadingCategory),celShaded:k.Boolean(!1,X.ShadingCategory),xrayShaded:k.Select(!1,[[!1,"Off"],[!0,"On"],["inverted","Inverted"]],X.ShadingCategory),transparentBackfaces:k.Select("off",k.arrayToOptions(["off","on","opaque"]),X.ShadingCategory),solidInterior:k.Boolean(!0,X.ShadingCategory),bumpFrequency:k.Numeric(0,{min:0,max:10,step:.1},X.ShadingCategory),bumpAmplitude:k.Numeric(1,{min:0,max:5,step:.1},X.ShadingCategory),interior:Cr(),animation:Ot(),colorMode:k.Select("default",k.arrayToOptions(["default","interpolate"]),X.ShadingCategory)},e.Utils={Params:e.Params,createEmpty:r,createValues:m,createValuesSimple:T,updateValues:v,updateBoundingSphere:y,createRenderableState:x,updateRenderableState:f,createPositionIterator:p};function p(c,l){const d=c.cylinderCount*6,g=l.instanceCount.ref.value,b=Tt(),u=b.position,h=c.startBuffer.ref.value,A=c.endBuffer.ref.value,C=l.aTransform.ref.value;return ze(d,g,2,(D,B)=>{const R=D%6===0?h:A;return B<0?_.fromArray(u,R,D*3):_.transformMat4Offset(u,R,C,0,D*3,B*16),b})}function m(c,l,d,g,b){const{instanceCount:u,groupCount:h}=d,A=p(c,l),C=rt(d,A,g.color),I=Zt(d,A,g.size),D=b.instanceGranularity?Ee(u,"instance"):Ee(u*h,"groupInstance"),B=nt(),R=at(),S=ct(),E=ot(),w=it(),O=st(),F={drawCount:c.cylinderCount*4*3,vertexCount:c.cylinderCount*6,groupCount:h,instanceCount:u},L=jt(I)*b.sizeFactor,N=W.clone(c.boundingSphere),z=Se(N,l.aTransform.ref.value,u,0);return{dGeometryType:a.create("cylinders"),aMapping:c.mappingBuffer,aGroup:c.groupBuffer,aStart:c.startBuffer,aEnd:c.endBuffer,aScale:c.scaleBuffer,aCap:c.capBuffer,aColorMode:c.colorModeBuffer,elements:c.indexBuffer,boundingSphere:a.create(z),invariantBoundingSphere:a.create(N),uInvariantBoundingSphere:a.create(ce.ofSphere(N)),...C,...I,...D,...B,...R,...S,...E,...w,...O,...l,padding:a.create(L),...X.createValues(b,F),uSizeFactor:a.create(b.sizeFactor*b.sizeAspectRatio),uDoubleSided:a.create(b.doubleSided),dIgnoreLight:a.create(b.ignoreLight),dCelShaded:a.create(b.celShaded),dXrayShaded:a.create(b.xrayShaded==="inverted"?"inverted":b.xrayShaded===!0?"on":"off"),dTransparentBackfaces:a.create(b.transparentBackfaces),dSolidInterior:a.create(b.solidInterior),uBumpFrequency:a.create(b.bumpFrequency),uBumpAmplitude:a.create(b.bumpAmplitude),dDualColor:a.create(b.colorMode==="interpolate"),...Sr(b.interior),...Lt(b.animation)}}function T(c,l,d,g,b){const u=X.createSimple(d,g,b),h={...k.getDefaultValues(e.Params),...l};return m(c,u.transform,u.locationIterator,u.theme,h)}function v(c,l){X.updateValues(c,l),a.updateIfChanged(c.uSizeFactor,l.sizeFactor*l.sizeAspectRatio),a.updateIfChanged(c.uDoubleSided,l.doubleSided),a.updateIfChanged(c.dIgnoreLight,l.ignoreLight),a.updateIfChanged(c.dCelShaded,l.celShaded),a.updateIfChanged(c.dXrayShaded,l.xrayShaded==="inverted"?"inverted":l.xrayShaded===!0?"on":"off"),a.updateIfChanged(c.dTransparentBackfaces,l.transparentBackfaces),a.updateIfChanged(c.dSolidInterior,l.solidInterior),a.updateIfChanged(c.uBumpFrequency,l.bumpFrequency),a.updateIfChanged(c.uBumpAmplitude,l.bumpAmplitude),a.updateIfChanged(c.dDualColor,l.colorMode==="interpolate"),Er(c,l.interior),Mt(c,l.animation)}function y(c,l){const d=W.clone(l.boundingSphere),g=Se(d,c.aTransform.ref.value,c.instanceCount.ref.value,0);W.equals(g,c.boundingSphere.ref.value)||a.update(c.boundingSphere,g),W.equals(d,c.invariantBoundingSphere.ref.value)||(a.update(c.invariantBoundingSphere,d),a.update(c.uInvariantBoundingSphere,ce.fromSphere(c.uInvariantBoundingSphere.ref.value,d)))}function x(c){const l=X.createRenderableState(c);return f(l,c),l}function f(c,l){X.updateRenderableState(c,l),c.opaque=c.opaque&&!l.xrayShaded,c.writeDepth=c.opaque}})(sn||(sn={}));var qt;(function(e){function t(s){switch(s.kind){case"mesh":return s.triangleCount*3;case"points":return s.pointCount;case"spheres":return s.sphereCount*2*3;case"cylinders":return s.cylinderCount*4*3;case"text":return s.charCount*2*3;case"lines":return s.lineCount*2*3;case"direct-volume":return 36;case"image":return 6;case"texture-mesh":return s.vertexCount}}e.getDrawCount=t;function r(s){switch(s.kind){case"mesh":return s.vertexCount;case"points":return s.pointCount;case"spheres":return s.sphereCount*6;case"cylinders":return s.cylinderCount*6;case"text":return s.charCount*4;case"lines":return s.vertexCount;case"direct-volume":const[p,m,T]=s.gridDimension.ref.value;return p*m*T;case"image":return 4;case"texture-mesh":return s.vertexCount}}e.getVertexCount=r;function n(s){switch(s.kind){case"mesh":case"points":case"spheres":case"cylinders":case"text":case"lines":return t(s)===0?0:un(s.groupBuffer.ref.value)+1;case"direct-volume":return 1;case"image":return $u(s.groupTexture.ref.value.array,4)+1;case"texture-mesh":return s.groupCount}}e.getGroupCount=n;function i(s){switch(s.kind){case"mesh":return Jr.Utils;case"points":return en.Utils;case"spheres":return an.Utils;case"cylinders":return sn.Utils;case"text":return tn.Utils;case"lines":return Wt.Utils;case"direct-volume":return nn.Utils;case"image":return cn.Utils;case"texture-mesh":return on.Utils}}e.getUtils=i;function o(s,p){return p==="instance"&&s.nonInstanceable?"group":p}e.getGranularity=o})(qt||(qt={}));const qf=1,Xf="Assigns sizes as defined by the shape object.",ai={};function Hf(e){return ai}function hn(e,t){return{factory:hn,granularity:"groupInstance",size:r=>Xt.isLocation(r)?r.shape.getSize(r.group,r.instance):qf,props:t,description:Xf}}const hl={name:"shape-group",label:"Shape Group",category:"",factory:hn,getParams:Hf,defaultValues:k.getDefaultValues(ai),isApplicable:e=>!!e.shape},$f=ge(13421772),Yf="Assigns colors as defined by the shape object.",ii={};function Qf(e){return ii}function bn(e,t){return{factory:bn,granularity:"groupInstance",color:r=>Xt.isLocation(r)?r.shape.getColor(r.group,r.instance):$f,props:t,description:Yf}}const bl={name:"shape-group",label:"Shape Group",category:qa.Misc,factory:bn,getParams:Qf,defaultValues:k.getDefaultValues(ii),isApplicable:e=>!!e.shape},Zf={...mt,aPosition:me("float32",3,0),elements:Gt("uint32"),uBboxMin:G("v3"),uBboxMax:G("v3"),uBboxSize:G("v3"),uMaxSteps:G("i"),uStepScale:G("f"),uJumpLength:G("f"),uTransform:G("m4"),uGridDim:G("v3"),tTransferTex:de("image-uint8","alpha","ubyte","linear"),uTransferScale:G("f","material"),dGridTexType:ee("string",["2d","3d"]),uGridTexDim:G("v3"),tGridTex:de("texture","rgba","ubyte","linear"),uGridStats:G("v4"),uCellDim:G("v3"),uCartnToUnit:G("m4"),uUnitToCartn:G("m4"),dPackedGroup:ee("boolean"),dAxisOrder:ee("string",["012","021","102","120","201","210"]),dIgnoreLight:ee("boolean"),dCelShaded:ee("boolean"),dXrayShaded:ee("string",["off","on","inverted"]),meta:fe("unknown")};function Kf(e,t,r,n,i,o,s){const p={...ut,...ft,...dt,...lt,...Zf};e.isWebGL2||(p.uMaxSteps=ee("number"));const m={...r,uObjectId:a.create(t),dLightCount:a.create(s.dLightCount),dColorMarker:a.create(s.dColorMarker)},v=pt(e,"triangles",ac,p,m,i,o);return gt(v,m,n)}const Jf={...mt,aGroup:me("float32",1,0),aPosition:me("float32",3,0),aNormal:me("float32",3,0),elements:Gt("uint32"),dVaryingGroup:ee("boolean"),dFlatShaded:ee("boolean"),uDoubleSided:G("b","material"),dFlipSided:ee("boolean"),dIgnoreLight:ee("boolean"),dCelShaded:ee("boolean"),dXrayShaded:ee("string",["off","on","inverted"]),dTransparentBackfaces:ee("string",["off","on","opaque"]),uBumpFrequency:G("f","material"),uBumpAmplitude:G("f","material"),meta:fe("unknown"),...Ar,...kt};function ed(e,t,r,n,i,o,s){const p={...ut,...ft,...dt,...lt,...Jf},m={...r,uObjectId:a.create(t),dLightCount:a.create(s.dLightCount),dColorMarker:a.create(s.dColorMarker)},v=pt(e,"triangles",wa,p,m,i,o);return gt(v,m,n)}const td={...mt,...Jt,aGroup:me("float32",1,0),aPosition:me("float32",3,0),dPointSizeAttenuation:ee("boolean"),dPointStyle:ee("string",["square","circle","fuzzy"]),...kt};function rd(e,t,r,n,i,o,s){const p={...ut,...ft,...dt,...lt,...td},m={...r,uObjectId:a.create(t),dLightCount:a.create(s.dLightCount),dColorMarker:a.create(s.dColorMarker)},v=pt(e,"points",Jo,p,m,i,o);return gt(v,m,n)}const nd={...mt,...Jt,aGroup:me("float32",1,0),aMapping:me("float32",2,0),aStart:me("float32",3,0),aEnd:me("float32",3,0),elements:Gt("uint32"),dLineSizeAttenuation:ee("boolean"),uDoubleSided:G("b","material"),dFlipSided:ee("boolean"),stripCount:fe("number"),stripOffsets:fe("uint32"),...kt};function ad(e,t,r,n,i,o,s){const p={...ut,...ft,...dt,...lt,...nd},m={...r,uObjectId:a.create(t),dLightCount:a.create(s.dLightCount),dColorMarker:a.create(s.dColorMarker)},v=pt(e,"triangles",nc,p,m,i,o);return gt(v,m,n)}const id={...mt,...Jt,uTexDim:G("v2"),tPositionGroup:de("image-float32","rgba","float","nearest"),padding:fe("number"),uDoubleSided:G("b","material"),dIgnoreLight:ee("boolean"),dCelShaded:ee("boolean"),dXrayShaded:ee("string",["off","on","inverted"]),dTransparentBackfaces:ee("string",["off","on","opaque"]),dSolidInterior:ee("boolean"),dClipPrimitive:ee("boolean"),dApproximate:ee("boolean"),uAlphaThickness:G("f"),uBumpFrequency:G("f","material"),uBumpAmplitude:G("f","material"),lodLevels:fe("unknown"),centerBuffer:fe("float32"),groupBuffer:fe("float32"),...Ar,...kt};function od(e,t,r,n,i,o,s){const p={...ut,...ft,...dt,...lt,...id},m={...r,uObjectId:a.create(t),dLightCount:a.create(s.dLightCount),dColorMarker:a.create(s.dColorMarker)},v=pt(e,"triangles",ec,p,m,i,o);return gt(v,m,n)}const cd={...mt,...Jt,aGroup:me("float32",1,0),aPosition:me("float32",3,0),aMapping:me("float32",2,0),aDepth:me("float32",1,0),elements:Gt("uint32"),aTexCoord:me("float32",2,0),tFont:de("image-uint8","alpha","ubyte","linear"),padding:fe("number"),uBorderWidth:G("f","material"),uBorderColor:G("v3","material"),uOffsetX:G("f","material"),uOffsetY:G("f","material"),uOffsetZ:G("f","material"),uBackgroundColor:G("v3","material"),uBackgroundOpacity:G("f","material")};function sd(e,t,r,n,i,o,s){const p={...ut,...ft,...dt,...lt,...cd},m={...r,uObjectId:a.create(t),dLightCount:a.create(s.dLightCount),dColorMarker:a.create(s.dColorMarker)},v=pt(e,"triangles",rc,p,m,i,o);return gt(v,m,n)}const ud={...mt,uGeoTexDim:G("v2","buffered"),tPosition:de("texture","rgb","float","nearest"),tGroup:de("texture","alpha","float","nearest"),tNormal:de("texture","rgb","float","nearest"),dVaryingGroup:ee("boolean"),dFlatShaded:ee("boolean"),uDoubleSided:G("b","material"),dFlipSided:ee("boolean"),dIgnoreLight:ee("boolean"),dCelShaded:ee("boolean"),dXrayShaded:ee("string",["off","on","inverted"]),dTransparentBackfaces:ee("string",["off","on","opaque"]),uBumpFrequency:G("f","material"),uBumpAmplitude:G("f","material"),meta:fe("unknown"),...Ar,...kt};function fd(e,t,r,n,i,o,s){const p={...ut,...ft,...dt,...lt,...ud},m={...r,uObjectId:a.create(t),dLightCount:a.create(s.dLightCount),dColorMarker:a.create(s.dColorMarker)},v=pt(e,"triangles",wa,p,m,i,o);return gt(v,m,n)}const dd={...mt,aGroup:me("float32",1,0),aPosition:me("float32",3,0),aUv:me("float32",2,0),elements:Gt("uint32"),uImageTexDim:G("v2"),tImageTex:de("image-uint8","rgba","ubyte","nearest"),tGroupTex:de("image-uint8","rgba","ubyte","nearest"),tValueTex:de("image-float32","alpha","float","linear"),uTrimType:G("i"),uTrimCenter:G("v3"),uTrimRotation:G("q"),uTrimScale:G("v3"),uTrimTransform:G("m4"),uIsoLevel:G("f"),dInterpolation:ee("string",["nearest","catmulrom","mitchell","bspline"])};function ld(e,t,r,n,i,o,s){const p={...ut,...ft,...dt,...lt,...dd},m={...r,uObjectId:a.create(t),dLightCount:a.create(s.dLightCount),dColorMarker:a.create(s.dColorMarker)},v=pt(e,"triangles",ic,p,m,i,o);return gt(v,m,n)}const md={...mt,...Jt,aGroup:me("float32",1,0),aStart:me("float32",3,0),aEnd:me("float32",3,0),aMapping:me("float32",3,0),aScale:me("float32",1,0),aCap:me("float32",1,0),aColorMode:me("float32",1,0),elements:Gt("uint32"),padding:fe("number"),uDoubleSided:G("b","material"),dIgnoreLight:ee("boolean"),dCelShaded:ee("boolean"),dXrayShaded:ee("string",["off","on","inverted"]),dTransparentBackfaces:ee("string",["off","on","opaque"]),dSolidInterior:ee("boolean"),uBumpFrequency:G("f","material"),uBumpAmplitude:G("f","material"),dDualColor:ee("boolean"),...Ar,...kt};function pd(e,t,r,n,i,o,s){const p={...ut,...ft,...dt,...lt,...md},m={...r,uObjectId:a.create(t),dLightCount:a.create(s.dLightCount),dColorMarker:a.create(s.dColorMarker)},v=pt(e,"triangles",tc,p,m,i,o);return gt(v,m,n)}const gd=Ge(0,2147483647),vd=Ge(0,2147483647);function hd(e,t,r,n){return{id:gd(),type:e,values:t,state:r,materialId:n}}function yl(e,t,r,n){switch(t.type){case"mesh":return ed(e,t.id,t.values,t.state,t.materialId,r,n);case"points":return rd(e,t.id,t.values,t.state,t.materialId,r,n);case"spheres":return od(e,t.id,t.values,t.state,t.materialId,r,n);case"cylinders":return pd(e,t.id,t.values,t.state,t.materialId,r,n);case"text":return sd(e,t.id,t.values,t.state,t.materialId,r,n);case"lines":return ad(e,t.id,t.values,t.state,t.materialId,r,n);case"direct-volume":return Kf(e,t.id,t.values,t.state,t.materialId,r,n);case"image":return ld(e,t.id,t.values,t.state,t.materialId,r,n);case"texture-mesh":return fd(e,t.id,t.values,t.state,t.materialId,r,n)}Ht(t.type)}var pa;(function(e){function t(v,y,x,f,c,l,d,g){return{id:vi.create22(),name:v,sourceData:y,geometry:x,transforms:d||[ie.identity()],get groupCount(){return g??qt.getGroupCount(x)},getColor:f,getSize:c,getLabel:l}}e.create=t;function r(v){return{color:bn({},{}),size:hn({},{})}}e.getTheme=r;function n(v){const y=v.transforms.length,x=Xt.Location(v),f=(c,l)=>(x.group=c,x.instance=l,x);return ze(v.groupCount,y,1,f)}e.groupIterator=n;function i(v,y,x,f,c){const l=c&&c.aTransform.ref.value.length>=v.length*16?c.aTransform.ref.value:new Float32Array(v.length*16);for(let d=0,g=v.length;d<g;++d)ie.toArray(v[d],l,d*16);return Wa(l,v.length,y,x,f,c)}e.createTransform=i;function o(v,y){const x=r(),f=qt.getUtils(v.geometry),c=vd(),l=n(v),d=i(v.transforms,v.geometry.boundingSphere,y.cellSize,y.batchSize),g=f.createValues(v.geometry,d,l,x,y),b=f.createRenderableState(y);return hd(v.geometry.kind,g,b,c)}e.createRenderObject=o;function s(v){return{kind:"shape-loci",shape:v}}e.Loci=s;function p(v){return!!v&&v.kind==="shape-loci"}e.isLoci=p;function m(v,y){return v.shape===y.shape}e.areLociEqual=m;function T(v){return v.shape.groupCount===0}e.isLociEmpty=T})(pa||(pa={}));var Xt;(function(e){function t(f,c=0,l=0){return{kind:"group-location",shape:f,group:c,instance:l}}e.Location=t;function r(f){return!!f&&f.kind==="group-location"}e.isLocation=r;function n(f,c){return{kind:"group-loci",shape:f,groups:c}}e.Loci=n;function i(f){return!!f&&f.kind==="group-loci"}e.isLoci=i;function o(f,c){if(f.shape!==c.shape||f.groups.length!==c.groups.length)return!1;for(let l=0,d=f.groups.length;l<d;++l){const{ids:g,instance:b}=f.groups[l],{ids:u,instance:h}=c.groups[l];if(b!==h||!ue.areEqual(g,u))return!1}return!0}e.areLociEqual=o;function s(f){return p(f)===0}e.isLociEmpty=s;function p(f){let c=0;for(const l of f.groups)c+=ue.size(l.ids);return c}e.size=p;const m=new pi,T=_.zero();function v(f,c,l,d){const{indices:g,offsets:b}=c;for(const{ids:u,instance:h}of f)ue.forEach(u,A=>{for(let C=b[A],I=b[A+1];C<I;++C)_.fromArray(T,l,g[C]*3),_.transformMat4(T,T,d[h]),m.includeStep(T)})}function y(f,c,l,d){const{indices:g,offsets:b}=c;for(const{ids:u,instance:h}of f)ue.forEach(u,A=>{for(let C=b[A],I=b[A+1];C<I;++C)_.fromArray(T,l,g[C]*3),_.transformMat4(T,T,d[h]),m.radiusStep(T)})}function x(f,c){c||(c=W()),m.reset();let l=0;const{geometry:d,transforms:g}=f.shape;if(d.kind==="mesh"||d.kind==="points"){const b=d.kind==="mesh"?d.vertexBuffer.ref.value:d.centerBuffer.ref.value;v(f.groups,d.groupMapping,b,g),m.finishedIncludeStep(),y(f.groups,d.groupMapping,b,g)}else if(d.kind==="lines"){const b=d.startBuffer.ref.value,u=d.endBuffer.ref.value;v(f.groups,d.groupMapping,b,g),v(f.groups,d.groupMapping,u,g),m.finishedIncludeStep(),y(f.groups,d.groupMapping,b,g),y(f.groups,d.groupMapping,u,g)}else if(d.kind==="spheres"||d.kind==="text"){const b=d.centerBuffer.ref.value;v(f.groups,d.groupMapping,b,g),m.finishedIncludeStep(),y(f.groups,d.groupMapping,b,g);for(const{ids:u,instance:h}of f.groups)ue.forEach(u,A=>{const C=f.shape.getSize(A,h);l<C&&(l=C)})}else return W.copy(c,d.boundingSphere);return _.copy(c.center,m.center),c.radius=Math.sqrt(m.radiusSq),W.expand(c,c,l),c}e.getBoundingSphere=x})(Xt||(Xt={}));export{nn as $,me as A,K as B,Ut as C,ee as D,ul as E,yr as F,Pe as G,Ka as H,tn as I,ds as J,qt as K,Bd as L,Jr as M,wd as N,In as O,Za as P,Nf as Q,vd as R,pa as S,de as T,G as U,fe as V,Wa as W,an as X,sn as Y,en as Z,Wt as _,Aa as a,tl as a$,on as a0,cn as a1,Ee as a2,Zt as a3,rt as a4,Eu as a5,hd as a6,ze as a7,Id as a8,la as a9,Ha as aA,gn as aB,Rd as aC,ml as aD,ea as aE,fl as aF,Nd as aG,Od as aH,bl as aI,Ld as aJ,hl as aK,Pd as aL,zi as aM,zd as aN,Vd as aO,Wd as aP,jd as aQ,Lu as aR,Mu as aS,Jd as aT,Kd as aU,Vu as aV,Qd as aW,Yd as aX,Hd as aY,Xd as aZ,rl as a_,X as aa,Tt as ab,sa as ac,rn as ad,pl as ae,Ot as af,Cr as ag,zt as ah,_t as ai,Pu as aj,ll as ak,uf as al,ye as am,Qt as an,Ft as ao,nl as ap,al as aq,Dd as ar,dl as as,Md as at,Gd as au,jf as av,qe as aw,Nt as ax,gl as ay,vl as az,Tr as b,Uu as b0,Au as b1,Se as b2,kd as b3,Ud as b4,Zd as b5,$d as b6,qd as b7,el as b8,Xt as b9,Ad as ba,Ni as bb,$r as c,Bi as d,qu as e,il as f,sl as g,cl as h,Je as i,qa as j,Qr as k,_e as l,yl as m,tt as n,Ri as o,Xu as p,Of as q,Ei as r,Mf as s,ol as t,Lf as u,Sf as v,Fd as w,De as x,ni as y,Vf as z};
