#/bin/bash

echo $'\n\n[requesting: normal request]'
curl localhost:3000 -X POST --data '{"name": "Vingador", "power": "Rich", "age": 2000}'

echo $'\n\n[requesting: invalid request]'
curl localhost:3000 -X POST --data '{"name": "Vi", "power": "Rich"}'

echo $'\n\n[requesting: invalid request]'
curl localhost:3000 -X POST --data '{"name": "V", "power": "Rich", "age": 10}'

echo $'\n\n[requesting: invalid request]'
curl localhost:3000 -X POST --data '{"name": "Vingador", "power": "Rich", "age": 2000, "connectionError": true}' 