export default function IconCopyPlus({ class: cls = "h-4 w-4" }: { class?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" class={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="7" width="12" height="13" rx="2"/>
      <path d="M8 7V5a2 2 0 012-2h8a2 2 0 012 2v9a2 2 0 01-2 2h-2"/>
      <line x1="17" y1="20" x2="24" y2="20" stroke-width="3"/>
      <line x1="20" y1="17" x2="20" y2="24" stroke-width="3"/>
    </svg>
  );
}
