import React, { useState } from 'react';
import {SuiClient } from '@mysten/sui/client';
import {JsonRpcProvider} from '@mysten/dapp-kit'

const SUI_RPC_URL = 'https://fullnode.devnet.sui.io:443';
const provider = new JsonRpcProvider(SUI_RPC_URL);

const TricountComponent = () => {
    const [name, setName] = useState('');
    const [participants, setParticipants] = useState('');
    const [amount, setAmount] = useState(0);
    const [consumerAddresses, setConsumerAddresses] = useState('');
    const [transactionHash, setTransactionHash] = useState('');
    const [error, setError] = useState('');

    const handleCreateVault = async () => {
        try {
            const participantsArray = participants.split(',').map(addr => addr.trim());
            const tx = await provider.executeMoveCall({
                packageObjectId: '0x3b347e37302978d0c0cd7c71a1a212085446ebfc4ea062d0bddcf2b4614ca4b9',
                module: 'tricount',
                function: 'new',
                arguments: [
                    name,
                    participantsArray,
                    // Add TxContext here, the SDK might auto fill it.
                ],
                gasBudget: 10000,
            });
            setTransactionHash(tx.digest);
            setError('');
        } catch (e) {
            setError(e.message);
            setTransactionHash('');
        }
    };

    const handleAddMoney = async () => {
        try {
            const consumersArray = consumerAddresses.split(',').map(addr => addr.trim());
            const tx = await provider.executeMoveCall({
                packageObjectId: '0x3b347e37302978d0c0cd7c71a1a212085446ebfc4ea062d0bddcf2b4614ca4b9',
                module: 'tricount',
                function: 'addMoney',
                arguments: [
                    /* Vault object reference here */,
                    amount,
                    consumersArray,
                    // Add TxContext here, the SDK might auto fill it.
                ],
                gasBudget: 10000,
            });
            setTransactionHash(tx.digest);
            setError('');
        } catch (e) {
            setError(e.message);
            setTransactionHash('');
        }
    };

    const handleBigRat = async () => {
        try {
            const tx = await provider.executeMoveCall({
                packageObjectId: '0x3b347e37302978d0c0cd7c71a1a212085446ebfc4ea062d0bddcf2b4614ca4b9',
                module: 'tricount',
                function: 'bigRat',
                arguments: [
                    /* Vault object reference here */,
                    // Add TxContext here, the SDK might auto fill it.
                ],
                gasBudget: 10000,
            });
            setTransactionHash(tx.digest);
            setError('');
        } catch (e) {
            setError(e.message);
            setTransactionHash('');
        }
    };

    return (
        <div>
            <h1>Tricount DApp</h1>
            <div>
                <h2>Create Vault</h2>
                <input
                    type="text"
                    placeholder="Vault Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Participants (comma separated addresses)"
                    value={participants}
                    onChange={(e) => setParticipants(e.target.value)}
                />
                <button onClick={handleCreateVault}>Create Vault</button>
            </div>
            <div>
                <h2>Add Money</h2>
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                />
                <input
                    type="text"
                    placeholder="Consumer Addresses (comma separated)"
                    value={consumerAddresses}
                    onChange={(e) => setConsumerAddresses(e.target.value)}
                />
                <button onClick={handleAddMoney}>Add Money</button>
            </div>
            <div>
                <h2>Big Rat</h2>
                <button onClick={handleBigRat}>Select Big Rat</button>
            </div>
            {transactionHash && (
                <div>
                    <h3>Transaction Hash</h3>
                    <p>{transactionHash}</p>
                </div>
            )}
            {error && (
                <div>
                    <h3>Error</h3>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default TricountComponent;