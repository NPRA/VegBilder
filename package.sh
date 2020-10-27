#!/bin/bash

source .sources

echo "Version (v1.0.0): "
read VERSION

cd ./vegbilder-client/build/
tar -cvzf ../../${ARTIFACTID}-${VERSION}.${PACKAGING} *
cd -

