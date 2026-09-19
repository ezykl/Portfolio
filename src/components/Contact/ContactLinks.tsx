import React from "react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconPhone,
  type IconProps,
} from "@tabler/icons-react";

/**
 * Direct contact / social links shown in the Contact footer alongside the form.
 *
 * ▶ EDIT ME: this is the single place to put your real details. Delete any you
 * don't want shown; add more (Dribbble, Instagram, X…) by importing another
 * @tabler/icons-react brand icon and adding a row.
 */
interface ContactLink {
  label: string;
  /** Full URL / mailto: / tel: */
  href: string;
  icon: React.ComponentType<IconProps>;
  /** Human-readable value shown next to the icon (handle, number, address). */
  display: string;
  external?: boolean;
}

const CONTACT_LINKS: ContactLink[] = [
  {
    label: "GitHub",
    href: "https://github.com/ezykl",
    icon: IconBrandGithub,
    display: "@ezykl",
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/ezekiel-villadolid",
    icon: IconBrandLinkedin,
    display: "in/ezekiel-villadolid",
    external: true,
  },
  {
    label: "Email",
    href: "mailto:zyk.creatives@gmail.com",
    icon: IconMail,
    display: "zyk.creatives@gmail.com",
  },
  {
    label: "Phone",
    href: "tel:+639939389798",
    icon: IconPhone,
    display: "09939389798",
  },
];

export const ContactLinks: React.FC = () => (
  <ul className="mx-auto flex max-w-lg flex-wrap items-center justify-center gap-3">
    {CONTACT_LINKS.map(({ label, href, icon: Icon, display, external }) => (
      <li key={label}>
        <a
          href={href}
          {...(external
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          aria-label={label}
          className="group inline-flex items-center gap-2.5 rounded-full border border-white/10 bg-slate-900/60 px-4 py-2 font-body text-sm font-medium text-slate-200 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-zyk-accent/60 hover:bg-slate-900 hover:text-white hover:shadow-md"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-zyk-accent transition-colors group-hover:bg-zyk-accent/20 group-hover:text-zyk-secondary">
            <Icon size={16} stroke={2} />
          </span>
          <span className="tracking-wide">{display}</span>
        </a>
      </li>
    ))}
  </ul>
);
