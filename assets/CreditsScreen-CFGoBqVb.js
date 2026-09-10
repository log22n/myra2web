import"./chunk-DseTPa7n.js";import{i as e,l as t,o as n,t as r}from"./HtmlView-Doavd3o1.js";import"./IniFile-m6XFYVMU.js";import"./DataStream-DCFsrgG8.js";import"./VirtualFile-Th1PDOrE.js";import{t as i}from"./Engine-CkV91g23.js";import"./Crc32-CuVenN8h.js";import"./Palette-Csv4HuXZ.js";import"./RealFileSystemDir-OjEI60-f.js";t();var a=n(),o=({contentTpl:e,strings:t})=>(0,a.jsx)(`div`,{className:`credits-container`,children:(0,a.jsx)(`div`,{className:`credits`,dangerouslySetInnerHTML:{__html:e.replace(/\{([^}]+)\}/g,(e,n)=>t.get(n)||e).replace(/<([^>]+)>/g,(e,t)=>t.match(/^(https?|mailto):(\/\/)?/)?`<a href='${encodeURI(t)}' target='_blank' rel='noopener'>${encodeURI(t)}</a>`:``).replace(/\t*\r?\n/g,`<br />`).replace(/([^>]+)\t+([^<]+)<br \/>/g,`<div class='def'>
        <span class='title'>$1</span>
        <span class='filler'></span>
        <span class='name'>$2</span>
      </div>`)}})}),s=class{strings;jsxRenderer;controller;title;constructor(e,t){this.strings=e,this.jsxRenderer=t,this.title=this.strings.get(`GUI:Credits`)||`Credits`}setController(e){this.controller=e}onEnter(){console.log(`[CreditsScreen] Entering credits screen`),this.controller?.setSidebarButtons([{label:this.strings.get(`GUI:Back`)||`Back`,isBottom:!0,onClick:()=>{console.log(`[CreditsScreen] Back clicked`),this.controller?.leaveCurrentScreen()}}]),this.controller?.showSidebarButtons(),this.controller?.toggleMainVideo(!1);let t=``,n=``;try{if(i.vfs){try{t=i.vfs.openFile(`creditscd.txt`).readAsString(`utf-8`)||``}catch{console.warn(`[CreditsScreen] creditscd.txt not found, using empty content`),t=``}try{n=i.vfs.openFile(`credits.txt`).readAsString()||``}catch{console.warn(`[CreditsScreen] credits.txt not found, using fallback content`),n=this.getFallbackCreditsContent()}}else console.warn(`[CreditsScreen] VFS not available, using fallback content`),n=this.getFallbackCreditsContent()}catch(e){console.error(`[CreditsScreen] Error reading credits files:`,e),n=this.getFallbackCreditsContent()}let a=n.replace(/\s+\{CRD:CREDITS\}\s+/,t);try{let[t]=this.jsxRenderer.render(e(r,{width:`100%`,height:`100%`,component:o,props:{contentTpl:a,strings:this.strings}}));this.controller?.setMainComponent(t)}catch(e){console.error(`[CreditsScreen] Error rendering credits:`,e),this.controller?.setMainComponent(this.createFallbackElement(a))}}async onLeave(){console.log(`[CreditsScreen] Leaving credits screen`),this.controller&&await this.controller.hideSidebarButtons()}async onStack(){await this.onLeave()}onUnstack(){this.onEnter()}getFallbackCreditsContent(){return`网页红井制作组	

原项目开发	Chronodivide
React迁移	网页红井制作组
技术支持	思牛逼公众号

{TS:Disclaimer}

{TXT_Copyright}`}createFallbackElement(e){let t=document.createElement(`div`);t.className=`credits-container`,t.style.cssText=`
      width: 100%;
      height: 100%;
      overflow-y: auto;
      padding: 20px;
      color: white;
      background: rgba(0, 0, 0, 0.8);
    `;let n=document.createElement(`div`);return n.className=`credits`,n.innerHTML=e.replace(/\{([^}]+)\}/g,(e,t)=>this.strings.get(t)||e).replace(/\t*\r?\n/g,`<br />`).replace(/([^>]+)\t+([^<]+)<br \/>/g,`<div style="display: flex; justify-content: space-between; margin: 5px 0;">
          <span>$1</span>
          <span>$2</span>
        </div>`),t.appendChild(n),t}};export{s as CreditsScreen};