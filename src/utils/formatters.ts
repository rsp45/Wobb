﻿export function formatNumber(count: number): string {
  if (count >= 1000000) {
    return (count / 1000000).toFixed(1) + "M";
  }
  if (count >= 1000) {
    return (count / 1000).toFixed(1) + "K";
  }
  return count.toString();
}

export function formatFollowers(count: number): string {
  return formatNumber(count);
}

export function formatEngagementRate(rate: number | undefined): string {
  if (rate === undefined) return "N/A";
  return (rate * 100).toFixed(2) + "%";
}

export function formatCompactEngagementRate(rate: number | undefined): string {
  if (rate === undefined) return "N/A";
  return (rate * 100).toFixed(1) + "%";
}

export function formatPercent(weight: number | undefined): string {
  if (weight === undefined) return "N/A";
  return `${Math.round(weight * 100)}%`;
}
