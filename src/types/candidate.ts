import { z } from 'zod';

export const CandidateSchema = z.object({
  id: z.string(),
  name: z.string().min(0, 'Escribir el nombre'),
  age: z.number().min(0, 'Edad minima mayor que cero'),
  experience: z.number().min(0),
  status: z.enum(['Pending', 'Reviewing', 'Interviewing', 'Hired']),
  skills: z.array(z.string().min(2).max(25)),
  working: z.boolean().nullish(),
});

export type CandidateType = z.infer<typeof CandidateSchema>;

export const FormCandidateSchema = CandidateSchema.omit({
  id: true,
});

export type FormCandidateType = z.infer<typeof FormCandidateSchema>;
