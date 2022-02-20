import { useEffect, useMemo, useState } from "react";

import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

const sdk = new ThirdwebSDK("rinkeby");

const bundleDropModule = sdk.getBundleDropModule(
    "0x1C2B77cDB690ecA78335935598D7530bc4447A12",
    );

    const App = () => {
      const { connectWallet, address, error, provider } = useWeb3();
      console.log("👋 Address:", address)
    
      // The signer is required to sign transactions on the blockchain.
      // Without it we can only read data, not write.
      const signer = provider ? provider.getSigner() : undefined;
    
      const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
      // isClaiming lets us easily keep a loading state while the NFT is minting.
      const [isClaiming, setIsClaiming] = useState(false);
    
      // Another useEffect!
      useEffect(() => {
        // We pass the signer to the sdk, which enables us to interact with
        // our deployed contract!
        sdk.setProviderOrSigner(signer);
      }, [signer]);
    
        useEffect(async () => {
        if(!address) {
          return;
        }
    
        const balance = await bundleDropModule.balanceOf(address, "0");
       
        try {
          if(balance.gt(0)) {
              setHasClaimedNFT(true);
              console.log("🌟 this user has a membership NFT!");
          } else {
              setHasClaimedNFT(false);
              console.log("😭 this user doesn't have a membership NFT.")
          }
        } catch (error) {
            setHasClaimedNFT(false);
            console.error("failed to nft balance", error);
        }
      }, [address]);

    
  
  // This is the case where the user hasn't connected their wallet
  // to your web app. Let them call connectWallet.
  if (!address) {
    return (
      <div className="landing">
        <h1>Welcome to ManDAO</h1>
        <button onClick={() => connectWallet("injected")} className="btn-hero">
          Connect your wallet
        </button>
      </div>
    );
  }
  

  const mintNft = async () => {
    setIsClaiming(true);
    try {
      // Call bundleDropModule.claim("0", 1) to mint nft to user's wallet.
      await bundleDropModule.claim("0",1);
      // Set claim state.
      setHasClaimedNFT(true);
      // Show user their fancy new NFT!
      console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${bundleDropModule.address}/0`);
    } catch (error) {
      console.error("failed to claim", error);
    } finally {
      // Stop loading state.
      setIsClaiming(false);
    }
  }


  // This is the case where we have the user's address
  // which means they've connected their wallet to our site!
//  return (
    
//    <div className="landing">
//      <div class="center-image">
//     <img src="https://i.imgur.com/S2maL8E.png"/>
//</div>
//<h1>Dao Connected</h1>
//    </div>);
//};


  // Render mint nft screen.
  return (
    <div className="mint-nft">
      <h1>Mint your free ManDAO Membership NFT</h1>
      <button
        disabled={isClaiming}
        onClick={() => mintNft()}
      >
        {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
      </button>
    </div>
  );
};

export default App;