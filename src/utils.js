function getPreviousDates(dates) {
    const list = dates.map(days => {
        return new Date().getTime() - (days * 24 * 60 * 60 * 1000)
    })
    return list.map(time => new Date(time).toDateString())
}

module.exports = getPreviousDates;