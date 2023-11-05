import React from 'react'

export const useDateDifferenceCalculator = () => {
    const dateDifferenceCalculator = (stringIso8601: string) => {
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

    const dateDifferenceFormat = (stringIso8601: string) => {
        const difference = dateDifferenceCalculator(stringIso8601)

        if(difference.millliseconds < 1000){
            return {value: difference.seconds, noun: 'Segundos'}
        }else if(difference.seconds >= 1 && difference.seconds < 60){
            return {value: difference.seconds, noun: 'Segundos'}
        }else if(difference.minutes >= 1 && difference.minutes < 60){
            return {value: difference.minutes, noun: 'Minutos'}
        }else if(difference.hours >= 1 && difference.hours < 24){
            return {value: difference.hours, noun: 'Horas'}
        }else if(difference.days >= 1 && difference.days < 30){
            return {value: difference.days, noun: 'Dias'}
        }else if(difference.months >= 1 && difference.months < 12){
            return {value: difference.months, noun: 'Meses'}
        }else{
            return {value: difference.years, noun: 'Anos'}
        }

    }

    return {dateDifferenceCalculator, dateDifferenceFormat}
}