import dotenv from 'dotenv';
import { CloudClient } from 'chromadb';
import { lawDatabase } from './src/data/lawDatabase.js';

dotenv.config();

// Initialize Chroma Cloud Client
const chromaClient = new CloudClient({
  apiKey: process.env.CHROMA_API_KEY,
  tenant: process.env.CHROMA_TENANT,
  database: process.env.CHROMA_DATABASE,
});

async function seed() {
  console.log("=========================================");
  console.log("⚡ STARTING CHROMADB COMPLIANCE AUTO-SEEDER");
  console.log("=========================================");

  try {
    const version = await chromaClient.version();
    console.log(`[Chroma] Connected to cloud. DB Engine Version: ${version}`);

    // Retrieve or create the collection
    const collection = await chromaClient.getOrCreateCollection({
      name: "myCollection"
    });

    const initialCount = await collection.count();
    console.log(`[Chroma] Collection 'myCollection' currently has ${initialCount} indexed documents.`);

    if (initialCount > 0) {
      console.log("[Chroma] Vector indexes already populated. Skipping auto-seeding.");
      return;
    }
    console.log("[Chroma] Auto-indexing all regulatory schemas from lawDatabase.js...");
    const ids = [];
    const documents = [];
    const metadatas = [];
    // Map through countries, categories, and rules to generate vector grounding nodes
    Object.entries(lawDatabase.countries).forEach(([countryCode, country]) => {
      Object.entries(country.categories).forEach(([categoryKey, category]) => {
        category.rules.forEach((rule) => {
          // Construct high-fidelity, grounded text block for embedding semantic index matching
          const docText = `Country Jurisdiction: ${country.name} (${countryCode})
Violation Category: ${category.name} (${categoryKey})
Official Title: ${rule.title}
Legal Statutory Citation: ${rule.section}
Base Fine Penalty: ${country.symbol}${rule.baseFine} (${country.currency})
Demerit Points Added: ${rule.points} points
Applicable Vehicle Scope: ${rule.vehicleTypes.join(", ")}
Detailed Provision: ${rule.description}`;

          ids.push(rule.id);
          documents.push(docText);
          metadatas.push({
            country: countryCode,
            category: categoryKey,
            ruleId: rule.id,
            section: rule.section,
            type: "regulatory_fact"
          });
        });
      });
    });

    console.log(`[Chroma] Packing batch of ${ids.length} vector nodes for upload...`);

    // Bulk upload vectors to ChromaDB Cloud
    await collection.add({
      ids,
      documents,
      metadatas
    });

    const finalCount = await collection.count();
    console.log(`=========================================`);
    console.log(`✅ AUTO-SEEDING COMPLETED SUCCESSFULY!`);
    console.log(`Indexed ${finalCount} compliance dockets in vector database.`);
    console.log(`=========================================`);

  } catch (error) {
    console.error("❌ Auto-seeding execution failed:", error);
  }
}

seed();
