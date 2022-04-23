import React from "react"
import { Button, TextInput } from "evergreen-ui"

interface IVerifyMessage {
  isLoading: boolean;
  verifyMessageChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  verifyMessageSubmit: () => Promise<void>
}

export const VerifyMessage: React.FC<IVerifyMessage> = ({verifyMessageChange, verifyMessageSubmit, isLoading}) => {
  return (
    <div className="send-tx box">
    <h2>Send message</h2>
    <h3>Message</h3>
    <TextInput name="message" onChange={verifyMessageChange} />
    <h3>Public key</h3>
    <TextInput name="publicKey" onChange={verifyMessageChange} />
    <h3>Field</h3>
    <TextInput name="field" onChange={verifyMessageChange} />
    <h3>Scalar</h3>
    <TextInput name="scalar" onChange={verifyMessageChange} />
    <Button disabled={isLoading} onClick={verifyMessageSubmit}>Send</Button>
  </div>
  )
}