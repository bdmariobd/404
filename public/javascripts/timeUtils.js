"use strict"

const DATE_UNITS = {
    year: 31556952,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
}

function getSecondsDiff(timestamp) {
    return (Date.now() - timestamp) / 1000;
}

function getUnitAndValueDate(secondsElapsed) {
    for (const [unit, secondsInUnit] of Object.entries(DATE_UNITS)) {
        if (secondsElapsed >= secondsInUnit || unit === "second") {
            const value = Math.floor(secondsElapsed / secondsInUnit) * -1
            return { value, unit }
        }
    }
}

function getTimeAgo(timestamp) {
    const rtf = new Intl.RelativeTimeFormat({
        localeMatcher: 'best fit',
        numeric: 'auto',
        style: 'long'
    });
    const secondsElapsed = getSecondsDiff(timestamp)
    const { value, unit } = getUnitAndValueDate(secondsElapsed)
    return rtf.format(value, unit)
}

module.exports = {
    getTimeAgo
}