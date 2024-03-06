function getPreviousDates(dates, timeZoneOffset = 0) {
    const list = dates.map(days => {
        return new Date().getTime() - (timeZoneOffset * 60 * 1000) - (days * 24 * 60 * 60 * 1000)
    })
    return list.map(time => new Date(time).toDateString())
}

module.exports = getPreviousDates;