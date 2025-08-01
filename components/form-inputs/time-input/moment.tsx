import React, { useState } from 'react';

import {
  Button,
  Checkbox,
  Label,
  PopoverClose,
  Separator,
  Slider,
} from '@/components/ui';
import { formatTime } from '@/lib/utils';

interface Props {
  onChange: (option: string | undefined) => void;
}
export const MomentInput = ({ onChange }: Props) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);

  const handleHoursChange = (values: number[]) => {
    setHours(values[0]);
    onChange(formatTime(values[0], minutes));
  };

  const handleMinutesChange = (values: number[]) => {
    setMinutes(values[0]);
    onChange(formatTime(hours, values[0]));
  };
  const resetTimeSelection = () => {
    setMinutes(0);
    setHours(0);
    onChange(formatTime(0, 0));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center justify-start gap-4">
          <div className="flex size-12 items-center justify-center rounded-lg bg-neutral-dark">
            <span className="text-3xl font-bold text-white">
              {hours}
            </span>
          </div>
          <div>
            <span className="text-3xl font-bold text-black">:</span>
          </div>
          <div className="flex size-12 items-center justify-center rounded-lg bg-neutral-dark">
            <span className="text-3xl font-bold text-white">
              {minutes}
            </span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Label className="text-base">Time Varies:</Label>
          <Checkbox
            onCheckedChange={(chk) => {
              onChange(chk ? 'Varies' : formatTime(hours, minutes));
            }}
          />
        </div>
      </div>
      <Separator className="bg-neutral-hover" />
      <div className="space-y-3">
        <Label className="text-sm text-black">Hours:</Label>
        <Slider
          max={12}
          step={1}
          value={[hours]}
          onValueChange={handleHoursChange}
        />
        <div className="flex justify-between text-neutral-secondary">
          <span>00</span>
          <span>06</span>
          <span>12</span>
        </div>
      </div>
      <div className="space-y-3 pt-2">
        <Label className="text-sm text-black">Minutes:</Label>
        <Slider
          max={59}
          step={1}
          value={[minutes]}
          onValueChange={handleMinutesChange}
        />
        <div className="flex justify-between text-neutral-secondary">
          <span>00</span>
          <span>30</span>
          <span>59</span>
        </div>
      </div>
      <div>
        <Separator className="bg-neutral-200" />
        <div className="flex justify-end gap-3 pt-4">
          <PopoverClose asChild>
            <Button
              onClick={() => {
                resetTimeSelection();
              }}
              variant="outline">
              Cancel
            </Button>
          </PopoverClose>
          <PopoverClose asChild>
            <Button>Apply</Button>
          </PopoverClose>
        </div>
      </div>
    </div>
  );
};
