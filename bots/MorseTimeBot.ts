import { BaseBot } from './BaseBot';

// Mapping of digits to Morse Code
const morseCodeMap: { [key: string]: string } = {
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', 
    '4': '....-', '5': '.....', '6': '-....', '7': '--...', 
    '8': '---..', '9': '----.'
};

export class MorseTimeBot extends BaseBot {

    // Converts a number to its Morse Code representation
    private numberToMorse(numStr: string): string {
        return numStr.split('').map(digit => morseCodeMap[digit] || '').join(' ');
    }

    // Handles the intent
    protected handleIntent(intent: string, senderId: string, message: string): void {
        if (intent === "morse.time.check" || intent === "time.check") {
            // Get the current time as HHMMSS
            const currentTime = new Date().toISOString().split('T')[1].replace(/:/g, '').substring(0, 6);

            // Convert the time to Morse Code
            const morseTime = this.numberToMorse(currentTime);

            // Send the Morse Code time to the sender
            this.sendMessage(`@${senderId} The current time in Morse Code is: ${morseTime}`);
        } else {
            console.log("Received non-time check message.");
        }
    }
}
