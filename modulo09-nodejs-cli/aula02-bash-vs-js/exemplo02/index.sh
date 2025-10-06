docker run -p "8080:80" -d nginx
sleep .5
curl --silent http://localhost:8080

CONTAINER_ID=$(docker ps | grep nginx | awk '{print $1}') # awk print $1 => retorna a primeira coluna.
echo logs
echo $CONTAINER_ID | xargs -I {id} docker logs {id} # xargs => utiliza como parametro o id do container.
echo rm
echo $CONTAINER_ID | xargs -I {id} docker rm -f {id} # xargs => utiliza como parametro o id do container.
