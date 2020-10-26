#!/bin/bash

source .sources

echo "Version (v1.0.0): "
read VERSION

cd ./vegbilder-client/src/
tar -cvzf ../../${ARTIFACTID}-${VERSION}.${PACKAGING} *
cd -

