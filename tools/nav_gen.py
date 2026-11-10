# Genera el menú desplegable de todas las páginas. Uso: python3 tools/nav_gen.py .
# Lo que tiene status 'soon' no se muestra. Los textos en español están en public/js/nav.js.
import re, sys

ICONS = {
  'home': 'M3 11.5 12 4l9 7.5M5.5 10v10h13V10',
  'about': 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  'services': 'M3 7.5h18V20H3zM8.5 7.5V4.5h7v3M3 12.5h18',
  'process': 'M5 6h2m4 0h8M5 12h2m4 0h8M5 18h2m4 0h8',
  'faq': 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM9.6 9.3a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1.1 1-1.1 1.7M12 16.5h.01',
  'contact': 'M3.5 6h17v12h-17zM4 7l8 6 8-6',
  'chat': 'M21 11.5a8.4 8.4 0 0 1-12.4 7.4L3 21l2.1-5.6A8.5 8.5 0 1 1 21 11.5z',
  'auto': 'M4 7h11m0 0-3-3m3 3-3 3M20 17H9m0 0 3-3m-3 3 3 3',
  'web': 'M3 5h18v14H3zM3 9h18',
  'data': 'M4 20V10m6 10V4m6 16v-7m4 7H3',
  'post': 'M4 4h16v16H4zM9 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3zM20 15l-5-5L5 20',
  'insta': 'M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4zM12 16a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM17.5 6.5h.01',
  'story': 'M8 2.5h8a2 2 0 0 1 2 2v15a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-15a2 2 0 0 1 2-2zM10 5.5h4',
  'x': 'M5 4l14 16M19 4 5 20',
  'pin': 'M12 21.5s7-6.8 7-12.2A7 7 0 0 0 5 9.3c0 5.4 7 12.2 7 12.2zM12 11.5a2.2 2.2 0 1 0 0-4.4 2.2 2.2 0 0 0 0 4.4z',
  'agent': 'M8 4h8a3 3 0 0 1 3 3v7a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3zM9.5 10h.01M14.5 10h.01M9 20h6',
  'code': 'M8 9l-4 3 4 3m8-6 4 3-4 3M14 5l-4 14',
  'gear': 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19.4 13a7.6 7.6 0 0 0 0-2l2-1.6-2-3.4-2.4 1a7 7 0 0 0-1.7-1L15 3.5h-4l-.4 2.5a7 7 0 0 0-1.7 1l-2.4-1-2 3.4 2 1.6a7.6 7.6 0 0 0 0 2l-2 1.6 2 3.4 2.4-1a7 7 0 0 0 1.7 1l.4 2.5h4l.4-2.5a7 7 0 0 0 1.7-1l2.4 1 2-3.4z',
  'puzzle': 'M10 3.5a2 2 0 0 1 4 0V5h4v4h1.5a2 2 0 0 1 0 4H18v6H5v-6h1.5a2 2 0 0 0 0-4H5V5h5z',
  'gift': 'M20 12v9H4v-9M2 7h20v5H2zM12 21V7M12 7H7.5a2.5 2.5 0 1 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 1 0 0-5C13 2 12 7 12 7z',
  'book': 'M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5zM4 20.5A2.5 2.5 0 0 0 6.5 23H20v-5',
}
COLORS = {
  'blue': ('#5AA8FF', '#0650D6'), 'teal': ('#3CCFCF', '#0C8C99'), 'violet': ('#8B7CFF', '#4B3BD6'),
  'orange': ('#FF9B6A', '#D6531F'), 'green': ('#3BE07F', '#159947'), 'slate': ('#7F95B8', '#3A4F72'),
  'pink': ('#FF7DB0', '#D6336C'), 'sky': ('#6CC4FF', '#1479D6'),
}
CHEV = '<svg class="chev" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>'

def ico(name, color):
    g1, g2 = COLORS[color]
    return ('<span class="nav-ico" style="--g1:%s;--g2:%s"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" '
            'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="%s"></path></svg></span>') % (g1, g2, ICONS[name])

# (key, desc_key or None, icon, color, href or None (soon), status: 'ok'|'soon'|None, current_on)
MENUS = [
  ('home', 'navHome', 'Home', [
    ('mHome', 'mHomeD', 'home', 'blue', '{h}#inicio', None),
    ('mAbout', 'mAboutD', 'about', 'sky', '{h}#nosotros', None),
    ('mServices', 'mServicesD', 'services', 'violet', '{h}#servicios', None),
    ('mProcess', 'mProcessD', 'process', 'teal', '{h}#proceso', None),
    ('mFaq', 'mFaqD', 'faq', 'slate', '{h}#preguntas', None),
    ('mContact', 'mContactD', 'contact', 'green', '{h}#contacto', None),
  ]),
  ('design', 'navDesign', 'Graphic design', [
    ('dFb', 'dFbD', 'post', 'blue', '/design/', 'ok'),
    ('dCards', 'dCardsD', 'gift', 'pink', '/design/tarjetas/', None),
  ]),
  ('ai', 'navAI', 'AI development', [
    ('aiChat', 'aiChatD', 'chat', 'blue', '{h}#servicios', 'ok'),
    ('aiAuto', 'aiAutoD', 'auto', 'violet', None, 'soon'),
    ('aiWeb', 'aiWebD', 'web', 'teal', None, 'soon'),
    ('aiData', 'aiDataD', 'data', 'orange', None, 'soon'),
  ]),
  ('other', 'navOther', 'More', [
    ('oAgents', None, 'agent', 'blue', '{h}#servicios', None),
    ('oDev', None, 'code', 'teal', '{h}#servicios', None),
    ('oAuto', None, 'gear', 'slate', '{h}#servicios', None),
    ('oSolutions', None, 'puzzle', 'violet', '{h}#proceso', None),
    ('oResources', None, 'book', 'orange', '{h}#preguntas', None),
  ]),
]
EN = {  # texto inicial en el HTML (inglés); nav.js lo traduce
  'mHome': 'Home page', 'mHomeD': 'Back to the top', 'mAbout': 'About us', 'mAboutD': 'Who we are',
  'mServices': 'Services', 'mServicesD': 'What we build and design', 'mProcess': 'How we work', 'mProcessD': 'From the first call to delivery',
  'mFaq': 'FAQ', 'mFaqD': 'Quick answers', 'mContact': 'Contact us', 'mContactD': 'WhatsApp or email',
  'aiChat': 'AI chatbots and agents', 'aiChatD': 'They serve your customers on your website and WhatsApp',
  'aiAuto': 'Process automation', 'aiAutoD': 'Repetitive tasks that run on their own',
  'aiWeb': 'Websites and apps', 'aiWebD': 'Fast sites, ready to sell', 'aiData': 'Data and dashboards', 'aiDataD': 'Your numbers in clear dashboards',
  'dFb': 'Social media posts', 'dFbD': 'Facebook, Instagram, TikTok and all your networks', 'dIg': 'Instagram posts', 'dIgD': 'For your account’s feed',
  'dStories': 'Instagram and Facebook Stories', 'dStoriesD': 'Full-screen vertical format', 'dX': 'Posts for X', 'dXD': 'Images for your posts',
  'dCards': 'Birthday cards and more', 'dCardsD': 'Invitations, congratulations, Christmas, thank-you cards and diplomas',
  'dPin': 'Pinterest pins', 'dPinD': 'Vertical images for Pinterest',
  'oAgents': 'AI Agents', 'oDev': 'Development', 'oAuto': 'Automation', 'oSolutions': 'Solutions', 'oResources': 'Resources',
  'ok': 'Available', 'soon': 'Coming soon',
}

def build(h, current, page):
    out = ['<nav class="main-nav" id="main-nav" aria-label="Main menu" data-i18n-aria="navLabel">']
    for mid, key, label, items in MENUS:
        cur = ' is-current' if mid == current else ''
        out.append('  <div class="nav-item%s">' % cur)
        out.append('    <button type="button" class="nav-trigger" aria-expanded="false" aria-controls="menu-%s"><span data-nav-i18n="%s">%s</span>%s</button>' % (mid, key, label, CHEV))
        out.append('    <div class="nav-menu" id="menu-%s">' % mid)
        for k, d, icon, color, href, status in items:
            if status == 'soon': continue  # lo que aún no funciona no se muestra
            txt = '<span class="nav-txt"><span class="nav-t" data-nav-i18n="%s">%s</span>' % (k, EN[k])
            if d: txt += '<span class="nav-d" data-nav-i18n="%s">%s</span>' % (d, EN[d])
            txt += '</span>'
            badge = ''
            if status == 'ok': badge = '<span class="badge" data-nav-i18n="ok">Available</span>'
            if status == 'soon': badge = '<span class="badge soft" data-nav-i18n="soon">Coming soon</span>'
            if href:
                url = href.replace('{h}', h)
                aria = ' aria-current="page"' if url == page else ''
                out.append('      <a class="nav-link" href="%s"%s>%s%s%s</a>' % (url, aria, ico(icon, color), txt, badge))
            else:
                out.append('      <div class="nav-link is-soon">%s%s%s</div>' % (ico(icon, color), txt, badge))
        out.append('    </div>')
        out.append('  </div>')
    out.append('</nav>')
    return '\n'.join(out)

def patch(path, h, current, page, indent):
    s = open(path, encoding='utf-8').read()
    new = build(h, current, page)
    new = '\n'.join((indent + l) if l else l for l in new.split('\n')).lstrip()
    s2, n = re.subn(r'<nav class="main-nav" id="main-nav".*?</nav>', lambda m: new, s, count=1, flags=re.S)
    assert n == 1, path
    if 'nav.js' not in s2: s2 = s2.replace('<script src="/js/main.js" defer></script>', '<script src="/js/nav.js" defer></script>\n<script src="/js/main.js" defer></script>')
    if 'nav.js' not in s2: s2 = s2.replace('<script src="/js/design.js" defer></script>', '<script src="/js/nav.js" defer></script>\n<script src="/js/design.js" defer></script>')
    open(path, 'w', encoding='utf-8').write(s2)
    print('ok', path)

root = sys.argv[1]
patch(root + '/public/index.html', '', 'home', '/', '        ')
patch(root + '/public/design/index.html', '/', 'design', '/design/', '      ')
patch(root + '/public/design/tarjetas/index.html', '/', 'design', '/design/tarjetas/', '      ')
