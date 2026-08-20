import { useCallback, useEffect, useRef, useState } from "react";
import { legalDocs, type LegalBlock, type LegalDoc } from "../data/legal";

/**
 * React-остров: модальные окна для юридических документов.
 *
 * Открывается по клику на любой элемент с атрибутом `data-legal="privacy" | "offer"`,
 * поэтому статичная Astro-разметка (футер, чекбоксы формы) может дёргать модалку
 * без передачи пропсов через дерево.
 */

function Block({ block }: { block: LegalBlock }) {
  if (block.type === "h") {
    return (
      <h3 className="display display-sm mt-8 mb-3 first:mt-0">{block.text}</h3>
    );
  }

  if (block.type === "ul") {
    return (
      <ul className="my-4 space-y-2">
        {block.items.map((item, i) => (
          <li key={i} className="relative pl-5 text-[0.95rem] leading-relaxed">
            <span
              aria-hidden="true"
              className="absolute left-0 top-[0.7em] h-[5px] w-[5px] rounded-full bg-accent"
            />
            {item}
          </li>
        ))}
      </ul>
    );
  }

  return <p className="my-3 text-[0.95rem] leading-relaxed">{block.text}</p>;
}

export default function LegalModal() {
  const [active, setActive] = useState<LegalDoc | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => setActive(null), []);

  // Делегированный слушатель: ловим клики по [data-legal] на всей странице.
  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = (event.target as HTMLElement | null)?.closest<HTMLElement>(
        "[data-legal]",
      );
      if (!target) return;

      const id = target.dataset.legal;
      const doc = legalDocs.find((d) => d.id === id);
      if (!doc) return;

      event.preventDefault();
      lastFocused.current = target;
      setActive(doc);
    }

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // Escape закрывает окно.
  useEffect(() => {
    if (!active) return;

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") close();
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [active, close]);

  // Блокируем прокрутку страницы под модалкой, возвращаем фокус после закрытия.
  useEffect(() => {
    if (!active) {
      lastFocused.current?.focus?.();
      return;
    }

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    scrollRef.current?.scrollTo({ top: 0 });
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previous;
    };
  }, [active]);

  if (!active) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
    >
      {/* Подложка */}
      <button
        type="button"
        aria-label="Закрыть"
        onClick={close}
        className="absolute inset-0 h-full w-full cursor-default bg-ink-strong/45 backdrop-blur-[2px]"
        style={{ animation: "legal-fade 0.2s ease" }}
      />

      {/* Панель */}
      <div
        className="relative flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden border border-line-soft bg-cream-lt shadow-2xl sm:max-h-[86vh]"
        style={{
          borderRadius: "var(--radius-card)",
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          animation: "legal-rise 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <header className="flex items-start justify-between gap-4 border-b border-line-soft px-6 py-5 sm:px-8">
          <div>
            <h2 id="legal-modal-title" className="display display-md">
              {active.title}
            </h2>
            {active.subtitle && (
              <p className="mt-1 text-sm text-muted">{active.subtitle}</p>
            )}
          </div>

          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Закрыть"
            className="btn btn-ghost shrink-0 !px-3 !py-2"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M1 1L13 13M13 1L1 13"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </header>

        <div
          ref={scrollRef}
          className="overflow-y-auto overscroll-contain px-6 py-6 sm:px-8"
        >
          {active.blocks.map((block, i) => (
            <Block key={i} block={block} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes legal-fade { from { opacity: 0 } to { opacity: 1 } }
        @keyframes legal-rise {
          from { opacity: 0; transform: translateY(24px) }
          to { opacity: 1; transform: none }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes legal-rise { from { opacity: 1 } to { opacity: 1 } }
        }
        @media (min-width: 640px) {
          [role="dialog"] > div:last-of-type { border-radius: var(--radius-card) !important }
        }
      `}</style>
    </div>
  );
}
