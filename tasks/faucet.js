const fs = require("fs");


task("faucet", "Sends ETH and tokens to an address")
    .addPositionalParam("receiver", "The address that will receive them")
    .setAction(async ({ receiver }, { ethers }) => {
        // console.log("start");
        if (network.name === "hardhat") {
            console.warn(
                "You are running the faucet task with Hardhat network, which" +
                "gets automatically created and destroyed every time. Use the Hardhat" +
                " option '--network localhost'"
            );
        }

        const addressesFile = __dirname + "/../frontend/src/contracts/contract-address.json";
        console.log(addressesFile);
        if (!fs.existsSync(addressesFile)) {
            console.error("You need to deploy your contract first");
            return;
        }

        const addressJson = fs.readFileSync(addressesFile);
        const address = JSON.parse(addressJson);

        if ((await ethers.provider.getCode(address.Token)) === "0x") {
            console.error("You need to deploy your contract first");
            return;
        }
        
        const token = await ethers.getContractAt("Token", address.Token); //getContractAt:hardhat-ethers's helper function, it returns contract 
        const [sender] = await ethers.getSigners();
        // const senders = await ethers.getSigners();
        // console.log(senders[1].address);
    
        const tx = await token.transfer(receiver, 100);
        await tx.wait();
        
        const tx2 = await sender.sendTransaction({
            to: receiver,
            value: ethers.constants.WeiPerEther,
        });
        await tx2.wait();
        
        console.log(`Transferred 1 ETH and 100 tokens to ${receiver}`);
    }
);