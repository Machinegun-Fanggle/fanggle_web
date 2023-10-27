'use client';

import ParticipateFamilyCode from '@component/family/ParticipateFamilyCode';
import FanggleF from '@svg/FanggleF';
import { Dispatch, SetStateAction, useState } from 'react';
import ParticipateConfirm from '@component/family/ParticipateConfirm';

// 퍼블리싱용 로직
export interface TabProps {
  setTab: Dispatch<SetStateAction<number>>;
}

const ParticipateFamily = () => {
  // tab, setTab은 퍼블리싱용 로직
  const [tab, setTab] = useState<number>(0);

  return (
    <div className="h-full">
      <header className="py-[19px] flex justify-center">
        <FanggleF />
      </header>
      <div className="h-full">
        {tab == 0 && <ParticipateFamilyCode setTab={setTab} />}
        {tab == 1 && <ParticipateConfirm />}
      </div>
    </div>
  );
};

export default ParticipateFamily;
