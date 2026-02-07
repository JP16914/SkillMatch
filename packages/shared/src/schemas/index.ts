import { z } from 'zod';

export const CreateJobSchema = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  url: z.string().url().optional().or(z.literal('')),
  stage: z.string(),
  deadline: z.string().datetime().optional(),
  notes: z.string().optional(),
  descriptionText: z.string().optional()
});

export type CreateJobDto = z.infer<typeof CreateJobSchema>;
