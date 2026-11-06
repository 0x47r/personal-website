/* Render only repository-owned Markdown. The local Marked copy needs no CDN or build. */
(() => {
  const content = document.getElementById('project-content');
  if (!content) return;
  const source = content.dataset.markdown;
  const allowedTags = new Set(['P', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'A', 'IMG',
    'STRONG', 'EM', 'DEL', 'CODE', 'PRE', 'BLOCKQUOTE', 'UL', 'OL', 'LI', 'HR', 'BR',
    'TABLE', 'THEAD', 'TBODY', 'TR', 'TH', 'TD', 'SUP', 'SUB']);

  function safeMarkdown(markdown) {
    const template = document.createElement('template');
    template.innerHTML = marked.parse(markdown, { async: false, gfm: true });
    for (const element of [...template.content.querySelectorAll('*')]) {
      if (!allowedTags.has(element.tagName)) {
        // Drop unknown elements and their contents, including executable HTML.
        element.remove();
        continue;
      }
      for (const attribute of [...element.attributes]) {
        const permitted = (element.tagName === 'A' && ['href', 'title'].includes(attribute.name)) ||
          (element.tagName === 'IMG' && ['src', 'alt', 'title'].includes(attribute.name)) ||
          (element.tagName === 'OL' && attribute.name === 'start');
        if (!permitted) element.removeAttribute(attribute.name);
      }
      for (const attribute of ['href', 'src']) {
        if (element.hasAttribute(attribute)) {
          const url = new URL(element.getAttribute(attribute), location.href);
          if (!['http:', 'https:'].includes(url.protocol)) element.removeAttribute(attribute);
        }
      }
      if (element.tagName === 'IMG') element.loading = 'lazy';
    }
    return template.content;
  }

  async function render() {
    try {
      const response = await fetch(source);
      if (!response.ok) throw new Error('Markdown unavailable');
      content.replaceChildren(safeMarkdown(await response.text()));
    } catch {
      const message = document.createElement('p');
      message.textContent = 'The summary could not be loaded. ';
      const link = document.createElement('a');
      link.href = source;
      link.textContent = 'Read the Markdown source';
      message.append(link);
      content.replaceChildren(message);
    }
  }
  render();
})();
