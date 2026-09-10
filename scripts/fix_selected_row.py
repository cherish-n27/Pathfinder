from pathlib import Path
import re
p = Path('/home/ubuntu/pathfinder-ai/client/src/pages/Home.tsx')
s = p.read_text()
s = re.sub(r'className=\{`grid cursor-pointer gap-3 border-b \$\{selectedIndex === i \? "bg-\[#f7fafc\]" : ""\}` border-\[#edf3f3\] px-5 py-5 last:border-0 sm:grid-cols-\[1\.3fr_\.6fr_\.6fr_\.8fr\] sm:items-center sm:gap-4 sm:px-6\}', 'className={`grid cursor-pointer gap-3 border-b border-[#edf3f3] px-5 py-5 last:border-0 sm:grid-cols-[1.3fr_.6fr_.6fr_.8fr] sm:items-center sm:gap-4 sm:px-6 ${selectedIndex === i ? "bg-[#f7fafc]" : ""}`}', s, count=1)
p.write_text(s)
