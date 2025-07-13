import {
  RiInformationLine,
} from '@remixicon/react';
import * as Tooltip from "./tooltip";

export function InfoBadge({ content }: { content: string }) {
  return (
    <>
      <Tooltip.Content side="top" content={content}>
        <span title={content}>
          <RiInformationLine name="info" className="text-subtle relative left-1 right-1 top-px mt-px h-4 w-4" />
        </span>
      </Tooltip.Content>
    </>
  );
}
