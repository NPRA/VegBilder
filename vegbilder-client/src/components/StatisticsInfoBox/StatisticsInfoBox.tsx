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
    table: {
        width: "90%",
        margin: "auto"
    },
    headerCell: {
        width: "25%",
        textAlign: "left",
        color: theme.palette.common.grayRegular,
        borderWidth: "2px",
        fontWeight: "bold",
        padding: "10px 20px 10px 20px",
        '&.Right' : {
            textAlign: "right"
        }
    },
    contentCell: {
        color: theme.palette.common.grayRegular,
        textAlign: "right",
        padding: "5px 20px 5px 20px",
        '&.currentYear': {
            paddingTop: "10px",
            paddingBottom: "10px",
            borderWidth: "2px",
            '&.year': {
                textAlign: "left"
            }
        },
        '&.previousYears': {
            borderBottom: `0.5px solid #999999`,
            '&.year': {
                textAlign: "left"
            },
        '&.total': {
            paddingTop: "10px",
            paddingBottom: "10px",
            '&.year': {
                textAlign: "left"
            },
        }
        }

    },
    footerCell: {
        borderBottom: "none",
        padding: "2px",
        textAlign: "right"
    },
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
            <TableContainer className={classes.table}>
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.headerCell}>År</TableCell>
                            <TableCell className={`${classes.headerCell} Right`}>EV</TableCell>
                            <TableCell className={`${classes.headerCell} Right`}>RV</TableCell>
                            <TableCell className={`${classes.headerCell} Right`}>FV</TableCell>
                            {showOvrigeTable && <TableCell className={`${classes.headerCell} Right`}>Øvrige</TableCell>}
                        </TableRow>
                    </TableHead>
                    < TableBody >
                        <TableRow>
                            <TableCell className={`${classes.contentCell} currentYear year`}>{rowForCurrentYear.year}</TableCell>
                            <TableCell className={`${classes.contentCell} currentYear`}>{rowForCurrentYear.E}</TableCell>
                            <TableCell className={`${classes.contentCell} currentYear`}>{rowForCurrentYear.R}</TableCell>
                            <TableCell className={`${classes.contentCell} currentYear`}>{rowForCurrentYear.F}</TableCell>
                            {showOvrigeTable && <TableCell align="right">{rowForCurrentYear?.other ? rowForCurrentYear.other : ""}</TableCell>}
                        </TableRow>
                        {showExtendedTable && sortedTableRowsWithoutCurrentYear.map((row) => {
                            return (
                                <TableRow>
                                    <TableCell className={`${classes.contentCell} previousYears year`}>{row.year}</TableCell>
                                    <TableCell className={`${classes.contentCell} previousYears`}> {row.E}</TableCell>
                                    <TableCell className={`${classes.contentCell} previousYears`}> {row.R}</TableCell>
                                    <TableCell className={`${classes.contentCell} previousYears`}> {row.F}</TableCell>
                                    {showOvrigeTable && <TableCell align="right"> {row.other ? row.other : ""}</TableCell>}
                                </TableRow>
                            )
                        }
                        )}
                        {!showExtendedTable && <TableRow>
                            <TableCell className={`${classes.contentCell} previousYears total year`}>{rowWithTotalValues.year}</TableCell>
                            <TableCell className={`${classes.contentCell} previousYears total`}>{rowWithTotalValues.E}</TableCell>
                            <TableCell className={`${classes.contentCell} previousYears total`}>{rowWithTotalValues.R}</TableCell>
                            <TableCell className={`${classes.contentCell} previousYears total`}>{rowWithTotalValues.F}</TableCell>
                            {showOvrigeTable && <TableCell align="right">{rowWithTotalValues?.other ? rowWithTotalValues.other : ""}</TableCell>}
                        </TableRow>}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TableCell className={classes.footerCell} colSpan={showOvrigeTable ? 5 : 4}>
                                <IconButton onClick={handleOpenExtendedTable} className={classes.button}>
                                {showExtendedTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer >);
}

