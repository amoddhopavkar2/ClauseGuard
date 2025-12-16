"use strict";(()=>{var v={enabled:!0,onlyLegalPages:!0,sensitivity:"normal",theme:"system",highlightColors:{arbitration:"#ff6b6b","auto-renew":"#ffa94d","data-sharing":"#ff8787","data-retention":"#ffd43b","unilateral-changes":"#69db7c",liability:"#74c0fc","governing-law":"#b197fc"},allowlist:[],denylist:[],domainOverrides:{},skipElements:["script","style","noscript","textarea","input","code","pre","svg"]},Z={strict:{high:15,medium:8},normal:{high:25,medium:12},lenient:{high:40,medium:20}},$={arbitration:{label:"Arbitration / Waiver",icon:"\u2696\uFE0F"},"auto-renew":{label:"Auto-Renewal / Billing",icon:"\u{1F4B3}"},"data-sharing":{label:"Data Sharing",icon:"\u{1F4E4}"},"data-retention":{label:"Data Retention",icon:"\u{1F4BE}"},"unilateral-changes":{label:"Unilateral Changes",icon:"\u{1F4DD}"},liability:{label:"Liability Limits",icon:"\u{1F6E1}\uFE0F"},"governing-law":{label:"Governing Law",icon:"\u{1F3DB}\uFE0F"}},ee={critical:{label:"Critical",color:"#c92a2a"},high:{label:"High",color:"#e03131"},medium:{label:"Medium",color:"#f59f00"},low:{label:"Low",color:"#40c057"}};var n=e=>new RegExp(e,"gi"),te=[{id:"arb-binding",category:"arbitration",pattern:n("binding\\s+arbitration"),severity:"critical",weight:10,description:"Requires disputes to be resolved through binding arbitration",critical:!0},{id:"arb-class-action",category:"arbitration",pattern:n("class\\s+action\\s+waiver"),severity:"critical",weight:10,description:"Waives your right to participate in class action lawsuits",critical:!0},{id:"arb-waive-right",category:"arbitration",pattern:n("waive\\s+(your|the)\\s+right\\s+to"),severity:"high",weight:8,description:"Requires you to waive certain legal rights"},{id:"arb-jury-waive",category:"arbitration",pattern:n("jury\\s+trial[^.]*waive|waive[^.]*jury\\s+trial"),severity:"critical",weight:9,description:"Waives your right to a jury trial",critical:!0},{id:"arb-no-class",category:"arbitration",pattern:n("(may\\s+not|cannot|shall\\s+not)\\s+(bring|file|pursue)[^.]*class\\s+action"),severity:"high",weight:8,description:"Prohibits bringing class action lawsuits"},{id:"arb-aaa",category:"arbitration",pattern:n("(AAA|American\\s+Arbitration\\s+Association)"),severity:"high",weight:6,description:"References American Arbitration Association rules"},{id:"arb-jams",category:"arbitration",pattern:n("\\bJAMS\\b"),severity:"high",weight:6,description:"References JAMS arbitration services"},{id:"arb-individual-basis",category:"arbitration",pattern:n("on\\s+an?\\s+individual\\s+basis\\s+only"),severity:"high",weight:7,description:"Requires claims to be brought individually, not as a group"},{id:"auto-renew-auto",category:"auto-renew",pattern:n("automatically\\s+renew"),severity:"high",weight:7,description:"Service automatically renews"},{id:"auto-renew-pattern",category:"auto-renew",pattern:n("auto-?renew(al|s|ed)?"),severity:"high",weight:7,description:"Auto-renewal clause"},{id:"auto-recurring",category:"auto-renew",pattern:n("recurring\\s+(billing|charge|payment)"),severity:"high",weight:6,description:"Recurring billing or charges"},{id:"auto-trial-convert",category:"auto-renew",pattern:n("(trial|free)[^.]{0,50}convert(s)?\\s+(to|into)\\s+(a\\s+)?(paid|subscription)"),severity:"high",weight:8,description:"Trial converts to paid subscription"},{id:"auto-cancel-before",category:"auto-renew",pattern:n("cancel[^.]{0,30}before[^.]{0,30}renewal"),severity:"medium",weight:5,description:"Must cancel before renewal date"},{id:"auto-charged-until",category:"auto-renew",pattern:n("(will\\s+be|are)\\s+charged[^.]{0,50}until\\s+(you\\s+)?cancel"),severity:"high",weight:6,description:"Charges continue until you cancel"},{id:"auto-no-refund",category:"auto-renew",pattern:n("no\\s+refunds?\\s+(will\\s+be\\s+)?(provided|given|issued)"),severity:"medium",weight:5,description:"No refunds policy"},{id:"data-share-third",category:"data-sharing",pattern:n("share[^.]{0,50}(with\\s+)?(third\\s+part(y|ies)|partners?|affiliates?)"),severity:"high",weight:7,description:"Shares data with third parties, partners, or affiliates"},{id:"data-sell-personal",category:"data-sharing",pattern:n("sell[^.]{0,30}(personal\\s+(information|data)|your\\s+(data|information))"),severity:"critical",weight:10,description:"May sell your personal information",critical:!0},{id:"data-advertising",category:"data-sharing",pattern:n("(advertising|ad)\\s+partners"),severity:"high",weight:6,description:"Shares data with advertising partners"},{id:"data-analytics",category:"data-sharing",pattern:n("analytics\\s+providers"),severity:"medium",weight:4,description:"Shares data with analytics providers"},{id:"data-disclose",category:"data-sharing",pattern:n("(may|will)\\s+disclose[^.]{0,50}(to\\s+)?(third\\s+part|government|law\\s+enforcement)"),severity:"medium",weight:5,description:"May disclose data to third parties or authorities"},{id:"data-transfer",category:"data-sharing",pattern:n("transfer[^.]{0,30}(your\\s+)?(personal\\s+)?(data|information)[^.]{0,30}(to|outside)"),severity:"medium",weight:5,description:"May transfer your data"},{id:"data-marketing",category:"data-sharing",pattern:n("(use|share)[^.]{0,30}(your\\s+)?(data|information)[^.]{0,30}marketing"),severity:"high",weight:6,description:"Uses your data for marketing purposes"},{id:"ret-long",category:"data-retention",pattern:n("retain[^.]{0,50}as\\s+long\\s+as"),severity:"medium",weight:5,description:"May retain data for extended periods"},{id:"ret-indefinitely",category:"data-retention",pattern:n("(retain|store|keep)[^.]{0,30}indefinitely"),severity:"high",weight:7,description:"May retain data indefinitely"},{id:"ret-legal-business",category:"data-retention",pattern:n("for\\s+(legal|business|regulatory)\\s+purposes"),severity:"low",weight:3,description:"Retains data for legal or business purposes"},{id:"ret-continue-store",category:"data-retention",pattern:n("(may|will)\\s+continue\\s+to\\s+store"),severity:"medium",weight:5,description:"May continue storing data after account closure"},{id:"ret-after-deletion",category:"data-retention",pattern:n("(after|even\\s+if)[^.]{0,30}(delet|terminat|clos)[^.]{0,30}(retain|keep|store)"),severity:"high",weight:6,description:"May retain data even after you request deletion"},{id:"ret-backup",category:"data-retention",pattern:n("(backup|archive)[^.]{0,30}(copies|data)[^.]{0,30}(may|will|could)\\s+(remain|persist)"),severity:"medium",weight:4,description:"Backup copies may persist after deletion"},{id:"change-anytime",category:"unilateral-changes",pattern:n("(we\\s+)?(may|can|reserve\\s+the\\s+right\\s+to)\\s+(modify|change|update|amend)[^.]{0,30}at\\s+any\\s+time"),severity:"medium",weight:5,description:"Terms may be changed at any time"},{id:"change-without-notice",category:"unilateral-changes",pattern:n("without\\s+(prior\\s+)?notice"),severity:"high",weight:6,description:"Changes may be made without notice"},{id:"change-continued-use",category:"unilateral-changes",pattern:n("continued\\s+use[^.]{0,50}(constitutes|means|indicates)\\s+(acceptance|agreement)"),severity:"medium",weight:5,description:"Continued use means you accept changes"},{id:"change-sole-discretion",category:"unilateral-changes",pattern:n("(in\\s+)?(our|its)\\s+sole\\s+(and\\s+absolute\\s+)?discretion"),severity:"medium",weight:4,description:"Company can make decisions at sole discretion"},{id:"change-terminate",category:"unilateral-changes",pattern:n("(may|can|reserve[^.]{0,20}right[^.]{0,10})\\s+terminat[^.]{0,30}(at\\s+any\\s+time|without\\s+(cause|reason))"),severity:"high",weight:6,description:"Service may be terminated at any time without cause"},{id:"liab-maximum",category:"liability",pattern:n("to\\s+the\\s+(maximum|fullest)\\s+extent\\s+permitted"),severity:"medium",weight:4,description:"Limits liability to maximum extent permitted by law"},{id:"liab-limitation",category:"liability",pattern:n("limitation\\s+of\\s+liability"),severity:"medium",weight:4,description:"Liability limitation clause"},{id:"liab-not-liable",category:"liability",pattern:n("(shall\\s+)?not\\s+(be\\s+)?(liable|responsible)\\s+for"),severity:"medium",weight:4,description:"Disclaims liability for certain issues"},{id:"liab-damages",category:"liability",pattern:n("(consequential|incidental|punitive|indirect|special)\\s+damages"),severity:"medium",weight:4,description:"Excludes certain types of damages"},{id:"liab-warranty",category:"liability",pattern:n("(disclaim|exclude)[^.]{0,30}warrant(y|ies)"),severity:"medium",weight:4,description:"Disclaims warranties"},{id:"liab-as-is",category:"liability",pattern:n('"?as\\s+is"?\\s+(and\\s+"?as\\s+available"?)?\\s+basis'),severity:"low",weight:3,description:'Service provided "as is" without guarantees'},{id:"liab-indemnify",category:"liability",pattern:n("(you\\s+)?(agree\\s+to\\s+)?indemnify[^.]{0,50}(us|company|service)"),severity:"medium",weight:5,description:"Requires you to indemnify the company"},{id:"gov-laws",category:"governing-law",pattern:n("governed\\s+by\\s+the\\s+laws\\s+of"),severity:"low",weight:2,description:"Specifies governing law jurisdiction"},{id:"gov-exclusive",category:"governing-law",pattern:n("exclusive\\s+(jurisdiction|venue)"),severity:"medium",weight:4,description:"Requires disputes in specific jurisdiction"},{id:"gov-venue",category:"governing-law",pattern:n("venue[^.]{0,30}shall\\s+be"),severity:"low",weight:3,description:"Specifies legal venue"},{id:"gov-waive-venue",category:"governing-law",pattern:n("waive[^.]{0,30}(objection|right)[^.]{0,30}venue"),severity:"medium",weight:5,description:"Waives right to object to venue"}];var re=["terms","tos","privacy","policy","legal","agreement","conditions","cookies","data-processing","gdpr","ccpa","eula","disclaimer","notices"],ie=["terms","privacy","policy","agreement","legal","conditions","notice","disclaimer","cookie","data protection"];async function z(){try{let e=await chrome.storage.sync.get("settings");if(e.settings)return{...v,...e.settings};let t=await chrome.storage.local.get("settings");return t.settings?{...v,...t.settings}:v}catch(e){return console.error("ClauseGuard: Error loading settings:",e),v}}function ke(e){let t=e.toLowerCase();return re.some(r=>t.includes(r))}function Me(e,t){let r=e.toLowerCase(),i=t?.toLowerCase()||"";return ie.some(a=>r.includes(a)||i.includes(a))}function T(e,t,r){return ke(e)||Me(t,r)}function N(e){try{return new URL(e).hostname}catch{return""}}function ne(e,t){if(t.startsWith("*.")){let r=t.slice(2);return e===r||e.endsWith("."+r)}return e===t}function P(e,t){return t.some(r=>ne(e,r))}function A(e,t){return t.some(r=>ne(e,r))}function ae(e,t,r){let i=Z[r],a=t.some(s=>s.severity==="critical");return e>=i.high||a?"high":e>=i.medium?"medium":"low"}function se(e,t,r,i=320){let a=r-t,s=Math.max(0,i-a),o=Math.floor(s/2),p=s-o,h=Math.max(0,t-o),c=Math.min(e.length,r+p);if(h>0){let u=e.lastIndexOf(" ",h+20);u>h-30&&u>0&&(h=u+1)}if(c<e.length){let u=e.indexOf(" ",c-20);u!==-1&&u<c+30&&(c=u)}let d=e.slice(h,c);return h>0&&(d="..."+d),c<e.length&&(d=d+"..."),d}function oe(){return"cg-"+Math.random().toString(36).slice(2,11)}function ce(e,t){let r=null;return function(...i){r&&clearTimeout(r),r=setTimeout(()=>{e(...i)},t)}}function q(e){let t=document.createElement("div");return t.textContent=e,t.innerHTML}var _="cg-highlight",le="cg-highlight-active",L=new Map;function Re(e,t){let r=document.createElement("mark");return r.className=`${_} cg-cat-${e.category}`,r.dataset.cgId=e.id,r.dataset.cgCategory=e.category,r.style.backgroundColor=t.highlightColors[e.category]||"#ffff00",r.style.color="inherit",r.style.padding="0 2px",r.style.borderRadius="2px",r.style.cursor="pointer",r}function Ie(e,t){let r=e;for(;r&&r!==document.body;){if(r.nodeType===Node.ELEMENT_NODE){let i=r,a=i.tagName.toLowerCase();if(t.includes(a)||i.hidden||i.style.display==="none"||i.id==="clauseguard-panel"||i.classList.contains(_)||i.shadowRoot&&i.id==="clauseguard-root")return!0}r=r.parentNode}return!1}function B(e){let t=[],r=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT,{acceptNode:a=>!a.textContent||!a.textContent.trim()||Ie(a,e)?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}),i;for(;i=r.nextNode();)t.push(i);return t}function Ne(e,t,r){let i=e.textContent||"",a=t.startOffset,s=t.endOffset;if(a<0||s>i.length||a>=s)return console.warn("ClauseGuard: Invalid match offsets",{matchStart:a,matchEnd:s,textLength:i.length}),null;try{let o=document.createRange();o.setStart(e,a),o.setEnd(e,s);let p=Re(t,r);return o.surroundContents(p),L.has(t.id)||L.set(t.id,[]),L.get(t.id).push(p),p}catch(o){return console.warn("ClauseGuard: Could not highlight match:",o),null}}async function de(e,t,r,i){let a=new Map;for(let c of e)a.has(c.textNodeIndex)||a.set(c.textNodeIndex,[]),a.get(c.textNodeIndex).push(c);for(let c of a.values())c.sort((d,u)=>u.startOffset-d.startOffset);let s=10,o=Array.from(a.keys()).sort((c,d)=>d-c),p=0,h=c=>new Promise(d=>{let u=()=>{let x=Math.min(c+s,o.length);for(let b=c;b<x;b++){let S=o[b],O=a.get(S),w=t[S];if(!(!w||!w.parentNode)){for(let C of O)Ne(w,C,r),C.highlighted=!0;p++}}i&&i(p,o.length),d()};"requestIdleCallback"in window?requestIdleCallback(u,{timeout:100}):setTimeout(u,0)});for(let c=0;c<o.length;c+=s)await h(c)}function k(){document.querySelectorAll(`.${_}`).forEach(t=>{let r=t.parentNode;if(r){let i=document.createTextNode(t.textContent||"");r.replaceChild(i,t),r.normalize()}}),L.clear()}function ue(e){let t=L.get(e);if(!t||t.length===0){let r=document.querySelector(`[data-cg-id="${e}"]`);r&&ge(r);return}ge(t[0])}function ge(e){e.scrollIntoView({behavior:"smooth",block:"center"}),e.classList.add(le),setTimeout(()=>{e.classList.remove(le)},2e3)}function pe(e){document.body.addEventListener("click",t=>{let r=t.target;if(r.classList.contains(_)){let i=r.dataset.cgId,a=r.dataset.cgCategory;i&&a&&e(i,a)}})}var f=null,l=null,he="system",j=null,Pe=`
  :host {
    all: initial;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
  }

  * {
    box-sizing: border-box;
  }

  /* CSS Variables - Light Theme (default) */
  .cg-panel {
    --cg-bg-primary: #ffffff;
    --cg-bg-secondary: #f8f9fa;
    --cg-bg-tertiary: #e9ecef;
    --cg-bg-hover: #dee2e6;
    --cg-text-primary: #1a1a1a;
    --cg-text-secondary: #495057;
    --cg-text-muted: #868e96;
    --cg-border: #e9ecef;
    --cg-shadow: rgba(0, 0, 0, 0.15);
    --cg-shadow-light: rgba(0, 0, 0, 0.1);
    --cg-excerpt-match-bg: rgba(255, 235, 59, 0.4);
    --cg-scrollbar-thumb: #ced4da;
    --cg-scrollbar-thumb-hover: #adb5bd;
  }

  /* Dark Theme */
  .cg-panel[data-cg-theme="dark"] {
    --cg-bg-primary: #1e1e1e;
    --cg-bg-secondary: #252526;
    --cg-bg-tertiary: #333333;
    --cg-bg-hover: #3c3c3c;
    --cg-text-primary: #e4e4e4;
    --cg-text-secondary: #cccccc;
    --cg-text-muted: #9d9d9d;
    --cg-border: #404040;
    --cg-shadow: rgba(0, 0, 0, 0.4);
    --cg-shadow-light: rgba(0, 0, 0, 0.3);
    --cg-excerpt-match-bg: rgba(255, 235, 59, 0.25);
    --cg-scrollbar-thumb: #555555;
    --cg-scrollbar-thumb-hover: #666666;
  }

  /* System Theme - uses prefers-color-scheme */
  @media (prefers-color-scheme: dark) {
    .cg-panel[data-cg-theme="system"] {
      --cg-bg-primary: #1e1e1e;
      --cg-bg-secondary: #252526;
      --cg-bg-tertiary: #333333;
      --cg-bg-hover: #3c3c3c;
      --cg-text-primary: #e4e4e4;
      --cg-text-secondary: #cccccc;
      --cg-text-muted: #9d9d9d;
      --cg-border: #404040;
      --cg-shadow: rgba(0, 0, 0, 0.4);
      --cg-shadow-light: rgba(0, 0, 0, 0.3);
      --cg-excerpt-match-bg: rgba(255, 235, 59, 0.25);
      --cg-scrollbar-thumb: #555555;
      --cg-scrollbar-thumb-hover: #666666;
    }
  }

  .cg-panel {
    position: fixed;
    top: 20px;
    right: 20px;
    width: 360px;
    max-height: calc(100vh - 40px);
    background: var(--cg-bg-primary);
    border-radius: 12px;
    box-shadow: 0 8px 32px var(--cg-shadow), 0 2px 8px var(--cg-shadow-light);
    z-index: 2147483647;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-size: 14px;
    line-height: 1.5;
    color: var(--cg-text-primary);
    border: 1px solid var(--cg-border);
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
    background: var(--cg-bg-secondary);
    border-bottom: 1px solid var(--cg-border);
    flex-shrink: 0;
  }

  .cg-summary-title {
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: var(--cg-text-muted);
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
    background: var(--cg-bg-primary);
    border: 1px solid var(--cg-border);
    border-radius: 6px;
    font-size: 12px;
  }

  .cg-category-icon {
    font-size: 12px;
  }

  .cg-category-count {
    font-weight: 600;
    color: var(--cg-text-secondary);
  }

  .cg-excerpts {
    flex: 1;
    overflow-y: auto;
    padding: 8px;
  }

  .cg-excerpt-item {
    padding: 10px 12px;
    background: var(--cg-bg-secondary);
    border-radius: 8px;
    margin-bottom: 8px;
    cursor: pointer;
    transition: background 0.2s, transform 0.1s;
    border-left: 3px solid transparent;
  }

  .cg-excerpt-item:hover {
    background: var(--cg-bg-tertiary);
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
    color: var(--cg-text-secondary);
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
    color: var(--cg-text-secondary);
    line-height: 1.6;
    word-break: break-word;
  }

  .cg-excerpt-match {
    background: var(--cg-excerpt-match-bg);
    padding: 0 2px;
    border-radius: 2px;
    font-weight: 500;
    color: var(--cg-text-primary);
  }

  .cg-progress {
    padding: 16px;
    text-align: center;
  }

  .cg-progress-bar {
    height: 4px;
    background: var(--cg-bg-tertiary);
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
    color: var(--cg-text-muted);
  }

  .cg-empty {
    padding: 24px 16px;
    text-align: center;
    color: var(--cg-text-muted);
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
    background: var(--cg-bg-secondary);
    border-top: 1px solid var(--cg-border);
    font-size: 11px;
    color: var(--cg-text-muted);
    text-align: center;
    flex-shrink: 0;
  }

  .cg-score {
    font-weight: 600;
    color: var(--cg-text-secondary);
  }

  /* Scrollbar styling */
  .cg-excerpts::-webkit-scrollbar {
    width: 6px;
  }

  .cg-excerpts::-webkit-scrollbar-track {
    background: transparent;
  }

  .cg-excerpts::-webkit-scrollbar-thumb {
    background: var(--cg-scrollbar-thumb);
    border-radius: 3px;
  }

  .cg-excerpts::-webkit-scrollbar-thumb:hover {
    background: var(--cg-scrollbar-thumb-hover);
  }
`;function me(){if(f)return;f=document.createElement("div"),f.id="clauseguard-root",l=f.attachShadow({mode:"closed"});let e=document.createElement("style");e.textContent=Pe,l.appendChild(e),document.documentElement.appendChild(f)}function Ae(e){return`cg-risk-${e}`}function _e(e){return Object.entries(e).filter(([r,i])=>i>0).map(([r,i])=>`
        <div class="cg-category-badge">
          <span class="cg-category-icon">${$[r].icon}</span>
          <span class="cg-category-count">${i}</span>
        </div>
      `).join("")||'<span style="font-size: 12px;">No issues found</span>'}function He(e){let t=q(e.excerpt),r=q(e.matchedText);return t.replace(new RegExp(r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi"),'<span class="cg-excerpt-match">$&</span>')}function Oe(e,t,r=10){if(e.length===0)return`
      <div class="cg-empty">
        <div class="cg-empty-icon">\u2713</div>
        <div class="cg-empty-text">No risky clauses detected</div>
      </div>
    `;let i={critical:0,high:1,medium:2,low:3};return[...e].sort((s,o)=>{let p=i[s.severity]-i[o.severity];return p!==0?p:o.weight-s.weight}).slice(0,r).map(s=>{let o=$[s.category],p=ee[s.severity],h=t.highlightColors[s.category]||"#667eea";return`
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
            ${He(s)}
          </div>
        </div>
      `}).join("")}function Ue(e){return`
    <div class="cg-progress">
      <div class="cg-progress-bar">
        <div class="cg-progress-fill" style="width: ${e}%"></div>
      </div>
      <div class="cg-progress-text">Scanning... ${Math.round(e)}%</div>
    </div>
  `}function ye(e,t,r=!1){let i=e?.riskLevel||"low",a=Ae(i);return`
    <div class="cg-panel" id="cg-panel-container" data-cg-theme="${t.theme}">
      <div class="cg-header">
        <div class="cg-header-left">
          <span class="cg-logo">ClauseGuard</span>
          ${e?`<span class="cg-risk-pill ${a}">${i.toUpperCase()} RISK</span>`:""}
        </div>
        <div class="cg-header-right">
          <button class="cg-btn" id="cg-btn-rescan" title="Rescan">\u21BB</button>
          <button class="cg-btn" id="cg-btn-collapse" title="Collapse">\u2212</button>
          <button class="cg-btn" id="cg-btn-close" title="Close">\xD7</button>
        </div>
      </div>
      <div class="cg-panel-body">
        ${r?Ue(0):""}
        ${!r&&e?`
          <div class="cg-summary">
            <div class="cg-summary-title">Issues by Category</div>
            <div class="cg-category-counts">
              ${_e(e.categoryCounts)}
            </div>
          </div>
          <div class="cg-excerpts" id="cg-excerpts-list">
            ${Oe(e.matches,t)}
          </div>
          <div class="cg-footer">
            Risk Score: <span class="cg-score">${e.totalScore}</span> \u2022
            ${e.matches.length} issue${e.matches.length===1?"":"s"} found
          </div>
        `:""}
        ${!r&&!e?`
          <div class="cg-empty">
            <div class="cg-empty-icon">\u{1F50D}</div>
            <div class="cg-empty-text">Click rescan to analyze this page</div>
          </div>
        `:""}
      </div>
    </div>
  `}function Ge(){j||(j=window.matchMedia("(prefers-color-scheme: dark)"),j.addEventListener("change",()=>{}))}function F(e,t,r){if(me(),!l)return;he=t.theme,Ge();let i=l.querySelector("style");l.innerHTML="",i&&l.appendChild(i);let a=document.createElement("div");a.innerHTML=ye(e,t),l.appendChild(a);let s=l.getElementById("cg-btn-close"),o=l.getElementById("cg-btn-collapse"),p=l.getElementById("cg-btn-rescan"),h=l.getElementById("cg-excerpts-list"),c=l.getElementById("cg-panel-container");s?.addEventListener("click",()=>{Y(),r.onClose()}),o?.addEventListener("click",()=>{c?.classList.toggle("collapsed"),o&&(o.textContent=c?.classList.contains("collapsed")?"+":"\u2212")}),p?.addEventListener("click",()=>{r.onRescan()}),h?.addEventListener("click",d=>{let x=d.target.closest(".cg-excerpt-item");if(x){let b=x.dataset.matchId;b&&ue(b)}})}function W(e){if(!l)return;let t=l.querySelector(".cg-progress-fill"),r=l.querySelector(".cg-progress-text");t&&(t.style.width=`${e}%`),r&&(r.textContent=`Scanning... ${Math.round(e)}%`)}function fe(e){if(me(),!l)return;he=e.theme;let t=l.querySelector("style");l.innerHTML="",t&&l.appendChild(t);let r=document.createElement("div");r.innerHTML=ye(null,e,!0),l.appendChild(r)}function Y(){f&&(f.remove(),f=null,l=null)}function be(){return f!==null&&document.documentElement.contains(f)}function xe(e){if(!l)return;let t=l.querySelector(`[data-match-id="${e}"]`);t&&(t.scrollIntoView({behavior:"smooth",block:"center"}),t.style.background="var(--cg-bg-hover)",setTimeout(()=>{t.style.background=""},1500))}var g=v,M=null,H=!1,ve=!1;async function De(e=!1){let t=performance.now(),r=window.location.href,i=document.title,a=document.querySelector("h1")?.textContent||"",s=N(r),o=T(r,i,a);if(g.domainOverrides[s]===!1||A(s,g.denylist)||!e&&g.onlyLegalPages&&!o&&!P(s,g.allowlist))return V(r,i,o,t);let h=B(g.skipElements),c=h.length,d=[],u=new Map,x=5,b=50,S=0,O=async y=>new Promise(U=>{let J=()=>{let Ce=Math.min(y+b,c);for(let I=y;I<Ce;I++){let G=h[I].textContent||"";if(!(G.length<10)){for(let m of te){if((u.get(m.id)||0)>=x)continue;m.pattern.lastIndex=0;let E;for(;(E=m.pattern.exec(G))!==null;){let Q=u.get(m.id)||0;if(Q>=x)break;let Te=oe(),D=E.index,X=D+E[0].length,Le={id:Te,patternId:m.id,category:m.category,severity:m.severity,weight:m.weight,excerpt:se(G,D,X),matchedText:E[0],startOffset:D,endOffset:X,textNodeIndex:I,highlighted:!1,description:m.description};d.push(Le),u.set(m.id,Q+1),E[0].length===0&&m.pattern.lastIndex++}}S++}}let Ee=S/c*100;W(Ee),U()};"requestIdleCallback"in window?requestIdleCallback(J,{timeout:50}):setTimeout(J,0)});for(let y=0;y<c;y+=b)await O(y);let w={arbitration:0,"auto-renew":0,"data-sharing":0,"data-retention":0,"unilateral-changes":0,liability:0,"governing-law":0};for(let y of d)w[y.category]++;let C=d.reduce((y,U)=>y+U.weight,0),Se=ae(C,d,g.sensitivity);return{pageUrl:r,pageTitle:i,timestamp:Date.now(),isLegalPage:o,riskLevel:Se,totalScore:C,matches:d,categoryCounts:w,scanDurationMs:performance.now()-t}}function V(e,t,r,i){return{pageUrl:e,pageTitle:t,timestamp:Date.now(),isLegalPage:r,riskLevel:"low",totalScore:0,matches:[],categoryCounts:{arbitration:0,"auto-renew":0,"data-sharing":0,"data-retention":0,"unilateral-changes":0,liability:0,"governing-law":0},scanDurationMs:performance.now()-i}}async function R(e=!1){if(!H){H=!0,fe(g),k();try{let t=await De(e);M=t;let r=B(g.skipElements);t.matches.length>0&&await de(t.matches,r,g,(i,a)=>{W(50+i/a*50)}),F(t,g,{onRescan:()=>R(!0),onClose:()=>{k()}}),chrome.runtime.sendMessage({type:"SCAN_COMPLETE",payload:t})}catch(t){console.error("ClauseGuard: Scan error:",t)}finally{H=!1}}}function $e(e,t){be()||F(M,g,{onRescan:()=>R(!0),onClose:()=>{k()}}),xe(e)}function ze(e,t,r){switch(e.type){case"SCAN_NOW":return R(!0).then(()=>{r({success:!0,result:M})}),!0;case"GET_STATUS":return r({success:!0,data:{isScanning:H,lastScanResult:M,isLegalPage:T(window.location.href,document.title,document.querySelector("h1")?.textContent||"")}}),!1;default:return!1}}var K=ce(async()=>{if(g=await z(),!g.enabled)return;let e=N(window.location.href);if(g.domainOverrides[e]===!1||A(e,g.denylist))return;(T(window.location.href,document.title,document.querySelector("h1")?.textContent||"")||!g.onlyLegalPages||P(e,g.allowlist))&&(k(),Y(),M=null,await R(!1))},500);async function we(){if(ve)return;if(ve=!0,g=await z(),!g.enabled){console.log("ClauseGuard: Extension disabled");return}pe($e),chrome.runtime.onMessage.addListener(ze),window.addEventListener("popstate",K);let e=history.pushState,t=history.replaceState;history.pushState=function(...s){e.apply(this,s),K()},history.replaceState=function(...s){t.apply(this,s),K()};let r=N(window.location.href);if(g.domainOverrides[r]===!1){console.log("ClauseGuard: Domain disabled");return}if(A(r,g.denylist)){console.log("ClauseGuard: Domain denylisted");return}let a=T(window.location.href,document.title,document.querySelector("h1")?.textContent||"");(a||!g.onlyLegalPages||P(r,g.allowlist))&&setTimeout(()=>R(!1),500),console.log("ClauseGuard: Initialized",{isLegal:a,domain:r})}document.readyState==="loading"?document.addEventListener("DOMContentLoaded",we):we();})();
