# Optimization Notes

These are the most impactful decisions we made while sharpening the extension for real-world AI-assisted workflows:

1. **Selector quality**
   - Added stable attribute prioritization, class filtering, XPath fallback, and candidate scoring.
   - Report exact match counts plus a 0-100 confidence value so users know when to choose a fallback.

2. **Interaction robustness**
   - Swapped click targets from `e.target` to `composedPath()` and added meaningful-node heuristics so icons/spans no longer steal focus.
   - `Alt + Click` jumps to the parent element while `ESC` exits selection cleanly.
   - `all_frames: true` lets the script work inside iframes and visual overlays.

3. **Visual clarity**
   - Rebuilt the popup, notification, and banner styles with gradients, softened shadows, and modular sections to highlight status, actions, and copy/candidates.
   - Textareas gain improved spacing, typography, and focus feedback for easier editing.

4. **Documentation & onboarding**
   - README/QUICKSTART/EXAMPLES now share bilingual messaging and actionable flows tailored to beginners.
   - CHECKLIST and CHANGELOG describe expectations for cloning, verification, and release history.

What’s next: consider adding automated tests for the locator engine and packaging scripts for browser stores once the next release vehicle is defined.
