/**
 * Profanity filter for chat messages.
 */
export class ProfanityFilter {
    // Profanity regex patterns - converted from ActionScript
    private static readonly filters: RegExp[] = [
        /([5s][\W_]*)+?[\W_]*(h[\W_]*)+?[\W_]*([1i][\W_]*)+?[\W_]*([7t][\W_]*)+?[\W_]*((([5sz][\W_]*)+?|(d[\W_]*)+?)[\W_]*|([3e][\W_]*)+?[\W_]*(([5sz][\W_]*)+?|(d[\W_]*)+?|(r[\W_]*)+?)[\W_]*|([1i][\W_]*)+?[\W_]*(n[\W_]*)+?[\W_]*([69g][\W_]*)+?[\W_]*)?/gi,
        /(b[\W_]*)+?[\W_]*([1i][\W_]*)+?[\W_]*([7t][\W_]*)+?[\W_]*(c[\W_]*)+?[\W_]*(h[\W_]*)+?[\W_]*((([5sz][\W_]*)+?|(d[\W_]*)+?)[\W_]*|([3e][\W_]*)+?[\W_]*(([5sz][\W_]*)+?|(d[\W_]*)+?|(r[\W_]*)+?)[\W_]*|([1i][\W_]*)+?[\W_]*(n[\W_]*)+?[\W_]*([69g][\W_]*)+?[\W_]*)?/gi,
        /\b[4@a]r[5s][3e]h[0o][1l][3e]s?\b/gi,
        /\b[4@a][5s][5s]h[0o][1l][3e]s?\b/gi,
        /\bcun[7t]s?\b/gi,
        /\bd[1i]ckh[3e][4@a]ds?\b/gi,
        /\bf[4@a]nny\b/gi,
        /\bp[3e]n[1i][5s](es)?\b/gi,
        /\b[5s]k[4@a]nks?\b/gi,
        /\b[7t]w[4@a][7t]\b/gi,
        /\bv[4@a][69g][1i]n[4@a]\b/gi,
        /\bc[0o][0o]ns?\b/gi,
        /\bh[0o]m[0o]s?\b/gi,
        /\b[5s]p[1i]c\b/gi,
        /\bch[1i]nk\b/gi,
        /\bsh[yi]t\b/gi,
        /\bfuk\b/gi,
        /\bfukt\b/gi,
        /\bkkk\b/gi
    ];

    constructor() {}

    /**
     * Filter profanity from a message, replacing matches with asterisks.
     */
    public static filterMessage(message: string): string {
        let result = message;
        for (const filter of ProfanityFilter.filters) {
            result = result.replace(filter, ProfanityFilter.replaceFunction);
        }
        return result;
    }

    /**
     * Replace matched characters with asterisks.
     */
    private static replaceFunction(match: string): string {
        return match.replace(/\S/g, "*");
    }
}
