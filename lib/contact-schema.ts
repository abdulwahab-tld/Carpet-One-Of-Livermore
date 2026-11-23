import { z } from "zod";

export const flooringTypes = [
  "Bioplanks Flooring",
  "Carpet Tile Flooring",
  "General Flooring Inquiry",
] as const;

export const projectTypes = ["Residential", "Commercial", "Not sure"] as const;

export const contactSchema = z.object({
  name: z
    .string({ error: "Please enter your full name." })
    .trim()
    .min(2, { error: "Please enter your full name." })
    .max(80, { error: "Please use 80 characters or fewer." }),
  email: z.email({ error: "Please enter a valid email address." }),
  phone: z
    .string({ error: "Please enter a phone number." })
    .trim()
    .min(7, { error: "Please enter a phone number." })
    .max(30, { error: "Please use 30 characters or fewer." }),
  flooringType: z.enum(flooringTypes, {
    error: "Please select a flooring type.",
  }),
  projectType: z.enum(projectTypes, {
    error: "Please select a project type.",
  }),
  message: z
    .string({ error: "Please tell us a little about your project." })
    .trim()
    .min(10, { error: "Please tell us a little about your project." })
    .max(2000, { error: "Please keep the message under 2,000 characters." }),
});

export type ContactPayload = z.infer<typeof contactSchema>;

export function fieldErrorsFrom(error: z.ZodError) {
  const errors: Partial<Record<keyof ContactPayload, string>> = {};
  for (const issue of error.issues) {
    const key = issue.path[0];
    if (typeof key === "string" && errors[key as keyof ContactPayload] === undefined) {
      errors[key as keyof ContactPayload] = issue.message;
    }
  }
  return errors;
}
