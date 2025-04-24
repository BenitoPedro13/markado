'use client';
import {RiAddLine} from '@remixicon/react';
import * as Button from '@/components/align-ui/ui/button';
import { Root as Switch } from '@/components/align-ui/ui/switch';
import Image from 'next/image';

const conferenceApps = [
  {
    id: 'google-meet',
    name: 'Google Meet',
    icon: <Image src="/logos/Google Meet.svg" alt="Google Meet" width={38} height={38} />,
    enabled: true
  },
  {
    id: 'teams',
    name: 'Microsoft Teams',
    icon: <Image src="/logos/Microsoft Teams.svg" alt="Microsoft Teams" width={38} height={38} />,
    enabled: false
  },
  {
    id: 'zoom',
    name: 'Zoom',
    icon: <Image src="/logos/Zoom.svg" alt="Zoom" width={38} height={38} />,
    enabled: false
  }
];

export default function Conference() {
  return (
    <div className="space-y-8">
      <div className="border border-stroke-soft-200 rounded-lg divide-y divide-stroke-soft-200">
        <div className="p-6">
          <div className="flex justify-between items-center">
            <div className="w-[400px] space-y-1">
              <h3 className="text-paragraph-md text-text-strong-950">
                Conferência
              </h3>
              <p className="text-paragraph-sm text-text-sub-600">
                Adicione seu aplicativos de conferências
              </p>
            </div>
            
            <Button.Root variant="neutral" mode="stroke">
              Adicionar<RiAddLine />
            </Button.Root>
          </div>
        </div>

        <div className="divide-y divide-stroke-soft-200">
          {conferenceApps.map((app) => (
            <div key={app.id} className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {app.icon}
                <span className="text-paragraph-md text-text-strong-950">{app.name}</span>
              </div>
              <Switch defaultChecked={app.enabled} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 