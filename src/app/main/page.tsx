"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'

export default function Page() {

    const router = useRouter();


    const handleGetQuestion = () => {

        router.push('/main/question', { scroll: false })

    };

    return (
        <div>
            <button onClick={handleGetQuestion}>질문 받기</button>
        </div>
    );
}