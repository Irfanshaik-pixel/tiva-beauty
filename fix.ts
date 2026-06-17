import fs from "fs";

const file = "src/components/AiRitualsPage.tsx";
let content = fs.readFileSync(file, "utf-8");

content = content.replace(/bg-\[#070708\]/g, "bg-ivory");
content = content.replace(/text-white/g, "text-charcoal");
content = content.replace(/text-\[#F8F8F8\]/g, "text-charcoal");
content = content.replace(/bg-white/g, "bg-charcoal");
content = content.replace(/border-white/g, "border-charcoal");
content = content.replace(/to-white/g, "to-charcoal");
content = content.replace(/from-white/g, "from-charcoal");

content = content.replace(/text-stone-[1234]00/g, "text-taupe");
content = content.replace(/text-stone-950/g, "text-ivory");

content = content.replace(/text-\[#070708\]/g, "text-ivory");
content = content.replace(/text-\[#0f0f0f\]/g, "text-ivory");

content = content.replace(/bg-neutral-[89]00/g, "bg-beige");
content = content.replace(/text-neutral-[89]00/g, "text-ivory");

content = content.replace(/bg-\[#000000\]/g, "bg-ivory");
content = content.replace(/border-stone-[1234]00/g, "border-taupe");
content = content.replace(/bg-stone-850/g, "bg-beige");

fs.writeFileSync(file, content);
console.log("Replaced colors successfully.");
