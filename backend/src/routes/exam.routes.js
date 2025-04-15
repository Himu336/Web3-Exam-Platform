import express from "express";
import { ethers } from "ethers";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const router = express.Router();

// Get the current file directory (for ESM compatibility)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load ExamContract ABI manually
const contractPath = path.join(__dirname, "../../../blockchain/artifacts/contracts/ExamContract.sol/ExamContract.json");
const ExamContractArtifact = JSON.parse(fs.readFileSync(contractPath, "utf-8"));

// Blockchain connection
const provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);
const wallet = new ethers.Wallet(process.env.ADMIN_PRIVATE_KEY, provider);
const contractAddress = process.env.EXAM_CONTRACT_ADDRESS;
const examContract = new ethers.Contract(contractAddress, ExamContractArtifact.abi, wallet);

// API: Create Exam
router.post("/create", async (req, res) => {
    console.log("Received request:", req.body);  // Debug JSON input

    const { examID, examName, totalQuestions, duration, totalMarks } = req.body;

    if (!examID || !examName || !totalQuestions || !duration || !totalMarks) {
        return res.status(400).json({ error: "Missing required fields in request" });
    }

    try {
        if (!examContract) {
            return res.status(500).json({ error: "Smart contract not initialized" });
        }

        const tx = await examContract.createExam(examID, examName, totalQuestions, duration, totalMarks);
        await tx.wait();
        res.status(201).json({ message: "Exam created successfully" });
    } catch (error) {
        console.error("Transaction error:", error);
        res.status(500).json({ error: error.message });
    }
});

export default router;
