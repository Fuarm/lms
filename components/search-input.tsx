"use client";

import { SearchIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export const SearchInput = () => {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value);

  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = qs.stringifyUrl({
      url: pathname,
      query: {
        title: debouncedValue,
        categoryId: currentCategoryId
      }
    }, { skipNull: true, skipEmptyString: true });

    router.push(url);
  }, [currentCategoryId, debouncedValue, pathname, router]);

  return (
    <div className="relative flex-grow">
      <SearchIcon className="w-4 h-4 absolute top-3 left-3 text-slate-700" />
      <Input
        className="w-full md:w-80 pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Seach for a course"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
}