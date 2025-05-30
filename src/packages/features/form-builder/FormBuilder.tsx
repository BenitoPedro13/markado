import {useAutoAnimate} from '@formkit/auto-animate/react';
import {JSX, useEffect, useState} from 'react';
import type {SubmitHandler, UseFormReturn} from 'react-hook-form';
import {
  Controller,
  useFieldArray,
  useForm,
  useFormContext
} from 'react-hook-form';
import type {z} from 'zod';

import {cn as classNames} from '@/utils/cn';
import {useLocale} from '@/hooks/use-locale';
import {md} from '@/packages/lib/markdownIt';
import {markdownToSafeHTMLClient} from '@/packages/lib/markdownToSafeHTMLClient';
import turndown from '@/packages/lib/turndownService';
import * as Badge from '@/components/align-ui/ui/badge';
import * as Button from '@/components/align-ui/ui/button';
import * as Checkbox from '@/components/align-ui/ui/checkbox';
import {
  Root as Dialog,
  Content as DialogContent,
  Body as DialogBody,
  Footer as DialogFooter,
  Header as DialogHeader,
  Close as DialogClose
} from '@/components/align-ui/ui/modal';

import * as SegmentedControl from '@/components/align-ui/ui/segmented-control';
import * as FancyButton from '@/components/align-ui/ui/fancy-button';
import * as Input from '@/components/align-ui/ui/input';
import * as Label from '@/components/align-ui/ui/label';
import {useNotification} from '@/hooks/use-notification';
import * as Switch from '@/components/align-ui/ui/switch';
import * as Tooltip from '@/components/align-ui/ui/tooltip';
import * as Select from '@/components/align-ui/ui/select';
import * as Textarea from '@/components/align-ui/ui/textarea';

import {Form} from '@/packages/ui';

import {fieldTypesConfigMap} from './fieldTypes';
import {fieldsThatSupportLabelAsSafeHtml} from './fieldsThatSupportLabelAsSafeHtml';
import type {fieldsSchema, FieldType} from './schema';
import {getFieldIdentifier} from './utils/getFieldIdentifier';
import {getConfig as getVariantsConfig} from './utils/variantsConfig';
import {
  RiAddLine,
  RiCloseLine,
  RiDeleteBinLine,
  RiXboxLine
} from '@remixicon/react';
import React from 'react';
import {InputSharedProps} from '@/components/align-ui/ui/input';

type RhfForm = {
  fields: z.infer<typeof fieldsSchema>;
};

type RhfFormFields = RhfForm['fields'];

type RhfFormField = RhfFormFields[number];

// Custom wrapper components for react-hook-form integration
type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> &
  InputSharedProps & {
    label?: string;
    containerClassName?: string;
    error?: string;
  };

const InputField = React.forwardRef<HTMLInputElement, InputFieldProps>(
  ({label, containerClassName, error, className, ...props}, ref) => {
    return (
      <div className={containerClassName}>
        {label && (
          <Label.Root htmlFor={props.name} className="mb-1">
            {label}
          </Label.Root>
        )}
        <Input.Root>
          <Input.Input ref={ref} className={className} {...props} />
        </Input.Root>
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

interface CheckboxFieldProps {
  label?: string;
  description?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  name?: string;
}

export const CheckboxField = React.forwardRef<HTMLButtonElement, CheckboxFieldProps>(
  ({label, description, ...props}, ref) => {
    return (
      <div className="flex items-center space-x-2 mt-4">
        <Checkbox.Root ref={ref} {...props} />
        <div className="grid gap-1.5 leading-none">
          {label && (
            <Label.Root className="text-text-sub-600 text-label-sm peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
              {label}
            </Label.Root>
          )}
          {description && (
            <p className="text-text-sub-600 text-label-sm ">{description}</p>
          )}
        </div>
      </div>
    );
  }
);

interface BooleanToggleGroupFieldProps {
  label?: string;
  value?: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  'data-testid'?: string;
}

const BooleanToggleGroupField: React.FC<BooleanToggleGroupFieldProps> = ({
  label,
  value,
  onValueChange,
  disabled = false,
  'data-testid': dataTestId
}) => {
  const valueString = value ? 'yes' : 'no';

  return (
    <div className="mt-4">
      {label && <Label.Root className="mb-1">{label}</Label.Root>}
      {/* <Switch.Root
        checked={value}
        onCheckedChange={onValueChange}
        disabled={disabled}
        data-testid={dataTestId}
      /> */}
      <SegmentedControl.Root
        defaultValue={valueString}
        onValueChange={(value) => onValueChange(value === 'yes')}
      >
        <SegmentedControl.List>
          <SegmentedControl.Trigger
            value={'yes'}
            disabled={disabled}
          >
            Sim
          </SegmentedControl.Trigger>
          <SegmentedControl.Trigger
            value={'no'}
            disabled={disabled}
          >
            Não
          </SegmentedControl.Trigger>
        </SegmentedControl.List>
      </SegmentedControl.Root>
    </div>
  );
};

interface EditorProps {
  getText: () => string;
  setText: (value: string) => void;
  excludedToolbarItems?: string[];
  disableLists?: boolean;
  firstRender?: boolean;
  setFirstRender?: (value: boolean) => void;
  placeholder?: string;
}

const Editor: React.FC<EditorProps> = ({
  getText,
  setText,
  placeholder,
  setFirstRender
}) => {
  const [value, setValue] = useState(getText());

  useEffect(() => {
    if (setFirstRender) {
      setFirstRender(false);
    }
  }, [setFirstRender]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setText(newValue);
  };

  return (
    <Textarea.Root
      value={value}
      onChange={handleChange}
      placeholder={placeholder}
      rows={4}
    >
      <Textarea.CharCounter />
    </Textarea.Root>
  );
};

function getCurrentFieldType(fieldForm: UseFormReturn<RhfFormField>) {
  return fieldTypesConfigMap[fieldForm.watch('type') || 'text'];
}

/**
 * It works with a react-hook-form only.
 * `formProp` specifies the name of the property in the react-hook-form that has the fields. This is where fields would be updated.
 */
export const FormBuilder = function FormBuilder({
  title,
  description,
  addFieldLabel,
  formProp,
  disabled = false,
  LockedIcon,
  // dataStore,
  shouldConsiderRequired
}: {
  formProp: string;
  title: string;
  description: string;
  addFieldLabel: string;
  disabled: boolean;
  LockedIcon: false | JSX.Element;
  /**
   * A readonly dataStore that is used to lookup the options for the fields. It works in conjunction with the field.getOptionAt property which acts as the key in options
   */
  // dataStore: {
  //   options: Record<
  //     string,
  //     {
  //       source: {label: string};
  //       value: {label: string; value: string; inputPlaceholder?: string}[];
  //     }
  //   >;
  // };
  /**
   * This is kind of a hack to allow certain fields to be just shown as required when they might not be required in a strict sense
   * e.g. Location field has a default value at backend so API can send no location but formBuilder in UI doesn't allow it.
   */
  shouldConsiderRequired?: (field: RhfFormField) => boolean | undefined;
}) {
  // I would have liked to give Form Builder it's own Form but nested Forms aren't something that browsers support.
  // So, this would reuse the same Form as the parent form.
  const fieldsForm = useFormContext<RhfForm>();
  const [parent] = useAutoAnimate<HTMLUListElement>();
  const {t} = useLocale();
  const {notification} = useNotification();

  const {fields, swap, remove, update, append} = useFieldArray({
    control: fieldsForm.control,
    // HACK: It allows any property name to be used for instead of `fields` property name
    name: formProp as unknown as 'fields'
  });

  const [fieldDialog, setFieldDialog] = useState({
    isOpen: false,
    fieldIndex: -1,
    data: {} as RhfFormField | null
  });

  const addField = () => {
    setFieldDialog({
      isOpen: true,
      fieldIndex: -1,
      data: null
    });
  };

  const editField = (index: number, data: RhfFormField) => {
    setFieldDialog({
      isOpen: true,
      fieldIndex: index,
      data
    });
  };

  const removeField = (index: number) => {
    remove(index);
  };

  return (
    <>
      <div className="space-y-6 max-w-2xl">
        <div className="space-y-4">
          <div className="flex flex-col">
            <div className="text-title-h6">Formulário da Reserva</div>
            <div className="text-paragraph-sm text-text-sub-600">
              Personalize as perguntas feitas na página de reservas
            </div>
          </div>
          <ul ref={parent} className="flex flex-col">
            {fields.map((field, index) => {
              let options = field.options ?? null;
              const sources = [...(field.sources || [])];
              const isRequired = shouldConsiderRequired
                ? shouldConsiderRequired(field)
                : field.required;
              if (!options && field.getOptionsAt) {
                // const {
                //   source: {label: sourceLabel},
                //   value
                // } =
                //   dataStore.options[
                //     field.getOptionsAt as keyof typeof dataStore
                //   ] ?? [];
                // options = value;
                // options.forEach((option) => {
                //   sources.push({
                //     id: option.value,
                //     label: sourceLabel,
                //     type: 'system'
                //   });
                // });
              }

              if (fieldsThatSupportLabelAsSafeHtml.includes(field.type)) {
                field = {
                  ...field,
                  labelAsSafeHtml: markdownToSafeHTMLClient(field.label ?? '')
                };
              }
              const numOptions = options?.length ?? 0;
              const firstOptionInput =
                field.optionsInputs?.[
                  options?.[0]?.value as keyof typeof field.optionsInputs
                ];
              const doesFirstOptionHaveInput = !!firstOptionInput;
              // If there is only one option and it doesn't have an input required, we don't show the Field for it.
              // Because booker doesn't see this in UI, there is no point showing it in FormBuilder to configure it.
              if (
                field.hideWhenJustOneOption &&
                numOptions <= 1 &&
                !doesFirstOptionHaveInput
              ) {
                return null;
              }

              const fieldType = fieldTypesConfigMap[field.type];
              const isFieldEditableSystemButOptional =
                field.editable === 'system-but-optional';
              const isFieldEditableSystemButHidden =
                field.editable === 'system-but-hidden';
              const isFieldEditableSystem = field.editable === 'system';
              const isUserField =
                !isFieldEditableSystem &&
                !isFieldEditableSystemButOptional &&
                !isFieldEditableSystemButHidden;

              if (!fieldType) {
                throw new Error(`Invalid field type - ${field.type}`);
              }
              const groupedBySourceLabel = sources.reduce(
                (groupBy, source) => {
                  const item = groupBy[source.label] || [];
                  if (source.type === 'user' || source.type === 'default') {
                    return groupBy;
                  }
                  item.push(source);
                  groupBy[source.label] = item;
                  return groupBy;
                },
                {} as Record<string, NonNullable<(typeof field)['sources']>>
              );

              return (
                <li
                  key={field.name}
                  data-testid={`field-${field.name}`}
                  className="hover:bg-weak-50 group relative flex items-center justify-between py-4 transition"
                >
                  <div>
                    <div className="flex flex-col lg:flex-row lg:items-center">
                      <div className="text-text-strong-950 text-label-sm ltr:mr-2 rtl:ml-2">
                        <FieldLabel field={field} />
                      </div>
                      <div className="flex items-center space-x-2">
                        {field.hidden ? (
                          // Hidden field can't be required, so we don't need to show the Optional badge
                          <Badge.Root color="gray" size="medium">
                            {t('hidden')}
                          </Badge.Root>
                        ) : (
                          <Badge.Root
                            color="gray"
                            size="medium"
                            data-testid={isRequired ? 'required' : 'optional'}
                          >
                            {isRequired ? t('required') : t('optional')}
                          </Badge.Root>
                        )}
                        {Object.entries(groupedBySourceLabel).map(
                          ([sourceLabel, sources], key) => (
                            // We don't know how to pluralize `sourceLabel` because it can be anything
                            <Badge.Root key={key} color="gray" size="medium">
                              {sources.length}{' '}
                              {sources.length === 1
                                ? sourceLabel
                                : `${sourceLabel}s`}
                            </Badge.Root>
                          )
                        )}
                      </div>
                    </div>
                    <p className="text-text-soft-400 text-paragraph-sm max-w-[280px] break-words pt-1 sm:max-w-[500px]">
                      {fieldType.label}
                    </p>
                  </div>
                  {field.editable !== 'user-readonly' && !disabled && (
                    <div className="flex items-center space-x-2">
                      {!isFieldEditableSystem &&
                        !isFieldEditableSystemButHidden &&
                        !disabled && (
                          // <Tooltip.Root>
                          //   <Tooltip.Trigger>
                          <Switch.Root
                            data-testid="toggle-field"
                            disabled={isFieldEditableSystem}
                            checked={!field.hidden}
                            onCheckedChange={(checked) => {
                              update(index, {...field, hidden: !checked});
                            }}
                          />
                          //   </Tooltip.Trigger>
                          //   <Tooltip.Content size="small">
                          //     {t('show_on_booking_page')}
                          //   </Tooltip.Content>
                          // </Tooltip.Root>
                        )}
                      {isUserField && (
                        <Button.Root
                          data-testid="delete-field-action"
                          variant="error"
                          mode="stroke"
                          disabled={!isUserField}
                          onClick={() => {
                            removeField(index);
                          }}
                        >
                          <Button.Icon as={RiDeleteBinLine} />
                        </Button.Root>
                      )}
                      <Button.Root
                        data-testid="edit-field-action"
                        variant="neutral"
                        mode="ghost"
                        onClick={() => {
                          editField(index, field);
                        }}
                        className="text-label-sm"
                      >
                        {t('edit')}
                      </Button.Root>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
          {/* {!disabled && (
            <FancyButton.Root
              variant="neutral"
              data-testid="add-field"
              onClick={addField}
              className="mt-4"
            >
              <Button.Icon as={RiAddLine} />
              {addFieldLabel}
            </FancyButton.Root> 
          )} */}
        </div>
        {/* Move this Dialog in another component and it would take with it fieldForm */}
        {fieldDialog.isOpen && (
          <FieldEditDialog
            dialog={fieldDialog}
            onOpenChange={(isOpen) =>
              setFieldDialog({
                isOpen,
                fieldIndex: -1,
                data: null
              })
            }
            handleSubmit={(
              data: Parameters<SubmitHandler<RhfFormField>>[0]
            ) => {
              const type = data.type || 'text';
              const isNewField = !fieldDialog.data;
              if (isNewField && fields.some((f) => f.name === data.name)) {
                notification({
                  title: t('form_builder_field_already_exists'),
                  variant: 'stroke',
                  id: 'schedule_updated_error',
                  status: 'error'
                });
                return;
              }
              if (fieldDialog.data) {
                update(fieldDialog.fieldIndex, data);
              } else {
                const field: RhfFormField = {
                  ...data,
                  type,
                  sources: [
                    {
                      label: 'User',
                      type: 'user',
                      id: 'user',
                      fieldRequired: data.required
                    }
                  ]
                };
                field.editable = field.editable || 'user';
                append(field);
              }
              setFieldDialog({
                isOpen: false,
                fieldIndex: -1,
                data: null
              });
            }}
            shouldConsiderRequired={shouldConsiderRequired}
          />
        )}
      </div>
    </>
  );
};

function Options({
  label = 'Options',
  value,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = () => {},
  className = '',
  readOnly = false
}: {
  label?: string;
  value: {label: string; value: string}[];
  onChange?: (value: {label: string; value: string}[]) => void;
  className?: string;
  readOnly?: boolean;
}) {
  const [animationRef] = useAutoAnimate<HTMLUListElement>();
  if (!value) {
    onChange([
      {
        label: 'Option 1',
        value: 'Option 1'
      },
      {
        label: 'Option 2',
        value: 'Option 2'
      }
    ]);
  }
  return (
    <div className={className}>
      <Label.Root className="mb-1">{label}</Label.Root>
      <div className="bg-muted rounded-md p-4">
        <ul ref={animationRef} className="space-y-1">
          {value?.map((option, index) => (
            <li key={index}>
              <div className="flex items-center">
                <Input.Root>
                  <Input.Input
                    required
                    value={option.label}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      // Right now we use label of the option as the value of the option. It allows us to not separately lookup the optionId to know the optionValue
                      // It has the same drawback that if the label is changed, the value of the option will change. It is not a big deal for now.
                      value.splice(index, 1, {
                        label: e.target.value,
                        value: e.target.value.trim()
                      });
                      onChange(value);
                    }}
                    readOnly={readOnly}
                    placeholder={`Enter Option ${index + 1}`}
                  />
                </Input.Root>

                {value.length > 2 && !readOnly && (
                  <Button.Root
                    type="button"
                    className="-ml-8 mb-2 hover:!bg-transparent focus:!bg-transparent focus:!outline-none focus:!ring-0"
                    size="small"
                    color="minimal"
                    variant="neutral"
                    mode="stroke"
                    onClick={() => {
                      if (!value) {
                        return;
                      }
                      const newOptions = [...value];
                      newOptions.splice(index, 1);
                      onChange(newOptions);
                    }}
                  >
                    <Button.Icon as={RiCloseLine} />
                  </Button.Root>
                )}
              </div>
            </li>
          ))}
        </ul>
        {!readOnly && (
          <Button.Root
            color="minimal"
            variant="neutral"
            mode="stroke"
            onClick={() => {
              value.push({label: '', value: ''});
              onChange(value);
            }}
          >
            <Button.Icon as={RiAddLine} />
            Add an Option
          </Button.Root>
        )}
      </div>
    </div>
  );
}

const CheckboxFieldLabel = ({
  fieldForm
}: {
  fieldForm: UseFormReturn<RhfFormField>;
}) => {
  const {t} = useLocale();
  const [firstRender, setFirstRender] = useState(true);
  return (
    <div className="mt-6">
      <Label.Root className="mb-1">{t('label')}</Label.Root>
      <Editor
        getText={() => md.render(fieldForm.getValues('label') || '')}
        setText={(value: string) => {
          fieldForm.setValue('label', turndown(value), {shouldDirty: true});
        }}
        firstRender={firstRender}
        setFirstRender={setFirstRender}
        placeholder={t(fieldForm.getValues('defaultLabel') || '')}
      />
    </div>
  );
};

function FieldEditDialog({
  dialog,
  onOpenChange,
  handleSubmit,
  shouldConsiderRequired
}: {
  dialog: {isOpen: boolean; fieldIndex: number; data: RhfFormField | null};
  onOpenChange: (isOpen: boolean) => void;
  handleSubmit: SubmitHandler<RhfFormField>;
  shouldConsiderRequired?: (field: RhfFormField) => boolean | undefined;
}) {
  const {t} = useLocale();
  const fieldForm = useForm<RhfFormField>({
    defaultValues: dialog.data || {}
    // resolver: zodResolver(fieldSchema),
  });
  const formFieldType = fieldForm.getValues('type');

  useEffect(() => {
    if (!formFieldType) {
      return;
    }

    const variantsConfig = getVariantsConfig({
      type: formFieldType,
      variantsConfig: fieldForm.getValues('variantsConfig')
    });

    // We need to set the variantsConfig in the RHF instead of using a derived value because RHF won't have the variantConfig for the variant that's not rendered yet.
    fieldForm.setValue('variantsConfig', variantsConfig);
  }, [fieldForm]);

  const isFieldEditMode = !!dialog.data;
  const fieldType = getCurrentFieldType(fieldForm);

  const variantsConfig = fieldForm.watch('variantsConfig');

  const fieldTypes = Object.values(fieldTypesConfigMap);

  return (
    <Dialog open={dialog.isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        data-testid="edit-field-dialog"
        // forceOverlayWhenNoModal={true}
        className="max-w-lg"
      >
        <Form id="form-builder" form={fieldForm} handleSubmit={handleSubmit}>
          {/* <div className="h-auto max-h-[85vh] overflow-auto px-8 pb-7 pt-8"> */}
          <DialogHeader
            title={t('add_a_booking_question')}
            description={t('booking_questions_description')}
          />
          <DialogBody>
            <Label.Root className="mb-1">{t('input_type')}</Label.Root>
            <Select.Root
              defaultValue={fieldTypesConfigMap.text.value}
              // data-testid="test-field-type"
              // id="test-field-type"
              disabled={
                fieldForm.getValues('editable') === 'system' ||
                fieldForm.getValues('editable') === 'system-but-optional'
              }
              onValueChange={(value: FieldType) => {
                if (!value) {
                  return;
                }
                fieldForm.setValue('type', value, {shouldDirty: true});
              }}
              // value={fieldTypesConfigMap[formFieldType].value}
              // options={fieldTypes.filter((f) => !f.systemOnly)}
              // label={t('input_type')}
            >
              <Select.Trigger id="field-type">
                <Select.Value placeholder="Selecione um tipo do campo"></Select.Value>
              </Select.Trigger>
              <Select.Content>
                {fieldTypes
                  .filter((f) => !f.systemOnly)
                  .map((opt) => (
                    <Select.Item key={opt.value} value={opt.value}>
                      {opt.label}
                    </Select.Item>
                  ))}
              </Select.Content>
            </Select.Root>
            {(() => {
              if (!variantsConfig) {
                return (
                  <>
                    <InputField
                      required
                      {...fieldForm.register('name')}
                      containerClassName="mt-6"
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        fieldForm.setValue(
                          'name',
                          getFieldIdentifier(e.target.value || ''),
                          {
                            shouldDirty: true
                          }
                        );
                      }}
                      disabled={
                        fieldForm.getValues('editable') === 'system' ||
                        fieldForm.getValues('editable') ===
                          'system-but-optional'
                      }
                      label={t('identifier')}
                    />
                    <CheckboxField
                      description={t('disable_input_if_prefilled')}
                      {...fieldForm.register('disableOnPrefill', {
                        setValueAs: Boolean
                      })}
                    />
                    <div>
                      {formFieldType === 'boolean' ? (
                        <CheckboxFieldLabel fieldForm={fieldForm} />
                      ) : (
                        <InputField
                          {...fieldForm.register('label')}
                          // System fields have a defaultLabel, so there a label is not required
                          required={
                            !['system', 'system-but-optional'].includes(
                              fieldForm.getValues('editable') || ''
                            )
                          }
                          placeholder={t(
                            fieldForm.getValues('defaultLabel') || ''
                          )}
                          containerClassName="mt-6"
                          label={t('label')}
                        />
                      )}
                    </div>

                    {fieldType?.isTextType ? (
                      <InputField
                        {...fieldForm.register('placeholder')}
                        containerClassName="mt-6"
                        label={t('placeholder')}
                        placeholder={t(
                          fieldForm.getValues('defaultPlaceholder') || ''
                        )}
                      />
                    ) : null}
                    {fieldType?.needsOptions &&
                    !fieldForm.getValues('getOptionsAt') ? (
                      <Controller
                        name="options"
                        render={({field: {value, onChange}}) => {
                          return (
                            <Options
                              onChange={onChange}
                              value={value}
                              className="mt-6"
                            />
                          );
                        }}
                      />
                    ) : null}

                    {!!fieldType?.supportsLengthCheck ? (
                      <FieldWithLengthCheckSupport
                        containerClassName="mt-6"
                        fieldForm={fieldForm}
                      />
                    ) : null}

                    <Controller
                      name="required"
                      control={fieldForm.control}
                      render={({field: {value, onChange}}) => {
                        const isRequired = shouldConsiderRequired
                          ? shouldConsiderRequired(fieldForm.getValues())
                          : value;
                        return (
                          <BooleanToggleGroupField
                            data-testid="field-required"
                            disabled={
                              fieldForm.getValues('editable') === 'system'
                            }
                            value={isRequired}
                            onValueChange={(val: boolean) => {
                              onChange(val);
                            }}
                            label={t('required')}
                          />
                        );
                      }}
                    />
                  </>
                );
              }

              if (!fieldType.isTextType) {
                throw new Error(
                  'Variants are currently supported only with text type'
                );
              }

              return (
                <VariantFields
                  variantsConfig={variantsConfig}
                  fieldForm={fieldForm}
                />
              );
            })()}
          </DialogBody>

          <DialogFooter className="relative rounded px-8">
            <DialogClose color="secondary">{t('cancel')}</DialogClose>
            <Button.Root data-testid="field-add-save" type="submit">
              {isFieldEditMode ? t('save') : t('add')}
            </Button.Root>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

function FieldWithLengthCheckSupport({
  fieldForm,
  containerClassName = '',
  className,
  ...rest
}: {
  fieldForm: UseFormReturn<RhfFormField>;
  containerClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  const {t} = useLocale();
  const fieldType = getCurrentFieldType(fieldForm);
  if (!fieldType.supportsLengthCheck) {
    return null;
  }
  const supportsLengthCheck = fieldType.supportsLengthCheck;
  const maxAllowedMaxLength = supportsLengthCheck.maxLength;

  return (
    <div className={classNames('grid grid-cols-2 gap-4', className)} {...rest}>
      <InputField
        {...fieldForm.register('minLength', {
          valueAsNumber: true
        })}
        defaultValue={0}
        containerClassName={containerClassName}
        label={t('min_characters')}
        type="number"
        onChange={(e) => {
          fieldForm.setValue('minLength', parseInt(e.target.value ?? 0));
          // Ensure that maxLength field adjusts its restrictions
          fieldForm.trigger('maxLength');
        }}
        min={0}
        max={fieldForm.getValues('maxLength') || maxAllowedMaxLength}
      />
      <InputField
        {...fieldForm.register('maxLength', {
          valueAsNumber: true
        })}
        defaultValue={maxAllowedMaxLength}
        containerClassName={containerClassName}
        label={t('max_characters')}
        type="number"
        onChange={(e) => {
          if (!supportsLengthCheck) {
            return;
          }
          fieldForm.setValue(
            'maxLength',
            parseInt(e.target.value ?? maxAllowedMaxLength)
          );
          // Ensure that minLength field adjusts its restrictions
          fieldForm.trigger('minLength');
        }}
        min={fieldForm.getValues('minLength') || 0}
        max={maxAllowedMaxLength}
      />
    </div>
  );
}

/**
 * Shows the label of the field, taking into account the current variant selected
 */
function FieldLabel({field}: {field: RhfFormField}) {
  const {t} = useLocale();
  const fieldTypeConfig = fieldTypesConfigMap[field.type];
  const fieldTypeConfigVariantsConfig = fieldTypeConfig?.variantsConfig;
  const fieldTypeConfigVariants = fieldTypeConfigVariantsConfig?.variants;
  const variantsConfig = field.variantsConfig;
  const variantsConfigVariants = variantsConfig?.variants;
  const defaultVariant = fieldTypeConfigVariantsConfig?.defaultVariant;
  if (!fieldTypeConfigVariants || !variantsConfig) {
    if (fieldsThatSupportLabelAsSafeHtml.includes(field.type)) {
      return (
        <label
          className="text-text-strong-950 text-label-sm "
          dangerouslySetInnerHTML={{
            // Derive from field.label because label might change in b/w and field.labelAsSafeHtml will not be updated.
            __html:
              markdownToSafeHTMLClient(field.label || '') ||
              t(field.defaultLabel || '')
          }}
        />
      );
    } else {
      return (
        <label className="text-text-strong-950 text-label-sm ">
          {field.label || t(field.defaultLabel || '')}
        </label>
      );
    }
  }
  const variant = field.variant || defaultVariant;
  if (!variant) {
    throw new Error(
      `Field has \`variantsConfig\` but no \`defaultVariant\`${JSON.stringify(fieldTypeConfigVariantsConfig)}`
    );
  }
  const label =
    variantsConfigVariants?.[variant as keyof typeof fieldTypeConfigVariants]
      ?.fields?.[0]?.label || '';

  return (
    <label className="text-text-strong-950 text-label-sm ">{t(label)}</label>
  );
}

function VariantSelector() {
  // Implement a Variant selector for cases when there are more than 2 variants
  return null;
}

function VariantFields({
  fieldForm,
  variantsConfig
}: {
  fieldForm: UseFormReturn<RhfFormField>;
  variantsConfig: RhfFormField['variantsConfig'];
}) {
  const {t} = useLocale();
  if (!variantsConfig) {
    throw new Error('VariantFields component needs variantsConfig');
  }
  const fieldTypeConfigVariantsConfig =
    fieldTypesConfigMap[fieldForm.getValues('type')]?.variantsConfig;

  if (!fieldTypeConfigVariantsConfig) {
    throw new Error(
      "Coniguration Issue: FieldType doesn't have `variantsConfig`"
    );
  }

  const variantToggleLabel = t(fieldTypeConfigVariantsConfig.toggleLabel || '');

  const defaultVariant = fieldTypeConfigVariantsConfig.defaultVariant;

  const variantNames = Object.keys(variantsConfig.variants);
  const otherVariants = variantNames.filter((v) => v !== defaultVariant);
  if (otherVariants.length > 1 && variantToggleLabel) {
    throw new Error('More than one other variant. Remove toggleLabel ');
  }
  const otherVariant = otherVariants[0];
  const variantName = fieldForm.watch('variant') || defaultVariant;
  const variantFields =
    variantsConfig.variants[variantName as keyof typeof variantsConfig].fields;
  /**
   * A variant that has just one field can be shown in a simpler way in UI.
   */
  const isSimpleVariant = variantFields.length === 1;
  const isDefaultVariant = variantName === defaultVariant;
  const supportsVariantToggle = variantNames.length === 2;
  return (
    <>
      {/* {supportsVariantToggle ? (
        <Tooltip.Root>
          <Tooltip.Trigger>
            <Label.Root>{variantToggleLabel}</Label.Root>
            <Switch.Root
              checked={!isDefaultVariant}
              // label={variantToggleLabel}
              data-testid="variant-toggle"
              onCheckedChange={(checked) => {
                fieldForm.setValue(
                  'variant',
                  checked ? otherVariant : defaultVariant
                );
              }}
              // classNames={{
              //   container: 'p-2 mt-2 sm:hover:bg-muted rounded transition'
              // }}
            />
          </Tooltip.Trigger>
          <Tooltip.Content size="small">{t('Toggle Variant')}</Tooltip.Content>
        </Tooltip.Root>
      ) : ( */}
        <VariantSelector />
      {/* )} */}

      <InputField
        required
        {...fieldForm.register('name')}
        containerClassName="mt-6"
        disabled={
          fieldForm.getValues('editable') === 'system' ||
          fieldForm.getValues('editable') === 'system-but-optional'
        }
        label={t('identifier')}
      />

      <CheckboxField
        description={t('disable_input_if_prefilled')}
        {...fieldForm.register('disableOnPrefill', {setValueAs: Boolean})}
      />

      <ul
        className={classNames(
          !isSimpleVariant
            ? 'border-subtle divide-subtle mt-2 divide-y rounded-md border'
            : ''
        )}
      >
        {variantFields.map((f, index) => {
          const rhfVariantFieldPrefix =
            `variantsConfig.variants.${variantName}.fields.${index}` as const;
          const fieldTypeConfigVariants =
            fieldTypeConfigVariantsConfig.variants[
              variantName as keyof typeof fieldTypeConfigVariantsConfig.variants
            ];
          const appUiFieldConfig =
            fieldTypeConfigVariants.fieldsMap[
              f.name as keyof typeof fieldTypeConfigVariants.fieldsMap
            ];
          return (
            <li
              className={classNames(!isSimpleVariant ? 'p-4' : '')}
              key={f.name}
            >
              {!isSimpleVariant && (
                <Label.Root className="flex justify-between">
                  <span>{`Field ${index + 1}`}</span>
                  <span className="text-muted">{`${fieldForm.getValues('name')}.${f.name}`}</span>
                </Label.Root>
              )}
              <InputField
                {...fieldForm.register(`${rhfVariantFieldPrefix}.label`)}
                value={
                  fieldForm.getValues('editable') === 'system'
                    ? t(f.label || '')
                    : f.label || ''
                }
                placeholder={t(appUiFieldConfig?.defaultLabel || '')}
                containerClassName="mt-6"
                label={t('label')}
                disabled={fieldForm.getValues('editable') === 'system'}
              />
              <InputField
                {...fieldForm.register(`${rhfVariantFieldPrefix}.placeholder`)}
                key={f.name}
                value={f.placeholder || ''}
                containerClassName="mt-6"
                label={t('placeholder')}
                placeholder={t(appUiFieldConfig?.defaultPlaceholder || '')}
              />

              <Controller
                name={`${rhfVariantFieldPrefix}.required`}
                control={fieldForm.control}
                render={({field: {onChange}}) => {
                  return (
                    <BooleanToggleGroupField
                      data-testid="field-required"
                      disabled={!appUiFieldConfig?.canChangeRequirability}
                      value={f.required}
                      onValueChange={(val) => {
                        onChange(val);
                      }}
                      label={t('required')}
                    />
                  );
                }}
              />
            </li>
          );
        })}
      </ul>
    </>
  );
}
