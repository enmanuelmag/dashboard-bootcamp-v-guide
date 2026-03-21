import { z } from 'zod';

export const CandidateSchema = z.object({
  id: z.string(),
  name: z.string().min(5, 'Escribir el nombre').max(20, 'Maximo 20 caracteres'),
  age: z.number().min(18, 'Solo mayores de edad').max(100, 'No mas de 100'),
  experience: z.number().min(1),
  status: z.enum(['Pending', 'Reviewing', 'Interviewing', 'Hired']),
  skills: z.array(z.string().min(1)).min(1, 'Minima una skill'),
  working: z.boolean().nullish(),
});

export type CandidateType = z.infer<typeof CandidateSchema>;

export const FormCandidateSchema = CandidateSchema.omit({
  id: true,
});

export type FormCandidateType = z.infer<typeof FormCandidateSchema>;

export const UpdateCandidateSchema = CandidateSchema;

export type UpdateCandidateType = z.infer<typeof UpdateCandidateSchema>;
