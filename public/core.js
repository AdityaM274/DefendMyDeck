export const VERSION=1;
export function numbers(text){
  return [...new Set((String(text).match(/\b\d+(?:[,.]\d+)*(?:\s*%)?/g)||[]).map(n=>n.replace(/,/g,'').replace(/\s/g,'')))];
}
export function extractClaims(pitch){
 const lines=String(pitch).slice(0,20000).split(/\n+|(?<=[.!?])\s+(?=[A-Z])/).map(s=>s.replace(/^[-*#\s]+/,'').trim());
 return [...new Set(lines.filter(s=>s.length>=18 && (numbers(s).length || /\b(achiev\w*|reduc\w*|improv\w*|faster|better|best|first|guarantee\w*|always|never|secure|offline|outperform\w*|sav(?:e|es|ing)|accurac\w*|eliminat\w*)\b/i.test(s))))].slice(0,40).map((text,i)=>({id:`c${i+1}`,text,sourceId:''}));
}
export function auditClaim(claim,source){
 const issues=[];
 const anchors=numbers(claim.text);
 if(!source || !source.excerpt?.trim()) return {level:'missing',label:'Needs evidence',issues:['Attach an evidence excerpt to inspect this claim.'],missing:anchors,anchors};
 const evidenceNumbers=numbers(source.excerpt);
 const missing=anchors.filter(n=>!evidenceNumbers.includes(n));
 if(missing.length)issues.push(`Not found in this excerpt: ${missing.join(', ')}. Check the value, unit and measurement context.`);
 if(source.type==='planned')issues.push('This is planned work, not a measured result. Use future-tense or clearly label the claim.');
 if(source.type==='literature')issues.push('Literature evidence does not establish your prototype’s result. Identify the cited study and its setting.');
 if(/\b(guarantee\w*|always|never|best|first|eliminat\w*)\b/i.test(claim.text))issues.push('An absolute claim needs a defined scope and exceptions.');
 return {level:missing.length||source.type==='planned'?'review':'linked',label:missing.length?'Numbers need review':source.type==='planned'?'Planned, not measured':'Evidence linked',issues,missing,anchors};
}
export function questionFor(claim,source){
 const audit=auditClaim(claim,source);
 const text=claim.text;
 let question;
 if(audit.missing.length && source) question=`Your claim includes ${audit.missing.join(', ')}, absent from “${source.title}”. What did you actually measure, and how should the claim be qualified?`;
 else if(source?.type==='planned') question='Which parts of this claim have been built and tested, and which are still planned? How will you test the remaining work?';
 else if(audit.anchors.length)question=`How was “${text}” measured? Explain the sample, method, baseline and limitation, and point to the evidence.`;
 else question=`What evidence would let a judge check “${text}”? Explain what you demonstrated and one limitation.`;
 return {question,claimText:text,source:source?{...source}:null,anchors:audit.anchors};
}
export function evaluateAnswer(answer,context){
 const text=String(answer).trim(),low=text.toLowerCase();
 const source=context.source;
 const titleWords=(source?.title||'').toLowerCase().split(/[^a-z0-9]+/).filter(w=>w.length>3);
 const cites=!!source && (titleWords.some(w=>low.includes(w)) || /\b(source|evidence|run log|test log|benchmark|report|appendix|dataset)\b/i.test(text));
 const answerNums=numbers(text);
 const sourceNums=numbers(source?.excerpt||'');
 const relevant=sourceNums.length?sourceNums:context.anchors;
 const hasNumber=relevant.length>0 && relevant.some(n=>answerNums.includes(n));
 const method=/\b(test\w*|measur\w*|sample|images|runs|dataset|baseline|median|method|evaluat\w*|trials)\b/i.test(text);
 const limitation=/\b(limit\w*|only|not yet|not tested|uncertain\w*|small|synthetic|cannot|can’t|can't|however|may fail|failed|unverified|not proven)\b/i.test(text);
 const checks=[
  {name:'Evidence reference',pass:cites,detail:source?'Name the source or point to its evidence.':'No source attached: add one before claiming an evidenced answer.'},
  {name:'Measurement context',pass:method && (!relevant.length || hasNumber),detail:relevant.length?'Mention a relevant number and how it was measured.':'Explain the test, method or baseline.'},
  {name:'Limitation stated',pass:limitation,detail:'State a boundary, failure case or what has not been tested.'}
 ];
 return {checks,covered:checks.filter(c=>c.pass).length,total:checks.length,words:text?text.split(/\s+/).length:0,
   note:'Keyword and numeric checks only. Mentions can be wrong or negated; a human must judge whether the answer is accurate and convincing.'};
}
export function contextKey(claim,source){return JSON.stringify([claim.text,source||null]);}
export const blankWorkspace=()=>({version:VERSION,title:'Untitled pitch',pitch:'',sample:false,claims:[],sources:[],rehearsals:{}});
export function validateWorkspace(data){
 const string=(v,max=20000)=>typeof v==='string'&&v.length<=max;
 if(!data||data.version!==VERSION||!string(data.title,160)||!string(data.pitch)||typeof data.sample!=='boolean'||!Array.isArray(data.claims)||!Array.isArray(data.sources)||data.claims.length>40||data.sources.length>40)throw Error('This is not a supported DefendMyDeck backup.');
 const safeId=id=>string(id,100)&&/^[a-zA-Z0-9_-]+$/.test(id)&&!['__proto__','prototype','constructor'].includes(id);
 const ids=new Set();
 for(const c of data.claims){if(!c||!safeId(c.id)||ids.has(c.id)||!string(c.text,2000)||!string(c.sourceId,100))throw Error('Backup has invalid claims.');ids.add(c.id);}
 const sourceIds=new Set();
 for(const s of data.sources){if(!s||!safeId(s.id)||sourceIds.has(s.id)||!string(s.title,160)||!string(s.excerpt,10000)||!string(s.url,2000)||!['measured','literature','planned'].includes(s.type))throw Error('Backup has invalid evidence.');sourceIds.add(s.id);}
 if(!data.rehearsals||typeof data.rehearsals!=='object'||Array.isArray(data.rehearsals))throw Error('Backup has invalid rehearsal history.');
 // Rebuild into a clean object; imported feedback is never trusted as computed output.
 const clean={version:VERSION,title:data.title,pitch:data.pitch,sample:data.sample,claims:data.claims.map(c=>({id:c.id,text:c.text,sourceId:sourceIds.has(c.sourceId)?c.sourceId:''})),sources:data.sources.map(s=>({id:s.id,title:s.title,type:s.type,excerpt:s.excerpt,url:s.url})),rehearsals:{}};
 for(const c of clean.claims){
   const r=Object.prototype.hasOwnProperty.call(data.rehearsals,c.id)?data.rehearsals[c.id]:null;
   const s=clean.sources.find(s=>s.id===c.sourceId);
   if(r && r.key===contextKey(c,s) && Array.isArray(r.attempts) && r.attempts.length<=20 && r.attempts.every(a=>a&&string(a.answer,5000)&&string(a.date,100))){clean.rehearsals[c.id]={key:r.key,attempts:r.attempts.map(a=>({answer:a.answer,date:a.date}))};}
 }
 return clean;
}
export function toMarkdown(workspace){
 const out=[`# ${workspace.title}`,workspace.sample?'FICTIONAL DEMONSTRATION DATA':'User-supplied pitch and evidence','Consistency checks, not independent fact verification.',''];
 for(const c of workspace.claims){const s=workspace.sources.find(s=>s.id===c.sourceId),a=auditClaim(c,s),ctx=questionFor(c,s);out.push(`## Claim: ${c.text}`,`Status: ${a.label}`,...a.issues.map(i=>`- ${i}`),`Evidence: ${s?.title||'None'}`,s?.excerpt||'',`Question: ${ctx.question}`);const r=workspace.rehearsals[c.id];if(r?.key===contextKey(c,s))for(const [i,t]of r.attempts.entries()){const f=evaluateAnswer(t.answer,ctx);out.push(`### Attempt ${i+1}`,t.answer,`Checklist: ${f.covered}/${f.total}; not a jury score.`,...f.checks.map(x=>`- ${x.pass?'Mention found':'Missing'}: ${x.name}`));}out.push('');}
 return out.join('\n\n');
}
