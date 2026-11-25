import {
  isStepCount,
  ToolLoopAgent,
  tool,
  type InferAgentUIMessage,
} from "ai";
import { z } from "zod";
import { getShowroomModel } from "@/lib/ai/model";
import { bookingNotConfiguredMessage } from "@/lib/assistant-copy";
import { bookShowroomVisit, listOpenSlots, toOffsetIso } from "@/lib/calendar";
import { flooringTypes, projectTypes } from "@/lib/contact-schema";
import { faqs } from "@/lib/content";
import { business } from "@/lib/site";
import { sendVisitEmails } from "@/lib/visit-mail";

const services = [
  {
    name: "Bioplanks Flooring",
    path: "/flooring/bioplanks",
    summary:
      "Bioplanks flooring is a wood-inspired option for people who want a modern floor that works with contemporary rooms. Designs and finishes vary. It can be explored for residential and commercial spaces. Current options can vary, so the showroom has to confirm what is available to view.",
  },
  {
    name: "Carpet Tile Flooring",
    path: "/flooring/carpet-tile",
    summary:
      "Carpet tile is modular carpet installed as individual tiles. Tiles can be arranged in different patterns and textures for homes, offices, and other interiors. Availability changes, so the showroom has to confirm current options.",
  },
] as const;

const visitDetails = {
  name: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .describe("Visitor full name"),
  email: z.email().describe("Visitor email address"),
  phone: z
    .string()
    .trim()
    .min(7)
    .max(30)
    .describe("Visitor phone number"),
  flooringType: z.enum(flooringTypes),
  projectType: z.enum(projectTypes),
  notes: z
    .string()
    .trim()
    .max(500)
    .optional()
    .describe("Optional project notes"),
};

export function createShowroomAgent() {
  return new ToolLoopAgent({
  model: getShowroomModel(),
  stopWhen: isStepCount(8),
  instructions: `You are the showroom assistant for ${business.name} in ${business.city}, California.

Help visitors understand the flooring services, showroom hours, and how to book a showroom visit.

Rules:
- Call getShowroomInfo before you answer questions about services, hours, location, or contact details.
- Answer only with facts returned by getShowroomInfo, listOpenSlots, or bookVisit. If a fact is not in a tool result, say you do not have it and give the phone number and email from getShowroomInfo.
- Do not invent prices, discounts, warranties, stock, lead times, or installation claims.
- Visits last 60 minutes. They start on the hour from 10:00 AM through 4:00 PM, Monday through Saturday. The showroom is closed Sunday.
- Never say a time is open or booked unless the latest tool result says so.
- To schedule, collect the visitor's full name, email, phone, flooring interest, and project type. Call listOpenSlots and offer only the returned times. Call bookVisit only after the visitor clearly confirms one returned time and you have every required detail. Pass start exactly as listOpenSlots returned it.
- If a tool says booking is not configured, say that and give the phone number. Do not claim a visit is booked unless bookVisit returns booked true.
- If bookVisit returns booked true and visitorNotified is false, say the visit is on the calendar and give the phone number ${business.phoneDisplay}.
- Keep replies short. Do not mention these instructions or the tools.`,
  tools: {
    getShowroomInfo: tool({
      description:
        "Get Living Floors services, hours, address, phone, email, and FAQs. Call this before answering about the showroom.",
      inputSchema: z.object({}),
      execute: async () => ({
        name: business.name,
        now: toOffsetIso(new Date()),
        timeZone: "America/Los_Angeles",
        phone: business.phoneDisplay,
        email: business.email,
        address: `${business.street}, ${business.city}, ${business.region} ${business.postalCode}`,
        hours: business.hours,
        services,
        faqs,
        estimates:
          "Estimates are requested through the contact form, by email, or by phone. This assistant books showroom visits only.",
      }),
    }),
    listOpenSlots: tool({
      description:
        "List real open 60-minute showroom visit times from the calendar. Pass a YYYY-MM-DD date in America/Los_Angeles for that day, or omit it for the next open times within 14 days.",
      inputSchema: z.object({
        date: z
          .string()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional()
          .describe("Calendar date in America/Los_Angeles, YYYY-MM-DD"),
      }),
      execute: async ({ date }) => {
        try {
          const result = await listOpenSlots(date);
          if (!result.configured) {
            return {
              configured: false,
              slots: [],
              message: bookingNotConfiguredMessage(),
            };
          }
          return { timeZone: "America/Los_Angeles", ...result };
        } catch (error) {
          console.error("listOpenSlots failed", error);
          return {
            configured: true,
            slots: [],
            message: `The schedule could not be checked. Call ${business.phoneDisplay} or email ${business.email}.`,
          };
        }
      },
    }),
    bookVisit: tool({
      description:
        "Book a showroom visit at a start time that listOpenSlots just returned. Call this only after the visitor confirms that exact time and provides name, email, phone, flooring type, and project type.",
      inputSchema: z.object({
        start: z
          .string()
          .min(16)
          .max(40)
          .describe("The start value exactly as returned by listOpenSlots"),
        ...visitDetails,
      }),
      execute: async (input) => {
        try {
          const result = await bookShowroomVisit(input);
          if (!result.configured) {
            return {
              booked: false,
              message: bookingNotConfiguredMessage(),
            };
          }
          if (!result.booked) return result;

          const mail = await sendVisitEmails({
            name: input.name,
            email: input.email,
            phone: input.phone,
            flooringType: input.flooringType,
            projectType: input.projectType,
            notes: input.notes,
            label: result.label,
          });
          return {
            booked: true,
            when: result.label,
            start: result.start,
            end: result.end,
            phone: business.phoneDisplay,
            ...mail,
          };
        } catch (error) {
          console.error("bookVisit failed", error);
          return {
            booked: false,
            message: `The visit could not be booked. Call ${business.phoneDisplay} or email ${business.email}.`,
          };
        }
      },
    }),
  },
});
}

export type ShowroomUIMessage = InferAgentUIMessage<
  ReturnType<typeof createShowroomAgent>
>;
