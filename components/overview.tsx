import { motion } from "framer-motion";

export const Overview = () => {
  return (
    <motion.div
      key="overview"
      className="max-w-3xl mx-auto md:mt-20"
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ delay: 0.5 }}
    >
      <div className="rounded-xl p-6 flex flex-col gap-8 leading-relaxed text-center max-w-xl">
        <p className="flex flex-col justify-center gap-4 items-center">
          <p>인공지능입문 강의 연구를 위한 예약봇 데모 사이트입니다.</p>
          <p>
            좌측 상단 예약정책 버튼을 클릭하면 예약정책을 입력할 수 있습니다.
          </p>
          <p>
            예약정책은 로컬스토리지에 저장되며, 설정하지 않을 경우 기본정책을
            사용합니다.
          </p>
          <p>
            예약정책을 설정한 뒤 예약봇과의 채팅을 통해 예약을 진행할 수
            있습니다.
          </p>
        </p>
      </div>
    </motion.div>
  );
};
