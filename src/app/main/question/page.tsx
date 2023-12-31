"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'

const questions = [
    "어릴 때 가장 기억에 남는 추억은 무엇인가요 ?",
    "어린 시절의 꿈은 무엇이었나요 ?",
    "제일 기억에 남는 여행지와 그 이유는 무엇인가요 ?",
    "내가 알지 못하는 특별한 재능이나 능력이 있나요 ?",
    "학창 시절에 가장 재미있었던 활동은 무엇이었나요 ?",
    "어릴 때 부모님과 가장 자주 가던 장소는 어디였나요 ?",
    "여가 시간에 가장 좋아하는 취미 활동은 무엇인가요 ?",
    "가족 중에서 어떤 순간이 가장 감동적이었나요 ?",
    "내가 모르는 어릴 때의 재미난 에피소드는 무엇인가요 ?",
    "가족 중 가장 좋아하는 공통의 활동이나 이벤트는 무엇인가요 ?",
    "어린 시절에 좋아하던 음식이나 간식은 무엇이었나요 ?",
    "어렸을 때 부모님에게 배운 중요한 교훈은 무엇인가요 ?",
    "나에게 가장 영향을 준 책이나 영화는 무엇인가요 ?",
    "학창 시절 최고의 친구는 누구였고 지금 어떻게 지내나요 ?",
    "어릴 때 자주 듣던 음악이나 가수는 누구였나요 ?",
    "가장 힘들었던 시기와 그 이유는 무엇인가요 ?",
    "가족들과 함께한 가장 행복했던 순간은 언제인가요 ?",
    "어릴 때 가장 무서워하던 것은 무엇이었나요 ?",
    "나에게 알려주고 싶은 가족의 역사나 전통은 무엇인가요 ?",
    "어렸을 때 가장 자주 놀던 친구는 누구였나요 ?",
    "가장 기억에 남는 생일 선물은 무엇인가요 ?",
    "나에게 전하고 싶은 중요한 가치나 원칙은 무엇인가요 ?",
    "어릴 때 나와 가장 비슷한 성격을 가진 가족은 누구였나요 ?",
    "학창 시절 가장 좋아했던 과목은 무엇이었나요 ?",
    "가족과 함께한 여행 중 가장 기억에 남는 장소는 어디인가요 ?",
    "나를 키우면서 가장 힘들었던 점은 무엇인가요 ?",
    "나를 처음 만났을 때의 느낌은 어떠했나요 ?",
    "가족 중 나와 가장 비슷하다고 생각하는 사람은 누구인가요 ?",
    "나의 출생에 관한 특별한 에피소드가 있나요 ?",
    "나를 키울 때 가장 큰 원칙이나 교훈은 무엇이었나요 ?",
    "가족 중 나만이 모르는 비밀이나 이야기가 있나요 ?",
    "내가 어릴 때 가장 좋아하던 놀이나 장난감은 무엇이었나요 ?",
    "가족들과 함께 즐기던 가장 재미있던 게임은 무엇인가요 ?",
    "어렸을 때 자주 듣던 동화나 이야기는 무엇이었나요 ?",
    "가족들과 함께 떠나고 싶은 여행지는 어디인가요 ?",
    "나의 어린 시절에 가장 자랑스러웠던 순간은 언제인가요 ?",
    "어릴 때 나만의 특별한 습관이나 버릇은 무엇이었나요 ?",
    "가족 중 내가 모르는 재미난 이야기나 에피소드는 무엇인가요 ?",
    "어렸을 때 부모님과의 가장 특별했던 순간은 언제인가요 ?",
    "가족들과 함께한 특별한 축제나 이벤트는 무엇인가요 ?",
    "어린 시절에 나에게 가장 영향을 준 사람은 누구인가요 ?",
    "가족들과 함께하는 시간 중 가장 좋아하는 순간은 언제인가요 ?",
    "어린 시절 나의 최애 캐릭터나 인형은 누구였나요 ?",
    "어렸을 때 가장 무서워했던 동물이나 사물은 무엇이었나요 ?",
    "가족들과의 일상 중 가장 행복하게 느끼는 순간은 언제인가요 ?",
    "어린 시절 나에게 준 가장 소중한 선물은 무엇인가요 ?",
    "나를 키울 때 가장 중요하게 생각했던 가치나 원칙은 무엇이었나요 ?",
    "가족들과 함께한 특별한 순간 중 가장 기억에 남는 것은 무엇인가요 ?",
    "어릴 때 내가 가장 자주 가던 장소는 어디였나요 ?",
    "가족 중 내가 모르는 재미난 취미나 특기는 무엇인가요 ?"
];

export default function Page() {
    const [selectedQuestion, setSelectedQuestion] = useState<string | null>(null);
    const [answer, setAnswer] = useState("");

    const router = useRouter();

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setSelectedQuestion(questions[randomIndex]);
    }, [])


    const handleSubmit = () => {
        alert(`질문: ${selectedQuestion}\n답변: ${answer}`);
        router.push('/main', { scroll: false })
    };

    return (
        <div>
            <h1>{selectedQuestion}</h1>
            <textarea value={answer} onChange={(e) => setAnswer(e.target.value)} />
            <button onClick={handleSubmit}>제출하기</button>
        </div>
    );
}