export default function IconCopy({ class: cls = "h-4 w-4" }: { class?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" class={cls} fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="7" width="12" height="13" rx="2"/>
      <path d="M8 7V5a2 2 0 012-2h8a2 2 0 012 2v9a2 2 0 01-2 2h-2"/>
    </svg>
  );
}
