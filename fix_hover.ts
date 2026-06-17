import fs from "fs";

const file = "src/components/AiRitualsPage.tsx";
let content = fs.readFileSync(file, "utf-8");

content = content.replace(/hover:bg-charcoal hover:border-charcoal hover:text-charcoal/g, "hover:bg-charcoal hover:border-charcoal hover:text-ivory");
content = content.replace(/hover:bg-charcoal transition-all rounded-full select-none cursor-pointer text-nowrap shadow-lg hover:scale-105 active:scale-95/g, "hover:bg-charcoal hover:text-ivory transition-all rounded-full select-none cursor-pointer text-nowrap shadow-lg hover:scale-105 active:scale-95");

content = content.replace(/hover:bg-charcoal hover:text-charcoal cursor-pointer select-none rounded-\[\2rem\]/g, "hover:bg-charcoal hover:text-ivory cursor-pointer select-none rounded-[2rem]");

fs.writeFileSync(file, content);
console.log("Fixed hover states.");
