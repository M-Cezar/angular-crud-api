const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const newman = require('newman');
const root = path.resolve(__dirname, '..');
const dataFile = path.join(root, 'backend/data/produtos.json');
const original = fs.readFileSync(dataFile);
const evidence = path.join(root, 'docs/evidencias');
fs.mkdirSync(evidence, { recursive: true });
const server = spawn(process.execPath, ['src/server.js'], { cwd: path.join(root, 'backend'), stdio: ['ignore', 'pipe', 'pipe'] });
(async () => {
  try {
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('API não iniciou em 10 segundos')), 10000);
      server.stdout.on('data', chunk => { if (chunk.toString().includes('Servidor rodando na porta')) { clearTimeout(timer); resolve(); } });
      server.once('error', err => { clearTimeout(timer); reject(err); });
      server.once('exit', code => { clearTimeout(timer); reject(new Error('API encerrou ao iniciar: '+code)); });
    });
    const summary = await new Promise((resolve, reject) => newman.run({
      collection: path.join(root, 'docs/CRUD_Produtos.postman_collection.json'),
      reporters: ['cli', 'json'],
      reporter: { json: { export: path.join(evidence, 'postman-newman-resultados.json') } },
    }, (err, result) => err ? reject(err) : resolve(result)));
    const result = { data: new Date().toISOString(), node: process.version, newman: require('newman/package.json').version, requisicoes: summary.run.stats.requests, assercoes: summary.run.stats.assertions, falhas: summary.run.failures.map(f => ({ nome: f.source?.name, mensagem: f.error?.message })) };
    fs.writeFileSync(path.join(evidence, 'resumo-api.json'), JSON.stringify(result, null, 2)+'\n');
    if (result.falhas.length || result.requisicoes.failed || result.assercoes.failed) throw new Error('Falha nos testes da coleção');
    console.log('Coleção Postman aprovada; dados originais serão restaurados.');
  } finally {
    server.kill('SIGTERM');
    fs.writeFileSync(dataFile, original);
  }
})().catch(err => { console.error(err.message); process.exitCode = 1; });
