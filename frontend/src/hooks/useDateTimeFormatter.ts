type dateDifferenceCalculatorReturnType = {
    millliseconds: number,
    seconds: number,
    minutes: number,
    hours: number,
    days: number,
    months: number,
    years: number
}

type dateDifferenceFormatReturnType = {
    value: number, 
    noun: string, 
    plural: string
}

export const useDateTimeFormatter = () => {
    const getNameDay = (dayNumber: number): string => {
        const days = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado']
        return days[dayNumber]
    }

    const getNameMonth = (date: Date): string => {
        const monthName = date.toLocaleString('pt-BR', { month: 'long' })
        return monthName
    }

    const dateDifferenceCalculator = (stringIso8601: string): dateDifferenceCalculatorReturnType => {
        const currentDate = new Date()
        const differenceInMilliseconds = currentDate.getTime() - new Date(stringIso8601).getTime()
        const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000)
        const differenceInMinutes = Math.floor(differenceInSeconds / 60)
        const differenceInHours = Math.floor(differenceInMinutes / 60)
        const differenceInDays = Math.floor(differenceInHours / 24)
        const differenceInMonths = Math.floor(differenceInDays / 30)
        const differenceInYears  = Math.floor(differenceInDays / 365)

        return {
            millliseconds: differenceInMilliseconds,
            seconds: differenceInSeconds,
            minutes: differenceInMinutes,
            hours: differenceInHours,
            days: differenceInDays,
            months: differenceInMonths,
            years: differenceInYears
        }
    }

    const dateDifferenceFormat = (stringIso8601: string): dateDifferenceFormatReturnType => {
        const difference = dateDifferenceCalculator(stringIso8601)

        if(difference.millliseconds < 1000){
            return {value: difference.seconds, noun: 'segundo', plural: 'segundos'}
        }else if(difference.seconds >= 1 && difference.seconds < 60){
            return {value: difference.seconds, noun: 'segundo', plural: 'segundos'}
        }else if(difference.minutes >= 1 && difference.minutes < 60){
            return {value: difference.minutes, noun: 'minuto', plural: 'minutos'}
        }else if(difference.hours >= 1 && difference.hours < 24){
            return {value: difference.hours, noun: 'hora', plural: 'horas'}
        }else if(difference.days >= 1 && difference.days < 30){
            return {value: difference.days, noun: 'dia', plural: 'dias'}
        }else if(difference.months >= 1 && difference.months < 12){
            return {value: difference.months, noun: 'mês', plural: 'meses'}
        }else{
            return {value: difference.years, noun: 'ano', plural: 'anos'}
        }

    }

    return {
        getNameDay,
        getNameMonth,
        dateDifferenceCalculator, 
        dateDifferenceFormat
    }
}