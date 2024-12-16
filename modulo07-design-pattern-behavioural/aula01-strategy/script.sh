docker run \
  --name postgres \
  -e POSTGRES_USER=wall \
  -e POSTGRES_PASSWORD="senha0001" \
  -e POSTGRES_DB=heroes \
  -p 5432:5432 \
  -d \
  postgres

docker logs postgres # saber se está rodando
docker exec -it postgres psql --username wall --dbname heroes # rodando cmd no container 

CREATE TABLE warriors(
  id serial PRIMARY KEY,
  name VARCHAR (255) not null
);

# MongoDb
docker run \
  --name mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=wall \
  -e MONGO_INITDB_ROOT_PASSWORD=senhaadmin \
  -p 27017:27017 \
  -d \
  mongo:4

docker logs mongodb
