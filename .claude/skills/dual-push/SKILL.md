---
name: dual-push
description: Push laundry-catcher commits to BOTH GitHub and Namecheap cPanel git, which triggers deployment to laundry-catcher.youngmomins.com. Use whenever asked to push, publish, deploy, or ship changes in this repo — and to diagnose a push that hangs asking for a password, or a deploy that appears to succeed but doesn't change the live site.
---

# Dual push: GitHub + Namecheap (deploys the live site)

This repo has **two** upstreams. Pushing to only one is the most common mistake here.

| Remote | Points at | Effect of pushing |
|---|---|---|
| `origin` | GitHub `d4nish1234/laundry-catcher` | Source of record. **No deploy.** |
| `namecheap` | cPanel `~/repos/laundry-catcher` | **Deploys to laundry-catcher.youngmomins.com** via `.cpanel.yml` |
| `both` | Both of the above | Pushes to both in one command |

## Rebuild first — this repo ships a build artifact

`dist/` is committed and is what gets deployed. Nothing on the server builds
anything. If `src/`, `public/` or `index.html` changed:

```bash
npm run build
git add -A
git commit -m "..."
git push both main
```

Skipping the build ships stale HTML alongside fresh source, with no error.
`npm run typecheck` is worth running too — `vite build` does not typecheck.

## The command

```bash
git push both main
```

That is the normal way to ship. It pushes to GitHub *and* to Namecheap, and the
Namecheap push fires the `post-receive` hook that deploys the live site.

To push to GitHub only (work in progress, not ready to go live):

```bash
git push origin main
```

## Non-negotiable rules

1. **Only `main` deploys.** cPanel's `post-receive` hook compares the pushed ref
   against the branch *checked out on the server* and queues a deployment only on
   a match. Pushing any other branch to `namecheap` is silently a no-op — no
   error, no deploy.
2. **Never edit files on the server.** Deployment is `rsync --delete` from `dist/`
   to the docroot. Anything hand-edited on the server that isn't in `dist/` is
   destroyed on the next deploy.
3. **Only `dist/` is published.** `src/`, `docs/`, `CLAUDE.md`, `.cpanel.yml` are
   versioned but never served.
4. **Never force-push to `namecheap`.** The server has a checked-out working tree;
   a rewritten history desyncs it from the deployed state.

## Verifying a deploy actually happened

Deployment is queued, not instant — allow ~10-30 seconds, then:

```bash
# What the server repo believes is checked out
ssh twostrategy.com 'git -C ~/repos/laundry-catcher log --oneline -1'

# Deployment log (most recent attempt, including failures)
ssh twostrategy.com 'tail -30 ~/repos/laundry-catcher/.git/.cpanel_deployment_log'

# The live site, cache-busted
curl -sS -o /dev/null -w '%{http_code}\n' "https://laundry-catcher.youngmomins.com/?cb=$RANDOM"
```

## Troubleshooting

**A push asks for a password.**
SSH isn't offering the key. Check `~/.ssh/config` contains the `twostrategy.com`
host block with `IdentityFile ~/.ssh/cpanel_key` and `IdentitiesOnly yes`, then:
`ssh -o BatchMode=yes twostrategy.com 'echo OK'`. A password prompt should never
be answered here — fix the config instead. See `docs/GIT-REMOTES.md`.

**Push succeeds but the live site is unchanged.**
Almost always the branch rule (#1) — or a missing `npm run build`. Confirm the
server's checked-out branch:

```bash
ssh twostrategy.com '/usr/bin/uapi VersionControl retrieve' | grep -E 'branch|deployable'
```

`branch: main` and `deployable: 1` are the healthy values. `deployable: 0` means
cPanel can't see a valid `.cpanel.yml` at the repo root.

**A deep link 404s but `/` works.**
The SPA fallback lives in `public/.htaccess`, which Vite copies into `dist/`.
Confirm it actually reached the docroot:
`ssh twostrategy.com 'head -5 ~/laundry-catcher.youngmomins.com/.htaccess'`

**Trigger a deploy manually** (without a new commit):

```bash
ssh twostrategy.com '/usr/bin/uapi VersionControlDeployment create repository_root=/home/quragkwh/repos/laundry-catcher'
```

## Rollback

Revert in the repo and dual-push — do not restore files onto the server by hand,
or the next deploy will overwrite the restoration. Remember to rebuild if the
revert touched source:

```bash
git revert <bad-commit-sha>
npm run build && git add -A && git commit --amend --no-edit
git push both main
```
