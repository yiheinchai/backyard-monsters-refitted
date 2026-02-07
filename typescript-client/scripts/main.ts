/**
 * Main entry point for Backyard Monsters Refitted client.
 * Bootstraps OpenFL and renders the isometric base.
 */
import { bootstrapRenderer } from './IsometricRenderer';

// Start when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrapRenderer);
} else {
    bootstrapRenderer();
}

