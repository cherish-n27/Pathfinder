from pathlib import Path
import re
p = Path('/home/ubuntu/pathfinder-ai/client/src/pages/Home.tsx')
s = p.read_text()
pattern = r'className=\{`grid cursor-pointer gap-3 border-b border-\[#edf3f3\] \$\{selectedIndex === i \? "bg-\[#f7fafc\]" : ""\}` px-5 py-5 last:border-0 sm:grid-cols-\[1\.3fr_\.6fr_\.6fr_\.8fr\] sm:items-center sm:gap-4 sm:px-6'
replacement = 'className={`grid cursor-pointer gap-3 border-b border-[#edf3f3] px-5 py-5 last:border-0 sm:grid-cols-[1.3fr_.6fr_.6fr_.8fr] sm:items-center sm:gap-4 sm:px-6 ${selectedIndex === i ? "bg-[#f7fafc]" : ""}`}'
s2, n = re.subn(pattern, replacement, s, count=1)
if n != 1:
    raise SystemExit(f'no replacement: {n}')
p.write_text(s2)
