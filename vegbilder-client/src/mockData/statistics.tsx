import { IStatisticsRow, IStatisticsFeatureProperties } from '../components/PageInformation/tabs/Teknisk/StatisticsTable/types';

const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
}

export const availableStatisticsMock: IStatisticsFeatureProperties[] = [
    {
        AAR: '2021',
        ANTALL: 10,
        OPPDATERT: '',
        VEGKATEGORI: 'E'
    },
    {
        AAR: '2021',
        ANTALL: 20,
        OPPDATERT: '',
        VEGKATEGORI: 'F'
    },
    {
        AAR: '2021',
        ANTALL: 30,
        OPPDATERT: '',
        VEGKATEGORI: 'R'
    },
    {
        AAR: '2021',
        ANTALL: 1,
        OPPDATERT: '',
        VEGKATEGORI: 'K'
    },
    {
        AAR: '2020',
        ANTALL: 10,
        OPPDATERT: '',
        VEGKATEGORI: 'E'
    },
    {
        AAR: '2020',
        ANTALL: 20,
        OPPDATERT: '',
        VEGKATEGORI: 'F'
    },
    {
        AAR: '2020',
        ANTALL: 1,
        OPPDATERT: '',
        VEGKATEGORI: 'X'
    },
    {
        AAR: '2019',
        ANTALL: 10,
        OPPDATERT: '',
        VEGKATEGORI: 'E'
    },
    {
        AAR: '2019',
        ANTALL: 20,
        OPPDATERT: '',
        VEGKATEGORI: 'F'
    },
    {
        AAR: '2019',
        ANTALL: 30,
        OPPDATERT: '',
        VEGKATEGORI: 'R'
    },
    {
        AAR: '2018',
        ANTALL: 10,
        OPPDATERT: '',
        VEGKATEGORI: 'E'
    },
    {
        AAR: '2018',
        ANTALL: 1,
        OPPDATERT: '',
        VEGKATEGORI: 'Y'
    }
]

export const tableRowsMock: IStatisticsRow[] = [
    {year: "2021",
    E: getRandomInt(1000000000),
    F: getRandomInt(1000000000),
    },
    {year: "2020",
    E: getRandomInt(1000000000),
    F: getRandomInt(1000000000),
    },
    {year: "2019",
    E: getRandomInt(1000000000),
    F: getRandomInt(1000000000),
    other: getRandomInt(1000000000)
    },
    {year: "2018",
    E: getRandomInt(1000000000),
    F: getRandomInt(1000000000),
    other: getRandomInt(1000000000)
    },
    {year: "2017",
    E: getRandomInt(1000000000),
    F: getRandomInt(1000000000),
    R: getRandomInt(1000000000),
    other: getRandomInt(1000000000)
    },
    {year: "2016",
    E: getRandomInt(1000000000),
    F: getRandomInt(1000000000),
    R: getRandomInt(1000000000),
    other: getRandomInt(1000000000)
    },
    {year: "2015",
    E: getRandomInt(1000000000),
    F: getRandomInt(1000000000),
    R: getRandomInt(1000000000),
    other: getRandomInt(1000000000)
    },
    {year: "2014",
    E: getRandomInt(1000000000),
    F: getRandomInt(1000000000),
    R: getRandomInt(1000000000),
    other: getRandomInt(1000000000)
    },
    {year: "2013",
    E: getRandomInt(1000000000),
    F: getRandomInt(1000000000),
    R: getRandomInt(1000000000),
    other: getRandomInt(1000000000)
    },
    {year: "2012",
    E: getRandomInt(100000000),
    F: getRandomInt(100000000),
    R: getRandomInt(1000000),
    other: getRandomInt(1000000)
    },
    {year: "2011",
    E: 10,
    F: 20,
    R: 50,
    other: 40
    },
    {year: "2010",
    E: 10,
    F: 20,
    R: 50,
    other: 40
    }
]