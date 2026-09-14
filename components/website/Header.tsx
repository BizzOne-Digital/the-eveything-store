import { getSiteSettings } from "@/lib/website/data";
import TopBar from "./TopBar";
import HeaderClient from "./HeaderClient";

export default async function Header() {
  const settings = await getSiteSettings();
  return (
    <header className="sticky top-0 z-50">
      <TopBar settings={settings} />
      <HeaderClient businessName={settings.businessName} logo={settings.logo} />
    </header>
  );
}
