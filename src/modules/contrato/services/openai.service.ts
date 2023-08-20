import { Injectable } from "@nestjs/common";
import OpenAI from 'openai';
import { IResumeText } from "../models/openai-resume.model";

@Injectable()
export class OpenAIService {
    private client = new OpenAI({
        apiKey: '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'
    });

    async getResumeFromText(text: string): Promise<IResumeText> {

        const completion = await this.client.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{
                role: 'system',
                content: 'Faça o resumo do seguinte texto e me traga 5 palavras chaves(SEM ESPAÇO), retornando no formato JSON: {palavras_chaves: string, resumo: string}: ' + text
            },
            ],
            temperature: 1,
            max_tokens: 256,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        })

        const object = completion.choices[0].message.content;

        //@ts-ignore
        return JSON.parse(object) as IResumeText;
    }
}

