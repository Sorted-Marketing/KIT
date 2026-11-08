class SiteHeader extends HTMLElement {
  connectedCallback() {
    const onHome = window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
    const base = onHome ? '' : '/';
    this.innerHTML = `
      <header class="container nav">
        <a href="/" aria-label="KIT home">
          <img src="/Kit.svg" alt="KIT" class="logo-img" width="127" height="48">
        </a>
        <nav class="navlinks" aria-label="Main">
          <a class="txt" href="${base}#how">How it works</a>
          <a class="txt" href="${base}#who">Who it's for</a>
          <a class="txt" href="${base}#pricing">Pricing</a>
          <a class="btn btn-light" href="${base}#pricing">Get early access</a>
        </nav>
      </header>
    `;
  }
}

customElements.define('site-header', SiteHeader);
