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
  later:T("Opens in stages after launch","一般公開のあと、順に開きます")
};
var CH={s:T("Starter Set · lit","スターターセット ・ 明るい場所"),"1":T("Chapter १ · Your own archer","第一章 ・ 自分の射手"),"2":T("Chapter २ · Into the world","第二章 ・ 世界へ"),"3":T("Chapter ३ · With companions","第三章 ・ 仲間と")};
var LINKS={starter:T("Open the Starter Set","スターターセットへ"),rpd:T("About Mahābhārata RPD","Mahābhārata RPD について"),engine:T("How judging works","判定のしくみへ"),premium:T("What Premium opens","Premium で開くもの"),schools:T("For yoga schools","ヨガの学校へ")};
var PLACES=[
 {id:"archer",ch:"s",name:T("The Charioteer and the Archer","御者と射手"),short:T("Charioteer & Archer","御者と射手"),
  desc:T("Drive the chariot while the archer shoots. When the crowd shakes the archer's mind, stop for a Timeout and offer one of three verses. The archer's mind runs on the same formula as the Arena.","射手が射るあいだ、戦車を操ります。観衆の声で射手の心が揺れたら、作戦タイムで三枚の句から一枚を差し出します。射手の心は、The Arena と同じ式で動いています。"),
  status:["free","noai","guest"],page:"starter",app:"/mahabharata/krida"},
 {id:"rpd0",ch:"s",name:T("RPD · Fetching Water, Episode 0","RPD『水を汲みに』第0話"),short:T("RPD Episode 0","RPD 第0話"),
  desc:T("Sri Krishna asks you for water, and a life begins in a village at the edge of the desert. A solo story with no game master, played on screen.","聖クリシュナに水を頼まれ、砂漠の外れの村で一つの人生が始まります。GM のいない一人用の物語で、画面の上で遊びます。"),
  status:["starter","noai"],page:"rpd",app:"/mahabharata/works"},
 {id:"verse",ch:"s",name:T("The verse board and the language room","聖句盤と語学教室"),short:T("Verse Board","聖句盤"),
  desc:T("Every verse of the Gītā and the Yoga Sūtras with the Sanskrit, a translation and a full grammatical analysis. The language room turns the grammar into quizzes, and Vibhakti, a declension game, is being added.","ギーターとヨーガ・スートラの全句を、原文・訳・文法解析つきで読めます。語学教室では、文法をクイズで遊べます。格変化ゲーム『Vibhakti』も加える予定です。"),
  status:["free","noai","read"],page:"starter",app:"/scripture"},
 {id:"prism",ch:"1",name:T("Prism","Prism"),short:T("Prism","Prism"),
  desc:T("Write a single line and the AI scans it for fragments of the structure of your mind. It is the lightest way into dialogue.","一行書くと、AI が心の構造の断片を読み取ります。対話へのいちばん軽い入口です。"),
  status:["daily","unlimited"],page:"premium"},
 {id:"kuru",ch:"1",name:T("Kurukshetra, the workshop","Kurukshetra（工房）"),short:T("Kurukshetra","Kurukshetra"),
  desc:T("Write and version your Sutras, build counterparts, run test runs, read the observation report, and keep private notes in the margin.","Sutra を書いて版を重ね、相手役を作り、試走し、観測レポートを読み、余白に私的なメモを残します。"),
  status:["freeWrite","testruns"],page:"engine"},
 {id:"trial",ch:"1",name:T("Field Trial","Field Trial"),short:T("Field Trial","Field Trial"),
  desc:T("Register in advance which version you will try and in what situation. Afterwards, record once: held, wavered, breached, or did not occur.","どの版を、どんな場面で試すかを先に登録し、あとで一度だけ記録します。持ちこたえた・揺らいだ・破られた・場面が来なかった。"),
  status:["records","noai"],page:"engine"},
 {id:"hall",ch:"2",name:T("The scripture hall","聖典の間"),short:T("Scripture Hall","聖典の間"),
  desc:T("Start a dialogue from a verse. One conversation becomes one interpretation that you can publish, fork or keep for yourself.","聖句から対話を始めます。一つの対話が一つの解釈になり、公開・fork・秘蔵ができます。"),
  status:["premium","chariot"],page:"premium"},
 {id:"arena",ch:"2",name:T("The Arena","The Arena"),short:T("The Arena","The Arena"),
  desc:T("Publish a card and open one door: Challenge, Blueprint or Bounty. Broken cards receive patches, and a merged patch becomes a co-authored story. The Hall of Fame shows how cards broke and were repaired.","カードを公開して、扉を一つ開けます（Challenge・Blueprint・Bounty）。折れたカードには patch が届き、merge すると共著の物語になります。殿堂には、どう折れてどう直ったかが並びます。"),
  status:["premium"],page:"premium"},
 {id:"exchange",ch:"2",name:T("The Exchange","Exchange"),short:T("Exchange","Exchange"),
  desc:T("Counterparts change hands. Fork them, trade copies by name, or take in a one-of-a-kind card that has passed through many owners.","相手役の型が、手から手へ渡ります。fork、名指しの交換、多くの持ち主を経てきた一点ものの引き取り。"),
  status:["premium"],page:"premium"},
 {id:"ashram",ch:"3",name:T("Ashrams","Ashram"),short:T("Ashrams","Ashram"),
  desc:T("Rooms with faces, between yourself and the world. Private rooms are free to open. With a School License, trainees use the AI inside the room.","自分と世界のあいだにある、顔の見える部屋。Private な部屋は無料で開けます。School License があれば、受講生は部屋の中で AI を使えます。"),
  status:["free","school"],page:"schools"},
 {id:"tables",ch:"3",name:T("Classroom tables","教室の卓"),short:T("RPD Tables","教室の卓"),
  desc:T("Play Mahābhārata RPD together. Human game masters are free in every Ashram, and an AI game master comes with a School License. Dice settle what bodies do; the Sutra engine settles what minds do.","Mahābhārata RPD を一緒に遊びます。人の GM の卓はすべての Ashram で無料、AI の GM は School License で使えます。ダイスが体の行いを、Sutra 判定が心の動きを決めます。"),
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
var SEEDS_L={archer:[.12,.86],rpd0:[.38,.89],verse:[.64,.85],prism:[.87,.64],kuru:[.57,.62],trial:[.27,.65],hall:[.13,.40],arena:[.43,.38],exchange:[.73,.41],ashram:[.90,.15],tables:[.70,.12],karuta:[.50,.16],board:[.30,.11],shop:[.10,.17]};
var SEEDS_P={archer:[.18,.93],rpd0:[.50,.95],verse:[.82,.91],prism:[.82,.74],kuru:[.50,.71],trial:[.18,.74],hall:[.18,.52],arena:[.50,.50],exchange:[.82,.53],ashram:[.82,.31],tables:[.50,.29],karuta:[.18,.32],board:[.30,.10],shop:[.70,.10]};
var DE=[[1,0],[0,1],[-1,1],[-1,0],[-1,-1],[0,-1]], DO=[[1,0],[1,1],[0,1],[-1,0],[0,-1],[1,-1]];
function hsh(a,b,c){var x=Math.sin(a*127.1+b*311.7+c*74.7)*43758.5453;return x-Math.floor(x)}
function corners(cx,cy,s){var p=[];for(var i=0;i<6;i++){var a=Math.PI/180*(60*i-30);p.push([cx+s*Math.cos(a),cy+s*Math.sin(a)])}return p}
function f1(n){return Math.round(n*10)/10}
var fog={lifted:false,seen:{}};
var selected="archer";
function fogged(p){return p.ch!=="s"&&!fog.lifted&&!fog.seen[p.id]}
var maps=[];

function chipsHTML(keys){return '<div class="chips">'+keys.map(function(k){return '<span class="chip chip-'+k+'">'+esc(tr(STATUS[k]))+'</span>'}).join("")+'</div>'}

function makeMap(host){
  host.innerHTML='<div class="map-tools"><p class="eyebrow map-hint"></p><button type="button" class="btn btn-sm" data-act="fog"></button></div><div class="map-frame"><svg class="world-svg" role="img" xmlns="http://www.w3.org/2000/svg"></svg></div><div class="map-below"><div class="atlas"></div><div class="panel place-panel" aria-live="polite"></div></div>';
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
    var hp=pts[0], here='<g class="here" transform="translate('+f1(hp[0])+','+f1(hp[1])+')"><circle r="16"/>'+(portrait?'':'<text x="-10" y="-24" text-anchor="start">'+esc(tr(T("You are here · locative case","いまここ ・ 処格")))+'</text>')+'</g>';
    svg.setAttribute("viewBox","0 0 "+W+" "+H);
    svg.setAttribute("aria-label",tr(T("Map of the Prakrti GSA world. The Starter Set is lit; the other places are covered by fog until you select them.","Prakrti GSA の世界地図。スターターセットだけが明るく、ほかの場所は選ぶまで霧に覆われています。")));
    svg.innerHTML='<g>'+polys+'</g><g>'+bord+'</g><g>'+road+'</g>'+here+'<g>'+labs+'</g>';
  }
  function paint(){
    if(!svg.firstChild)return;
    $$(".wc",svg).forEach(function(el){var p=BY[el.getAttribute("data-id")];el.setAttribute("class","wc ch-"+p.ch+(fogged(p)?" fog":"")+(p.id===selected?" sel":""))});
    $$(".wb",svg).forEach(function(el){var a=BY[el.getAttribute("data-a")],b=BY[el.getAttribute("data-b")];el.setAttribute("class","wb"+(fogged(a)&&fogged(b)?" dim":""))});
    $$(".road",svg).forEach(function(el){var a=BY[el.getAttribute("data-a")],b=BY[el.getAttribute("data-b")];el.setAttribute("class","road"+(fogged(a)||fogged(b)?" dim":""))});
    $$(".wl",svg).forEach(function(el){var p=BY[el.getAttribute("data-id")];el.setAttribute("class","wl"+(fogged(p)?" dim":"")+(p.id===selected?" sel":""))});
    $(".map-hint",host).textContent=tr(T("Select a place on the map or in the list","地図か一覧から場所を選んでください"));
    $("[data-act=fog]",host).textContent=fog.lifted?tr(T("Bring back the fog","霧を戻す")):tr(T("Lift the fog · for cartographers","霧を晴らす（地図好きの方へ）"));
    var groups={s:[],"1":[],"2":[],"3":[]};
    PLACES.forEach(function(p){groups[p.ch].push(p)});
    $(".atlas",host).innerHTML=["s","1","2","3"].map(function(g){
      return '<div><h4>'+esc(tr(CH[g]))+'</h4>'+groups[g].map(function(p){
        var f=fogged(p);
        return '<button type="button" class="place'+(f?" fogged":"")+'" data-id="'+p.id+'" aria-pressed="'+(p.id===selected)+'"><span class="n">'+p.n+'</span><span class="nm">'+esc(tr(p.name))+'</span>'+(f?'<span class="fogmark">'+esc(tr(T("in fog","霧の中")))+'</span>':'')+'</button>';
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
    var t=e.target.closest("[data-act],[data-id]");
    if(!t||!host.contains(t))return;
    if(t.getAttribute("data-act")==="fog"){fog.lifted=!fog.lifted;paintAll();return}
    var id=t.getAttribute("data-id");
    if(id&&BY[id]){selected=id;fog.seen[id]=true;paintAll()}
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
 "2.63":{k:"kama",text:T("From anger comes confusion; from confusion, a lapse of memory; from that lapse, the loss of discernment; and when discernment is lost, one is lost.","怒りから迷いが生じ、迷いから記憶が乱れる。記憶が乱れれば判断が失われ、判断を失えば、その人は滅びる。")},
 "2.3":{k:"artha",text:T("Do not give in to faintheartedness. It does not become you. Shake off this small weakness of the heart and stand up.","臆する心に身を任せるな。それはあなたにふさわしくない。この小さな心の弱さを振り払い、立ち上がれ。")},
 "3.27":{k:"dharma",text:T("All actions are carried out by the qualities of prakṛti. One confused by the ego thinks, “I am the doer.”","すべての行為は、プラクリティのグナによってなされる。我執に惑う者は「わたしが為している」と思う。")}
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
  h+='<div class="game-top"><p class="eyebrow">'+esc(tr(T("A playable taste · no AI","ここで遊べる体験版 ・ AI なし")))+'</p>'+gaugeHTML()+'</div>';
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
    h+='<p class="note">'+esc(tr(T("The cards do not say which mind they speak to. Translations here are working renderings; in the app, verse text comes from the scripture library.","札には、どの心に向けた句かは書いてありません。ここの訳は仮の訳で、アプリでは句の本文を聖典のデータから引きます。")))+'</p>';
  }else{
    var fit=VERSE[game.pick].k===SEED[R.seed].k, sd=SEED[R.seed];
    h+='<div class="result" aria-live="polite"><p class="verdict '+(fit?"ok":"no")+'">'+esc(tr(fit?T("The verse reached the archer","句が届いた"):T("The verse did not reach","句は届かなかった")))+'</p>';
    h+='<p class="archer-say" style="font-family:var(--font-display)"><span class="who">'+esc(tr(T("Archer","射手")))+'</span>'+esc(tr(fit?R.reached:R.missed))+'</p>';
    h+='<p class="note">'+esc(L()==="ja"?("この心の種は「"+tr(sd.name)+"」、国は"+tr(KING[sd.k])+"でした。"):("The seed of this mind was "+tr(sd.name)+", in the kingdom of "+tr(KING[sd.k])+"."))+(game.pick==="3.27"?" "+esc(tr(T("Yes, prakṛti is the same word as our product's name. We noticed.","プラクリティは、この製品の名前と同じ語です。気づいていました。"))):"")+'</p>';
    h+='<button type="button" class="btn btn-primary" data-g="next" style="justify-self:start">'+esc(tr(game.r<ROUNDS.length-1?T("Next round","次の回へ"):T("See the archer's journey","射手の旅路を見る")))+'</button></div>';
  }
  host.innerHTML=h;
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
if($("#vib")){renderVib()}
maps.forEach(function(m){m.layout(false)});
})();
