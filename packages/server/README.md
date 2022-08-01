# DOJO Server (back-end)

Table of contents:

- [Development](#development)
  - [Set environment variables](#set-environment-variables)
  - [Run databases](#run-databases)
    - [Creating the Postgres database](#creating-the-postgres-database)
    - [Accessing the Postgres database (optional)](#accessing-the-postgres-database-optional)
    - [Accessing Redisinsight (optional)](#accessing-redisinsight-optional)
  - [Run the server](#run-the-server)
  - [Troubleshooting](#troubleshooting)
    - [Permission error during `docker compose up`](#permission-error-during-docker-compose-up)
  - [Browser error during `yarn start:dev`](#browser-error-during-yarn-startdev)
  - [TypeOrm cannot find `dev` database on application startup](#typeorm-cannot-find-dev-database-on-application-startup)

## Development

Check the development section in the [main README file](../../README.md#development) before reading this one.

⚠️ All commands displayed below are meant to be executed inside `packages/server` unless explicitly said otherwise.

### Set environment variables

Create a `.env` file and set the following environment variables:

| Variable                     | Description                                               |
| ---------------------------- | --------------------------------------------------------- |
| `CORS_ORIGIN`                | Base URL of your front-end app. Defaults to `*` (any URL) |
| `JWT_EXPIRATION_TIME`        | JSON Web Token expiration time in seconds                 |
| `JWT_SECRET`                 | JSON Web Token private key                                |
| `PORT`                       | NestJS application port. Defaults to `2000`               |
| `POSTGRES_DB`                | PostgreSQL database name                                  |
| `POSTGRES_HOST`              | PostgreSQL host                                           |
| `POSTGRES_PASSWORD`          | PostgreSQL password                                       |
| `POSTGRES_PORT`              | PostgreSQL port                                           |
| `POSTGRES_USER`              | PostgreSQL username                                       |
| `REDIS_TLS`                  | SSL/TLS support. Defaults to `false`                      |
| `REDIS_URL`                  | Redis URL with host, password and port¹                   |
| `URI_CLIENT_EMAIL`           | E-mail for URI Online Judge account                       |
| `URI_CLIENT_PASSWORD`        | Password for URI Online Judge account                     |
| `CODEFORCES_CLIENT_USERNAME` | Username for Codeforces account                           |
| `CODEFORCES_CLIENT_PASSWORD` | Password for Codeforces account                           |

1: If using Heroku, `REDIS_URL` will be updated automatically sometimes. [See more](https://help.heroku.com/VN3D085X/why-have-my-heroku-redis-credentials-changed).

All variables without a default value are **required**.

You can use the following `.env` sample as a starting point for local development, but use your values for `URI_CLIENT_EMAIL`, `URI_CLIENT_PASSWORD`, `CODEFORCES_CLIENT_USERNAME`, `CODEFORCES_CLIENT_PASSWORD`.

```bash
CORS_ORIGIN=http://localhost:3000
JWT_EXPIRATION_TIME=604800017
JWT_SECRET=4A5ECE5C9068EB654FA690CDC575E3B4345ED0FEA87D8BBC680C336821A741BB
POSTGRES_DB=dev
POSTGRES_HOST=localhost
POSTGRES_PASSWORD=admin
POSTGRES_PORT=5432
POSTGRES_USER=admin
REDIS_TLS=false
REDIS_URL='http://localhost:6379/'
URI_CLIENT_EMAIL="fake.email@gmail.com"
URI_CLIENT_PASSWORD="12345678"
CODEFORCES_CLIENT_USERNAME="fake_username"
CODEFORCES_CLIENT_PASSWORD="12345678"
```

### Run databases

```bash
docker compose up
```

PG Admin and Redisinsight will be available at <http://localhost:8080/> and <http://localhost:8001/> respectively.

#### Creating the Postgres database

When running locally for the first time, the NestJS server might throw an error
like "nestjs database doesn't exist". To fix that, you will need to [open PG
Admin](http://localhost/8080), login with the credentials
`PGADMIN_DEFAULT_EMAIL` and `PGADMIN_DEFAULT_PASSWORD` defined in the
[docker.env](./docker.env) file and then, do as the following images suggest:

| 1 - Create a new server                      | 2 - Choose the DB name                          | 3 - Setup the connection                           |
| -------------------------------------------- | ----------------------------------------------- | -------------------------------------------------- |
| ![](./images/pgadmin_create_server_home.png) | ![](./images/pgadmin_create_server_general.png) | ![](./images/pgadmin_create_server_connection.png) |

#### Accessing the Postgres database (optional)

Just in case you want to inspect something without PG Admin. Not necessary.

`docker exec -it postgres bash`

`psql -d dev -U admin`

`\dt`

#### Accessing Redisinsight (optional)

Open [Redisinsight](http://localhost:8001/), click on "Connect to a Redis Database" and use the same values as described in the image below.

![](./images/redisinsight_add_redis_database.png)

### Run the server

```bash
yarn start:dev
```

### Troubleshooting

#### Permission error during `docker compose up`

Error message: `Got permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.24/containers/json?all=1&filters=%7B%22label%22%3A%7B%22com.docker.compose.project%3Dserver%22%3Atrue%7D%7D&limit=0": dial unix /var/run/docker.sock: connect: permission denied`

For a quick-term solution, run `sudo docker compose up`. Otherwise, follow those steps in the [official docs](https://docs.docker.com/engine/install/linux-postinstall/).

### Browser error during `yarn start:dev`

Error message: `error while loading shared libraries: libnss3.so: cannot open shared object file: No such file or directory`

Run `apt install libnss3-dev libgdk-pixbuf2.0-dev libgtk-3-dev libxss-dev` to fix. [Related issue](https://github.com/wdsrocha/dojo/issues/22).

### TypeOrm cannot find `dev` database on application startup

Make sure that there is no other Postgres instance running on port 5432. You can check that by running `sudo lsof -i :5432` on the terminal. If the output is something like:

```
COMMAND  PID     USER   FD   TYPE             DEVICE SIZE/OFF NODE NAME
postgres 587 postgres    4u  IPv6 0x218f97e9af5d0303      0t0  TCP *:postgresql (LISTEN)
postgres 587 postgres    5u  IPv4 0x218f97e9ae0f6c63      0t0  TCP *:postgresql (LISTEN)
```

It means that the port is already being used. Terminate this Postgres instance or change the port exposed by Docker.