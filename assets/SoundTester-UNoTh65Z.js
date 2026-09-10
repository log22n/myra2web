import"./IniFile-m6XFYVMU.js";import"./DataStream-DCFsrgG8.js";import"./VirtualFile-Th1PDOrE.js";import{l as e,t,u as n}from"./Engine-CkV91g23.js";import"./Crc32-CuVenN8h.js";import"./Palette-Csv4HuXZ.js";import"./RealFileSystemDir-OjEI60-f.js";import"./resourceConfigs-CIX3aMzC.js";import{t as r}from"./CompositeDisposable-B679RQ8y.js";import"./MapFile-Pj6fIqrk.js";import{TestToolSupport as i}from"./TestToolSupport-R5MzbNai.js";var a=class{static disposables=new r;static sounds;static audioBag;static listEl;static homeButton;static hostElement;static async main(r,a,o={}){await i.ensureAudio(o.cdnResourceLoader);let s=this.hostElement=i.prepareHost(o,212,600);this.sounds=t.getSounds(),this.audioBag=new n;let c=r.openFile(`audio.bag`),l=r.openFile(`audio.idx`);this.audioBag.fromVirtualFile(c,new e(l.stream)),r.addArchive(this.audioBag,`audio.bag`),this.buildBrowser(s),this.buildHomeButton(),i.setState(`sound`,{soundCount:this.audioBag.getFileList().length,selectedSound:null})}static selectSound(e){let t=new AudioContext,n=t.createGain();n.gain.value=.5;let r=new Uint8Array(this.sounds.get(e).getData()).buffer;t.decodeAudioData(r,e=>{let r=t.createBufferSource();r.buffer=e,r.connect(n).connect(t.destination),r.start(0)},e=>console.log(e)),i.setState(`sound`,{soundCount:this.audioBag.getFileList().length,selectedSound:e})}static buildBrowser(e){let t=this.listEl=document.createElement(`div`);t.style.position=`absolute`,t.style.right=`0`,t.style.top=`0`,t.style.height=`600px`,t.style.width=`200px`,t.style.overflowY=`auto`,t.style.padding=`5px`,t.style.background=`rgba(255, 255, 255, 0.5)`,t.style.border=`1px black solid`,t.appendChild(document.createTextNode(`Sound files:`)),this.audioBag.getFileList().forEach(e=>{let n=document.createElement(`a`);n.style.display=`block`,n.textContent=e,n.setAttribute(`href`,`javascript:;`),n.addEventListener(`click`,()=>{this.selectSound(e)}),t.appendChild(n)}),e.appendChild(t),i.applyPanelTheme(t)}static buildHomeButton(){let e=this.homeButton=document.createElement(`button`);e.innerHTML=`点此返回主页`,e.style.cssText=`
      position: fixed;
      left: 50%;
      top: 10px;
      transform: translateX(-50%);
      padding: 10px 20px;
      background-color: rgba(0, 0, 0, 0.8);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 6px;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      z-index: 1000;
      transition: all 0.3s ease;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    `,e.onmouseover=()=>{e.style.backgroundColor=`rgba(0, 0, 0, 0.95)`,e.style.borderColor=`rgba(255, 255, 255, 0.6)`,e.style.transform=`translateX(-50%) translateY(-2px)`,e.style.boxShadow=`0 4px 12px rgba(0, 0, 0, 0.4)`},e.onmouseout=()=>{e.style.backgroundColor=`rgba(0, 0, 0, 0.8)`,e.style.borderColor=`rgba(255, 255, 255, 0.3)`,e.style.transform=`translateX(-50%) translateY(0)`,e.style.boxShadow=`0 2px 8px rgba(0, 0, 0, 0.3)`},e.onclick=()=>{window.location.hash=`/`},document.body.appendChild(e)}static destroy(){this.listEl?.remove(),this.homeButton&&=(this.homeButton.remove(),void 0),this.disposables.dispose(),i.clearState(`sound`)}};export{a as SoundTester};