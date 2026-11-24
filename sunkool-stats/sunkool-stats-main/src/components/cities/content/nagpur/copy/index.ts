import type { TemplateCity, TemplateCopy } from "./types";
import { nagpur } from "./nagpur";
import { amritsar } from "./amritsar";
import { chennai } from "./chennai";
import { delhi } from "./delhi";

export type { TemplateCity, TemplateCopy };

export const templateCopy: Record<TemplateCity, TemplateCopy> = { nagpur, amritsar, chennai, delhi };
