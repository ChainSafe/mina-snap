# MinaSnap
![](https://github.com/chainsafe/minasnap/workflows/ci/badge.svg)

Metamask Snap to enable Metamask users to interact with Mina protocol.

## Development

Due to huge build size because of `mina-signer` dependency, Metamask snap evaluation
takes >2mins which makes snap really hard to use. For that reason we created custom Metamask build
without snap evaluation. Solution to this problem is leaner `mina-signer` dependency.

> Plase note you can still use official Metamask Flask from Chrome store but it will be extreamely slow.


Intructions:
1. Install custom build of Metamask Flask for Chrome browser from our repository
   - `wget https://github.com/ChainSafe/mina-snap/releases/download/flask-demo/metamask-flask-chrome-10.13.0-flask.0.zip`
   - uzinp
   - Open Chrome -> Extensions -> Toggle Developer Mode -> Load Unpacked and point it to the extracted extension directory 
2. `yarn`
3. `yarn run demo`
