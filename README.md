# JEV Trading Lab

Worker de Cloudflare para evaluar si Jev aporta señal útil en paper trading y backtesting.

- Workers AI binding: `AI`
- Modelo: `typesafe/jev`
- No ejecuta órdenes reales.
- Endpoint de salud: `/api/health`

## Deploy

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/cargazul33/m1-motor)

Cloudflare aprovisiona el binding de Workers AI desde `wrangler.jsonc`.
