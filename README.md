# Graphics ADD · Dotpixel.pk

A static website hosted on Cloudflare Pages, with content edited directly through GitHub. No database, no plugins, no CMS to configure — just files you edit when you need to.

---

## 📁 Folder structure

```
dotpixel-site/
├── index.html              ← main page (loads content dynamically)
│
├── data/                   ← all editable content lives here
│   ├── settings.json       (phone, email, WhatsApp, hours, stats)
│   ├── slides.json         (hero slideshow)
│   ├── products.json       (9 product cards)
│   └── about.json          (about section)
│
├── images/
│   ├── slides/             ← hero slideshow images
│   ├── products/           ← product photos
│   └── gallery/            ← extra (optional)
│
├── css/style.css           (all styles)
│
├── js/
│   ├── content-loader.js   (loads JSON into page)
│   ├── main.js             (slideshow + nav)
│   └── form-handler.js     (email + WhatsApp form)
│
└── README.md               (this file)
```

---

## 🚀 Deployment — step by step

### Step 1: Put files on GitHub

1. Go to **github.com** → sign up (free) if you don't have an account
2. Top right **+** icon → **New repository**
3. Repository name: `dotpixel-site` (or whatever you like)
4. Set to **Public** (required for free Cloudflare Pages)
5. Click **Create repository**
6. On the next page click **uploading an existing file** (it's a link in the middle of the page)
7. Drag every file/folder from your unzipped `dotpixel-site` folder onto the upload area
8. Scroll down → green button **Commit changes**

### Step 2: Connect to Cloudflare Pages

1. Go to **dash.cloudflare.com** → sign in
2. Left sidebar → **Workers & Pages** → **Create application** → **Pages** tab → **Connect to Git**
3. Click **Connect GitHub** → authorize Cloudflare to see your repos
4. Pick your `dotpixel-site` repo → **Begin setup**
5. **Build settings** — leave EVERYTHING blank (no build command, no output directory needed). Just click **Save and Deploy**
6. Wait 30 seconds → you'll get a URL like `dotpixel-site.pages.dev` — that's your live site

### Step 3: Connect your domain (after nameserver change is done)

1. In Cloudflare Pages → your project → **Custom domains** tab → **Set up a custom domain**
2. Type `dotpixel.pk` → next
3. Repeat for `www.dotpixel.pk`
4. Cloudflare auto-configures the DNS (since your nameservers point at Cloudflare)
5. Wait a few minutes for SSL certificate to provision
6. Done — your site is live at https://dotpixel.pk

---

## ✏️ How to edit content (the GitHub web editor)

Every time you want to change something on the site, the workflow is the same:

1. Go to **github.com/YOUR-USERNAME/dotpixel-site**
2. Click the file you want to edit
3. Click the **pencil icon** (top right of the file content)
4. Edit
5. Scroll down → green button **Commit changes**
6. Wait 30-60 seconds → Cloudflare auto-deploys → site updates

That's it. No FTP, no database, no plugins.

### 📝 What lives in which file

#### `data/settings.json` — Phone, email, WhatsApp, business info

This file controls all your contact details and the 3 stat numbers on the hero.

**Rules to avoid breaking JSON:**
- Keep all the `"quotes"` and `,` commas exactly as they are — only change the text *inside* the quotes
- No comma after the last item in a list
- WhatsApp number: no `+`, no spaces, no dashes (e.g. `923001234567`)
- Phone link: include the `+` (e.g. `+923001234567`)

#### `data/slides.json` — Hero slideshow

Each slide has 5 fields:

- **image**: path to the image file in `/images/slides/`
- **title**: big headline. Wrap a word in `<em>...</em>` to make it italic accent color, e.g. `Bags that carry your <em>brand</em>`
- **subtitle**: paragraph below the title
- **cta_text**: button label
- **cta_link**: where the button goes — usually `#contact`, `#products`, `#about`, etc.

To **add a new slide**, copy an existing slide block (including the `{ }`) and paste, then change the values. Make sure there's a `,` between blocks but NOT after the last one.

#### `data/products.json` — All 9 product cards

Each product has:

- **name**: product title
- **image**: path like `/images/products/non-woven.jpg`
- **description**: paragraph text
- **tag**: small badge text (optional — set to `""` to hide)
- **order**: lower numbers appear first (1, 2, 3...)

#### `data/about.json` — About section

- **heading**: big title. Use `<em>word</em>` to highlight a word in italic accent
- **paragraph_1**, **paragraph_2**: two paragraphs
- **points**: bullet list. Use `text — description` format (with spaces around the em-dash). The part before `—` becomes bold.
- **quote**: the italic quote in the side panel

---

## 🖼️ Adding images to GitHub

Two ways:

**Way 1: Drag and drop (easiest)**

1. On GitHub, click into `images/products/` (or `images/slides/`)
2. Click **Add file** → **Upload files** (top right)
3. Drag your photo onto the page
4. Commit changes
5. Done — image is live in 30 seconds

**Way 2: Rename your WordPress images first, then upload in batch**

For products, name them:
- `non-woven.jpg`
- `promotional.jpg`
- `fabric.jpg`
- `event.jpg`
- `shopping.jpg`
- `institutional.jpg`
- `rice.jpg`
- `paper.jpg`
- `polypropylene.jpg`

The JSON already points at these filenames, so they'll show up automatically.

For slides, name them `slide-1.jpg` through `slide-4.jpg`.

**Image tips:**
- Slides: 1920×1080 minimum, landscape orientation
- Products: square (1:1) or 4:3 ratio works best, 800×800 is plenty
- Compress with **tinypng.com** before uploading — keeps load times fast
- JPG for photos, PNG only if you need transparency

---

## 📞 Contact form setup

The form has two buttons:

### Send via Email (Formspree)

To receive form submissions in your inbox:

1. Go to **formspree.io** → sign up (free, 50 submissions/month)
2. Click **New Form** → name it "Dotpixel Inquiries" → use your email
3. Copy the endpoint URL — looks like `https://formspree.io/f/xabcd1234`
4. Open `data/settings.json` on GitHub → click pencil → replace the `YOUR_FORM_ID` value with your full URL
5. Commit changes

**Until you set this up:** the email button opens the user's email app with the message pre-filled (mailto: fallback). It works, just less polished.

### Send via WhatsApp

Already works — just edit `data/settings.json` and make sure `whatsapp_number` is your real number in international format (no `+`, no spaces).

The form packages all fields into a nicely formatted message and opens WhatsApp ready to send.

---

## 🧪 Testing locally before deploying

If you want to preview changes on your computer before pushing to GitHub:

**Easiest** (Python — pre-installed on Mac/Linux, needs install on Windows):
```bash
cd dotpixel-site
python3 -m http.server 8000
```
Open `http://localhost:8000` in your browser.

**Easier** (VS Code):
1. Install VS Code (free)
2. Install the **Live Server** extension
3. Right-click `index.html` → "Open with Live Server"

> ⚠️ **Don't** double-click `index.html` to open it directly — browsers block JSON loading from `file://` URLs. You need a local server.

---

## 🛡️ Backups — you literally cannot lose this site

Your site lives in 3 places at once:

1. **GitHub** — every edit is a version-controlled commit. To roll back: GitHub → your repo → Commits → click any past commit → "Revert"
2. **Cloudflare Pages** — hosts the live copy + keeps the last 20 deployments accessible
3. **Your computer** — the original unzipped folder

If you ever want a download: GitHub → green **Code** button → **Download ZIP**. Always available, always current.

---

## ❓ Common questions & fixes

**Q: I edited a JSON file and now the site is broken — blank sections.**
A: JSON syntax error, usually a missing comma or quote. Open **jsonlint.com**, paste your JSON, it'll show you exactly which line is wrong. Then fix it on GitHub and commit again.

**Q: My image isn't showing.**
A: Three things to check:
1. Is the filename exactly the same in `products.json`? Case matters: `non-woven.jpg` ≠ `Non-Woven.JPG`
2. Is the path right? Should be `/images/products/filename.jpg` (starts with `/`)
3. Did you wait 30-60 sec for Cloudflare to redeploy?

**Q: WhatsApp button does nothing.**
A: Check `data/settings.json` — `whatsapp_number` must have NO `+` and NO spaces. Just digits like `923001234567`.

**Q: I want to change the colors / fonts.**
A: Edit `css/style.css` — all colors are CSS variables at the top:
```css
--leaf: #2d4a2b;
--leaf-dark: #1c3019;
--kraft: #d4c4a8;
--cream: #f5f1e6;
--rust: #a64b2a;
```
Change a hex code, the whole site rebrands.

**Q: I accidentally deleted a product / messed up a JSON file.**
A: On GitHub → your repo → click **Commits** (or the clock icon) → find a working version → restore from there. Or just download the original ZIP and re-upload.

**Q: After committing, my site still shows the old content.**
A: Hard-refresh your browser: **Ctrl+F5** (Windows) or **Cmd+Shift+R** (Mac). Cloudflare also takes 30-60 sec to deploy after each commit.
