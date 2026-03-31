import { env } from '#/env';
import { OpenAI } from 'openai';

import { Agent, run, setDefaultOpenAIClient } from '@openai/agents';
import PromptBuilder from './prompt-builder';

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
      modelSettings: {
        temperature: 0.25,
        maxTokens: 500,
      },
    });
  }

  async run(userInput: string) {
    const message = await PromptBuilder.generateMessage(userInput);

    const response = await run(this.agent, message, {
      stream: false,
      maxTurns: 4,
    });

    console.log('Usage: ', {
      inputTokens: response.state.usage.inputTokens,
      outputTokens: response.state.usage.outputTokens,
      totalTokens: response.state.usage.totalTokens,
    });

    return response.finalOutput || 'No hubo respuesta';
  }
}

const instancia = new AgentEngine();

export default instancia;
