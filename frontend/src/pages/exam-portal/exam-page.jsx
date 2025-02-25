import { useState } from "react";
import { ethers } from "ethers";
// Use 'with { type: "json" }' instead of 'assert { type: "json" }'
import ExamContractArtifact from "../../../../blockchain/artifacts/contracts/ExamContract.sol/ExamContract.json" with { type: "json" };

const ExamPage = () => {
    const [examID, setExamID] = useState("");
    const [examName, setExamName] = useState("");

    const createExam = async () => {
        if (!window.ethereum) {
            alert("Please install MetaMask to interact with the blockchain.");
            console.error("MetaMask is not installed.");
            return;
        }

        if (!ExamContractArtifact) {
            alert("Contract ABI is not loaded yet!");
            console.error("Contract ABI is missing.");
            return;
        }

        try {
            console.log("Connecting to Ethereum...");
            const provider = new ethers.BrowserProvider(window.ethereum);
            await window.ethereum.request({ method: "eth_requestAccounts" });

            const signer = await provider.getSigner();
            console.log("Connected to account:", await signer.getAddress());

            console.log("Loading contract...");
            const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, ExamContractArtifact.abi, signer);

            console.log("Sending transaction to blockchain...");
            console.log("Transaction Data:", { examID, examName, totalQuestions: 10, duration: 60, totalMarks: 100 });

            const tx = await contract.createExam(examID, examName, 10, 60, 100);
            console.log("Transaction sent:", tx.hash);

            await tx.wait();
            console.log("Transaction confirmed:", tx);
            alert("Exam Created Successfully!");
        } catch (error) {
            console.error("Transaction failed:", error);
            alert("Failed to create exam. Check the console for details.");
        }
    };

    return (
        <div>
            <input type="text" placeholder="Exam ID" value={examID} onChange={(e) => setExamID(e.target.value)} />
            <input type="text" placeholder="Exam Name" value={examName} onChange={(e) => setExamName(e.target.value)} />
            <button onClick={createExam}>Create Exam</button>
        </div>
    );
};

export default ExamPage;