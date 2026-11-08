class SiteFooter extends HTMLElement {
  connectedCallback() {
    const year = new Date().getFullYear();
    this.innerHTML = `
      <footer class="container foot">
        <span>© ${year} Hi Kit Ltd</span>
        <nav aria-label="Footer">
          <a href="/#contact">Contact</a>
          <a href="/privacy-policy.html">Privacy policy</a>
          <a href="https://sorted.marketing/" target="_blank" rel="noopener noreferrer">Marketing by Sorted.Marketing</a>
        </nav>
      </footer>
    `;
  }
}

customElements.define('site-footer', SiteFooter);
