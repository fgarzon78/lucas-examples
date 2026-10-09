// Lead research ($1.00): up to 3 companies matching a description,
// with every requirement checked against a source.
// Usage: EVM_PRIVATE_KEY=0x... node leads.mjs "Who you are looking for" [count 1-3]
import { wrapFetchWithPaymentFromConfig, decodePaymentResponseHeader } from "@x402/fetch";
import { ExactEvmScheme } from "@x402/evm";
import { privateKeyToAccount } from "viem/accounts";

const key = process.env.EVM_PRIVATE_KEY;
if (!key) {
  console.error("Set EVM_PRIVATE_KEY to the private key of a wallet holding USDC on Base.");
  process.exit(1);
}

const description =
  process.argv[2] ||
  "US-based B2B software companies that sell scheduling or practice-management tools to dental practices";
const count = process.argv[3] ? Number(process.argv[3]) : 3;

const account = privateKeyToAccount(key);
const fetchWithPayment = wrapFetchWithPaymentFromConfig(fetch, {
  schemes: [{ network: "eip155:8453", client: new ExactEvmScheme(account) }],
});

const res = await fetchWithPayment("https://api.lucasnode.app/api/x402/leads", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ description, count }),
});

const receipt = res.headers.get("payment-response");
if (receipt) console.error("Payment receipt:", decodePaymentResponseHeader(receipt));
console.log(JSON.stringify(await res.json(), null, 2));
if (!res.ok) process.exit(1);
