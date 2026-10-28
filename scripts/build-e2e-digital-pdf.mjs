import fs from 'node:fs';
import path from 'node:path';

const lines = [];
const objects = [];
function addObject(body){objects.push(body)}
addObject('<< /Type /Catalog /Pages 2 0 R >>');
addObject('<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
addObject('<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>');
addObject('<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>');
const content='BT /F1 18 Tf 72 760 Td (Com entre nous - PDF numerique de test) Tj 0 -28 Td /F1 11 Tf (Fichier temporaire pour verifier WooCommerce et espace client.) Tj ET';
addObject('<< /Length '+Buffer.byteLength(content,'ascii')+' >>\\nstream\\n'+content+'\\nendstream');
let pdf='%PDF-1.4\\n';
const offsets=[0];
for(let i=0;i<objects.length;i++){offsets.push(Buffer.byteLength(pdf,'ascii'));pdf+=(i+1)+' 0 obj\\n'+objects[i]+'\\nendobj\\n'}
const xref=Buffer.byteLength(pdf,'ascii');
pdf+='xref\\n0 '+(objects.length+1)+'\\n0000000000 65535 f \\n';
for(let i=1;i<offsets.length;i++)pdf+=String(offsets[i]).padStart(10,'0')+' 00000 n \\n';
pdf+='trailer\\n<< /Size '+(objects.length+1)+' /Root 1 0 R >>\\nstartxref\\n'+xref+'\\n%%EOF\\n';
const dir=path.join(process.cwd(),'public','uploads');
fs.mkdirSync(dir,{recursive:true});
fs.writeFileSync(path.join(dir,'e2e-digital-test.pdf'),Buffer.from(pdf,'ascii'));
console.log('Built temporary E2E digital PDF');
