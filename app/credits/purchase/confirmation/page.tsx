"use client";

import { Suspense, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CreditConfirmation } from "@/components/organisms/CreditConfirmation/CreditConfirmation";
import { Text } from "@/components/atoms/Text";
import type { CreditSelectionState } from "@/lib/types/carbon";
import type { NetworkType } from "@/lib/types/wallet";

function ConfirmationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selection, setSelection] = useState<CreditSelectionState | null>(null);
  const [transactionHash, setTransactionHash] = useState<string | null>(null);
  const [network, setNetwork] = useState<NetworkType | null>(null);

  useEffect(() => {
    const selectionParam = searchParams.get("selection");
    const hashParam = searchParams.get("hash");
    const networkParam = searchParams.get("network") as NetworkType | null;

    if (!selectionParam || !hashParam) {
      // Missing required parameters, redirect to purchase page
      router.push("/credits/purchase");
      return;
    }

    try {
      const parsed = JSON.parse(decodeURIComponent(selectionParam)) as CreditSelectionState;
      setSelection(parsed);
      setTransactionHash(hashParam);
      setNetwork(networkParam || "testnet");
    } catch (err) {
      console.error("Failed to parse confirmation data:", err);
      router.push("/credits/purchase");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  if (!selection || !transactionHash || !network) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center">
          <Text variant="h3" as="h2" className="mb-2">
            Loading...
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <CreditConfirmation
        selection={selection}
        transactionHash={transactionHash}
        network={network}
      />
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <Text variant="h3" as="h2" className="mb-2">
              Loading...
            </Text>
          </div>
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}
