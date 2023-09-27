'use client'

import React, { useState } from 'react';

import { useRouter } from 'next/navigation'
export default function Page() {

    const router = useRouter()
    const [selectedMember, setSelectedMember] = useState<string | null>(null);

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>

            <div>
                <div>
                    <p><span style={{ fontWeight: 600 }}>가족 별명</span>을 지어주세요</p>
                    <input type='text' />
                </div>

                <div>
                    <p>우리 가족을 <span style={{ fontWeight: 600 }}>나타내는 한마디</span>가 있다면?</p>
                    <input type='text' />
                </div>

                <div>
                    <p>아래 중 <span style={{ fontWeight: 600 }}>자신의 구성원</span>은 누구인가요?</p>
                    <div>
                        {['아빠', '엄마', '아들', '딸'].map(member => (
                            <button
                                key={member}
                                style={{
                                    margin: '5px',
                                    backgroundColor: selectedMember === member ? '#007BFF' : '#E0E0E0',
                                    color: selectedMember === member ? 'white' : 'black'
                                }}
                                onClick={() => setSelectedMember(member)}
                            >
                                {member}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <button>다음</button>
                </div>


            </div>
        </div>
    );
}
