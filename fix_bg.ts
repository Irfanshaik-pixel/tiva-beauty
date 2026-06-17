import fs from "fs";

const file = "src/components/AiRitualsPage.tsx";
let content = fs.readFileSync(file, "utf-8");

// Fix the invisible text:
content = content.replace(/bg-charcoal text-charcoal/g, "bg-charcoal text-ivory");
content = content.replace(/border-charcoal text-charcoal/g, "border-charcoal text-ivory");
content = content.replace(/hover:bg-charcoal hover:text-charcoal/g, "hover:bg-charcoal hover:text-ivory");
content = content.replace(/text-charcoal font-bold shadow-xl border border-charcoal/g, "text-ivory font-bold shadow-xl border border-charcoal");

fs.writeFileSync(file, content);
console.log("Fixed invisible contrast issues.");
