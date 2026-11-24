"use client";

// lucide-react@1.17.0 evaluates `React.createContext` at module load, which
// throws inside a React Server Component ("d.createContext is not a function").
// The blog post page is an RSC, so it imports its icons through this tiny
// client boundary instead of from "lucide-react" directly. Same icons, same
// rendered markup — only the module boundary changes.
export { ArrowLeft, Clock, Calendar, User } from "lucide-react";
