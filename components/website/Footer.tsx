import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";
import { getSiteSettings } from "@/lib/website/data";
import Logo from "./Logo";
import { FacebookIcon, InstagramIcon } from "./SocialIcons";

export default async function Footer() {
  const settings = await getSiteSettings();

  return (
    <footer className="bg-tes-black text-white">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        <div>
          <Logo businessName={settings.businessName} logo={settings.footerLogo || settings.logo} className="[&_span]:text-white" />
          <p className="mt-4 text-sm text-white/70 leading-relaxed">{settings.footerDescription}</p>
          <p className="mt-3 text-sm text-white/60 leading-relaxed">{settings.footerMission}</p>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-tes-gold-light mb-4">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li><Link href="/shop" className="hover:text-tes-gold-light transition-colors">Shop</Link></li>
            <li><Link href="/services" className="hover:text-tes-gold-light transition-colors">Services</Link></li>
            <li><Link href="/about" className="hover:text-tes-gold-light transition-colors">About Us</Link></li>
            <li><Link href="/pricing" className="hover:text-tes-gold-light transition-colors">Pricing</Link></li>
            <li><Link href="/contact" className="hover:text-tes-gold-light transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-tes-gold-light mb-4">
            Support
          </h3>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li><Link href="/search" className="hover:text-tes-gold-light transition-colors">Search</Link></li>
            <li><Link href="/cart" className="hover:text-tes-gold-light transition-colors">Cart</Link></li>
            <li><Link href="/wishlist" className="hover:text-tes-gold-light transition-colors">Wishlist</Link></li>
            <li><Link href="/privacy" className="hover:text-tes-gold-light transition-colors">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-tes-gold-light transition-colors">Terms of Service</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-widest text-tes-gold-light mb-4">
            Get in Touch
          </h3>
          <ul className="space-y-3 text-sm text-white/75">
            {settings.phone && (
              <li className="flex items-start gap-2.5">
                <Phone className="h-4 w-4 mt-0.5 text-tes-gold shrink-0" />
                <a href={`tel:${settings.phone.replace(/[^\d+]/g, "")}`} className="hover:text-tes-gold-light transition-colors">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings.email && (
              <li className="flex items-start gap-2.5">
                <Mail className="h-4 w-4 mt-0.5 text-tes-gold shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-tes-gold-light transition-colors break-all">
                  {settings.email}
                </a>
              </li>
            )}
            {settings.address && (
              <li className="flex items-start gap-2.5">
                <MapPin className="h-4 w-4 mt-0.5 text-tes-gold shrink-0" />
                <span>{settings.address}</span>
              </li>
            )}
          </ul>
          <div className="flex items-center gap-3 mt-4">
            {settings.socialLinks?.facebook && (
              <a href={settings.socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-2 rounded-full bg-white/10 hover:bg-tes-gold hover:text-tes-black transition-colors">
                <FacebookIcon className="h-4 w-4" />
              </a>
            )}
            {settings.socialLinks?.instagram && (
              <a href={settings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-2 rounded-full bg-white/10 hover:bg-tes-gold hover:text-tes-black transition-colors">
                <InstagramIcon className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-white/50">
          <p>&copy; {new Date().getFullYear()} {settings.copyrightText}</p>
          <p>Built by BizzOne Digital</p>
        </div>
      </div>
    </footer>
  );
}
