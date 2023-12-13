import { BaseBot } from './BaseBot';
import { NlpManager } from 'node-nlp';
import { BotConfig } from './BotConfig';

export class TimeBot extends BaseBot {
    // constructor
    constructor(botConfig: BotConfig, nlpManager: NlpManager) {
        // call base class
        super(botConfig.name, botConfig.type, botConfig.description, botConfig.settings, nlpManager, botConfig.welcomeMessage);
    }

    protected handleIntent(intent: string, senderId: string, message: string): void {
        if (intent === "time.check") {
            // Ensure the timezone is correctly retrieved from settings
            const timezone = this.settings.timezone || 'UTC';
            const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: timezone });

            this.sendMessage(`@${senderId} The current time in ${timezone} is: ${currentTime}`);
        } else {
            console.log("Received non-time check message.");
        }
    }
}

