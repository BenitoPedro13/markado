import * as Divider from '@/components/align-ui/ui/divider';

type RequiredFormItemProps = {
  title: string;
  description: string;
  showDivider?: boolean;
};

export default function RequiredFormItem({ 
  title, 
  description,
  showDivider = true
}: RequiredFormItemProps) {
  return (
    <>
      <div className="flex items-center justify-between p-4">
        <div>
          <h3 className="font-medium flex items-center gap-1">
            {title}
            <span className="text-red-500">*</span>
          </h3>
          <p className="text-sm text-text-sub-600">{description}</p>
        </div>
      </div>
      {showDivider && <Divider.Root />}
    </>
  );
} 