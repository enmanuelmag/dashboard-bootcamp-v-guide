import DataRepo from '#/api/datasource';

/**
 * PromptBuilder
 * Responsible for building the instructions and messages sent to the AI agent.
 */
export class PromptBuilder {
  /**
   * Returns the system instructions for the candidate analyst agent.
   * Defines the agent's role, capabilities, and response format.
   */
  getAgentInstructions(): string {
    return `
You are an expert HR assistant specialized in candidate analysis and recruitment.
You have access to a list of candidates from a talent tracker system.

Each candidate has the following fields:
- name: full name
- age: age in years
- experience: years of professional experience
- status: current hiring stage (Pending, Reviewing, Interviewing, Hired)
- skills: list of technical or soft skills
- working: whether the candidate is currently employed

Your responsibilities:
- Answer questions about the candidates clearly and concisely.
- Provide recommendations when asked (e.g. who to interview next, who has the most experience).
- Summarize or filter candidates based on criteria the user provides.
- Maintain a professional, objective tone at all times.

Always base your answers strictly on the candidate data provided in the message.
If you cannot determine something from the data, say so clearly.
Respond in the same language the user uses.
    `.trim();
  }

  /**
   * Builds the final message string sent to the agent.
   * Serializes the candidate list and combines it with the user's question.
   *
   * @param candidates - List of candidates from the store or query
   * @param userPrompt - The user's question or instruction
   * @returns A formatted string ready to be passed to agent.run()
   */
  async generateMessage(userPrompt: string): Promise<string> {
    const candidates = await DataRepo.getCandidates();

    const candidateList = candidates
      .map((c, index) => {
        const workingStatus =
          c.working === true ? 'Yes' : c.working === false ? 'No' : 'Unknown';
        const skillsList = c.skills.join(', ');
        return (
          `${index + 1}. Name: ${c.name} | Age: ${c.age} | Experience: ${c.experience} years | ` +
          `Status: ${c.status} | Skills: ${skillsList} | Currently working: ${workingStatus}`
        );
      })
      .join('\n');

    console.log('Generated message for agent:\n', candidateList);

    return `
Here is the current list of candidates (${candidates.length} total):

${candidateList}

User question:
${userPrompt}
    `.trim();
  }
}
