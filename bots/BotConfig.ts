// BotConfig.ts

export interface SampleInteraction {
    question: string;
    response: string;
}

export class BotConfig {
    name: string;
    type: string;
    description: string;
    welcomeMessage: string;
    sampleInteractions: SampleInteraction[];
    settings: Record<string, any>[];

    // constructor
    constructor(name: string, type: string, description: string, welcomeMessage: string, sampleInteractions: SampleInteraction[], settings: Record<string, any>[]) {
        this.name = name;
        this.type = type;
        this.description = description;
        this.welcomeMessage = welcomeMessage;
        this.sampleInteractions = sampleInteractions;
        this.settings = settings;
    }
}
