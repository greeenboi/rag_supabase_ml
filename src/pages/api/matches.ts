import { SupabaseClient } from "@supabase/supabase-js";
// import { OpenAIEmbeddings } from "@langchain/openai";
import { OllamaEmbeddings } from "@langchain/community/embeddings/ollama";

import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";

export type Metadata = {
  url: string;
  text: string;
  chunk: string;
};

const getMatchesFromEmbeddings = async (
  inquiry: string,
  client: SupabaseClient,
  topK: number
) => {
  const embeddings = new OllamaEmbeddings({
    model: "llama2", // default value
    baseUrl: "http://localhost:11434", // default value
  });

  const store = new SupabaseVectorStore(embeddings, {
    client,
    tableName: "documents",
  });
  try {
    const queryResult = await store.similaritySearch(inquiry, topK);
    return (
      queryResult.map((match) => ({
        ...match,
        metadata: match.metadata as Metadata,
      })) || []
    );
  } catch (e) {
    console.log("Error querying embeddings: ", e);
    throw new Error(`Error querying embeddings: ${e}`);
  }
};

export { getMatchesFromEmbeddings };
