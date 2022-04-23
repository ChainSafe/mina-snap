import { Button, Spinner, TextInput, toaster } from "evergreen-ui";
import { FC, useEffect, useState } from "react";
import { ReactComponent as Logo } from './assets/logo.svg';
import cls from "classnames";
import { enableSnap, getAccount, getSignMessage, sendTransaction } from "./services/snap";
import { ISignMessageResponse } from "./types";
import {VerifyMessage} from "./components/VerifyMessage";
import useInterval from "use-interval";

export const Dashboard: FC = () => {
  const [snapConnected, setSnapConnected] = useState(false);
  // TODO
  const [userAddress, setUserAddress] = useState("loading...")
  const [userBalance, setUserBalance] = useState("loading...")

  const [signMessageData, setSignMessageData] = useState("");
  const [sendTxData, setSendTxData] = useState({
    to: "",
    memo: "",
    amount: "",
    fee: ""
  })
  const [verifyMessageData, setVerifyMessageData] = useState({
    message: "",
    publicKey: "",
    field: "",
    scalar: ""
  });

  const [isLoading, setIsLoading] = useState(false);

  useInterval(() => {
    getAccount().then((account) => {
      setUserBalance(account.account.balance.total);
    }).catch()
  }, 30000)

  useEffect(() => {
    if(!snapConnected) return;
    (async function () {
      setIsLoading(true)
      try {
        const account = await getAccount();
        setUserAddress(account.account.publicKey);
        setUserBalance(account.account.balance.total);
      } catch(e: any) {
        console.error(e)
        toaster.danger(e.message)
      }
      setIsLoading(false)
    })()
  }, [snapConnected])

  const onConnect = async () => {
    setIsLoading(true)
    const isConnected = await enableSnap()
    setIsLoading(false)
    setSnapConnected(isConnected)
  }

  //--SIGN MESSAGE
  const signMessageOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignMessageData(e.target.value)
  }
  const signMessage = async () => {
    setIsLoading(true)
    try{
      const signMessageResponse = (await getSignMessage(signMessageData)) as ISignMessageResponse;
      setIsLoading(false)
      if(signMessageResponse.confirmed === false) {
        toaster.warning("Message not confirmed")
      }
      toaster.success(`Message signed successfully!: ${signMessageResponse.signature.data.message}`);
    } catch {
      setIsLoading(false)
      toaster.danger("Error signing message!");
    }
  }

  //--SEND TRANSACTION
  const sendTxOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendTxData({...sendTxData, [e.target.name]: e.target.value})
  }
  const sendTx = async () => {
    setIsLoading(true)
    const sendTransactionResponse = await sendTransaction(sendTxData);
    console.log(sendTransactionResponse)
    setIsLoading(false)
    toaster.success(`Sent transaction: ${sendTransactionResponse}`);
  }

  //--VERIFY MESSAGE
  const verifyMessageOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerifyMessageData({...verifyMessageData, [e.target.name]: e.target.value})
  }
  const verifyMessage = () => {
    //TODO
    toaster.success("Message verified");
  }
  //TODO--user data
  // useEffect(() => {
  //   (async () => {
  //     // @ts-ignore
  //     await window.ethereum.request({
  //       method: 'wallet_invokeSnap',
  //       params: [
  //         defaultSnapId,
  //         { method: "key" }
  //       ]
  //     });
  //   })();
  // }, [])

  return <div className="dashboard">
    {
      isLoading && <div className="spinner-container"><Spinner size={100}/></div>
    }
    <header>
      <h1 >Mina Snap</h1>
      <Logo className={cls({ connected: snapConnected })} />
    </header>
    {!snapConnected ?
      <Button disabled={isLoading} className="connect-button" onClick={() => onConnect()}>Connect snap</Button> :
      <div className="dashboard-connected">
        <div className="row">
          <div className="user-data box">
            <div>
              <h3>Address</h3>
              <p>{userAddress}</p>
            </div>
            <div>
              <h3>Balance</h3>
              <p>{userBalance} MINA</p>
            </div>
          </div>
          <div className="sign-message box">
            <h3>Sign message</h3>
            <TextInput name="signMessage" onChange={signMessageOnChange}/>
            <Button disabled={isLoading} onClick={signMessage}>Sign</Button>
          </div>
        </div>
        <div className="row">
        <div className="send-tx box">
          <h2>Send message</h2>
          <h3>To</h3>
          <TextInput name="to" onChange={sendTxOnChange}/>
          <h3>Memo</h3>
          <TextInput name="memo" onChange={sendTxOnChange}/>
          <h3>Amount</h3>
          <TextInput name="amount" onChange={sendTxOnChange}/>
          <h3>Fee</h3>
          <TextInput name="fee" onChange={sendTxOnChange}/>
          <Button disabled={isLoading} onClick={sendTx}>Send</Button>
        </div>
        <VerifyMessage />
        </div>

      </div>
    }
  </div>

}
