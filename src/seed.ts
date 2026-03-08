import { readFile } from "fs/promises";

interface SampleData {
  entries: string[];
}

const sampleData: SampleData = JSON.parse(
  await readFile("./sample-entries.json", "utf-8"),
);

console.log(`Loading ${sampleData.entries.length} sample entries...`);

for (let i = 0; i < sampleData.entries.length; i++) {
  try {
    const entry = sampleData.entries[i]!;
    const res = await fetch("http://localhost:3000/journal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entry }),
    });

    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      throw new Error(data.error || res.statusText);
    }

    console.log(`[${i + 1}/${sampleData.entries.length}] Added: ${entry}`);
    await new Promise((resolve) => setTimeout(resolve, 100));
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`Error adding entry ${i + 1}:`, msg);
  }
}

console.log("Database seeding complete!");
