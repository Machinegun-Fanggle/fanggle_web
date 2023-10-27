import React from 'react';
import Text from '@component/common/Text';
import Button from '@component/common/Button';

const ParticipateConfirm = () => {
  return (
    <div className="h-full">
      <section className="pt-[131px] flex flex-col h-full gap-y-[5px]">
        <Text weight="bold" color="purple" className="text-[24px]">
          하하호호 따르릉
        </Text>
        <Text>가족에 참여할까요?</Text>
      </section>

      <section className="pb-[69px] flex justify-center">
        <Button variant="blue" className="w-[300px]">
          네 참여할게요!
        </Button>
      </section>
    </div>
  );
};

export default ParticipateConfirm;
