import { Router, type Request, type Response } from "express";
import pool from "./connection";
import { getEmbedding } from "./embeddings";

const router = Router();

router.post("/", async (req: Request, res: Response) => {
  try {
    const { entry } = req.body as { entry?: string };

    if (!entry) {
      res.status(400).json({ error: "Entry text is required" });
      return;
    }

    const embedding = await getEmbedding(entry);

    await pool.query(
      "INSERT INTO journal_entries (entry, embedding) VALUES ($1, $2)",
      [entry, JSON.stringify(embedding)],
    );

    res.json({ status: "saved" });
  } catch (error) {
    console.error("Error saving entry:", error);
    res.status(500).json({ error: "Failed to save entry" });
  }
});

export default router;
