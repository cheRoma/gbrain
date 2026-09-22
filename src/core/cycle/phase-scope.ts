import type { CyclePhase } from '../cycle.ts';

/**
 * Phase-scope taxonomy. `runCycle` enforces it for explicit non-default
 * sources: only source phases run there; mixed and global phases run once in
 * the default/global-maintenance lane.
 *
 * - source: safe to parallelize per source.
 * - global: must serialize across the brain.
 * - mixed: reads brain-wide input while writing pages, so it stays in the
 *   default/global-maintenance lane until decomposed.
 */
export type PhaseScope = 'source' | 'global' | 'mixed';

export const PHASE_SCOPE: Record<CyclePhase, PhaseScope> = {
  lint: 'source',
  backlinks: 'source',
  sync: 'source',
  synthesize: 'mixed',
  extract: 'source',
  extract_facts: 'source',
  resolve_symbol_edges: 'global',
  patterns: 'mixed',
  recompute_emotional_weight: 'source',
  consolidate: 'source',
  propose_takes: 'source',
  grade_takes: 'global',
  calibration_profile: 'global',
  drift: 'global',
  embed: 'global',
  orphans: 'global',
  purge: 'global',
  'schema-suggest': 'source',
  extract_atoms: 'source',
  synthesize_concepts: 'global',
  conversation_facts_backfill: 'source',
  enrich_thin: 'source',
  // FORK DELTA (link_chat branch): Tier 0 chat distiller — per-source, the
  // wrapper loops listSources() like enrich_thin. Upstream doesn't know this
  // phase, so an upstream merge drops the entry and the Record<CyclePhase,…>
  // type goes red until it's re-added here.
  link_chat: 'source',
  skillopt: 'global',
};

/** Bounded deterministic phases that alone define source freshness. */
export const SOURCE_FRESHNESS_PHASES: CyclePhase[] = [
  'lint', 'backlinks', 'sync', 'extract', 'extract_facts',
  'recompute_emotional_weight',
  // FORK DELTA (link_chat branch): link_chat is deterministic, zero-model and
  // capped per tick (max_pages_per_tick), so it meets the freshness bar. Since
  // the v0.46.20.0 cycle split (#4263) non-freshness source phases have no
  // automatic lane, and link_chat silently stopped running on 2026-08-19 —
  // chat captures piled up as orphans for a month. Keep it in this list.
  'link_chat',
];
