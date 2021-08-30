import React from 'react';
import { useRecoilValue } from 'recoil';
import { makeStyles, Paper, Typography, Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


import { IStatisticsFeatureProperties, IStatisticsRow } from 'types';
import {
    availableStatisticsQuery
} from 'recoil/selectors';


const useStyles = makeStyles(() => ({
    paperContainer: {
        position: 'absolute',
        right: '2rem',
        bottom: '4rem',
        padding: '0.5rem 1rem',
        minWidth: '15rem',
        background: 'rgba(46, 53, 57, 0.80)',
        zIndex: 1,
        display: 'flex',
    },
}));

const getRoadCategoryName = (category: string) => {
    switch (category) {
        case "E":
            return "Europaveg";
        case "F":
            return "Fylkesveg";
        case "R":
            return "Riksveg";
    }
}


const getVegkategorierFromStatistics = (statistics: IStatisticsFeatureProperties[]): string[] => {
    const roadCategories = statistics.map((statistic) => statistic.VEGKATEGORI);
    const distinctRoadCategories: string[] = [...new Set(roadCategories)];
    return distinctRoadCategories;
}

const getYearsFromStatistics = (statistics: IStatisticsFeatureProperties[]) => {
    const years = statistics.map((propertiesObject) => propertiesObject.AAR);
    const distinctYears: string[] = [... new Set(years)];
    return distinctYears;
}

const createTableRowsFromStatistics = (statistics: IStatisticsFeatureProperties[]) => {
    const tableRow = Object.create({});
    statistics.forEach((statistic) => {
        const currentCategory = statistic.VEGKATEGORI;
        if (!(tableRow.hasOwnProperty(statistic.AAR))) {
            tableRow[`${statistic.AAR}`] = {};
        }
        if (!(tableRow[`${statistic.AAR}`].hasOwnProperty(`${currentCategory}`))) {
            tableRow[`${statistic.AAR}`][`${currentCategory}`] = statistic.ANTALL;
        }
    })
    return tableRow as IStatisticsRow;
}

export const StatisticsInfoBox = () => {
    const classes = useStyles();
    const availableStatistics: IStatisticsFeatureProperties[] = useRecoilValue(availableStatisticsQuery);
    const roadCategories = getVegkategorierFromStatistics(availableStatistics);
    const tableRows = createTableRowsFromStatistics(availableStatistics);

    console.log(Object.entries(tableRows));

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>År</TableCell>
                        {roadCategories.map((category) => (<TableCell><Typography>{getRoadCategoryName(category)}</Typography></TableCell>))}
                    </TableRow>
                </TableHead>
                < TableBody >
                    {Object.entries(tableRows).map((entry) => {
                        return (
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1">{entry[0]}</Typography>
                                </TableCell>
                                {Object.keys(entry[1]).map((key) => (
                                    <TableCell>{entry[1][key]}</TableCell>
                                ))}
                            </TableRow>
                        )
                    })}
                    <TableRow>
                        <TableCell scope="row"><Button>Vis mer</Button></TableCell>

                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer >);
}

