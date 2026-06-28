"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface ActionState {
  ok?: boolean;
  error?: string;
}

async function requireAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
}

export async function approveReview(id: string): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized." };
  try {
    await prisma.review.update({ where: { id }, data: { approved: true } });
    revalidatePath("/admin/reviews");
    return { ok: true };
  } catch {
    return { error: "Could not approve review." };
  }
}

export async function deleteReview(id: string): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized." };
  try {
    await prisma.review.delete({ where: { id } });
    revalidatePath("/admin/reviews");
    return { ok: true };
  } catch {
    return { error: "Could not delete review." };
  }
}
