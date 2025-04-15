const hre = require("hardhat");

async function main() {
  const [deployer, admin, faculty1] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  // Get the contract factory and deploy the contract
  const ExamContract = await hre.ethers.getContractFactory("ExamContract");
  const examContract = await ExamContract.deploy();
  console.log("Deploying contract...");
  console.log(`ExamContract deploying to: ${examContract.target}`);

  // Wait for the contract deployment to be confirmed via the transaction receipt
  const deployTx = await examContract.deployTransaction(); // Wait for deployment transaction confirmation
  console.log("Contract deployed to:", examContract.address); // Ensure the contract address is printed after deployment

  // Proceed with assigning roles
  console.log("Assigning admin...");
  await examContract.setAdmin(admin.address);
  console.log("Admin assigned:", admin.address);

  console.log("Assigning faculty...");
  await examContract.addFaculty(faculty1.address);
  console.log("Faculty added:", faculty1.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Deployment failed:", error);
    process.exit(1);
  });
