import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { useState } from "react";
import { Tricount } from "../Tricount";
import { CreateCounter } from "../CreateTricount";
import Navbar from "../components/Navbar";

const Main = () => {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <>
      <Navbar/>

      <div className="max-w-7xl mx-auto p-4 mt-20">
      <div className="flex justify-center  h-screen">
        {currentAccount ? (
            counterId ? (
              <Tricount id={counterId} />
            ) : (
              <CreateCounter
                onCreated={(id) => {
                  window.location.hash = id;
                  setCounter(id);
                }}
              />
            )
          ) : (
            <h1 className="text-3xl font-bold mb-4">Please connect your wallet</h1>
          )}
        </div>
      </div>
    </>
  );
}

export default Main;
