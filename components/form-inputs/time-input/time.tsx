// import React, { useState } from "react";
// import {
//   Button,
//   Label,
//   PopoverClose,
//   Separator,
//   Slider,
// } from "@/components/ui";
// import { cn, formatClock } from "@/lib";
// interface Props {
//   onChange: (option: string | undefined) => void;
// }
// export const TimeInput = ({ onChange }: Props) => {
//   const [hours, setHours] = useState(0);
//   const [minutes, setMinutes] = useState(0);
//   const [light, setLight] = useState(true);
//   const handleHoursChange = (values: number[]) => {
//     setHours(values[0]);
//     onChange(formatClock(values[0], minutes, light));
//   };
//   const handleMinutesChange = (values: number[]) => {
//     setMinutes(values[0]);
//     onChange(formatClock(hours, values[0], light));
//   };
//   const handleLightChange = (light: boolean) => {
//     setLight(light);
//     onChange(formatClock(hours, minutes, light));
//   };
//   const resetTimeSelection = () => {
//     setMinutes(0);
//     setHours(0);
//     onChange(formatClock(0, 0, light));
//   };
//   return (
//     <div className="space-y-2">
//       <div className="flex items-center justify-between gap-4">
//         <div className="text-xl font-normal">
//           <span>{hours.toString().padStart(2, "0")}</span>
//           <span>:</span>
//           <span>{minutes.toString().padStart(2, "0")}</span>
//           <span>{light ? "AM" : "PM"}</span>
//         </div>
//         <div>
//           <div className="rounded-lg border border-neutral-secondary p-0.5">
//             <ul className="flex gap-x-0.5">
//               <li
//                 className={cn(
//                   "rounded-lg px-2 hover:cursor-pointer",
//                   !light && "bg-white text-neutral-dark",
//                   light && "bg-neutral-dark text-white",
//                 )}
//                 onClick={() => handleLightChange(true)}
//               >
//                 <span className="text-sm">AM</span>
//               </li>
//               <li
//                 className={cn(
//                   "rounded-lg px-2 hover:cursor-pointer",
//                   light && "bg-white text-neutral-dark",
//                   !light && "bg-neutral-dark text-white",
//                 )}
//                 onClick={() => handleLightChange(false)}
//               >
//                 <span className="text-sm">PM</span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//       <Separator className="bg-neutral-hover" />
//       <div className="space-y-3">
//         <Label className="text-sm text-black">Hours:</Label>
//         <Slider
//           max={12}
//           step={1}
//           value={[hours]}
//           onValueChange={handleHoursChange}
//         />
//         <div className="flex justify-between text-neutral-secondary">
//           <span>00</span>
//           <span>06</span>
//           <span>12</span>
//         </div>
//       </div>
//       <div className="space-y-3 pt-2">
//         <Label className="text-sm text-black">Minutes:</Label>
//         <Slider
//           max={59}
//           step={1}
//           value={[minutes]}
//           onValueChange={handleMinutesChange}
//         />
//         <div className="flex justify-between text-neutral-secondary">
//           <span>00</span>
//           <span>30</span>
//           <span>59</span>
//         </div>
//       </div>
//       <div>
//         <Separator className="bg-neutral-200" />
//         <div className="flex justify-end gap-3 pt-4">
//           <PopoverClose asChild>
//             <Button
//               onClick={() => {
//                 resetTimeSelection();
//               }}
//               variant="outline"
//             >
//               Cancel
//             </Button>
//           </PopoverClose>
//           <PopoverClose asChild>
//             <Button>Apply</Button>
//           </PopoverClose>
//         </div>
//       </div>
//     </div>
//   );
// };
import React, { useState } from 'react';

import {
  Button,
  Label,
  PopoverClose,
  Separator,
  Slider,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import { formatClock } from '@/lib/constants';

interface Props {
  onChange: (option: string | undefined) => void;
}
export const TimeInput = ({ onChange }: Props) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [light, setLight] = useState(true);

  const handleHoursChange = (values: number[]) => {
    setHours(values[0]);
    onChange(formatClock(values[0], minutes, light));
  };

  const handleMinutesChange = (values: number[]) => {
    setMinutes(values[0]);
    onChange(formatClock(hours, values[0], light));
  };

  const handleLightChange = (light: boolean) => {
    setLight(light);
    onChange(formatClock(hours, minutes, light));
  };

  const resetTimeSelection = () => {
    setMinutes(0);
    setHours(0);
    onChange(formatClock(0, 0, light));
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <div className="text-xl font-normal">
          <span>{hours.toString().padStart(2, '0')}</span>
          <span>:</span>
          <span>{minutes.toString().padStart(2, '0')}</span>
          <span>{light ? 'AM' : 'PM'}</span>
        </div>
        <div>
          <div className="rounded-lg border border-neutral-secondary p-0.5">
            <ul className="flex gap-x-0.5">
              <li
                className={cn(
                  'rounded-lg px-2 hover:cursor-pointer',
                  !light && 'bg-white text-neutral-dark',
                  light && 'bg-neutral-dark text-white'
                )}
                onClick={() => handleLightChange(true)}>
                <span className="text-sm">AM</span>
              </li>
              <li
                className={cn(
                  'rounded-lg px-2 hover:cursor-pointer',
                  light && 'bg-white text-neutral-dark',
                  !light && 'bg-neutral-dark text-white'
                )}
                onClick={() => handleLightChange(false)}>
                <span className="text-sm">PM</span>
              </li>
            </ul>
          </div>
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
