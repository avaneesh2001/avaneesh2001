from pathlib import Path
p=Path('src/styles/global.css')
s=p.read_text()
s+='''
/* Native page transitions preserve normal navigation and page initialization. */
@media (prefers-reduced-motion: no-preference) {
  @view-transition {
    navigation: auto;
  }

  ::view-transition-old(root),
  ::view-transition-new(root) {
    animation-duration: 180ms;
    animation-timing-function: ease-out;
  }
}

@media (prefers-reduced-motion: reduce) {
  @view-transition {
    navigation: none;
  }

  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
'''
p.write_bytes(s.encode())
