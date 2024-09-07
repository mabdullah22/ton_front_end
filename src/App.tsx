import './App.css';
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMainContract } from "./hooks/useMainContract";
import { useTonConnect } from './hooks/useTonConnect';
import { fromNano } from 'ton-core';
import WebApp from "@twa-dev/sdk";
import { MainButton } from '@twa-dev/sdk/react';




function App() {
  const { connected } = useTonConnect();

  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
    sendDeposit,
    sendWithdrawl
  } = useMainContract();
  const showAlert = () => {
    WebApp.showAlert("Hey there!");
  };

  return (
    <div>
    <div>
      <TonConnectButton />
    </div>
   
    {connected && (
              <a
                onClick={() => {
                  sendIncrement();
                }}
              >
                Increment
              </a>

              
            )}
            <br/>
    {connected && (
      <a
      onClick={() => {
        sendDeposit();
      }}
    >
      Deposit
    </a>
    )}
    <br/>
    {connected && (
      <a
      onClick={() => {
        sendWithdrawl();
      }}
    >
      Withdraw 1 Ton
    </a>
    )}

<a onClick={() => {
            showAlert();
          }}
        >
          Show Alert
        </a>
    <MainButton text="Submit" onClick={() => alert('submitted')} />

    <div>

      <div className='Card'>
      <b>{WebApp.platform}</b>
      <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          {contract_balance && (
            <div className='Hint'>{fromNano(contract_balance)}</div>
          )}
      </div>

      <div className='Card'>
        <b>Counter Value</b>
      <div>{counter_value ?? "Loading..."}</div>
      </div>
    </div>
    </div>
  );
}

export default App;

