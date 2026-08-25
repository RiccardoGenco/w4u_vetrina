import { useEffect, useRef, useState } from 'react';

type Step = { number: string; short: string; title: string; text: string };

export default function ScrollStory({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const refs = useRef<Array<HTMLElement | null>>([]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) setActive(Number((visible.target as HTMLElement).dataset.step));
    }, { rootMargin: '-32% 0px -40% 0px', threshold: [0.15, 0.4, 0.7] });
    refs.current.forEach((node) => node && observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const current = steps[active];
  const noteFor = (index: number) => index === 0
    ? 'Il punto di partenza non deve essere perfetto.'
    : index === 4
      ? 'Qui l’idea diventa una vera architettura.'
      : index === 7
        ? 'Il manoscritto lascia la piattaforma.'
        : '';

  return (
    <div className="story-layout living-story">
      <div className="story-copy">
        <div className="story-copy-sticky" aria-hidden="true" key={current.number}>
          <div className="story-copy-folio"><span>{current.number}</span><i></i><small>{current.short}</small></div>
          <h3>{current.title}</h3><p>{current.text}</p>
          <div className="story-copy-note">{noteFor(active)}</div>
        </div>
        <div className="story-triggers">
          {steps.map((step, index) => (
            <article key={step.number} ref={(node) => { refs.current[index] = node; }} data-step={index} className={`story-trigger ${index === active ? 'is-active' : ''}`}>
              <div className="story-trigger-content">
                <div className="story-copy-folio"><span>{step.number}</span><i></i><small>{step.short}</small></div>
                <h3>{step.title}</h3><p>{step.text}</p>
                {noteFor(index) && <div className="story-copy-note">{noteFor(index)}</div>}
              </div>
            </article>
          ))}
        </div>
      </div>
      <aside className={`story-stage manuscript-stage manuscript-stage-${active + 1}`} aria-live="polite">
        <div className="story-stage-top"><span>W4U · MANOSCRITTO IN LAVORAZIONE</span><b>{current.number} / 08</b></div>
        <div className="manuscript-desk">
          <div className="page-shadow page-shadow-two" aria-hidden="true"></div><div className="page-shadow page-shadow-one" aria-hidden="true"></div>
          <div className="manuscript-spread" key={current.number}>
            <div className="manuscript-page manuscript-page-left"><span className="page-running-head">W4U / {current.short}</span><div className="page-ghost-number">{current.number}</div><div className="page-rule"></div><small>FASE {current.number}</small><strong>{current.short}</strong><i className="page-folio">{String(active * 4 + 1).padStart(2, '0')}</i></div>
            <div className="manuscript-spine" aria-hidden="true"></div>
            <div className="manuscript-page manuscript-page-right"><span className="page-running-head">IL TUO PROGETTO</span><small>CAPITOLO {current.number}</small><h4>{current.title}</h4><p>{current.text}</p><div className="page-writing-lines" aria-hidden="true"><i></i><i></i><i></i></div><i className="page-folio">{String(active * 4 + 2).padStart(2, '0')}</i></div>
          </div>
          <div className="manuscript-annotation" aria-hidden="true"><span>NOTA</span><i></i><p>{active < 2 ? 'Ascolta prima di scrivere.' : active < 5 ? 'Ogni scelta prepara la successiva.' : active < 7 ? 'La tua voce resta al centro.' : 'Ora il libro è pronto a uscire.'}</p></div>
        </div>
        <div className="story-stage-footer">
          <span>{current.short}</span><nav aria-label="Progresso del percorso">{steps.map((step, index) => <button key={step.number} className={index === active ? 'active' : index < active ? 'done' : ''} onClick={() => refs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' })} aria-label={`Vai alla fase ${step.number}: ${step.short}`}><i></i><b>{step.number}</b></button>)}</nav><span>{Math.round(((active + 1) / steps.length) * 100)}%</span>
        </div>
      </aside>
    </div>
  );
}
