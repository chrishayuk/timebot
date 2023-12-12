import { BaseBot } from './BaseBot';
import { NlpManager } from 'node-nlp';

export class TimeBot extends BaseBot {
    constructor(settings: Record<string, any>, nlpManager: NlpManager) {
        super(
            "TimeBot",
            "Time",
            "Tells the current local time in a human-readable format.",
            [],
            nlpManager,
            settings
        );
    }

    protected handleIntent(intent: string, senderId: string, message: string): void {
        // ensures the intent is time.check
        if (intent === "time.check") {
            // Use settings for time zone, default to UTC if not specified
            const timezone = this.settings.timezone || 'UTC';
            const currentTime = new Date().toLocaleTimeString('en-US', { timeZone: timezone });

            // Send the current time to the sender
            this.sendMessage(`@${senderId} The current time in ${timezone} is: ${currentTime}`);
        } else {
            console.log("Received non-time check message.");
        }
    }
}
