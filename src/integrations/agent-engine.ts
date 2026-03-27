import {
  Agent,
  run,
  setDefaultOpenAIClient,
  setTracingDisabled,
} from '@openai/agents';
import { OpenAI } from 'openai';

import { PromptBuilder } from './prompt-builder';
import { env } from '#/env';

// Disable OpenAI Agents SDK tracing (not needed in browser context)
setTracingDisabled(true);

/**
 * AgentEngine
 * Es un wrapper alrededor del SDK de OpenAI Agents para manejar la lógica de interacción con el agente.
 * Se encarga de configurar el cliente, crear el agente con instrucciones específicas y ejecutar el agente con mensajes formateados.
 * Utiliza PromptBuilder para generar mensajes a partir de la lista de candidatos y el prompt del usuario, y luego ejecuta el agente con esos mensajes.
 */
export class AgentEngine {
  private agent: Agent;
  private promptBuilder: PromptBuilder;

  constructor() {
    // Configura el cliente de OpenAI con la clave API y permite su uso en el navegador
    const client = new OpenAI({
      apiKey: env.VITE_OPENAI_API_KEY,
      organization: env.VITE_OPENAI_ORGANIZATION,
      project: env.VITE_OPENAI_PROJECT_ID,
      //! IMPORTANTE: Esto es necesario para permitir que el SDK de OpenAI Agents funcione en el navegador
      //! pero ten cuidado con la seguridad de tu clave API
      dangerouslyAllowBrowser: true,
    });

    // Set as the default client for the Agents SDK
    setDefaultOpenAIClient(client);

    this.promptBuilder = new PromptBuilder();

    // Create the agent with instructions from PromptBuilder
    this.agent = new Agent({
      name: 'Candidate Analyst',
      model: env.VITE_OPENAI_MODEL_ID || 'gpt-5-mini',
      instructions: this.promptBuilder.getAgentInstructions(),
    });
  }

  /**
   * Runs the agent with the given user prompt.
   * PromptBuilder formats the message before passing it to the SDK.
   *
   * @param userPrompt - The user's question or instruction
   * @returns The agent's final text response
   */
  async run(userPrompt: string): Promise<string> {
    const message = await this.promptBuilder.generateMessage(userPrompt);

    const result = await run(this.agent, message, {
      maxTurns: 3,
      stream: false,
    });

    return result.finalOutput as string;
  }
}
