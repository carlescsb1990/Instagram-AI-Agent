import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from "../config/logger";
import { geminiApiKeys } from "../secret";
import { handleError } from "../utils";
import { InstagramCommentSchema } from "./schema";
import fs from "fs";
import path from "path";
import * as readlineSync from "readline-sync";

export async function runAgent(
  schema: InstagramCommentSchema,
  prompt: string,
): Promise<any> {
  let currentApiKeyIndex = 0;
  let geminiApiKey = geminiApiKeys[currentApiKeyIndex];

  if (!geminiApiKey) {
    logger.error("No Gemini API key available.");
    return "No API key available.";
  }
  const generationConfig = {
    responseMimeType: "application/json",
    responseSchema: schema,
  };

  const googleAI = new GoogleGenerativeAI(geminiApiKey);
  const model = googleAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig,
  });

  try {
    const result = await model.generateContent(prompt);

    if (!result || !result.response) {
      logger.info(
        "No response received from the AI model. || Service Unavailable",
      );
      return "Service unavailable!";
    }

    const responseText = result.response.text();
    const data = JSON.parse(responseText);

    return data;
  } catch (error) {
    await handleError(error, currentApiKeyIndex, schema, prompt, runAgent);
  }
}

export function chooseCharacter(): any {
  const charactersDir = (() => {
    const buildPath = path.join(__dirname, "characters");
    if (fs.existsSync(buildPath)) {
      return buildPath;
    } else {
      // Fallback to source directory
      return path.join(process.cwd(), "src", "Agent", "characters");
    }
  })();
  const files = fs.readdirSync(charactersDir);
  const jsonFiles = files.filter((file) => file.endsWith(".json"));
  if (jsonFiles.length === 0) {
    throw new Error("No character JSON files found");
  }

  let selectedFile: string;

  // Check if CHARACTER environment variable is set
  const envCharacter = process.env.CHARACTER;
  if (envCharacter) {
    const matchingFile = jsonFiles.find(
      (file) =>
        file.toLowerCase().includes(envCharacter.toLowerCase()) ||
        file === envCharacter,
    );
    if (matchingFile) {
      selectedFile = matchingFile;
      logger.info(`Using character from environment: ${selectedFile}`);
    } else {
      logger.warn(`Character "${envCharacter}" not found, using default`);
      selectedFile = jsonFiles[0];
    }
  } else if (process.stdin.isTTY) {
    // Interactive mode - only if TTY is available
    console.log("Select a character:");
    jsonFiles.forEach((file, index) => {
      console.log(`${index + 1}: ${file}`);
    });
    const answer = readlineSync.question("Enter the number of your choice: ");
    const selection = parseInt(answer);
    if (isNaN(selection) || selection < 1 || selection > jsonFiles.length) {
      throw new Error("Invalid selection");
    }
    selectedFile = jsonFiles[selection - 1];
  } else {
    // Non-interactive mode - use first character as default
    selectedFile = jsonFiles[0];
    logger.info(
      `Running in non-interactive mode, using default character: ${selectedFile}`,
    );
  }

  const chosenFile = path.join(charactersDir, selectedFile);
  const data = fs.readFileSync(chosenFile, "utf8");
  const characterConfig = JSON.parse(data);
  return characterConfig;
}

export function initAgent(): any {
  try {
    const character = chooseCharacter();
    console.log("Character selected:", character);
    return character;
  } catch (error) {
    console.error("Error selecting character:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  (() => {
    initAgent();
  })();
}
