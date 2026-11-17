from pathlib import Path
p=Path('src/layouts/BaseLayout.astro'); s=p.read_text(); s=s.replace('<main id="main-content">','<main id="main-content" tabindex="-1">'); start=s.index('      const revealElements'); end=s.index('      document.querySelectorAll("[data-fallback-image]"',start); s=s[:start]+s[end:]; s=s.replace('if (dialog instanceof HTMLDialogElement) dialog.showModal();','''if (dialog instanceof HTMLDialogElement) {
            dialog.showModal();
            dialog.addEventListener("close", () => trigger.focus(), { once: true });
          }'''); s=s.replace('if (event.target === dialog) dialog.close();','''if (event.target !== dialog) return;
          const bounds = dialog.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right ||
              event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();'''); p.write_text(s)
p=Path('src/components/Navigation.astro');s=p.read_text().replace('  if (href === "/") return normalizedCurrentPath === "/";\n  return normalizedCurrentPath.startsWith(href);','  const path = withoutBase(href);\n  if (path === "/") return normalizedCurrentPath === "/";\n  return normalizedCurrentPath === path || normalizedCurrentPath.startsWith(`${path.replace(/\\/$/, "")}/`);');p.write_text(s)
p=Path('src/pages/skills.astro');s=p.read_text().replace('type="button" data-skill-dialog-trigger={dialogId}','type="button" aria-haspopup="dialog" aria-controls={dialogId} data-skill-dialog-trigger={dialogId}').replace('data-skill-dialog>','aria-labelledby={`${dialogId}-title`} aria-describedby={`${dialogId}-description`} data-skill-dialog>').replace('<h3>{skill.skill_name}</h3>','<h3 id={`${dialogId}-title`}>{skill.skill_name}</h3>').replace('<p>{skill.short_context}</p>','<p id={`${dialogId}-description`}>{skill.short_context}</p>').replace('data-skill-dialog-close>x','data-skill-dialog-close autofocus>×');p.write_text(s)
p=Path('src/pages/projects.astro');s=p.read_text().replace('label="Project visual"','label={`${project.project_title} project preview`}').replace('<a href={link.href}>{link.label}</a>','<a href={link.href} aria-label={`${link.label}: ${project.project_title}`}>{link.label}</a>');p.write_text(s)
p=Path('src/pages/activities.astro');s=p.read_text().replace('label="Activity photo"','label={imageEntry.caption || activity.title}');p.write_text(s)
p=Path('src/pages/experience.astro');s=p.read_text().replace('<summary>Read deeper notes</summary>','<summary>Read deeper notes<span class="visually-hidden"> about {entry.role_title} at {entry.organization_name}</span></summary>');p.write_text(s)
p=Path('src/styles/global.css');s=p.read_text().replace('--gold: #9a7430;','--gold: #75551f;').replace('outline: 3px solid color-mix(in srgb, var(--accent), white 18%);','outline: 3px solid var(--accent);').replace('body {\n  margin: 0;\n  min-width: 320px;','body {\n  margin: 0;\n  overflow-wrap: anywhere;').replace('[data-reveal] {\n  opacity: 0;\n  transform: translateY(18px);','[data-reveal] {\n  opacity: 1;\n  transform: none;');s+='''
/* Keep controls and content usable with keyboard, touch, zoom and forced colors. */
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}
main { scroll-margin-top: 8rem; }
.navigation :focus-visible { outline-color: #fbf7ee; }
.nav-link, .skill-dialog-close { min-width: 44px; min-height: 44px; }
.nav-link { display: inline-flex; align-items: center; }
summary { min-height: 44px; cursor: pointer; }
.text-link-row a, .footer-links a {
  display: inline-flex;
  align-items: center;
  min-height: 44px;
}
.text-link-row a, .footer-links a, .contact-links a {
  text-decoration: underline;
  text-underline-offset: 0.2em;
}
.skill-dialog { overflow-y: auto; overscroll-behavior: contain; }
@media (max-width: 920px), (max-height: 500px) {
  .navigation-frame { position: relative; }
  main { scroll-margin-top: 1rem; }
}
@media (forced-colors: active) {
  :focus-visible { outline: 3px solid Highlight; }
  .nav-link[aria-current="page"] { border: 2px solid currentColor; }
  .button, .skill-dialog, .skill-dialog-close { border: 1px solid ButtonText; }
}
''';p.write_text(s)
print('Accessibility updates applied.')
