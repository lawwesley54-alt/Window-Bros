import {
  useEffect,
  useRef,
  useState,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
  type Ref,
} from "react";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  as?: ElementType;
  ref?: Ref<HTMLElement>;
} & Omit<ComponentPropsWithoutRef<"div">, "className" | "children">;

/**
 * Fade-up scroll reveal. Respects prefers-reduced-motion via CSS
 * (see .reveal in index.css) and degrades gracefully without JS
 * (element is simply visible if IntersectionObserver is unavailable).
 * Accepts a forwarded `ref` (React 19 ref-as-prop) for callers that also
 * need direct DOM access to the revealed element.
 */
export function Reveal({ children, className = "", delay = 0, as: Tag = "div", ref: externalRef, ...rest }: RevealProps) {
  const internalRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(() => typeof IntersectionObserver === "undefined");

  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const node = internalRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const setRefs = (node: HTMLElement | null) => {
    internalRef.current = node;
    if (typeof externalRef === "function") externalRef(node);
    else if (externalRef) (externalRef as { current: HTMLElement | null }).current = node;
  };

  return (
    <Tag
      ref={setRefs as never}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
