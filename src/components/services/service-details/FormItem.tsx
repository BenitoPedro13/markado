import * as Switch from '@/components/align-ui/ui/switch';
import * as Divider from '@/components/align-ui/ui/divider';

type FormItemProps = {
  title: string;
  description: string;
  defaultChecked?: boolean;
  showDivider?: boolean;
  isRequired?: boolean;
};

export default function FormItem({ 
  title, 
  description, 
  defaultChecked = false,
  showDivider = true,
  isRequired = false
}: FormItemProps) {
  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-medium flex items-center gap-1">
            {title}
            {isRequired && <span className="text-red-500">*</span>}
          </h3>
          <p className="text-sm text-text-sub-600">{description}</p>
        </div>
        <Switch.Root defaultChecked={defaultChecked} />
      </div>
      {showDivider && <Divider.Root />}
    </>
  );
} 