import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const risorse = defineCollection({loader:glob({pattern:'**/*.md',base:'./src/content/risorse'}),schema:z.object({title:z.string(),description:z.string(),pubDate:z.coerce.date(),updatedDate:z.coerce.date().optional(),author:z.string().default('W4U'),category:z.string(),featured:z.boolean().default(false),draft:z.boolean().default(false)})});
export const collections={risorse};
