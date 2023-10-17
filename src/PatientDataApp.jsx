import React, { useState, useEffect } from 'react';
import Web3 from 'web3';

const PatientDataApp = ({ contractAddress }) => {
  const [contract, setContract] = useState(null);
  const [owner, setOwner] = useState(null);
  const [userData, setUserData] = useState('');
  const [newData, setNewData] = useState('');
  const [isOwner, setIsOwner] = useState(false);

  const ContractABI=[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "patientAddress",
          "type": "address"
        },
        {
          "internalType": "string",
          "name": "data",
          "type": "string"
        }
      ],
      "name": "insertPatientData",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [],
      "name": "getPatientData",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "patientAddress",
          "type": "address"
        }
      ],
      "name": "hasPatientData",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "internalType": "address",
          "name": "",
          "type": "address"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

  const loadWeb3 = async () => {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log('Non-Ethereum browser detected. You should consider installing MetaMask.');
    }
  };

  const connectWallet = async () => {
    await loadWeb3();

    const web3 = window.web3;
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];

    if (userAddress === owner) {
      setIsOwner(true);
    }

    const deployedContract = new web3.eth.Contract(ContractABI, contractAddress);
    setContract(deployedContract);
  };

  const checkIsOwner = async () => {
    if (contract && owner) {
      const isContractOwner = await contract.methods.owner().call();
      if (isContractOwner === owner) {
        setIsOwner(true);
      }
    }
  };

  const insertData = async () => {
    if (!contract) {
      return;
    }

    try {
      await contract.methods.insertPatientData(owner, newData).send({ from: owner });
    } catch (error) {
      console.error(error);
    }
  };

  const getPatientData = async () => {
    if (!contract) {
      return;
    }

    try {
      const data = await contract.methods.getPatientData().call({ from: owner });
      setUserData(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadWeb3();
  }, []);

  useEffect(() => {
    connectWallet();
  }, [owner]);

  useEffect(() => {
    checkIsOwner();
  }, [contract, owner]);

  return (
    <div>
      <h1>Patient Data</h1>
      <p>Your Wallet Address: {owner}</p>
      {isOwner && <p>You are the owner.</p>}
      <div>
        <h2>Insert Data (Owner Only)</h2>
        <input
          type="text"
          value={newData}
          onChange={(e) => setNewData(e.target.value)}
        />
        {isOwner && <button onClick={insertData}>Insert Data</button>}
      </div>
      <div>
        <h2>Retrieve Your Data</h2>
        <button onClick={getPatientData}>Get Data</button>
        <p>Your Data: {userData}</p>
      </div>
    </div>
  );
};

export default PatientDataApp;
