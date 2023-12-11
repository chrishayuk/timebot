import { BaseBot } from './BaseBot';

// timebot tells the current time
export class TimeBot extends BaseBot {
    // handles the intent
    protected handleIntent(intent: string, senderId: string): void {
        // looks for a time check
        if (intent === "time.check") {
            // calculates the current time
            const currentTime = new Date().toLocaleTimeString();

            // send the current time to the sender
            this.sendMessage(`@${senderId} The current time is: ${currentTime}`);
        } else {
            console.log("Received non-time check message.");
        }
    }
}
