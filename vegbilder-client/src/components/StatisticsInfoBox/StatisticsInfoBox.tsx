import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { makeStyles, Paper, Typography, Button } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import { DEFAULT_ROAD_CATEGORIES } from '../../constants/defaultParamters';
import { groupBy } from "../../utilities/customDataStructureUtilities";


import { IStatisticsFeatureProperties, IStatisticsRow } from 'types';
import {
    availableStatisticsQuery
} from 'recoil/selectors';


const createTableRowsFromStatistics = (statistics: IStatisticsFeatureProperties[]) => {
    const statisticsGroupedByYear = groupBy(statistics, i => i.AAR);

    const tableRows: IStatisticsRow[] = Object.keys(statisticsGroupedByYear).map((year) => {
        const row = Object.create({});
        row[`year`] = year;
        statisticsGroupedByYear[year].forEach((category) => {
            if (DEFAULT_ROAD_CATEGORIES.includes(category.VEGKATEGORI)) {
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
    const availableStatistics: IStatisticsFeatureProperties[] = useRecoilValue(availableStatisticsQuery);
    const tableRows = createTableRowsFromStatistics(availableStatistics);
    const sortedTableRows = sortTableRowsBasedOnYear(tableRows);
    const rowForCurrentYear = sortedTableRows[0];
    const sortedTableRowsWithoutCurrentYear = sortedTableRows.slice(1);
    const totalRow = createTotalRowExcludingCurrentYear(sortedTableRows);
    const [showExtendedTable, setShowExtendedTable] = useState(false);

    const handleOpenExtendedTable = () => {
        if (showExtendedTable === true) {
            setShowExtendedTable(false);
        } else {
            setShowExtendedTable(true);
        }
    }

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>År</TableCell>
                        <TableCell align="center">EV</TableCell>
                        <TableCell align="center">RV</TableCell>
                        <TableCell align="center">FV</TableCell>
                        <TableCell align="center">Øvrige</TableCell>
                    </TableRow>
                </TableHead>
                < TableBody >
                    <TableRow>
                        <TableCell>{rowForCurrentYear.year}</TableCell>
                        <TableCell>{rowForCurrentYear.E}</TableCell>
                        <TableCell>{rowForCurrentYear.R}</TableCell>
                        <TableCell>{rowForCurrentYear.F}</TableCell>
                        <TableCell>{rowForCurrentYear?.other}</TableCell>
                    </TableRow>
                    {showExtendedTable && sortedTableRowsWithoutCurrentYear.map((row) => {
                        return (
                            <TableRow>
                                <TableCell>{row.year}</TableCell>
                                <TableCell> {row.E}</TableCell>
                                <TableCell> {row.R}</TableCell>
                                <TableCell> {row.F}</TableCell>
                                <TableCell> {row.other ? row.other : "--"}</TableCell>
                            </TableRow>
                        )
                    }
                    )}
                    {!showExtendedTable ? <TableRow>
                        <TableCell>{totalRow.year}</TableCell>
                        <TableCell>{totalRow.E}</TableCell>
                        <TableCell>{totalRow.R}</TableCell>
                        <TableCell>{totalRow.F}</TableCell>
                        <TableCell>{totalRow?.other ? totalRow.other : "--"}</TableCell>
                    </TableRow> : null}
                    <Button onClick={handleOpenExtendedTable}>{showExtendedTable ? "Vis mindre" : "Vis mer"}</Button>
                </TableBody>
            </Table>
        </TableContainer >);
}

