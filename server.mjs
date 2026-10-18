import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
const files = new Map([
  ['/', ['index.html','text/html']], ['/index.html',['index.html','text/html']],
  ['/styles.css',['styles.css','text/css']], ['/app.js',['app.js','text/javascript']],
  ['/core.js',['core.js','text/javascript']], ['/sample.js',['sample.js','text/javascript']]
]);
export const createAppServer = () => createServer(async (req,res) => {
  if(req.method!=='GET' && req.method!=='HEAD'){res.writeHead(405);res.end('Method not allowed');return;}
  const path = new URL(req.url,'http://localhost').pathname;
  const file=files.get(path);
  if(!file){res.writeHead(404);res.end('Not found');return;}
  try {
    const content=await readFile(new URL('./public/'+file[0],import.meta.url));
    res.writeHead(200,{'Content-Type':file[1]+'; charset=utf-8','Cache-Control':'no-store',
      'X-Content-Type-Options':'nosniff','Referrer-Policy':'no-referrer',
      'Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'none'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});
    res.end(req.method==='HEAD'?undefined:content);
  }catch{res.writeHead(500);res.end('Unable to load application file');}
});
if(process.argv[1] && fileURLToPath(import.meta.url)===process.argv[1]){
 const port=Number(process.env.PORT || 4173);
 createAppServer().listen(port,'127.0.0.1',()=>console.log(`DefendMyDeck: http://127.0.0.1:${port}`));
}
