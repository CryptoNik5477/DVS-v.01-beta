import { ScaffoldNotice } from "@/components/admin/scaffold-notice";

export const metadata = { title: "Admin · Settings" };

export default function AdminSettingsPage() {
  return (
    <ScaffoldNotice title="Settings">
      Store settings (branding, currencies, shipping tariffs, taxes) are driven by editable config
      files: <code>src/config/site.ts</code>, <code>src/config/currencies.ts</code>,{" "}
      <code>src/config/shipping.ts</code>. Surface them as editable fields here, or keep them in code
      for version-controlled changes.
    </ScaffoldNotice>
  );
}
