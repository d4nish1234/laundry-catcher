# Git remotes & passwordless SSH

This repo pushes to two places from a single folder — the same arrangement as
`2s-www` and `young-momins-www`.

## Remotes

| Remote | URL | Purpose |
|---|---|---|
| `origin` | `https://github.com/d4nish1234/laundry-catcher.git` | Source of record on GitHub. Pushing here does **not** deploy. |
| `namecheap` | `ssh://twostrategy.com/home/quragkwh/repos/laundry-catcher` | cPanel Git Version Control. Pushing `main` here **deploys the live site**. |
| `both` | (fetches from GitHub, pushes to both) | Convenience remote — one command, two destinations. |

Day to day:

```bash
git push both main      # ship: GitHub + live site
git push origin main    # GitHub only, no deploy
```

## How the `both` remote works

A git remote can have one fetch URL and multiple *push* URLs. `both` fetches from
GitHub and pushes to GitHub and Namecheap in sequence. It was created with:

```bash
git remote add both https://github.com/d4nish1234/laundry-catcher.git
git remote set-url --add --push both https://github.com/d4nish1234/laundry-catcher.git
git remote set-url --add --push both ssh://twostrategy.com/home/quragkwh/repos/laundry-catcher
```

Note the first `set-url --add --push` re-adds the GitHub URL. This is required:
the moment you add *any* explicit push URL, git stops falling back to the fetch
URL for pushes, so GitHub must be listed explicitly too.

Pushes happen sequentially. If GitHub fails, Namecheap is still attempted, and
vice versa — check the output of both, not just the exit code.

## Passwordless SSH

The Namecheap remote uses the short form `ssh://twostrategy.com/path` because
`~/.ssh/config` supplies the user and the non-standard port:

```
Host twostrategy.com
    HostName twostrategy.com
    User quragkwh
    Port 21098
    IdentityFile ~/.ssh/cpanel_key
    IdentitiesOnly yes
```

- **`Port 21098`** — Namecheap's shared-hosting SSH port, not the default 22.
- **`IdentityFile`** — points at the right key.
- **`IdentitiesOnly yes`** — stops SSH offering every other key in the agent
  first. Without it the server can reject you for too many failed attempts before
  it ever reaches the correct key, and fall back to a password prompt.

Verify at any time — this must print `OK` with no prompt:

```bash
ssh -o BatchMode=yes twostrategy.com 'echo OK'
```

`BatchMode=yes` makes it fail rather than hang if the key isn't offered, which is
what you want in a script.

The cPanel clone URL as shown in the cPanel UI is the long form and is equivalent:

```
ssh://quragkwh@twostrategy.com:21098/home/quragkwh/repos/laundry-catcher
```

## Setting this up on a new machine

1. Copy `~/.ssh/cpanel_key` across (or generate a new key and authorize its
   `.pub` in cPanel → *SSH Access* → *Manage SSH Keys*).
2. `chmod 600 ~/.ssh/cpanel_key`
3. Add the `~/.ssh/config` block above; `chmod 600 ~/.ssh/config`
4. Clone from GitHub, `npm install`, then re-add the `namecheap` and `both`
   remotes with the commands above. **Remotes are per-clone — they are not
   stored in the repo.**
