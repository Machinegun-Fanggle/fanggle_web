'use client'

import styled from 'styled-components';
import Image from 'next/image'
import logo from '@/app/assets/fanggle_logo.svg'
import { useRouter } from 'next/navigation'
export default function Page() {

    const router = useRouter()

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <Image src={logo} alt='로고 이미지' />
            <button onClick={() => router.push('/participate/createfamily')}>새로운 가족 만들기</button>
            <button onClick={() => router.push('/participate/authcode')}>코드로 참여하기</button>
        </div>
    );
}
