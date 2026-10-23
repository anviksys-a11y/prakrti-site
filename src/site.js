(function(){
"use strict";
var root=document.documentElement;
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))}
function T(en,ja){return {en:en,ja:ja}}
function L(){return root.getAttribute("data-lang")==="ja"?"ja":"en"}
function tr(o){if(o==null)return "";if(typeof o==="string")return o;var v=o[L()];return v==null?o.en:v}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
var ROOT=root.getAttribute("data-root")||"";
var APP=root.getAttribute("data-app")||"";
var SLUG={home:"",world:"world/",starter:"starter-set/",engine:"how-judging-works/",rpd:"rpd/",premium:"premium/",schools:"schools/",principles:"principles/",readings:"readings/",company:"company/",legal:"legal/"};
function url(t){var u=ROOT+(SLUG[t]==null?"":SLUG[t]);return u||"./"}
var TIKA=T("Commentary","注釈");
function tikaInline(text){return '<p class="tika" style="padding-top:0"><span class="tika-label"><span class="deva" lang="sa">टीका</span>'+esc(tr(TIKA))+'</span>'+esc(tr(text))+'</p>'}

/* ---------- places on the world map ---------- */
var STATUS={
  free:T("Free","無料"), noai:T("No AI","AI なし"), guest:T("No account needed","登録なしで遊べる"), read:T("Reading needs no account","読むのは登録なしで"),
  starter:T("Free in the Starter Set","スターターセットで無料"), daily:T("Free: one scan a day","無料：1日1回"),
  unlimited:T("Unlimited in Premium","Premium で無制限"), premium:T("Premium","Premium"), school:T("School License","School License"),
  prep:T("In preparation","準備中"), freeWrite:T("Writing is free","書くのは無料"), records:T("Recording is free","記録は無料"),
  testruns:T("Test runs in Premium","試走は Premium"), oneTime:T("Bought once, like books","本と同じく一度だけ購入"), chariot:T("Chariot notes are free","Chariot は無料"),
  later:T("Opens in stages after launch","一般公開のあと、順に開きます"),
  launch:T("From the test launch","テストローンチから")
};
var CH={s:T("Starter Set · lit","スターターセット ・ 明るい場所"),"1":T("Chapter १ · Your own archer","第一章 ・ 自分の射手"),"2":T("Chapter २ · Into the world","第二章 ・ 世界へ"),"3":T("Chapter ३ · With companions","第三章 ・ 仲間と")};
var LINKS={starter:T("Open the Starter Set","スターターセットへ"),rpd:T("About Mahābhārata RPD","Mahābhārata RPD について"),engine:T("How judging works","判定のしくみへ"),premium:T("What Premium opens","Premium で開くもの"),schools:T("For yoga schools","ヨガの学校へ")};
var PLACES=[
 {id:"yatra",ch:"s",name:T("Yātrā, a journey of cards","Yātrā（旅のカード）"),short:T("Yātrā","Yātrā"),
  desc:T("Where the road begins. A card game that takes you once round the whole of Prakrti GSA, on copies of the real screens: Prism, dialogue and the allegory play, the Sutra, a test run, a Field Trial and Chariot. You choose cards and press buttons; nothing has to be written. Prakrti answers from a script, and the judging runs on the real formula.","道の始まり。本物の画面の写しの上で、Prakrti GSA 全体をひと回りするカードゲームです。Prism、対話と寓話劇、Sutra、守りの走、Field Trial、Chariot。札を選び、ボタンを押すだけで、文章は書かなくてかまいません。Prakrti は台本で答え、判定は本物の式で動きます。"),
  status:["launch","free","noai","guest"],page:"starter",app:"/yatra"},
 {id:"verse",ch:"s",name:T("The verse board and the language room","聖句盤と語学教室"),short:T("Verse Board","聖句盤"),
  desc:T("Every verse of the Gītā and the Yoga Sūtras with the Sanskrit, a translation and a full grammatical analysis. The language room turns the grammar into quizzes, and Vibhakti, a declension game, is being added.","ギーターとヨーガ・スートラの全句を、原文・訳・文法解析つきで読めます。語学教室では、文法をクイズで遊べます。格変化ゲーム『Vibhakti』も加える予定です。"),
  status:["launch","free","noai","read"],page:"starter",app:"/scripture"},
 {id:"archer",ch:"s",name:T("The Charioteer and the Archer","御者と射手"),short:T("Charioteer & Archer","御者と射手"),
  desc:T("Drive the chariot while the archer shoots. When the crowd shakes the archer's mind, stop for a Timeout and offer one of three verses. The archer's mind runs on the same formula as the Arena.","射手が射るあいだ、戦車を操ります。観衆の声で射手の心が揺れたら、作戦タイムで三枚の句から一枚を差し出します。射手の心は、The Arena と同じ式で動いています。"),
  status:["launch","free","noai","guest"],page:"starter",app:"/mahabharata/krida"},
 {id:"rpd0",ch:"s",name:T("RPD · Fetching Water, Episode 0","RPD『水を汲みに』第0話"),short:T("RPD Episode 0","RPD 第0話"),
  desc:T("Sri Krishna asks you for water, and a life begins in a village at the edge of the desert. A solo story with no game master, played on screen.","聖クリシュナに水を頼まれ、砂漠の外れの村で一つの人生が始まります。GM のいない一人用の物語で、画面の上で遊びます。"),
  status:["launch","starter","noai"],page:"rpd",app:"/mahabharata/works"},
 {id:"prism",ch:"1",name:T("Prism","Prism"),short:T("Prism","Prism"),
  desc:T("Write a fragment of your day, up to 600 characters: a friction, a scene you cannot put down. Press Scan and the AI returns one short, sharp line with a Vital Score. With a free account you get one scan a day, and writing is unlimited. Premium scans without limit and opens a strategy dialogue from the fragment.","今日の摩擦や、頭から離れない一場面を、600 字までの断片に書きます。スキャンを押すと、AI が短く鋭い一行と、活力スコアを返します。無料のアカウントでスキャンは 1 日 1 回、書きとめるだけなら何度でも書けます。Premium ではスキャンが無制限になり、その断片から戦略対話を始められます。"),
  status:["launch","daily","freeWrite","unlimited"],page:"premium",app:"/observe"},
 {id:"kuru",ch:"1",name:T("Kurukshetra, the workshop","Kurukshetra（工房）"),short:T("Kurukshetra","Kurukshetra"),
  desc:T("Write and version your Sutras, build counterparts, run test runs, read the observation report, and keep private notes in the margin. Writing by hand is free. In Premium the AI drafts Sutras and counterparts from your dialogues and plays the counterpart in test runs.","Sutra を書いて版を重ね、相手役を作り、試走し、観測レポートを読み、余白に私的なメモを残します。手で書くのは無料です。Premium では、対話から AI が Sutra と相手役を下書きし、試走では AI が相手役を演じます。"),
  status:["launch","freeWrite","testruns"],page:"premium",app:"/workspace"},
 {id:"rupaka",ch:"1",name:T("Rūpaka, the allegory play","寓話劇 Rūpaka"),short:T("Rūpaka","寓話劇 Rūpaka"),
  desc:T("Tell the AI what you are carrying, and it becomes a game master that retells it as a play from the Gītā. You take one part; when the curtain falls, there are drafts of your Sutra and your counterpart's. It is one of the six ways to play Mahābhārata RPD: a table with an AI game master, played alone. The Two Seats, a table of the same kind, opens after launch.","いま抱えている悩みを話すと、AI が GM になって、ギーターの物語に置き換えた劇にします。あなたは一人を演じ、幕が下りると、あなたと相手役の Sutra の下書きができます。Mahābhārata RPD の六つの遊び方の一つで、AI の GM と一人で遊ぶ卓です。同じ形の卓「二人の席」は、一般公開のあとに開きます。"),
  status:["launch","premium"],page:"rpd",app:"/rupaka"},
 {id:"trial",ch:"1",name:T("Field Trial","Field Trial"),short:T("Field Trial","Field Trial"),
  desc:T("Register in advance which version you will try and in what situation. Afterwards, record once: held, wavered, breached, or did not occur.","どの版を、どんな場面で試すかを先に登録し、あとで一度だけ記録します。持ちこたえた・揺らいだ・破られた・場面が来なかった。"),
  status:["launch","records","noai"],page:"engine"},
 {id:"hall",ch:"2",name:T("The scripture hall","聖典の間"),short:T("Scripture Hall","聖典の間"),
  desc:T("Start a dialogue from a verse. One conversation becomes one interpretation that you can publish, fork or keep for yourself.","聖句から対話を始めます。一つの対話が一つの解釈になり、公開・fork・秘蔵ができます。"),
  status:["launch","premium","chariot"],page:"premium"},
 {id:"arena",ch:"2",name:T("The Arena","The Arena"),short:T("The Arena","The Arena"),
  desc:T("Publish a card and open one door: Challenge, Blueprint or Bounty. Broken cards receive patches, and a merged patch becomes a co-authored story. The Hall of Fame shows how cards broke and were repaired.","カードを公開して、扉を一つ開けます（Challenge・Blueprint・Bounty）。折れたカードには patch が届き、merge すると共著の物語になります。殿堂には、どう折れてどう直ったかが並びます。"),
  status:["premium","later"],page:"premium"},
 {id:"exchange",ch:"2",name:T("The Exchange","Exchange"),short:T("Exchange","Exchange"),
  desc:T("Counterparts change hands. Fork them, trade copies by name, or take in a one-of-a-kind card that has passed through many owners.","相手役の型が、手から手へ渡ります。fork、名指しの交換、多くの持ち主を経てきた一点ものの引き取り。"),
  status:["premium","later"],page:"premium"},
 {id:"ashram",ch:"3",name:T("Ashrams","Ashram"),short:T("Ashrams","Ashram"),
  desc:T("Rooms with faces, between yourself and the world. Private rooms are free to open. With a School License, trainees use the AI inside the room.","自分と世界のあいだにある、顔の見える部屋。Private な部屋は無料で開けます。School License があれば、受講生は部屋の中で AI を使えます。"),
  status:["free","school","later"],page:"schools"},
 {id:"tables",ch:"3",name:T("Ashram tables","Ashram の卓"),short:T("Ashram Tables","Ashram の卓"),
  desc:T("Play Mahābhārata RPD together, in any Ashram: a free Private Ashram among friends, or a school's. A human game master is free, and an AI game master comes with a School License. Dice settle what bodies do; the Sutra engine settles what minds do. All six ways to play are on the RPD page.","Mahābhārata RPD を、仲間と一緒に遊びます。卓は、どの Ashram でも開けます。友人どうしの無料の Private Ashram でも、学校の Ashram でも。人の GM は無料、AI の GM は School License で使えます。ダイスが体の行いを、Sutra 判定が心の動きを決めます。六つの遊び方は、RPD のページにまとめてあります。"),
  status:["free","school","later"],page:"rpd"},
 {id:"karuta",ch:"3",name:T("Gītā Karuta","ギーターかるた"),short:T("Gītā Karuta","ギーターかるた"),
  desc:T("Competitive karuta with Gītā verses. A verse appears one syllable at a time, and you take the card as soon as you can tell which verse it is. Play alone, or as two teams in an Ashram.","ギーターの句で遊ぶ競技かるた。句が一音節ずつ現れ、どの句か分かった瞬間に札を取ります。一人でも、Ashram で二組に分かれても遊べます。"),
  status:["free","noai","prep"],page:"rpd",
  joke:T("Engineers will recognize the kimariji, the shortest prefix that tells one card from the rest. It is a trie with good manners.","決まり字は、ほかの札と見分けられる最短の冒頭です。エンジニアの方なら、行儀のよいトライ木だと気づくはずです。")},
 {id:"board",ch:"3",name:T("The Eighteen-Day Board","十八日の盤"),short:T("Eighteen-Day Board","十八日の盤"),
  desc:T("A simulation of the eighteen days of Kurukṣetra, faithful to the source. The outcome is fixed by the text. What changes is how you read it, as a war and as an inner battle.","クルクシェートラの十八日を、原典に忠実に再現する盤。結果は原典のとおりです。変わるのは読み方で、戦争としても、内なる戦いとしても読めます。"),
  status:["prep"],page:"rpd"},
 {id:"shop",ch:"3",name:T("The Shop","Shop"),short:T("The Shop","Shop"),
  desc:T("Scenarios, rulebooks and emblems in one place. Scenarios are bought once, like books.","脚本・ルールブック・意匠の売り場。脚本は、本と同じく一度だけ買います。"),
  status:["oneTime","later"],page:"rpd"}
];
PLACES.forEach(function(p,i){p.n=i+1});
var BY={};PLACES.forEach(function(p,i){BY[p.id]=p;p.k=i});
var SEEDS_L={yatra:[.90,.90],archer:[.12,.86],rpd0:[.38,.89],verse:[.64,.85],prism:[.87,.64],kuru:[.65,.61],rupaka:[.44,.66],trial:[.23,.62],hall:[.13,.40],arena:[.43,.38],exchange:[.73,.41],ashram:[.90,.15],tables:[.70,.12],karuta:[.50,.16],board:[.30,.11],shop:[.10,.17]};
var SEEDS_P={yatra:[.88,.96],archer:[.16,.93],rpd0:[.42,.96],verse:[.66,.89],prism:[.84,.76],kuru:[.60,.71],rupaka:[.38,.76],trial:[.16,.71],hall:[.18,.52],arena:[.50,.50],exchange:[.82,.53],ashram:[.82,.31],tables:[.50,.29],karuta:[.18,.32],board:[.30,.10],shop:[.70,.10]};
var DE=[[1,0],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1]], DO=[[1,0],[1,1],[0,1],[-1,0],[0,-1],[1,-1]];
/* the three keys: hold one up, and the places it opens light up on the map */
var KEYS={
 free:{name:T("Free account","無料のアカウント"),note:T("Sign up for free, and RPD Episode 0, writing and recording Sutras by hand, a Private Ashram with human game masters, and one Prism scan a day open. Yātrā, the verse board, published interpretations and The Charioteer and the Archer need no account.","無料で登録すると、RPD 第0話、Sutra を手で書くことと記録、Private Ashram と人の GM の卓、1日1回の Prism が開きます。Yātrā、聖句盤と公開された解釈、『御者と射手』は、登録しなくても使えます。"),page:"starter"},
 premium:{name:T("Premium","Premium"),note:T("US$199 a month. Dialogues, drafts of Sutras and counterparts, test runs, Rūpaka and unlimited Prism scans: every AI feature for individual use opens. Everything free stays as it is.","月 199 米ドル。対話、Sutra と相手役の下書き、試走、寓話劇 Rūpaka、無制限の Prism。個人で使う AI の機能が、すべて開きます。無料の場所は、そのまま使えます。"),page:"premium"},
 school:{name:T("School License","School License"),note:T("For yoga schools, from US$199 a month. Inside the school's Ashram, trainees use the AI for dialogues, drafts and Challenges with a monthly seat, and tables can have an AI game master.","ヨガの学校のための契約で、月 199 米ドルから。学校の Ashram の中で、受講生は月ごとの席を使い、対話や下書き、Challenge に AI を使えます。卓では、AI が GM を務められます。"),page:"schools"}
};
/* the Eighteen-Day Board runs without AI, so it is free with an account (2026-10-22) */
var KEYS_OF={yatra:["free"],verse:["free"],archer:["free"],rpd0:["free"],prism:["free","premium"],kuru:["free","premium"],rupaka:["premium"],trial:["free"],
 hall:["free","premium"],arena:["premium"],exchange:["premium"],ashram:["free","school"],tables:["free","school"],karuta:["free"],board:["free"],shop:["free"]};
var keyOn=null;
function keyOut(p){return !!keyOn&&(KEYS_OF[p.id]||[]).indexOf(keyOn)<0}
function shaded(p){return keyOn?keyOut(p):fogged(p)}
var KEY_SVG='<svg class="kglyph" viewBox="0 0 16 16" aria-hidden="true"><circle cx="4.6" cy="8" r="3" fill="none" stroke="currentColor" stroke-width="1.6"/><path d="M7.6 8H15M12.4 8v3M14.6 8v2.2" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
function hsh(a,b,c){var x=Math.sin(a*127.1+b*311.7+c*74.7)*43758.5453;return x-Math.floor(x)}
function corners(cx,cy,s){var p=[];for(var i=0;i<6;i++){var a=Math.PI/180*(60*i-30);p.push([cx+s*Math.cos(a),cy+s*Math.sin(a)])}return p}
function f1(n){return Math.round(n*10)/10}
var fog={lifted:false,seen:{}};
var selected="yatra";
function fogged(p){return p.ch!=="s"&&!fog.lifted&&!fog.seen[p.id]}
var maps=[];

function chipsHTML(keys){return '<div class="chips">'+keys.map(function(k){return '<span class="chip chip-'+k+'">'+esc(tr(STATUS[k]))+'</span>'}).join("")+'</div>'}

function makeMap(host){
  host.innerHTML='<div class="map-tools"><p class="eyebrow map-hint"></p><button type="button" class="btn btn-sm" data-act="fog"></button></div><div class="map-keys" role="group"></div><p class="mk-note" hidden></p><div class="map-frame"><svg class="world-svg" role="img" xmlns="http://www.w3.org/2000/svg"></svg></div><div class="map-below"><div class="atlas"></div><div class="panel place-panel" aria-live="polite"></div></div>';
  var frame=$(".map-frame",host), svg=$("svg",host), lastW=0, lastLang="", portrait=false;
  function build(W){
    portrait=W<620;
    var cols=portrait?13:26, rows=portrait?21:14;
    var s=W/(Math.sqrt(3)*(cols+0.5)), hw=Math.sqrt(3)*s;
    var H=Math.ceil(s*(1.5*(rows-1)+2));
    var seeds=portrait?SEEDS_P:SEEDS_L;
    var pts=PLACES.map(function(p){return [seeds[p.id][0]*W, seeds[p.id][1]*H]});
    var grid=[], polys="", bord="", r, c, k;
    for(r=0;r<rows;r++){grid[r]=[];for(c=0;c<cols;c++){
      var x=hw*(c+0.5*(r&1))+hw/2, y=s+1.5*s*r, best=0, bd=1e9;
      for(k=0;k<pts.length;k++){var d=Math.hypot(x-pts[k][0],y-pts[k][1])*(1+(hsh(c,r,k)-0.5)*0.22);if(d<bd){bd=d;best=k}}
      grid[r][c]=best;
      polys+='<polygon class="wc" data-id="'+PLACES[best].id+'" points="'+corners(x,y,s).map(function(q){return f1(q[0])+","+f1(q[1])}).join(" ")+'"/>';
    }}
    for(r=0;r<rows;r++){for(c=0;c<cols;c++){
      var kk=grid[r][c], dirs=(r&1)?DO:DE;
      for(var di=0;di<3;di++){var nc=c+dirs[di][0], nr=r+dirs[di][1];
        if(nr<0||nr>=rows||nc<0||nc>=cols)continue;
        var k2=grid[nr][nc]; if(k2===kk)continue;
        var cx=hw*(c+0.5*(r&1))+hw/2, cy=s+1.5*s*r, cs=corners(cx,cy,s), a=cs[di], b=cs[(di+1)%6];
        bord+='<line class="wb" data-a="'+PLACES[kk].id+'" data-b="'+PLACES[k2].id+'" x1="'+f1(a[0])+'" y1="'+f1(a[1])+'" x2="'+f1(b[0])+'" y2="'+f1(b[1])+'"/>';
      }
    }}
    var road="";
    for(var i=0;i<pts.length-1;i++){
      var p0=pts[Math.max(0,i-1)], p1=pts[i], p2=pts[i+1], p3=pts[Math.min(pts.length-1,i+2)];
      var c1=[p1[0]+(p2[0]-p0[0])/6, p1[1]+(p2[1]-p0[1])/6], c2=[p2[0]-(p3[0]-p1[0])/6, p2[1]-(p3[1]-p1[1])/6];
      road+='<path class="road" data-a="'+PLACES[i].id+'" data-b="'+PLACES[i+1].id+'" d="M'+f1(p1[0])+','+f1(p1[1])+' C'+f1(c1[0])+','+f1(c1[1])+' '+f1(c2[0])+','+f1(c2[1])+' '+f1(p2[0])+','+f1(p2[1])+'"/>';
    }
    var labs="";
    PLACES.forEach(function(p,k){
      var x=pts[k][0], y=pts[k][1], anchor="middle", dx=0;
      if(x<90){anchor="start";dx=-10}else if(x>W-90){anchor="end";dx=10}
      labs+='<g class="wl" data-id="'+p.id+'" transform="translate('+f1(x)+','+f1(y)+')"><circle r="'+(portrait?11:10)+'"/><text class="wl-n" dy="0.35em" text-anchor="middle">'+p.n+'</text>'+(portrait?'':'<text class="wl-t" x="'+dx+'" y="27" text-anchor="'+anchor+'">'+esc(tr(p.short))+'</text>')+'</g>';
    });
    var hp=pts[0], here='<g class="here" transform="translate('+f1(hp[0])+','+f1(hp[1])+')"><circle r="16"/>'+(portrait?'':'<text x="'+(hp[0]>W*0.7?10:-10)+'" y="-24" text-anchor="'+(hp[0]>W*0.7?"end":"start")+'">'+esc(tr(T("You are here · locative case","いまここ ・ 処格")))+'</text>')+'</g>';
    svg.setAttribute("viewBox","0 0 "+W+" "+H);
    svg.setAttribute("aria-label",tr(T("Map of the Prakrti GSA world. The Starter Set is lit; the other places are covered by fog until you select them.","Prakrti GSA の世界地図。スターターセットだけが明るく、ほかの場所は選ぶまで霧に覆われています。")));
    svg.innerHTML='<g>'+polys+'</g><g>'+bord+'</g><g>'+road+'</g>'+here+'<g>'+labs+'</g>';
  }
  function paint(){
    if(!svg.firstChild)return;
    $$(".wc",svg).forEach(function(el){var p=BY[el.getAttribute("data-id")];el.setAttribute("class","wc ch-"+p.ch+(shaded(p)?" fog":"")+(keyOn&&!keyOut(p)?" kin":"")+(p.id===selected?" sel":""))});
    $$(".wb",svg).forEach(function(el){var a=BY[el.getAttribute("data-a")],b=BY[el.getAttribute("data-b")];el.setAttribute("class","wb"+(shaded(a)&&shaded(b)?" dim":""))});
    $$(".road",svg).forEach(function(el){var a=BY[el.getAttribute("data-a")],b=BY[el.getAttribute("data-b")];el.setAttribute("class","road"+(shaded(a)||shaded(b)?" dim":""))});
    $$(".wl",svg).forEach(function(el){var p=BY[el.getAttribute("data-id")];el.setAttribute("class","wl"+(shaded(p)?" dim":"")+(p.id===selected?" sel":""))});
    var keys=$(".map-keys",host), note=$(".mk-note",host);
    keys.setAttribute("aria-label",tr(T("Keys","鍵")));
    keys.innerHTML='<span class="mk-label">'+esc(tr(T("Hold up a key","鍵で見る")))+'</span>'+["free","premium","school"].map(function(k){return '<button type="button" data-key="'+k+'" aria-pressed="'+(keyOn===k)+'">'+KEY_SVG+esc(tr(KEYS[k].name))+'</button>'}).join("");
    if(keyOn){note.hidden=false;note.innerHTML='<span>'+esc(tr(T("Lit: what this key opens. ","光っているのが、この鍵で開く場所です。")))+esc(tr(KEYS[keyOn].note))+'</span><a class="link-arrow" href="'+url(KEYS[keyOn].page)+'">'+esc(tr(LINKS[KEYS[keyOn].page]))+'</a>'}else{note.hidden=true;note.innerHTML=""}
    $(".map-hint",host).textContent=tr(T("Select a place on the map or in the list","地図か一覧から場所を選んでください"));
    $("[data-act=fog]",host).textContent=fog.lifted?tr(T("Bring back the fog","霧を戻す")):tr(T("Lift the fog · for cartographers","霧を晴らす（地図好きの方へ）"));
    var groups={s:[],"1":[],"2":[],"3":[]};
    PLACES.forEach(function(p){groups[p.ch].push(p)});
    $(".atlas",host).innerHTML=["s","1","2","3"].map(function(g){
      return '<div><h4>'+esc(tr(CH[g]))+'</h4>'+groups[g].map(function(p){
        var f=shaded(p), mark=keyOn?"":(f?tr(T("in fog","霧の中")):"");
        return '<button type="button" class="place'+(f?" fogged":"")+'" data-id="'+p.id+'" aria-pressed="'+(p.id===selected)+'"><span class="n">'+p.n+'</span><span class="nm">'+esc(tr(p.name))+'</span>'+(mark?'<span class="fogmark">'+esc(mark)+'</span>':'')+'</button>';
      }).join("")+'</div>';
    }).join("");
    var p=BY[selected];
    $(".place-panel",host).innerHTML='<p class="eyebrow">'+esc(tr(CH[p.ch]))+' · '+p.n+'</p><h3>'+esc(tr(p.name))+'</h3><p>'+esc(tr(p.desc))+'</p>'+chipsHTML(p.status)+(p.joke?tikaInline(p.joke):'')+'<div class="cta-row">'+(p.app&&APP?'<a class="link-arrow" href="'+APP+p.app+'">'+esc(tr(T("Open in the app","アプリで開く")))+'</a>':'')+'<a class="link-arrow" href="'+url(p.page)+'">'+esc(tr(LINKS[p.page]))+'</a></div>';
  }
  function layout(force){
    var W=Math.round(frame.clientWidth);
    if(!W)return;
    if(force||Math.abs(W-lastW)>=8||lastLang!==L()){lastW=W;lastLang=L();build(W)}
    paint();
  }
  host.addEventListener("click",function(e){
    var kb=e.target.closest("[data-key]");
    if(kb&&host.contains(kb)){var kv=kb.getAttribute("data-key");keyOn=keyOn===kv?null:kv;paintAll();return}
    var t=e.target.closest("[data-act],[data-id]");
    if(!t||!host.contains(t))return;
    if(t.getAttribute("data-act")==="fog"){fog.lifted=!fog.lifted;keyOn=null;paintAll();return}
    var id=t.getAttribute("data-id");
    if(id&&BY[id]){selected=id;fog.seen[id]=true;paintAll();
      // the description sits below the map; bring it into view when it is off screen
      var pn=$(".place-panel",host);
      if(pn){var r=pn.getBoundingClientRect();if(r.top>window.innerHeight-80||r.bottom<0){pn.scrollIntoView({behavior:"smooth",block:"nearest"})}}}
  });
  if(window.ResizeObserver){new ResizeObserver(function(){layout(false)}).observe(frame)}
  else{window.addEventListener("resize",function(){layout(false)})}
  var api={layout:layout,paint:paint};
  maps.push(api);
  return api;
}
function paintAll(){maps.forEach(function(m){m.layout(false)})}

function renderGazetteer(){
  var host=$("#gazetteer");if(!host)return;
  host.innerHTML=["s","1","2","3"].map(function(g){
    return '<div class="gaz-group"><h3>'+esc(tr(CH[g]))+'</h3>'+PLACES.filter(function(p){return p.ch===g}).map(function(p){
      return '<div class="gaz-item"><span class="n">'+p.n+'</span><div class="body"><h4>'+esc(tr(p.name))+'</h4><p>'+esc(tr(p.desc))+'</p>'+chipsHTML(p.status)+(p.joke?tikaInline(p.joke):'')+'</div></div>';
    }).join("")+'</div>';
  }).join("");
}

/* ---------- the archer, a playable taste ---------- */
var KING={dharma:T("Dharma · law","法 ・ ダルマ"),artha:T("Artha · gain","利 ・ アルタ"),kama:T("Kāma · desire","欲 ・ カーマ")};
var SEED={anger:{name:T("anger","怒り"),k:"kama"},pride:{name:T("pride","慢心"),k:"dharma"},fear:{name:T("fear","恐れ"),k:"artha"}};
var VERSE={
 "2.63":{k:"kama",text:T("From anger comes delusion, and from delusion loss of memory. From loss of memory comes the ruin of discrimination, and from the ruin of discrimination he perishes.","怒りから迷妄が生じ、迷妄から記憶の喪失が生じる。記憶の喪失から識別の破滅が生じ、識別が破滅すると、人は滅びる。")},
 "2.3":{k:"artha",text:T("Yield not to unmanliness, O son of Pritha! Ill does it become you. Cast off this mean faintheartedness and arise, O scorcher of your enemies!","プリターの子よ、惰弱に身をまかせてはならない。それは汝にふさわしくない。この卑しい心の弱さを捨てて立ち上がれ、敵を焼く者よ。")},
 "3.27":{k:"dharma",text:T("The gunas of Prakriti perform all action. With the understanding deluded by egoism, man thinks, “I am the doer.”","プラクリティのグナが、すべての行為をなす。我執に理解を惑わされた人は、「私が行為者である」と考える。")}
};
var ROUNDS=[
 {name:T("Mockery","嘲り"),event:T("The crowd mocks a third-place finish.","三位に終わり、観衆があざ笑う。"),crowd:T("“Did the bird pay you to miss?”","「鳥に頼まれて外したのか？」"),
  archer:T("“Laugh while you can. I will make them swallow every word.”","「笑っていろ。その言葉、全部のみ込ませてやる。」"),seed:"anger",dp:0.55,
  reached:T("“…If I shoot to silence them, I have stopped looking at the target.”","「……黙らせるために射れば、もう的を見ていないことになる。」"),
  missed:T("“A lovely verse. Save it for another day. Hand me an arrow.”","「いい句だ。別の日に聞こう。矢をくれ。」")},
 {name:T("Praise","称賛"),event:T("The elders praise a perfect round.","長老たちが、完璧な回をほめたたえる。"),crowd:T("“First place! The finest archer of the age!”","「一位だ！ 当代一の射手よ！」"),
  archer:T("“Of course. I could do this blindfolded.”","「当然だ。目隠しでも当ててみせる。」"),seed:"pride",dp:0.42,
  reached:T("“…The bow, the wind, the horses, and you at the reins. I only let go of the string.”","「……弓と、風と、馬と、手綱を取るあなた。わたしは弦を離しただけだ。」"),
  missed:T("“Why so serious? We are winning.”","「なぜそんな顔をする？ 勝っているのに。」")},
 {name:T("Jeers","野次"),event:T("Jeers after three misses in a row.","三本続けて外し、野次が飛ぶ。"),crowd:T("“Three misses! Finished!”","「三本続けて外した！ もう終わりだ！」"),
  archer:T("“What if they are right? What if I cannot hit anything anymore?”","「もし本当だったら？ もう何も当たらなかったら？」"),seed:"fear",dp:0.42,
  reached:T("“…Stand first. Then draw. One arrow at a time.”","「……まず立つ。それから引く。矢は一本ずつだ。」"),
  missed:T("“Words will not steady my hands.”","「言葉で手の震えは止まらない。」")}
];
var STAGES=[T("Calm","静か"),T("Rising","ざわつき"),T("Strained","張りつめ"),T("Breaking","限り")];
var game;
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t}return a}
function stageOf(p){return p<0.3?0:p<0.55?1:p<0.8?2:3}
function newGame(){game={r:0,phase:"timeout",p:0.15,w:{dharma:1,artha:1,kama:1},order:[],pick:null,log:[]};startRound(0)}
function startRound(i){
  var R=ROUNDS[i], k=SEED[R.seed].k;
  game.r=i;game.phase="timeout";game.pick=null;
  game.p=Math.min(1.2,game.p+R.dp);
  game.w[k]=Math.min(1.9,game.w[k]+0.6);
  Object.keys(game.w).forEach(function(o){if(o!==k)game.w[o]=Math.max(0.65,game.w[o]-0.08)});
  game.order=shuffle(Object.keys(VERSE));
}
function pickVerse(v){
  if(game.phase!=="timeout")return;
  var R=ROUNDS[game.r], k=SEED[R.seed].k, fit=VERSE[v].k===k;
  game.pick=v;
  if(fit){game.p*=0.5;game.w[k]=1+(game.w[k]-1)*0.3}else{game.p*=0.9;game.w[k]=Math.max(0.65,game.w[k]-0.06)}
  game.log.push({r:game.r,v:v,fit:fit});
  game.phase="result";
  renderArcher();
}
function kingdomMap(){
  var W=300, cols=15, rows=7, s=W/(Math.sqrt(3)*(cols+0.5)), hw=Math.sqrt(3)*s, H=Math.ceil(s*(1.5*(rows-1)+2));
  var seeds={dharma:[0.5*W,0.2*H],artha:[0.2*W,0.8*H],kama:[0.8*W,0.8*H]};
  var out="", count={dharma:0,artha:0,kama:0}, total=0;
  for(var r=0;r<rows;r++){for(var c=0;c<cols;c++){
    var x=hw*(c+0.5*(r&1))+hw/2, y=s+1.5*s*r, best="dharma", bd=1e9;
    Object.keys(seeds).forEach(function(k){var d=Math.hypot(x-seeds[k][0],y-seeds[k][1])/game.w[k];if(d<bd){bd=d;best=k}});
    count[best]++;total++;
    out+='<polygon class="hx k-'+best+'" points="'+corners(x,y,s*0.98).map(function(q){return f1(q[0])+","+f1(q[1])}).join(" ")+'"/>';
  }}
  var legend=["dharma","artha","kama"].map(function(k){
    var share=count[k]/total, word=share>0.42?T("swelling","ふくらむ"):share<0.26?T("small","小さい"):T("steady","落ち着き");
    return '<div><span class="sw k-'+k+'"></span><span>'+esc(tr(KING[k]))+'</span><span class="state">'+esc(tr(word))+'</span></div>';
  }).join("");
  return '<div class="kmap"><svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(tr(T("The archer's map of three kingdoms","射手の三国の地図")))+'">'+out+'</svg><div class="klegend">'+legend+'</div></div>';
}
function gaugeHTML(){
  var st=stageOf(game.p);
  return '<div class="gauge" aria-label="'+esc(tr(T("Pressure","圧の段")))+'">'+STAGES.map(function(n,i){return '<span class="'+(i===st?("on"+(i===3?" hot":"")):"")+'">'+esc(tr(n))+'</span>'}).join("")+'</div>';
}
function renderArcher(){
  var host=$("#archer");if(!host)return;
  host.setAttribute("aria-label",tr(T("The Charioteer and the Archer, a playable taste","『御者と射手』の体験版")));
  var h='';
  if(game.phase==="end"){
    h+='<div class="game-top"><p class="eyebrow">'+esc(tr(T("The archer's journey","射手の旅路")))+'</p>'+gaugeHTML()+'</div>';
    h+='<ul class="journey">'+game.log.map(function(e,i){
      var R=ROUNDS[e.r];
      return '<li><span class="n">'+(i+1)+'</span><span>'+esc(tr(R.name))+' → '+esc(tr(SEED[R.seed].name))+' · '+esc(tr(T("Gītā ","ギーター ")))+e.v+' · <b class="'+(e.fit?"yes":"")+'">'+esc(tr(e.fit?T("reached","届いた"):T("did not reach","届かなかった")))+'</b></span></li>';
    }).join("")+'</ul>';
    h+=kingdomMap();
    h+='<p class="scene"><span class="archer-say">'+esc(tr(T("In the game, you steadied someone else's mind. In Prakrti GSA, the archer is you.","ゲームでは、他人の心を整えました。Prakrti GSA では、射手はあなた自身です。")))+'</span></p>';
    h+='<div class="cta-row"><a class="btn btn-primary" href="'+url("starter")+'">'+esc(tr(T("Begin with the Starter Set","スターターセットから始める")))+'</a><a class="btn" href="'+url("engine")+'">'+esc(tr(T("How judging works","判定のしくみ")))+'</a></div>';
    h+='<button type="button" class="btn btn-sm" data-g="again" style="justify-self:start">'+esc(tr(T("Play again","もう一度遊ぶ")))+'</button>';
    host.innerHTML=h;return;
  }
  var R=ROUNDS[game.r];
  h+='<div class="game-top"><p class="eyebrow">'+esc(tr(T("A simplified taste · no AI","簡易版の体験 ・ AI なし")))+'</p>'+gaugeHTML()+'</div>';
  h+='<div class="scene"><p class="eyebrow">'+esc(L()==="ja"?("大会 ・ 第"+(game.r+1)+"回（全3回）"):("Tournament · round "+(game.r+1)+" of 3"))+'</p>';
  h+='<p class="say"><span class="who">'+esc(tr(T("Scene","場面")))+'</span>'+esc(tr(R.event))+'</p>';
  h+='<p class="say"><span class="who">'+esc(tr(T("Crowd","観衆")))+'</span>'+esc(tr(R.crowd))+'</p>';
  h+='<p class="archer-say"><span class="who">'+esc(tr(T("Archer","射手")))+'</span>'+esc(tr(R.archer))+'</p></div>';
  h+=kingdomMap();
  if(game.phase==="timeout"&&stageOf(game.p)===3){h+='<p class="note">'+esc(tr(T("The archer's mind is at breaking. The archer will not shoot until it settles.","射手の心は限りに達しています。心が整うまで、射手は射ません。")))+'</p>'}
  h+='<p class="eyebrow">'+esc(tr(T("Timeout · offer one verse","作戦タイム ・ 句を一枚差し出す")))+'</p>';
  h+='<div class="verses">'+game.order.map(function(v){
    var cls="verse", dis="";
    if(game.phase==="result"){dis=" disabled";if(v===game.pick){cls+=(VERSE[v].k===SEED[R.seed].k)?" reached":" missed"}}
    return '<button type="button" class="'+cls+'" data-v="'+v+'"'+dis+'><span class="ref">'+esc(tr(T("Gītā ","ギーター ")))+v+'</span><span>'+esc(tr(VERSE[v].text))+'</span></button>';
  }).join("")+'</div>';
  if(game.phase==="timeout"){
    h+='<p class="note">'+esc(tr(T("The cards do not say which mind they speak to. The verse text is the same as in the app's scripture library.","札には、どの心に向けた句かは書いてありません。句の訳は、アプリの聖典の書庫と同じものです。")))+'</p>';
  }else{
    var fit=VERSE[game.pick].k===SEED[R.seed].k, sd=SEED[R.seed];
    h+='<div class="result" aria-live="polite"><p class="verdict '+(fit?"ok":"no")+'">'+esc(tr(fit?T("The verse reached the archer","句が届いた"):T("The verse did not reach","句は届かなかった")))+'</p>';
    h+='<p class="archer-say" style="font-family:var(--font-display)"><span class="who">'+esc(tr(T("Archer","射手")))+'</span>'+esc(tr(fit?R.reached:R.missed))+'</p>';
    h+='<p class="note">'+esc(L()==="ja"?("この心の種は「"+tr(sd.name)+"」、国は"+tr(KING[sd.k])+"でした。"):("The seed of this mind was "+tr(sd.name)+", in the kingdom of "+tr(KING[sd.k])+"."))+(game.pick==="3.27"?" "+esc(tr(T("Yes, prakṛti is the same word as our product's name. We noticed.","プラクリティは、この製品の名前と同じ語です。気づいていました。"))):"")+'</p>';
    h+='<button type="button" class="btn btn-primary" data-g="next" style="justify-self:start">'+esc(tr(game.r<ROUNDS.length-1?T("Next round","次の回へ"):T("See the archer's journey","射手の旅路を見る")))+'</button></div>';
  }
  host.innerHTML=h;
}
/* ---------- the map of three kingdoms: the app's shapes, drawn as the site's three-colour mosaic ----------
   Same rules as the app (realmHex.ts, realmShapes.ts, mapReading.ts): sizes in five steps, kāma in the four steps of the
   pressure gauge, capitals placed by how near the bonds pull them, roads by bond, a freeze cuts every road and spends
   artha, joining a road loosens the alliance. The app paints only each kingdom's hexes on a dark board; the site gives
   every hex to the nearest capital (weighted by size), so the whole board shows the three colours. */
var REALMS=["dharma","artha","kama"];
var KAMA_SIZE={calm:.25,rising:.5,strained:.75,breaking:1};
var BOND_DIST={
  dk:{apart:1,near:.78,nearing:.78,parting:.84,joined:.58,cut:1.3},
  ak:{apart:1,near:.78,nearing:.78,parting:.84,joined:.58,cut:1.3},
  ad:{held:.85,thick:.66,strained:.85,loosened:1.1,cut:1.3}
};
var ROADS=[["dk","dharma","kama"],["ak","artha","kama"],["ad","artha","dharma"]];
var ROAD={joined:[3.2],held:[2],thick:[4.4],strained:[2,"9 3 2 3"],nearing:[1.6,"6 4"],near:[1.6,"6 4"],parting:[1.4,"3 6"],loosened:[1.6,"2 5"]};
function realmShape(c){
  var d={dharma:.75,artha:.75,kama:"calm",dk:"apart",ak:"apart",ad:"held",event:"none"},k;
  for(k in c)d[k]=c[k];
  if(d.event==="frozen")return {dharma:d.dharma,artha:0,kama:d.kama,dk:"cut",ak:"cut",ad:"cut",event:"frozen"};
  return {dharma:d.dharma,artha:d.artha,kama:d.event==="erupted"?"breaking":d.kama,dk:d.dk,ak:d.ak,
    ad:(d.dk==="joined"||d.ak==="joined")?"loosened":d.ad,event:d.event==="erupted"?"erupted":"none"};
}
function realmPositions(sh){
  var dAK=BOND_DIST.ak[sh.ak]||1, dAD=BOND_DIST.ad[sh.ad]||.85, dDK=BOND_DIST.dk[sh.dk]||1;
  var x=(dAD*dAD-dDK*dDK+dAK*dAK)/(2*dAK), y=-Math.sqrt(Math.max(0,dAD*dAD-x*x)), cx=(dAK+x)/3, cy=y/3;
  return {artha:[-cx,-cy],kama:[dAK-cx,-cy],dharma:[x-cx,y-cy]};
}
function realmBoard(cols,rows,W){
  var s=W/(Math.sqrt(3)*(cols+0.5)), hw=Math.sqrt(3)*s, cells=[];
  for(var r=0;r<rows;r++)for(var c=0;c<cols;c++)cells.push({c:c,r:r,x:hw*(c+0.5*(r&1))+hw/2,y:s+1.5*s*r});
  return {cols:cols,rows:rows,W:W,H:Math.ceil(s*(1.5*(rows-1)+2)),s:s,cells:cells};
}
function realmNbr(b,i,d){var cl=b.cells[i],v=((cl.r&1)?DO:DE)[d],c=cl.c+v[0],r=cl.r+v[1];return (c<0||r<0||c>=b.cols||r>=b.rows)?-1:r*b.cols+c}
function hexPts(cx,cy,s){return corners(cx,cy,s).map(function(q){return f1(q[0])+","+f1(q[1])}).join(" ")}
function realmLayout(b,sh){
  var pos=realmPositions(sh), U=b.W*0.5, ky=0.82, ox=b.W/2, oy=b.H*0.55, m=b.s*1.6, caps={}, used={};
  REALMS.forEach(function(k){
    var px=Math.max(m,Math.min(b.W-m,ox+pos[k][0]*U)), py=Math.max(m,Math.min(b.H-m,oy+pos[k][1]*U*ky)), best=-1, bd=1e9;
    b.cells.forEach(function(cl,i){if(used[i])return;var d=Math.hypot(cl.x-px,cl.y-py);if(d<bd){bd=d;best=i}});
    caps[k]=best;used[best]=1;
  });
  var w={dharma:.4+sh.dharma,artha:.4+sh.artha,kama:.4+KAMA_SIZE[sh.kama]};
  var owner=b.cells.map(function(cl){
    var best="dharma",bd=1e9;
    REALMS.forEach(function(k){var cp=b.cells[caps[k]],d=Math.hypot(cl.x-cp.x,cl.y-cp.y)/w[k];if(d<bd-1e-9){bd=d;best=k}});
    return best;
  });
  REALMS.forEach(function(k){owner[caps[k]]=k});
  return {owner:owner,caps:caps};
}
/* drawn above the tiles: hexes kāma spilled into, borders, roads, capitals */
function realmOverlay(b,sh,lay){
  var s=b.s, k=s/11.5*1.15, out="", i, d, n, cs, seen={};
  if(sh.event==="erupted"){
    for(i=0;i<b.cells.length;i++){if(lay.owner[i]!=="kama")continue;
      for(d=0;d<6;d++){n=realmNbr(b,i,d);if(n<0||seen[n]||lay.owner[n]==="kama")continue;seen[n]=1;
        out+='<polygon class="spill" points="'+hexPts(b.cells[n].x,b.cells[n].y,s*0.74)+'"/>'}}
  }
  if(sh.event!=="none"){
    for(i=0;i<b.cells.length;i++){for(d=0;d<6;d++){
      n=realmNbr(b,i,d);if(n<0||lay.owner[n]===lay.owner[i])continue;
      if(sh.event==="frozen"?n<i:lay.owner[i]!=="kama")continue;
      cs=corners(b.cells[i].x,b.cells[i].y,s);
      out+='<line class="bd '+(sh.event==="frozen"?"frost":"ember")+'" x1="'+f1(cs[d][0])+'" y1="'+f1(cs[d][1])+'" x2="'+f1(cs[(d+1)%6][0])+'" y2="'+f1(cs[(d+1)%6][1])+'"/>';
    }}
  }
  ROADS.forEach(function(rd){
    var st=ROAD[sh[rd[0]]];if(!st)return;
    var p=b.cells[lay.caps[rd[1]]], q=b.cells[lay.caps[rd[2]]];
    out+='<line class="rd" x1="'+f1(p.x)+'" y1="'+f1(p.y)+'" x2="'+f1(q.x)+'" y2="'+f1(q.y)+'" stroke-width="'+f1(st[0]*k)+'"'+(st[1]?' stroke-dasharray="'+st[1].split(" ").map(function(v){return f1(v*k)}).join(" ")+'"':'')+'/>';
  });
  REALMS.forEach(function(r){var c=b.cells[lay.caps[r]];out+='<polygon class="cap k-'+r+'" points="'+hexPts(c.x,c.y,s*0.5)+'"/>'});
  return out;
}
function realmSVG(b,sh,label){
  var lay=realmLayout(b,sh);
  return '<svg class="rmap'+(sh.event!=="none"?" ev-"+sh.event:"")+'" viewBox="0 0 '+b.W+' '+b.H+'" role="img" aria-label="'+esc(label)+'"><g class="rm-tiles">'+
    b.cells.map(function(cl,i){return '<polygon class="hx k-'+lay.owner[i]+'" points="'+hexPts(cl.x,cl.y,b.s*0.98)+'"/>'}).join("")+
    '</g><g class="rm-over">'+realmOverlay(b,sh,lay)+'</g></svg>';
}
var SIZE_W=[T("very small","ごく小さい"),T("small","小さい"),T("middling","中くらい"),T("large","大きい"),T("very large","とても大きい")];
var KAMA_W={calm:T("calm","静か"),rising:T("swelling","ふくらんできた"),strained:T("pressing at its borders","国境にせまっている"),breaking:T("about to overflow","国境をあふれかけている")};
function realmWords(sh){function z(v){return SIZE_W[Math.max(0,Math.min(4,Math.round(v*4)))]}return {dharma:z(sh.dharma),artha:z(sh.artha),kama:KAMA_W[sh.kama]}}
function realmLegend(sh){var w=realmWords(sh);return '<div class="rlegend">'+REALMS.map(function(k){return '<div><span class="sw k-'+k+'"></span><span class="nm">'+esc(tr(KING[k]))+'</span><span class="state">'+esc(tr(w[k]))+'</span></div>'}).join("")+'</div>'}
var BOND_W={
 dk:{near:T("Dharma and Kāma stand near each other","法と欲は近いところにある"),nearing:T("Dharma and Kāma are drawing closer","法と欲が近づいている"),parting:T("Dharma and Kāma are still near, but drifting apart","法と欲はまだ近いが、離れつつある"),joined:T("Dharma and Kāma have joined","法と欲が手を結んだ")},
 ak:{near:T("Artha and Kāma stand near each other","利と欲は近いところにある"),nearing:T("Artha and Kāma are drawing closer","利と欲が近づいている"),parting:T("Artha and Kāma are still near, but drifting apart","利と欲はまだ近いが、離れつつある"),joined:T("Artha and Kāma have joined","利と欲が手を結んだ")},
 ad:{thick:T("The alliance of Artha and Dharma has grown thick","利と法の同盟が太くなった"),strained:T("The alliance of Artha and Dharma is strained","利と法の同盟がきしんでいる"),loosened:T("The alliance of Artha and Dharma has come loose","利と法の同盟がほどけた")}
};
/* the map's sentence, as the app writes it under a scene (without the bracketed notes meant for looking back on a run) */
function realmSentence(sh){
  var ja=L()==="ja", w=realmWords(sh);
  var p=[ja?("法は"+w.dharma.ja+"・利は"+w.artha.ja+"・欲は"+w.kama.ja+"。"):("Dharma "+w.dharma.en+" · Artha "+w.artha.en+" · Kāma "+w.kama.en+".")];
  if(sh.event==="frozen"){p.push(tr(T("The three kingdoms stand isolated, and every road is cut.","三つの国が孤立し、道はすべて切れた。")))}
  else{
    var moved=["dk","ak","ad"].filter(function(k){return BOND_W[k][sh[k]]});
    if(!moved.length)p.push(tr(T("Artha and Dharma hold their usual alliance, and Kāma stands apart.","利と法はいつもの同盟を結び、欲は離れている。")));
    moved.forEach(function(k){p.push(tr(BOND_W[k][sh[k]])+(ja?"。":"."))});
  }
  if(sh.event==="erupted")p.push(tr(T("Kāma broke over its borders.","欲が国境を越えた。")));
  return p.join(ja?"":" ");
}
/* six scenes from the epic, seven maps (the app's MAP_SCENES; shapes are Prakrti GSA's reading, not the epic's own words) */
var SCENES=[
 {id:"dice",title:T("The dice game: Yudhiṣṭhira","骰子の賭け——ユディシュティラ"),short:T("The dice","骰子の賭け"),ref:T("Sabhā Parva","Sabhā Parva"),
  text:T("Reasoning that a challenge must not be refused, Yudhiṣṭhira sat down to the dice. He staked his wealth, his kingdom, his brothers, himself and at last Draupadī, and lost them all.","挑まれた勝負は断らないという理屈で、ユディシュティラは骰子の賭けに乗った。財も国も兄弟も、自分自身も、ついにはドラウパディーまで賭けて、すべてを失った。"),
  read:T("The desire to play joins hands with Artha's reckoning: riding desire's game on the reason that a challenge must not be refused. The rule, Dharma, lies near the desire as well, while the usual alliance of Artha and Dharma has come loose. As the losses mount, Artha grows small.","賭けの欲が、利の計算と手を結ぶ。断らないという理屈を付けて、欲の遊びに乗る。決まり（法）も欲の近くにあるが、利と法のいつもの同盟はほどけている。負けが重なり、利（心の体力）は小さい。"),
  hero:T("The desire to play joins hands with Artha's reckoning, riding desire's game on the reason that a challenge must not be refused.","賭けの欲が、利の計算と手を結ぶ。断らないという理屈を付けて、欲の遊びに乗る。"),
  maps:[{shape:realmShape({dharma:.5,artha:.25,kama:"strained",dk:"near",ak:"joined"})}]},
 {id:"eve",title:T("The eve of war: two at Dvārakā","前夜——ドヴァーラカーの二人"),short:T("The eve","前夜"),ref:T("Ganguli, Udyoga §7","Ganguli, Udyoga §7"),
  text:T("Before the war, Sri Krishna set two things before them: his army, and himself alone, who would not fight. Arjuna chose Sri Krishna, and when asked why, answered: “You are renowned, and I too seek fame.” Duryodhana got the army and was overjoyed, though he knew Sri Krishna was not on his side.","戦の前、聖クリシュナは二人の前に二つを置かれた。ご自身の軍勢と、戦わないご自身おひとり。アルジュナは聖クリシュナを選び、「なぜ」と問われて「あなたは名高い。私も名声を求める者です」と答えた。ドゥルヨーダナは軍勢を得て、聖クリシュナが自分の側にいないと知りながら、大いに喜んだ。"),
  read:T("On Arjuna's side, the heart that seeks renown, Kāma, joins hands with Sri Krishna, who will not fight, on the side of Dharma. On the side that took the army, Kāma joins the reckoning of numbers and strength, Artha. On both sides, the usual alliance of Artha and Dharma has come loose.","アルジュナの側では、名声を求める心（欲）が、戦わない聖クリシュナ、つまり法の側と手を結ぶ。軍勢を取った側では、欲が、数と力の計算（利）と手を結ぶ。どちらでも、利と法のいつもの同盟はほどけている。"),
  maps:[{label:T("Arjuna chooses Sri Krishna","アルジュナ——聖クリシュナを選ぶ"),title:T("The eve of war: Arjuna chooses Sri Krishna","前夜——聖クリシュナを選ぶアルジュナ"),short:T("The eve: Arjuna","前夜：アルジュナ"),hero:T("The heart that seeks renown, Kāma, joins hands with Sri Krishna, who will not fight: the side of Dharma.","名声を求める心（欲）が、戦わない聖クリシュナ、つまり法の側と手を結ぶ。"),shape:realmShape({dharma:.75,artha:.5,kama:"strained",dk:"joined"})},
        {label:T("Duryodhana takes the army","ドゥルヨーダナ——軍勢を取る"),title:T("The eve of war: Duryodhana takes the army","前夜——軍勢を取るドゥルヨーダナ"),short:T("The eve: Duryodhana","前夜：ドゥルヨーダナ"),hero:T("Kāma joins hands with the reckoning of numbers and strength, Artha.","欲が、数と力の計算（利）と手を結ぶ。"),shape:realmShape({dharma:.25,artha:.75,kama:"strained",ak:"joined"})}]},
 {id:"gita-open",title:T("The opening of the Gītā: Arjuna","ギーターの始め——アルジュナ"),short:T("Gītā, opening","ギーターの始め"),ref:T("Gītā 1.28–47, 2.9","ギーター 1.28–47、2.9"),
  text:T("Unable to raise his bow against his own, Arjuna cast it down, sat in the chariot, said “I will not fight” and fell silent.","身内に弓を向けられず、アルジュナは弓を捨てて戦車に座り込み、「戦わない」と言って黙った。"),
  read:T("The strength runs out and the hands stop. The three kingdoms stand isolated and every road is cut: a freeze. Dharma, his dread of the sin of killing his own, stays large, while Artha, the inner reserve, is spent.","力が尽きて、手が止まる。三つの国は孤立し、どの道も切れる。凍結です。身内を討つ罪を恐れる心（法）は大きいまま、利（心の体力）は尽きている。"),
  hero:T("The strength runs out and the hands stop. The three kingdoms stand isolated, and every road is cut: a freeze.","力が尽きて、手が止まる。三つの国は孤立し、どの道も切れる。凍結です。"),
  maps:[{shape:realmShape({dharma:.75,kama:"strained",event:"frozen"})}]},
 {id:"gita-end",title:T("The end of the Gītā: Arjuna","ギーターの終わり——アルジュナ"),short:T("Gītā, end","ギーターの終わり"),ref:T("Gītā 18.73","ギーター 18.73"),
  text:T("His confusion gone, Arjuna stood up and said to Sri Krishna, who held the reins: “I will do as you say.”","迷いが晴れたアルジュナは、手綱を取る聖クリシュナに「あなたの言葉のとおりにします」と言って立った。"),
  read:T("With the confusion gone, he stands. The alliance of Artha and Dharma grows thick, and Kāma is calm, lying near Dharma. This too is one shape among the others.","迷いが晴れて、立つ。利と法の同盟が太くなり、欲は静かで、法の近いところにある。これも、ほかの場面と並ぶ一つの形です。"),
  hero:T("With the confusion gone, he stands. The alliance of Artha and Dharma grows thick, and Kāma is calm, near Dharma.","迷いが晴れて、立つ。利と法の同盟が太くなり、欲は静かで、法の近くにある。"),
  maps:[{shape:realmShape({dharma:1,artha:.75,kama:"calm",dk:"near",ad:"thick"})}]},
 {id:"vow",title:T("After Abhimanyu's death: Arjuna's vow","アビマニユの死のあと——アルジュナの誓い"),short:T("The vow","誓い"),ref:T("Ganguli, Droṇa §73","Ganguli, Droṇa §73"),
  text:T("Learning of his son Abhimanyu's death, Arjuna vowed to slay Jayadratha before the next sunset, or else enter the fire.","息子アビマニユの死を知ったアルジュナは、「翌日の日没までにジャヤドラタを討つ。討てなければ火に入る」と誓った。"),
  read:T("The desire to strike joins hands with the vow, Dharma. Kāma is about to overflow its borders: desire can also run under the name of what is right.","討ちたいという欲が、誓い（法）と手を結ぶ。欲は国境をあふれかけている。正しさの名のもとに、欲が走ることもある。"),
  hero:T("The desire to strike joins hands with the vow, Dharma. Desire can also run under the name of what is right.","討ちたいという欲が、誓い（法）と手を結ぶ。正しさの名のもとに、欲が走ることもある。"),
  maps:[{shape:realmShape({dharma:1,artha:.5,kama:"breaking",dk:"joined"})}]},
 {id:"raid",title:T("Aśvatthāman's night raid","アシュヴァッターマンの夜襲"),short:T("The night raid","夜襲"),ref:T("Sauptika Parva","Sauptika Parva"),
  text:T("Taking his rage at his father Droṇa's death by deceit for justice, Aśvatthāman fell on the sleeping camp at night.","父ドローナを欺きで討たれた怒りを正しさと名乗り、アシュヴァッターマンは眠る陣を夜に襲った。"),
  read:T("Rage, Kāma, joins hands with Dharma, speaking in the name of what is right, and breaks over its borders: an eruption. The kingdom of Dharma itself is small.","怒り（欲）が正しさ（法）を名乗って手を結び、国境を越える。暴発です。法の国そのものは小さい。"),
  hero:T("Rage, Kāma, joins hands with Dharma, speaking in the name of what is right, and breaks over its borders: an eruption.","怒り（欲）が正しさ（法）を名乗って手を結び、国境を越える。暴発です。"),
  maps:[{shape:realmShape({dharma:.25,artha:.25,kama:"breaking",dk:"joined",event:"erupted"})}]}
];
var SCENE_BY={};SCENES.forEach(function(sc){SCENE_BY[sc.id]=sc});
var READING=T("Prakrti GSA's reading","Prakrti GSA の読み");
function frameLabel(sc,m){return tr(m.title||sc.title)}

/* the large map on the first page: the scenes play in turn; pause, choose, or hold still for reduced motion */
function realmHero(host){
  var frames=[];SCENES.forEach(function(sc){sc.maps.forEach(function(m){frames.push({sc:sc,m:m})})});
  var b=realmBoard(16,11,320), cur=0, still=false, held=false, seen=true, timer=null;
  frames.forEach(function(f,i){if(f.sc.id==="gita-end")cur=i});
  try{still=window.matchMedia("(prefers-reduced-motion: reduce)").matches}catch(e){}
  var lay=realmLayout(b,frames[cur].m.shape);
  var h='<div class="rp-top"><p class="eyebrow">'+esc(tr(T("Three kingdoms · scenes from the epic","三国の地図 ・ 叙事詩の場面")))+'</p><button type="button" class="btn btn-sm rp-play"></button></div>';
  h+='<div class="rp-map"><svg class="rmap" viewBox="0 0 '+b.W+' '+b.H+'" role="img"><g class="rm-tiles">'+b.cells.map(function(cl,i){return '<polygon class="hx k-'+lay.owner[i]+'" points="'+hexPts(cl.x,cl.y,b.s*0.98)+'"/>'}).join("")+'</g><g class="rm-over"></g></svg></div>';
  // each frame's words sit stacked in one cell, so the panel keeps the height of the longest and nothing below it jumps
  h+='<div class="rp-frames rp-legends" aria-hidden="true">'+frames.map(function(f,i){return '<div class="rp-frame" data-i="'+i+'">'+realmLegend(f.m.shape)+'</div>'}).join("")+'</div>';
  h+='<div class="rp-scenes" role="group" aria-label="'+esc(tr(T("Scenes","場面")))+'">'+frames.map(function(f,i){return '<button type="button" data-rf="'+i+'">'+esc(tr(f.m.short||f.sc.short))+'</button>'}).join("")+'</div>';
  h+='<div class="rp-frames rp-caps">'+frames.map(function(f,i){
    return '<div class="rp-frame" data-i="'+i+'"><p class="rp-title">'+esc(frameLabel(f.sc,f.m))+' <span class="rp-ref">'+esc(tr(f.sc.ref))+'</span></p><p class="rp-read">'+esc(tr(f.m.hero||f.sc.hero))+'</p></div>';
  }).join("")+'</div>';
  h+='<p class="rp-note">'+esc(tr(T("The shapes are Prakrti GSA's reading of the scenes. No shape is a failure.","形は、Prakrti GSA による場面の読みです。どの形も、失敗ではありません。")))+' <a class="link-arrow" href="'+url("engine")+'#scenes">'+esc(tr(T("How to read the map","地図の読み方")))+'</a></p>';
  host.innerHTML=h;
  host.setAttribute("role","region");
  host.setAttribute("aria-label",tr(T("The map of three kingdoms","三国の地図")));
  var svg=$("svg",host), tiles=$$(".hx",svg), over=$(".rm-over",svg), btn=$(".rp-play",host), box=$(".rp-caps",host);
  function show(i,byHand){
    cur=i;var f=frames[i], sh=f.m.shape, ly=realmLayout(b,sh);
    tiles.forEach(function(el,j){el.setAttribute("class","hx k-"+ly.owner[j])});
    svg.setAttribute("class","rmap"+(sh.event!=="none"?" ev-"+sh.event:""));
    svg.setAttribute("aria-label",frameLabel(f.sc,f.m)+". "+realmSentence(sh));
    over.innerHTML=realmOverlay(b,sh,ly);
    $$(".rp-frame",host).forEach(function(el){el.classList.toggle("on",+el.getAttribute("data-i")===i)});
    $$("[data-rf]",host).forEach(function(el){el.setAttribute("aria-pressed",String(+el.getAttribute("data-rf")===i))});
    box.setAttribute("aria-live",byHand?"polite":"off");
  }
  function label(){btn.textContent=still?tr(T("Play","再生")):tr(T("Pause","一時停止"));btn.setAttribute("aria-label",still?tr(T("Play the scenes","場面を順に流す")):tr(T("Pause the scenes","場面を止める")))}
  function tick(){if(!still&&!held&&seen&&!document.hidden)show((cur+1)%frames.length,false)}
  host.addEventListener("click",function(e){
    var t=e.target.closest("[data-rf]");
    if(t){still=true;label();show(+t.getAttribute("data-rf"),true);return}
    if(e.target.closest(".rp-play")){still=!still;label();if(!still)tick()}
  });
  host.addEventListener("mouseenter",function(){held=true});
  host.addEventListener("mouseleave",function(){held=false});
  host.addEventListener("focusin",function(){held=true});
  host.addEventListener("focusout",function(e){if(!host.contains(e.relatedTarget))held=false});
  if(window.IntersectionObserver){new IntersectionObserver(function(es){seen=es[0].isIntersecting}).observe(host)}
  label();show(cur,false);
  timer=setInterval(tick,6500);
}

/* the scenes, all seven maps, for the page on judging */
function realmGallery(host){
  var b=realmBoard(16,11,320);
  host.innerHTML=SCENES.map(function(sc){
    return '<article class="rcard'+(sc.maps.length>1?" wide":"")+'"><p class="eyebrow">'+esc(tr(sc.ref))+'</p><h3>'+esc(tr(sc.title))+'</h3><p class="rc-text">'+esc(tr(sc.text))+'</p><div class="rc-maps">'+
      sc.maps.map(function(m){return '<figure>'+(m.label?'<figcaption class="rc-label">'+esc(tr(m.label))+'</figcaption>':'')+realmSVG(b,m.shape,frameLabel(sc,m)+". "+realmSentence(m.shape))+'<p class="rc-sent">'+esc(realmSentence(m.shape))+'</p></figure>'}).join("")+
      '</div><p class="rc-read"><span class="rc-k">'+esc(tr(READING))+'</span>'+esc(tr(sc.read))+'</p></article>';
  }).join("")+'<article class="rcard wide rc-close"><p>'+esc(tr(T("The same Arjuna freezes at the opening of the Gītā, stands with the reins in Sri Krishna's hands at its end, and after Abhimanyu's death finds Dharma and Kāma joined. A shape is not a kind of person but a picture of how the mind moved at that moment. No shape is a failure.","同じアルジュナが、ギーターの始めでは凍り、終わりでは手綱を預けて立ち、アビマニユの死のあとでは法と欲が手を結ぶ。形は人の種類ではなく、その時の心の動きの写しです。どの形も、失敗ではありません。")))+'</p></article>';
}
/* one still map: of a scene (<div data-realm-map="gita-end" data-frame="0">, for the share images)
   or of a shape written out (<div data-realm-shape='{"kama":"strained","dk":"nearing"}'>, for an example) */
function realmStill(host){
  var sh, label;
  if(host.hasAttribute("data-realm-shape")){
    try{sh=realmShape(JSON.parse(host.getAttribute("data-realm-shape")))}catch(e){return}
    label=tr(T("Map of three kingdoms","三国の地図"))+". "+realmSentence(sh);
  }else{
    var sc=SCENE_BY[host.getAttribute("data-realm-map")];if(!sc)return;
    var m=sc.maps[+(host.getAttribute("data-frame")||0)]||sc.maps[0];
    sh=m.shape;label=frameLabel(sc,m)+". "+realmSentence(sh);
  }
  host.innerHTML=realmSVG(realmBoard(16,11,320),sh,label)+(host.hasAttribute("data-legend")?realmLegend(sh):"");
}

document.addEventListener("click",function(e){
  var host=$("#archer");if(!host||!host.contains(e.target))return;
  var v=e.target.closest("[data-v]");if(v&&!v.disabled){pickVerse(v.getAttribute("data-v"));return}
  var g=e.target.closest("[data-g]");if(!g)return;
  var a=g.getAttribute("data-g");
  if(a==="next"){if(game.r<ROUNDS.length-1){startRound(game.r+1)}else{game.phase="end"}renderArcher()}
  else if(a==="again"){newGame();renderArcher()}
});

/* ---------- Vibhakti, the declension game ---------- */
var CASES=[
 {id:"nom",en:"Nominative",ja:"主格",sa:"prathamā"},{id:"acc",en:"Accusative",ja:"対格",sa:"dvitīyā"},
 {id:"ins",en:"Instrumental",ja:"具格",sa:"tṛtīyā"},{id:"dat",en:"Dative",ja:"与格",sa:"caturthī"},
 {id:"abl",en:"Ablative",ja:"奪格",sa:"pañcamī"},{id:"gen",en:"Genitive",ja:"属格",sa:"ṣaṣṭhī"},
 {id:"loc",en:"Locative",ja:"処格",sa:"saptamī"},{id:"voc",en:"Vocative",ja:"呼格",sa:"sambodhana"}
];
var CASE_BY={};CASES.forEach(function(c){CASE_BY[c.id]=c});
var WORDS=[
 {deva:"कुरुक्षेत्रे",iast:"kurukṣetre",ref:"1.1",ans:"loc",num:T("singular","単数"),gloss:T("“in Kurukṣetra”","「クルクシェートラにおいて」"),note:T("The Gītā's first two words are both locatives. Before anyone speaks, it tells you where you are.","ギーターの最初の二語は、どちらも処格です。誰かが口を開く前に、どこにいるかを告げています。")},
 {deva:"सञ्जय",iast:"sañjaya",ref:"1.1",ans:"voc",num:T("singular","単数"),gloss:T("“O Sañjaya”","「サンジャヤよ」"),note:T("The blind king is calling his narrator. Everything after this, technically, is the answer.","盲目の王が、語り手を呼んでいます。このあとのギーター全体が、じつはその答えです。")},
 {deva:"युयुत्सवः",iast:"yuyutsavaḥ",ref:"1.1",ans:"nom",num:T("plural","複数"),gloss:T("“those eager to fight”","「戦いを望む者たち」"),note:T("Many subjects, one wish. The grammar is calmer than the armies.","主語はたくさん、望みは一つ。文法のほうが、軍勢より落ち着いています。")},
 {deva:"आत्मानम्",iast:"ātmānam",ref:"6.5",ans:"acc",num:T("singular","単数"),gloss:T("“the self”, the one being lifted","「自己を」（引き上げられる側）"),note:T("“Lift the self by the self.” Here, grammatically, you are the luggage.","「自己を自己によって引き上げよ」。ここでのあなたは、文法上、荷物の側です。")},
 {deva:"आत्मना",iast:"ātmanā",ref:"6.5",ans:"ins",num:T("singular","単数"),gloss:T("“by the self”","「自己によって」"),note:T("Same verse, same self. Now you are also the crane.","同じ句、同じ自己。今度は、持ち上げるクレーンの側です。")},
 {deva:"परित्राणाय",iast:"paritrāṇāya",ref:"4.8",ans:"dat",num:T("singular","単数"),gloss:T("“for the protection”","「守るために」"),note:T("A dative of purpose. Sanskrit gives the reason with the case for “to” and “for”.","目的の与格。サンスクリットは「〜のために」の格で、理由を語ります。")},
 {deva:"कामात्",iast:"kāmāt",ref:"2.62",ans:"abl",num:T("singular","単数"),gloss:T("“from desire”","「欲から」"),note:T("The case of origins. In this verse, the origin of trouble.","起源の格。この句では、厄介ごとの起源です。")},
 {deva:"साधूनाम्",iast:"sādhūnām",ref:"4.8",ans:"gen",num:T("plural","複数"),gloss:T("“of the good”","「善き人々の」"),note:T("Possession and relation. The good, at least, come in the plural.","所有と関係の格。善き人は、少なくとも複数形でいてくれます。")}
];
var vib={i:0,correct:0,answer:null};
function caseName(c){return L()==="ja"?c.ja:c.en}
function renderVib(){
  var host=$("#vib");if(!host)return;
  var h="";
  if(vib.i>=WORDS.length){
    h+='<p class="eyebrow">Vibhakti</p><h3>'+esc(L()==="ja"?("八つのうち "+vib.correct+" つを当てました。"):("You named "+vib.correct+" of 8 cases."))+'</h3>';
    h+='<p>'+esc(tr(T("No leaderboard will hear about it. In the app, the game draws on the paradigm tables behind every analyzed verse.","この数は、どの順位表にも載りません。アプリの本編では、解析済みの全句の変化表から出題します。")))+'</p>';
    h+='<button type="button" class="btn btn-sm" data-vb="again" style="justify-self:start">'+esc(tr(T("Play again","もう一度遊ぶ")))+'</button>';
    host.innerHTML=h;return;
  }
  var w=WORDS[vib.i];
  h+='<div class="game-top"><p class="eyebrow">Vibhakti · '+esc(L()==="ja"?(WORDS.length+"語のうち "+(vib.i+1)+" 語目 ・ 正解 "+vib.correct):("word "+(vib.i+1)+" of "+WORDS.length+" · "+vib.correct+" correct"))+'</p><p class="eyebrow">'+esc(tr(T("Gītā ","ギーター ")))+w.ref+'</p></div>';
  h+='<div class="vib-word"><span class="deva" lang="sa">'+w.deva+'</span><span class="iast" lang="sa-Latn">'+w.iast+'</span></div>';
  h+='<p class="eyebrow">'+esc(tr(T("Which case is it?","この語の格は？")))+'</p>';
  h+='<div class="cases">'+CASES.map(function(c){
    var cls="case", dis="";
    if(vib.answer){dis=" disabled";if(c.id===w.ans)cls+=" right";else if(c.id===vib.answer)cls+=" wrong"}
    return '<button type="button" class="'+cls+'" data-case="'+c.id+'"'+dis+'><span>'+esc(caseName(c))+'</span><small>'+c.sa+'</small></button>';
  }).join("")+'</div>';
  if(vib.answer){
    var ok=vib.answer===w.ans, c=CASE_BY[w.ans];
    h+='<div class="result" aria-live="polite"><p class="verdict '+(ok?"ok":"no")+'">'+esc(tr(ok?T("Correct","正解"):T("Not quite","おしい")))+'</p>';
    h+='<p>'+esc(caseName(c)+(L()==="ja"?"・":", ")+tr(w.num)+(L()==="ja"?"　":": ")+tr(w.gloss))+'</p>';
    h+=tikaInline(w.note);
    h+='<button type="button" class="btn btn-primary btn-sm" data-vb="next" style="justify-self:start">'+esc(tr(vib.i<WORDS.length-1?T("Next word","次の語へ"):T("See the result","結果を見る")))+'</button></div>';
  }
  host.innerHTML=h;
}
document.addEventListener("click",function(e){
  var host=$("#vib");if(!host||!host.contains(e.target))return;
  var c=e.target.closest("[data-case]");
  if(c&&!c.disabled&&!vib.answer){vib.answer=c.getAttribute("data-case");if(vib.answer===WORDS[vib.i].ans)vib.correct++;renderVib();return}
  var b=e.target.closest("[data-vb]");if(!b)return;
  if(b.getAttribute("data-vb")==="next"){vib.i++;vib.answer=null}else{vib={i:0,correct:0,answer:null}}
  renderVib();
});

/* ---------- menu, copy buttons, start ---------- */
/* ---------- Yātrā: a taste of chapter 1 (one card, one scripted reply, one fragment) ---------- */
var YD=[
 {say:T("You wrote “again”. Has it happened before?","「また」と書きましたね。前にもあったのですか。"),
  part:T("Hidden want","本音"),frag:T("I don't want to be disliked.","嫌われたくない")},
 {say:T("What did you not say back: the words, or the moment?","言い返せなかったのは、言葉ですか。それとも、その瞬間ですか。"),
  part:T("Crack","亀裂"),frag:T("Silent exactly when it matters.","言うべきときに、黙る")},
 {say:T("When did you decide it?","それを決めたのは、いつでしたか。"),
  part:T("Method","手順"),frag:T("Start once the mood is right.","気分が整ってから始める")}
];
function yatraDemo(host){
  var out=$(".yd-out",host), cards=$$(".yd-card",host), road=$$(".yd-road li",host);
  cards.forEach(function(b){b.setAttribute("aria-pressed","false")});
  host.addEventListener("click",function(e){
    var b=e.target.closest(".yd-card");if(!b)return;
    var d=YD[+b.getAttribute("data-yd")];if(!d)return;
    cards.forEach(function(c){var on=c===b;c.classList.toggle("picked",on);c.setAttribute("aria-pressed",String(on))});
    out.innerHTML='<div class="talk"><p class="ai"><span class="who">Prakrti · '+esc(tr(T("script","台本")))+'</span>'+esc(tr(d.say))+'</p></div>'+
      '<div class="yd-frag"><span class="yd-fk">'+esc(tr(T("Fragment card","断片の札")))+' · '+esc(tr(d.part))+'</span><span class="yd-ft">'+esc(tr(d.frag))+'</span></div>'+
      '<p class="yd-next">'+esc(tr(T("In the game, fragments like this become the fields of your first Sutra. Next: dialogue and the allegory play.","ゲームでは、こうした断片が、最初の Sutra の欄の材料になります。次の章は、対話と寓話劇です。")))+'</p>';
    if(road[1])road[1].classList.add("next");
  });
}

var menuBtn=$("#menu-btn"), nav=$("#site-nav");
if(menuBtn&&nav){
  menuBtn.addEventListener("click",function(){var o=!nav.classList.contains("open");nav.classList.toggle("open",o);menuBtn.setAttribute("aria-expanded",String(o))});
}
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-copy]");if(!b)return;
  var row=b.closest(".copy-row")||b.parentNode, text=b.getAttribute("data-copy"), done=row.querySelector("[data-copied]"), mail=row.querySelector(".mail");
  function shown(){if(done){done.hidden=false;setTimeout(function(){done.hidden=true},1800)}}
  function selectIt(){if(!mail)return;var r=document.createRange();r.selectNodeContents(mail);var s=window.getSelection();s.removeAllRanges();s.addRange(r)}
  try{navigator.clipboard.writeText(text).then(shown,selectIt)}catch(err){selectIt()}
});
$$("[data-map]").forEach(function(h){makeMap(h)});
renderGazetteer();
if($("#archer")){newGame();renderArcher()}
$$("[data-realm-hero]").forEach(realmHero);
$$("[data-realm-gallery]").forEach(realmGallery);
$$("[data-realm-map],[data-realm-shape]").forEach(realmStill);
if($("#vib")){renderVib()}
$$("[data-yatra-demo]").forEach(yatraDemo);
maps.forEach(function(m){m.layout(false)});
/* Japanese browsers that land on an English page: offer the Japanese page once */
(function(){
  var want=false;
  try{
    var nl=(navigator.languages&&navigator.languages[0])||navigator.language||"";
    want=L()==="en"&&/^ja\b/i.test(nl)&&localStorage.getItem("prakrti.langbar")!=="x";
  }catch(e){want=L()==="en"&&/^ja/i.test(navigator.language||"")}
  var ja=document.querySelector('.lang a[hreflang="ja"]');
  if(!want||!ja)return;
  var bar=document.createElement("div");
  bar.className="langbar";bar.setAttribute("lang","ja");
  bar.innerHTML='<a href="'+ja.getAttribute("href")+'">日本語のページで見る</a><button type="button" aria-label="閉じる">×</button>';
  bar.querySelector("button").addEventListener("click",function(){try{localStorage.setItem("prakrti.langbar","x")}catch(e){}bar.remove()});
  document.body.insertBefore(bar,document.body.firstChild);
})();
})();

