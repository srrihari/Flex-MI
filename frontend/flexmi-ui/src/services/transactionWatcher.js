import bankData from "../data/demoBankAccount.json";

export async function runTransactionWatcher(userId) {
  // 1️⃣ Get pointer
  const metaRes = await fetch(`https://flex-mi.onrender.com/api/meta/${userId}`);
  const meta = await metaRes.json();

  const lastIndex =
    typeof meta.lastProcessedTxnIndex === "number"
      ? meta.lastProcessedTxnIndex
      : -1;

  const nextIndex = lastIndex + 1;
  const nextTxn = bankData.transactions[nextIndex];

  if (!nextTxn) {
    console.log("✅ All transactions processed");
    return;
  }

  // 2️⃣ Process ONE transaction
  await fetch(
    `https://flex-mi.onrender.com/api/transaction/process/${userId}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nextTxn)
    }
  );

  // 3️⃣ Move pointer
  await fetch(`https://flex-mi.onrender.com/api/meta/${userId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lastProcessedTxnIndex: nextIndex
    })
  });

  console.log("✅ Processed transaction", nextIndex, nextTxn);
}
