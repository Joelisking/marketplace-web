import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import React from 'react';

interface Props {
  children: React.ReactNode;
  component: React.ReactNode;
}

export const ToolTipLists = ({ component, children }: Props) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{component}</TooltipTrigger>
        <TooltipContent>{children}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
