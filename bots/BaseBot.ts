import readline, { Interface as ReadlineInterface } from "readline";
import { WebSocket } from "ws";
import { NlpManager } from 'node-nlp';
import * as dotenv from 'dotenv';

// config
dotenv.config();

export abstract class BaseBot {
    // protected members
    protected name: string;
    protected classification: string;
    protected description: string;
    protected welcomeMessage: string;
    //protected requiredParameters: Record<string, any>[];
    protected settings: Record<string, any> = {}

    socket: WebSocket | null = null;
    readlineInterface: ReadlineInterface;

    // NLP Manager
    protected nlpManager: NlpManager;

    // abstract methods
    protected abstract handleIntent(intent: string, senderId: string, message: string): void;

    constructor(
        name: string,
        classification: string,
        description: string,
        settings: Record<string, any>,
        nlpManager: NlpManager,
        welcomeMessage: string // Optional, if needed
    ) {
        // set the members
        this.name = name;
        this.classification = classification;
        this.description = description;
        //this.requiredParameters = requiredParameters;
        this.settings = settings;
        this.nlpManager = nlpManager;
        this.welcomeMessage = welcomeMessage;

        // setup the websocker
        this.initializeWebSocket();

        // setup the commanline prompt
        this.setupReadlineInterface();
    }

    // setup the websocket to the server
    private initializeWebSocket(): void {
        // read the websocket url to connect to, or default to localhost 3000
        this.socket = new WebSocket(process.env.WEBSOCKET_URL || 'ws://localhost:3000');

        // add the event listeners
        this.socket.addEventListener("open", this.onOpen.bind(this));
        this.socket.addEventListener("message", this.onMessage.bind(this));
        this.socket.addEventListener("close", this.onClose.bind(this));
        this.socket.addEventListener("error", this.onError.bind(this));
    }

    // on open
    protected onOpen(event: Event): void {
        // connected to the server
        console.log(`${this.name} connected to the server.`);

        // send the registration message
        this.sendMessage(`register as ${this.name}`);

        // wait for a prompt
        this.readlineInterface.prompt();
    }

    protected async onMessage(event: MessageEvent): Promise<void> {
        const messageData = event.data.toString();
        const parsedData = this.parseMessageData(messageData);

        if (parsedData) {
            const { senderId, messageContent } = parsedData;
            const response = await this.nlpManager.process("en", messageContent);

            // call the handle intent of the sub class
            this.handleIntent(response.intent, senderId, messageContent);
        } else {
            console.log("Could not parse the sender ID and message.");
        }
    }

    // private parseMessageData(messageData: string): { senderId: string, messageContent: string } | null {
    //     const senderIdMatch = messageData.match(/^from: (\S+), message: (.+)/);
    //     if (senderIdMatch) {
    //         return {
    //             senderId: senderIdMatch[1],
    //             messageContent: senderIdMatch[2].toLowerCase()
    //         };
    //     }
    //     return null;
    // }

    private parseMessageData(messageData: string): { senderId: string, messageContent: string } | null {
        const senderIdMatch = messageData.match(/^from: (\S+), message: ([\s\S]+)/);
        if (senderIdMatch) {
            return {
                senderId: senderIdMatch[1],
                messageContent: senderIdMatch[2]
            };
        }
        return null;
    }
    

    // on close
    protected onClose(event: CloseEvent): void {
        // log a disconnected message
        console.log("Disconnected from the server.");

        // close the prompt window
        this.readlineInterface.close();
    }

    // on error
    protected onError(event: Event): void {
        // log the error
        console.error("An error occurred with the WebSocket.");
    }

    private setupReadlineInterface(): void {
        this.readlineInterface = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        this.readlineInterface.on("line", (line) => {
            if (line.trim().toLowerCase() === "bye") {
                this.socket?.close();
            } else {
                this.sendMessage(line);
            }
            this.readlineInterface.prompt();
        }).on("close", () => {
            console.log("Have a great day!");
            process.exit(0);
        });
    }

    protected sendMessage(message: string): void {
        this.socket?.send(message);
    }

    // Method to get JSON representation of the bot
    public toJSON(): string {
        return JSON.stringify({
            name: this.name,
            type: this.classification,
            description: this.description,
            requiredParameters: this.requiredParameters
        });
    }
}
