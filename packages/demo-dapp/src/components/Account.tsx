import {Select, toaster} from "evergreen-ui";
import {useEffect, useState} from "react";
import useInterval from "use-interval";
import {getAccount, getNetwork, setNetwork} from "../services/snap";

export const Account: React.FC = () => {
    const [userAddress, setUserAddress] = useState("loading...");
    const [userBalance, setUserBalance] = useState("loading...");
    const [network, setSelectNetwork] = useState('');

    const updateNetwork = async (network: string) => {
        await setNetwork(network);
        setSelectNetwork(network);
    };

    useInterval(() => {
        getAccount().then((account) => {
            setUserBalance(account.account.balance.total);
        }).catch();
    }, 30000);

    useEffect(() => {
        (async function () {
            try {
                const snapNetwork = await getNetwork();
                setSelectNetwork(snapNetwork);
                const account = await getAccount();
                setUserAddress(account.account.publicKey);
                setUserBalance(account.account.balance.total);
            } catch(e: any) {
                console.error(e);
                toaster.danger(e.message);
            }
        })()
    }, []);

    return (
        <div className="user-data box">
            <div>
                <h3>Network</h3>
                <Select value={network} width="100%" onChange={event => updateNetwork(event.target.value)}>
                    <option value="mainnet">Main Network</option>
                    <option value="devnet">Test Network</option>
                </Select>
            </div>
            <div>
                <h3>Address</h3>
                <p>{userAddress}</p>
            </div>
            <div>
                <h3>Balance</h3>
                <p>{userBalance} MINA</p>
            </div>
        </div>
    );
};
