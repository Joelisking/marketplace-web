import { useEffect, useRef, useState } from 'react';

import { calculateFitAndOverflow, cn } from '@/lib/utils';

import { BaseProps } from '.';
import { Icon } from '../icon';
import { Input } from '../input';
import { Option } from '@/lib/constants';
import { ToolTipLists } from '../tooltip-lists';

interface FormInputProps extends BaseProps {
  selectedOptions: Option[];
  onValueChange: (item: Option) => void;
}
export const SpecialInput = ({
  selectedOptions,
  classNames,
  placeholder,
  onValueChange,
}: FormInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputWidth, setInputWidth] = useState<number>(0);
  const [innerInputWidth, setInnerInputWidth] = useState<number>(0);
  const [charCount, setCharCount] = useState<number>(0);

  const calculateWidthAndChars = () => {
    if (inputRef.current) {
      const inputElement = inputRef.current;
      const computedStyle = getComputedStyle(inputElement);

      // Determine the current input width and font size
      const inputWidth = inputElement.offsetWidth;
      const innerWidth = inputWidth - 10;
      const fontSize = parseFloat(computedStyle.fontSize);
      setInputWidth(inputWidth);
      setInnerInputWidth(innerWidth);

      // Create a canvas to measure text width
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (context) {
        context.font = `${fontSize}px ${computedStyle.fontFamily}`; // Use dynamically detected font size

        // Measure width of an average character and space
        const charWidth = context.measureText('M').width;
        const spaceWidth = context.measureText(' ').width;

        // Average the widths to account for mixed content
        const averageCharWidth = (charWidth + spaceWidth) / 2;

        // Calculate the max characters that fit
        const maxChars = Math.floor(innerWidth / averageCharWidth);
        setCharCount(maxChars);
      }
    }
  };
  useEffect(() => {
    calculateWidthAndChars(); // Initial calculation

    // Recalculate on window resize for fluid width adjustments
    const handleResize = () => {
      calculateWidthAndChars();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="text-sm">
      <Input
        ref={inputRef}
        type="text"
        className="absolute h-4 w-full overflow-hidden border-0 opacity-0"
        disabled
      />
      <div
        className={cn(
          'relative flex h-8 w-full cursor-pointer items-center justify-between gap-4 overflow-hidden rounded-2xl border border-neutral-input bg-white p-0',
          classNames
        )}
        style={{ width: inputWidth }}>
        {selectedOptions.length === 0 ? (
          <div className="flex w-full items-center justify-between px-3 py-2 text-neutral-secondary">
            <span className="text-left">{placeholder}</span>
            <Icon name="ChevronDown" className="h-4 w-4" />
          </div>
        ) : (
          <ul
            className="relative flex h-full items-center gap-1 overflow-hidden whitespace-nowrap px-3 pl-1"
            style={{ width: innerInputWidth }}>
            {calculateFitAndOverflow(
              selectedOptions,
              charCount
            ).fitItems?.map((option, index) => (
              <li
                className="flex flex-shrink-0 items-center rounded-3xl bg-neutral-hover px-2.5 py-0.5 text-neutral-dark"
                key={index}>
                <span>{option.label}</span>
                <Icon
                  name="X"
                  className="size-4 text-neutral-secondary hover:cursor-pointer"
                  onClick={(e) => {
                    onValueChange(option);
                    e.preventDefault();
                  }}
                />
              </li>
            ))}
            <li className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-1">
              {calculateFitAndOverflow(selectedOptions, charCount)
                ?.overflowCount > 0 && (
                <ToolTipLists
                  component={
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-dark p-1 text-white shadow-sm">
                      <span className="text-xs font-normal">
                        +
                        {
                          calculateFitAndOverflow(
                            selectedOptions,
                            charCount
                          )?.overflowCount
                        }
                      </span>
                    </div>
                  }>
                  <ul>
                    {calculateFitAndOverflow(
                      selectedOptions,
                      charCount
                    ).overflowItems?.map((item, idx) => (
                      <li key={idx}>{item.label}</li>
                    ))}
                  </ul>
                </ToolTipLists>
              )}
              <div>
                <Icon name="ChevronDown" className="h-4 w-4" />
              </div>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
};
