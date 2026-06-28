import type { OrderStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Price } from "@/components/ui/price";
import { formatDate } from "@/lib/utils";
import { ScaffoldNotice } from "@/components/admin/scaffold-notice";
import { RoleToggle } from "./role-toggle";

export const metadata = { title: "Admin · Customers" };

const PAID: OrderStatus[] = ["PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export default async function AdminCustomersPage() {
  let users: {
    id: string;
    name: string | null;
    email: string;
    role: "CUSTOMER" | "ADMIN";
    createdAt: Date;
    _count: { orders: number };
  }[] = [];
  let spendByUser = new Map<string, number>();
  let dbAvailable = true;

  try {
    const [u, spend] = await Promise.all([
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { orders: true } } },
      }),
      prisma.order.groupBy({ by: ["userId"], where: { status: { in: PAID } }, _sum: { total: true } }),
    ]);
    users = u;
    spendByUser = new Map(spend.filter((s) => s.userId).map((s) => [s.userId as string, s._sum.total ?? 0]));
  } catch {
    dbAvailable = false;
  }

  if (!dbAvailable) {
    return (
      <ScaffoldNotice title="Customers">
        Connect a database to manage customers. This page lists registered users with their order
        count, lifetime spend and role — and lets you promote/demote admins.
      </ScaffoldNotice>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold">Customers</h1>
      <p className="text-sm text-navy/60">{users.length} registered.</p>

      <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-soft ring-1 ring-navy/5">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-xs uppercase text-navy/50">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Joined</th>
              <th className="px-4 py-3 text-center">Orders</th>
              <th className="px-4 py-3 text-right">Spent</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-navy/5">
            {users.length ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <p className="font-semibold">{u.name ?? "—"}</p>
                    <p className="text-xs text-navy/50">{u.email}</p>
                  </td>
                  <td className="px-4 py-3 text-navy/60">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3 text-center">{u._count.orders}</td>
                  <td className="px-4 py-3 text-right"><Price cents={spendByUser.get(u.id) ?? 0} /></td>
                  <td className="px-4 py-3">
                    <span className={`badge ${u.role === "ADMIN" ? "bg-gold text-navy" : "bg-navy/5 text-navy/60"}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RoleToggle id={u.id} role={u.role} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-navy/50">
                  No customers yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
