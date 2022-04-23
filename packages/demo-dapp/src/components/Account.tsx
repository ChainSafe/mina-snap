import {toaster} from "evergreen-ui";
import {useEffect, useState} from "react";
import useInterval from "use-interval";
import {getAccount} from "../services/snap";

export const Account: React.FC = () => {
    const [userAddress, setUserAddress] = useState("loading...");
    const [userBalance, setUserBalance] = useState("loading...");

    useInterval(() => {
        getAccount().then((account) => {
            setUserBalance(account.account.balance.total);
        }).catch();
    }, 30000);

    useEffect(() => {
        (async function () {
            try {
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
