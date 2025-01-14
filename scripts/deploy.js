// scripts/deploy.js
async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const Upload = await ethers.getContractFactory("Upload");
  const upload = await Upload.deploy();

  console.log("Contract deployed to address:", upload.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
