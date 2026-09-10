from pathlib import Path
import re

source = Path('/home/ubuntu/pathfinder-ai/client/src/pages/Home.tsx').read_text()
for name in ['Overview', 'Deadline', 'Applications']:
    match = re.search(rf'function {name}\b.*?(?=\nfunction |\Z)', source, flags=re.S)
    if match:
        Path(f'/tmp/pathfinder_{name}.tsx').write_text(match.group(0))
        print(f'{name}: {len(match.group(0))} chars')
