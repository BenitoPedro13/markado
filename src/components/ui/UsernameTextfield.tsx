import classNames from "classnames";
// eslint-disable-next-line no-restricted-imports
import { noop } from "lodash";
import { useSession } from "next-auth/react";
import type { ChangeEvent, RefCallback } from "react";
import { useEffect, useState } from "react";
import type { TRPCClientErrorLike } from "@trpc/client";
import type { AppRouter } from "~/trpc/server";
import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/utils/trpc";
import { fetchUsername } from "@/packages/lib/fetchUsername";
import { useDebounce } from "@/packages/lib/hooks/useDebounce";
import { useLocale } from "@/hooks/use-locale";
import { Root as Button } from "@/components/align-ui/ui/button";
import { TextField } from "@/components/align-ui/ui/text-field";
import * as Tooltip from "@/components/align-ui/ui/tooltip";
import * as Modal from "@/components/align-ui/ui/modal";
import { RiCheckLine } from "@remixicon/react";

interface ICustomUsernameProps {
  currentUsername: string | undefined;
  setCurrentUsername?: (newUsername: string) => void;
  inputUsernameValue: string | undefined;
  usernameRef: RefCallback<HTMLInputElement>;
  setInputUsernameValue: (value: string) => void;
  onSuccessMutation?: () => void;
  onErrorMutation?: (error: TRPCClientErrorLike<AppRouter>) => void;
}

const UsernameTextfield = (props: ICustomUsernameProps & Partial<React.ComponentProps<typeof TextField>>) => {
  const { t } = useLocale();
  const { update } = useSession();

  const {
    currentUsername,
    setCurrentUsername = noop,
    inputUsernameValue,
    setInputUsernameValue,
    usernameRef,
    onSuccessMutation,
    onErrorMutation,
    ...rest
  } = props;
  const [usernameIsAvailable, setUsernameIsAvailable] = useState(false);
  const [markAsError, setMarkAsError] = useState(false);
  const [openDialogSaveUsername, setOpenDialogSaveUsername] = useState(false);

  // debounce the username input, set the delay to 600ms to be consistent with signup form
  const debouncedUsername = useDebounce(inputUsernameValue, 600);

  useEffect(() => {
    async function checkUsername(username: string | undefined) {
      if (!username) {
        setUsernameIsAvailable(false);
        setMarkAsError(false);
        return;
      }

      if (currentUsername !== username) {
        const { data } = await fetchUsername(username, null);
        setMarkAsError(!data.available);
        setUsernameIsAvailable(data.available);
      } else {
        setUsernameIsAvailable(false);
      }
    }

    checkUsername(debouncedUsername);
  }, [debouncedUsername, currentUsername]);

  const trpc = useTRPC();
  const updateUsernameMutation = useMutation(
    trpc.profile.update.mutationOptions({
      onSuccess: async () => {
        onSuccessMutation && (await onSuccessMutation());
        setOpenDialogSaveUsername(false);
        setCurrentUsername(inputUsernameValue);
        await update({ username: inputUsernameValue });
      },
      onError: (error) => {
        onErrorMutation && onErrorMutation(error as TRPCClientErrorLike<AppRouter>);
      },
    })
  );

  // const updateUsernameMutation = trpc.viewer.updateProfile.useMutation({
  //   onSuccess: async () => {
  //     onSuccessMutation && (await onSuccessMutation());
  //     setOpenDialogSaveUsername(false);
  //     setCurrentUsername(inputUsernameValue);
  //     await update({ username: inputUsernameValue });
  //   },
  //   onError: (error) => {
  //     onErrorMutation && onErrorMutation(error);
  //   },
  // });

  const ActionButtons = () => {
    return usernameIsAvailable && currentUsername !== inputUsernameValue ? (
      <div className="relative bottom-[6px] me-2 ms-2 flex flex-row space-x-2">
        <Button
          type="button"
          onClick={
            // () => setOpenDialogSaveUsername(true)
            updateUsername
          }
          disabled={updateUsernameMutation.isPending}
          data-testid="update-username-btn"
          className="rounded-[10px]"
          variant="neutral"
          mode="filled">
          {t("update")}
        </Button>
        <Button
          type="button"
          onClick={() => {
            if (currentUsername) {
              setInputUsernameValue(currentUsername);
            }
          }}
          className="rounded-[10px]"
          variant="neutral"
          mode="ghost">
          {t("cancel")}
        </Button>
      </div>
    ) : (
      <></>
    );
  };

  const updateUsername = async () => {
    updateUsernameMutation.mutate({
      username: inputUsernameValue,
    });
  };

  return (
    <div>
      <div className="flex rounded-md">
        <div className="relative w-full">
          <TextField
            ref={usernameRef}
            name="username"
            value={inputUsernameValue}
            autoComplete="none"
            autoCapitalize="none"
            autoCorrect="none"
            className={classNames(
              "mb-0 mt-0 rounded-[10px] rounded-l-none",
              markAsError
                ? "focus:shadow-0 focus:ring-shadow-0 border-red-500 focus:border-red-500 focus:outline-none focus:ring-0"
                : ""
            )}
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
              event.preventDefault();
              setInputUsernameValue(event.target.value);
            }}
            data-testid="username-input"
            {...rest}
          />

          {currentUsername !== inputUsernameValue && (
            <div className="absolute right-[2px] top-6 flex h-7 flex-row">
              <span className={classNames("bg-white-0 mx-0 rounded-[10px] p-3")}>
                {usernameIsAvailable ? (
                  <RiCheckLine className="relative bottom-[6px] h-4 w-4" />
                ) : (
                  <></>
                )}
              </span>
            </div>
          )}
        </div>
        <div className="mt-7 hidden md:inline">
          <ActionButtons />
        </div>
      </div>
      {markAsError && <p className="mt-1 text-xs text-red-500">{t("username_already_taken")}</p>}

      {usernameIsAvailable && currentUsername !== inputUsernameValue && (
        <div className="mt-2 flex justify-end md:hidden">
          <ActionButtons />
        </div>
      )}
      <Modal.Root open={openDialogSaveUsername}>
        <Modal.Content>

          <p className="text-subtle">{t("current_username")}</p>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <p
                className="text-emphasis mt-1 max-w-md overflow-hidden text-ellipsis break-all"
                data-testid="current-username">
                {currentUsername}
              </p>
            </Tooltip.Trigger>
            <Tooltip.Content size="small">{currentUsername}</Tooltip.Content>
          </Tooltip.Root>
          <p className="text-subtle" data-testid="new-username">
            {t("new_username")}
          </p>
          <Tooltip.Root>
            <Tooltip.Trigger asChild>
              <p className="text-emphasis mt-1 max-w-md overflow-hidden text-ellipsis break-all">
                {inputUsernameValue}
              </p>
            </Tooltip.Trigger>
            <Tooltip.Content size="small">{inputUsernameValue}</Tooltip.Content>
          </Tooltip.Root>


          <Modal.Footer className="mt-4">
            <Button
              type="button"
              disabled={updateUsernameMutation.isPending}
              data-testid="save-username"
              onClick={updateUsername}
              variant="neutral"
              size="small"
              mode="filled">
              {t("save")}
            </Button>

            <Modal.Close asChild>
              <Button
                size="small"
                type="button"
                onClick={() => setOpenDialogSaveUsername(false)}
                variant="neutral"
                mode="ghost">
                {t("cancel")}
              </Button>
            </Modal.Close>
          </Modal.Footer>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
};

export { UsernameTextfield };
