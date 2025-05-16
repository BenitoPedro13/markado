'use client';
import {useParams, useRouter} from 'next/navigation';
import {useEffect} from 'react';

export default function Error() {
  const router = useRouter();
  const {username, service} = useParams();

  useEffect(() => {
    router.push(`/${username}/${service}`);
  }, [router, username, service]);
}
