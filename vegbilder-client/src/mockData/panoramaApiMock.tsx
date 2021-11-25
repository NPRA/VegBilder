import React, { useEffect } from 'react';

const panoramaMockImages = [
    {
        "type": "Feature",
        "id": "Vegbilder_360_2021.2021-01-08T12.48.11.413233_RV00003_S2D1_m05346",
        "geometry": {
            "type": "Point",
            "coordinates": [
                11.30608168,
                60.83781494
            ]
        },
        "geometry_name": "POSISJON",
        "properties": {
            "BILDETYPE": "360",
            "AAR": 2021,
            "TIDSPUNKT": "2021-01-07T23:00:00Z",
            "FYLKENUMMER": 34,
            "VEGKATEGORI": "R",
            "VEGSTATUS": "V",
            "VEGNUMMER": 3,
            "STREKNING": 2,
            "HP": null,
            "DELSTREKNING": 1,
            "ANKERPUNKT": null,
            "KRYSSDEL": null,
            "SIDEANLEGGSDEL": null,
            "METER": 5345.983244536714,
            "FELTKODE": "2",
            "REFLINKID": 3106834,
            "REFLINKPOSISJON": 0.3433331524757512,
            "RETNING": 271.37,
            "URLPREVIEW": "https://placekitten.com/200/300",
            "URL": "https://s3vegbilder.utv.atlas.vegvesen.no/vegfoto-stm-2021/360/RV00003/S2/D1/F2_2021_01_08/blurred_ladybugImageOutput_00000008.jpg?st=2021-11-25T08:57:39Z&se=2021-11-25T18:57:39Z&sp=mr&sv=VF1&sig=tPTjpfhbqAH8lZRlurKOib3F74YfYv6JxRvzcefkuyw=",
            "DETEKTERTEOBJEKTER": null
        }
    },
    {
        "type": "Feature",
        "id": "Vegbilder_360_2021.2021-01-08T12.48.12.319247_RV00003_S2D1_m05326",
        "geometry": {
            "type": "Point",
            "coordinates": [
                11.30572786,
                60.83777044
            ]
        },
        "geometry_name": "POSISJON",
        "properties": {
            "BILDETYPE": "360",
            "AAR": 2021,
            "TIDSPUNKT": "2021-01-07T23:00:00Z",
            "FYLKENUMMER": 34,
            "VEGKATEGORI": "R",
            "VEGSTATUS": "V",
            "VEGNUMMER": 3,
            "STREKNING": 2,
            "HP": null,
            "DELSTREKNING": 1,
            "ANKERPUNKT": null,
            "KRYSSDEL": null,
            "SIDEANLEGGSDEL": null,
            "METER": 5326.021517565552,
            "FELTKODE": "2",
            "REFLINKID": 3106834,
            "REFLINKPOSISJON": 0.34196222564849443,
            "RETNING": 271.22,
            "URLPREVIEW": "https://placekitten.com/200/300",
            "URL": "https://s3vegbilder.utv.atlas.vegvesen.no/vegfoto-stm-2021/360/RV00003/S2/D1/F2_2021_01_08/blurred_ladybugImageOutput_00000007.jpg?st=2021-11-25T08:57:39Z&se=2021-11-25T18:57:39Z&sp=mr&sv=VF1&sig=ipWteYv0ynTeVC74Cnu9cSSwd0A5lQSuVAxqONwRUOk=",
            "DETEKTERTEOBJEKTER": null
        }
    },
    {
        "type": "Feature",
        "id": "Vegbilder_360_2021.2021-01-08T12.48.13.225313_RV00003_S2D1_m05306",
        "geometry": {
            "type": "Point",
            "coordinates": [
                11.30537986,
                60.83772521
            ]
        },
        "geometry_name": "POSISJON",
        "properties": {
            "BILDETYPE": "360",
            "AAR": 2021,
            "TIDSPUNKT": "2021-01-07T23:00:00Z",
            "FYLKENUMMER": 34,
            "VEGKATEGORI": "R",
            "VEGSTATUS": "V",
            "VEGNUMMER": 3,
            "STREKNING": 2,
            "HP": null,
            "DELSTREKNING": 1,
            "ANKERPUNKT": null,
            "KRYSSDEL": null,
            "SIDEANLEGGSDEL": null,
            "METER": 5306.074553065997,
            "FELTKODE": "2",
            "REFLINKID": 3106834,
            "REFLINKPOSISJON": 0.34059231267481804,
            "RETNING": 271.31,
            "URLPREVIEW": "https://placekitten.com/200/300",
            "URL": "https://s3vegbilder.utv.atlas.vegvesen.no/vegfoto-stm-2021/360/RV00003/S2/D1/F2_2021_01_08/blurred_ladybugImageOutput_00000006.jpg?st=2021-11-25T08:57:39Z&se=2021-11-25T18:57:39Z&sp=mr&sv=VF1&sig=lwNXyaEyLTz4EsDwH63C3Bgu3Ml1enwwYsu2I6R3wBY=",
            "DETEKTERTEOBJEKTER": null
        }
    },
    {
        "type": "Feature",
        "id": "Vegbilder_360_2021.2021-01-08T12.48.14.131362_RV00003_S2D1_m05286",
        "geometry": {
            "type": "Point",
            "coordinates": [
                11.30502164,
                60.83767719
            ]
        },
        "geometry_name": "POSISJON",
        "properties": {
            "BILDETYPE": "360",
            "AAR": 2021,
            "TIDSPUNKT": "2021-01-07T23:00:00Z",
            "FYLKENUMMER": 34,
            "VEGKATEGORI": "R",
            "VEGSTATUS": "V",
            "VEGNUMMER": 3,
            "STREKNING": 2,
            "HP": null,
            "DELSTREKNING": 1,
            "ANKERPUNKT": null,
            "KRYSSDEL": null,
            "SIDEANLEGGSDEL": null,
            "METER": 5286.061110091898,
            "FELTKODE": "2",
            "REFLINKID": 3106834,
            "REFLINKPOSISJON": 0.33921783410797834,
            "RETNING": 271.33,
            "URLPREVIEW": "https://placekitten.com/200/300",
            "URL": "https://s3vegbilder.utv.atlas.vegvesen.no/vegfoto-stm-2021/360/RV00003/S2/D1/F2_2021_01_08/blurred_ladybugImageOutput_00000005.jpg?st=2021-11-25T08:57:39Z&se=2021-11-25T18:57:39Z&sp=mr&sv=VF1&sig=JjCzgysla8s4A2LmvfofVJwTRbSgQYeAmmn1/5kzTfU=",
            "DETEKTERTEOBJEKTER": null
        }
    },
    {
        "type": "Feature",
        "id": "Vegbilder_360_2021.2021-01-08T12.48.15.037356_RV00003_S2D1_m05266",
        "geometry": {
            "type": "Point",
            "coordinates": [
                11.30468032,
                60.83763039
            ]
        },
        "geometry_name": "POSISJON",
        "properties": {
            "BILDETYPE": "360",
            "AAR": 2021,
            "TIDSPUNKT": "2021-01-07T23:00:00Z",
            "FYLKENUMMER": 34,
            "VEGKATEGORI": "R",
            "VEGSTATUS": "V",
            "VEGNUMMER": 3,
            "STREKNING": 2,
            "HP": null,
            "DELSTREKNING": 1,
            "ANKERPUNKT": null,
            "KRYSSDEL": null,
            "SIDEANLEGGSDEL": null,
            "METER": 5266.082589787444,
            "FELTKODE": "2",
            "REFLINKID": 3106834,
            "REFLINKPOSISJON": 0.3378457539520961,
            "RETNING": 271.39,
            "URLPREVIEW": "https://placekitten.com/200/300",
            "URL": "https://s3vegbilder.utv.atlas.vegvesen.no/vegfoto-stm-2021/360/RV00003/S2/D1/F2_2021_01_08/blurred_ladybugImageOutput_00000004.jpg?st=2021-11-25T08:57:39Z&se=2021-11-25T18:57:39Z&sp=mr&sv=VF1&sig=1J8zF30avviQZNKlsTLEBfdifQ6A3GKm9ZtRBFfGfQU=",
            "DETEKTERTEOBJEKTER": null
        }
    },
    {
        "type": "Feature",
        "id": "Vegbilder_360_2021.2021-01-08T12.48.15.927773_RV00003_S2D1_m05246",
        "geometry": {
            "type": "Point",
            "coordinates": [
                11.30432252,
                60.83757939
            ]
        },
        "geometry_name": "POSISJON",
        "properties": {
            "BILDETYPE": "360",
            "AAR": 2021,
            "TIDSPUNKT": "2021-01-07T23:00:00Z",
            "FYLKENUMMER": 34,
            "VEGKATEGORI": "R",
            "VEGSTATUS": "V",
            "VEGNUMMER": 3,
            "STREKNING": 2,
            "HP": null,
            "DELSTREKNING": 1,
            "ANKERPUNKT": null,
            "KRYSSDEL": null,
            "SIDEANLEGGSDEL": null,
            "METER": 5246.440423302674,
            "FELTKODE": "2",
            "REFLINKID": 3106834,
            "REFLINKPOSISJON": 0.3364967738253607,
            "RETNING": 271.37,
            "URLPREVIEW": "https://placekitten.com/200/300",
            "URL": "https://s3vegbilder.utv.atlas.vegvesen.no/vegfoto-stm-2021/360/RV00003/S2/D1/F2_2021_01_08/blurred_ladybugImageOutput_00000003.jpg?st=2021-11-25T08:57:39Z&se=2021-11-25T18:57:39Z&sp=mr&sv=VF1&sig=9Uy75doyEJUEEndSey9yL98BvHCNoJrw3n78IufgcRs=",
            "DETEKTERTEOBJEKTER": null
        }
    },
    {
        "type": "Feature",
        "id": "Vegbilder_360_2021.2021-01-08T12.48.16.849426_RV00003_S2D1_m05226",
        "geometry": {
            "type": "Point",
            "coordinates": [
                11.30396915,
                60.83752657
            ]
        },
        "geometry_name": "POSISJON",
        "properties": {
            "BILDETYPE": "360",
            "AAR": 2021,
            "TIDSPUNKT": "2021-01-07T23:00:00Z",
            "FYLKENUMMER": 34,
            "VEGKATEGORI": "R",
            "VEGSTATUS": "V",
            "VEGNUMMER": 3,
            "STREKNING": 2,
            "HP": null,
            "DELSTREKNING": 1,
            "ANKERPUNKT": null,
            "KRYSSDEL": null,
            "SIDEANLEGGSDEL": null,
            "METER": 5226.088093958015,
            "FELTKODE": "2",
            "REFLINKID": 3106834,
            "REFLINKPOSISJON": 0.33509902129943603,
            "RETNING": 271.32,
            "URLPREVIEW": "https://placekitten.com/200/300",
            "URL": "https://s3vegbilder.utv.atlas.vegvesen.no/vegfoto-stm-2021/360/RV00003/S2/D1/F2_2021_01_08/blurred_ladybugImageOutput_00000002.jpg?st=2021-11-25T08:57:39Z&se=2021-11-25T18:57:39Z&sp=mr&sv=VF1&sig=5nodIPs8PcQKxfW8B9l3Co5TF5wvW1mSWROPlbWmPBU=",
            "DETEKTERTEOBJEKTER": null
        }
    },
    {
        "type": "Feature",
        "id": "Vegbilder_360_2021.2021-01-08T12.48.17.739843_RV00003_S2D1_m05206",
        "geometry": {
            "type": "Point",
            "coordinates": [
                11.30362567,
                60.83747372
            ]
        },
        "geometry_name": "POSISJON",
        "properties": {
            "BILDETYPE": "360",
            "AAR": 2021,
            "TIDSPUNKT": "2021-01-07T23:00:00Z",
            "FYLKENUMMER": 34,
            "VEGKATEGORI": "R",
            "VEGSTATUS": "V",
            "VEGNUMMER": 3,
            "STREKNING": 2,
            "HP": null,
            "DELSTREKNING": 1,
            "ANKERPUNKT": null,
            "KRYSSDEL": null,
            "SIDEANLEGGSDEL": null,
            "METER": 5206.484142127518,
            "FELTKODE": "2",
            "REFLINKID": 3106834,
            "REFLINKPOSISJON": 0.3337526656698101,
            "RETNING": 271.5,
            "URLPREVIEW": "https://placekitten.com/200/300",
            "URL": "https://s3vegbilder.utv.atlas.vegvesen.no/vegfoto-stm-2021/360/RV00003/S2/D1/F2_2021_01_08/blurred_ladybugImageOutput_00000000.jpg?st=2021-11-25T08:57:39Z&se=2021-11-25T18:57:39Z&sp=mr&sv=VF1&sig=ZX+phrZy0eWs1enkY6gwbvyShck8+9FtKfa9OsZs2bo=",
            "DETEKTERTEOBJEKTER": null
        }
    },
    {
        "type": "Feature",
        "id": "Vegbilder_360_2021.2021-01-08T12.48.18.645898_RV00003_S2D1_m05187",
        "geometry": {
            "type": "Point",
            "coordinates": [
                11.30327016,
                60.83741582
            ]
        },
        "geometry_name": "POSISJON",
        "properties": {
            "BILDETYPE": "360",
            "AAR": 2021,
            "TIDSPUNKT": "2021-01-07T23:00:00Z",
            "FYLKENUMMER": 34,
            "VEGKATEGORI": "R",
            "VEGSTATUS": "V",
            "VEGNUMMER": 3,
            "STREKNING": 2,
            "HP": null,
            "DELSTREKNING": 1,
            "ANKERPUNKT": null,
            "KRYSSDEL": null,
            "SIDEANLEGGSDEL": null,
            "METER": 5186.653446069362,
            "FELTKODE": "2",
            "REFLINKID": 3106834,
            "REFLINKPOSISJON": 0.33239073775302325,
            "RETNING": 271.38,
            "URLPREVIEW": "https://placekitten.com/200/300",
            "URL": "https://s3vegbilder.utv.atlas.vegvesen.no/vegfoto-stm-2021/360/RV00003/S2/D1/F2_2021_01_08/blurred_ladybugImageOutput_00000001.jpg?st=2021-11-25T08:57:39Z&se=2021-11-25T18:57:39Z&sp=mr&sv=VF1&sig=fZRgVyToffdEob+nBEWlHdgfgzEG7xyUBFDVOKUGuiI=",
            "DETEKTERTEOBJEKTER": null
        }
    }
]

export default panoramaMockImages;