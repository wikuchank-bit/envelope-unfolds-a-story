<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep the anniversary experience in its existing screen flow; isolate the interactive garden in its own component and pure rules module so animations and petal outcomes can be tested independently.
- Project mathematical heart Y coordinates with an inverted screen axis so the 3D heart's lobes render above its tip.
- Render the memory book with dynamically imported Three.js CSS3DRenderer and React portals so true 3D hinges retain accessible, readable photo and text content without server-side browser imports.
- Keep scrapbook pages, letter entries, and fireworks timing in a browser-safe data module; mount new animated sections only when active to clean up timers and animation loops.
