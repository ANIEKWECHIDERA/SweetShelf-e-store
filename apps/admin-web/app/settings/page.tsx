import { Input, SectionCard } from "@sweetshelf/shared-ui";

export default function SettingsPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 md:px-8">
      <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Settings</h1>
      <SectionCard className="space-y-4">
        <Input label="Store name" defaultValue="SweetShelf Demo" />
        <Input label="WhatsApp number" defaultValue="+2348012345678" />
        <Input label="Delivery fee" defaultValue="2500" />
      </SectionCard>
    </main>
  );
}
