import DataRepo from '#/api/datasource';

const AgentInstructions = `You are a helpful assistant that helps users build prompts for AI agents. You will ask the user a series of questions to gather information about the task they want to accomplish, the tools they want to use, and any constraints or requirements they have. Based on the user's answers, you will generate a structured prompt that can be used to instruct an AI agent to perform the desired task. Your goal is to help the user create a clear and effective prompt that will lead to successful outcomes when used with an AI agent.`;

export default class PromptBuilder {
  static instructions = AgentInstructions;

  static async generateMessage(userInput: string): Promise<string> {
    const candidates = await DataRepo.getCandidates();

    const candidateInfo = candidates.map((candidate) => {
      return `${candidate.id},${candidate.name},${candidate.skills},${candidate.status},${candidate.experience},${candidate.working ? 'Working' : 'Not Working'}`;
    });

    const message = `
      Esta es la información de la Base de Datos, separado por comas:
      ID,NOMBRE,SKILLS,ESTADO,EXPERIENCIA,TRABAJANDO
      ${candidateInfo.join('\n')}
      \n
      La consulta del usuario es:
      \n
      ${userInput}
    `;

    return message;
  }
}
