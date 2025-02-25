const hre = require("hardhat");

async function main() {
  const ExamContract = await hre.ethers.getContractFactory("ExamContract");
  const examContract = await ExamContract.deploy();
  // In ethers v6, the deployed() function is removed.
  console.log(`ExamContract deployed to: ${examContract.target}`); // Use .target for ethers v6
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
