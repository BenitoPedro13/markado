// import { Icon } from "@/ui";
// import { SatSymbol } from "@/ui/components/icon/SatSymbol";
import {RiTicketLine} from '@remixicon/react';

export function PriceIcon(props: { currency: string; className?: string }) {
  const { className, currency } = props;
  // if (currency !== "BTC") 
    // return <Icon name="credit-card" className={className} />;
  return <RiTicketLine size={20} color="var(--text-sub-600)" />;
  
  // return <SatSymbol className={className} />;
}
