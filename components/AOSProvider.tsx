"use client";

import { useEffect } from "react";
// @ts-ignore
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      easing: "ease-out",
    });
  }, []);

  return null; 
}
