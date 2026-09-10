from pathlib import Path
import re

path = Path('/home/ubuntu/pathfinder-ai/client/src/pages/Home.tsx')
s = path.read_text()
start = s.index('function Applications(')
end = s.index('\nfunction Stat', start)
segment = s[start:end]
segment = segment.replace('const selectedItems = selectedDate ? (itemsByDay.get(selectedDate) || []) : []; const changeMonth', 'const selectedItems = selectedDate ? (itemsByDay.get(selectedDate) || []) : []; const tableRows = selectedDate ? selectedItems.map(item => ({ ...item, id: typeof item.id === "number" ? item.id : undefined, org: item.organisation, deadline: new Date(item.deadlineDate).toLocaleDateString(), deadlineDate: new Date(item.deadlineDate).toISOString(), originalIndex: applications.findIndex(application => application.id === item.id) })) : applications.map((item, index) => ({ ...item, originalIndex: index })); const changeMonth')
start_panel = segment.find('{selectedDate && <div className="mt-5 rounded-2xl bg-[#fffaf7] p-4">')
end_panel = segment.find('<div className="mt-8 overflow-hidden', start_panel)
if start_panel < 0 or end_panel < 0:
    raise SystemExit(f'selected panel not found {start_panel} {end_panel}')
segment = segment[:start_panel] + '{selectedDate && <div className="mt-4 rounded-xl bg-[#fffaf7] p-3 text-sm text-[#52717d]"><strong className="text-[#183b56]">Showing deadlines for {new Date(`${selectedDate}T12:00:00`).toLocaleDateString(undefined, { month: "long", day: "numeric", year: "numeric" })}</strong><span className="ml-2 text-xs font-bold text-[#8aa0a8]">{selectedItems.length} item{selectedItems.length === 1 ? "" : "s"}</span><button onClick={() => setSelectedDate(null)} className="ml-3 text-xs font-bold text-[#0f766e]">Show all</button></div>}</div>' + segment[end_panel:]
segment = segment.replace('{applications.map((a, i) =>', '{tableRows.map((a, i) =>')
segment = segment.replace('onClick={() => setSelectedIndex(i)} className={`grid cursor-pointer', 'onClick={() => setSelectedIndex(a.originalIndex)} className={`grid cursor-pointer')
segment = segment.replace('{selectedIndex === i ? "bg-[#f7fafc]" : ""}', '{selectedIndex === a.originalIndex ? "bg-[#f7fafc]" : ""}')
segment = segment.replace('{a.id && <button aria-label={`Remove ${a.title}`}', '<button onClick={e => { e.stopPropagation(); const source = applications[a.originalIndex]; setEditingIndex(a.originalIndex); setForm({ title: source?.title || a.title, organisation: source?.org || a.organisation, type: source?.type || a.type, dateApplied: "", deadlineDate: source?.deadlineDate ? new Date(source.deadlineDate).toISOString().slice(0, 10) : "", status: source?.status || a.status, notes: source?.notes || "" }); setEditorOpen(true); }} className="text-xs font-bold text-[#0f766e] hover:text-[#0b7f75]">Edit</button>{a.id && <button aria-label={`Remove ${a.title}`}')
s = s[:start] + segment + s[end:]
path.write_text(s)
print('updated Applications table')
