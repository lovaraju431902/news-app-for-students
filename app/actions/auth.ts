"use server";

import { createSession, deleteSession } from "@/lib/session";
import { getAdminCredentialsAction } from "./settings";

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

    const credentials = await getAdminCredentialsAction();

    if (email.toLowerCase() !== credentials.email.toLowerCase()) {
      return { success: false, error: "Access denied. Invalid admin email." };
    }

    if (password !== credentials.passwordHashOrPlain) {
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
