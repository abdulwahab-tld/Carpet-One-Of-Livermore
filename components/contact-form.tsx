"use client";

import { useState, type FormEvent, type ReactNode } from "react";
import { MotionButton } from "@/components/button-link";
import {
  contactSchema,
  fieldErrorsFrom,
  flooringTypes,
  projectTypes,
  type ContactPayload,
} from "@/lib/contact-schema";

type Errors = Partial<Record<keyof ContactPayload, string>>;

const initialValues = {
  name: "",
  email: "",
  phone: "",
  flooringType: "",
  projectType: "",
  message: "",
};

const fieldClass =
  "w-full border border-ink/15 bg-cream px-4 py-3 text-sm outline-none transition focus:border-walnut";

export function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  function update(field: keyof typeof initialValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    const parsed = contactSchema.safeParse(values);
    if (!parsed.success) {
      setErrors(fieldErrorsFrom(parsed.error));
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });
      const result = (await response.json()) as {
        ok?: boolean;
        error?: string;
        errors?: Errors;
      };
      if (!response.ok || !result.ok) {
        if (result.errors) setErrors(result.errors);
        setFormError(
          result.error ??
            "We could not send your request. Please call (925) 238-3127 or email sales@carpetonel.com.",
        );
        return;
      }
      setSent(true);
      setValues(initialValues);
    } catch {
      setFormError(
        "We could not send your request. Please call (925) 238-3127 or email sales@carpetonel.com.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (sent) {
    return (
      <div role="status" className="border border-walnut/30 bg-cream p-8">
        <h3 className="font-display text-4xl">Request sent</h3>
        <p className="mt-4 text-sm leading-6 text-ink/75">
          Thank you. Your estimate request was sent to sales@carpetonel.com.
        </p>
        <MotionButton
          type="button"
          className="mt-6 min-h-11 bg-ink px-5 text-sm text-plaster transition-colors duration-300 hover:bg-walnut"
          onClick={() => setSent(false)}
        >
          Send another request
        </MotionButton>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      <Field label="Full Name" name="name" error={errors.name}>
        <input
          id="name"
          name="name"
          autoComplete="name"
          value={values.name}
          onChange={(event) => update("name", event.target.value)}
          className={fieldClass}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={errors.name ? "name-error" : undefined}
          required
        />
      </Field>
      <Field label="Email Address" name="email" error={errors.email}>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          onChange={(event) => update("email", event.target.value)}
          className={fieldClass}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={errors.email ? "email-error" : undefined}
          required
        />
      </Field>
      <Field label="Phone Number" name="phone" error={errors.phone}>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          value={values.phone}
          onChange={(event) => update("phone", event.target.value)}
          className={fieldClass}
          aria-invalid={errors.phone ? true : undefined}
          aria-describedby={errors.phone ? "phone-error" : undefined}
          required
        />
      </Field>
      <Field label="Select Flooring Type" name="flooringType" error={errors.flooringType}>
        <select
          id="flooringType"
          name="flooringType"
          value={values.flooringType}
          onChange={(event) => update("flooringType", event.target.value)}
          className={fieldClass}
          aria-invalid={errors.flooringType ? true : undefined}
          aria-describedby={errors.flooringType ? "flooringType-error" : undefined}
          required
        >
          <option value="">Select flooring type</option>
          {flooringTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Project Type" name="projectType" error={errors.projectType}>
        <select
          id="projectType"
          name="projectType"
          value={values.projectType}
          onChange={(event) => update("projectType", event.target.value)}
          className={fieldClass}
          aria-invalid={errors.projectType ? true : undefined}
          aria-describedby={errors.projectType ? "projectType-error" : undefined}
          required
        >
          <option value="">Select project type</option>
          {projectTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Message" name="message" error={errors.message}>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={values.message}
          onChange={(event) => update("message", event.target.value)}
          className={fieldClass}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={errors.message ? "message-error" : undefined}
          required
        />
      </Field>
      {formError ? (
        <p role="alert" className="text-sm text-red-800">
          {formError}
        </p>
      ) : null}
      <MotionButton
        type="submit"
        disabled={submitting}
        className="inline-flex min-h-12 items-center bg-ink px-6 text-sm tracking-wide text-plaster transition-colors duration-300 hover:bg-walnut disabled:opacity-60"
      >
        {submitting ? "Sending..." : "Request a Free Estimate"}
      </MotionButton>
    </form>
  );
}

function Field({
  label,
  name,
  error,
  children,
}: {
  label: string;
  name: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={name} className="mb-2 block text-xs tracking-[0.16em] text-stone uppercase">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${name}-error`} role="alert" className="mt-2 text-sm text-red-800">
          {error}
        </p>
      ) : null}
    </div>
  );
}
