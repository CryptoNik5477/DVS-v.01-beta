"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { z } from "zod";
import type { OrderStatus } from "@prisma/client";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sanitizeText } from "@/lib/utils";
import { sendEmail, emailLayout } from "@/lib/email";
import { siteConfig } from "@/config/site";

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
    const before = await prisma.order.findUnique({ where: { id }, select: { status: true } });
    const order = await prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber: trackingNumber ? sanitizeText(trackingNumber, 80) : null,
      },
    });

    // Send a shipment email when the order transitions into SHIPPED.
    if (status === "SHIPPED" && before?.status !== "SHIPPED" && order.email?.includes("@")) {
      const tracking = order.trackingNumber;
      await sendEmail({
        to: order.email,
        replyTo: siteConfig.contact.email,
        subject: `Your order ${order.number} has shipped! 📦`,
        html: emailLayout(
          "Your order is on its way! 📦",
          `<p style="font-size:15px;line-height:1.6;color:#3b4252">
             Good news — order <strong>${order.number}</strong> has shipped from ${siteConfig.shipsFrom}.
           </p>
           ${tracking ? `<p style="font-size:15px;color:#0b132b"><strong>Tracking number:</strong> ${tracking}</p>` : ""}
           <p style="margin:24px 0">
             <a href="${siteConfig.url}/account/orders/${order.id}" style="background:#c8102e;color:#fff;text-decoration:none;padding:12px 22px;border-radius:999px;font-weight:700;font-size:14px">
               Track your order
             </a>
           </p>
           <p style="font-size:13px;color:#8a93a6">Thank you for shopping with ${siteConfig.name}!</p>`,
        ),
      });
    }

    revalidatePath(`/admin/orders/${id}`);
    revalidatePath("/admin/orders");
    return { ok: true, message: "Order updated." };
  } catch {
    return { error: "Could not update order — is the database configured?" };
  }
}

export { ORDER_STATUSES };
