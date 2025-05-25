export function calculateTotalAmount(dataArray) {
    return dataArray.reduce((total, data) => total + Number(data.amount), 0);
}

export function calculateNumberStats(dataArray) {
    const numberStats = {};
    dataArray.forEach(data => {
        if (!numberStats[data.number]) numberStats[data.number] = 0;
        numberStats[data.number] += Number(data.amount);
    });
    return numberStats;
}

export function calculateStatsByType(dataArray) {
    const statsByType = {};
    dataArray.forEach(data => {
        if (!statsByType[data.type]) statsByType[data.type] = {};
        if (!statsByType[data.type][data.number]) statsByType[data.type][data.number] = 0;
        statsByType[data.type][data.number] += Number(data.amount);
    });
    return statsByType;
}

export function sortDataByAmount(dataArray) {
    return [...dataArray].sort((a, b) => b.amount - a.amount);
}

export function getTopNumbersByType(statsByType, topCount = 3) {
    const topByType = {};
    for (const type in statsByType) {
        topByType[type] = Object.entries(statsByType[type])
            .sort((a, b) => b[1] - a[1])
            .slice(0, topCount);
    }
    return topByType;
}