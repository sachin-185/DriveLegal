import dotenv from 'dotenv';
import { CloudClient } from 'chromadb';
import { lawDatabase } from './src/data/lawDatabase.js';

dotenv.config();
const chromaClient = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

async function seed() {
  console.info("STARTING CHROMADB COMPLIANCE AUTO-SEEDER");
  try {
    const version = await chromaClient.version();
    console.info(`[Chroma] Connected to cloud. DB Engine Version: ${version}`);
    const collection = await chromaClient.getOrCreateCollection({
      name: "myCollection"
    });

    const initialCount = await collection.count();
    console.loinfog(`[Chroma] Collection 'myCollection' currently has ${initialCount} indexed documents.`);
    console.info("[Chroma] Packaging all regulatory schemas from lawDatabase.js...");
    const ids = [];
    const documents = [];
    const metadatas = [];

    Object.entries(lawDatabase.countries).forEach(([countryCode, country]) => {
      Object.entries(country.categories).forEach(([categoryKey, category]) => {
        category.rules.forEach((rule) => {
          const docText = `Country Jurisdiction: ${country.name} (${countryCode})\nViolation Category: ${category.name} (${categoryKey})\nOfficial Title: ${rule.title}\nLegal Statutory Citation: ${rule.section}\nBase Fine Penalty: ${country.symbol}${rule.baseFine} (${country.currency})\nDemerit Points Added: ${rule.points} points\nApplicable Vehicle Scope: ${rule.vehicleTypes.join(", ")}\nDetailed Provision: ${rule.description}`;
          ids.push(rule.id);
          documents.push(docText);
          metadatas.push({
            country: countryCode, category: categoryKey,
            ruleId: rule.id, section: rule.section,
            type: "regulatory_fact"
          });
        });
      });
    });

    console.info(`[Chroma] Upserting batch of ${ids.length} regulatory vector documents...`);
    // Upsert replaces existing or adds new rules, ensuring clean and accurate indexes
    await collection.upsert({
      ids, documents, metadatas
    });
    // Clean up any old dummy test documents if present
    try {
      await collection.delete({
        where: { type: { "$ne": "regulatory_fact" } }
      });
    } catch (cleanErr) {
      // Ignore if metadata filter is not supported
    }

    const finalCount = await collection.count();
    console.info(`AUTO-SEEDING COMPLETED SUCCESSFULLY!`);
    console.info(`Indexed ${finalCount} compliance dockets in vector database.`);
  } catch (error) {
    console.error("Auto-seeding execution failed:", error);
  }
  seed();
}