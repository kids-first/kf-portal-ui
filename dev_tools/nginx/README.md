# Run NGINX in Docker

## Requirements

- Docker (18.03+ for Mac/Windows, 20.04+ for Linux)
- KF-portal-UI is running locally on port 3000
- `portal-qa.includedcc.org` and/or `portal.includedcc.org` added to hosts file

## QA

### Build image:

```
docker build -f qa.Dockerfile -t include-nginx-qa .
```

### Run image:

For Mac/Windows:

```
docker run -p 443:443 -p 80:80 -d include-nginx-qa
```

For Linux:

```
docker run -p 443:443 -p 80:80 --add-host=host.docker.internal:host-gateway -d include-nginx-qa
```

## PRD

### Build image:

```
docker build -f prd.Dockerfile -t include-nginx-prd .
```

### Run image:

For Mac/Windows:

```
docker run -p 443:443 -p 80:80 -d include-nginx-prd
```

For Linux:

```
docker run -p 443:443 -p 80:80 --add-host=host.docker.internal:host-gateway -d include-nginx-prd
```
