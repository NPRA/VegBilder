import React, { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { makeStyles, IconButton, Typography} from '@material-ui/core';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow} from '@material-ui/core';
import { visuallyHidden } from '@material-ui/utils';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {groupBy} from "lodash";

import {IStatisticsFeatureProperties, IStatisticsRow } from './types';
import {
    availableStatisticsQuery
} from 'recoil/selectors';

const useStyles = makeStyles((theme) => ({
    scrollContainer: {
        overflowY: 'auto',
        marginTop: '10px',
        paddingTop: '5px',
        maxHeight: '30vh',
        '&::-webkit-scrollbar': {
          backgroundColor: theme.palette.common.grayDarker,
          width: '1rem',
        },
        '&::-webkit-scrollbar-track': {
          backgroundColor: theme.palette.common.grayDarker,
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: theme.palette.common.grayRegular,
          borderRadius: '1rem',
          border: `4px solid ${theme.palette.common.grayDarker}`,
        },
        '&::-webkit-scrollbar-button': {
          display: 'none',
        },
      },
    table: {
        width: "95%",
        margin: "auto",
        display: "flex",
        flexDirection: "column",
    },
    headerCell: {
        width: "25%",
        textAlign: "left",
        color: theme.palette.common.grayRegular,
        borderWidth: "2px",
        padding: "10px 20px 10px 20px",
        '&.ovrige': {
            width: "20%",
            '&.right' : {
                textAlign: "right"
            }
        },
        '&.right' : {
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
            borderWidth: "2px",
            '&.year': {
                textAlign: "left",
                paddingRight: "5px"
                },
            }
        }
    },
    percentage: {
        fontStyle: 'italic'
    },
    buttonContainer: {
        display: "flex",
        justifyContent: "flex-end"
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

const formatTableCell = (rowCategory: number): string => {
    return rowCategory !== 0 ? rowCategory.toLocaleString() : "";
}

const createTableRowsFromStatistics = (statistics: IStatisticsFeatureProperties[]): IStatisticsRow[] => {
    const statisticsGroupedByYear = groupBy(statistics, i => i.AAR);
    const currentYear = new Date().getFullYear().toString();

    const tableRows: IStatisticsRow[] = Object.keys(statisticsGroupedByYear).map((year) => {
        const row: IStatisticsRow = {year: year, E: 0, R: 0, F: 0, other: 0};
        
        statisticsGroupedByYear[year].forEach((category) => {
            switch (category.VEGKATEGORI) {
                case "E": row.E = category.ANTALL; break;
                case "R": row.R = category.ANTALL; break;
                case "F": row.F = category.ANTALL; break;
                default: row.other += category.ANTALL; break;
            };
        });
        return row;
    });

    // Dersom det ikke er lagt ut data for det inneværende året skal året fortsatt vises i tabellen.
    if (!tableRows.some(row => row.year === currentYear)) {
        tableRows.push({year: currentYear, E: 0, R: 0, F: 0, other: 0});
    };
    return tableRows;
}

const sortTableRowsBasedOnYear = (tableRows: IStatisticsRow[]) => {
    return tableRows.sort((rowA, rowB) => (rowA.year < rowB.year) ? 1 : -1);
}

const createTotalRowExcludingCurrentYear = (sortedTableRowsWithoutCurrentYear: IStatisticsRow[]): IStatisticsRow => {
    const currentYear = new Date().getFullYear();
    const previousYear = currentYear - 1;

    const onlyExistingValuesReducer = (prev: IStatisticsRow, cur: IStatisticsRow) => {
        return {
            year: `${previousYear} og eldre`,
            E: prev.E + cur.E,
            R: prev.R + cur.R,
            F: prev.F + cur.F,
            other: prev.other + cur.other,
        }
    }
    const totalRow = sortedTableRowsWithoutCurrentYear.reduce(onlyExistingValuesReducer);
    return totalRow;
}

const getImagesTotalForYear = (rowForCurrentYear: IStatisticsRow) => {
    let imagesTotalForYear = 0;
    for (const [key, value] of Object.entries(rowForCurrentYear)) {
        if (key !== 'year') {
            imagesTotalForYear += value;
        };
    }
    return imagesTotalForYear;
}

const getFormattedPercentageOfTotal = (numOfImg: number, total: number) => {
    if (typeof total === 'number' && total === 0) {
        return '';
    } else {
        return `${(numOfImg * 100/total).toLocaleString('no-NO', {maximumFractionDigits: 1, minimumFractionDigits: 1})}%`;
    }
};

export const StatisticsTable = () => {
    const classes = useStyles();
    const availableStatistics: IStatisticsFeatureProperties[] = useRecoilValue(availableStatisticsQuery);
    const tableRows = createTableRowsFromStatistics(availableStatistics);
    const sortedTableRows = sortTableRowsBasedOnYear(tableRows);
    const rowForCurrentYear = sortedTableRows[0];
    const sortedTableRowsWithoutCurrentYear = sortedTableRows.slice(1);
    const rowWithTotalValues = createTotalRowExcludingCurrentYear(sortedTableRowsWithoutCurrentYear);
    const imagesTotalForCurrentYear = getImagesTotalForYear(rowForCurrentYear);
    const [showExtendedTable, setShowExtendedTable] = useState(false);
    const showOvrigeColumn = rowWithTotalValues.other !== 0 ? true : false;

    const handleOpenExtendedTable = () => {
        showExtendedTable ? setShowExtendedTable(false) : setShowExtendedTable(true);
    }

    return (
        <div className={classes.table}>
            <div className={classes.scrollContainer}>
                <TableContainer>
                    <Table>
                        <caption style={visuallyHidden}>En tabell som gir en oversikt over hvor mange vegbilder som er tilgjengelige, kategorisert etter år og vegkategori.</caption>
                        <TableHead>
                            <TableRow>
                                <TableCell className={`${classes.headerCell} ${showOvrigeColumn ? `ovrige` : ""}`} scope="col">År</TableCell>
                                <TableCell className={`${classes.headerCell} ${showOvrigeColumn ? `ovrige` : ""} right`} scope="col">EV</TableCell>
                                <TableCell className={`${classes.headerCell} ${showOvrigeColumn ? `ovrige` : ""} right`} scope="col">RV</TableCell>
                                <TableCell className={`${classes.headerCell} ${showOvrigeColumn ? `ovrige` : ""} right`} scope="col">FV</TableCell>
                                {showOvrigeColumn && <TableCell className={`${classes.headerCell} ${showOvrigeColumn ? `ovrige` : ""} right`}>Øvrige</TableCell>}
                            </TableRow>
                        </TableHead>
                        < TableBody >
                            <TableRow>
                                <TableCell className={`${classes.contentCell} currentYear year`} component="th" scope="row">{rowForCurrentYear.year}</TableCell>
                                <TableCell className={`${classes.contentCell} currentYear ${showOvrigeColumn ? `ovrige` : ""}`}>
                                    <Typography>{`${formatTableCell(rowForCurrentYear.E)}`}</Typography>
                                    <Typography className={classes.percentage}>{`${getFormattedPercentageOfTotal(rowForCurrentYear.E, imagesTotalForCurrentYear)}`}</Typography>
                                </TableCell>
                                <TableCell className={`${classes.contentCell} currentYear ${showOvrigeColumn ? `ovrige` : ""}`}>
                                    <Typography>{formatTableCell(rowForCurrentYear.R)}</Typography>
                                    <Typography className={classes.percentage}>{`${getFormattedPercentageOfTotal(rowForCurrentYear.R, imagesTotalForCurrentYear)}`}</Typography>
                                </TableCell>
                                <TableCell className={`${classes.contentCell} currentYear ${showOvrigeColumn ? `ovrige` : ""}`}>
                                    <Typography>{formatTableCell(rowForCurrentYear.F)}</Typography>
                                    <Typography className={classes.percentage}>{`${getFormattedPercentageOfTotal(rowForCurrentYear.F, imagesTotalForCurrentYear)}`}</Typography>
                                </TableCell>
                                    {showOvrigeColumn && 
                                    <TableCell className={`${classes.contentCell} currentYear ${showOvrigeColumn ? `ovrige` : ""}`}>
                                         <Typography>{formatTableCell(rowForCurrentYear.other)}</Typography>
                                         <Typography className={classes.percentage}>{`${getFormattedPercentageOfTotal(rowForCurrentYear.other, imagesTotalForCurrentYear)}`}</Typography>
                                    </TableCell>}
                            </TableRow>
                            {showExtendedTable && sortedTableRowsWithoutCurrentYear.map((row) => {
                                return (
                                    <TableRow>
                                        <TableCell className={`${classes.contentCell} previousYears year`} component="th" scope="row">{row.year}</TableCell>
                                        <TableCell className={`${classes.contentCell} previousYears`}>{formatTableCell(row.E)}</TableCell>
                                        <TableCell className={`${classes.contentCell} previousYears`}>{formatTableCell(row.R)}</TableCell>
                                        <TableCell className={`${classes.contentCell} previousYears`}>{formatTableCell(row.F)}</TableCell>
                                        {showOvrigeColumn && <TableCell className={`${classes.contentCell} previousYears`}> {formatTableCell(row.other)}</TableCell>}
                                    </TableRow>
                                )
                            }
                            )}
                            {!showExtendedTable && <TableRow>
                                <TableCell className={`${classes.contentCell} previousYears total year`} component="th" scope="row">{rowWithTotalValues.year}</TableCell>
                                <TableCell className={`${classes.contentCell} previousYears total`}>{formatTableCell(rowWithTotalValues.E)}</TableCell>
                                <TableCell className={`${classes.contentCell} previousYears total`}>{formatTableCell(rowWithTotalValues.R)}</TableCell>
                                <TableCell className={`${classes.contentCell} previousYears total`}>{formatTableCell(rowWithTotalValues.F)}</TableCell>
                                {showOvrigeColumn && <TableCell className={`${classes.contentCell} previousYears total`}>{formatTableCell(rowWithTotalValues.other)}</TableCell>}
                            </TableRow>}
                        </TableBody>
                    </Table>
                </TableContainer >
            </div>
            <div className={classes.buttonContainer}>
                    <IconButton onClick={handleOpenExtendedTable} className={classes.button} aria-label="Vis og skjul flere år.">
                        {showExtendedTable ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
            </div>
        </div>);
}

