"use client";

import { useState, useEffect } from "react";
import { useLocalStorage } from "usehooks-ts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";

const DEFAULT_POLICY = `예약 가능한 시간: 평일 09:00-18:00
예약 최소 시간: 1시간
예약 최대 시간: 4시간
예약 가능한 인원: 1-10명
예약 취소 가능 시간: 예약 시간 2시간 전까지`;

interface ReservationPolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReservationPolicyDialog({
  open,
  onOpenChange,
}: ReservationPolicyDialogProps) {
  const [localStoragePolicy, setLocalStoragePolicy] = useLocalStorage(
    "reservationPolicy",
    ""
  );
  const [policy, setPolicy] = useState("");

  useEffect(() => {
    setPolicy(localStoragePolicy || DEFAULT_POLICY);
  }, [localStoragePolicy, open]);

  const handleSave = () => {
    setLocalStoragePolicy(policy);
    onOpenChange(false);
  };

  const handleReset = () => {
    setPolicy(DEFAULT_POLICY);
    setLocalStoragePolicy(DEFAULT_POLICY);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>예약정책 설정</DialogTitle>
          <DialogDescription>
            예약봇이 따라야 할 예약정책을 입력하세요. 설정하지 않을 경우 기본정책을
            사용합니다.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            placeholder="예약정책을 입력하세요..."
            className="min-h-[200px] resize-none"
          />
        </div>
        <DialogFooter className="flex-row justify-between sm:justify-between">
          <Button variant="outline" onClick={handleReset}>
            기본값으로 초기화
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              취소
            </Button>
            <Button onClick={handleSave}>저장</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

