import React, { useState } from 'react';
import { Button, Pane, Text, majorScale } from 'evergreen-ui'
import { Dashboard } from './Dashboard';

export const defaultSnapId = 'local:http://localhost:8081';

const connect = async () => {
  // @ts-ignore
  await window.ethereum.request({
    method: "wallet_enable",
    params: [
      {
        [`wallet_snap_${defaultSnapId}`]: {version: "latest"},
      },
    ],
  });
};

const getKey = async () => {
  // @ts-ignore
  console.log(await window.ethereum.request({
    method: 'wallet_invokeSnap',
    params: [
      defaultSnapId,
      { method: "mina_getPublicKey" }
    ]
  }));
};

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={connect}>connect SNAP!</button>
        <button onClick={getKey}>generate key</button>
      </header>
      <Dashboard />
    </div>
  );
}

export default App;
