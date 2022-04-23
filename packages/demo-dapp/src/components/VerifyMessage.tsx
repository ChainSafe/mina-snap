import {Button, Spinner, TextInputField, toaster} from "evergreen-ui";
import {verifyMessage} from "../services/snap";
import {ChangeEvent, useState} from "react";

type Event = ChangeEvent<HTMLInputElement>;

export const VerifyMessage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [publicKey, setPublicKey] = useState('');
    const [field, setField] = useState('');
    const [scalar, setScalar] = useState('');

    const verify = async () => {
        setIsLoading(true);
        const result = await verifyMessage(field, scalar, publicKey, message);
        console.warn(result);
        if (result) toaster.success("Message Successfully verified");
        else toaster.danger("Failed to verify message");
        setIsLoading(false);
    }

    return (
        <>
            {isLoading && <div className="spinner-container"><Spinner/></div>}
            <div className="verify-message box">
                <h2>Verify message</h2>
                <TextInputField
                    onChange={(e: Event) => setMessage(e.target.value)}
                    label="Message"
                    required
                    placeholder="Placeholder text"
                />
                <TextInputField
                    onChange={(e: Event) => setPublicKey(e.target.value)}
                    label="Public key"
                    required
                    placeholder="Placeholder text"
                />
                <TextInputField
                    onChange={(e: Event) => setField(e.target.value)}
                    label="Field"
                    required
                    placeholder="Placeholder text"
                />
                <TextInputField
                    onChange={(e: Event) => setScalar(e.target.value)}
                    label="Scalar"
                    required
                    placeholder="Placeholder text"
                />
                <Button onClick={verify}>Verify</Button>
            </div>
        </>
    );
};
