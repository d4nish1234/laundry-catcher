# Deployment: how laundry-catcher.youngmomins.com goes live

## The pipeline

```
  you: npm run build       — regenerates dist/ (COMMITTED to the repo)
        │
  you: git push both main
        │
        ├──────────────► GitHub (origin)          — archive only, no deploy
        │
        └──────────────► cPanel repo (namecheap)
                          ~/repos/laundry-catcher
                              │
                              │  .git/hooks/post-receive
                              │  (fires only if the pushed ref matches the
                              │   repo's CHECKED-OUT branch — here, main)
                              ▼
                          uapi VersionControlDeployment create
                              │
                              │  reads .cpanel.yml at the repo root
                              ▼
             rsync --delete dist/ ──► ~/laundry-catcher.youngmomins.com/
                                        (the live docroot)
```

The critical difference from `young-momins-www`: that repo publishes a hand-written
`public/` directory, so what you edit is what ships. **Here, what ships is
`dist/`, a build output.** Editing `src/` and pushing without `npm run build`
changes nothing on the live site.

## The moving parts

### 1. `dist/` is committed

There is no Node toolchain in the cPanel deployment shell, so the build has to
happen on your machine and travel through git. `dist/` is therefore intentionally
*not* in `.gitignore`. It is a build artifact under version control — regenerate
it, never hand-edit it.

`vite build` does **not** typecheck. `npm run typecheck` is a separate step and is
worth running before a release.

### 2. `.cpanel.yml`

Lives at the repo root and is what makes the repo *deployable*. cPanel reads it on
every deployment and runs the `tasks:` list as a shell script.

```yaml
---
deployment:
  tasks:
    - export DOCROOT=/home/quragkwh/laundry-catcher.youngmomins.com
    - export SRC=/home/quragkwh/repos/laundry-catcher/dist
    - /bin/mkdir -p $DOCROOT
    - /usr/bin/rsync -rlpt --delete --chmod=D755,F644 --exclude=/.well-known/ ... $SRC/ $DOCROOT/
    - /bin/chmod 755 $DOCROOT
    - /bin/echo "Deployed ..."
```

Notes:
- Tasks run sequentially in one shell, so `export` on one line is visible to the
  next. This is cPanel's documented pattern.
- Commands need **absolute paths**; the deploy shell has a minimal `PATH`.
- Without a parseable `.cpanel.yml`, cPanel reports `deployable: 0` and pushing
  does nothing at all.
- `-rlpt` rather than `-a` deliberately: `-a` also copies owner and group from the
  repo checkout, which resets the docroot to group-writable `775`. `-rlpt` keeps
  permission handling but `--chmod=D755,F644` dictates what those permissions are
  rather than inheriting them.
- The `p` in `-rlpt` matters: without it `--chmod` applies only to files rsync
  actually transfers, so unchanged files keep whatever permissions they had and
  the docroot drifts.

### 3. `rsync --delete`, and why

Vite fingerprints filenames (`index-C_ZiT8x2.js`), so every build produces new
asset names. Without `--delete` the docroot would accumulate every asset from
every build forever. `--delete` makes it an exact mirror of `dist/`.

That makes the excludes load-bearing. These live in the docroot but are **not** in
the repo, and would be destroyed without them:

| Excluded | Why it must survive |
|---|---|
| `.well-known/` | ACME/Let's Encrypt SSL renewal. Deleting it breaks HTTPS at the next renewal. |
| `.ssl-manager/` | cPanel SSL tooling. |
| `cgi-bin/` | cPanel-managed, expected to exist. |
| `error_log` | Server-written; useful for debugging. |

Every exclude is **anchored with a leading `/`** so it matches only that entry at
the docroot root, not at any depth.

**Anything added to the docroot by hand and not committed to `dist/` is deleted on
the next deploy. There are no exceptions.**

### 4. The branch rule

cPanel's `post-receive` hook is:

```bash
branch=$(git branch | awk '$1 == "*"{print $2}')
while read oldrev newrev ref; do
  if [ "x$ref" == "xrefs/heads/$branch" ]; then
    (cd .. ; /usr/bin/uapi VersionControlDeployment create repository_root=$PWD)
  fi
done
```

It deploys only when the pushed ref matches the branch **checked out on the
server**. A freshly created cPanel repo often has `master` checked out while
pushes go to `main`, in which case deployments silently never run. This repo was
set to `main` with:

```bash
ssh twostrategy.com '/usr/bin/uapi VersionControl update \
  repository_root=/home/quragkwh/repos/laundry-catcher branch=main'
```

If deploys ever go quiet, **check this first.**

### 5. `.htaccess` and the SPA fallback

The game uses client-side routing (wouter) for `/locations`, `/dex`, `/story/:id`
and `/catch/:id`. Apache knows nothing about those paths, so `public/.htaccess`
rewrites anything that is not a real file or directory to `/index.html`.

`public/` is copied verbatim into `dist/` by Vite, so `.htaccess` lands at the
docroot root. Without it, `/` works but every deep link and every page refresh
404s.

It also forces HTTPS and sets cache headers: one year immutable on fingerprinted
assets, `no-cache` on HTML — so a new deploy is picked up immediately while assets
stay cached.

## Local development

```bash
npm install
npm run dev        # http://localhost:5173, hot reload
npm run typecheck  # tsc --noEmit; vite build does NOT do this
npm run build      # regenerate dist/
npm run preview    # serve dist/ at http://localhost:4173
```

`.htaccess` rules do not apply locally — Vite's dev and preview servers do their
own SPA fallback. Redirects and cache headers are the only things that differ.

## Storage & progress

All player progress is in the browser's `localStorage` under `laundrymon.dex.v1`
and `laundrymon.story.v1`. There is no backend and no account. Consequences worth
knowing before changing anything:

- Progress is per-browser, per-device. It does not follow the player.
- It survives closing the tab and restarting the browser — which is why this is
  `localStorage` and not `sessionStorage`.
- A player clearing site data starts over. The Dex screen has a Reset button that
  does this deliberately.
- The keys are versioned (`.v1`). Change the suffix if the stored shape ever
  changes incompatibly, rather than silently misreading old saves.

## Health checks

```bash
# Server repo state — want: branch: main, deployable: 1
ssh twostrategy.com '/usr/bin/uapi VersionControl retrieve'

# Last deployment, including failures
ssh twostrategy.com 'tail -30 ~/repos/laundry-catcher/.git/.cpanel_deployment_log'

# Live site + a deep link (proves the SPA fallback survived the deploy)
for p in "" "locations" "dex"; do
  printf '%-14s ' "/$p"
  curl -sS -o /dev/null -w '%{http_code}\n' "https://laundry-catcher.youngmomins.com/$p"
done
```

## Rollback

```bash
git revert <bad-commit>
npm run build && git add -A && git commit --amend --no-edit
git push both main
```

Do not restore files onto the server by hand — the next deploy overwrites them.

## HTTPS — currently unresolved

`laundry-catcher.youngmomins.com` is served over **plain HTTP**. The HTTPS
redirect in `public/.htaccess` is deliberately commented out, and the canonical
/ `og:url` in `index.html` point at `http://`.

Why: this cPanel account does not have the `autossl` feature
(`uapi SSL start_autossl_check` returns *"You do not have the feature 'autossl'"*),
and the installed Sectigo certificates cover only the apex domains and `www`:

```
youngmomins.com, www.youngmomins.com          (Sectigo)
twostrategy.com, www.twostrategy.com          (Sectigo)
```

No wildcard, so the new subdomain has no valid certificate. Redirecting to HTTPS
before fixing that sends every visitor into a browser certificate warning.

Check the current state with:

```bash
ssh twostrategy.com '/usr/bin/uapi SSL installed_hosts' | grep -A3 domains
curl -sS -o /dev/null -w '%{http_code}\n' https://laundry-catcher.youngmomins.com/
```

### Ways out, roughly in order of preference

1. **Ask Namecheap support to enable AutoSSL** on the hosting package. Free,
   auto-renewing, and it would cover every current and future subdomain. This is
   the cleanest fix.
2. **Put Cloudflare in front of the subdomain** (proxied DNS). Free edge cert,
   no server change — but it is a second place where DNS lives.
3. **Issue a Let's Encrypt cert manually** (acme.sh HTTP-01 against the docroot,
   then `uapi SSL install_ssl`). Works, but there is no root cron here, so
   renewal every 60 days has to be scheduled deliberately or the site breaks.
4. **Buy a wildcard cert for `*.youngmomins.com`** and install it in cPanel.
5. **Serve the game from `youngmomins.com/laundry-catcher/` instead**, which the
   existing cert already covers. This needs a `--exclude=/laundry-catcher/` added
   to the `young-momins-www` `.cpanel.yml`, or its `rsync --delete` will wipe the
   directory on that repo's next deploy. It also means rebuilding with
   `BASE_PATH=/laundry-catcher/` and fixing the hardcoded `/audio/...` paths in
   `catch.tsx`, `song.tsx`, `credits.tsx` and `settings.tsx`.

### Once a certificate is in place

1. Uncomment the three `RewriteCond`/`RewriteRule` HTTPS lines in `public/.htaccess`.
2. Change the `<link rel="canonical">` and `og:url` in `index.html` back to `https://`.
3. `npm run build && git add -A && git commit && git push both main`.
