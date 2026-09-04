import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';
import { terms, totalFor, perMonth, listPrice, type Term } from '../data/plans';

/**
 * One plan selection shared by every surface that shows it: the home pricing card,
 * home step 01 and the Pricing page. The handoff requires a change in any one of
 * them to update the others, so the state lives above all three.
 */

interface PlanState {
  term: Term;
  screens: number;
  setTerm: (t: Term) => void;
  setScreens: (n: number) => void;
  /** Term total adjusted for simultaneous screens. */
  total: number;
  /** Total divided across the term, to 2dp. */
  monthly: string;
  /** Struck-through "was" price. */
  wasPrice: number;
}

const PlanContext = createContext<PlanState | null>(null);

export function PlanProvider({ children }: { children: ReactNode }) {
  // Handoff spec: term initialises to 3 months, screens to 1.
  const [term, setTerm] = useState<Term>(terms[1]);
  const [screens, setScreens] = useState(1);

  const value = useMemo<PlanState>(() => {
    const total = totalFor(term, screens);
    return {
      term,
      screens,
      setTerm,
      setScreens,
      total,
      monthly: perMonth(total, term.months),
      wasPrice: listPrice(total),
    };
  }, [term, screens]);

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanState {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error('usePlan must be used inside <PlanProvider>');
  return ctx;
}
