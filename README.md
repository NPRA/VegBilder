# VegBilder
Application to display road images on a map and view the images. 

# Atlas Bygge & Utrullning

## Paketere eksisterende løsning

*Input:*

```
scrier@svv-vm-d033:~/Git/VegBilder$ ./package.sh
```

*Output:*

```
Version (v1.0.0):
0.1.1                                                                    # Skriv inn ny version, bør kanske følge tags.
apis/
apis/VegbilderOGC/
apis/VegbilderOGC/getImagePointsInBbox.js
apis/VegbilderOGC/getImagePointsInVisibleMapArea.js
apis/VegbilderOGC/vegbilderOGC.js
components/
components/App.js
components/Header/
components/Header/Header.js
components/ImagePointsLayer/
components/ImagePointsLayer/ImagePointsLayer.js
components/ImagePointsLayersWrapper/
components/ImagePointsLayersWrapper/ImagePointsLayersWrapper.js
components/MapContainer/
components/MapContainer/crs.js
components/MapContainer/MapContainer.css
components/MapContainer/MapContainer.js
contexts/
contexts/CurrentImagePointContext.js
index.css
index.js
logo.svg
ready/
ready/index.html
theme/
theme/Theme.js
utilities/
utilities/latlngUtilities.js
utilities/mathUtilities.js
/home/scrier/Git/VegBilder
```

## Lasta opp til artifactory

*Input:*

```
scrier@svv-vm-d033:~/Git/VegBilder$ ./upload.sh vegbilder-0.1.1.tar.gz
```

*Output:*

```
Username:
andjoe                                        # brukerkortnavn
Password:                                     # passord till SVV
{
  "repo" : "webcontent-release-local",
  "path" : "/tk/vegfoto/vegbilder/vegbilder-0.1.1.tar.gz",
  "created" : "2020-10-23T11:02:40.204+02:00",
  "createdBy" : "andjoe",
  "downloadUri" : "https://artrepo.vegvesen.no/artifactory/webcontent-release-local/tk/vegfoto/vegbilder/vegbilder-0.1.1.tar.gz",
  "mimeType" : "application/x-gzip",
  "size" : "7238",
  "checksums" : {
    "sha1" : "f013f42f9ca9a5829fb602338dcfb09a162bce5d",
    "md5" : "7fb12c92de19fa0983c361965eae4b8e",
    "sha256" : "5264c264141ad14bc79a3f4461afb114ac0240c2fd9d5781116ba4809008011b"
  },
  "originalChecksums" : {
    "sha256" : "5264c264141ad14bc79a3f4461afb114ac0240c2fd9d5781116ba4809008011b"
  },
  "uri" : "https://artrepo.vegvesen.no/artifactory/webcontent-release-local/tk/vegfoto/vegbilder/vegbilder-0.1.1.tar.gz"
}
```

## Bygg ny image:

*Input:*

```
scrier@svv-vm-d033:~/Git/VegBilder$ ./build.sh
```

*Output:*

```
Version:
0.1.1                                                                                                             # Input vilken ny versjon, skall flge ovan.
Artifact:
https://artrepo.vegvesen.no/artifactory/webcontent-release-local/tk/vegfoto/vegbilder/vegbilder-0.1.1.tar.gz      # Artifact fra URI fra opplstningsteg
Description:
Added ready index to take care of the readycheck                                                                  # Beskrvning av ny docker image.
About to execute: "ac build vegbilder -b httpd24 -v 0.1.1 -U https://artrepo.vegvesen.no/artifactory/webcontent-release-local/tk/vegfoto/vegbilder/vegbilder-0.1.1.tar.gz -d "Added ready index to take care of the readycheck" -i vegfoto"
Do you wish to execute this commandi [Yy/Nn]?y                                                                    # svar ja hvis input ser ok ut.
BuildConfig "vegbilder-0.1.1" created
Build "vegbilder-0.1.1-1" created
```

### Se aktuellt bygge er klart:

*Input:* 

```
scrier@svv-vm-d033:~/Git/VegBilder$ ac get build
```

*Output:*

```
NAME               IKTL.    BUILD TYPE  DURATION  CREATED         STATUS
vegbilder-0.1.1-1  vegfoto  httpd24     2s        2 seconds ago   Running
vegbilder-0.1.0-1  vegfoto  httpd24     38s       15 minutes ago  Complete
s3gateway-0.4.7-1  vegfoto  tomcat9     38s       2 hours ago     Complete
s3gateway-0.4.6-1  vegfoto  tomcat9     29s       19 hours ago    Complete
s3gateway-0.4.4-1  vegfoto  tomcat9     32s       21 hours ago    Complete
s3gateway-0.4.3-2  vegfoto  tomcat9     34s       21 hours ago    Complete
s3gateway-0.4.2-1  vegfoto  tomcat9     1m49s     21 hours ago    Complete
s3gateway-0.4.3-1  vegfoto  tomcat9     0s        21 hours ago    Failed
s3gateway-0.4.1-1  vegfoto  tomcat9     1m13s     23 hours ago    Complete
s3gateway-0.4.0-1  vegfoto  tomcat9     1m27s     23 hours ago    Complete
s3gateway-0.3.3-1  vegfoto  tomcat9     54s       a day ago       Complete
s3gateway-0.3.1-1  vegfoto  openjdk8    29s       a day ago       Complete
s3gateway-0.3.0-1  vegfoto  openjdk8    36s       a day ago       Complete
s3gateway-0.2.0-1  vegfoto  openjdk8    25s       a day ago       Complete
s3gateway-0.1.1-1  vegfoto  openjdk8    28s       2 days ago      Complete
s3gateway-0.0.1-1  vegfoto  openjdk8    29s       4 days ago      Complete
```

## Rulla ut ny versjon:

ac perform rolling deploy vegbilder -e utvikling -v 0.1.1
