"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import type { Role } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface ActionState {
  ok?: boolean;
  error?: string;
}

const schema = z.object({
  id: z.string().min(1),
  role: z.enum(["CUSTOMER", "ADMIN"]),
});

/** Promote/demote a customer. Guards against the admin removing their own access. */
export async function setUserRole(id: string, role: Role): Promise<ActionState> {
  const session = await getServerSession(authOptions);
  const me = session?.user as { id?: string; role?: string } | undefined;
  if (me?.role !== "ADMIN") return { error: "Unauthorized." };

  const parsed = schema.safeParse({ id, role });
  if (!parsed.success) return { error: "Invalid input." };

  if (me.id === id && role !== "ADMIN") {
    return { error: "You can't remove your own admin access." };
  }

  try {
    await prisma.user.update({ where: { id }, data: { role } });
    revalidatePath("/admin/customers");
    return { ok: true };
  } catch {
    return { error: "Could not update role." };
  }
}
