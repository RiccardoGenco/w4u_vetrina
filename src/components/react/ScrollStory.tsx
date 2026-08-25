import { useEffect, useRef, useState } from 'react';
type Step = { number: string; short: string; title: string; text: string };

export default function ScrollStory({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.step));
    }, { rootMargin: '-34% 0px -38% 0px', threshold: [0.2, 0.5, 0.8] });
    refs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const current = steps[active];
  return (
    <div className="story-layout">
      <div className="story-copy">
        {steps.map((step, index) => (
          <article key={step.number} ref={(node) => { refs.current[index] = node; }} data-step={index} className={index === active ? 'is-active' : ''}>
            <span>{step.number}</span><small>{step.short}</small><h3>{step.title}</h3><p>{step.text}</p>
          </article>
        ))}
      </div>
      <aside className="story-stage" aria-live="polite">
        <div className="story-stage-top"><span>PROGETTO · {current.number} / 08</span><b>{current.short}</b></div>
        <div className="story-stage-body">
          <div className="story-book"><span>W4U</span><strong>{current.title}</strong><div className="story-lines"><i></i><i></i><i></i><i></i></div><small>{current.text}</small></div>
          <nav aria-label="Progresso del percorso">{steps.map((step, index) => <button key={step.number} className={index === active ? 'active' : ''} onClick={() => refs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })} aria-label={`Vai alla fase ${step.number}: ${step.short}`}>{step.number}</button>)}</nav>
        </div>
      </aside>
    </div>
  );
}
