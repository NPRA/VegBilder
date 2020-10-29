import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";
import { ReactComponent as ArrowDownSvg } from "./Arrow-down.svg";
import { ReactComponent as ArrowTurnSvg } from "./Arrow-turn.svg";
import { ReactComponent as ArrowUpSvg } from "./Arrow-up.svg";
import { ReactComponent as DotsHorizontalSvg } from "./Dots-horizontal.svg";
import { ReactComponent as HistorySvg } from "./History.svg";
import { ReactComponent as MagnifyingGlassSvg } from "./Magnifying-glass.svg";
import { ReactComponent as MapSvg } from "./Map.svg";
import { ReactComponent as MeasureSvg } from "./Measure.svg";
import { ReactComponent as PlaySvg } from "./Play.svg";

function ArrowDownIcon() {
  return <SvgIcon component={ArrowDownSvg} viewBox="8 8 24 24" />;
}

function ArrowTurnIcon() {
  return <SvgIcon component={ArrowTurnSvg} viewBox="8 8 24 24" />;
}

function ArrowUpIcon() {
  return <SvgIcon component={ArrowUpSvg} viewBox="8 8 24 24" />;
}

function DotsHorizontalIcon() {
  return <SvgIcon component={DotsHorizontalSvg} viewBox="8 8 24 24" />;
}

function HistoryIcon() {
  return <SvgIcon component={HistorySvg} viewBox="8 8 24 24" />;
}

function MagnifyingGlassIcon() {
  return <SvgIcon component={MagnifyingGlassSvg} viewBox="-5 -5 30 30" />;
}

function MapIcon() {
  return <SvgIcon component={MapSvg} viewBox="8 8 24 24" />;
}

function MeasureIcon() {
  return <SvgIcon component={MeasureSvg} viewBox="8 8 24 24" />;
}

function PlayIcon() {
  return <SvgIcon component={PlaySvg} viewBox="8 8 24 24" />;
}

export {
  ArrowDownIcon,
  ArrowTurnIcon,
  ArrowUpIcon,
  DotsHorizontalIcon,
  HistoryIcon,
  MagnifyingGlassIcon,
  MapIcon,
  MeasureIcon,
  PlayIcon,
};
