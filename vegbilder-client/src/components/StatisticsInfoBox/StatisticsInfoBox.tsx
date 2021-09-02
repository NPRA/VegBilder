import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { makeStyles, withStyles, Paper, Typography, Button, IconButton } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
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

const useStyles = makeStyles((theme) => ({
    button: {
        color: theme.palette.common.orangeDark,
        textDecoration: 'none',
        backgroundColor: theme.palette.common.grayMedium,
        border: `1px solid ${theme.palette.common.orangeDark}`,
        '&:hover': {
            color: theme.palette.common.orangeDark,
            borderBottom: `2px solid ${theme.palette.common.orangeDark}`,
            backgroundColor: theme.palette.common.charcoalLighter
        },
    },
}));


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

const StyledTableCell = withStyles((theme) => ({
    root: {
        color: "white",
    }
}))(TableCell);

export const StatisticsInfoBox = () => {
    const classes = useStyles();
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
        <div>
            <TableContainer>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell>År</StyledTableCell>
                            <StyledTableCell align="right">EV</StyledTableCell>
                            <StyledTableCell align="right">RV</StyledTableCell>
                            <StyledTableCell align="right">FV</StyledTableCell>
                            <StyledTableCell align="right">Øvrige</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    < TableBody >
                        <TableRow>
                            <StyledTableCell>{rowForCurrentYear.year}</StyledTableCell>
                            <StyledTableCell align="right">{rowForCurrentYear.E}</StyledTableCell>
                            <StyledTableCell align="right">{rowForCurrentYear.R}</StyledTableCell>
                            <StyledTableCell align="right">{rowForCurrentYear.F}</StyledTableCell>
                            <StyledTableCell align="right">{rowForCurrentYear?.other ? rowForCurrentYear.other : "--"}</StyledTableCell>
                        </TableRow>
                        {showExtendedTable && sortedTableRowsWithoutCurrentYear.map((row) => {
                            return (
                                <TableRow>
                                    <StyledTableCell >{row.year}</StyledTableCell>
                                    <StyledTableCell align="right"> {row.E}</StyledTableCell>
                                    <StyledTableCell align="right"> {row.R}</StyledTableCell>
                                    <StyledTableCell align="right"> {row.F}</StyledTableCell>
                                    <StyledTableCell align="right"> {row.other ? row.other : "--"}</StyledTableCell>
                                </TableRow>
                            )
                        }
                        )}
                        {!showExtendedTable ? <TableRow>
                            <StyledTableCell>{totalRow.year}</StyledTableCell>
                            <StyledTableCell align="right">{totalRow.E}</StyledTableCell>
                            <StyledTableCell align="right">{totalRow.R}</StyledTableCell>
                            <StyledTableCell align="right">{totalRow.F}</StyledTableCell>
                            <StyledTableCell align="right">{totalRow?.other ? totalRow.other : "--"}</StyledTableCell>
                        </TableRow> : null}
                    </TableBody>
                </Table>
            </TableContainer >
            <IconButton onClick={handleOpenExtendedTable}>{showExtendedTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}</IconButton>
            {/* <Button startIcon={showExtendedTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} onClick={handleOpenExtendedTable} className={classes.button}></Button> */}
        </div>);
}

