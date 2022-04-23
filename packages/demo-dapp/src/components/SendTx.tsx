import { Button, TextInput } from "evergreen-ui"

interface ISendTx {
  isLoading: boolean;
  sendTxOnChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  sendTx: () => Promise<void>
}

export const SendTx: React.FC<ISendTx> = ({sendTxOnChange, sendTx, isLoading}) => {
  return (
    <div className="send-tx box">
    <h2>Send message</h2>
    <h3>To</h3>
    <TextInput name="to" onChange={sendTxOnChange} />
    <h3>Memo</h3>
    <TextInput name="memo" onChange={sendTxOnChange} />
    <h3>Amount</h3>
    <TextInput name="amount" onChange={sendTxOnChange} />
    <h3>Fee</h3>
    <TextInput name="fee" onChange={sendTxOnChange} />
    <Button disabled={isLoading} onClick={sendTx}>Send</Button>
  </div>
  )
}