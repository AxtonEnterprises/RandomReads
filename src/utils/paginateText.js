export function paginateParagraphs({
  paragraphs,
  containerWidth,
  containerHeight,
  fontSize
}) {
  if (!paragraphs?.length || !containerWidth || !containerHeight) {
    return [];
  }

  const measurer = document.createElement('div');

  measurer.style.position = 'absolute';
  measurer.style.visibility = 'hidden';
  measurer.style.pointerEvents = 'none';
  measurer.style.width = `${containerWidth}px`;
  measurer.style.fontSize = `${fontSize}px`;
  measurer.style.lineHeight = '1.7';
  measurer.style.fontFamily = 'inherit';
  measurer.style.padding = '32px';
  measurer.style.boxSizing = 'border-box';

  document.body.appendChild(measurer);

  const pages = [];
  let currentPage = [];

  for (const paragraph of paragraphs) {
    const testPage = [...currentPage, paragraph];

    measurer.innerHTML = testPage
      .map((text) => `<p>${escapeHtml(text)}</p>`)
      .join('');

    if (measurer.scrollHeight > containerHeight && currentPage.length) {
      pages.push(currentPage);
      currentPage = [paragraph];
    } else {
      currentPage = testPage;
    }
  }

  if (currentPage.length) {
    pages.push(currentPage);
  }

  document.body.removeChild(measurer);

  return pages;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
