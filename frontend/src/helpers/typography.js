export const capitalizeFirst = (lower) => lower.replace(/^\w/, c => c.toUpperCase())
export const removeUnderscore = (target, replacement = ' ') => target.replace(/_/gm, replacement)