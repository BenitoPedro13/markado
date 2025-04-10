"use client"

import {useMutation, useQuery} from '@tanstack/react-query';
import {useTRPC} from '@/utils/trpc';

import Link from 'next/link';
import * as Button from '@/components/align-ui/ui/button';
import {RiGithubFill} from '@remixicon/react';

export function UserList() {
  const trpc = useTRPC();
  // Get all users
  const userList = useQuery(trpc.userList.queryOptions());
  // Get single user
  const singleUser = useQuery(trpc.getFirstUser.queryOptions());
  const userCreator = useMutation(
    trpc.createUser.mutationOptions({
      onSuccess: () => {
        // Invalidate and refetch the userList query
        userList.refetch();
        // Or if you want to invalidate multiple queries at once
        // trpc.queryClient.invalidateQueries({ queryKey: ['userList'] });
        // trpc.queryClient.invalidateQueries({ queryKey: ['getUser'] });
      }
    })
  );

  if (userList.isPending || singleUser.isPending) {
    return <div>Loading....</div>;
  }

  if (userList.isError || singleUser.isError) {
    return (
      <div>Error: {userList.error?.message || singleUser.error?.message}</div>
    );
  }

  return (
    <div>
      <h2>All Users:</h2>
      {userList.data?.map((user) => (
        <p key={user.id} className="">
          {user.name}
        </p>
      ))}

      <h2>Single User:</h2>
      <p className="">{singleUser.data?.name}</p>

      <button onClick={() => userCreator.mutate({name: 'Frodo'})}>
        Create Frodo
      </button>
    </div>
  );
}

export default function Home() {
  return (
    <div className="container mx-auto flex-1 px-5">
      {/* <UserList /> */}
      <div className="mt-48 flex flex-col items-center">
        <h1 className="max-w-3xl text-balance text-center text-title-h3 text-text-strong-950">
          Quick Starter AlignUI Template with Next.js & Typescript
        </h1>

        <div className="mt-6 flex gap-4">
          <Button.Root variant="neutral" asChild>
            <a
              href="https://github.com/alignui/alignui-nextjs-typescript-starter"
              target="_blank"
            >
              <Button.Icon as={RiGithubFill} />
              Give a star
            </a>
          </Button.Root>

          <Button.Root variant="neutral" mode="stroke" asChild>
            <Link href="https://alignui.com/docs" target="_blank">
              Read our docs
            </Link>
          </Button.Root>
        </div>

        <div className="mt-12">
          <h2 className="text-lg text-text-primary font-semibold">
            What&apos;s Included:
          </h2>
          <ul className="ml-6 mt-3 flex list-disc flex-col gap-2 font-mono text-paragraph-sm font-medium text-text-sub-600">
            <li>Tailwind setup with AlignUI tokens.</li>
            <li>
              Base components are stored in{' '}
              <code className="rounded bg-bg-weak-50 px-1 py-0.5 font-semibold text-text-strong-950">
                /components/ui
              </code>{' '}
              folder.
            </li>
            <li>
              Utils are stored in{' '}
              <code className="rounded bg-bg-weak-50 px-1 py-0.5 font-semibold text-text-strong-950">
                /utils
              </code>{' '}
              folder.
            </li>
            <li>
              Custom hooks are stored in{' '}
              <code className="rounded bg-bg-weak-50 px-1 py-0.5 font-semibold text-text-strong-950">
                /hooks
              </code>{' '}
              folder.
            </li>
            <li>Dark mode setup.</li>
            <li>Inter font setup.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}