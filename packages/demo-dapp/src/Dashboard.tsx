import { Button, Heading, Pane, Spinner, TextInput, toaster } from "evergreen-ui";
import { FC, useEffect, useState } from "react";
import { ReactComponent as Logo } from './assets/logo.svg';
import cls from "classnames";
import { enableSnap, getSignedMessage, sendTransaction } from "./services/snap";

export const Dashboard: FC = () => {
  const [snapConnected, setSnapConnected] = useState(false);
  // TODO
  const [userAddress, setUserAddress] = useState("B62qjSzhoBsUKNKALCJ5XeG5NCS3tR1WUFof7n82def1mquxXhrFaSF")
  const [userBalance, setUserBalance] = useState("909302")

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
    const signMessageResponse = await getSignedMessage(signMessageData);
    console.log(signMessageResponse)
    setIsLoading(false)
    toaster.success(`Sign message: ${signMessageResponse}`);
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
        <div className="verify-message box">
          <h2>Verify message</h2>
          <h3>Message</h3>
          <TextInput name="message" onChange={verifyMessageOnChange}/>
          <h3>Public key</h3>
          <TextInput name="publicKey" onChange={verifyMessageOnChange}/>
          <h3>Field</h3>
          <TextInput name="field" onChange={verifyMessageOnChange}/>
          <h3>Scalar</h3>
          <TextInput name="scalar" onChange={verifyMessageOnChange}/>
          <Button disabled={isLoading} onClick={verifyMessage}>Verify</Button>
        </div>
        </div>

      </div>
    }
  </div>

}
