import { NlpManager } from "node-nlp";
import { NlpModelLoader } from "nlp-model-utility";
import { BotConfig } from "./bots/BotConfig";
import { TimeBot } from "./bots/TimeBot";
import { UnixTimeBot } from "./bots/UnixTimeBot";
import { MorseTimeBot } from "./bots/MorseTimeBot";
import { BinaryTimeBot } from "./bots/BinaryTimeBot";
import { readFileSync } from "fs";

const botClassMap = {
    "Time": TimeBot,
    "UnixTime": UnixTimeBot,
    "MorseTime": MorseTimeBot,
    "BinaryTime": BinaryTimeBot
    // Add other bot types here
};

async function startBot(botConfig: BotConfig, nlpManager: NlpManager) {
    const BotClass = botClassMap[botConfig.type];
    if (BotClass) {
        const bot = new BotClass(botConfig, nlpManager);
        console.log(`Started ${botConfig.name}: ${botConfig.welcomeMessage}`);

    } else {
        // bot type not found
        console.warn(`No bot class found for type: ${botConfig.type}`);
    }
}

async function main() {
    const config: BotConfig = {
        modelDirectory: "./models",
        dataDirectory: "./data",
        modelName: "model.nlp",
        trainingDataFile: "time-queries.json",
        websocketUrl: "ws://localhost:3000",
    };

    // Load Bot configurations
    const botsFileContent = JSON.parse(readFileSync("botsConfig.json", "utf8"));
    const botsConfig = botsFileContent.bots;
    
    console.log("Initializing NLP Manager...");
    const modelPath = `${config.modelDirectory}/${config.modelName}`;
    const trainingDataPath = `${config.dataDirectory}/${config.trainingDataFile}`;
    const nlpLoader = new NlpModelLoader(modelPath);
    const nlpManager = await nlpLoader.loadOrTrainModel(trainingDataPath, process.argv.includes("--retrain"));
    console.log("NLP Manager initialized successfully.");

    // start the bots
    console.log("Starting bots...");

    // loop through all the bot config
    for (const botConfig of botsConfig) {
        // start the bot
        await startBot(botConfig, nlpManager);
    }

    // bots are running
    console.log("Bots are running.");
}

main().catch(console.error);
