import { env } from '#/env';
import { OpenAI } from 'openai';

import { Agent, run, setDefaultOpenAIClient } from '@openai/agents';
import PromptBuilder from './prompt-builder';
import { SaveCandidate } from './tools';

class AgentEngine {
  agent: Agent;

  constructor() {
    const client = new OpenAI({
      apiKey: env.VITE_OPENAI_API_KEY,
      organization: env.VITE_OPENAI_ORGANIZATION,
      project: env.VITE_OPENAI_PROJECT_ID,
      dangerouslyAllowBrowser: true,
    });

    setDefaultOpenAIClient(client);

    this.agent = new Agent({
      name: 'Candidate Analyst',
      model: env.VITE_OPENAI_MODEL_ID || 'gpt-5',
      instructions: PromptBuilder.instructions,
      tools: [SaveCandidate],
      modelSettings: {
        temperature: 0.1,
        maxTokens: 500,
      },
    });
  }

  async run(userInput: string) {
    const message = await PromptBuilder.generateMessage(userInput);

    const response = await run(this.agent, message, {
      stream: false,
      maxTurns: 7,
    });

    console.log('Usage: ', {
      inputTokens: response.state.usage.inputTokens,
      outputTokens: response.state.usage.outputTokens,
      totalTokens: response.state.usage.totalTokens,
    });

    return response.finalOutput || 'No hubo respuesta';
  }

  async runStream(userInput: string, onChunk: (partialOutput: string) => void) {
    const message = await PromptBuilder.generateMessage(userInput);

    const stream = await run(this.agent, message, {
      stream: true,
      maxTurns: 7,
    });

    let finalOutput = '';

    for await (const event of stream) {
      if (
        event.type === 'raw_model_stream_event' &&
        event.data.type === 'output_text_delta'
      ) {
        const chunk = event.data.delta;
        onChunk(chunk);
        finalOutput += chunk;
      }
    }

    return finalOutput;
  }
}

const instancia = new AgentEngine();

export default instancia;
