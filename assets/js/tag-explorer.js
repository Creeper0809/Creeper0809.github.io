(() => {
  const explorer = document.querySelector('[data-tag-explorer]');
  if (!explorer) return;

  const search = explorer.querySelector('#tag-search');
  const searchStatus = explorer.querySelector('[data-tag-search-status]');
  const featured = explorer.querySelector('[data-tag-featured]');
  const directory = explorer.querySelector('[data-tag-directory]');
  const filters = explorer.querySelector('[data-tag-filters]');
  const fields = [...explorer.querySelectorAll('[data-tag-filter]')];
  const results = explorer.querySelector('[data-tag-results]');
  const heading = results.querySelector('h2');
  const resultsStatus = results.querySelector('[data-tag-results-status]');
  const posts = results.querySelector('[data-tag-posts]');
  const more = results.querySelector('[data-tag-more]');
  const pageSize = 25;

  const normalize = (text) => text.normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, '');
  const tags = new Map([...directory.querySelectorAll('[data-tag-entry]')].map((entry) => {
    const name = entry.querySelector('[data-tag-name]').textContent.trim();
    return [entry.dataset.tagEntry, { name, searchName: normalize(name), group: entry.dataset.tagGroup, entry }];
  }));
  const aliases = new Map([...explorer.querySelectorAll('[data-tag-alias]')].map((alias) => (
    [alias.id, alias.dataset.tagAlias]
  )));
  const relocations = new Map([...explorer.querySelectorAll('[data-tag-relocation]')].map((link) => (
    [link.id, link.href]
  )));
  const sections = new Map([...explorer.querySelectorAll('[data-tag-section]')].map((section) => (
    [section.id, section]
  )));
  const links = explorer.querySelectorAll('[data-tag-link]');
  const postIndex = new Map();
  let topic = '';
  let visibleCount = pageSize;
  let wasSearching = false;
  let directoryWasOpen = false;

  function updateDirectory() {
    const query = normalize(search.value);
    const isSearching = Boolean(query);
    if (isSearching && !wasSearching) directoryWasOpen = directory.open;
    if (isSearching) directory.open = true;
    if (!isSearching && wasSearching) directory.open = directoryWasOpen;
    wasSearching = isSearching;
    featured.hidden = isSearching;

    let count = 0;
    for (const tag of tags.values()) {
      const matches = isSearching ? tag.searchName.includes(query) : tag.group === 'topic';
      tag.entry.hidden = !matches;
      if (matches) count += 1;
    }
    searchStatus.hidden = !isSearching;
    searchStatus.textContent = count ? `태그 ${count}개` : '일치하는 태그가 없습니다.';
  }

  function postsFor(slug) {
    if (!postIndex.has(slug)) {
      const links = sections.get(slug)?.querySelectorAll('li a') || [];
      postIndex.set(slug, new Map([...links].map((link) => [link.href, link.textContent.trim()])));
    }
    return postIndex.get(slug);
  }

  function selectedTags() {
    return [topic, ...fields.map((field) => field.value)].filter(Boolean);
  }

  function updateResults() {
    const slugs = selectedTags();
    const selected = new Set(slugs);
    for (const link of links) {
      if (selected.has(link.dataset.tagLink)) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }

    results.hidden = slugs.length === 0;
    if (!slugs.length) return;

    const [first, ...others] = slugs.map(postsFor);
    const matches = [...first].filter(([url]) => others.every((group) => group.has(url)));
    const names = slugs.map((slug) => tags.get(slug).name).join(' · ');
    resultsStatus.textContent = matches.length ? `${names} (${matches.length}편)` : `${names}에 해당하는 글이 없습니다.`;

    const fragment = document.createDocumentFragment();
    for (const [url, title] of matches.slice(0, visibleCount)) {
      const item = document.createElement('li');
      const link = document.createElement('a');
      link.href = url;
      link.textContent = title;
      item.append(link);
      fragment.append(item);
    }
    posts.replaceChildren(fragment);
    more.hidden = matches.length <= visibleCount;
  }

  function fragmentTag() {
    try {
      return decodeURIComponent(window.location.hash.slice(1));
    } catch {
      return '';
    }
  }

  function readLocation() {
    const url = new URL(window.location.href);
    const fragment = fragmentTag();
    const slug = aliases.get(fragment) || fragment;
    const relocated = relocations.get(slug);
    if (relocated) {
      window.location.replace(relocated);
      return;
    }
    const group = tags.get(slug)?.group;
    topic = group === 'topic' ? slug : '';

    for (const field of fields) {
      const kind = field.dataset.tagFilter;
      const value = group === kind ? slug : url.searchParams.get(kind);
      field.value = tags.get(value)?.group === kind ? value : '';
    }
    if (fields.some((field) => field.value)) filters.open = true;
    visibleCount = pageSize;
    updateResults();
  }

  function writeLocation() {
    const url = new URL(window.location.href);
    for (const field of fields) {
      const key = field.dataset.tagFilter;
      if (field.value) url.searchParams.set(key, field.value);
      else url.searchParams.delete(key);
    }
    url.hash = topic;
    if (url.href !== window.location.href) window.history.pushState(null, '', url);
    visibleCount = pageSize;
    updateResults();
  }

  explorer.addEventListener('click', (event) => {
    const link = event.target.closest('[data-tag-link]');
    if (!link || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const slug = link.dataset.tagLink;
    const tag = tags.get(slug);
    if (!tag) return;

    event.preventDefault();
    event.stopPropagation();
    if (tag.group === 'topic') {
      topic = topic === slug ? '' : slug;
    } else {
      const field = fields.find((field) => field.dataset.tagFilter === tag.group);
      field.value = field.value === slug ? '' : slug;
      filters.open = true;
    }
    writeLocation();
    if (!results.hidden) heading.focus();
  });

  for (const field of fields) field.addEventListener('change', writeLocation);
  search.addEventListener('input', updateDirectory);
  explorer.querySelector('[data-tag-reset]').addEventListener('click', () => {
    topic = '';
    for (const field of fields) field.value = '';
    writeLocation();
    search.focus();
  });
  more.addEventListener('click', () => {
    const firstNewItem = visibleCount;
    visibleCount += pageSize;
    updateResults();
    posts.children[firstNewItem]?.firstElementChild.focus();
  });
  window.addEventListener('popstate', readLocation);
  window.addEventListener('hashchange', readLocation);

  updateDirectory();
  readLocation();
  explorer.querySelector('[data-tag-search]').hidden = false;
  if (filters) filters.hidden = false;
  explorer.dataset.enhanced = '';
  if (window.location.hash && !results.hidden) {
    requestAnimationFrame(() => results.scrollIntoView());
  }
})();
