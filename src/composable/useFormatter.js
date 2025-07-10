
//composables useCurrencyFormat
export const useFormatter = () => {


const  formatCurrency=(currencyCode,amount)=> {

        let locale = 'fi-FI' // Default locale for EUR

        // Select appropriate locale based on currency
        if (currencyCode === 'DKK') {
          locale = 'da-DK'
        } else if (currencyCode === 'NOK') {
          locale = 'nn-NO'
        } else if (currencyCode === 'SEK') {
          locale = 'sv-SE'
        }

        const formatter = new Intl.NumberFormat(locale, {
          style: 'currency',
          currency: currencyCode,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        })

        return formatter.format(amount)
}

const formatterPercent =(currencyCode,precent) => {


            let locale = 'fi-FI' // Default locale for EUR

            // Select appropriate locale based on currency
            if (currencyCode === 'DKK') {
            locale = 'da-DK'
            } else if (currencyCode === 'NOK') {
            locale = 'nn-NO'
            } else if (currencyCode === 'SEK') {
            locale = 'sv-SE'
            }


            const formatter = new Intl.NumberFormat(locale, {
              style: 'percent',
              minimumFractionDigits: 2,
              maximumFractionDigits: 2
            });

        return formatter.format(precent);

}




      return {
        formatCurrency,
        formatterPercent
      }


}
