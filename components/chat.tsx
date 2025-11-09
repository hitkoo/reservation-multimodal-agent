"use client";

import { PreviewMessage, ThinkingMessage } from "@/components/message";
import { MultimodalInput } from "@/components/multimodal-input";
import { Overview } from "@/components/overview";
import { useScrollToBottom } from "@/hooks/use-scroll-to-bottom";
import { useChat, type CreateUIMessage, type UIMessage } from "@ai-sdk/react";
import { toast } from "sonner";
import React from "react";
import { useLocalStorage } from "usehooks-ts";

const DEFAULT_POLICY = `예약 가능한 시간: 평일 09:00-18:00
예약 최소 시간: 1시간
예약 최대 시간: 4시간
예약 가능한 인원: 1-10명
예약 취소 가능 시간: 예약 시간 2시간 전까지`;

const SYSTEM_ROLE_PROMPT = `당신은 예약 관리 전문 어시스턴트입니다. 사용자의 예약 요청을 도와주고, 예약정책에 따라 예약을 처리합니다.

주요 역할:
- 사용자의 예약 요청을 정확히 이해하고 처리합니다
- 예약정책에 따라 예약 가능 여부를 확인합니다
- 예약 정보를 명확하게 안내합니다
- 예약 변경 및 취소를 도와줍니다
- 친절하고 전문적인 톤으로 대화합니다`;

function buildSystemPrompt(reservationPolicy: string): string {
  const policy = reservationPolicy || DEFAULT_POLICY;
  return `${SYSTEM_ROLE_PROMPT}

예약정책:
${policy}

위 예약정책을 반드시 준수하여 예약을 처리하세요.`;
}

export function Chat() {
  const chatId = "001";
  const [reservationPolicy] = useLocalStorage("reservationPolicy", "");

  const systemPrompt = React.useMemo(
    () => buildSystemPrompt(reservationPolicy),
    [reservationPolicy]
  );

  const { messages, setMessages, sendMessage, status, stop } = useChat({
    id: chatId,
    fetch: async (input: RequestInfo | URL, init?: RequestInit) => {
      const body = init?.body ? JSON.parse(init.body as string) : {};
      body.systemPrompt = systemPrompt;
      return fetch(input, {
        ...init,
        body: JSON.stringify(body),
      });
    },
    onError: (error: Error) => {
      if (error.message.includes("Too many requests")) {
        toast.error(
          "You are sending too many messages. Please try again later."
        );
      }
    },
  } as any);

  const [messagesContainerRef, messagesEndRef] =
    useScrollToBottom<HTMLDivElement>();

  const [input, setInput] = React.useState("");

  const isLoading = status === "submitted" || status === "streaming";

  const handleSubmit = (event?: { preventDefault?: () => void }) => {
    event?.preventDefault?.();
    if (input.trim()) {
      sendMessage({ text: input });
      setInput("");
    }
  };

  return (
    <div className="flex flex-col min-w-0 h-[calc(100dvh-52px)] bg-background">
      <div
        ref={messagesContainerRef}
        className="flex flex-col min-w-0 gap-6 flex-1 overflow-y-scroll pt-4"
      >
        {messages.length === 0 && <Overview />}

        {messages.map((message: UIMessage, index: number) => (
          <PreviewMessage
            key={message.id}
            chatId={chatId}
            message={message}
            isLoading={isLoading && messages.length - 1 === index}
          />
        ))}

        {isLoading &&
          messages.length > 0 &&
          messages[messages.length - 1].role === "user" && <ThinkingMessage />}

        <div
          ref={messagesEndRef}
          className="shrink-0 min-w-[24px] min-h-[24px]"
        />
      </div>

      <form className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl">
        <MultimodalInput
          chatId={chatId}
          input={input}
          setInput={setInput}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          stop={stop}
          messages={messages}
          setMessages={setMessages}
          sendMessage={sendMessage}
        />
      </form>
    </div>
  );
}
