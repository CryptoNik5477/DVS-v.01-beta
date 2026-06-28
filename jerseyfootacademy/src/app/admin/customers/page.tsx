import { ScaffoldNotice } from "@/components/admin/scaffold-notice";

export const metadata = { title: "Admin · Customers" };

export default function AdminCustomersPage() {
  return (
    <ScaffoldNotice title="Customers">
      Customer management reads from the <code>User</code> table. Once your database is connected,
      list and search customers here, view their order history and manage roles. The data model and
      auth are already in place (<code>prisma/schema.prisma</code>, <code>src/lib/auth.ts</code>).
    </ScaffoldNotice>
  );
}
