import * as Switch from '@/components/align-ui/ui/switch';
import * as Divider from '@/components/align-ui/ui/divider';

type OptionalFormItemProps = {
  title: string;
  description: string;
  defaultChecked?: boolean;
  showDivider?: boolean;
};

export default function OptionalFormItem({ 
  title, 
  description, 
  defaultChecked = false,
  showDivider = true
}: OptionalFormItemProps) {
  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-text-sub-600">{description}</p>
        </div>
        <Switch.Root defaultChecked={defaultChecked} />
      </div>
      {showDivider && <Divider.Root />}
    </>
  );
} 