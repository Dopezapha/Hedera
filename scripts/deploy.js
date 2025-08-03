async function main() {
  // Get the signer of the tx and address for minting the token
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // The deployer will also be the owner of our NFT contract
  const HashQuest = await ethers.getContractFactory("HashQuest", deployer);
  const contract = await HashQuest.deploy(deployer.address);

  console.log("Contract deployed at:", contract.target);
}

main().catch(console.error);