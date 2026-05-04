import { useSignal, useSignalEffect } from "@preact/signals";
import { toast } from "../lib/state.ts";

export default function Toast() {
  const visible = useSignal(false);
  const msg = useSignal("");

  useSignalEffect(() => {
    const t = toast.value;
    if (!t) return;
    msg.value = t.msg;
    visible.value = true;
    const timer = setTimeout(() => { visible.value = false; }, 3000);
    return () => clearTimeout(timer);
  });

  return (
    <div
      class={`toast toast-bottom toast-center transition-opacity duration-300 print:hidden ${
        visible.value ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div class="alert alert-success">
        <span>{msg.value}</span>
      </div>
    </div>
  );
}
