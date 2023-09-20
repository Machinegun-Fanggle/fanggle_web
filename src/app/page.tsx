"use client";

import styled from "@emotion/styled"
// import { signIn, signOut, useSession } from "next-auth/react";
import { useState } from "react";
import { RequestPayParams, RequestPayResponse } from "iamport-typings";
import { apiInstance } from "@/app/api/apiInstance"

const initialState: RequestPayParams = {
  pg: 'kakaopay',
  pay_method: 'card', //생략 가능
  merchant_uid: "order_no_0001", // 상점에서 관리하는 주문 번호
  name: '주문명:결제테스트',
  amount: 100,
  buyer_email: 'iamport@siot.do',
  buyer_name: '구매자이름',
  buyer_tel: '010-1234-5678',
  buyer_addr: '서울특별시 강남구 삼성동',
  buyer_postcode: '123-456'
};


export default function Home() {
  // const { data: session } = useSession();
  const [params, setParams] = useState<RequestPayParams>(initialState);
  const [result, setResult] = useState<RequestPayResponse>();

  const IMP_UID = "imp83550806";

  const onClickPayment = () => {
    const { IMP } = window;
    if (IMP) {
      IMP.init(IMP_UID);

      IMP.request_pay(params, onPaymentAccepted);
    }

  };

  const onPaymentAccepted = (response: RequestPayResponse) => {
    console.log(response);
    setResult(response);
  };

  const testsignin = async () => {
    try {
      const response = await apiInstance.get(`/auth/kakao`)
      const url = response.data;
      console.log(response)
      window.location.href = url;
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <>


      <div>
        <div
          style={{
            display: "flex",
            fontSize: "40px",
            justifyContent: "center",
            fontFamily: "Montserrat",
            fontWeight: 700
          }}>
          <h1>Social Login</h1>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }} >
          {/* {
            (session && session.user) ?
              (
                <div>
                  <button
                    className="px-12 py-4 border rounded-xl bg-red-300"
                    onClick={() => signOut()}
                  >
                    {session.user.name}님 로그아웃
                  </button>

                  <div >
                    <div >
                      <label>IMP_UID</label>
                      <input

                        value={IMP_UID}
                        disabled
                      />
                    </div>
                    <div>
                      <label>결제수단</label>
                      <input value={params.pay_method} disabled />
                    </div>
                    <div >
                      <label>결제금액</label>
                      <input

                        type="number"
                        value={params.amount}
                        onChange={(e) =>
                          setParams({ ...params, amount: e.target.valueAsNumber })
                        }
                      />
                    </div>
                    <div>
                      <label>주문명</label>
                      <input
                        value={params.name}
                        onChange={(e) => setParams({ ...params, name: e.target.value })}
                      />
                    </div>
                    <div>
                      <label>전화번호</label>
                      <input
                        value={params.buyer_tel}
                        onChange={(e) =>
                          setParams({ ...params, buyer_tel: e.target.value })
                        }
                      />
                    </div>
                    <button onClick={onClickPayment}>
                      결제하기
                    </button>
                  </div>
                  {result && <pre>{JSON.stringify(result, null, " ")}</pre>}
                </div>
              )

              :

              (<button
                className="px-12 py-4 border rounded-xl bg-yellow-300"
                onClick={() => signIn()}
              >
                로그인
              </button>)
          } */}

          <div>
            <button onClick={() => testsignin()}>
              Sign in with Kakao
            </button>
          </div>

        </div>
      </div>
    </>
  );
}