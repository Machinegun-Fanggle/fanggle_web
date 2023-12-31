'use client'

import styled from 'styled-components';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

export default function Page() {
    const [code, setCode] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const checkCode = () => {
            if (code.length >= 6) {
                if (code == '111111') {
                    alert('인증되었습니다.');
                    router.replace('/main');
                } else {
                    alert('유효한 인증코드가 없습니다.');
                    handleAllDelete();
                }
            }
        };

        const timeoutId = setTimeout(checkCode, 100);
        return () => clearTimeout(timeoutId);
    }, [code, router]);

    const handlePaste = async (event: React.ClipboardEvent) => {
        event.preventDefault(); // 기본 붙여넣기 동작을 방지합니다.
        const text = event.clipboardData.getData('text/plain');
        if (text.length <= 6) {
            setCode(text);
        } else {
            alert('클립보드의 값이 너무 길어요!');
        }
    };

    const handleKeypadClick = (number: string) => {
        if (code.length < 6) {
            setCode((prevCode) => prevCode + number);
        }
    };

    const handleAllDelete = () => {
        setCode('');
    };
    const handleDelete = () => {
        setCode((prevCode) => prevCode.slice(0, -1));
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }} onPaste={handlePaste}>
            <h3>가족 코드를 입력해주세요!</h3>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px' }}>
                {Array(6).fill(null).map((_, index) => (
                    <div
                        key={index}
                        style={{
                            width: '30px',
                            height: '40px',
                            border: '1px solid black',
                            marginLeft: '5px',
                            backgroundColor: code.length > index ? 'gray' : 'white',
                        }}
                    ></div>
                ))}
            </div>
            <div>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(number => (
                    <button
                        key={number}
                        style={{ fontSize: '20px', margin: '10px', padding: '10px 20px' }}
                        onClick={() => handleKeypadClick(number.toString())}
                    >
                        {number}
                    </button>
                ))}
            </div>
            <button
                style={{ fontSize: '20px', margin: '10px', padding: '10px 20px' }}
                onClick={handleAllDelete}
            >
                전체삭제
            </button>
            <button
                style={{ fontSize: '20px', margin: '10px', padding: '10px 20px' }}
                onClick={handleDelete}
            >
                삭제
            </button>
        </div>
    );
}
