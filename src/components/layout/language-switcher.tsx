"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Languages } from "lucide-react";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useTransition } from "react";

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();

  const handleLocaleChange = (newLocale: string) => {
    // The pathname from `usePathname` includes the current locale, so we need to remove it
    // before appending the new locale.
    const newPath = `/${newLocale}${pathname.substring(locale.length + 1)}`;
    startTransition(() => {
      router.replace(newPath);
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={isPending}>
          <Languages className="h-5 w-5" />
          <span className="sr-only">Change language</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          disabled={locale === 'en'}
          onClick={() => handleLocaleChange('en')}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={locale === 'hi'}
          onClick={() => handleLocaleChange('hi')}
        >
          हिंदी
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={locale === 'cg'}
          onClick={() => handleLocaleChange('cg')}
        >
          छत्तीसगढ़ी
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
