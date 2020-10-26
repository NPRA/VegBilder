#!/bin/bash

if [ "$#" -ne 1 ]; then 
	echo "illegal number of parameters. expectec $0 <FILE>"
	exit 1
fi

FILE=$1
source .sources

echo "Username: "
read USER

echo "Password: "
read -s PASSWORD

curl -sSf -u ${USER}:${PASSWORD} -X PUT -T $FILE https://artrepo.vegvesen.no/artifactory/webcontent-release-local/${OMRADE}/${IKTLOSNING}/${ARTIFACTID}/${FILE}

