import React, { useState } from 'react';
import { 
  Root as ModalRoot, 
  Content as ModalContent, 
  Header as ModalHeader, 
  Title as ModalTitle, 
  Description as ModalDescription,
  Footer as ModalFooter
} from '@/components/align-ui/ui/modal';
import { 
  Root as ButtonRoot
} from '@/components/align-ui/ui/button';
import { 
  Root as InputRoot, 
  Wrapper as InputWrapper, 
  Input 
} from '@/components/align-ui/ui/input';
import { RiDownloadLine, RiUploadLine, RiLink } from '@remixicon/react';

interface ExternalCalendarProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (file: File) => void;
  onExport: () => void;
  onSubscribe: (url: string) => void;
}

export function ExternalCalendar({
  isOpen,
  onClose,
  onImport,
  onExport,
  onSubscribe,
}: ExternalCalendarProps) {
  const [importUrl, setImportUrl] = React.useState('');
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleImport = () => {
    if (selectedFile) {
      onImport(selectedFile);
      setSelectedFile(null);
    }
  };

  const handleSubscribe = () => {
    if (importUrl) {
      onSubscribe(importUrl);
      setImportUrl('');
    }
  };

  return (
    <ModalRoot open={isOpen} onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader
          title="External Calendar"
          description="Import, export, or subscribe to external calendars"
        />
        <div className="p-5">
          <div className="space-y-6">
            {/* Import Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Import Calendar</h3>
              <div className="flex items-center gap-4">
                <InputRoot>
                  <InputWrapper>
                    <input
                      type="file"
                      accept=".ics"
                      onChange={handleFileChange}
                      className="hidden"
                      id="calendar-import"
                    />
                    <label
                      htmlFor="calendar-import"
                      className="cursor-pointer"
                    >
                      <ButtonRoot
                        variant="primary"
                        mode="filled"
                        onClick={() => document.getElementById('calendar-import')?.click()}
                      >
                        <span className="flex items-center gap-2">
                          <RiUploadLine className="size-4" />
                          Choose File
                        </span>
                      </ButtonRoot>
                    </label>
                  </InputWrapper>
                </InputRoot>
                <ButtonRoot
                  variant="primary"
                  mode="filled"
                  onClick={handleImport}
                  disabled={!selectedFile}
                >
                  Import
                </ButtonRoot>
              </div>
            </div>

            {/* Export Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Export Calendar</h3>
              <ButtonRoot
                variant="primary"
                mode="filled"
                onClick={onExport}
              >
                <span className="flex items-center gap-2">
                  <RiDownloadLine className="size-4" />
                  Export Calendar
                </span>
              </ButtonRoot>
            </div>

            {/* Subscribe Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Subscribe to Calendar</h3>
              <div className="flex items-center gap-4">
                <InputRoot>
                  <InputWrapper>
                    <div className="flex items-center">
                      <RiLink className="size-4 ml-3 text-gray-500" />
                      <Input
                        type="url"
                        placeholder="Enter calendar URL"
                        value={importUrl}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setImportUrl(e.target.value)}
                        className="w-full px-3 py-2 pl-10" // Add left padding for the icon
                      />
                    </div>
                  </InputWrapper>
                </InputRoot>
                <ButtonRoot
                  variant="primary"
                  mode="filled"
                  onClick={handleSubscribe}
                  disabled={!importUrl}
                >
                  Subscribe
                </ButtonRoot>
              </div>
            </div>
          </div>
        </div>
        <ModalFooter>
          <ButtonRoot
            variant="neutral"
            mode="stroke"
            onClick={onClose}
          >
            Close
          </ButtonRoot>
        </ModalFooter>
      </ModalContent>
    </ModalRoot>
  );
} 