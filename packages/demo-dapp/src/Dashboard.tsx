import { Button, Dialog, Spinner, TextInput, TickCircleIcon, toaster } from "evergreen-ui";
import { FC, useEffect, useState } from "react";
import { ReactComponent as Logo } from './assets/logo.svg';
import cls from "classnames";
import { enableSnap, getSignMessage, isMetamaskSnapsSupported, sendTransaction, verifyMessage } from "./services/snap";
import { ISignMessageResponse, ITransactionResponse } from "./types";
import { VerifyMessage } from "./components/VerifyMessage";
import { Account } from "./components/Account";
import { SendTx } from "./components/SendTx";

export const Dashboard: FC = () => {
  const [snapConnected, setSnapConnected] = useState(false);
  const [isFlaskInstalled, setFlaskInstalled] = useState(false);

  const [signMessageResponse, setSignMessageResponse] = useState<ISignMessageResponse | null>(null)
  const [transactionResponse, setTransactionResponse] = useState<ITransactionResponse | null>(null)

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

  useEffect(() => {
    (async function () {
      try {
        const result = await isMetamaskSnapsSupported()
        setFlaskInstalled(result)
      } catch (e: any) {
        console.error(e)
      }
    })()
  }, [isFlaskInstalled])

  const onConnect = async () => {
    setIsLoading(true)
    try {
      const isConnected = await enableSnap()
      setSnapConnected(isConnected)
    } catch (e) {

    } finally {
      setIsLoading(false)
    }
  }

  //--SIGN MESSAGE
  const signMessageOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSignMessageData(e.target.value)
  }
  const signMessage = async () => {
    setIsLoading(true)
    try {
      const signMessageResponse = (await getSignMessage(signMessageData)) as ISignMessageResponse;
      setIsLoading(false)

      if (signMessageResponse.confirmed === false) {
        toaster.warning("Message not confirmed")
        return;
      }
      console.log(signMessageResponse)
      setSignMessageResponse(signMessageResponse)
      toaster.success(`Message signed successfully!: ${signMessageResponse.signature.data.message}`);
    } catch {
      setIsLoading(false)
      toaster.danger("Error signing message!");
    }
  }

  //--SEND TRANSACTION
  const sendTxOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSendTxData({ ...sendTxData, [e.target.name]: e.target.value })
  }

  const sendTx = async () => {
    setIsLoading(true)
    try {
      const sendTransactionResponse = (await sendTransaction(sendTxData)) as ITransactionResponse;
      if (sendTransactionResponse.error !== null) {
        throw new Error("Error");
      }

      if (sendTransactionResponse.confirmed === false) {
        setIsLoading(false);
        toaster.warning("Transaction not confirmed")
        return
      }

      setIsLoading(false);
      setTransactionResponse(sendTransactionResponse);
      toaster.success(`Sent transaction: ${sendTransactionResponse.tx.result.payment.hash}`);
    } catch(error) {
      setIsLoading(false)
      toaster.danger("Error signing message!");
    }
  }

  //--VERIFY MESSAGE
  const verifyMessageOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVerifyMessageData({ ...verifyMessageData, [e.target.name]: e.target.value })
  }
  const verifyMessageSubmit = async () => {
    setIsLoading(true);
    const result = await verifyMessage(verifyMessageData.field, verifyMessageData.scalar, verifyMessageData.publicKey, verifyMessageData.message);
    if (result) toaster.success("Message Successfully verified");
    else toaster.danger("Failed to verify message");
    setIsLoading(false);
  }

  return <div className="dashboard">
    {
      isLoading && <div className="spinner-container"><Spinner size={100} /></div>
    }
    <header className={cls({ connected: snapConnected })}>
      <h1 >Mina Snap</h1>
      <Logo className={cls({ connected: snapConnected })} />
    </header>
    {!snapConnected ?
      <>
        {
          isFlaskInstalled ?
            <Button disabled={true} className="connect-button">Metamask Flask Installed <TickCircleIcon style={{ marginLeft: "0.2rem" }} color="success" /></Button>
            :
            <a
              className="connect-button"
              href="https://github.com/ChainSafe/mina-snap/releases/tag/flask-demo"
              target="_blank" rel="noreferrer"
            >
              <Button className="connect-button">Install Metamask Flask</Button>
            </a>
        }

        <Button disabled={isLoading || !isFlaskInstalled} className="connect-button" onClick={() => onConnect()}>Connect snap</Button>
      </> :
      <div className="dashboard-connected">
        <div className="row">
          <Account />
          <div className="sign-message box">
            <h2>Sign message</h2>
            <TextInput name="signMessage" onChange={signMessageOnChange} />
            <Button disabled={isLoading} onClick={signMessage}>Sign</Button>
          </div>
        </div>
        <div className="row">
          <SendTx
            sendTxOnChange={sendTxOnChange}
            sendTx={sendTx}
            isLoading={isLoading}
          />
          <VerifyMessage
            verifyMessageChange={verifyMessageOnChange}
            verifyMessageSubmit={verifyMessageSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    }
    <Dialog
      title="Message signed successfully!"
      isShown={signMessageResponse !== null}
      onCloseComplete={() => setSignMessageResponse(null)}
      hasCancel={false}
      confirmLabel="OK"
    >
      {signMessageResponse && <>
        <p>Signature field</p>
        <p>{signMessageResponse.signature.signature.signature.field}</p>
        <p>Signature scalar</p>
        <p>{signMessageResponse.signature.signature.signature.scalar}</p>
      </>}
    </Dialog>
    <Dialog
      title="Transaction successfully sent!"
      isShown={transactionResponse !== null}
      onCloseComplete={() => setTransactionResponse(null)}
      hasCancel={false}
      confirmLabel="OK"
    >
      {transactionResponse && <>
        <p>Transaction response</p>
        {/* <p>{transactionResponse.tx.result.payment.hash}</p> */}
        <a className="link" target="_blank" rel="noopener noreferrer"  href={`https://devnet.minaexplorer.com/transaction/${transactionResponse.tx.result.payment.hash}`}>
        {transactionResponse.tx.result.payment.hash}
          </a>
      </>}
    </Dialog>
  </div>

}
