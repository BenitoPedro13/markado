import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { useLocale } from "@/hooks/use-locale";
import * as Button from "@/components/align-ui/ui/button";
import * as Modal from "@/components/align-ui/ui/modal";
import * as Input from "@/components/align-ui/ui/input";
import { useNotification } from "@/hooks/use-notification";
import { RiAddLine } from "@remixicon/react";
import { useTRPC } from "@/utils/trpc";
import { useMutation } from "@tanstack/react-query";
import { getQueryClient } from "@/app/get-query-client";

export function NewScheduleButton({
  name = "new-schedule",
  fromEventType,
}: {
  name?: string;
  fromEventType?: boolean;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const { t } = useLocale('Schedules');
  const { notification } = useNotification();
  const queryClient = getQueryClient();

  const form = useForm<{
    name: string;
  }>();
  const { register } = form;

  const createMutation = useMutation(trpc.schedule.create.mutationOptions({
    onSuccess: async (data: { id: number; name: string }) => {
      router.push(`/availability/${data.id}${fromEventType ? "?fromEventType=true" : ""}`);
      notification({
        title: t("schedule_created_successfully", { scheduleName: data.name }),
        status: "success",
      });
      queryClient.invalidateQueries({ queryKey: trpc.schedule.getAll.queryKey() });
    },
    onError: (err) => {
      const message = err.message || t("error_creating_schedule");
      notification({
        title: message,
        status: "error",
      });
    },
  }));

  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <Button.Root
          variant="primary"
          mode="filled"
          size="medium"
          data-testid={name}
        >
          <Button.Icon as={RiAddLine} />
          {t('new_schedule')}
        </Button.Root>
      </Modal.Trigger>
      <Modal.Content title={t('new_schedule')}>
        <form
          onSubmit={form.handleSubmit((values) => {
            createMutation.mutate(values);
          })}
        >
          <div className="space-y-4 p-5">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-label-sm text-text-strong-950"
              >
                {t('schedule_name')}
              </label>
              <Input.Root>
                <Input.Wrapper>
                  <Input.Input
                    id="name"
                    type="text"
                    required
                    placeholder={t('schedule_name_placeholder')}
                    {...register('name')}
                  />
                </Input.Wrapper>
              </Input.Root>
            </div>
          </div>
          <Modal.Footer>
            <Modal.Close asChild>
              <Button.Root variant="neutral" mode="stroke" size="medium">
                {t('cancel')}
              </Button.Root>
            </Modal.Close>
            <Button.Root
              type="submit"
              variant="primary"
              mode="filled"
              size="medium"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? t('loading') : t('create')}
            </Button.Root>
          </Modal.Footer>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
