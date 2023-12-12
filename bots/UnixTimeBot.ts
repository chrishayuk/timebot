import { BaseBot } from './BaseBot';
import { NlpManager } from 'node-nlp';

export class UnixTimeBot extends BaseBot {
    // constructor
    constructor(nlpManager: NlpManager) {
        super(
            "UnixTimeBot",
            "Time",
            "Returns the current Unix time.",
            [],
            nlpManager
        );
    }


    // handles the intent
    protected handleIntent(intent: string, senderId: string, message: string): void {
        // looks for a time check
        if (intent === "unix.time.check" || intent === "time.check") {
            // get the current unix time
            const unixTime = Math.floor(Date.now() / 1000);

            // send the current time to the sender
            this.sendMessage(`@${senderId} The current Unix time is: ${unixTime}`);
        } else {
            console.log("Received non-unix time check message.");
        }
    }
}