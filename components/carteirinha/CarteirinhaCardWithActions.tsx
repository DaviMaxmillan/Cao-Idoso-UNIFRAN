"use client";

import { useRef } from "react";
import { CarteirinhaCard } from "@/components/carteirinha/CarteirinhaCard";
import { SaveShareButtons } from "@/components/carteirinha/SaveShareButtons";

type Props = Omit<
  React.ComponentProps<typeof CarteirinhaCard>,
  never
>;

export function CarteirinhaCardWithActions(props: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="space-y-6">
      <div ref={cardRef}>
        <CarteirinhaCard {...props} />
      </div>
      <SaveShareButtons
        cardRef={cardRef}
        fileName={`carteirinha-${props.nome.toLowerCase().replace(/\s+/g, "-")}.png`}
      />
    </div>
  );
}
