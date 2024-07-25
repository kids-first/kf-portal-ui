// cypress/support/utils.ts

// Fonction pour obtenir les variables de date et d'heure
export const getDateTime = () => {
    const date = new Date();
    const joinWithPadding = (l: number[]) => l.reduce((xs, x) => xs + `${x}`.padStart(2, '0'), '');
    const strDate = joinWithPadding([date.getFullYear(), date.getMonth() + 1, date.getDate()]);
    const strTime = joinWithPadding([date.getHours(), date.getMinutes()]);
    const strDate2 = `${strDate.slice(0, 4)}-${strDate.slice(4, 6)}-${strDate.slice(6, 8)}`;
    // Retourner les variables de date et d'heure
    return { strDate, strTime };
};

export const oneMinute = 60*1000;