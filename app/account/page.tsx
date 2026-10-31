import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import Topbar from "@/components/Homescreen/topbar";
import Header from "@/components/Homescreen/header";
import Navbar from "@/components/Homescreen/Navbar";
import Footer from "@/components/Homescreen/footer";
import { AccountSubscriptionView } from "@/components/subscription/AccountSubscriptionView";

export const metadata = {
  title: "My Account & Subscription | Students Hub",
};

export default async function AccountPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/login?callbackUrl=/account");
  }

  const user = session.user;

  const subscription = await prisma.subscription.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });

  const formattedSub = subscription
    ? {
        id: subscription.id,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart
          ? subscription.currentPeriodStart.toISOString()
          : null,
        currentPeriodEnd: subscription.currentPeriodEnd
          ? subscription.currentPeriodEnd.toISOString()
          : null,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        provider: subscription.provider,
      }
    : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col font-sans">
      <Topbar />
      <Header />
      <Navbar />

      <main className="flex-grow py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white tracking-tight">
            Account &amp; Billing
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-gray-500 dark:text-zinc-400">
            Manage your profile, active subscriptions, and payment history.
          </p>
        </div>

        <AccountSubscriptionView
          user={{
            id: user.id,
            email: user.email,
            name: user.name,
          }}
          subscription={formattedSub}
        />
      </main>

      <Footer />
    </div>
  );
}
