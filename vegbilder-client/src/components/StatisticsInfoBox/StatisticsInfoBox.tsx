import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { makeStyles, withStyles, IconButton } from '@material-ui/core';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableFooter from '@material-ui/core/TableFooter';
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
        backgroundColor: "transparent",
        '&:hover': {
            color: theme.palette.common.orangeDark,
            backgroundColor: "transparent"
        },
    },
}));

const StyledTableCell = withStyles((theme) => ({
    root: {
        color: "white",
        borderBottom: "0.5px dotted white"
    }
}))(TableCell);

const StyledFooterCell = withStyles((theme) => ({
    root: {
        borderBottom: "none",

    }
}))(TableCell)


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

const createTotalRowExcludingCurrentYear = (sortedTableRows: IStatisticsRow[]) => {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;
    const rowListWithoutCurrentYear = sortedTableRows.filter((row) => row.year !== currentYear.toString());

    //Legger bare sammen dersom propertu eksisterer på gjeldende rad for å unngå NaN i tabell.
    const onlyExistingValuesReducer = (prev: IStatisticsRow, cur: IStatisticsRow) => {
        return {
            year: `${previousYear.toString()} og eldre`,
            E: cur?.E ? prev.E + cur.E : prev.E,
            R: cur?.R ? prev.R + cur.R : prev.R,
            F: cur?.F ? prev.F + cur.F : prev.F,
            other: cur?.other ? prev.other + cur.other : prev.other
        } as IStatisticsRow
    }
    return rowListWithoutCurrentYear.reduce(onlyExistingValuesReducer) as IStatisticsRow;
}


export const StatisticsInfoBox = () => {
    const classes = useStyles();
    const availableStatistics: IStatisticsFeatureProperties[] = useRecoilValue(availableStatisticsQuery);
    const tableRows = createTableRowsFromStatistics(availableStatistics);
    const sortedTableRows = sortTableRowsBasedOnYear(tableRows);
    const rowForCurrentYear = sortedTableRows[0];
    const sortedTableRowsWithoutCurrentYear = sortedTableRows.slice(1);
    const rowWithTotalValues = createTotalRowExcludingCurrentYear(sortedTableRows);
    const [showExtendedTable, setShowExtendedTable] = useState(false);
    const showOvrigeTable = rowWithTotalValues.other != undefined ? true : false;

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
                            {showOvrigeTable && <StyledTableCell align="right">Øvrige</StyledTableCell>}
                        </TableRow>
                    </TableHead>
                    < TableBody >
                        <TableRow>
                            <StyledTableCell>{rowForCurrentYear.year}</StyledTableCell>
                            <StyledTableCell align="right">{rowForCurrentYear.E}</StyledTableCell>
                            <StyledTableCell align="right">{rowForCurrentYear.R}</StyledTableCell>
                            <StyledTableCell align="right">{rowForCurrentYear.F}</StyledTableCell>
                            {showOvrigeTable && <StyledTableCell align="right">{rowForCurrentYear?.other ? rowForCurrentYear.other : ""}</StyledTableCell>}
                        </TableRow>
                        {showExtendedTable && sortedTableRowsWithoutCurrentYear.map((row) => {
                            return (
                                <TableRow>
                                    <StyledTableCell >{row.year}</StyledTableCell>
                                    <StyledTableCell align="right"> {row.E}</StyledTableCell>
                                    <StyledTableCell align="right"> {row.R}</StyledTableCell>
                                    <StyledTableCell align="right"> {row.F}</StyledTableCell>
                                    {showOvrigeTable && <StyledTableCell align="right"> {row.other ? row.other : ""}</StyledTableCell>}
                                </TableRow>
                            )
                        }
                        )}
                        {!showExtendedTable && <TableRow>
                            <StyledTableCell >{rowWithTotalValues.year}</StyledTableCell>
                            <StyledTableCell align="right">{rowWithTotalValues.E}</StyledTableCell>
                            <StyledTableCell align="right">{rowWithTotalValues.R}</StyledTableCell>
                            <StyledTableCell align="right">{rowWithTotalValues.F}</StyledTableCell>
                            {showOvrigeTable && <StyledTableCell align="right">{rowWithTotalValues?.other ? rowWithTotalValues.other : ""}</StyledTableCell>}
                        </TableRow>}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <StyledFooterCell colSpan={showOvrigeTable ? 5 : 4}>
                                <IconButton onClick={handleOpenExtendedTable} className={classes.button}>
                                {showExtendedTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                            </StyledFooterCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer >

        </div>);
}

