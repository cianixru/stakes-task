export const getYearsFromSomeToCurrent = (from: number = 1950): number[] => {
    const currentYear = (new Date()).getFullYear()
    const years = []
    for (let i = currentYear; i >= from; i--)
        // @ts-ignore
        years.push(i)

    return years
}
