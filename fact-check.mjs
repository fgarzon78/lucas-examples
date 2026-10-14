// Fact check ($0.05): a verdict on one claim, with its source.
// Usage: EVM_PRIVATE_KEY=0x... node fact-check.mjs "Your claim or yes/no question"
import { wrapFetchWithPaymentFromConfig, decodePaymentResponseHeader } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";

const key = process.env.EVM_PRIVATE_KEY;
if (!key) {
  console.error("Set EVM_PRIVATE_KEY to the private key of a wallet holding USDC on Base.");
  process.exit(1);
}

const claim = process.argv.slice(2).join(" ") || "Supabase's Pro plan starts at $25 per month.";

const account = privateKeyToAccount(key);
const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [{ network: "eip155:8453", client: new ExactEvmScheme(account) }],
});

const res = await fetchWithPayment("https://api.lucasnode.app/api/x402/fact-check", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ claim }),
});

const receipt = res.headers.get("payment-response");
if (receipt) console.error("Payment receipt:", decodePaymentResponseHeader(receipt));
console.log(JSON.stringify(await res.json(), null, 2));
if (!res.ok) process.exit(1);
