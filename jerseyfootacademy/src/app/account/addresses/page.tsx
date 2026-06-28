import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { countryNames } from "@/config/countries";
import { AddressForm } from "./address-form";
import { DeleteAddressButton } from "./delete-address-button";

export const metadata = { title: "My Addresses" };

export default async function AddressesPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return (
      <div className="container-page py-20 text-center">
        <p className="text-navy/60">Please sign in to manage your addresses.</p>
        <Link href="/account/login" className="btn-primary mt-5">Sign in</Link>
      </div>
    );
  }

  const userId = (session.user as { id?: string }).id;
  let addresses: Awaited<ReturnType<typeof prisma.address.findMany>> = [];
  try {
    addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });
  } catch {
    // DB unavailable
  }

  return (
    <div className="container-page py-8">
      <Breadcrumbs
        items={[
          { href: "/", label: "Home" },
          { href: "/account", label: "Account" },
          { href: "/account/addresses", label: "Addresses" },
        ]}
      />
      <h1 className="mt-3 font-display text-3xl font-extrabold">My Addresses</h1>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="space-y-4">
          {addresses.length ? (
            addresses.map((a) => (
              <div key={a.id} className="rounded-xl bg-white p-5 shadow-soft ring-1 ring-navy/5">
                <div className="flex items-start justify-between">
                  <div className="text-sm">
                    <p className="font-semibold">
                      {a.fullName}
                      {a.isDefault && (
                        <span className="badge ml-2 bg-gold text-navy">Default</span>
                      )}
                    </p>
                    <p className="text-navy/60">{a.line1}</p>
                    {a.line2 && <p className="text-navy/60">{a.line2}</p>}
                    <p className="text-navy/60">
                      {a.city}{a.state ? `, ${a.state}` : ""} {a.postalCode}
                    </p>
                    <p className="text-navy/60">{countryNames[a.country] ?? a.country}</p>
                    {a.phone && <p className="text-navy/60">{a.phone}</p>}
                  </div>
                  <DeleteAddressButton id={a.id} />
                </div>
              </div>
            ))
          ) : (
            <p className="rounded-xl bg-white p-8 text-center text-navy/60 shadow-soft">
              No saved addresses yet.
            </p>
          )}
        </div>

        <AddressForm />
      </div>
    </div>
  );
}
