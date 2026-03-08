import { Router, type Request, type Response } from "express";
import pool from "./connection";
import { getEmbedding } from "./embeddings";
import { answerQuestion } from "./llm";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { question } = req.body as { question?: string };

    if (!question) {
      res.status(400).json({ error: "Question is required" });
      return;
    }

    const questionEmbedding = await getEmbedding(question);

    const result = await pool.query(
      "SELECT id, entry, created_at FROM journal_entries ORDER BY embedding <=> $1 LIMIT 5",
      [JSON.stringify(questionEmbedding)],
    );

    const matches = result.rows;

    if (matches.length === 0) {
      res.json({
        answer: "No matching journal entries found.",
        matches: [],
      });
      return;
    }

    const answer = await answerQuestion(question, matches);

    res.json({
      answer,
      matches,
    });
  } catch (error) {
    console.error("Error answering question:", error);
    res.status(500).json({ error: "Failed to answer question" });
  }
});

export default router;
