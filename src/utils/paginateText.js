const PAGE_PADDING = 48;
const PAGE_SAFETY_BUFFER = 80;

export function paginateParagraphs({
  paragraphs,
  containerWidth,
  containerHeight,
  fontSize
}) {
  if (!paragraphs?.length || !containerWidth || !containerHeight) {
    return [];
  }

  const usableHeight = containerHeight - PAGE_SAFETY_BUFFER;

  const measurer = document.createElement('div');

  measurer.style.position = 'absolute';
  measurer.style.visibility = 'hidden';
  measurer.style.pointerEvents = 'none';
  measurer.style.left = '-9999px';
  measurer.style.top = '0';
  measurer.style.width = `${containerWidth}px`;
  measurer.style.fontSize = `${fontSize}px`;
  measurer.style.lineHeight = '1.7';
  measurer.style.fontFamily = 'inherit';
  measurer.style.padding = `${PAGE_PADDING}px`;
  measurer.style.boxSizing = 'border-box';

  document.body.appendChild(measurer);

  const pages = [];
  let currentPage = [];

  for (const paragraph of paragraphs) {
    const testPage = [...currentPage, paragraph];

    measurer.innerHTML = testPage
      .map((text) => `<p>${escapeHtml(text)}</p>`)
      .join('');

    const tooTall = measurer.scrollHeight > usableHeight;

    if (tooTall && currentPage.length) {
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
