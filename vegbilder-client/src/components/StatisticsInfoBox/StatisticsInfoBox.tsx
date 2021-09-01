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


const vegvesenRoadCategories: string[] = ["E", "R", "F"];


const createTableRowsFromStatistics = (statistics: IStatisticsFeatureProperties[]) => {
    const statisticsGroupedByYear = groupBy(statistics, i => i.AAR);

    const tableRows: IStatisticsRow[] = Object.keys(statisticsGroupedByYear).map((year) => {
        const row = Object.create({});
        row[`year`] = year;
        statisticsGroupedByYear[year].forEach((category) => {
            if (vegvesenRoadCategories.includes(category.VEGKATEGORI)) {
                row[`${category.VEGKATEGORI}`] = category.ANTALL;
            } else {
                if (!(row.hasOwnProperty(`other`))) {
                    row[`other`] = category.ANTALL;
                } else {
                    row[`other`] += category.ANTALL;
                }
            }
        });
        return row;
    })
    return tableRows as IStatisticsRow[];
}


const sortTableRowsBasedOnYear = (tableRows: IStatisticsRow[]) => {
    return tableRows.sort((rowA, rowB) => (rowA.year < rowB.year) ? 1 : -1);
}

//Går ut ifra at inneværende å alltid sendes med selv om antall på alle veger skulle være 0.
const getRowForCurrentYear = (sortedTableRows: IStatisticsRow[]) => {
    return sortedTableRows[0];
}

//Synes ikke denne funskjonen er veldig pent skrevet per nå.
const createTotalRowExcludingCurrentYear = (sortedTableRows: IStatisticsRow[]) => {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const rowListWithoutCurrentYear = sortedTableRows.filter((row) => row.year !== currentYear.toString());
    const totalE = rowListWithoutCurrentYear.reduce((prev, cur) => prev + cur.E, 0);
    const totalR = rowListWithoutCurrentYear.reduce((prev, cur) => prev + cur.R, 0);
    const totalF = rowListWithoutCurrentYear.reduce((prev, cur) => prev + cur.F, 0);

    //Legger bare sammen dersom "other" eksisterer på gjeldende rad.
    const onlyExistingOtherValuesReducer = (prev: number, cur: IStatisticsRow) => {
        return cur.other !== null || cur.other !== undefined ? prev + cur.other : prev;
    }

    let categoryOtherExists = false;
    rowListWithoutCurrentYear.forEach((row) => row?.other ? categoryOtherExists = true : null);

    if (categoryOtherExists) {
        const totalOfCategoryOther = rowListWithoutCurrentYear.reduce(onlyExistingOtherValuesReducer, 0);
        return {
            year: `${previousYear.toString()} og eldre`,
            E: totalE,
            R: totalR,
            F: totalF,
            other: totalOfCategoryOther
        } as IStatisticsRow
    } else {
        return {
            year: `${previousYear.toString()} og eldre`,
            E: totalE,
            R: totalR,
            F: totalF
        } as IStatisticsRow;
    }
}

export const StatisticsInfoBox = () => {
    const classes = useStyles();
    const availableStatistics: IStatisticsFeatureProperties[] = useRecoilValue(availableStatisticsQuery);
    const tableRows = createTableRowsFromStatistics(availableStatistics);
    const sortedTableRows = sortTableRowsBasedOnYear(tableRows);
    const rowForCurrentYear = getRowForCurrentYear(sortedTableRows);
    const totalRow = createTotalRowExcludingCurrentYear(sortedTableRows);

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>År</TableCell>
                        <TableCell>EV</TableCell>
                        <TableCell>RV</TableCell>
                        <TableCell>FV</TableCell>
                        <TableCell>Øvrige</TableCell>
                    </TableRow>
                </TableHead>
                < TableBody >
                    {sortedTableRows.map((row) => {
                        return (
                            <TableRow>
                                <TableCell>
                                    <Typography variant="body1">{row.year}</Typography>
                                </TableCell>
                                <TableCell> {row.E}</TableCell>
                                <TableCell> {row.R}</TableCell>
                                <TableCell> {row.F}</TableCell>
                                <TableCell> {row.other ? row.other : "--"}</TableCell>
                            </TableRow>
                        )
                    }
                    )}
                    <TableRow>
                        <TableCell>{totalRow.year}</TableCell>
                        <TableCell>{totalRow.E}</TableCell>
                        <TableCell>{totalRow.R}</TableCell>
                        <TableCell>{totalRow.F}</TableCell>
                        <TableCell>{totalRow?.other ? totalRow.other : "--"}</TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </TableContainer >);
}

