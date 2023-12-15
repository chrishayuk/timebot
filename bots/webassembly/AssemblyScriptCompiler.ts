import { BaseBot } from '../BaseBot';
import { NlpManager } from 'node-nlp';
import { BotConfig } from '../BotConfig';
import * as asc from 'assemblyscript/asc';

export class AssemblyScriptCompiler extends BaseBot {
    // constructor
    constructor(botConfig: BotConfig, nlpManager: NlpManager) {
        // call the base class
        super(botConfig.name, botConfig.type, botConfig.description, botConfig.settings, nlpManager, botConfig.welcomeMessage);
    }

    // handle the intent
    protected handleIntent(intent: string, senderId: string, sourceCode: string): void {
        // compile to wasm
        this.compileToWasm(sourceCode, senderId);
    }

    // compile to wasm
    private async compileToWasm(sourceCode: string, senderId: string): Promise<void> {
        try {
            const result = await asc.compileString(sourceCode, {
                // Compiler options (e.g., optimization level, etc.)
            });

            // check for success
            if (result.binary) {
                // we have a binary
                const wasm = Buffer.from(result.binary);

                // convert to base64
                const wasmBase64 = wasm.toString('base64');

                // send the wasm
                this.sendMessage(`@${senderId} Compilation successful`);
                this.sendMessage(`@${senderId} ${wasmBase64}`);
            } else {
                // no binary
                this.sendMessage(`@${senderId} Compilation completed, but no binary was produced.`);
            }
        } catch (err) {
            // error
            this.sendMessage(`@${senderId} Compilation error: ${err.message}`);
        }
    }
    

}
