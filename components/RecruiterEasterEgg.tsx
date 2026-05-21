"use client";

import { useEffect } from "react";
import { RECRUITER_TOKEN } from "@/data/recruiterToken";

const COOKIE_NAME = "recruiter_token";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export function RecruiterEasterEgg() {
  useEffect(() => {
    document.cookie = `${COOKIE_NAME}=${RECRUITER_TOKEN}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax`;

    console.log(
      [
        "%c👋 Hi there.",
        "%cYou opened DevTools on a portfolio site.",
        "That already says something about you - and we're going to get along.",
        "",
        "%c🍪 There is a cookie called  recruiter_token  in Application → Cookies.",
        "    Paste it into  https://jwt.io  for a personal note.",
        "",
        "- Jakub",
      ].join("\n"),
      "font-size: 18px; font-weight: 700; color: #7dd3fc;",
      "font-size: 13px; color: #cbd5e1;",
      "font-size: 13px; color: #fb923c;",
    );
  }, []);

  return null;
}
