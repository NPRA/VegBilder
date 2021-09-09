import {IStatisticsRow } from '../components/PageInformation/tabs/Teknisk/StatisticsTable/types';

const getRandomInt = (max: number): number => {
    return Math.floor(Math.random() * max);
}

// Kan byttes ut med tableRow i statistikken 
export const availableStatisticsMock: IStatisticsRow[] = [
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