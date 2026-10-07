html_path = 'c:/Users/dell/meta/frontend/index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

script = """
<script>
  window.addEventListener('DOMContentLoaded', () => {
    const loginLinks = document.querySelectorAll('a[href="/login"]');
    loginLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.history.pushState({}, '', '/login');
        window.dispatchEvent(new Event('popstate'));
      });
    });
  });
</script>
"""

if "window.history.pushState({}, '', '/login');" not in html:
    html = html.replace('</body>', script + '\n</body>')
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
