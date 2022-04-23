export const getEthereum = () => (window as any).ethereum;

export function hasMetaMask(): boolean {
    if (!getEthereum()) {
        return false;
    }
    return getEthereum().isMetaMask || false;
}
