# Run NGINX in Docker

## Requirements

- Docker (18.03+ for Mac/Windows, 20.04+ for Linux)
- KF-portal-UI is running locally on port 3000
- `portal-qa.kidsfirstdrc.org` and/or `portal.kidsfirstdrc.org` added to hosts file

## Setup

- Open a terminal and exec `sudo vim /etc/hosts` or `sudo nano etc/hosts`
- Add both/one of the following line

```
127.0.0.1 portal-qa.kidsfirstdrc.org
127.0.0.1 portal.kidsfirstdrc.org
```

- Build and run your docker image, check [QA](#QA) or [PRD](#PRD)
- Start your front-end env by running `npm run start` at the root folder
- Open your browser and go to `https://portal-qa.kidsfirstdrc.org` or `https://portal.kidsfirstdrc.org`
- A warning message should appear. If your on chrome/chromium, click on the page and write `thisisunsafe` [source](https://cybercafe.dev/thisisunsafe-bypassing-chrome-security-warnings/)

## QA

### Build image:

```
docker build -f qa.Dockerfile -t kf-nginx-qa .
```

### Run image:

For Mac/Windows:

```
docker run -p 443:443 -p 80:80 -d kf-nginx-qa
```

For Linux:

```
docker run -p 443:443 -p 80:80 --add-host=host.docker.internal:host-gateway --rm kf-nginx-qa
```

## PRD

### Build image:

```
docker build -f prd.Dockerfile -t kf-nginx-prd .
```

### Run image:

For Mac/Windows:

```
docker run -p 443:443 -p 80:80 -d kf-nginx-prd
```

For Linux:

```
docker run -p 443:443 -p 80:80 --add-host=host.docker.internal:host-gateway --rm include-nginx-prd
```
