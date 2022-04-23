import { Button, Heading, Pane, TextInput, toaster } from "evergreen-ui";
import { FC, useEffect, useState } from "react";
import { ReactComponent as Logo } from './assets/logo.svg';
import cls from "classnames";

export const Dashboard: FC = () => {
  const [snapConnected, setSnapConnected] = useState(false);
  const [userAddress, setUserAddress] = useState("B62qjSzhoBsUKNKALCJ5XeG5NCS3tR1WUFof7n82def1mquxXhrFaSF")
  const [userBalance, setUserBalance] = useState("909302")

  const signMessage = () => {
    //TODO
    toaster.success("Message signed");
  }

  const sendMessage = () => {
    //TODO
    toaster.success("Message sent");
  }

  const verifyMessage = () => {
    //TODO
    toaster.success("Message verified");
  }

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

    <header>
      <h1 >Mina Snap</h1>
      <Logo className={cls({ connected: snapConnected })} />
    </header>
    {!snapConnected ?
      <Button onClick={() => setSnapConnected(true)}>Connect snap</Button> :
      <div className="dashboard-connected">
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
          <TextInput></TextInput>
          <Button onClick={signMessage}>Sign</Button>
        </div>
        <div className="send-tx box">
          <h2>Send message</h2>
          <h3>Recipient</h3>
          <TextInput></TextInput>
          <h3>Memo</h3>
          <TextInput></TextInput>
          <h3>Amount</h3>
          <TextInput></TextInput>
          <Button onClick={sendMessage}>Send</Button>
        </div>
        <div className="verify-message box">
          <h2>Verify message</h2>
          <h3>Message</h3>
          <TextInput></TextInput>
          <h3>Public key</h3>
          <TextInput></TextInput>
          <h3>Field</h3>
          <TextInput></TextInput>
          <h3>Scalar</h3>
          <TextInput></TextInput>
          <Button onClick={verifyMessage}>Verify</Button>
        </div>
      </div>
    }
  </div>

}