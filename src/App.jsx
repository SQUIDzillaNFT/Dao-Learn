import { useEffect, useMemo, useState } from "react";
import { useWeb3 } from "@3rdweb/hooks";
import { ThirdwebSDK } from "@3rdweb/sdk";

const sdk = new ThirdwebSDK("rinkerby");

const bundleDropModule = sdk.getBundleDropModule(
    "0x1C2B77cDB690ecA78335935598D7530bc4447A12",
);


const App = () => {
  // Use the connectWallet hook thirdweb gives us.
  const { connectWallet, address, error, provider } = useWeb3();
  console.log("👋 Address:", address)
//signer is req to sign transactions, without we could only read
  const signer = provider ? provider.getSigner() : undefined;  
  const [hasClaimedNFT, setHasClaimedNF] = useState(false);
  // is CLaiming lets us keep a loading state while the NFT mints
  const [isClaiming, setIsClaiming] = useState(false);
  
  // another useEffect
  useEffect(() => {
    //pass the signer to the sdk, to interact with contract
    sdk.setProviderOrSigner(signer);
  }, [signer]);
  
   useEffect(async () => {
     if(!address) {
       return;
     }
    const balance = await bundleDropModule.balanceOf(address, "0");

    try{
      if(balance.gt(0)) {
        setHasClaimedNFT(true);
        console.log("this user has a membership NFT");
      } else {
        setHasClaimedNFT(false);
        console.log("this user does not have a memebership NFT")
      }
    } catch(error) {
      setHasClaimedNFT(false);
      console.error("failed to NFT balance", error);
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
  

const mintNFT = async () => {
  setIsClaiming(true);
  try {
    //call bundleDropModule.claim("0", 1) to minto to users wallet
    await bundleDropModule.claim("0",1);
    //set claim state
    setHasClaimedNFT(true);
    //show user their new NFT
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
  return (
    
    <div className="landing">
      <div class="center-image">
     <img src="https://i.imgur.com/S2maL8E.png"/>
</div>
<h1>Dao Connected</h1>
    </div>);
};

export default App;