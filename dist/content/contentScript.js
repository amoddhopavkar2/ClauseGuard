"use strict";(()=>{var v={enabled:!0,onlyLegalPages:!0,sensitivity:"normal",highlightColors:{arbitration:"#ff6b6b","auto-renew":"#ffa94d","data-sharing":"#ff8787","data-retention":"#ffd43b","unilateral-changes":"#69db7c",liability:"#74c0fc","governing-law":"#b197fc"},allowlist:[],denylist:[],domainOverrides:{},skipElements:["script","style","noscript","textarea","input","code","pre","svg"]},Q={strict:{high:15,medium:8},normal:{high:25,medium:12},lenient:{high:40,medium:20}},$={arbitration:{label:"Arbitration / Waiver",icon:"\u2696\uFE0F"},"auto-renew":{label:"Auto-Renewal / Billing",icon:"\u{1F4B3}"},"data-sharing":{label:"Data Sharing",icon:"\u{1F4E4}"},"data-retention":{label:"Data Retention",icon:"\u{1F4BE}"},"unilateral-changes":{label:"Unilateral Changes",icon:"\u{1F4DD}"},liability:{label:"Liability Limits",icon:"\u{1F6E1}\uFE0F"},"governing-law":{label:"Governing Law",icon:"\u{1F3DB}\uFE0F"}},Z={critical:{label:"Critical",color:"#c92a2a"},high:{label:"High",color:"#e03131"},medium:{label:"Medium",color:"#f59f00"},low:{label:"Low",color:"#40c057"}};var r=e=>new RegExp(e,"gi"),ee=[{id:"arb-binding",category:"arbitration",pattern:r("binding\\s+arbitration"),severity:"critical",weight:10,description:"Requires disputes to be resolved through binding arbitration",critical:!0},{id:"arb-class-action",category:"arbitration",pattern:r("class\\s+action\\s+waiver"),severity:"critical",weight:10,description:"Waives your right to participate in class action lawsuits",critical:!0},{id:"arb-waive-right",category:"arbitration",pattern:r("waive\\s+(your|the)\\s+right\\s+to"),severity:"high",weight:8,description:"Requires you to waive certain legal rights"},{id:"arb-jury-waive",category:"arbitration",pattern:r("jury\\s+trial[^.]*waive|waive[^.]*jury\\s+trial"),severity:"critical",weight:9,description:"Waives your right to a jury trial",critical:!0},{id:"arb-no-class",category:"arbitration",pattern:r("(may\\s+not|cannot|shall\\s+not)\\s+(bring|file|pursue)[^.]*class\\s+action"),severity:"high",weight:8,description:"Prohibits bringing class action lawsuits"},{id:"arb-aaa",category:"arbitration",pattern:r("(AAA|American\\s+Arbitration\\s+Association)"),severity:"high",weight:6,description:"References American Arbitration Association rules"},{id:"arb-jams",category:"arbitration",pattern:r("\\bJAMS\\b"),severity:"high",weight:6,description:"References JAMS arbitration services"},{id:"arb-individual-basis",category:"arbitration",pattern:r("on\\s+an?\\s+individual\\s+basis\\s+only"),severity:"high",weight:7,description:"Requires claims to be brought individually, not as a group"},{id:"auto-renew-auto",category:"auto-renew",pattern:r("automatically\\s+renew"),severity:"high",weight:7,description:"Service automatically renews"},{id:"auto-renew-pattern",category:"auto-renew",pattern:r("auto-?renew(al|s|ed)?"),severity:"high",weight:7,description:"Auto-renewal clause"},{id:"auto-recurring",category:"auto-renew",pattern:r("recurring\\s+(billing|charge|payment)"),severity:"high",weight:6,description:"Recurring billing or charges"},{id:"auto-trial-convert",category:"auto-renew",pattern:r("(trial|free)[^.]{0,50}convert(s)?\\s+(to|into)\\s+(a\\s+)?(paid|subscription)"),severity:"high",weight:8,description:"Trial converts to paid subscription"},{id:"auto-cancel-before",category:"auto-renew",pattern:r("cancel[^.]{0,30}before[^.]{0,30}renewal"),severity:"medium",weight:5,description:"Must cancel before renewal date"},{id:"auto-charged-until",category:"auto-renew",pattern:r("(will\\s+be|are)\\s+charged[^.]{0,50}until\\s+(you\\s+)?cancel"),severity:"high",weight:6,description:"Charges continue until you cancel"},{id:"auto-no-refund",category:"auto-renew",pattern:r("no\\s+refunds?\\s+(will\\s+be\\s+)?(provided|given|issued)"),severity:"medium",weight:5,description:"No refunds policy"},{id:"data-share-third",category:"data-sharing",pattern:r("share[^.]{0,50}(with\\s+)?(third\\s+part(y|ies)|partners?|affiliates?)"),severity:"high",weight:7,description:"Shares data with third parties, partners, or affiliates"},{id:"data-sell-personal",category:"data-sharing",pattern:r("sell[^.]{0,30}(personal\\s+(information|data)|your\\s+(data|information))"),severity:"critical",weight:10,description:"May sell your personal information",critical:!0},{id:"data-advertising",category:"data-sharing",pattern:r("(advertising|ad)\\s+partners"),severity:"high",weight:6,description:"Shares data with advertising partners"},{id:"data-analytics",category:"data-sharing",pattern:r("analytics\\s+providers"),severity:"medium",weight:4,description:"Shares data with analytics providers"},{id:"data-disclose",category:"data-sharing",pattern:r("(may|will)\\s+disclose[^.]{0,50}(to\\s+)?(third\\s+part|government|law\\s+enforcement)"),severity:"medium",weight:5,description:"May disclose data to third parties or authorities"},{id:"data-transfer",category:"data-sharing",pattern:r("transfer[^.]{0,30}(your\\s+)?(personal\\s+)?(data|information)[^.]{0,30}(to|outside)"),severity:"medium",weight:5,description:"May transfer your data"},{id:"data-marketing",category:"data-sharing",pattern:r("(use|share)[^.]{0,30}(your\\s+)?(data|information)[^.]{0,30}marketing"),severity:"high",weight:6,description:"Uses your data for marketing purposes"},{id:"ret-long",category:"data-retention",pattern:r("retain[^.]{0,50}as\\s+long\\s+as"),severity:"medium",weight:5,description:"May retain data for extended periods"},{id:"ret-indefinitely",category:"data-retention",pattern:r("(retain|store|keep)[^.]{0,30}indefinitely"),severity:"high",weight:7,description:"May retain data indefinitely"},{id:"ret-legal-business",category:"data-retention",pattern:r("for\\s+(legal|business|regulatory)\\s+purposes"),severity:"low",weight:3,description:"Retains data for legal or business purposes"},{id:"ret-continue-store",category:"data-retention",pattern:r("(may|will)\\s+continue\\s+to\\s+store"),severity:"medium",weight:5,description:"May continue storing data after account closure"},{id:"ret-after-deletion",category:"data-retention",pattern:r("(after|even\\s+if)[^.]{0,30}(delet|terminat|clos)[^.]{0,30}(retain|keep|store)"),severity:"high",weight:6,description:"May retain data even after you request deletion"},{id:"ret-backup",category:"data-retention",pattern:r("(backup|archive)[^.]{0,30}(copies|data)[^.]{0,30}(may|will|could)\\s+(remain|persist)"),severity:"medium",weight:4,description:"Backup copies may persist after deletion"},{id:"change-anytime",category:"unilateral-changes",pattern:r("(we\\s+)?(may|can|reserve\\s+the\\s+right\\s+to)\\s+(modify|change|update|amend)[^.]{0,30}at\\s+any\\s+time"),severity:"medium",weight:5,description:"Terms may be changed at any time"},{id:"change-without-notice",category:"unilateral-changes",pattern:r("without\\s+(prior\\s+)?notice"),severity:"high",weight:6,description:"Changes may be made without notice"},{id:"change-continued-use",category:"unilateral-changes",pattern:r("continued\\s+use[^.]{0,50}(constitutes|means|indicates)\\s+(acceptance|agreement)"),severity:"medium",weight:5,description:"Continued use means you accept changes"},{id:"change-sole-discretion",category:"unilateral-changes",pattern:r("(in\\s+)?(our|its)\\s+sole\\s+(and\\s+absolute\\s+)?discretion"),severity:"medium",weight:4,description:"Company can make decisions at sole discretion"},{id:"change-terminate",category:"unilateral-changes",pattern:r("(may|can|reserve[^.]{0,20}right[^.]{0,10})\\s+terminat[^.]{0,30}(at\\s+any\\s+time|without\\s+(cause|reason))"),severity:"high",weight:6,description:"Service may be terminated at any time without cause"},{id:"liab-maximum",category:"liability",pattern:r("to\\s+the\\s+(maximum|fullest)\\s+extent\\s+permitted"),severity:"medium",weight:4,description:"Limits liability to maximum extent permitted by law"},{id:"liab-limitation",category:"liability",pattern:r("limitation\\s+of\\s+liability"),severity:"medium",weight:4,description:"Liability limitation clause"},{id:"liab-not-liable",category:"liability",pattern:r("(shall\\s+)?not\\s+(be\\s+)?(liable|responsible)\\s+for"),severity:"medium",weight:4,description:"Disclaims liability for certain issues"},{id:"liab-damages",category:"liability",pattern:r("(consequential|incidental|punitive|indirect|special)\\s+damages"),severity:"medium",weight:4,description:"Excludes certain types of damages"},{id:"liab-warranty",category:"liability",pattern:r("(disclaim|exclude)[^.]{0,30}warrant(y|ies)"),severity:"medium",weight:4,description:"Disclaims warranties"},{id:"liab-as-is",category:"liability",pattern:r('"?as\\s+is"?\\s+(and\\s+"?as\\s+available"?)?\\s+basis'),severity:"low",weight:3,description:'Service provided "as is" without guarantees'},{id:"liab-indemnify",category:"liability",pattern:r("(you\\s+)?(agree\\s+to\\s+)?indemnify[^.]{0,50}(us|company|service)"),severity:"medium",weight:5,description:"Requires you to indemnify the company"},{id:"gov-laws",category:"governing-law",pattern:r("governed\\s+by\\s+the\\s+laws\\s+of"),severity:"low",weight:2,description:"Specifies governing law jurisdiction"},{id:"gov-exclusive",category:"governing-law",pattern:r("exclusive\\s+(jurisdiction|venue)"),severity:"medium",weight:4,description:"Requires disputes in specific jurisdiction"},{id:"gov-venue",category:"governing-law",pattern:r("venue[^.]{0,30}shall\\s+be"),severity:"low",weight:3,description:"Specifies legal venue"},{id:"gov-waive-venue",category:"governing-law",pattern:r("waive[^.]{0,30}(objection|right)[^.]{0,30}venue"),severity:"medium",weight:5,description:"Waives right to object to venue"}];var te=["terms","tos","privacy","policy","legal","agreement","conditions","cookies","data-processing","gdpr","ccpa","eula","disclaimer","notices"],ie=["terms","privacy","policy","agreement","legal","conditions","notice","disclaimer","cookie","data protection"];async function z(){try{let e=await chrome.storage.sync.get("settings");if(e.settings)return{...v,...e.settings};let i=await chrome.storage.local.get("settings");return i.settings?{...v,...i.settings}:v}catch(e){return console.error("ClauseGuard: Error loading settings:",e),v}}function Te(e){let i=e.toLowerCase();return te.some(t=>i.includes(t))}function Le(e,i){let t=e.toLowerCase(),n=i?.toLowerCase()||"";return ie.some(a=>t.includes(a)||n.includes(a))}function T(e,i,t){return Te(e)||Le(i,t)}function N(e){try{return new URL(e).hostname}catch{return""}}function ne(e,i){if(i.startsWith("*.")){let t=i.slice(2);return e===t||e.endsWith("."+t)}return e===i}function P(e,i){return i.some(t=>ne(e,t))}function A(e,i){return i.some(t=>ne(e,t))}function re(e,i,t){let n=Q[t],a=i.some(s=>s.severity==="critical");return e>=n.high||a?"high":e>=n.medium?"medium":"low"}function ae(e,i,t,n=320){let a=t-i,s=Math.max(0,n-a),o=Math.floor(s/2),p=s-o,h=Math.max(0,i-o),c=Math.min(e.length,t+p);if(h>0){let u=e.lastIndexOf(" ",h+20);u>h-30&&u>0&&(h=u+1)}if(c<e.length){let u=e.indexOf(" ",c-20);u!==-1&&u<c+30&&(c=u)}let g=e.slice(h,c);return h>0&&(g="..."+g),c<e.length&&(g=g+"..."),g}function se(){return"cg-"+Math.random().toString(36).slice(2,11)}function oe(e,i){let t=null;return function(...n){t&&clearTimeout(t),t=setTimeout(()=>{e(...n)},i)}}function q(e){let i=document.createElement("div");return i.textContent=e,i.innerHTML}var _="cg-highlight",ce="cg-highlight-active",L=new Map;function ke(e,i){let t=document.createElement("mark");return t.className=`${_} cg-cat-${e.category}`,t.dataset.cgId=e.id,t.dataset.cgCategory=e.category,t.style.backgroundColor=i.highlightColors[e.category]||"#ffff00",t.style.color="inherit",t.style.padding="0 2px",t.style.borderRadius="2px",t.style.cursor="pointer",t}function Me(e,i){let t=e;for(;t&&t!==document.body;){if(t.nodeType===Node.ELEMENT_NODE){let n=t,a=n.tagName.toLowerCase();if(i.includes(a)||n.hidden||n.style.display==="none"||n.id==="clauseguard-panel"||n.classList.contains(_)||n.shadowRoot&&n.id==="clauseguard-root")return!0}t=t.parentNode}return!1}function B(e){let i=[],t=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:a=>!a.textContent||!a.textContent.trim()||Me(a,e)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}),n;for(;n=t.nextNode();)i.push(n);return i}function Re(e,i,t){let n=e.textContent||"",a=i.startOffset,s=i.endOffset;if(a<0||s>n.length||a>=s)return console.warn("ClauseGuard: Invalid match offsets",{matchStart:a,matchEnd:s,textLength:n.length}),null;try{let o=document.createRange();o.setStart(e,a),o.setEnd(e,s);let p=ke(i,t);return o.surroundContents(p),L.has(i.id)||L.set(i.id,[]),L.get(i.id).push(p),p}catch(o){return console.warn("ClauseGuard: Could not highlight match:",o),null}}async function de(e,i,t,n){let a=new Map;for(let c of e)a.has(c.textNodeIndex)||a.set(c.textNodeIndex,[]),a.get(c.textNodeIndex).push(c);for(let c of a.values())c.sort((g,u)=>u.startOffset-g.startOffset);let s=10,o=Array.from(a.keys()).sort((c,g)=>g-c),p=0,h=c=>new Promise(g=>{let u=()=>{let x=Math.min(c+s,o.length);for(let b=c;b<x;b++){let C=o[b],O=a.get(C),w=i[C];if(!(!w||!w.parentNode)){for(let S of O)Re(w,S,t),S.highlighted=!0;p++}}n&&n(p,o.length),g()};"requestIdleCallback"in window?requestIdleCallback(u,{timeout:100}):setTimeout(u,0)});for(let c=0;c<o.length;c+=s)await h(c)}function k(){document.querySelectorAll(`.${_}`).forEach(i=>{let t=i.parentNode;if(t){let n=document.createTextNode(i.textContent||"");t.replaceChild(n,i),t.normalize()}}),L.clear()}function ge(e){let i=L.get(e);if(!i||i.length===0){let t=document.querySelector(`[data-cg-id="${e}"]`);t&&le(t);return}le(i[0])}function le(e){e.scrollIntoView({behavior:"smooth",block:"center"}),e.classList.add(ce),setTimeout(()=>{e.classList.remove(ce)},2e3)}function ue(e){document.body.addEventListener("click",i=>{let t=i.target;if(t.classList.contains(_)){let n=t.dataset.cgId,a=t.dataset.cgCategory;n&&a&&e(n,a)}})}var f=null,l=null,Ie=`
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  .cg-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 360px;
    max-height: calc(100vh - 40px);
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.1);
    z-index: 2147483647;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.5;
    color: #1a1a1a;
  }

  .cg-panel.collapsed {
    max-height: none;
    height: auto;
  }

  .cg-panel.collapsed .cg-panel-body {
    display: none;
  }

  .cg-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    flex-shrink: 0;
  }

  .cg-header-left {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .cg-logo {
    font-size: 16px;
    font-weight: 700;
    letter-spacing: -0.3px;
  }

  .cg-risk-pill {
    padding: 3px 10px;
    border-radius: 12px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cg-risk-low {
    background: rgba(64, 192, 87, 0.9);
    color: white;
  }

  .cg-risk-medium {
    background: rgba(245, 159, 0, 0.9);
    color: white;
  }

  .cg-risk-high {
    background: rgba(224, 49, 49, 0.9);
    color: white;
  }

  .cg-header-right {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .cg-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: background 0.2s;
  }

  .cg-btn:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .cg-panel-body {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    flex: 1;
    min-height: 0;
  }

  .cg-summary {
    padding: 12px 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #e9ecef;
    flex-shrink: 0;
  }

  .cg-summary-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: #868e96;
    margin-bottom: 8px;
  }

  .cg-category-counts {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }

  .cg-category-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    font-size: 12px;
  }

  .cg-category-icon {
    font-size: 12px;
  }

  .cg-category-count {
    font-weight: 600;
    color: #495057;
  }

  .cg-excerpts {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  .cg-excerpt-item {
    padding: 10px 12px;
    background: #f8f9fa;
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    border-left: 3px solid transparent;
  }

  .cg-excerpt-item:hover {
    background: #e9ecef;
    transform: translateX(2px);
  }

  .cg-excerpt-item:last-child {
    margin-bottom: 0;
  }

  .cg-excerpt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }

  .cg-excerpt-category {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .cg-excerpt-severity {
    font-size: 10px;
    padding: 2px 6px;
    border-radius: 4px;
    font-weight: 600;
  }

  .cg-severity-critical {
    background: #c92a2a;
    color: white;
  }

  .cg-severity-high {
    background: #e03131;
    color: white;
  }

  .cg-severity-medium {
    background: #f59f00;
    color: white;
  }

  .cg-severity-low {
    background: #40c057;
    color: white;
  }

  .cg-excerpt-text {
    font-size: 12px;
    color: #495057;
    line-height: 1.6;
    word-break: break-word;
  }

  .cg-excerpt-match {
    background: rgba(255, 235, 59, 0.4);
    padding: 0 2px;
    border-radius: 2px;
    font-weight: 500;
  }

  .cg-progress {
    padding: 16px;
    text-align: center;
  }

  .cg-progress-bar {
    height: 4px;
    background: #e9ecef;
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
  }

  .cg-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #667eea, #764ba2);
    transition: width 0.3s ease;
  }

  .cg-progress-text {
    font-size: 12px;
    color: #868e96;
  }

  .cg-empty {
    padding: 24px 16px;
    text-align: center;
    color: #868e96;
  }

  .cg-empty-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  .cg-empty-text {
    font-size: 13px;
  }

  .cg-footer {
    padding: 10px 16px;
    background: #f8f9fa;
    border-top: 1px solid #e9ecef;
    font-size: 11px;
    color: #868e96;
    text-align: center;
    flex-shrink: 0;
  }

  .cg-score {
    font-weight: 600;
    color: #495057;
  }

  /* Scrollbar styling */
  .cg-excerpts::-webkit-scrollbar {
    width: 6px;
  }

  .cg-excerpts::-webkit-scrollbar-track {
    background: transparent;
  }

  .cg-excerpts::-webkit-scrollbar-thumb {
    background: #ced4da;
    border-radius: 3px;
  }

  .cg-excerpts::-webkit-scrollbar-thumb:hover {
    background: #adb5bd;
  }
`;function pe(){if(f)return;f=document.createElement("div"),f.id="clauseguard-root",l=f.attachShadow({mode:"closed"});let e=document.createElement("style");e.textContent=Ie,l.appendChild(e),document.documentElement.appendChild(f)}function Ne(e){return`cg-risk-${e}`}function Pe(e){return Object.entries(e).filter(([t,n])=>n>0).map(([t,n])=>`
        <div class="cg-category-badge">
          <span class="cg-category-icon">${$[t].icon}</span>
          <span class="cg-category-count">${n}</span>
        </div>
      `).join("")||'<span style="color: #868e96; font-size: 12px;">No issues found</span>'}function Ae(e){let i=q(e.excerpt),t=q(e.matchedText);return i.replace(new RegExp(t.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"),'<span class="cg-excerpt-match">$&</span>')}function _e(e,i,t=10){if(e.length===0)return`
      <div class="cg-empty">
        <div class="cg-empty-icon">\u2713</div>
        <div class="cg-empty-text">No risky clauses detected</div>
      </div>
    `;let n={critical:0,high:1,medium:2,low:3};return[...e].sort((s,o)=>{let p=n[s.severity]-n[o.severity];return p!==0?p:o.weight-s.weight}).slice(0,t).map(s=>{let o=$[s.category],p=Z[s.severity],h=i.highlightColors[s.category]||"#667eea";return`
        <div class="cg-excerpt-item" data-match-id="${s.id}" style="border-left-color: ${h};">
          <div class="cg-excerpt-header">
            <span class="cg-excerpt-category">
              ${o.icon} ${o.label}
            </span>
            <span class="cg-excerpt-severity cg-severity-${s.severity}">
              ${p.label}
            </span>
          </div>
          <div class="cg-excerpt-text">
            ${Ae(s)}
          </div>
        </div>
      `}).join("")}function He(e){return`
    <div class="cg-progress">
      <div class="cg-progress-bar">
        <div class="cg-progress-fill" style="width: ${e}%"></div>
      </div>
      <div class="cg-progress-text">Scanning... ${Math.round(e)}%</div>
    </div>
  `}function he(e,i,t=!1){let n=e?.riskLevel||"low",a=Ne(n);return`
    <div class="cg-panel" id="cg-panel-container">
      <div class="cg-header">
        <div class="cg-header-left">
          <span class="cg-logo">ClauseGuard</span>
          ${e?`<span class="cg-risk-pill ${a}">${n.toUpperCase()} RISK</span>`:""}
        </div>
        <div class="cg-header-right">
          <button class="cg-btn" id="cg-btn-rescan" title="Rescan">\u21BB</button>
          <button class="cg-btn" id="cg-btn-collapse" title="Collapse">\u2212</button>
          <button class="cg-btn" id="cg-btn-close" title="Close">\xD7</button>
        </div>
      </div>
      <div class="cg-panel-body">
        ${t?He(0):""}
        ${!t&&e?`
          <div class="cg-summary">
            <div class="cg-summary-title">Issues by Category</div>
            <div class="cg-category-counts">
              ${Pe(e.categoryCounts)}
            </div>
          </div>
          <div class="cg-excerpts" id="cg-excerpts-list">
            ${_e(e.matches,i)}
          </div>
          <div class="cg-footer">
            Risk Score: <span class="cg-score">${e.totalScore}</span> \u2022
            ${e.matches.length} issue${e.matches.length===1?"":"s"} found
          </div>
        `:""}
        ${!t&&!e?`
          <div class="cg-empty">
            <div class="cg-empty-icon">\u{1F50D}</div>
            <div class="cg-empty-text">Click rescan to analyze this page</div>
          </div>
        `:""}
      </div>
    </div>
  `}function j(e,i,t){if(pe(),!l)return;let n=l.querySelector("style");l.innerHTML="",n&&l.appendChild(n);let a=document.createElement("div");a.innerHTML=he(e,i),l.appendChild(a);let s=l.getElementById("cg-btn-close"),o=l.getElementById("cg-btn-collapse"),p=l.getElementById("cg-btn-rescan"),h=l.getElementById("cg-excerpts-list"),c=l.getElementById("cg-panel-container");s?.addEventListener("click",()=>{W(),t.onClose()}),o?.addEventListener("click",()=>{c?.classList.toggle("collapsed"),o&&(o.textContent=c?.classList.contains("collapsed")?"+":"\u2212")}),p?.addEventListener("click",()=>{t.onRescan()}),h?.addEventListener("click",g=>{let x=g.target.closest(".cg-excerpt-item");if(x){let b=x.dataset.matchId;b&&ge(b)}})}function F(e){if(!l)return;let i=l.querySelector(".cg-progress-fill"),t=l.querySelector(".cg-progress-text");i&&(i.style.width=`${e}%`),t&&(t.textContent=`Scanning... ${Math.round(e)}%`)}function me(e){if(pe(),!l)return;let i=l.querySelector("style");l.innerHTML="",i&&l.appendChild(i);let t=document.createElement("div");t.innerHTML=he(null,e,!0),l.appendChild(t)}function W(){f&&(f.remove(),f=null,l=null)}function ye(){return f!==null&&document.documentElement.contains(f)}function fe(e){if(!l)return;let i=l.querySelector(`[data-match-id="${e}"]`);i&&(i.scrollIntoView({behavior:"smooth",block:"center"}),i.style.background="#dee2e6",setTimeout(()=>{i.style.background=""},1500))}var d=v,M=null,H=!1,be=!1;async function Oe(e=!1){let i=performance.now(),t=window.location.href,n=document.title,a=document.querySelector("h1")?.textContent||"",s=N(t),o=T(t,n,a);if(d.domainOverrides[s]===!1||A(s,d.denylist)||!e&&d.onlyLegalPages&&!o&&!P(s,d.allowlist))return Y(t,n,o,i);let h=B(d.skipElements),c=h.length,g=[],u=new Map,x=5,b=50,C=0,O=async y=>new Promise(U=>{let K=()=>{let we=Math.min(y+b,c);for(let I=y;I<we;I++){let G=h[I].textContent||"";if(!(G.length<10)){for(let m of ee){if((u.get(m.id)||0)>=x)continue;m.pattern.lastIndex=0;let E;for(;(E=m.pattern.exec(G))!==null;){let J=u.get(m.id)||0;if(J>=x)break;let Se=se(),D=E.index,X=D+E[0].length,Ee={id:Se,patternId:m.id,category:m.category,severity:m.severity,weight:m.weight,excerpt:ae(G,D,X),matchedText:E[0],startOffset:D,endOffset:X,textNodeIndex:I,highlighted:!1,description:m.description};g.push(Ee),u.set(m.id,J+1),E[0].length===0&&m.pattern.lastIndex++}}C++}}let Ce=C/c*100;F(Ce),U()};"requestIdleCallback"in window?requestIdleCallback(K,{timeout:50}):setTimeout(K,0)});for(let y=0;y<c;y+=b)await O(y);let w={arbitration:0,"auto-renew":0,"data-sharing":0,"data-retention":0,"unilateral-changes":0,liability:0,"governing-law":0};for(let y of g)w[y.category]++;let S=g.reduce((y,U)=>y+U.weight,0),ve=re(S,g,d.sensitivity);return{pageUrl:t,pageTitle:n,timestamp:Date.now(),isLegalPage:o,riskLevel:ve,totalScore:S,matches:g,categoryCounts:w,scanDurationMs:performance.now()-i}}function Y(e,i,t,n){return{pageUrl:e,pageTitle:i,timestamp:Date.now(),isLegalPage:t,riskLevel:"low",totalScore:0,matches:[],categoryCounts:{arbitration:0,"auto-renew":0,"data-sharing":0,"data-retention":0,"unilateral-changes":0,liability:0,"governing-law":0},scanDurationMs:performance.now()-n}}async function R(e=!1){if(!H){H=!0,me(d),k();try{let i=await Oe(e);M=i;let t=B(d.skipElements);i.matches.length>0&&await de(i.matches,t,d,(n,a)=>{F(50+n/a*50)}),j(i,d,{onRescan:()=>R(!0),onClose:()=>{k()}}),chrome.runtime.sendMessage({type:"SCAN_COMPLETE",payload:i})}catch(i){console.error("ClauseGuard: Scan error:",i)}finally{H=!1}}}function Ue(e,i){ye()||j(M,d,{onRescan:()=>R(!0),onClose:()=>{k()}}),fe(e)}function Ge(e,i,t){switch(e.type){case"SCAN_NOW":return R(!0).then(()=>{t({success:!0,result:M})}),!0;case"GET_STATUS":return t({success:!0,data:{isScanning:H,lastScanResult:M,isLegalPage:T(window.location.href,document.title,document.querySelector("h1")?.textContent||"")}}),!1;default:return!1}}var V=oe(async()=>{if(d=await z(),!d.enabled)return;let e=N(window.location.href);if(d.domainOverrides[e]===!1||A(e,d.denylist))return;(T(window.location.href,document.title,document.querySelector("h1")?.textContent||"")||!d.onlyLegalPages||P(e,d.allowlist))&&(k(),W(),M=null,await R(!1))},500);async function xe(){if(be)return;if(be=!0,d=await z(),!d.enabled){console.log("ClauseGuard: Extension disabled");return}ue(Ue),chrome.runtime.onMessage.addListener(Ge),window.addEventListener("popstate",V);let e=history.pushState,i=history.replaceState;history.pushState=function(...s){e.apply(this,s),V()},history.replaceState=function(...s){i.apply(this,s),V()};let t=N(window.location.href);if(d.domainOverrides[t]===!1){console.log("ClauseGuard: Domain disabled");return}if(A(t,d.denylist)){console.log("ClauseGuard: Domain denylisted");return}let a=T(window.location.href,document.title,document.querySelector("h1")?.textContent||"");(a||!d.onlyLegalPages||P(t,d.allowlist))&&setTimeout(()=>R(!1),500),console.log("ClauseGuard: Initialized",{isLegal:a,domain:t})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",xe):xe();})();
