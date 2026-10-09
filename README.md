# Lucas examples

Ready-to-run examples for calling **[Lucas](https://lucasnode.app)**, pay-per-request research for AI agents over [x402](https://www.x402.org).

Pay per request in USDC on Base. No account and no API key. Every claim comes with a source, and anything that cannot be confirmed is marked unverified instead of guessed.

| Endpoint | Price | What you get |
|---|---|---|
| `POST https://api.lucasnode.app/api/x402/research` | $0.25 | A sourced answer to any research question |
| `POST https://api.lucasnode.app/api/x402/leads` | $1.00 | Up to 3 companies matching your criteria, each requirement checked with evidence and a source |

## Quickstart

You need Node.js 18 or newer and a wallet holding a little USDC on Base. You do not need ETH: the payment processor covers network fees.

```bash
git clone https://github.com/fgarzon78/lucas-examples.git
cd lucas-examples
npm install

# Quick research ($0.25)
EVM_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY node research.mjs "What is the x402 payment protocol and who created it?"

# Lead research ($1.00)
EVM_PRIVATE_KEY=YOUR_WALLET_PRIVATE_KEY node leads.mjs "US-based B2B software companies that sell scheduling tools to dental practices" 2
```

Replace `YOUR_WALLET_PRIVATE_KEY` with your own wallet's private key. The payment receipt prints first, then the JSON response.

## Keep your key safe

- Never commit a private key or paste it into code. These scripts read it from the `EVM_PRIVATE_KEY` environment variable only.
- Use a dedicated wallet that holds only what you plan to spend.
- The official x402 client refuses payments above $1 per request by default. Both Lucas endpoints are at or under $1, so they work with the default.

## How payment works

1. The script sends the request without payment and gets HTTP 402 with the price and payment details.
2. The x402 client signs a USDC payment on Base and retries the request.
3. Lucas runs the research and returns JSON. Payment settles only after a successful response.

Invalid requests (HTTP 400) and failed research (HTTP 502) are never charged.

## Example responses

Real responses from paid requests:

- [`examples/research-response.json`](examples/research-response.json): quick research on the x402 protocol
- [`examples/leads-response.json`](examples/leads-response.json): lead research on dental practice software

## Limits

- Public web sources only.
- Company-level information only: no personal contact details or private information about individuals.
- Figures such as private company revenue are third-party estimates.
- Live signals such as current ad activity are marked unverified unless recent, dated evidence exists.
- Results are produced by an AI researcher. Verify important facts before relying on them.

## Links

- Website: https://lucasnode.app
- Docs: https://lucasnode.app/docs
- For AI agents: https://lucasnode.app/llms.txt

## License

MIT. Copy and adapt these examples freely.
