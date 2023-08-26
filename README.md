# Clothy

## Backend development

### Requirements

You need to have Mysql and docker installed in your system, and also get nodeJS.
[Get mysql](https://www.mysql.com/).
[Get docker](https://www.docker.com/products/docker-desktop/)
[Get nodejs](https://nodejs.org/en)

### Start all the services

```
docker compose build --no-cache
```
```
docker compose up -d
```

### Login to database with default password 123456

```
mysql --host=127.0.0.1 --port=3309 -u root -p
```

then copy all sql commands from sqls.txt file and paste it mysql and execute by pressing Enter;

### Start node server

```
npm i
node backend.js
```
