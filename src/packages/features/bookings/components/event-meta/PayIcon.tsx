// import { Icon } from "@calcom/ui";
import {RiTicketLine} from '@remixicon/react';

export function PayIcon(props: { currency: string; className?: string }) {
  const { className, currency } = props;
  // return <Icon name={currency !== "BTC" ? "credit-card" : "zap"} className={className} />;
  return <RiTicketLine size={20} color="var(--text-sub-600)" />
}
