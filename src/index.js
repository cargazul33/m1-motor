const QUESTIONS = {
  trade_action: {
    type: "choice",
    instructions: "Using only the evidence available at this decision timestamp, what action is justified?",
    criteria: {
      BUY: "Evidence supports a favorable long trade.",
      SELL: "Evidence supports a favorable short trade.",
      NO_TRADE: "Evidence is weak, mixed, uncertain, or does not justify risk."
    }
  },
  market_quality: {
    type: "score",
    instructions: "Rate the quality of the market evidence available at this timestamp.",
    criteria: ["0 = poor", "1 = acceptable", "2 = strong"]
  },
  trade_risk: {
    type: "score",
    instructions: "Rate the risk of taking a trade with only the evidence available now.",
    criteria: ["0 = low", "1 = moderate", "2 = high"]
  }
};

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store"
    }
  });
}

function secure(response) {
  var h = new Headers(response.headers);
  h.set("X-Content-Type-Options", "nosniff");
  h.set("X-Frame-Options", "DENY");
  h.set("Referrer-Policy", "strict-origin-when-cross-origin");
  h.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), payment=()");
  h.set("Content-Security-Policy", "default-src 'self'; script-src 'unsafe-inline' 'self'; style-src 'unsafe-inline' 'self'; connect-src 'self'; img-src 'self' data:; base-uri 'self'; frame-ancestors 'none'");
  return new Response(response.body, {status: response.status, headers: h});
}

async function evaluate(env, state) {
  if (!env.AI || typeof env.AI.run !== "function") {
    throw new Error("Workers AI binding AI is not configured");
  }
  return await env.AI.run("typesafe/jev", {state: state, questions: QUESTIONS});
}

async function handleEvaluate(request, env) {
  var body;
  try { body = await request.json(); } catch (_) { return json({error: "JSON_INVALIDO"}, 400); }
  var states = Array.isArray(body.states) ? body.states : body.state ? [body.state] : [];
  if (!states.length) return json({error: "FALTA_STATE"}, 400);
  if (states.length > 50) return json({error: "MAX_50_ESTADOS"}, 413);
  var results = [];
  try {
    for (var i = 0; i < states.length; i++) {
      results.push({mode: "REAL_JEV", result: await evaluate(env, states[i])});
    }
    return json({
      paperTradingOnly: true,
      realOrders: false,
      aiBound: true,
      model: "typesafe/jev",
      results: results
    });
  } catch (e) {
    return json({
      error: "JEV_ERROR",
      message: e && e.message ? e.message : String(e),
      aiBound: !!(env.AI && typeof env.AI.run === "function")
    }, 502);
  }
}

var PAGE = [
"<!doctype html><html lang='es'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1,viewport-fit=cover'>",
"<meta name='theme-color' content='#071018'><title>JEV Trading Lab</title>",
"<style>",
"*{box-sizing:border-box}body{margin:0;background:#071018;color:#eef2f6;font-family:Inter,system-ui,-apple-system,Segoe UI,sans-serif}button,input,textarea{font:inherit}.top{position:sticky;top:0;z-index:5;background:#071018ee;border-bottom:1px solid #1c2a35;padding:18px 20px;display:flex;align-items:center;justify-content:space-between}.brand{display:flex;gap:12px;align-items:center;font-weight:800;letter-spacing:.16em}.mark{width:46px;height:46px;border:1px solid #9d7a21;border-radius:15px;display:grid;place-items:center;color:#efbd3c;font-size:22px}.pill{padding:9px 14px;border:1px solid #31414e;border-radius:999px;font-size:13px;letter-spacing:.08em}.ok{color:#5be3a6;border-color:#246848}.bad{color:#ff7a88;border-color:#69333d}.wrap{max-width:1100px;margin:auto;padding:34px 20px 70px}.ey{color:#c89e39;text-transform:uppercase;letter-spacing:.22em;font-size:13px}.hero h1{font-size:clamp(38px,7vw,72px);line-height:.95;margin:16px 0}.hero h1 span{color:#efb735}.hero p{max-width:820px;color:#aeb8c1;font-size:18px;line-height:1.65}.tabs{display:flex;gap:8px;overflow:auto;margin:30px 0 18px}.tab{background:#0b151d;border:1px solid #263540;color:#aeb8c1;padding:12px 18px;border-radius:12px}.tab.on{color:#fff;border-color:#52606b}.panel{display:none}.panel.on{display:block}.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}.card{background:linear-gradient(180deg,#0c1720,#09121a);border:1px solid #253440;border-radius:20px;padding:20px}.metric small,.muted{color:#8b98a3}.metric strong{display:block;font-size:31px;margin:10px 0}.form{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}.full{grid-column:1/-1}label{display:block;color:#9aa6b0;font-size:13px;margin:0 0 7px}input,textarea{width:100%;background:#071018;border:1px solid #2a3945;color:#fff;border-radius:12px;padding:13px}textarea{min-height:90px}.btn{border:1px solid #3b4750;border-radius:13px;background:#111c24;color:#fff;padding:13px 18px;font-weight:700}.primary{background:#efb735;color:#101417;border-color:#efb735}.result{margin-top:18px}.decision{font-size:48px;font-weight:900;margin:10px 0}.BUY{color:#5be3a6}.SELL{color:#ff7a88}.NO_TRADE{color:#efb735}.row{display:flex;gap:12px;flex-wrap:wrap}.bar{height:8px;background:#16232d;border-radius:99px;overflow:hidden;margin:5px 0 12px}.bar i{display:block;height:100%;background:#efb735}.table{width:100%;border-collapse:collapse;font-size:13px}.table th,.table td{padding:10px;border-bottom:1px solid #1c2a35;text-align:left}.banner{border:1px solid #6a5421;background:#17150c;padding:14px 16px;border-radius:14px;color:#eed37e;margin:18px 0}.hidden{display:none}@media(max-width:720px){.grid,.form{grid-template-columns:1fr}.hero h1{font-size:48px}.top{padding:15px}.brand{letter-spacing:.09em;font-size:14px}.wrap{padding:24px 16px 60px}}",
"</style></head><body>",
"<header class='top'><div class='brand'><div class='mark'>J</div><div>JEV TRADING LAB</div></div><div id='status' class='pill'>JEV · verificando</div></header>",
"<main class='wrap'><section class='hero'><div class='ey'>Laboratorio de decisión</div><h1>Probá si Jev aporta <span>alpha real.</span></h1><p>Evalúa únicamente la información disponible en el instante de decisión. El futuro se mantiene separado para evitar leakage. Esta app es solo paper trading y backtesting: no ejecuta órdenes reales.</p></section>",
"<div id='banner' class='banner hidden'></div>",
"<nav class='tabs'><button class='tab on' data-t='dash'>Dashboard</button><button class='tab' data-t='eval'>Evaluar</button><button class='tab' data-t='bt'>Backtest</button><button class='tab' data-t='hist'>Historial</button></nav>",
"<section id='dash' class='panel on'><div class='grid'><div class='card metric'><small>Evaluaciones</small><strong id='mE'>0</strong><span class='muted'>Guardadas en este dispositivo</span></div><div class='card metric'><small>Última señal</small><strong id='mS'>—</strong><span class='muted'>Jev real</span></div><div class='card metric'><small>Última confianza</small><strong id='mC'>—</strong><span class='muted'>Cuando el modelo la informa</span></div></div><div class='card' style='margin-top:14px'><div class='ey'>Regla central</div><h2>No mostrarle el futuro a Jev</h2><p class='muted'>Primero se captura el estado, luego Jev decide y recién después se compara contra el resultado real. Así se puede medir si existe una ventaja estadística.</p></div></section>",
"<section id='eval' class='panel'><div class='card'><div class='ey'>Evaluación ciega</div><h2>Estado del mercado</h2><div class='form'><div><label>Símbolo</label><input id='sym' value='NVDA'></div><div><label>Precio</label><input id='price' type='number' step='any' value='180'></div><div><label>Retorno 1 período</label><input id='r1' type='number' step='any' value='0.01'></div><div><label>Retorno 3 períodos</label><input id='r3' type='number' step='any' value='0.02'></div><div><label>EMA spread</label><input id='ema' type='number' step='any' value='0.01'></div><div><label>RSI</label><input id='rsi' type='number' step='any' value='58'></div><div><label>Volatilidad</label><input id='vol' type='number' step='any' value='0.025'></div><div><label>Volume z-score</label><input id='vz' type='number' step='any' value='1.1'></div><div class='full'><label>Evento / contexto conocido en ese momento</label><textarea id='event' placeholder='Ej.: resultados trimestrales publicados, sin incluir lo que pasó después'></textarea></div><div class='full'><button id='go' class='btn primary'>Evaluar con Jev</button></div></div><div id='res' class='result hidden'><div class='ey'>Decisión de Jev</div><div id='dec' class='decision'>—</div><div class='row'><div class='card' style='flex:1'><small>Confianza</small><strong id='conf'>—</strong></div><div class='card' style='flex:1'><small>Calidad</small><strong id='qual'>—</strong></div><div class='card' style='flex:1'><small>Riesgo</small><strong id='risk'>—</strong></div></div></div></div></section>",
"<section id='bt' class='panel'><div class='card'><div class='ey'>Backtest sin leakage</div><h2>Prueba histórica sintética</h2><p class='muted'>Genera 30 estados, oculta a Jev el precio futuro y luego mide BUY/SELL/NO_TRADE con costos simulados del 0,25% por operación.</p><button id='runBt' class='btn primary'>Ejecutar backtest de 30 casos</button><div id='btout' class='hidden' style='margin-top:18px'><div class='grid'><div class='card metric'><small>Trades</small><strong id='btt'>0</strong></div><div class='card metric'><small>Win rate</small><strong id='btw'>—</strong></div><div class='card metric'><small>Retorno compuesto</small><strong id='btr'>—</strong></div></div></div></div></section>",
"<section id='hist' class='panel'><div class='card'><div class='row' style='justify-content:space-between;align-items:center'><div><div class='ey'>Registro</div><h2>Historial local</h2></div><button id='clear' class='btn'>Vaciar</button></div><div style='overflow:auto'><table class='table'><thead><tr><th>Fecha</th><th>Símbolo</th><th>Señal</th><th>Conf.</th></tr></thead><tbody id='tbody'></tbody></table></div></div></section>",
"</main><script>",
"var S={history:JSON.parse(localStorage.getItem('jev-history')||'[]')};function q(s){return document.querySelector(s)}function qa(s){return Array.from(document.querySelectorAll(s))}function num(id,d){var n=Number(q(id).value);return Number.isFinite(n)?n:(d||0)}function pct(n){return Number.isFinite(n)?Math.round(n*100)+'%':'—'}function save(){localStorage.setItem('jev-history',JSON.stringify(S.history))}function parse(env){var r=env&&env.result?env.result:env||{};var a=r.answers||r.output||r;var ta=a.trade_action||a.action||{};var action=ta.choice||ta.value||ta.answer||r.choice||r.action||'NO_TRADE';var c=Number(ta.confidence||r.confidence);var mq=a.market_quality||{};var tr=a.trade_risk||{};return{action:String(action).toUpperCase(),confidence:Number.isFinite(c)?c:NaN,quality:Number(mq.score),risk:Number(tr.score)}}",
"function render(){q('#mE').textContent=S.history.length;var last=S.history[S.history.length-1];q('#mS').textContent=last?last.action:'—';q('#mC').textContent=last?pct(last.confidence):'—';q('#tbody').innerHTML=S.history.slice().reverse().map(function(x){return '<tr><td>'+new Date(x.at).toLocaleString('es-AR')+'</td><td>'+x.symbol+'</td><td>'+x.action+'</td><td>'+pct(x.confidence)+'</td></tr>'}).join('')}",
"qa('.tab').forEach(function(b){b.onclick=function(){qa('.tab').forEach(function(x){x.classList.remove('on')});qa('.panel').forEach(function(x){x.classList.remove('on')});b.classList.add('on');q('#'+b.getAttribute('data-t')).classList.add('on')}});",
"async function health(){try{var r=await fetch('/api/health',{cache:'no-store'});var d=await r.json();if(d.ok&&d.aiBound){q('#status').textContent='JEV · ONLINE';q('#status').className='pill ok'}else{throw new Error('AI no vinculado')}}catch(e){q('#status').textContent='JEV · OFFLINE';q('#status').className='pill bad';q('#banner').textContent='Jev todavía no está disponible: '+(e.message||e);q('#banner').classList.remove('hidden')}}",
"q('#go').onclick=async function(){var b=q('#go');b.disabled=true;b.textContent='Evaluando…';try{var state={symbol:q('#sym').value.toUpperCase(),timestamp:new Date().toISOString(),price:num('#price'),return_1:num('#r1'),return_3:num('#r3'),ema_spread:num('#ema'),rsi:num('#rsi',50),volatility:num('#vol'),volume_zscore:num('#vz'),event:q('#event').value};var r=await fetch('/api/jev/evaluate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({state:state})});var d=await r.json();if(!r.ok)throw new Error(d.message||d.error);var p=parse(d.results[0]);q('#res').classList.remove('hidden');q('#dec').textContent=p.action;q('#dec').className='decision '+p.action;q('#conf').textContent=pct(p.confidence);q('#qual').textContent=Number.isFinite(p.quality)?p.quality.toFixed(2)+'/2':'—';q('#risk').textContent=Number.isFinite(p.risk)?p.risk.toFixed(2)+'/2':'—';S.history.push({at:new Date().toISOString(),symbol:state.symbol,action:p.action,confidence:p.confidence});save();render()}catch(e){alert('Error Jev: '+(e.message||e))}finally{b.disabled=false;b.textContent='Evaluar con Jev'}};",
"function rnd(seed){return function(){seed|=0;seed=seed+0x6D2B79F5|0;var t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}",
"q('#runBt').onclick=async function(){var b=q('#runBt');b.disabled=true;b.textContent='Ejecutando…';try{var R=rnd(260922),rows=[];for(var i=0;i<30;i++){var r1=(R()-.48)*.05,r3=r1*1.3+(R()-.5)*.025,ema=r3*.4+(R()-.5)*.01,vol=.012+R()*.045,rsi=Math.max(20,Math.min(80,50+r3*280+(R()-.5)*12)),entry=100+R()*250,fut=entry*(1+.35*r1+.4*r3+.45*ema+(R()-.5)*.05);rows.push({state:{symbol:['NVDA','MSFT','AAPL','AMD','META'][i%5],timestamp:new Date(2026,0,2+i).toISOString(),price:entry,return_1:r1,return_3:r3,ema_spread:ema,rsi:rsi,volatility:vol,volume_zscore:(R()-.5)*4},future:fut})}var resp=await fetch('/api/jev/evaluate',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({states:rows.map(function(x){return x.state})})});var d=await resp.json();if(!resp.ok)throw new Error(d.message||d.error);var eq=1,trades=0,wins=0;for(var j=0;j<rows.length;j++){var p=parse(d.results[j]);var ret=0;if(p.action==='BUY')ret=rows[j].future/rows[j].state.price-1;if(p.action==='SELL')ret=rows[j].state.price/rows[j].future-1;if(p.action!=='NO_TRADE'){ret-=.0025;trades++;if(ret>0)wins++;eq*=1+ret}}q('#btout').classList.remove('hidden');q('#btt').textContent=trades;q('#btw').textContent=trades?Math.round(wins/trades*100)+'%':'—';q('#btr').textContent=((eq-1)*100).toFixed(2)+'%'}catch(e){alert('Backtest: '+(e.message||e))}finally{b.disabled=false;b.textContent='Ejecutar backtest de 30 casos'}};",
"q('#clear').onclick=function(){S.history=[];save();render()};render();health();",
"</script></body></html>"
].join("");

export default {
  async fetch(request, env) {
    var url = new URL(request.url);
    if (url.pathname === "/api/health") {
      return json({
        ok: true,
        app: "jev-trading-lab",
        paperTradingOnly: true,
        realOrders: false,
        aiBound: !!(env.AI && typeof env.AI.run === "function"),
        model: "typesafe/jev",
        timestamp: new Date().toISOString()
      });
    }
    if (url.pathname === "/api/jev/evaluate" && request.method === "POST") {
      return await handleEvaluate(request, env);
    }
    if (url.pathname.indexOf("/api/") === 0) return json({error: "NOT_FOUND"}, 404);
    if (url.pathname === "/" || url.pathname === "/index.html") {
      return secure(new Response(PAGE, {
        headers: {"content-type": "text/html; charset=utf-8", "cache-control": "no-store"}
      }));
    }
    return new Response("Not found", {status: 404});
  }
};
