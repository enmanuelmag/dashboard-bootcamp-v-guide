import { createEnv } from '@t3-oss/env-core';

import { z } from 'zod';

export const env = createEnv({
  clientPrefix: 'VITE_',

  client: {
    VITE_FB_API_KEY: z.string().min(1),
    VITE_FB_AUTH_DOMAIN: z.string().min(1),
    VITE_FB_PROJECT_ID: z.string().min(1),
    VITE_FB_STORE_BUCKET: z.string().min(1),
    VITE_FB_MESSAGING_SENDER_ID: z.string().min(1),
    VITE_FB_APP_ID: z.string().min(1),
    VITE_FRAMEWORK_NAME: z.enum(['react', 'vue', 'svelte', 'angular']),

    VITE_LLM_BASE_URL: z.string().min(1).optional(),
    VITE_MODEL_KEY: z.string().min(1).optional(),

    VITE_OPENAI_MODEL_ID: z.string().min(1),
    VITE_OPENAI_ORGANIZATION: z.string().min(1),
    VITE_OPENAI_PROJECT_ID: z.string().min(1),
    VITE_OPENAI_API_KEY: z.string().min(1),
  },
  runtimeEnv: import.meta.env,
});
