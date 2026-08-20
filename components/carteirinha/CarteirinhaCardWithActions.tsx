"use client";

import { useRef } from "react";
import { CarteirinhaCard } from "@/components/carteirinha/CarteirinhaCard";
import { SalvarCarteirinhaButton } from "@/components/carteirinha/SalvarCarteirinhaButton";

type Props = React.ComponentProps<typeof CarteirinhaCard>;

export function CarteirinhaCardWithActions(props: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      <div ref={cardRef}>
        <CarteirinhaCard {...props} />
      </div>
      <SalvarCarteirinhaButton
        cardRef={cardRef}
        fileName={`carteirinha-${props.nome.toLowerCase().replace(/\s+/g, "-")}.png`}
      />
    </div>
  );
}
