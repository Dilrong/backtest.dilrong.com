"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ComboboxProps {
  options: { value: string; label: string }[];
  value: string | null;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select an option",
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedLabel =
    options.find((option) => option.value === value)?.label || placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full justify-between">
          {selectedLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full min-w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => {
                  onChange(option.value);
                  setTimeout(() => setOpen(false), 50);
                }}
                className="cursor-pointer"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
