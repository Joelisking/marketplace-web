import { format } from "date-fns";
import Calendar from "react-calendar";

import { Icon } from "./icon";

export type TheCalendarProps = React.ComponentProps<typeof Calendar>;

const TheAduseiCalendar = (props: TheCalendarProps) => {
  return (
    <Calendar
      calendarType="gregory"
      {...props}
      className={"border-0"}
      nextLabel={
        <Icon
          name="ChevronRight"
          // className="text-sm font-normal hover:text-base"
          strokeWidth={1}
        />
      }
      next2Label={
        <Icon
          name="ChevronsRight"
          // className="text-center text-base"
          strokeWidth={1}
        />
      }
      prevLabel={
        <Icon
          name="ChevronLeft"
          // className="text-center text-base"
          strokeWidth={1}
        />
      }
      prev2Label={
        <Icon
          name="ChevronsLeft"
          // className="text-center text-base"
          strokeWidth={1}
        />
      }
      formatMonth={(_, date) => format(new Date(date), "MMM")}
      formatMonthYear={(_, date) => format(new Date(date), "MMM yyyy")}
      minDate={props.minDate}
      maxDate={props.maxDate}
    />
  );
};

TheAduseiCalendar.displayName = "TheAduseiCalendar";

export { TheAduseiCalendar };
