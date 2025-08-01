import Fuse from 'fuse.js';
import React, { useEffect, useState } from 'react';

import { Checkbox } from '../checkbox';
import { Input } from '../input';
import { Label } from '../label';
import { Popover, PopoverContent, PopoverTrigger } from '../popover';
import { SpecialInput } from './input';
import { Option } from '@/lib/constants';
import { cleanArrayObject, cn } from '@/lib/utils';

export interface BaseProps {
  classNames?: string;
  placeholder?: string;
  searchPlaceholder?: string;
}

interface SpecialDropdownProps extends BaseProps {
  options: Option[];
  defaultValue: Option[];
  onChange?: (option: Option[]) => void;
  coverTriggerWidth?: boolean;
}

const fuseOptions = {
  isCaseSensitive: false,
  includeMatches: false,
  threshold: 0.3,
  keys: ['value', 'label'],
};

export const SpecialMultiSelect = ({
  options,
  defaultValue,
  classNames,
  onChange,
  placeholder,
  searchPlaceholder,
}: SpecialDropdownProps) => {
  const [selectedOptions, setSelectedOptions] =
    useState(defaultValue);
  const [searchValue, setSearchValue] = useState('');

  // Create a new Fuse instance
  const fuse = new Fuse(options ?? [], fuseOptions);
  const results = fuse.search(searchValue);
  const resultLists = results.map((result) => result.item);
  const filteredOptions =
    resultLists.length > 0
      ? resultLists
      : searchValue
        ? resultLists
        : options;

  // Update state when defaultValue changes
  useEffect(() => {
    if (defaultValue) {
      setSelectedOptions(cleanArrayObject(defaultValue));
    }
  }, [defaultValue]);

  // Updated handler that avoids state updates during render
  const handleCheckboxChange = (item: {
    label: string;
    value: string;
  }) => {
    const newSelectedOptions = selectedOptions.some(
      (opt) => opt.value === item.value
    )
      ? selectedOptions.filter((opt) => opt.value !== item.value)
      : [...selectedOptions, item];

    setSelectedOptions(newSelectedOptions);

    if (onChange) {
      onChange(newSelectedOptions);
    }
  };

  return (
    <div>
      <Popover>
        <PopoverTrigger className="w-full p-0 py-0">
          <SpecialInput
            placeholder={placeholder}
            classNames={classNames}
            selectedOptions={selectedOptions}
            onValueChange={handleCheckboxChange}
          />
        </PopoverTrigger>
        <PopoverContent
          onWheel={(event) => event.stopPropagation()}
          align="start"
          className="h-fit w-fit space-y-2 overflow-auto px-3 py-2">
          <Input
            value={searchValue}
            placeholder={searchPlaceholder || 'Search'}
            onChange={(event) => setSearchValue(event.target.value)}
          />

          <ul className="flex max-h-72 flex-col gap-0 overflow-y-auto">
            {filteredOptions?.map((item, index) => (
              <li
                key={index}
                onClick={() => handleCheckboxChange(item)}
                className={cn(
                  'group flex cursor-pointer items-center gap-2 bg-white px-4 py-2 hover:bg-neutral-300',
                  {
                    'bg-neutral-lightAlt': selectedOptions.some(
                      (opt) => opt.value === item.value
                    ),
                  }
                )}>
                <Checkbox
                  onClick={(e) => e.stopPropagation()}
                  value={item.value}
                  checked={selectedOptions.some(
                    (opt) => opt.value === item.value
                  )}
                  onCheckedChange={() => handleCheckboxChange(item)}
                />
                <Label className="text-sm">{item.label}</Label>
              </li>
            ))}
          </ul>
        </PopoverContent>
      </Popover>
    </div>
  );
};
