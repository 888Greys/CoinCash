"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

type PaymentSuccessViewProps = {
  tradeId: string;
  redirectSeconds?: number;
};

export function PaymentSuccessView({ tradeId, redirectSeconds = 3 }: PaymentSuccessViewProps) {
  const router = useRouter();
  const [secondsLeft, setSecondsLeft] = useState(redirectSeconds);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          router.push(`/p2p/order/${tradeId}?view=chat`);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [router, tradeId]);

  return (
    <div className="mx-auto flex min-h-[70dvh] w-full max-w-md flex-col items-center justify-center px-4 py-8 text-center">
      <div className="w-full overflow-hidden rounded-2xl border border-outline-variant/20 bg-surface-container-low shadow-xl">
        <Image
          src="/asuccess.jpeg"
          alt="Payment sent successfully"
          width={900}
          height={1600}
          className="h-auto w-full"
          priority
        />
        <div className="space-y-3 px-4 py-5">
          <h2 className="font-headline text-xl font-bold text-primary">Payment Sent</h2>
          <p className="text-sm text-on-surface-variant">
            Your payment proof was submitted. Opening chat in {secondsLeft}s.
          </p>
          <div className="grid grid-cols-1 gap-2">
            <Link
              href={`/p2p/order/${tradeId}?view=chat`}
              className="inline-flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold uppercase tracking-wider text-on-primary"
            >
              Open Chat Now
            </Link>
            <Link
              href={`/p2p/order/${tradeId}`}
              className="inline-flex h-11 items-center justify-center rounded-lg border border-outline-variant/30 px-4 text-sm font-bold uppercase tracking-wider text-on-surface"
            >
              Stay on Trade
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
