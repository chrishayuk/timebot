import { BaseBot } from './BaseBot';
import { NlpManager } from 'node-nlp';
import { BotConfig } from './BotConfig';
export class BinaryTimeBot extends BaseBot {
    // constructor
    constructor(botConfig: BotConfig, nlpManager: NlpManager) {
        // call base class
        super(botConfig.name, botConfig.type, botConfig.description, botConfig.settings, nlpManager, botConfig.welcomeMessage);
    }

    // handle the intent

    // Converts a number to its binary string representation, padded to fit the size
    private toBinaryString(num: number, size: number): string {
        return num.toString(2).padStart(size, '0');
    }

    // Converts the current time to a binary clock format
    private getCurrentTimeInBinary(): string {
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();

        // Convert each component of the time to binary, with appropriate padding
        const binaryHours = this.toBinaryString(hours, 5); // 5 bits for hours (0-23)
        const binaryMinutes = this.toBinaryString(minutes, 6); // 6 bits for minutes (0-59)
        const binarySeconds = this.toBinaryString(seconds, 6); // 6 bits for seconds (0-59)

        return `${binaryHours} : ${binaryMinutes} : ${binarySeconds}`;
    }

    // Handles the intent
    protected handleIntent(intent: string, senderId: string, message: string): void {
        // Responds to both 'binary.time.check' and 'time.check' intents
        if (intent === "binary.time.check" || intent === "time.check") {
            const binaryTime = this.getCurrentTimeInBinary();
            this.sendMessage(`@${senderId} The current time in binary is: ${binaryTime}`);
        } else {
            console.log("Received non-time check message.");
        }
    }
}
