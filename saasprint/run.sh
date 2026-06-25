#!/bin/bash

mvn clean install

if [ $? -eq 0 ]; then
    java -jar target/*.jar
else
    echo "Build failed"
    exit 1
fi