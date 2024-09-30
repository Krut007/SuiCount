import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
  useSuiClient,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import type { SuiObjectData } from "@mysten/sui/client";
import { Transaction } from "@mysten/sui/transactions";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";

export function TriCount({ id }: { id: string }) {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          showRawEffects: true,
          showEffects: true,
        },
      }),
  });
  const { data, isPending, error, refetch } = useSuiClientQuery("getObject", {
    id,
    options: {
      showContent: true,
      showOwner: true,
    },
  });

  const [amount, setAmount] = useState(0);
  const [balanceAddress, setBalanceAddress] = useState("");
  const [balance, setBalance] = useState<number | null>(null);

  const executeAddMoney = () => {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [tx.object(id), tx.pure.u64(amount), tx.pure.vector("address", [balanceAddress])],
      target: `${counterPackageId}::tricount::addMoney`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async () => {
          await refetch();
        },
      },
    );
  };

  const executeGetBalance = () => {
    const tx = new Transaction();
    tx.moveCall({
      arguments: [tx.object(id), tx.pure.address(balanceAddress)],
      target: `${counterPackageId}::tricount::balance`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: async (result) => {
          const returnValue = 0;
          if (returnValue) {
            setBalance(Number(returnValue));
            alert(`Balance: ${returnValue}`);
          } else {
            alert("Failed to retrieve balance.");
          }
        },
      },
    );
  };

  if (isPending) return <p>Loading...</p>;

  if (error) return <p>Error: {error.message}</p>;

  if (!data.data) return <p>Not found</p>;

  return (
    <div className="max-w-md mx-auto p-4 mt-20">
      <h1 className="text-3xl font-bold mb4">TriCount</h1>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="input input-bordered w-full"
          placeholder="Enter amount"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Balance address:</label>
        <input
          type="text"
          value={balanceAddress}
          onChange={(e) => setBalanceAddress(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Enter account address"
        />
      </div>

      <div className="flex flex-col gap-2">
        <button className="btn btn-primary" onClick={executeAddMoney}>
          Add Money
        </button>
        <button className="btn btn-secondary" onClick={executeGetBalance}>
          Check Balance
        </button>
        {balance !== null && <p>Balance: {balance}</p>}
      </div>
    </div>
  );
}

function getCounterFields(data: SuiObjectData) {
  if (data.content?.dataType !== "moveObject") {
    return null;
  }

  return data.content.fields as { value: number; owner: string };
}