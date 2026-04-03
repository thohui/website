import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from "astro:content";

const blog = defineCollection({
	loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: "./src/content/blog" }),
	schema: z.object({
		title: z.string(),
		date: z.date(),
		description: z.string().optional(),
	}),
});

export const collections = { blog };