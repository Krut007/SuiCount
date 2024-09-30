import { Transaction } from "@mysten/sui/transactions";
import { useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useNetworkVariable } from "./networkConfig";
import { useState } from "react";

export function CreateCounter({ onCreated }: { onCreated: (id: string) => void }) {
  const counterPackageId = useNetworkVariable("counterPackageId");
  const suiClient = useSuiClient();
  const { mutate: signAndExecute } = useSignAndExecuteTransaction({
    execute: async ({ bytes, signature }) =>
      await suiClient.executeTransactionBlock({
        transactionBlock: bytes,
        signature,
        options: {
          // Raw effects are required so the effects can be reported back to the wallet
          showRawEffects: true,
          showEffects: true,
        },
      }),
  });

  const [name, setName] = useState("");
  const [participantInputs, setParticipantInputs] = useState([""]);

  function isValidAddress(address: string): boolean {
    const regex = /^0x[a-fA-F0-9]{64}$/;
    return regex.test(address);
  }

  const handleParticipantInputChange = (index: number, value: string) => {
    const newParticipantInputs = [...participantInputs];
    newParticipantInputs[index] = value;
    setParticipantInputs(newParticipantInputs);

    if (index === participantInputs.length - 1 && isValidAddress(value)) {
      setParticipantInputs([...newParticipantInputs, ""]);
    }
  };

  const validParticipants = participantInputs.filter((addr) => isValidAddress(addr));

  const canCreate = name.trim() !== "" && validParticipants.length > 0;

  return (
    <div className="max-w-md mx-auto p-4 mt-20">
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Tricount Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered w-full"
          placeholder="Enter tricount name"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Participants:</label>
        {participantInputs.map((input, index) => (
          <input
            key={index}
            type="text"
            value={input}
            onChange={(e) => handleParticipantInputChange(index, e.target.value)}
            className={`input input-bordered w-full mb-2 ${
              input && !isValidAddress(input) ? "border-red-500" : ""
            }`}
            placeholder={`Participant ${index + 1} Address`}
          />
        ))}
      </div>
      <button
        className={`btn btn-primary $(!canCreate ? "btn=disqbled" : "")`}
        onClick={create}
        disabled={!canCreate}
      >
        Create TriCount
      </button>
    </div>
  );

  function create() {
    const tx = new Transaction();

    tx.moveCall({
      arguments: [tx.pure.string(name), tx.pure.vector("address", validParticipants)],
      target: `${counterPackageId}::tricount::new`,
    });

    signAndExecute(
      {
        transaction: tx,
      },
      {
        onSuccess: (result) => {
          const objectId = result.effects?.created?.[0]?.reference.objectId;
          if (objectId) {
            onCreated(objectId);
          }
        },
      }
    );
  }
}