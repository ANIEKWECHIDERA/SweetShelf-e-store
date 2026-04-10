import { storefrontContact } from "@sweetshelf/shared-types";
import { Card, CardContent, Input } from "@sweetshelf/shared-ui";

export default function SettingsPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8 md:px-8">
      <h1 className="font-serif text-4xl text-[var(--color-brown-800)]">Settings</h1>
      <Card>
        <CardContent className="space-y-4 p-6">
          <div className="space-y-2">
            <label htmlFor="store-name" className="text-sm font-medium text-[var(--color-brown-800)]">
              Store name
            </label>
            <Input id="store-name" defaultValue="SweetShelf Demo" />
          </div>
          <div className="space-y-2">
            <label htmlFor="whatsapp-number" className="text-sm font-medium text-[var(--color-brown-800)]">
              WhatsApp number
            </label>
            <Input id="whatsapp-number" defaultValue={storefrontContact.whatsappNumber} />
          </div>
          <div className="space-y-2">
            <label htmlFor="delivery-fee" className="text-sm font-medium text-[var(--color-brown-800)]">
              Delivery fee
            </label>
            <Input id="delivery-fee" defaultValue="2500" />
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
