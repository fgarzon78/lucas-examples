// Quick research ($0.25): a sourced answer to any research question.
// Usage: EVM_PRIVATE_KEY=0x... node research.mjs "Your question"
import { wrapFetchWithPaymentFromConfig, decodePaymentResponseHeader } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";

const key = process.env.EVM_PRIVATE_KEY;
if (!key) {
  console.error("Set EVM_PRIVATE_KEY to the private key of a wallet holding USDC on Base.");
  process.exit(1);
}

const question =
  process.argv.slice(2).join(" ") || "Which payment processors does Shopify Plus support natively in the US?";

const account = privateKeyToAccount(key);
const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [{ network: "eip155:8453", client: new ExactEvmScheme(account) }],
});

const res = await fetchWithPayment("https://api.lucasnode.app/api/x402/research", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ question }),
});

const receipt = res.headers.get("payment-response");
if (receipt) console.error("Payment receipt:", decodePaymentResponseHeader(receipt));
console.log(JSON.stringify(await res.json(), null, 2));
if (!res.ok) process.exit(1);
