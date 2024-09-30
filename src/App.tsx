import { ConnectButton, useCurrentAccount } from "@mysten/dapp-kit";
import { isValidSuiObjectId } from "@mysten/sui/utils";
import { useState } from "react";
import { Counter } from "./Tricount";
import { CreateCounter } from "./CreateTricount";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './pages/Main';
import NFT from './pages/NFT';

function App() {
  const currentAccount = useCurrentAccount();
  const [counterId, setCounter] = useState(() => {
    const hash = window.location.hash.slice(1);
    return isValidSuiObjectId(hash) ? hash : null;
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/NFT" element={<NFT />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
