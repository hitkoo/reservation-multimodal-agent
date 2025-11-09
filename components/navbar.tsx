"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { GitIcon, VercelIcon } from "./icons";
import { ReservationPolicyDialog } from "./reservation-policy-dialog";
import Link from "next/link";

export const Navbar = () => {
  const [isPolicyDialogOpen, setIsPolicyDialogOpen] = useState(false);

  return (
    <>
      <div className="p-2 flex flex-row gap-2 justify-between">
        <Button variant="outline" onClick={() => setIsPolicyDialogOpen(true)}>
          예약정책 설정
        </Button>

        <div className="flex gap-2">
          <Link href="https://github.com/hitkoo/reservation-multimodal-agent">
            <Button variant="outline">
              <GitIcon /> 소스코드
            </Button>
          </Link>
        </div>
      </div>
      <ReservationPolicyDialog
        open={isPolicyDialogOpen}
        onOpenChange={setIsPolicyDialogOpen}
      />
    </>
  );
};
