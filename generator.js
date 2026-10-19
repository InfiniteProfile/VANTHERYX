/* VANTHERYX deterministic identity engine.
   IDs are canonical positive decimal strings; no Number conversion is used for the ID itself. */
(function(){
  "use strict";
  const first = ["Vae","Zyra","Aeva","Nyth","Xavi","Vel","Elyz","Kae","Vey","Thal","Zyre","Nocta","Auri","Vael","Syr","Ily","Oryn","Maev","Rhae","Cyra","Lun","Azra","Nyx","Eir","Sael","Vora","Yva","Drae","Isol","Qyra"];
  const middle = ["lori","velle","ryn","thera","elle","thara","lith","vyria","lune","velle","mira","sora","dessa","vara","yra","oria","aelis","evra","ith","ara","enya","ythe","ovia","ess","avelle","eris","aura","yss","alune","ivra"];
  const surnames = ["Nyxen","Noctis","Solvex","Voss","Duskryn","Moonveil","Vanthe","Silenth","Astrane","Nex","Veyth","Serin","Vaelor","Thorne","Eclipsa","Morrow","Velkyn","Ashveil","Sable","Riven","Ossian","Nox","Caelith","Duskwell","Aster","Veyra","Kestrel","Umbrin","Lior","Starrow"];
  const classes = ["VIOLET SOVEREIGN","VOID ORACLE","ECLIPSE WANDERER","SILENT ARCHITECT","ASTRAL HEIRESS","OBSIDIAN DREAMER","CHRONICLE KEEPER","NEBULA NOMAD","CRIMSON PHANTOM","REALITY CARTOGRAPHER"];
  const origins = ["THE VIOLET VEIL","THE OBSIDIAN KINGDOM","THE CRIMSON MERIDIAN","THE ETERNAL ARCHIVE","THE SILENT CONSTELLATION","THE FRACTURED MOON","THE NULL CATHEDRAL","THE LAST UNIVERSE"];
  const bios = [
    "She walks between forgotten constellations, collecting fragments of realities that disappeared before history began.",
    "A keeper of unspoken histories, she hears the echoes left behind by worlds that no longer remember themselves.",
    "She maps the quiet border where memory becomes myth and darkness learns to dream.",
    "Some say she was born from a star's final reflection; she has never confirmed the story.",
    "She carries a silver key to a door that appears only in the dreams of strangers.",
    "Across the silent archive, she searches for the one name erased from every possible timeline.",
    "She moves through velvet darkness with the patience of a moon that has outlived its sky.",
    "Her shadow remembers a civilization that the universe insists never existed.",
    "She collects impossible questions and leaves the answers hidden inside distant nebulae.",
    "At the edge of the Null Cathedral, she listens for signals from identities not yet awakened."
  ];
  const traits = [
    "Quiet, observant, imaginative, and difficult to understand.",
    "Elegant under pressure, fiercely curious, and quietly defiant.",
    "Patient and perceptive, with a guarded sense of wonder.",
    "Independent, analytical, and drawn to forgotten places.",
    "Warm beneath a reserved exterior; loyal to very few.",
    "Dreamlike, strategic, and unusually attentive to detail.",
    "Courageous in silence, reflective by nature, and hard to deceive.",
    "Mysterious but compassionate, with an instinct for hidden patterns."
  ];
  const roles = ["Archivist of Echoes","Keeper of the Ninth Door","Cartographer of Lost Light","Witness to the Unwritten","Curator of Moonless Hours","Warden of Quiet Worlds","Seeker of the First Memory","Heir to a Silent Throne"];
  const palettes = [
    ["#211538","#a88ce6","#d5c6f5"],["#161923","#8095c5","#d3d9ec"],["#30131f","#c45d82","#f0b4c8"],
    ["#17151e","#b6a5d5","#eee6ff"],["#1d2430","#7e9eb2","#d4e4eb"],["#2a1a24","#a97a9c","#efd0e2"],
    ["#11131a","#8b7cbe","#d4d0f2"],["#251b18","#b78a74","#f0d1bd"]
  ];
  const dimensions = ["VEIL","KINGDOM","MERIDIAN","ARCHIVE","CONSTELLATION","MOON","CATHEDRAL","UNIVERSE"];
  function canonicalId(input){
    if(typeof input !== "string" || !/^[0-9]+$/.test(input)) throw new Error("Enter decimal digits only.");
    const id=input.replace(/^0+/,"");
    if(!id) throw new Error("The identifier must be greater than zero.");
    return id;
  }
  function hashString(s){
    // Two independent 32-bit rolling hashes over every digit; stable for arbitrary-length strings.
    let a=2166136261>>>0, b=0x9e3779b9>>>0;
    for(let i=0;i<s.length;i++){
      const c=s.charCodeAt(i);
      a=Math.imul(a^c,16777619)>>>0;
      b=(Math.imul(b^c,2246822519)+0x85ebca6b)>>>0;
    }
    return [a,b];
  }
  function pick(arr, seed, offset){return arr[(seed + Math.imul(offset+1,0x9e3779b1))>>>0 % arr.length];}
  function index(seed, offset, len){return ((seed ^ Math.imul(offset+1,0x45d9f3b))>>>0)%len;}
  function svgPortrait(id, name, paletteIndex, hashA, hashB){
    const p=palettes[paletteIndex], hair=index(hashB,2,6), outfit=index(hashA,3,5), face=index(hashB,4,4);
    const hairShapes=[
      "M27 48 Q19 8 50 10 Q82 8 74 48 L70 75 L61 51 Q50 58 39 51 L30 75Z",
      "M25 46 Q16 9 50 8 Q83 10 76 47 L79 82 L66 65 L64 39 Q49 52 34 39 L31 65 L22 78Z",
      "M28 43 Q24 12 50 12 Q77 12 72 43 L68 67 Q62 48 50 47 Q37 48 32 67Z",
      "M24 42 Q17 13 50 8 Q84 13 76 42 L72 81 Q63 61 67 32 Q49 46 31 32 L30 79Z",
      "M29 42 Q20 11 50 11 Q81 11 71 42 L65 60 L61 38 Q50 46 38 38 L34 61Z",
      "M26 44 Q19 8 50 9 Q82 8 74 44 L80 72 L68 61 L64 36 Q49 50 34 36 L30 64 L20 74Z"
    ];
    const clothes=["M22 100 Q24 77 39 73 L50 81 L61 73 Q77 77 79 100Z","M17 100 L28 76 L42 82 L50 77 L58 82 L72 76 L83 100Z","M24 100 Q25 79 39 75 L50 86 L61 75 Q75 79 76 100Z","M15 100 Q22 81 38 77 L50 84 L62 77 Q78 81 85 100Z","M21 100 L29 74 L42 80 L50 75 L58 80 L71 74 L79 100Z"];
    const eyeY=42+(face%2);
    const initial=name.split(" ").map(x=>x[0]).join("").slice(0,2);
    // Embedded vector portrait: no external image requests or broken-image dependency.
    return `<svg viewBox="0 0 100 100" role="img" aria-label="Abstract portrait of ${name}" xmlns="http://www.w3.org/2000/svg">
      <defs><radialGradient id="g${id}"><stop stop-color="${p[1]}" stop-opacity=".55"/><stop offset="1" stop-color="${p[0]}"/></radialGradient><linearGradient id="c${id}" x2="1" y2="1"><stop stop-color="${p[1]}"/><stop offset="1" stop-color="${p[0]}"/></linearGradient></defs>
      <rect width="100" height="100" fill="url(#g${id})"/><circle cx="${20+index(hashA,7,60)}" cy="${14+index(hashB,8,65)}" r="1.2" fill="${p[2]}"/><circle cx="78" cy="20" r="17" fill="none" stroke="${p[2]}" stroke-opacity=".25"/>
      <path d="${clothes[outfit]}" fill="url(#c${id})"/><path d="${hairShapes[hair]}" fill="#09090d" stroke="${p[1]}" stroke-width=".7"/>
      <ellipse cx="50" cy="42" rx="17" ry="22" fill="#c8a8a2"/><path d="M33 38 Q35 18 50 19 Q66 19 67 38 L64 29 Q51 34 36 28Z" fill="#17121e"/>
      <path d="M39 ${eyeY} q4 -3 7 0 M54 ${eyeY} q4 -3 7 0" fill="none" stroke="#29202b" stroke-width="1.5" stroke-linecap="round"/>
      <path d="M48 49 l2 3 2 -3 M44 57 Q50 60 56 57" fill="none" stroke="#815e6d" stroke-width="1" stroke-linecap="round"/>
      <path d="M38 64 L50 75 L62 64 L67 76 L50 87 L33 76Z" fill="${p[0]}" opacity=".8"/>
      <path d="M8 90 H92" stroke="${p[2]}" stroke-opacity=".35"/><text x="50" y="96" font-size="4" text-anchor="middle" fill="${p[2]}" letter-spacing="1.2">${initial}</text>
    </svg>`;
  }
  function generate(input){
    const id=canonicalId(input), [a,b]=hashString(id);
    const namePattern=index(a,0,4);
    let given;
    if(namePattern===0) given=first[index(a,1,first.length)]+middle[index(b,2,middle.length)];
    else if(namePattern===1) given=first[index(b,1,first.length)]+middle[index(a,2,middle.length)];
    else if(namePattern===2) given=first[index(a^b,3,first.length)]+middle[index(a,4,middle.length)];
    else given=first[index(b,5,first.length)]+middle[index(b^a,6,middle.length)];
    const surname=surnames[index(b,7,surnames.length)];
    const name=given+" "+surname;
    const cls=classes[index(a,8,classes.length)];
    const origin=origins[index(b,9,origins.length)];
    const signature="VX-"+a.toString(16).padStart(8,"0").toUpperCase()+"-"+b.toString(16).padStart(8,"0").toUpperCase();
    const palette=index(a^b,10,palettes.length);
    return {
      id,name,classification:cls,origin,
      biography:bios[index(a,11,bios.length)],
      personality:traits[index(b,12,traits.length)],
      signature,role:roles[index(a^b,13,roles.length)],
      alignment:["Liminal","Celestial","Nocturnal","Fractured","Ethereal","Obsidian"][index(a,14,6)],
      era:["Before the First Signal","The Quiet Epoch","The Violet Interregnum","The Unwritten Cycle","After the Last Dawn"][index(b,15,5)],
      portrait:svgPortrait(id,name,palette,a,b)
    };
  }
  window.VantheryxGenerator={generate,canonicalId};
})();