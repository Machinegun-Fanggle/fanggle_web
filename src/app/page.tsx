"use client";

import styled from "@emotion/styled"
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";

export default function Home() {
  const { data: session } = useSession();

  return (
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
        {
          (session && session.user) ?
            (<button
              className="px-12 py-4 border rounded-xl bg-red-300"
              onClick={() => signOut()}
            >
              {session.user.name}님 로그아웃
            </button>)
            :
            (<button
              className="px-12 py-4 border rounded-xl bg-yellow-300"
              onClick={() => signIn()}
            >
              로그인
            </button>)
        }
      </div>
    </div>
  );
}