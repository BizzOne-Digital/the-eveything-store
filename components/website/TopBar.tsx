import { Phone, Mail } from "lucide-react";
import type { PlainSiteSettings } from "@/lib/website/data";
import { FacebookIcon, InstagramIcon, TikTokIcon } from "./SocialIcons";

export default function TopBar({ settings }: { settings: PlainSiteSettings }) {
  const { announcementBar, phone, email, socialLinks } = settings;

  return (
    <div className="bg-tes-black text-white text-xs sm:text-[13px]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10 flex items-center justify-between gap-4 py-2">
        <p className="truncate text-tes-gold-light font-medium">{announcementBar}</p>
        <div className="hidden sm:flex items-center gap-4 shrink-0">
          {phone && (
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-1.5 hover:text-tes-gold-light transition-colors">
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{phone}</span>
            </a>
          )}
          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-1.5 hover:text-tes-gold-light transition-colors">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{email}</span>
            </a>
          )}
          <div className="flex items-center gap-3 pl-2 border-l border-white/20">
            {socialLinks?.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="hover:text-tes-gold-light transition-colors">
                <FacebookIcon className="h-3.5 w-3.5" />
              </a>
            )}
            {socialLinks?.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="hover:text-tes-gold-light transition-colors">
                <InstagramIcon className="h-3.5 w-3.5" />
              </a>
            )}
            {socialLinks?.tiktok && (
              <a href={socialLinks.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="hover:text-tes-gold-light transition-colors">
                <TikTokIcon className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
