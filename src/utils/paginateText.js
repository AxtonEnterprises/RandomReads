const PAGE_SAFETY_BUFFER = 140;
const MAX_CHUNK_LENGTH = 650;

export function paginateParagraphs({
  paragraphs,
  containerWidth,
  containerHeight,
  fontSize
}) {
  if (!paragraphs?.length || !containerWidth || !containerHeight) {
    return [];
  }

  const readableBlocks = splitLongParagraphs(paragraphs);
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
  measurer.style.padding = '32px';
  measurer.style.boxSizing = 'border-box';

  document.body.appendChild(measurer);

  const pages = [];
  let currentPage = [];

  for (const block of readableBlocks) {
    const testPage = [...currentPage, block];

    measurer.innerHTML = testPage
      .map((text) => `<p style="margin:0 0 1.2em;">${escapeHtml(text)}</p>`)
      .join('');

    if (measurer.scrollHeight > usableHeight && currentPage.length) {
      pages.push(currentPage);
      currentPage = [block];
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

function splitLongParagraphs(paragraphs) {
  const blocks = [];

  for (const paragraph of paragraphs) {
    if (paragraph.length <= MAX_CHUNK_LENGTH) {
      blocks.push(paragraph);
      continue;
    }

    const sentences = paragraph.match(/[^.!?]+[.!?]+["”']?|.+$/g) || [paragraph];
    let chunk = '';

    for (const sentence of sentences) {
      const nextChunk = `${chunk} ${sentence}`.trim();

      if (nextChunk.length > MAX_CHUNK_LENGTH && chunk) {
        blocks.push(chunk);
        chunk = sentence.trim();
      } else {
        chunk = nextChunk;
      }
    }

    if (chunk) {
      blocks.push(chunk);
    }
  }

  return blocks;
}

function escapeHtml(text) {
  return String(text)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
