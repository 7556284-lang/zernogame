# zernogame.ru — сайт игры «Зерно конфликта»

Статический одностраничный сайт (HTML + CSS + JS, без сборки и зависимостей). Готов к публикации на GitHub Pages.

## Как опубликовать (≈10 минут)

1. На github.com создайте репозиторий (например, `zernogame`), **Public**.
2. Нажмите **Add file → Upload files** и перетащите **содержимое** папки (не саму папку): `index.html`, `404.html`, `CNAME`, `.nojekyll`, `robots.txt`, `sitemap.xml`, `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, папки `css`, `js`, `assets`, `go`. Нажмите **Commit changes**.
   (Файлы с точкой в начале — `.nojekyll` — на Mac скрыты; если не видите, нажмите Cmd+Shift+. в Finder.)
3. **Settings → Pages**: Source — *Deploy from a branch*, Branch — `main`, папка `/ (root)` → Save.
4. Там же в **Custom domain** впишите `zernogame.ru` (файл `CNAME` уже лежит в репозитории) и после проверки DNS включите **Enforce HTTPS**.

## DNS у регистратора домена

- Четыре записи **A** для `@` (zernogame.ru) на IP GitHub Pages — актуальный список в документации GitHub: *Managing a custom domain for your GitHub Pages site*.
- Запись **CNAME** для `www` → `<ваш-логин>.github.io`.
- Сертификат HTTPS выпускается автоматически, обычно от нескольких минут до суток после того, как DNS подхватился.

## QR на колоде

QR должен вести на `https://zernogame.ru/go`. Страница `go/index.html` мгновенно перенаправляет посетителя. Чтобы изменить назначение **без перепечатки колоды**, откройте `go/index.html` и поменяйте одну строку `var TARGET = "../?src=deck";` (например, на `"https://t.me/..."` или на другую страницу). Параметр `?src=deck` включает на главной приветственную плашку «Вы держите колоду».

Проверьте, на какой адрес сейчас ведёт ваш QR из `qr-code.png`: если не на `zernogame.ru/go` — сгенерируйте новый QR на этот адрес до печати.

## Что заменить своим

- **Фото автора**: сейчас на месте портрета орнаментальный медальон «СС». Положите `assets/author.webp` (квадрат 800×800) и замените блок `<div class="portrait">…</div>` в `index.html` на `<img class="portrait" src="assets/author.webp" alt="Светлана Сидорова" width="400" height="400">`.
- **Тексты**: описание игры и ответы в блоке «Вопросы» — черновики на основе механики игры, утвердите или поправьте прямо в `index.html`.
- **Метрика**: в `js/main.js` впишите номер счётчика в `YM_ID`, подключите код счётчика Яндекс Метрики в `<head>` и создайте цели `channel`, `dm`, `card_flip`, `gallery_view`, `qr_scan`. Если подключаете счётчик — добавьте уведомление о cookie и политику (это на стороне владельца сайта).
- **Шрифты**: сейчас системные (Georgia-подобная антиква и системный гротеск), как и на картах. Чтобы использовать свои, положите WOFF2 в `assets/fonts/`, добавьте `@font-face` в `css/main.css` и поменяйте переменные `--serif` и `--sans`.

## Структура

```
index.html        страница (карты и орнамент встроены как HTML/SVG, картинок-карт нет)
css/main.css      стили и токены цветов (как в колоде)
js/main.js        анимации, разворот карт, фильтры, QR-плашка, цели
go/index.html     редирект для QR
assets/           qr.webp, og.jpg (превью для Telegram)
CNAME, .nojekyll, robots.txt, sitemap.xml, 404.html, favicon*
```
