import test from 'node:test';
import assert from 'node:assert/strict';
import {createAppServer} from '../server.mjs';
test('server serves only public app resources and refuses methods/private paths',async()=>{
 const server=createAppServer();await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base=`http://127.0.0.1:${server.address().port}`;
 try{let r=await fetch(base);assert.equal(r.status,200);assert.match(await r.text(),/DefendMyDeck/);assert.match(r.headers.get('content-security-policy'),/connect-src 'none'/);
 for(const path of ['/devpost/learner-profile.md','/.env','/server.mjs','/%2e%2e/package.json','/missing'])assert.equal((await fetch(base+path)).status,404);
 assert.equal((await fetch(base,{method:'POST',body:'private pitch'})).status,405);
 assert.equal((await fetch(base+'/core.js')).headers.get('content-type'),'text/javascript; charset=utf-8');
 }finally{await new Promise(r=>server.close(r));}
});
