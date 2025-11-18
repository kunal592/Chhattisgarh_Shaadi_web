import { Logo } from "@/components/ui/logo";
import Link from "next/link";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("Footer");
  const year = new Date().getFullYear();

  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <Logo />
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            {t("copyright", { year })}
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground">{t('privacyPolicy')}</Link>
            <Link href="/terms" className="hover:text-foreground">{t('termsOfService')}</Link>
            <Link href="/contact" className="hover:text-foreground">{t('contact')}</Link>
        </div>
      </div>
    </footer>
  );
}
