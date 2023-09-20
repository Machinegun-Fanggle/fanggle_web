//app/signin/page.tsx

"use client";

import React, { useRef, useEffect, useState } from "react";
import { getProviders, signIn } from "next-auth/react";
import { apiInstance } from "@/app/api/apiInstance"
import styled from "@emotion/styled"
import { useRouter } from 'next/router'

export default function Login() {

    const router = useRouter()
    // const [providers, setProviders] = useState(null);

    // useEffect(() => {
    //     (async () => {
    //         const res: any = await getProviders();
    //         // setProviders(res);
    //         // console.log(res)
    //         // console.log("1")
    //     })();
    // }, []);


    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleSubmit = async () => {
        // console.log(emailRef.current);
        // console.log(passwordRef.current);
        const result = await signIn("credentials", {
            username: emailRef.current,
            password: passwordRef.current,
            redirect: true,
            callbackUrl: "/",
        });
    };

    const signin = async (site) => {
        try {
            const response = await apiInstance.get(`/auth/kakao`)
            const url = response.data;
            console.log(response.data)
            window.location.href = url;
        } catch (error) { }
    }


    const handleSign = async (name) => await signIn(name, { redirect: true, callbackUrl: "/" });


    return (
        <div>
            <h1>Login</h1>
            <div>
                <div>
                    <label htmlFor="email">
                        Email
                    </label>

                    <div className="mt-1">
                        <input
                            ref={emailRef}
                            onChange={(e: any) => {
                                emailRef.current = e.target.value;
                            }}
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoFocus={true}
                        />
                    </div>
                </div>

                <div className="mt-4">
                    <label
                        htmlFor="password">
                        Password
                    </label>
                    <div className="mt-1">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            ref={passwordRef}
                            onChange={(e: any) => (passwordRef.current = e.target.value)}
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <button onClick={handleSubmit}>
                        Log In
                    </button>
                </div>
            </div>


            <div>
                <button onClick={() => signin}>
                    Sign in with Kakao
                </button>
            </div>

            <div>
                <button onClick={() => handleSign('google')}>
                    Sign in with Google
                </button>
            </div>

            <div>
                <button onClick={() => handleSign('naver')}>
                    Sign in with Naver
                </button>
            </div>

            {/* <div>
                <button onClick={() => handleSign('apple')}>
                    Sign in with Apple
                </button>
            </div> */}

        </div>
    );
}