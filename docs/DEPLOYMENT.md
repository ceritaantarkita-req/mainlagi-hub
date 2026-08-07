# Mainlagi Production Deployment

## Production target

- Domain: `https://mainlagi.inmydraft.com`
- VPS application root: `/srv/mainlagi`
- Repository checkout: `/srv/mainlagi/repo`
- Compose file: `/srv/mainlagi/docker-compose.yml`
- Deploy state: `/srv/mainlagi/.env`
- Deploy script: `/srv/mainlagi/deploy.sh`
- Container: `mainlagi-web`
- Application port: `3000/tcp` inside Docker only; it is not published on the VPS host.
- Reverse proxy: the existing Traefik service on external Docker network `inmydraft-demos_web`.
- TLS: handled by the existing Traefik Let's Encrypt resolver.

The application uses SHA-based local Docker image tags such as `mainlagi:<12-char-git-sha>`. The tag currently selected by Compose is stored as `MAINLAGI_IMAGE_TAG` in `/srv/mainlagi/.env`.

## Deployment flow

Every push to `main` triggers `.github/workflows/deploy-mainlagi.yml`.

The GitHub Actions runner connects to the VPS with a dedicated SSH key. The corresponding public key on the VPS is restricted with an OpenSSH forced command, so that key can execute only `/srv/mainlagi/deploy.sh` rather than an unrestricted shell.

The remote deployment script performs the following sequence:

1. Acquire an exclusive deployment lock.
2. Require a clean Git worktree.
3. Switch to and fast-forward the local `main` branch from GitHub.
4. Build `mainlagi:<git-sha>` before replacing production.
5. Start the new image as an isolated candidate container with no network.
6. Wait for Docker health to pass.
7. Verify `/api/health` and the required concept asset inside the candidate.
8. Update `/srv/mainlagi/.env` to the new image tag.
9. Recreate only the `mainlagi` Compose service with `--no-build`.
10. Wait for the production container to become healthy.
11. Verify the public HTTPS health endpoint and smoke-test the production asset.
12. Automatically restore the previous image tag and container if the production switch or public health check fails.

The deployment script does not run Docker prune operations, Compose `down`, Git hard reset, or Git clean.

## GitHub Actions secrets

The workflow requires these repository Actions secrets:

- `MAINLAGI_VPS_HOST`
- `MAINLAGI_VPS_USER`
- `MAINLAGI_VPS_KNOWN_HOSTS`
- `MAINLAGI_VPS_SSH_KEY`

Do not commit the private key, `.env`, credentials, or secret values to the repository.

## Status and health

```bash
sudo docker ps --filter "name=mainlagi-web" \
  --format 'table {{.Names}}\t{{.Image}}\t{{.Status}}\t{{.Ports}}'

sudo docker inspect mainlagi-web \
  --format 'Status={{.State.Status}} Health={{.State.Health.Status}} RestartCount={{.RestartCount}}'

curl -fsS https://mainlagi.inmydraft.com/api/health
```

## Logs

```bash
sudo docker logs --tail=100 mainlagi-web
sudo docker logs -f mainlagi-web
```

## Manual deployment

The same production path used by GitHub Actions can be invoked manually from an authorized VPS shell:

```bash
/srv/mainlagi/deploy.sh
```

Do not edit the repository checkout during deployment. The deploy script intentionally refuses to proceed when the worktree is dirty.

## Rollback

The deploy script automatically rolls back when the new production container or public health check fails.

For an intentional manual rollback, first list retained Mainlagi images:

```bash
sudo docker image ls mainlagi
```

Then select a known-good SHA tag, update `/srv/mainlagi/.env`, validate Compose, recreate only Mainlagi, and verify health:

```bash
printf 'MAINLAGI_IMAGE_TAG=<known-good-tag>\n' > /srv/mainlagi/.env
cd /srv/mainlagi
sudo docker compose config
sudo docker compose up -d --no-build mainlagi
sudo docker inspect mainlagi-web \
  --format 'Status={{.State.Status}} Health={{.State.Health.Status}} RestartCount={{.RestartCount}}'
curl -fsS https://mainlagi.inmydraft.com/api/health
```

Do not use `docker system prune` as part of rollback or routine deployment.

## Production Compose architecture

Mainlagi does not publish port `3000` on the host. Traefik reaches it through `inmydraft-demos_web` using Docker labels for `mainlagi.inmydraft.com`. Existing unrelated VPS services and Traefik are not restarted by a Mainlagi deployment.
