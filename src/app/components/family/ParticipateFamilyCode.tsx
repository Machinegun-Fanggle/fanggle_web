'use client';

import React, { useState } from 'react';
import Text from '@component/common/Text';
import Button from '@component/common/Button';
import VerificationInput from 'react-verification-input';
import { TabProps } from '@component/family/ParticipateFamily';

const ParticipateFamilyCode = ({ setTab }: TabProps) => {
  const [verification, setVerification] = useState('');

  return (
    <div className="flex flex-col items-center h-full">
      <section className="w-full flex flex-col justify-center text-center items-center h-[100%] pb-[100px] gap-y-[19px]">
        <Text className="text-light">가족 코드를 입력해주세요!</Text>
        <VerificationInput
          length={6}
          classNames={{
            container: 'gap-x-[12px] max-h-[38px] ml-[12px]',
            character:
              'flex items-center justify-center font-pretendard text-default font-[10px] text-[18px] text-default !max-w-[38px] !max-h-[38px] bg-[#F2F2F2] rounded-lg border-none',
            characterInactive: 'bg-[#F2F2F2]',
          }}
          placeholder=""
          onChange={(value) => setVerification(value)}
          autoFocus
        />
      </section>
      <section className="pb-[69px]">
        <Button variant="blue" className="w-[300px]" onClick={() => setTab(1)}>
          참여하기
        </Button>
      </section>
    </div>
  );
};

export default ParticipateFamilyCode;
