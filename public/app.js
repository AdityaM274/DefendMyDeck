import {blankWorkspace,extractClaims,auditClaim,questionFor,evaluateAnswer,contextKey,validateWorkspace,toMarkdown} from './core.js';
import {sample} from './sample.js';
const $=id=>document.getElementById(id);
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const STORAGE='defendmydeck-workspace-v1';
let state=blankWorkspace(), saving=false, selected='', active='pitch';
let storageError='';
try{const old=localStorage.getItem(STORAGE);if(old){state=validateWorkspace(JSON.parse(old));saving=true;}}catch{storageError='Saved workspace could not be read. This session is in memory; import a backup if available.';}
function notify(text){$('notice').textContent=text;}
function persist(){
 if(!saving){$('save-status').textContent='Memory only · export a backup before leaving';return;}
 try{localStorage.setItem(STORAGE,JSON.stringify(state));$('save-status').textContent='Saved on this browser · not synced';}
 catch{$('save-status').textContent='Saving failed · export a backup before leaving';notify('Browser storage is unavailable or full. Your current work remains in memory.');}
}
function confirmAction(title,message,action){
 $('confirm-title').textContent=title;$('confirm-message').textContent=message;
 const dialog=$('confirm-dialog');dialog.showModal();
 $('confirm-ok').onclick=()=>{dialog.close();action();};$('confirm-cancel').onclick=()=>dialog.close();
}
function showTab(tab){
 active=tab;document.querySelectorAll('.panel').forEach(e=>e.hidden=e.id!==tab);
 document.querySelectorAll('[data-tab]').forEach(e=>{e.classList.toggle('active',e.dataset.tab===tab);e.setAttribute('aria-current',e.dataset.tab===tab?'step':'false');});
 if(tab==='audit')renderAudit();if(tab==='rehearse')renderRehearsal();
 $('notice').textContent='';window.scrollTo({top:0,behavior:'instant'});
}
function syncPitch(){ $('title').value=state.title;$('pitch-text').value=state.pitch;$('char-count').textContent=`${state.pitch.length.toLocaleString()} / 20,000 characters`;$('sample-banner').hidden=!state.sample;$('save-local').checked=saving; }
function invalidate(id){delete state.rehearsals[id];}
function sourceFor(c){return state.sources.find(s=>s.id===c.sourceId);}
function renderSummary(){
 const audits=state.claims.map(c=>auditClaim(c,sourceFor(c)));
 const linked=state.claims.filter(c=>sourceFor(c)?.excerpt.trim()).length;
 const review=audits.filter(a=>a.level!=='linked'||a.issues.length).length;
 $('audit-summary').innerHTML=`<div class="stat"><strong>${state.claims.length}</strong><span>claims in review</span></div><div class="stat"><strong>${linked}</strong><span>with evidence attached</span></div><div class="stat"><strong>${review}</strong><span>need a closer look</span></div>`;
}
function renderAudit(){
 const audits=state.claims.map(c=>auditClaim(c,sourceFor(c)));
 renderSummary();
 $('claims').innerHTML=state.claims.length?state.claims.map((c,i)=>{
  const a=audits[i];return `<article class="claim-card"><div class="claim-head"><span class="claim-id">CLAIM ${String(i+1).padStart(2,'0')}</span><span class="badge ${a.level}">${escape(a.label)}</span></div><p class="claim-text">${escape(c.text)}</p><label for="claim-${escape(c.id)}">Edit claim</label><textarea class="claim-edit" id="claim-${escape(c.id)}" data-edit="${escape(c.id)}" maxlength="2000">${escape(c.text)}</textarea><label for="link-${escape(c.id)}">Evidence for this claim</label><select id="link-${escape(c.id)}" data-link="${escape(c.id)}"><option value="">No evidence linked</option>${state.sources.map(s=>`<option value="${escape(s.id)}" ${c.sourceId===s.id?'selected':''}>${escape(s.title)}</option>`).join('')}</select>${a.issues.length?`<ul class="issues">${a.issues.map(x=>`<li>${escape(x)}</li>`).join('')}</ul>`:'<p class="evidence-hint">No numeric mismatch found. This does not verify the claim or its source.</p>'}<div class="claim-actions"><button class="text-button" data-practice="${escape(c.id)}">Rehearse this claim ↗</button><button class="text-button danger" data-remove="${escape(c.id)}">Remove</button></div></article>`;
 }).join(''):'<div class="empty">No claims yet. Scan your pitch or add a claim manually. A scan with no results does not mean every claim is supported.</div>';
 $('sources').innerHTML=state.sources.map(s=>`<article class="source-note"><div class="claim-head"><h3>${escape(s.title)}</h3><span class="tag">${escape(s.type.toUpperCase())}</span></div><p>${escape(s.excerpt)}</p>${s.url?`<p>Reference: ${escape(s.url)}</p>`:''}<button class="text-button" data-edit-source="${escape(s.id)}">Edit evidence</button> <button class="text-button danger" data-remove-source="${escape(s.id)}">Remove</button></article>`).join('')||'<p class="muted">Add an exact excerpt from a test note, paper or plan. A URL alone is not enough.</p>';
}
function renderRehearsal(){
 if(!state.claims.some(c=>c.id===selected))selected=state.claims[0]?.id||'';
 $('rehearsal-claim').innerHTML=state.claims.map((c,i)=>`<option value="${escape(c.id)}" ${c.id===selected?'selected':''}>${i+1}. ${escape(c.text.slice(0,100))}</option>`).join('');
 const c=state.claims.find(c=>c.id===selected);
 if(!c){$('rehearsal').innerHTML='<div class="empty">Add a claim in your evidence audit to start rehearsal.</div>';return;}
 const s=sourceFor(c),ctx=questionFor(c,s),key=contextKey(c,s);
 const prior=Object.prototype.hasOwnProperty.call(state.rehearsals,c.id)?state.rehearsals[c.id]:null;
 if(prior && prior.key!==key)invalidate(c.id);
 const r=state.rehearsals[c.id]||{key,attempts:[]};
 const latest=r.attempts.at(-1),first=r.attempts[0];
 const latestFeedback=latest?evaluateAnswer(latest.answer,ctx):null;
 $('rehearsal').innerHTML=`<div class="rehearsal-grid"><div><article class="question-card"><div class="eyebrow">YOUR QUESTION</div><h2>${escape(ctx.question)}</h2><div class="quote">${escape(c.text)}</div><div class="eyebrow">EVIDENCE IN VIEW</div><h3>${escape(s?.title||'No source attached')}</h3><p class="excerpt">${escape(s?.excerpt||'Return to the evidence audit and attach an excerpt. Do not invent one in your answer.')}</p></article><p class="report-label">Question generated from transparent templates and the selected claim. No language model runs in this prototype.</p></div><div class="answer-box"><label for="answer">Your answer <span>Attempt ${r.attempts.length+1}</span></label><textarea id="answer" maxlength="5000" placeholder="Answer in your own words. Point to your evidence, explain the measurement and name a limitation."></textarea><div class="form-bottom"><span class="muted">Typed rehearsal · 5,000 characters max</span><button id="review-answer" class="primary" ${r.attempts.length>=20?'disabled':''}>Review my answer →</button></div><div id="feedback">${latestFeedback?feedbackHTML(latestFeedback):'<p class="evidence-hint">Feedback will show which references are mentioned. It cannot judge the truth of your answer.</p>'}</div></div></div>${r.attempts.length>1?`<div class="comparison"><strong>Visible change:</strong> first attempt mentioned ${evaluateAnswer(first.answer,ctx).covered}/3 checklist items; latest mentions ${latestFeedback.covered}/3. This is mention coverage, not evidence of improved correctness.</div>`:''}<div class="section-bar"><h2>Your rehearsal record</h2><span class="muted">${r.attempts.length} / 20 attempts</span></div>${r.attempts.map((t,i)=>{const f=evaluateAnswer(t.answer,ctx);return `<article class="attempt"><div class="attempt-head"><span>ATTEMPT ${String(i+1).padStart(2,'0')}</span><span>${f.covered}/3 mentions found · ${f.words} words</span></div><p>${escape(t.answer)}</p></article>`;}).reverse().join('')||'<p class="muted">Your first attempt will appear here. You can revise and compare without hiding the earlier answer.</p>'}`;
 $('review-answer').onclick=()=>{
  const answer=$('answer').value.trim();if(!answer){notify('Write an answer before reviewing it.');$('answer').focus();return;}
  r.attempts.push({answer,date:new Date().toISOString()});state.rehearsals[c.id]=r;persist();renderRehearsal();notify('Attempt recorded. Inspect the actual evidence and wording; checklist mentions alone are not proof.');
 };
}
function feedbackHTML(f){return `<div class="checks">${f.checks.map(c=>`<div class="check"><span class="${c.pass?'pass':'fail'}">${c.pass?'✓':'○'}</span><div><strong>${escape(c.name)}</strong><small>${c.pass?'Mention found. Verify that it is accurate.':escape(c.detail)}</small></div></div>`).join('')}</div><p class="evidence-hint">${escape(f.note)}</p>`;}
function download(content,name,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function replaceWorkspace(next){state=next;selected='';syncPitch();persist();if(active==='audit')renderAudit();if(active==='rehearse')renderRehearsal();}
document.querySelectorAll('[data-tab]').forEach(b=>b.onclick=()=>showTab(b.dataset.tab));
$('title').oninput=e=>{state.title=e.target.value;persist();};
$('pitch-text').oninput=e=>{state.pitch=e.target.value;$('char-count').textContent=`${state.pitch.length.toLocaleString()} / 20,000 characters`;persist();};
$('load-sample').onclick=()=>confirmAction('Load the fictional example?','This replaces the current workspace. Export a backup first if you want to keep it.',()=>{replaceWorkspace(sample());notify('Fictional sample loaded. Try the evidence audit to inspect the 94% / 90% mismatch.');});
$('scan').onclick=()=>{
 if(!state.pitch.trim()){notify('Paste some pitch text first, or try the fictional example.');$('pitch-text').focus();return;}
 const scan=()=>{state.claims=extractClaims(state.pitch);state.rehearsals={};persist();showTab('audit');if(!state.claims.length)notify('The pattern scan found no candidate claims. Add any factual claims manually.');};
 if(state.claims.length)confirmAction('Rescan the pitch?','This replaces existing claims, evidence links and rehearsal attempts. Your evidence notebook remains.',scan);else scan();
};
$('add-claim').onclick=()=>{if(state.claims.length>=40){notify('This prototype supports up to 40 claims.');return;}const id=crypto.randomUUID();state.claims.push({id,text:'',sourceId:''});persist();renderAudit();document.querySelector(`[data-edit="${id}"]`).focus();};
$('claims').addEventListener('input',e=>{
 const id=e.target.dataset.edit;if(!id)return;const c=state.claims.find(c=>c.id===id);if(!c)return;
 c.text=e.target.value;invalidate(id);persist();
 const card=e.target.closest('.claim-card'),a=auditClaim(c,sourceFor(c));
 card.querySelector('.claim-text').textContent=c.text;
 const badge=card.querySelector('.badge');badge.textContent=a.label;badge.className='badge '+a.level;
 card.querySelector('.issues, .evidence-hint')?.remove();
 const result=document.createElement(a.issues.length?'ul':'p');result.className=a.issues.length?'issues':'evidence-hint';
 if(a.issues.length)for(const issue of a.issues){const li=document.createElement('li');li.textContent=issue;result.append(li);}else result.textContent='No numeric mismatch found. This does not verify the claim or its source.';
 card.querySelector('.claim-actions').before(result);renderSummary();
});
$('claims').addEventListener('change',e=>{
 const id=e.target.dataset.link;if(!id)return;const c=state.claims.find(c=>c.id===id);if(!c)return;
 c.sourceId=e.target.value;invalidate(id);persist();renderAudit();
});
$('claims').addEventListener('click',e=>{
 const id=e.target.dataset.practice||e.target.dataset.remove;if(!id)return;
 if(e.target.dataset.practice){const c=state.claims.find(c=>c.id===id);if(!c.text.trim()){notify('Write a claim first.');return;}selected=id;showTab('rehearse');}
 else confirmAction('Remove this claim?','Its rehearsal attempts will also be removed.',()=>{state.claims=state.claims.filter(c=>c.id!==id);invalidate(id);persist();renderAudit();});
});
let editingSource='';
$('source-form').onsubmit=e=>{
 e.preventDefault();if(state.sources.length>=40&&!editingSource){notify('This prototype supports up to 40 sources.');return;}
 const s={id:editingSource||crypto.randomUUID(),title:$('source-title').value.trim(),type:$('source-type').value,excerpt:$('source-excerpt').value.trim(),url:$('source-url').value.trim()};
 if(!s.title||!s.excerpt){notify('Give the source a title and an evidence excerpt.');return;}
 if(editingSource){state.sources=state.sources.map(old=>old.id===s.id?s:old);state.claims.filter(c=>c.sourceId===s.id).forEach(c=>invalidate(c.id));}else state.sources.push(s);
 editingSource='';$('source-form').reset();$('source-form').querySelector('button').textContent='Add to notebook';persist();renderAudit();notify('Evidence saved. Link it to a claim to inspect the relationship.');
};
$('sources').addEventListener('click',e=>{
 const id=e.target.dataset.editSource||e.target.dataset.removeSource;if(!id)return;const s=state.sources.find(s=>s.id===id);if(!s)return;
 if(e.target.dataset.editSource){editingSource=id;$('source-title').value=s.title;$('source-type').value=s.type;$('source-excerpt').value=s.excerpt;$('source-url').value=s.url;$('source-form').querySelector('button').textContent='Save evidence changes';$('source-title').focus();}
 else confirmAction('Remove this source?','Linked claims will lose this source and their existing rehearsal context.',()=>{state.sources=state.sources.filter(s=>s.id!==id);state.claims.filter(c=>c.sourceId===id).forEach(c=>{c.sourceId='';invalidate(c.id);});if(editingSource===id){editingSource='';$('source-form').reset();}persist();renderAudit();});
});
$('rehearsal-claim').onchange=e=>{selected=e.target.value;renderRehearsal();};
$('save-local').onchange=e=>{
 saving=e.target.checked;
 if(!saving){try{localStorage.removeItem(STORAGE);}catch{}notify('Browser saving off. Export a backup if you want to keep this session.');}
 persist();
};
$('export-json').onclick=()=>download(JSON.stringify(state,null,2),'defendmydeck-backup.json','application/json');
$('export-report').onclick=()=>download(toMarkdown(state),'defendmydeck-rehearsal.md','text/markdown');
$('import-button').onclick=()=>$('import-file').click();
$('import-file').onchange=async e=>{
 const f=e.target.files[0];if(!f)return;
 try{if(f.size>2_000_000)throw Error('Backup is too large (maximum 2 MB).');const next=validateWorkspace(JSON.parse(await f.text()));confirmAction('Import this backup?','This replaces your current workspace. Export it first if needed.',()=>{replaceWorkspace(next);notify('Backup imported. Check that this is the work you expected.');});}
 catch(err){notify('Could not import backup: '+err.message);}finally{e.target.value='';}
};
$('reset').onclick=()=>confirmAction('Clear this workspace?','This removes your pitch, evidence and attempts from this session and any enabled browser save. Export a backup first if needed.',()=>{replaceWorkspace(blankWorkspace());editingSource='';$('source-form').reset();showTab('pitch');notify('Workspace cleared.');});
syncPitch();persist();if(storageError)notify(storageError);
