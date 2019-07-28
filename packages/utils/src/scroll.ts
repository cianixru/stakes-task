export function scrollTo(el: Element, top: number): void {
  if (isDocumentElement(el)) {
    window.scrollTo(0, top);
    return;
  }

  el.scrollTop = top;
}

export function isDocumentElement(el: Element) {
  return [document.documentElement, document.body, window].indexOf(el) > -1;
}

export function scrollIntoView(
  menuEl: HTMLElement,
  focusedEl: HTMLElement,
): void {
  const menuRect = menuEl.getBoundingClientRect()
  const focusedRect = focusedEl.getBoundingClientRect()
  const overScroll = 0

  if (focusedRect.bottom + overScroll > menuRect.bottom) {
    scrollTo(
      menuEl,
      Math.min(
        focusedEl.offsetTop +
          focusedEl.clientHeight -
          menuEl.offsetHeight +
          overScroll,
        menuEl.scrollHeight
      )
    )
  } else if (focusedRect.top - overScroll < menuRect.top) {
    scrollTo(menuEl, Math.max(focusedEl.offsetTop - overScroll, 0))
  }
}
