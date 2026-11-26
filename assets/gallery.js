(() => {
  const track = document.querySelector('.gallery-track');
  const previous = document.querySelector('[data-gallery-step="-1"]');
  const next = document.querySelector('[data-gallery-step="1"]');
  const previewPosition = document.querySelector('.gallery-preview-position');
  const dialog = document.querySelector('.gallery-dialog');
  const dialogPrevious = dialog.querySelector('[data-dialog-step="-1"]');
  const dialogNext = dialog.querySelector('[data-dialog-step="1"]');
  const position = dialog.querySelector('.gallery-position');
  const photo = dialog.querySelector('.gallery-photo');
  const fullImage = photo.querySelector('img');
  const caption = dialog.querySelector('#gallery-caption');
  const thumbs = [...track.querySelectorAll('.gallery-thumb')];
  let currentPhoto = 0;
  let previewPhoto = 0;

  // Reserve each photo's final size before lazy-loaded images arrive.
  for (const thumb of thumbs) {
    const image = thumb.querySelector('img');
    const width = Number(image.getAttribute('width'));
    const height = Number(image.getAttribute('height'));
    image.style.width = `min(${150 * width / height}px, 55vw, 400px)`;
    image.style.aspectRatio = `${width} / ${height}`;
  }

  // Copies on both sides keep the neighbouring photos visible across the loop.
  const originalItems = [...track.children];
  function copyItems() {
    return originalItems.map(item => {
      const copy = item.cloneNode(true);
      copy.setAttribute('aria-hidden', 'true');
      copy.querySelector('button').tabIndex = -1;
      return copy;
    });
  }
  track.prepend(...copyItems());
  track.append(...copyItems());
  const allThumbs = [...track.querySelectorAll('.gallery-thumb')];

  function centredThumb() {
    const centre = track.getBoundingClientRect().left + track.clientWidth / 2;
    return allThumbs.reduce((closest, thumb) => {
      const rect = thumb.getBoundingClientRect();
      const distance = Math.abs(rect.left + rect.width / 2 - centre);
      return distance < closest.distance ? { thumb, distance } : closest;
    }, { thumb: thumbs[0], distance: Infinity }).thumb;
  }

  function centrePhoto(index) {
    previewPhoto = index;
    previewPosition.textContent = `Photo ${index + 1} of ${thumbs.length}`;
    const thumb = thumbs[index];
    const centre = track.getBoundingClientRect().left + track.clientWidth / 2;
    const rect = thumb.getBoundingClientRect();
    track.scrollTo({ left: track.scrollLeft + rect.left + rect.width / 2 - centre });
  }

  previous.removeAttribute('aria-disabled');
  next.removeAttribute('aria-disabled');

  for (const arrow of [previous, next]) {
    arrow.addEventListener('click', () => {
      previewPhoto = (previewPhoto + Number(arrow.dataset.galleryStep) + thumbs.length) % thumbs.length;
      centrePhoto(previewPhoto);
    });
  }

  track.addEventListener('scroll', () => {
    const thumb = centredThumb();
    previewPhoto = allThumbs.indexOf(thumb) % thumbs.length;
    previewPosition.textContent = `Photo ${previewPhoto + 1} of ${thumbs.length}`;
    if (!thumbs.includes(thumb)) centrePhoto(previewPhoto);
  }, { passive: true });
  new ResizeObserver(() => {
    centrePhoto(previewPhoto);
  }).observe(track);
  centrePhoto(0);

  function showPhoto(index) {
    index = (index + thumbs.length) % thumbs.length;

    currentPhoto = index;
    const thumb = thumbs[index];
    const image = thumb.querySelector('img');
    const postUrl = thumb.dataset.instagramUrl?.trim();
    fullImage.src = image.currentSrc || image.src;
    fullImage.alt = image.alt;
    caption.replaceChildren(document.getElementById(thumb.dataset.captionId).content.cloneNode(true));
    if (postUrl) {
      photo.href = postUrl;
    } else {
      if (document.activeElement === photo) dialogNext.focus();
      photo.removeAttribute('href');
    }
    position.textContent = `Photo ${index + 1} of ${thumbs.length}`;
  }

  for (const arrow of [dialogPrevious, dialogNext]) {
    arrow.addEventListener('click', () => showPhoto(currentPhoto + Number(arrow.dataset.dialogStep)));
  }

  dialog.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;

    event.preventDefault();
    showPhoto(currentPhoto + (event.key === 'ArrowLeft' ? -1 : 1));
  });

  allThumbs.forEach((thumb, itemIndex) => {
    const index = itemIndex % thumbs.length;
    thumb.addEventListener('focus', () => {
      if (thumb.matches(':focus-visible')) centrePhoto(index);
    });
    thumb.addEventListener('click', () => {
      thumbs[index].focus({ preventScroll: true });
      showPhoto(index);
      dialog.showModal();
    });
  });
})();
