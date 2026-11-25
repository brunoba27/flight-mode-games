'use strict';
const TEAMS=['Sky Warriors','Cloud Ninjas','Turbulence','No Wi-Fi','The Pilots','High Flyers','Airborne','Zero Latency','Flight Legends','Terminal Velocity'];
const KEY='fmg-profile-v1', SCORES='fmg-scores-v1';
const $=s=>document.querySelector(s);
const load=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}};
let profile=load(KEY,{nickname:'',team:0}), scores=load(SCORES,{});
let activeGame=null, gameState=null;
const trivia=[
['Which phrase best describes a great team?',['Trust and teamwork','Reply-all to everything','More meetings','No coffee'],'Trust and teamwork'],
['What should you do before sharing a colleague photo?',['Post immediately','Get their permission','Tag everyone','Add a funny filter'],'Get their permission'],
['What is the best meeting length?',['One that has a clear purpose','Seven hours','Until the snacks run out','No agenda ever'],'One that has a clear purpose'],
['What does a good teammate do?',['Supports others','Hides all information','Blames everyone','Mutes the wrong person'],'Supports others'],
['What is the official fuel of a busy team?',['Coffee and collaboration','Wi-Fi passwords','Unread emails','Panic'],'Coffee and collaboration'],
['When a project gets tricky, the best move is…',['Work together','Point fingers','Disappear','Rename the folder'],'Work together'],
['What makes a memorable work trip?',['The people','The spreadsheet','The boarding group','The inbox'],'The people'],
['What should never be included in a public game nickname?',['A fun alias','Your employee ID','A nickname','A team-themed name'],'Your employee ID'],
['What is the safest way to play this offline game onboard?',['Follow crew instructions','Turn on a hotspot','Block the aisle','Play audio loudly'],'Follow crew instructions'],
['What is the goal of Flight Mode Games?',['Make memories together','Win a real airline prize','Connect to aircraft systems','Avoid your colleagues'],'Make memories together']
];
const who=[
['The colleague who says “quick question” and starts a 40-minute discussion.','The Meeting Magnet'],
['The person who always knows where the latest document is.','The Human Search Engine'],
['The teammate who brings calm when everything catches fire.','The Firefighter'],
['The person who remembers every deadline and birthday.','The Team Calendar'],
['The colleague who can turn any problem into a checklist.','The Checklist Champion']
];
const words=[['MAET','TEAM'],['HTIGFL','FLIGHT'],['MORYEM','MEMORY'],['LCOUD','CLOUD'],['TUPROPS','SUPPORT'],['DREAFI','FRIEND'],['NCHALLEG','CHALLENGE'],['MDAER','DREAM']];
const bingoItems=['Someone yawns','A colleague smiles','A passenger reads a book (do not photograph)','A window seat view of clouds','Someone checks the time','A colleague stretches in their seat','A quiet thumbs-up between teammates','A snack appears','Someone looks out of the window','A team member gives a silent wave','A seat-back tray is folded away','A colleague wears headphones'];
function save(){localStorage.setItem(KEY,JSON.stringify(profile));localStorage.setItem(SCORES,JSON.stringify(scores));render();}
function total(){return Object.values(scores).reduce((a,x)=>a+(x.points||0),0)}
function played(){return Object.keys(scores).length}
function teamName(){return TEAMS[profile.team]||'Unassigned'}
function render(){
 $('#nickname').value=profile.nickname||'';
 $('#team').innerHTML=TEAMS.map((t,i)=>`<option value="${i}" ${i===profile.team?'selected':''}>${i+1}. ${t}</option>`).join('');
 $('#homePoints').textContent=total();$('#homePlayed').textContent=played();$('#homeTeam').textContent=teamName();
 $('#scoreNick').textContent=profile.nickname||'—';$('#scoreTeam').textContent=teamName();$('#scoreTotal').textContent=total();$('#scoreGames').textContent=played();
 $('#teamList').innerHTML=TEAMS.map((t,i)=>`<div class="teamrow"><span>${String(i+1).padStart(2,'0')} · ${t}</span><span class="pill">Squad ${i+1}</span></div>`).join('');
 $('#breakdown').innerHTML=played()?Object.entries(scores).map(([k,v])=>`<div class="teamrow"><span>${escapeHTML(v.label)}</span><strong>${v.points} pts</strong></div>`).join(''):'No games played yet.';
}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function tab(name){document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('hidden',x.id!==name));document.querySelectorAll('nav button').forEach(x=>x.classList.toggle('active',x.dataset.tab===name));}
document.querySelectorAll('nav button').forEach(b=>b.addEventListener('click',()=>tab(b.dataset.tab)));
$('#saveProfile').onclick=()=>{const n=$('#nickname').value.trim();if(!n){$('#profileMsg').textContent='Please choose a nickname first.';return}profile.nickname=n.slice(0,18);profile.team=Number($('#team').value);save();$('#profileMsg').textContent='Player profile saved on this device.'};
$('#randomTeam').onclick=()=>{$('#team').value=String(Math.floor(Math.random()*10));};
document.querySelectorAll('[data-game]').forEach(b=>b.onclick=()=>startGame(b.dataset.game));
function startGame(type){
 if(!profile.nickname){tab('home');$('#profileMsg').textContent='Choose and save a nickname before playing.';return}
 activeGame=type;gameState={index:0,points:0,items:[],started:Date.now(),done:false};
 const area=$('#gameArea');area.classList.remove('hidden');
 if(type==='trivia')showTrivia();if(type==='who')showWho();if(type==='word')showWord();if(type==='bingo')showBingo();if(type==='reaction')showReaction();
 area.scrollIntoView({behavior:'smooth',block:'start'});
}
function finish(label,points){
 const key=activeGame+'-'+Date.now();scores[key]={label,points,team:profile.team,nickname:profile.nickname};save();
 $('#gameArea').innerHTML=`<h2>Challenge complete!</h2><p class="muted">${escapeHTML(label)}</p><div class="stat"><span class="muted small">Points earned</span><strong>${points}</strong></div><p class="muted">Your result has been saved on this device.</p><div class="actions"><button id="again">Play another challenge</button><button class="secondary" id="seeScore">My score & QR</button></div>`;
 $('#again').onclick=()=>{tab('play');$('#gameArea').classList.add('hidden')};$('#seeScore').onclick=()=>tab('score');gameState.done=true;
}
function showTrivia(){
 const q=trivia[gameState.index];$('#gameArea').innerHTML=`<div class="kicker">COMPANY TRIVIA · ${gameState.index+1}/${trivia.length}</div><div class="progress"><i style="width:${gameState.index/trivia.length*100}%"></i></div><div class="question">${escapeHTML(q[0])}</div>${q[1].map(a=>`<button class="answer" data-answer="${escapeHTML(a)}">${escapeHTML(a)}</button>`).join('')}`;
 document.querySelectorAll('[data-answer]').forEach(b=>b.onclick=()=>{const correct=b.dataset.answer===q[2];if(correct)gameState.points+=200;b.classList.add(correct?'correct':'wrong');document.querySelectorAll('[data-answer]').forEach(x=>x.disabled=true);setTimeout(()=>{gameState.index++;gameState.index<trivia.length?showTrivia():finish('Company Trivia',gameState.points)},550)});
}
function showWho(){
 const q=who[gameState.index];$('#gameArea').innerHTML=`<div class="kicker">WHO'S THAT? · ${gameState.index+1}/${who.length}</div><div class="question">${escapeHTML(q[0])}</div><p class="muted small">Choose the playful fictional role.</p>${who.map(x=>x[1]).sort(()=>Math.random()-.5).map(a=>`<button class="answer" data-who="${escapeHTML(a)}">${escapeHTML(a)}</button>`).join('')}`;
 document.querySelectorAll('[data-who]').forEach(b=>b.onclick=()=>{if(b.dataset.who===q[1])gameState.points+=200;document.querySelectorAll('[data-who]').forEach(x=>x.disabled=true);setTimeout(()=>{gameState.index++;gameState.index<who.length?showWho():finish("Who's That?",gameState.points)},450)});
}
function showWord(){
 const q=words[gameState.index];$('#gameArea').innerHTML=`<div class="kicker">WORD BATTLE · ${gameState.index+1}/${words.length}</div><div class="question" style="letter-spacing:.2em;font-size:2rem">${q[0]}</div><label for="wordAnswer">Unscramble the word</label><input id="wordAnswer" autocapitalize="characters" placeholder="Your answer"><div class="actions"><button id="wordSubmit">Submit answer</button></div><p id="wordMsg" class="muted small"></p>`;
 $('#wordSubmit').onclick=()=>{const ok=$('#wordAnswer').value.trim().toUpperCase()===q[1];if(ok){gameState.points+=125;$('#wordMsg').textContent='Correct! +125 points.'}else $('#wordMsg').textContent='Not quite. The answer was '+q[1]+'.';$('#wordSubmit').disabled=true;setTimeout(()=>{gameState.index++;gameState.index<words.length?showWord():finish('Word Battle',gameState.points)},900)};
}
function showBingo(){
 const chosen=[...bingoItems].sort(()=>Math.random()-.5).slice(0,9);gameState.items=chosen;
 $('#gameArea').innerHTML=`<div class="kicker">FLIGHT BINGO</div><p class="muted small">Tap a square only when you naturally notice it. Do not photograph or disturb anyone.</p><div class="grid">${chosen.map((x,i)=>`<button class="answer" data-bingo="${i}" style="min-height:85px">${escapeHTML(x)}</button>`).join('')}</div><p id="bingoCount" class="muted small">0 of 9 marked</p><button id="bingoFinish" class="secondary">Finish bingo</button>`;
 document.querySelectorAll('[data-bingo]').forEach(b=>b.onclick=()=>{b.classList.toggle('correct');const n=document.querySelectorAll('[data-bingo].correct').length;$('#bingoCount').textContent=n+' of 9 marked'});
 $('#bingoFinish').onclick=()=>finish('Flight Bingo',document.querySelectorAll('[data-bingo].correct').length*55);
}
function showReaction(){
 $('#gameArea').innerHTML=`<div class="kicker">REACTION CHALLENGE</div><p class="muted">Tap start, wait for the panel to turn green, then tap it once. Keep your phone steady and play quietly.</p><button id="reactionStart">Start test</button><button id="reactionPad" class="answer hidden" style="height:150px;text-align:center;font-size:1.3rem">WAIT…</button><p id="reactionMsg" class="muted small"></p>`;
 let timer=null,start=0,ready=false,done=false;
 $('#reactionStart').onclick=()=>{clearTimeout(timer);done=false;ready=false;$('#reactionStart').disabled=true;$('#reactionPad').classList.remove('hidden');$('#reactionPad').textContent='WAIT…';$('#reactionPad').style.background='#6b3b39';timer=setTimeout(()=>{ready=true;start=performance.now();$('#reactionPad').textContent='TAP NOW!';$('#reactionPad').style.background='#17613e'},1200+Math.random()*2600)};
 $('#reactionPad').onclick=()=>{if(done)return;if(!ready){clearTimeout(timer);$('#reactionMsg').textContent='Too early! Try again.';$('#reactionStart').disabled=false;$('#reactionPad').classList.add('hidden');return}done=true;const ms=Math.round(performance.now()-start);const pts=Math.max(0,Math.min(500,Math.round(500-ms/2)));$('#reactionMsg').textContent=`${ms} ms · ${pts} points`;setTimeout(()=>finish('Reaction Challenge',pts),900)};
}
$('#makeQR').onclick=()=>{
 const payload=JSON.stringify({v:1,n:profile.nickname||'Player',t:teamName(),p:total(),g:played()});
 const wrap=$('#qrWrap');wrap.classList.remove('hidden');
 if(window.FMGQR){$('#qrCanvas').classList.remove('hidden');FMGQR.render($('#qrCanvas'),payload);$('#qrFallback').textContent=''}
 else {$('#qrCanvas').classList.add('hidden');$('#qrFallback').textContent='QR unavailable. Download your result file instead.'}
};
$('#downloadResult').onclick=()=>{const data={event:'FLIGHT MODE GAMES',nickname:profile.nickname,team:teamName(),total:total(),games:scores,created:new Date().toISOString()};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='flight-mode-games-result.json';a.click();URL.revokeObjectURL(a.href)};
$('#installHelp').onclick=()=>{$('#guideMsg').textContent='iPhone: open in Safari, tap Share, then Add to Home Screen. Android: open in Chrome, tap Install app or Add to Home screen. Do this before the flight.'};
$('#resetAll').onclick=()=>{if(confirm('Delete all game data stored on this device?')){localStorage.removeItem(KEY);localStorage.removeItem(SCORES);profile={nickname:'',team:0};scores={};render();$('#guideMsg').textContent='Local game data reset.'}};
render();
if('serviceWorker' in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').catch(()=>{});
