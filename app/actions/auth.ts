"use server";

import { createSession, deleteSession } from "@/lib/session";

export interface LoginActionState {
  success?: boolean;
  error?: string;
}

export async function loginAction(
  prevState: LoginActionState | null,
  formData: FormData
): Promise<LoginActionState> {
  try {
    const email = formData.get("email")?.toString().trim();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      return { success: false, error: "Please enter both email and password." };
    }

    const allowedEmails = ["lovarajuk431902@gmail.com", "satoshi.nakamoto807@gmail.com"];
    if (!allowedEmails.includes(email.toLowerCase())) {
      return { success: false, error: "Access denied. Unauthorized email." };
    }

    const adminPassword = process.env.ADMIN_PASSWORD;
    if (!adminPassword) {
      return { success: false, error: "Server configuration error. Admin password is not set." };
    }

    if (password !== adminPassword) {
      return { success: false, error: "Incorrect password. Please try again." };
    }

    await createSession(email.toLowerCase());
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "An unexpected error occurred during login." };
  }
}

export async function logoutAction() {
  await deleteSession();
}
