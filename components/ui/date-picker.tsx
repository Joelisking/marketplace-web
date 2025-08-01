import { format } from 'date-fns';

import { cn } from '@/lib/utils';

import { Button } from './button';
import { Icon } from './icon';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Separator } from './separator';
import { TheAduseiCalendar, TheCalendarProps } from './the-calendar';

interface Props extends TheCalendarProps {
  className?: string;
  open: boolean;
  onToggle: () => void;
}
export function DatePicker(props: Props) {
  return (
    <Popover open={props.open}>
      <PopoverTrigger asChild>
        <Button
          onClick={() => props.onToggle()}
          className={cn(
            'h-8 w-full justify-between rounded-2xl border-neutral-input bg-white px-3 py-2.5 text-left font-normal hover:border-b-2 hover:border-b-primary-default hover:bg-white',
            !props.value && 'text-neutral-default',
            props.className
          )}
          size="sm"
          variant="outline">
          <div className="text-sm text-neutral-default">
            {props.value ? (
              props.value &&
              !isNaN(
                new Date(props.value as unknown as string).getTime()
              ) ? (
                format(
                  new Date(props.value as unknown as string),
                  'PPP'
                )
              ) : (
                'Invalid date'
              )
            ) : (
              <span>Pick a date</span>
            )}
          </div>
          <Icon
            name="CalendarDays"
            className="text-primary-500 mr-0 h-4 w-4"
            size={20}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        alignOffset={0}
        sideOffset={0}
        side="bottom"
        align="start"
        className="my-2 w-fit bg-white p-2">
        <TheAduseiCalendar {...props} />
        <div className="px-3">
          <Separator className="my-2" />
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button
            onClick={() => props.onToggle()}
            className="flex-grow"
            variant="outline"
            type="button">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => props.onToggle()}
            className="flex-grow">
            Apply
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
