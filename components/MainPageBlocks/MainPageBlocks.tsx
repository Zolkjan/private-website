"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

const MainPageBlocks = () => {
  useGSAP(() => {
    gsap.to("#blue-box", {
      x: 250,
    });
  }, []);

  return (
    <div className="p-10 w-full">
      <div id="blue-box" className="w-10 h-10 bg-blue-500 rounded-lg"></div>
    </div>
  );
};

export default MainPageBlocks;
