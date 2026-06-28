"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import type { OrderStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/utils";

export interface ActionState {
  ok?: boolean;
  error?: string;
  message?: string;
}

async function requireAdmin(): Promise<boolean> {
  const session = await getServerSession(authOptions);
  return (session?.user as { role?: string } | undefined)?.role === "ADMIN";
}

const ORDER_STATUSES: OrderStatus[] = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
  "REFUNDED",
];

const schema = z.object({
  id: z.string().min(1),
  status: z.enum(ORDER_STATUSES as [OrderStatus, ...OrderStatus[]]),
  trackingNumber: z.string().max(80).optional(),
});

/** Update an order's fulfillment status and tracking number. */
export async function updateOrder(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!(await requireAdmin())) return { error: "Unauthorized." };

  const parsed = schema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return { error: "Invalid order update." };
  const { id, status, trackingNumber } = parsed.data;

  try {
    await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber: trackingNumber ? sanitizeText(trackingNumber, 80) : null,
      },
    });
    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/orders");
    return { ok: true, message: "Order updated." };
  } catch {
    return { error: "Could not update order — is the database configured?" };
  }
}

export { ORDER_STATUSES };
