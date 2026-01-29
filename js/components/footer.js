export default function Footer() {
  const year = new Date().getFullYear();

  return `
    <div class="site-footer">
      <p class="site-footer__text">
        &copy; ${year} Client Name. All rights reserved.
      </p>
      <p class="site-footer__text site-footer__muted">
        Built for the Noroff FED1 semester exam.
      </p>
    </div>
  `;

}