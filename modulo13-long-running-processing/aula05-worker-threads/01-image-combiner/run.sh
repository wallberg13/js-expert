#!/bin/bash
IMAGE_URL_01="https://cdn.awsli.com.br/2657/2657807/produto/255887504/1708368210503-removebg-preview-zs7i16r3f7.png"
IMAGE_URL_02="https://cdn.awsli.com.br/400x400/1369/1369860/produto/364521337/pmtpr-02_b10-removebg-preview-ezjnaqws8i.png"

BACKGROUND_URL_01="https://thumbs.dreamstime.com/b/background-apocalypse-wallpaper-colors-356856857.jpg"
BACKGROUND_URL_02="https://img.goodfon.com/original/1920x1080/7/43/rik-i-morti-rick-and-morty-rick-sanchez-rick-sanchez-morty-8.jpg"

npx autocannon --renderStatusCodes -c500 "http://localhost:3000/joinImages?img=$IMAGE_URL_02&background=$BACKGROUND_URL_01"
# curl "http://localhost:3000/joinImages?img=$IMAGE_URL_02&background=$BACKGROUND_URL_02"

# curl "http://localhost:3000/joinImages?img=https://cdn.awsli.com.br/2657/2657807/produto/255887504/1708368210503-removebg-preview-zs7i16r3f7.png&background=https://thumbs.dreamstime.com/b/background-apocalypse-wallpaper-colors-356856857.jpg"
