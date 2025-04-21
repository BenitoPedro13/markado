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
import { 
  Root as SelectRoot, 
  Trigger as SelectTrigger, 
  Content as SelectContent, 
  Item as SelectItem, 
  Value as SelectValue 
} from '@/components/align-ui/ui/select';
import { RiShareLine, RiMailLine, RiLinksLine, RiLockLine } from '@remixicon/react';

interface CalendarSharingProps {
  isOpen: boolean;
  onClose: () => void;
  onShare: (email: string, permission: string) => void;
  onGenerateLink: (permission: string) => void;
}

export function CalendarSharing({
  isOpen,
  onClose,
  onShare,
  onGenerateLink
}: CalendarSharingProps) {
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('view');
  const [shareLink, setShareLink] = useState('');
  const [isLinkGenerated, setIsLinkGenerated] = useState(false);

  const handleShare = () => {
    if (email) {
      onShare(email, permission);
      setEmail('');
    }
  };

  const handleGenerateLink = () => {
    onGenerateLink(permission);
    setIsLinkGenerated(true);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
  };

  return (
    <ModalRoot open={isOpen} onOpenChange={onClose}>
      <ModalContent className="sm:max-w-[425px]">
        <ModalHeader>
          <ModalTitle>Share Calendar</ModalTitle>
          <ModalDescription>
            Share your calendar with others or generate a link to share.
          </ModalDescription>
        </ModalHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <RiMailLine className="size-4" />
              <h4 className="text-sm font-medium">Share with people</h4>
            </div>
            <div className="flex gap-2">
              <InputRoot className="flex-1">
                <InputWrapper>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    value={email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  />
                </InputWrapper>
              </InputRoot>
              <SelectRoot value={permission} onValueChange={setPermission}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="manage">Manage</SelectItem>
                </SelectContent>
              </SelectRoot>
              <ButtonRoot variant="primary" mode="filled" onClick={handleShare}>
                Share
              </ButtonRoot>
            </div>
          </div>
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <RiLinksLine className="size-4" />
              <h4 className="text-sm font-medium">Share with link</h4>
            </div>
            <div className="flex gap-2">
              <SelectRoot value={permission} onValueChange={setPermission}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">View</SelectItem>
                  <SelectItem value="edit">Edit</SelectItem>
                  <SelectItem value="manage">Manage</SelectItem>
                </SelectContent>
              </SelectRoot>
              <ButtonRoot variant="primary" mode="filled" onClick={handleGenerateLink}>
                Generate Link
              </ButtonRoot>
            </div>
            {isLinkGenerated && (
              <div className="flex gap-2">
                <InputRoot className="flex-1">
                  <InputWrapper>
                    <Input
                      value={shareLink}
                      readOnly
                    />
                  </InputWrapper>
                </InputRoot>
                <ButtonRoot variant="primary" mode="filled" onClick={handleCopyLink}>
                  Copy
                </ButtonRoot>
              </div>
            )}
          </div>
        </div>
        <ModalFooter>
          <ButtonRoot variant="neutral" mode="stroke" onClick={onClose}>
            Close
          </ButtonRoot>
        </ModalFooter>
      </ModalContent>
    </ModalRoot>
  );
} 