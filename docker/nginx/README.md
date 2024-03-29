# Run NGINX in Docker

## Requirements

- Docker (18.03+ for Mac/Windows, 20.04+ for Linux)
- KF-portal-UI is running locally on port 3000
- `portal-qa.kidsfirstdrc.org` and/or `portal.kidsfirstdrc.org` added to hosts file

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
docker run -p 443:443 -p 80:80 --add-host=host.docker.internal:host-gateway -d kf-nginx-qa
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
docker run -p 443:443 -p 80:80 --add-host=host.docker.internal:host-gateway -d kf-nginx-prd
```
