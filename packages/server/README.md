# DOJO Server

## Development

### Install dependencies

```bash
yarn install
```

### Run database

```bash
docker-compose up
```

PG Admin will be available at http://localhost:8080/

#### Accessing database

`docker exec -it postgres bash`

`psql -d postgres -U admin`

`\dt`

### Run server

```bash
yarn start:dev
```
