import {RiArrowRightSLine, RiCheckboxCircleFill} from '@remixicon/react';
import * as CompactButton from '@/components/align-ui/ui/compact-button';

interface SidebarFooterProps {
  variant?: 'pro' | 'free';
  name: string;
  email: string;
  avatarUrl: string;
}

const SidebarFooter = ({
  variant = 'free',
  name,
  email,
  avatarUrl
}: SidebarFooterProps) => {
  return (
    <div className="w-full p-3 bg-bg-white-0 inline-flex justify-start items-center overflow-hidden">
      <div className="w-full p-3 bg-bg-white-0 rounded-[10px] hover:bg-bg-weak-50 transition-colors flex justify-start items-center gap-2 overflow-hidden cursor-pointer">
        <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
          <img className="w-10 h-10" src={avatarUrl} alt={name} />
        </div>
        <div className="flex-1 h-10 inline-flex flex-col justify-start items-start gap-1">
          <div className="self-stretch inline-flex justify-start items-start gap-0.5">
            <div className="text-label-sm text-text-strong-950 text-sm font-medium font-sans leading-tight">
              {name}
            </div>
            {variant === 'pro' && (
              <div className="w-5 h-5 relative overflow-hidden">
                <RiCheckboxCircleFill className="w-3 h-3 absolute left-[3.72px] top-[3.72px] text-state-verified-base" />
              </div>
            )}
          </div>
          <div className="self-stretch justify-start text-text-sub-600 text-paragraph-sm font-normal font-sans leading-none">
            {email}
          </div>
        </div>
        <CompactButton.Root variant="ghost">
          <CompactButton.Icon as={RiArrowRightSLine} />
        </CompactButton.Root>
      </div>
    </div>
  );
};

export default SidebarFooter; 