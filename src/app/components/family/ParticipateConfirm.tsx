'use client';

import React, { useEffect } from 'react';
import Text from '@component/common/Text';
import Button from '@component/common/Button';
import { useRouter } from 'next/navigation';

const ParticipateConfirm = () => {
  const { back } = useRouter();

  useEffect(() => {
    window.addEventListener('hashchange', back);
    return () => window.removeEventListener('hashchange', back);
  }, []);

  return (
    <div className="h-full flex flex-col">
      <section className="pt-[74px] flex flex-col h-full gap-y-[5px] px-7">
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
