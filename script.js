(function(){
  "use strict";
  const $=id=>document.getElementById(id);
  const feed=$("feed"), sentinel=$("sentinel"), position=$("position");
  const searchPanel=$("searchPanel"), searchInput=$("identityInput"), searchMessage=$("searchMessage");
  const modal=$("identityModal"), detail=$("detailContent");
  const BATCH=12, MAX_CARDS=48, TRIM_COUNT=12;
  let nextId=1n, generating=false, retryTimer=null, observer=null, feedTopIndex=1n;
  let savedScrollY=0, modalOpen=false, lastFocused=null;
  const cardById=new Map();

  function makeCard(profile){
    const card=document.createElement("article");
    card.className="identity-card"; card.tabIndex=0; card.setAttribute("role","button");
    card.setAttribute("aria-label",`Open ${profile.name}, identity ${profile.id}`);
    card.dataset.id=profile.id;
    card.innerHTML=`<div class="card-top"><div class="portrait">${profile.portrait}</div><div class="card-meta"><div class="class-tag">${profile.classification}</div><h2 class="card-name"></h2><div class="identity-id"></div></div></div><p class="card-bio"></p><div class="card-bottom"><span class="origin"></span><span class="open-mark" aria-hidden="true">↗</span></div>`;
    card.querySelector(".card-name").textContent=profile.name;
    card.querySelector(".identity-id").textContent="ID / "+profile.id;
    card.querySelector(".card-bio").textContent=profile.biography;
    card.querySelector(".origin").textContent=profile.origin;
    card.addEventListener("click",()=>openProfile(profile.id,true));
    card.addEventListener("keydown",e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();openProfile(profile.id,true)}});
    return card;
  }
  function updatePosition(){
    const cards=feed.children;
    let current=feedTopIndex;
    if(cards.length){
      const mid=window.innerHeight*.38;
      for(const card of cards){if(card.getBoundingClientRect().bottom>=mid){current=BigInt(card.dataset.id);break}}
    }
    position.textContent="IDENTITY "+current.toString().padStart(6,"0");
  }
  function appendBatch(){
    for(let i=0;i<BATCH;i++){
      const id=nextId.toString(), profile=VantheryxGenerator.generate(id);
      const card=makeCard(profile); feed.appendChild(card); cardById.set(id,card);
      nextId++;
    }
    trimWindow();
    updatePosition();
  }
  function trimWindow(){
    if(feed.children.length<=MAX_CARDS)return;
    const count=Math.min(TRIM_COUNT,feed.children.length-MAX_CARDS);
    const first=feed.firstElementChild;
    const firstTop=first.getBoundingClientRect().top;
    const rowHeight=first.getBoundingClientRect().height + parseFloat(getComputedStyle(feed).rowGap||0);
    const columns=Math.max(1, getComputedStyle(feed).gridTemplateColumns.split(" ").length);
    const removedRows=Math.ceil(count/columns);
    const oldY=window.scrollY;
    feedTopIndex=BigInt(first.dataset.id)+BigInt(count);
    for(let i=0;i<count;i++){
      const card=feed.firstElementChild;
      if(!card)break;
      cardById.delete(card.dataset.id);
      card.remove();
    }
    // Recenter the active window without a growing spacer or a large scroll jump.
    const removedHeight=removedRows*rowHeight;
    if(firstTop<window.innerHeight)window.scrollTo(0,Math.max(0,oldY-removedHeight));
  }
  function needsMore(){
    if(modalOpen||generating)return;
    const remaining=sentinel.getBoundingClientRect().top-window.innerHeight;
    if(remaining<Math.max(window.innerHeight*1.6,900)) queueBatch();
  }
  function queueBatch(){
    if(generating)return;
    generating=true;
    Promise.resolve().then(()=>{
      try{appendBatch();retryTimer&&clearTimeout(retryTimer);retryTimer=null}
      catch(err){
        console.error("VANTHERYX batch recovered:",err);
        $("feedStatus").textContent="Reconnecting to the archive…";
        if(!retryTimer)retryTimer=setTimeout(()=>{generating=false;queueBatch()},650);
        return;
      }
      generating=false;
      $("feedStatus").textContent="The archive continues beyond the visible horizon.";
      // Explicit re-check is vital when the sentinel remains in rootMargin.
      requestAnimationFrame(()=>{if(sentinel.getBoundingClientRect().top<window.innerHeight*2)needsMore()});
    });
  }
  function showSearch(){
    searchPanel.hidden=false; searchMessage.classList.remove("error");searchMessage.textContent="Decimal digits only. Leading zeroes are normalized.";
    searchInput.value="";setTimeout(()=>searchInput.focus(),20);
  }
  function hideSearch(){searchPanel.hidden=true;$("searchToggle").focus()}
  function openProfile(rawId,push){
    let id,profile;
    try{id=VantheryxGenerator.canonicalId(String(rawId));profile=VantheryxGenerator.generate(id)}
    catch(e){searchMessage.textContent=e.message;searchMessage.classList.add("error");return}
    savedScrollY=window.scrollY;lastFocused=document.activeElement;modalOpen=true;
    detail.innerHTML=`
      <div class="detail-hero"><div class="detail-portrait">${profile.portrait}</div><div><div class="class-tag">${profile.classification}</div><h2 id="modalName"></h2><div class="identity-id"></div><div class="signature">${profile.signature}</div></div></div>
      <div class="detail-section"><div class="detail-label">BIOGRAPHY</div><p class="detail-value">${escapeHTML(profile.biography)}</p></div>
      <div class="detail-grid"><div class="detail-section"><div class="detail-label">PERSONALITY</div><p class="detail-value">${escapeHTML(profile.personality)}</p></div><div class="detail-section"><div class="detail-label">ORIGIN DIMENSION</div><p class="detail-value">${escapeHTML(profile.origin)}</p></div><div class="detail-section"><div class="detail-label">KNOWN ROLE</div><p class="detail-value">${escapeHTML(profile.role)}</p></div><div class="detail-section"><div class="detail-label">TEMPORAL RECORD</div><p class="detail-value">${escapeHTML(profile.era)} · ${escapeHTML(profile.alignment)}</p></div></div>`;
    detail.querySelector("#modalName").textContent=profile.name;
    detail.querySelector(".identity-id").textContent="IDENTITY NUMBER / "+profile.id;
    modal.hidden=false;searchPanel.hidden=true;
    document.body.style.overflow="hidden";
    if(push){const url=new URL(location.href);url.searchParams.set("profile",id);history.pushState({profile:id}, "",url)}
    $("modalClose").focus();
  }
  function closeProfile(updateHistory){
    if(!modalOpen)return;
    modalOpen=false;modal.hidden=true;document.body.style.overflow="";
    if(updateHistory&&new URL(location.href).searchParams.has("profile")){
      const url=new URL(location.href);url.searchParams.delete("profile");history.pushState({}, "",url);
    }
    window.scrollTo(0,savedScrollY);
    if(lastFocused&&lastFocused.isConnected)lastFocused.focus();
    updatePosition();
  }
  function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
  $("searchToggle").addEventListener("click",showSearch);
  $("searchClose").addEventListener("click",hideSearch);
  $("searchForm").addEventListener("submit",e=>{
    e.preventDefault();
    try{const id=VantheryxGenerator.canonicalId(searchInput.value.trim());searchMessage.classList.remove("error");openProfile(id,true)}
    catch(err){searchMessage.textContent=err.message;searchMessage.classList.add("error")}
  });
  $("modalClose").addEventListener("click",()=>closeProfile(true));
  modal.addEventListener("click",e=>{if(e.target.dataset.close)closeProfile(true)});
  window.addEventListener("keydown",e=>{
    if(e.key==="Escape"){if(modalOpen)closeProfile(true);else if(!searchPanel.hidden)hideSearch()}
  });
  window.addEventListener("popstate",()=>{
    const id=new URL(location.href).searchParams.get("profile");
    if(id){openProfile(id,false)}else if(modalOpen)closeProfile(false);
  });
  window.addEventListener("scroll",()=>{updatePosition();needsMore()},{passive:true});
  window.addEventListener("resize",()=>needsMore(),{passive:true});
  if("IntersectionObserver" in window){
    observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting))queueBatch()},{root:null,rootMargin:"1400px 0px",threshold:0});
    observer.observe(sentinel);
  }
  // Startup batches are explicit; scroll fallback keeps loading independent of observer callbacks.
  appendBatch();appendBatch();
  requestAnimationFrame(needsMore);
  // Direct links work with ?profile=<decimal string> on static hosting.
  const direct=new URL(location.href).searchParams.get("profile");
  if(direct){try{openProfile(direct,false)}catch(e){console.warn("Invalid direct identity route",e)}}
})();