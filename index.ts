import { NlpManager } from 'node-nlp';
import { NlpModelLoader } from 'nlp-model-utility';
import { TimeBot } from './bots/TimeBot';
import { UnixTimeBot } from './bots/UnixTimeBot';
import { MorseTimeBot } from './bots/MorseTimeBot';
import { BinaryTimeBot } from './bots/BinaryTimeBot';

interface BotConfig {
    modelDirectory: string;
    dataDirectory: string;
    modelName: string;
    trainingDataFile: string;
    websocketUrl: string;
}

async function main() {
    const config: BotConfig = {
        modelDirectory: "./models",
        dataDirectory: "./data",
        modelName: "model.nlp",
        trainingDataFile: "time-queries.json",
        websocketUrl: "ws://localhost:3000"
    };

    try {
        console.log("Initializing NLP Manager...");
        const modelPath = `${config.modelDirectory}/${config.modelName}`;
        const trainingDataPath = `${config.dataDirectory}/${config.trainingDataFile}`;
        const nlpLoader = new NlpModelLoader(modelPath);
        const nlpManager = await nlpLoader.loadOrTrainModel(trainingDataPath, process.argv.includes("--retrain"));
        console.log("NLP Manager initialized successfully.");

        console.log("Starting bots...");
        const timeBot = new TimeBot(nlpManager);
        const unixTimeBot = new UnixTimeBot(nlpManager);
        const morseTimeBot = new MorseTimeBot(nlpManager);
        const binaryTimeBot = new BinaryTimeBot(nlpManager);
        console.log("Bots are running.");
    } catch (error) {
        console.error("An error occurred in the main function:", error);
    }
}

main().catch(console.error);
