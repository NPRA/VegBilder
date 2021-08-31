import React from 'react';
import { useRecoilValue } from 'recoil';
import { makeStyles, Paper, Typography, Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { groupBy } from "../../utilities/customDataStructureUtilities";


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
            return "Europaveger";
        case "F":
            return "Fylkesveger";
        case "R":
            return "Riksveger";
    }
}


const getVegkategorierFromStatistics = (statistics: IStatisticsFeatureProperties[]): string[] => {
    const roadCategories = statistics.map((statistic) => statistic.VEGKATEGORI);
    const distinctRoadCategories: string[] = [...new Set(roadCategories)];
    return distinctRoadCategories;
}


const createTableRowsFromStatistics = (statistics: IStatisticsFeatureProperties[]) => {
    const statisticsGroupedByYear = groupBy(statistics, i => i.AAR);
    const tableRows: IStatisticsRow[] = [];
    Object.keys(statisticsGroupedByYear).map((year) => {
        const row = Object.create({});
        row[`year`] = year;
        statisticsGroupedByYear[year].map((category) => {
            row[`${category.VEGKATEGORI}`] = category.ANTALL;
        });
        tableRows.push(row);
    })
    return tableRows as IStatisticsRow[];
}

export const StatisticsInfoBox = () => {
    const classes = useStyles();
    const availableStatistics: IStatisticsFeatureProperties[] = useRecoilValue(availableStatisticsQuery);
    const roadCategories = getVegkategorierFromStatistics(availableStatistics);
    const tableRows = createTableRowsFromStatistics(availableStatistics);

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
                    {tableRows.map((row) => {
                        return (
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1">{row.year}</Typography>
                                </TableCell>
                                <TableCell> {row.E != null ? row.E : "--"}</TableCell>
                                <TableCell> {row.F != null ? row.F : "--"}</TableCell>
                                <TableCell> {row.R != null ? row.R : "--"}</TableCell>
                            </TableRow>
                        )
                    }
                    )}
                    <TableRow>
                        <TableCell scope="row"><Button>Vis mer</Button></TableCell>

                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer >);
}

