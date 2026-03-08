import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface JournalEntry {
  entry: string;
}

export async function answerQuestion(
  question: string,
  entries: JournalEntry[],
): Promise<string> {
  const entriesContext = entries.map((e) => `- ${e.entry}`).join("\n");

  const prompt = `Based on the following journal entries, answer the question.

Journal Entries:
${entriesContext}

Question: ${question}

Provide a clear, concise answer.`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  });

  return response.choices[0]!.message.content!;
}
