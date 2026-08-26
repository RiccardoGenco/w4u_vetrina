import { useCallback, useEffect, useRef, useState } from 'react';

type Step = { number: string; short: string; title: string; text: string };
type PageTurn = { from: number; to: number; direction: 'forward' | 'backward'; id: number };

export default function ScrollStory({ steps }: { steps: Step[] }) {
  const [active, setActive] = useState(0);
  const [bookActive, setBookActive] = useState(0);
  const [pageTurn, setPageTurn] = useState<PageTurn | null>(null);
  const refs = useRef<Array<HTMLElement | null>>([]);
  const activeRef = useRef(0);
  const bookActiveRef = useRef(0);
  const pageTurnRef = useRef<PageTurn | null>(null);
  const turnTimer = useRef<number | undefined>(undefined);
  const settleFrame = useRef<number | undefined>(undefined);
  const settlingTurn = useRef<number | null>(null);

  const completePageTurn = useCallback((id: number) => {
    const turn = pageTurnRef.current;
    if (!turn || turn.id !== id || settlingTurn.current === id) return;
    settlingTurn.current = id;
    window.clearTimeout(turnTimer.current);
    bookActiveRef.current = turn.to;
    setBookActive(turn.to);
    settleFrame.current = window.requestAnimationFrame(() => {
      settleFrame.current = window.requestAnimationFrame(() => {
        if (pageTurnRef.current?.id !== id) return;
        pageTurnRef.current = null;
        settlingTurn.current = null;
        setPageTurn(null);
      });
    });
  }, []);

  const activateStep = useCallback((next: number) => {
    if (activeRef.current === next) return;
    window.cancelAnimationFrame(settleFrame.current ?? 0);
    settlingTurn.current = null;
    const pending = pageTurnRef.current;
    const previous = pending?.to ?? bookActiveRef.current;
    if (pending) {
      bookActiveRef.current = previous;
      setBookActive(previous);
    }
    activeRef.current = next;
    setActive(next);
    window.clearTimeout(turnTimer.current);
    if (previous === next) {
      pageTurnRef.current = null;
      setPageTurn(null);
      return;
    }
    const turn = { from: previous, to: next, direction: next > previous ? 'forward' : 'backward', id: performance.now() } as PageTurn;
    pageTurnRef.current = turn;
    setPageTurn(turn);
    turnTimer.current = window.setTimeout(() => completePageTurn(turn.id), 1100);
  }, [completePageTurn]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible) activateStep(Number((visible.target as HTMLElement).dataset.step));
    }, { rootMargin: '-32% 0px -40% 0px', threshold: [0.15, 0.4, 0.7] });
    refs.current.forEach((node) => node && observer.observe(node));
    return () => {
      observer.disconnect();
      window.clearTimeout(turnTimer.current);
      window.cancelAnimationFrame(settleFrame.current ?? 0);
    };
  }, [activateStep]);

  const current = steps[active];
  const leftIndex = pageTurn ? (pageTurn.direction === 'forward' ? pageTurn.from : pageTurn.to) : bookActive;
  const rightIndex = pageTurn ? (pageTurn.direction === 'forward' ? pageTurn.to : pageTurn.from) : bookActive;
  const leftPage = steps[leftIndex];
  const rightPage = steps[rightIndex];
  const turningFrom = pageTurn ? steps[pageTurn.from] : current;
  const turningTo = pageTurn ? steps[pageTurn.to] : current;
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
          <div className="manuscript-book">
            <div className="manuscript-spread">
              <div className="manuscript-page manuscript-page-left"><span className="page-running-head">W4U / {leftPage.short}</span><div className="page-ghost-number">{leftPage.number}</div><div className="page-rule"></div><small>FASE {leftPage.number}</small><strong>{leftPage.short}</strong><i className="page-folio">{String(leftIndex * 4 + 1).padStart(2, '0')}</i></div>
              <div className="manuscript-spine" aria-hidden="true"></div>
              <div className="manuscript-page manuscript-page-right"><span className="page-running-head">IL TUO PROGETTO</span><small>CAPITOLO {rightPage.number}</small><h4>{rightPage.title}</h4><p>{rightPage.text}</p><div className="page-writing-lines" aria-hidden="true"><i></i><i></i><i></i></div><i className="page-folio">{String(rightIndex * 4 + 2).padStart(2, '0')}</i></div>
            </div>
            {pageTurn && <div className={`manuscript-turning-page is-${pageTurn.direction}`} key={pageTurn.id} aria-hidden="true" onAnimationEnd={(event) => {
              if (event.animationName !== `manuscript-page-${pageTurn.direction}`) return;
              completePageTurn(pageTurn.id);
            }}>
              <div className="turning-page-face turning-page-front">
                {pageTurn.direction === 'forward' ? <>
                  <span className="page-running-head">IL TUO PROGETTO</span><small>CAPITOLO {turningFrom.number}</small><h4>{turningFrom.title}</h4><p>{turningFrom.text}</p><div className="page-writing-lines"><i></i><i></i><i></i></div>
                </> : <>
                  <span className="page-running-head">W4U / {turningFrom.short}</span><div className="page-ghost-number">{turningFrom.number}</div><div className="page-rule"></div><small>FASE {turningFrom.number}</small><strong>{turningFrom.short}</strong>
                </>}
              </div>
              <div className="turning-page-face turning-page-back">
                {pageTurn.direction === 'forward' ? <>
                  <span className="page-running-head">W4U / {turningTo.short}</span><div className="page-ghost-number">{turningTo.number}</div><div className="page-rule"></div><small>FASE {turningTo.number}</small><strong>{turningTo.short}</strong>
                </> : <>
                  <span className="page-running-head">IL TUO PROGETTO</span><small>CAPITOLO {turningTo.number}</small><h4>{turningTo.title}</h4><p>{turningTo.text}</p><div className="page-writing-lines"><i></i><i></i><i></i></div>
                </>}
              </div>
            </div>}
          </div>
          <div className="manuscript-annotation" aria-hidden="true"><span>NOTA</span><i></i><p>{active < 2 ? 'Ascolta prima di scrivere.' : active < 5 ? 'Ogni scelta prepara la successiva.' : active < 7 ? 'La tua voce resta al centro.' : 'Ora il libro è pronto a uscire.'}</p></div>
        </div>
        <div className="story-stage-footer">
          <span>{current.short}</span><nav aria-label="Progresso del percorso">{steps.map((step, index) => <button key={step.number} className={index === active ? 'active' : index < active ? 'done' : ''} onClick={() => { activateStep(index); refs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' }); }} aria-label={`Vai alla fase ${step.number}: ${step.short}`}><i></i><b>{step.number}</b></button>)}</nav><span>{Math.round(((active + 1) / steps.length) * 100)}%</span>
        </div>
      </aside>
    </div>
  );
}
