#!/bin/bash

source .sources

echo "Version: "
read VERSION

echo "Artifact: "
read ARTIFACT

echo "Description: "
read DESCRIPTION

echo "About to execute: \"ac build ${ARTIFACTID} -b httpd24 -v ${VERSION} -U ${ARTIFACT} -d \"${DESCRIPTION}\" -i ${IKTLOSNING}\""

while true; do
	read -p "Do you wish to execute this commandi [Yy/Nn]?" yn
	case $yn in
		[Yy]* ) ac build ${ARTIFACTID} -b httpd24 -v ${VERSION} -U ${ARTIFACT} -d "${DESCRIPTION}" -i ${IKTLOSNING}; break;;
		[Nn]* ) exit;;
		* ) echo "Please answer yes or no.";;
	esac
done

