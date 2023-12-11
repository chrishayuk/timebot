import readline, { Interface as ReadlineInterface } from "readline";
import { WebSocket } from "ws";
import { NlpManager } from 'node-nlp';

export abstract class BaseBot {
    url: string;
    name: string;
    socket: WebSocket | null = null;
    readlineInterface: ReadlineInterface;

    // NLP Manager
    protected nlpManager: NlpManager;

    constructor(url: string, name: string, nlpManager: NlpManager) {
        this.url = url;
        this.name = name;
        this.nlpManager = nlpManager;

        this.initializeWebSocket();
        this.setupReadlineInterface();
    }

    private initializeWebSocket(): void {
        this.socket = new WebSocket(this.url);

        this.socket.addEventListener("open", this.onOpen.bind(this));
        this.socket.addEventListener("message", this.onMessage.bind(this));
        this.socket.addEventListener("close", this.onClose.bind(this));
        this.socket.addEventListener("error", this.onError.bind(this));
    }

    protected onOpen(event: Event): void {
        console.log(`${this.name} connected to the server.`);
        this.sendMessage(`register as ${this.name}`);
        this.readlineInterface.prompt();
    }

    protected async onMessage(event: MessageEvent): Promise<void> {
        const messageData = event.data.toString();
        const parsedData = this.parseMessageData(messageData);

        if (parsedData) {
            const { senderId, messageContent } = parsedData;
            const response = await this.nlpManager.process("en", messageContent);
            this.handleIntent(response.intent, senderId);
        } else {
            console.log("Could not parse the sender ID and message.");
        }
    }

    private parseMessageData(messageData: string): { senderId: string, messageContent: string } | null {
        const senderIdMatch = messageData.match(/^from: (\S+), message: (.+)/);
        if (senderIdMatch) {
            return {
                senderId: senderIdMatch[1],
                messageContent: senderIdMatch[2].toLowerCase()
            };
        }
        return null;
    }

    protected abstract handleIntent(intent: string, senderId: string, message: string): void;

    protected onClose(event: CloseEvent): void {
        console.log("Disconnected from the server.");
        this.readlineInterface.close();
    }

    protected onError(event: Event): void {
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
}
