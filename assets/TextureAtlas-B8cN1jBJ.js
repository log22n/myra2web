import{F as e,J as t,N as n,P as r,R as i,at as a,b as o,d as s,g as c,n as l,st as u,t as d,u as f}from"./three.module-DXTXSmRo.js";import{a as p}from"./math-Ddn6G0Bv.js";import{t as m}from"./Bitmap-za_UbnjG.js";var h=function(e){return e[e.Instancing=0]=`Instancing`,e[e.Merging=1]=`Merging`,e}({}),g=class extends r{batchMode;isBatchedMesh=!0;opacity=1;extraLight=new u(0,0,0);paletteIndex=0;clippingPlanes=[];clippingPlanesHash=``;constructor(e,t,n=h.Instancing){super(e,t),this.geometry=e,this.material=t,this.batchMode=n,this.castShadow=!1,this.layers.disable(0),this.layers.enable(1)}getOpacity(){return this.opacity}setOpacity(e){this.opacity=e}getExtraLight(){return this.extraLight}setExtraLight(e){this.extraLight=e}getPaletteIndex(){return this.paletteIndex}setPaletteIndex(e){this.paletteIndex=e}getClippingPlanes(){return this.clippingPlanes}setClippingPlanes(e){this.clippingPlanes=e,this.updateClippingPlanesHash(e)}updateClippingPlanesHash(e){this.clippingPlanesHash=e.map(e=>[...e.normal.toArray(),e.constant]).flat().join(`,`)}getClippingPlanesHash(){return this.clippingPlanesHash}},_={uniforms:{palette:{type:`t`,value:null},paletteOffsetCount:{value:[0,1]},extraLight:{value:new u(0,0,0)}},instanceParsVertex:`
#ifdef INSTANCE_TRANSFORM
    attribute float instancePaletteOffset;
    varying float vInstancePaletteOffset;
    attribute vec3 instanceExtraLight;
    varying vec3 vInstanceExtraLight;
#endif
`,instanceVertex:`
  #ifdef INSTANCE_TRANSFORM
    vInstancePaletteOffset = instancePaletteOffset;
    vInstanceExtraLight = instanceExtraLight;
  #endif
`,paletteColorParsVertex:`
#ifdef VERTEX_PALETTE_OFFSET
    attribute float vertexPaletteOffset;
    varying float vVertexPaletteOffset;
#endif
`,paletteColorVertex:`
  #ifdef VERTEX_PALETTE_OFFSET
    vVertexPaletteOffset = vertexPaletteOffset;
  #endif
`,paletteColorParsFrag:`
uniform sampler2D palette;
#ifdef VERTEX_PALETTE_OFFSET
    varying float vVertexPaletteOffset;
#endif
uniform vec2 paletteOffsetCount;
uniform vec3 extraLight;

#ifdef INSTANCE_TRANSFORM
varying float vInstancePaletteOffset;
varying vec3 vInstanceExtraLight;
#endif
`,paletteColorFrag:`
  float paletteColorIndex;

  #ifdef USE_MAP
  #ifdef USE_RED_INDEX
  paletteColorIndex = sampledDiffuseColor.r;
  #else
  paletteColorIndex = sampledDiffuseColor.a;
  #endif
  #endif

  #ifdef USE_COLOR
  paletteColorIndex = vColor.r;
  #endif

  #ifdef INSTANCE_TRANSFORM
  diffuseColor = texture2D(palette, vec2(paletteColorIndex, (vInstancePaletteOffset + 0.5) / paletteOffsetCount.y));
  #elif defined(VERTEX_PALETTE_OFFSET)
  diffuseColor = texture2D(palette, vec2(paletteColorIndex, (vVertexPaletteOffset + 0.5) / paletteOffsetCount.y));
  #else
  diffuseColor = texture2D(palette, vec2(paletteColorIndex, (paletteOffsetCount.x + 0.5) / paletteOffsetCount.y));
  #endif

  #ifdef INSTANCE_OPACITY
  diffuseColor.a *= vInstanceOpacity * opacity;
  #else
  diffuseColor.a *= opacity;
  #endif
  diffuseColor = clamp(diffuseColor, 0.0, 1.0);
`,paletteBasicLightFragment:`
  #ifdef INSTANCE_TRANSFORM
  diffuseColor.rgb += vInstanceExtraLight.rgb * diffuseColor.rgb;
  #else
  diffuseColor.rgb += extraLight.rgb * diffuseColor.rgb;
  #endif

  diffuseColor = clamp(diffuseColor, 0.0, 1.0);
`,paletteFullLightFragment:`
  #ifdef INSTANCE_TRANSFORM
  vec3 extraIrradiance = vInstanceExtraLight.rgb;
  #else
  vec3 extraIrradiance = extraLight.rgb;
  #endif

  #if ( NUM_DIR_LIGHTS > 0 )
    #pragma unroll_loop_start
    for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
      vec3 lightDirection = normalize( directionalLights[ i ].direction );
      float dotNL = saturate( dot( geometryNormal, lightDirection ) );
      vec3 customIrradiance = dotNL * directionalLights[ i ].color * extraIrradiance;
      
      reflectedLight.directDiffuse += customIrradiance * BRDF_Lambert( material.diffuseColor );
      #ifdef USE_PHONG
        reflectedLight.directSpecular += customIrradiance * BRDF_BlinnPhong( lightDirection, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
      #endif
    }
    #pragma unroll_loop_end
  #endif

  vec3 ambientIrradiance = getAmbientLightIrradiance( ambientLightColor );
  ambientIrradiance *= extraIrradiance;
  reflectedLight.indirectDiffuse += ambientIrradiance * BRDF_Lambert( material.diffuseColor );
`,vertexColorMultParsVertex:`
#ifdef USE_VERTEX_COLOR_MULT
attribute vec4 vertexColorMult;
varying vec4 vVertexColorMult;
#endif
`,vertexColorMultVertex:`
  #ifdef USE_VERTEX_COLOR_MULT
  vVertexColorMult = vertexColorMult;
  #endif
`,vertexColorMultParsFrag:`
#ifdef USE_VERTEX_COLOR_MULT
varying vec4 vVertexColorMult;
#endif
`,vertexColorMultFrag:`
  #ifdef USE_VERTEX_COLOR_MULT
  diffuseColor.rgba *= vVertexColorMult.rgba;
  #endif
`},v={uniforms:a.merge([l.basic.uniforms,_.uniforms]),vertexShader:d.meshbasic_vert.replace(`#include <common>`,`#include <common>
`+[_.instanceParsVertex,_.paletteColorParsVertex,_.vertexColorMultParsVertex].join(`
`)).replace(`void main() {`,`void main() {
`+[_.instanceVertex,_.paletteColorVertex,_.vertexColorMultVertex].join(`
`)),fragmentShader:d.meshbasic_frag.replace(`#include <common>`,`#include <common>
`+[_.paletteColorParsFrag,_.vertexColorMultParsFrag].join(`
`)).replace(`#include <color_fragment>`,`#include <color_fragment>
`+[_.paletteColorFrag,_.paletteBasicLightFragment,_.vertexColorMultFrag].join(`
`))},y=class extends e{uniforms;vertexShader;fragmentShader;get palette(){return this.uniforms.palette.value}set palette(e){this.uniforms.palette.value=e}get paletteOffset(){return this.uniforms.paletteOffsetCount.value[0]}set paletteOffset(e){this.uniforms.paletteOffsetCount.value[0]=e}get paletteCount(){return this.uniforms.paletteOffsetCount.value[1]}set paletteCount(e){this.uniforms.paletteOffsetCount.value[1]=e}get extraLight(){return this.uniforms.extraLight.value}set extraLight(e){this.uniforms.extraLight.value=e}set useVertexColorMult(e){e?(this.defines=this.defines||{},this.defines.USE_VERTEX_COLOR_MULT=``):this.defines&&delete this.defines.USE_VERTEX_COLOR_MULT}constructor({palette:e,paletteCount:t,paletteOffset:n,extraLight:r,useVertexColorMult:i,flatShading:o,useRedIndex:s,...c}={}){c.side===void 0&&(c.side=2),super(c),this.uniforms=a.clone(v.uniforms),e&&(this.palette=e),t&&(this.paletteCount=t),n&&(this.paletteOffset=n),r&&this.extraLight.copy(r),i&&(this.useVertexColorMult=i),this.vertexShader=v.vertexShader,this.fragmentShader=v.fragmentShader,s&&(this.defines=this.defines||{},this.defines.USE_RED_INDEX=``),this.type=`PaletteBasicMaterial`,this.onBeforeCompile=e=>{e.uniforms=a.merge([e.uniforms,this.uniforms]),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,this.userData.lastCompiledShader={vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,uniforms:Object.keys(e.uniforms)},console.log(`[PaletteBasicMaterial] compiled`,{type:this.type,hasMap:!!this.map,defines:this.defines,hasColorFragmentInclude:e.fragmentShader.includes(`#include <color_fragment>`),hasPaletteColorIndex:e.fragmentShader.includes(`paletteColorIndex`)})},this.needsUpdate=!0}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=a.clone(e.uniforms),this.palette=e.palette,this}},b=class{static mergeVertices(e,t=1e-4){t=Math.max(t,2**-52);let n={},r=e.getIndex(),i=e.getAttribute(`position`),a=(r||i).count,o=0,s=Object.keys(e.attributes),c={},l={},u=[],d=[(e,t)=>e.getX(t),(e,t)=>e.getY(t),(e,t)=>e.getZ(t),(e,t)=>e.getW(t)];for(let t=0,n=s.length;t<n;t++){let n=s[t];c[n]=[];let r=e.morphAttributes[n];r&&(l[n]=Array(r.length).fill(void 0).map(()=>[]))}let p=Math.log10(1/t),m=Math.max(1e4,10**p);for(let t=0;t<a;t++){let i=r?r.getX(t):t,a=``;for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.getAttribute(n),o=r.itemSize;for(let e=0;e<o;e++)a+=~~(d[e](r,i)*m)+`,`}if(a in n)u.push(n[a]);else{for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.getAttribute(n),a=e.morphAttributes[n],o=r.itemSize,u=c[n],f=l[n];for(let e=0;e<o;e++){let t=d[e];if(u.push(t(r,i)),a)for(let e=0,n=a.length;e<n;e++)f[e].push(t(a[e],i))}}n[a]=o,u.push(o),o++}}let h=e.clone();for(let t=0,n=s.length;t<n;t++){let n=s[t],r=e.getAttribute(n),i=new f(new r.array.constructor(c[n]),r.itemSize,r.normalized);if(h.setAttribute(n,i),n in l)for(let t=0;t<l[n].length;t++){let r=e.morphAttributes[n][t],i=new f(new r.array.constructor(l[n][t]),r.itemSize,r.normalized);h.morphAttributes[n][t]=i}}return h.setIndex(new f(new Uint32Array(u),1)),h}static mergeBufferGeometries(e,t=!1){let n=e[0].index!==null,r=new Set(Object.keys(e[0].attributes)),i={},a=new s,o=0;for(let s=0;s<e.length;++s){let c=e[s],l=0;if(n!==(c.index!==null))throw Error(`mergeBufferGeometries() failed with geometry at index `+s+`. All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them.`);if(Object.keys(c.morphAttributes).length)throw Error(`mergeBufferGeometries() failed with geometry at index `+s+`. Morph attributes are not supported`);for(let e in c.attributes){if(!r.has(e))throw Error(`mergeBufferGeometries() failed with geometry at index `+s+`. All geometries must have compatible attributes; make sure "`+e+`" attribute exists among all geometries, or in none of them.`);i[e]===void 0&&(i[e]=[]),i[e].push(c.attributes[e]),l++}if(l!==r.size)throw Error(`mergeBufferGeometries() failed with geometry at index `+s+`. Make sure all geometries have the same number of attributes.`);if(t){let e;if(n)e=c.index.count;else{if(c.attributes.position===void 0)throw Error(`mergeBufferGeometries() failed with geometry at index `+s+`. The geometry must have either an index or a position attribute`);e=c.attributes.position.count}a.addGroup(o,e,s),o+=e}}if(n){let t=0,n=[];for(let r=0;r<e.length;++r){let i=e[r].index;for(let e=0;e<i.count;++e)n.push(i.getX(e)+t);t+=e[r].attributes.position.count}a.setIndex(new f(new(n.length>65535?Uint32Array:Uint16Array)(n),1))}for(let e in i){let t=this.mergeBufferAttributes(i[e]);if(!t)throw Error(`mergeBufferGeometries() failed while trying to merge the `+e+` attribute.`);a.setAttribute(e,t)}return a}static mergeBufferAttributes(e){let t,n,r,i=0;for(let a=0;a<e.length;++a){let o=e[a];if(o.isInterleavedBufferAttribute)throw Error(`mergeBufferAttributes() failed. InterleavedBufferAttributes are not supported.`);if(t===void 0&&(t=o.array.constructor),t!==o.array.constructor)throw Error(`mergeBufferAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes.`);if(n===void 0&&(n=o.itemSize),n!==o.itemSize)throw Error(`mergeBufferAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes.`);if(r===void 0&&(r=o.normalized),r!==o.normalized)throw Error(`mergeBufferAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes.`);i+=o.array.length}let a=new t(i),o=0;for(let t=0;t<e.length;++t)a.set(e[t].array,o),o+=e[t].array.length;return new f(a,n,r)}},x=class e{static MAGIC_DEPTH_SCALE=.8;USE_INDEXED_GEOMETRY;VERTICES_PER_SPRITE;TRIANGLES_PER_SPRITE;constructor(){this.USE_INDEXED_GEOMETRY=!0,this.VERTICES_PER_SPRITE=this.USE_INDEXED_GEOMETRY?8:12,this.TRIANGLES_PER_SPRITE=4}createSpriteGeometry(e){if(typeof e!=`object`)throw Error(`Invalid argument`);let t=e.camera,r=e.texture;e.textureArea||={x:0,y:0,width:r.image.width,height:r.image.height},e.offset||={x:0,y:0};let i=e.textureArea.width,a=e.textureArea.height,s={width:e.texture.image.width,height:e.texture.image.height},c=Math.cos(t.rotation.y)*(e.scale??1),l=c/Math.sin(-t.rotation.x),u=i*c,d=a*(e.flat?l:c),f=e.depth&&!e.flat,m=f&&p(-e.offset.x,0,u/c)?-e.offset.x:u/c/2,h=this.createRectGeometry(m*c,d),g=this.createRectGeometry(u-m*c,d);this.addRectUvs(h,{...e.textureArea,width:m},s),this.addRectUvs(g,{...e.textureArea,x:e.textureArea.x+m,width:e.textureArea.width-m},s),g.applyMatrix4(new n().makeTranslation((u-m*c+m*c)/2,0,0));let _=b.mergeBufferGeometries([h,g]);_.applyMatrix4(new n().makeTranslation(-(u/2-m*c/2),0,0));let v=e.align,y=e.offset;_.applyMatrix4(new n().makeTranslation(v.x*u/2+y.x*c,v.y*d/2-y.y*(e.flat?l:c),0)),f?this.applyDepth(_,t,e.depthOffset??0):e.depth&&e.flat&&e.depthOffset&&this.applyFlatDepth(_,e.depthOffset);let x=new o(t.rotation.x,t.rotation.y,0,`YXZ`);return _.applyMatrix4(new n().makeRotationFromEuler(x).multiply(e.flat?new n().makeRotationFromEuler(new o(-t.rotation.x-Math.PI/2,0,0)):new n().identity())),_}createRectGeometry(e,t){return this.USE_INDEXED_GEOMETRY?this.createIndexedRectGeometry(e,t):this.createNonIndexedRectGeometry(e,t)}createNonIndexedRectGeometry(e,t){let n=new s,r=new Float32Array([-.5*e,.5*t,0,-.5*e,-.5*t,0,.5*e,.5*t,0,-.5*e,-.5*t,0,.5*e,-.5*t,0,.5*e,.5*t,0]);return n.setAttribute(`position`,new f(r,3)),n}createIndexedRectGeometry(e,t){let n=new s,r=new Float32Array([-.5*e,.5*t,0,.5*e,.5*t,0,-.5*e,-.5*t,0,.5*e,-.5*t,0]);n.setAttribute(`position`,new f(r,3));let i=new Uint16Array([0,2,1,2,3,1]);return n.setIndex(new f(i,1)),n}addRectUvs(e,t,n){let r=new Float32Array(2*e.getAttribute(`position`).count);this.USE_INDEXED_GEOMETRY?this.writeIndexedRectUvsIntoBuffer(r,0,t,n):this.writeNonIndexedRectUvsIntoBuffer(r,0,t,n),e.setAttribute(`uv`,new f(r,2))}writeNonIndexedRectUvsIntoBuffer(e,t,n,r){let i=n.x/r.width,a=1-(n.y+n.height)/r.height,o=n.width/r.width,s=n.height/r.height;e.set([i,a+s,i,a,i+o,a+s,i,a,i+o,a,i+o,a+s],12*t)}writeIndexedRectUvsIntoBuffer(e,t,n,r){let i=n.x/r.width,a=1-(n.y+n.height)/r.height,o=n.width/r.width,s=n.height/r.height;e.set([i,a+s,i+o,a+s,i,a,i+o,a],8*t)}applyDepth(t,n,r){let i=t.getAttribute(`position`);for(let t=0,a=i.count;t<a;t++){let a=i.getX(t)*e.MAGIC_DEPTH_SCALE,o;o=a<0?r-Math.abs(a)/Math.cos(n.rotation.x)*Math.tan(n.rotation.y):r-a/Math.cos(n.rotation.x)/Math.tan(n.rotation.y),i.setZ(t,o)}}applyFlatDepth(e,t){let n=e.getAttribute(`position`);for(let e=0,r=n.count;e<r;e++)n.setZ(e,t)}},S=new x,C=S.createSpriteGeometry.bind(S);S.VERTICES_PER_SPRITE,S.TRIANGLES_PER_SPRITE,x.MAGIC_DEPTH_SCALE;var w=S,T=class{root;fit(e){this.root={x:0,y:0,w:e.length>0?e[0].w:0,h:e.length>0?e[0].h:0};for(let t of e){let e=this.findNode(this.root,t.w,t.h);t.fit=e?this.splitNode(e,t.w,t.h):this.growNode(t.w,t.h)}}findNode(e,t,n){if(e){if(e.used)return this.findNode(e.right,t,n)??this.findNode(e.down,t,n);if(t<=e.w&&n<=e.h)return e}}splitNode(e,t,n){return e.used=!0,e.down={x:e.x,y:e.y+n,w:e.w,h:e.h-n},e.right={x:e.x+t,y:e.y,w:e.w-t,h:n},e}growNode(e,t){let n=e<=this.root.w,r=t<=this.root.h,i=r&&this.root.h>=this.root.w+e,a=n&&this.root.w>=this.root.h+t;if(i)return this.growRight(e,t);if(a)return this.growDown(e,t);if(r)return this.growRight(e,t);if(n)return this.growDown(e,t)}growRight(e,t){this.root={used:!0,x:0,y:0,w:this.root.w+e,h:this.root.h,down:this.root,right:{x:this.root.w,y:0,w:e,h:this.root.h}};let n=this.findNode(this.root,e,t);return n?this.splitNode(n,e,t):void 0}growDown(e,t){this.root={used:!0,x:0,y:0,w:this.root.w,h:this.root.h+t,down:{x:0,y:this.root.h,w:this.root.w,h:t},right:this.root};let n=this.findNode(this.root,e,t);return n?this.splitNode(n,e,t):void 0}};function E(e,t,n,r){let i=new m(t,n);return e.forEach(e=>{if(!e.fit)throw Error(`Couldn't fit all images in a single texture`);let t=e.image,n=e.fit.x,a=e.fit.y;r?.set(t,{x:n,y:a,width:e.w,height:e.h}),i.drawIndexedImage(t,n,a)}),i}function D(e){let t=new Uint8Array(e.width*e.height*4);for(let n=0;n<e.data.length;n++){let r=n*4,i=e.data[n];t[r]=0,t[r+1]=0,t[r+2]=0,t[r+3]=i}return t}var O=class{texture;imageRects;width=0;height=0;getTexture(){if(!this.texture)throw Error(`Texture atlas not initialized`);return this.texture}getImageRect(e){if(!this.imageRects)throw Error(`Texture atlas not initialized`);let t=this.imageRects.get(e);if(!t)throw Error(`Image not found in atlas`);return t}pack(e){let n=[];e.forEach(e=>{n.push({w:e.width+e.width%2,h:e.height+e.height%2,image:e})}),n.sort((e,t)=>(t.w-e.w)*1e4+t.h-e.h);let r=new T;r.fit(n);let a=r.root.w,o=r.root.h,s=new Map,l=new c(D(E(n,a,o,s)),a,o,t);l.needsUpdate=!0,l.flipY=!0,l.minFilter=i,l.magFilter=i,l.colorSpace=``,this.width=a,this.height=o,this.imageRects=s,this.texture=l}dispose(){this.texture?.dispose()}};export{b as a,h as c,C as i,g as l,T as n,y as o,w as r,_ as s,O as t};