/**
 * ClauseGuard Pattern Definitions
 * Regex patterns for detecting risky clauses in legal documents
 */

import { ClausePattern, ClauseCategory } from './types';

// Helper to create case-insensitive patterns
const ci = (pattern: string): RegExp => new RegExp(pattern, 'gi');

/**
 * All clause patterns organized by category
 * Each pattern includes:
 * - A unique ID
 * - The category it belongs to
 * - A regex pattern (case-insensitive)
 * - Severity level
 * - Weight for scoring
 * - Description for user-facing display
 * - Optional critical flag for patterns that alone can trigger high risk
 */
export const CLAUSE_PATTERNS: ClausePattern[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // ARBITRATION / WAIVER (High severity)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'arb-binding',
    category: 'arbitration',
    pattern: ci('binding\\s+arbitration'),
    severity: 'critical',
    weight: 10,
    description: 'Requires disputes to be resolved through binding arbitration',
    critical: true,
  },
  {
    id: 'arb-class-action',
    category: 'arbitration',
    pattern: ci('class\\s+action\\s+waiver'),
    severity: 'critical',
    weight: 10,
    description: 'Waives your right to participate in class action lawsuits',
    critical: true,
  },
  {
    id: 'arb-waive-right',
    category: 'arbitration',
    pattern: ci('waive\\s+(your|the)\\s+right\\s+to'),
    severity: 'high',
    weight: 8,
    description: 'Requires you to waive certain legal rights',
  },
  {
    id: 'arb-jury-waive',
    category: 'arbitration',
    pattern: ci('jury\\s+trial[^.]*waive|waive[^.]*jury\\s+trial'),
    severity: 'critical',
    weight: 9,
    description: 'Waives your right to a jury trial',
    critical: true,
  },
  {
    id: 'arb-no-class',
    category: 'arbitration',
    pattern: ci('(may\\s+not|cannot|shall\\s+not)\\s+(bring|file|pursue)[^.]*class\\s+action'),
    severity: 'high',
    weight: 8,
    description: 'Prohibits bringing class action lawsuits',
  },
  {
    id: 'arb-aaa',
    category: 'arbitration',
    pattern: ci('(AAA|American\\s+Arbitration\\s+Association)'),
    severity: 'high',
    weight: 6,
    description: 'References American Arbitration Association rules',
  },
  {
    id: 'arb-jams',
    category: 'arbitration',
    pattern: ci('\\bJAMS\\b'),
    severity: 'high',
    weight: 6,
    description: 'References JAMS arbitration services',
  },
  {
    id: 'arb-individual-basis',
    category: 'arbitration',
    pattern: ci('on\\s+an?\\s+individual\\s+basis\\s+only'),
    severity: 'high',
    weight: 7,
    description: 'Requires claims to be brought individually, not as a group',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // AUTO-RENEWAL / BILLING (High severity)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'auto-renew-auto',
    category: 'auto-renew',
    pattern: ci('automatically\\s+renew'),
    severity: 'high',
    weight: 7,
    description: 'Service automatically renews',
  },
  {
    id: 'auto-renew-pattern',
    category: 'auto-renew',
    pattern: ci('auto-?renew(al|s|ed)?'),
    severity: 'high',
    weight: 7,
    description: 'Auto-renewal clause',
  },
  {
    id: 'auto-recurring',
    category: 'auto-renew',
    pattern: ci('recurring\\s+(billing|charge|payment)'),
    severity: 'high',
    weight: 6,
    description: 'Recurring billing or charges',
  },
  {
    id: 'auto-trial-convert',
    category: 'auto-renew',
    pattern: ci('(trial|free)[^.]{0,50}convert(s)?\\s+(to|into)\\s+(a\\s+)?(paid|subscription)'),
    severity: 'high',
    weight: 8,
    description: 'Trial converts to paid subscription',
  },
  {
    id: 'auto-cancel-before',
    category: 'auto-renew',
    pattern: ci('cancel[^.]{0,30}before[^.]{0,30}renewal'),
    severity: 'medium',
    weight: 5,
    description: 'Must cancel before renewal date',
  },
  {
    id: 'auto-charged-until',
    category: 'auto-renew',
    pattern: ci('(will\\s+be|are)\\s+charged[^.]{0,50}until\\s+(you\\s+)?cancel'),
    severity: 'high',
    weight: 6,
    description: 'Charges continue until you cancel',
  },
  {
    id: 'auto-no-refund',
    category: 'auto-renew',
    pattern: ci('no\\s+refunds?\\s+(will\\s+be\\s+)?(provided|given|issued)'),
    severity: 'medium',
    weight: 5,
    description: 'No refunds policy',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA SHARING / SELLING (High severity)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'data-share-third',
    category: 'data-sharing',
    pattern: ci('share[^.]{0,50}(with\\s+)?(third\\s+part(y|ies)|partners?|affiliates?)'),
    severity: 'high',
    weight: 7,
    description: 'Shares data with third parties, partners, or affiliates',
  },
  {
    id: 'data-sell-personal',
    category: 'data-sharing',
    pattern: ci('sell[^.]{0,30}(personal\\s+(information|data)|your\\s+(data|information))'),
    severity: 'critical',
    weight: 10,
    description: 'May sell your personal information',
    critical: true,
  },
  {
    id: 'data-advertising',
    category: 'data-sharing',
    pattern: ci('(advertising|ad)\\s+partners'),
    severity: 'high',
    weight: 6,
    description: 'Shares data with advertising partners',
  },
  {
    id: 'data-analytics',
    category: 'data-sharing',
    pattern: ci('analytics\\s+providers'),
    severity: 'medium',
    weight: 4,
    description: 'Shares data with analytics providers',
  },
  {
    id: 'data-disclose',
    category: 'data-sharing',
    pattern: ci('(may|will)\\s+disclose[^.]{0,50}(to\\s+)?(third\\s+part|government|law\\s+enforcement)'),
    severity: 'medium',
    weight: 5,
    description: 'May disclose data to third parties or authorities',
  },
  {
    id: 'data-transfer',
    category: 'data-sharing',
    pattern: ci('transfer[^.]{0,30}(your\\s+)?(personal\\s+)?(data|information)[^.]{0,30}(to|outside)'),
    severity: 'medium',
    weight: 5,
    description: 'May transfer your data',
  },
  {
    id: 'data-marketing',
    category: 'data-sharing',
    pattern: ci('(use|share)[^.]{0,30}(your\\s+)?(data|information)[^.]{0,30}marketing'),
    severity: 'high',
    weight: 6,
    description: 'Uses your data for marketing purposes',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // DATA RETENTION / DELETION LIMITS (Medium-High severity)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'ret-long',
    category: 'data-retention',
    pattern: ci('retain[^.]{0,50}as\\s+long\\s+as'),
    severity: 'medium',
    weight: 5,
    description: 'May retain data for extended periods',
  },
  {
    id: 'ret-indefinitely',
    category: 'data-retention',
    pattern: ci('(retain|store|keep)[^.]{0,30}indefinitely'),
    severity: 'high',
    weight: 7,
    description: 'May retain data indefinitely',
  },
  {
    id: 'ret-legal-business',
    category: 'data-retention',
    pattern: ci('for\\s+(legal|business|regulatory)\\s+purposes'),
    severity: 'low',
    weight: 3,
    description: 'Retains data for legal or business purposes',
  },
  {
    id: 'ret-continue-store',
    category: 'data-retention',
    pattern: ci('(may|will)\\s+continue\\s+to\\s+store'),
    severity: 'medium',
    weight: 5,
    description: 'May continue storing data after account closure',
  },
  {
    id: 'ret-after-deletion',
    category: 'data-retention',
    pattern: ci('(after|even\\s+if)[^.]{0,30}(delet|terminat|clos)[^.]{0,30}(retain|keep|store)'),
    severity: 'high',
    weight: 6,
    description: 'May retain data even after you request deletion',
  },
  {
    id: 'ret-backup',
    category: 'data-retention',
    pattern: ci('(backup|archive)[^.]{0,30}(copies|data)[^.]{0,30}(may|will|could)\\s+(remain|persist)'),
    severity: 'medium',
    weight: 4,
    description: 'Backup copies may persist after deletion',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // UNILATERAL CHANGES (Medium severity)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'change-anytime',
    category: 'unilateral-changes',
    pattern: ci('(we\\s+)?(may|can|reserve\\s+the\\s+right\\s+to)\\s+(modify|change|update|amend)[^.]{0,30}at\\s+any\\s+time'),
    severity: 'medium',
    weight: 5,
    description: 'Terms may be changed at any time',
  },
  {
    id: 'change-without-notice',
    category: 'unilateral-changes',
    pattern: ci('without\\s+(prior\\s+)?notice'),
    severity: 'high',
    weight: 6,
    description: 'Changes may be made without notice',
  },
  {
    id: 'change-continued-use',
    category: 'unilateral-changes',
    pattern: ci('continued\\s+use[^.]{0,50}(constitutes|means|indicates)\\s+(acceptance|agreement)'),
    severity: 'medium',
    weight: 5,
    description: 'Continued use means you accept changes',
  },
  {
    id: 'change-sole-discretion',
    category: 'unilateral-changes',
    pattern: ci('(in\\s+)?(our|its)\\s+sole\\s+(and\\s+absolute\\s+)?discretion'),
    severity: 'medium',
    weight: 4,
    description: 'Company can make decisions at sole discretion',
  },
  {
    id: 'change-terminate',
    category: 'unilateral-changes',
    pattern: ci('(may|can|reserve[^.]{0,20}right[^.]{0,10})\\s+terminat[^.]{0,30}(at\\s+any\\s+time|without\\s+(cause|reason))'),
    severity: 'high',
    weight: 6,
    description: 'Service may be terminated at any time without cause',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // LIABILITY LIMITATION (Medium severity)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'liab-maximum',
    category: 'liability',
    pattern: ci('to\\s+the\\s+(maximum|fullest)\\s+extent\\s+permitted'),
    severity: 'medium',
    weight: 4,
    description: 'Limits liability to maximum extent permitted by law',
  },
  {
    id: 'liab-limitation',
    category: 'liability',
    pattern: ci('limitation\\s+of\\s+liability'),
    severity: 'medium',
    weight: 4,
    description: 'Liability limitation clause',
  },
  {
    id: 'liab-not-liable',
    category: 'liability',
    pattern: ci('(shall\\s+)?not\\s+(be\\s+)?(liable|responsible)\\s+for'),
    severity: 'medium',
    weight: 4,
    description: 'Disclaims liability for certain issues',
  },
  {
    id: 'liab-damages',
    category: 'liability',
    pattern: ci('(consequential|incidental|punitive|indirect|special)\\s+damages'),
    severity: 'medium',
    weight: 4,
    description: 'Excludes certain types of damages',
  },
  {
    id: 'liab-warranty',
    category: 'liability',
    pattern: ci('(disclaim|exclude)[^.]{0,30}warrant(y|ies)'),
    severity: 'medium',
    weight: 4,
    description: 'Disclaims warranties',
  },
  {
    id: 'liab-as-is',
    category: 'liability',
    pattern: ci('"?as\\s+is"?\\s+(and\\s+"?as\\s+available"?)?\\s+basis'),
    severity: 'low',
    weight: 3,
    description: 'Service provided "as is" without guarantees',
  },
  {
    id: 'liab-indemnify',
    category: 'liability',
    pattern: ci('(you\\s+)?(agree\\s+to\\s+)?indemnify[^.]{0,50}(us|company|service)'),
    severity: 'medium',
    weight: 5,
    description: 'Requires you to indemnify the company',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // GOVERNING LAW / VENUE (Low-Medium severity)
  // ═══════════════════════════════════════════════════════════════════════════
  {
    id: 'gov-laws',
    category: 'governing-law',
    pattern: ci('governed\\s+by\\s+the\\s+laws\\s+of'),
    severity: 'low',
    weight: 2,
    description: 'Specifies governing law jurisdiction',
  },
  {
    id: 'gov-exclusive',
    category: 'governing-law',
    pattern: ci('exclusive\\s+(jurisdiction|venue)'),
    severity: 'medium',
    weight: 4,
    description: 'Requires disputes in specific jurisdiction',
  },
  {
    id: 'gov-venue',
    category: 'governing-law',
    pattern: ci('venue[^.]{0,30}shall\\s+be'),
    severity: 'low',
    weight: 3,
    description: 'Specifies legal venue',
  },
  {
    id: 'gov-waive-venue',
    category: 'governing-law',
    pattern: ci('waive[^.]{0,30}(objection|right)[^.]{0,30}venue'),
    severity: 'medium',
    weight: 5,
    description: 'Waives right to object to venue',
  },
];

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: ClauseCategory): ClausePattern[] {
  return CLAUSE_PATTERNS.filter(p => p.category === category);
}

/**
 * Get all critical patterns
 */
export function getCriticalPatterns(): ClausePattern[] {
  return CLAUSE_PATTERNS.filter(p => p.critical);
}

/**
 * Get pattern by ID
 */
export function getPatternById(id: string): ClausePattern | undefined {
  return CLAUSE_PATTERNS.find(p => p.id === id);
}

// URL keywords that suggest a legal page
export const LEGAL_URL_KEYWORDS = [
  'terms',
  'tos',
  'privacy',
  'policy',
  'legal',
  'agreement',
  'conditions',
  'cookies',
  'data-processing',
  'gdpr',
  'ccpa',
  'eula',
  'disclaimer',
  'notices',
];

// Title/H1 keywords that suggest a legal page
export const LEGAL_TITLE_KEYWORDS = [
  'terms',
  'privacy',
  'policy',
  'agreement',
  'legal',
  'conditions',
  'notice',
  'disclaimer',
  'cookie',
  'data protection',
];
