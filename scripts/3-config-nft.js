import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const bundleDrop = sdk.getBundleDropModule(
  "0x1C2B77cDB690ecA78335935598D7530bc4447A12",
);

(async () => {
  try {
    await bundleDrop.createBatch([
      {
        name: "MANDAO DAO DAO",
        description: "This NFT gives you access to ManDAO!",
        image: readFileSync("scripts/assets/lacedameon.png"),
      },
    ]);
    console.log("✅ Successfully created a new NFT in the drop!");
  } catch (error) {
    console.error("failed to create the new NFT", error);
  }
})()