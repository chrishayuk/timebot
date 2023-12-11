import { BaseBot } from './BaseBot';


export class UnixTimeBot extends BaseBot {

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