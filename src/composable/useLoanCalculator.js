// useLoanCalculator.js - Fixed version with proper initialization
import { ref, computed } from 'vue'
import loandata from '../assets/loanCalc.json'

// Create a shared state that will be consistent across all component instances
const year_count = ref(5)
const loan_amount = ref(250000)
const loan_data = ref(loandata)
const current_data = ref(null)

// Define findLoanData function before using it
function findLoanData(period, amount) {
    if (!loan_data.value || !Array.isArray(loan_data.value)) return null

    period = parseInt(period)
    amount = parseInt(amount)

    // Find exact match first
    let exactMatch = loan_data.value.find(o => o.years === period && o.amount === amount)

    if (exactMatch) return exactMatch

    // If no exact match, find closest amount for the same period
    const sameYearData = loan_data.value.filter(o => o.years === period)

    if (sameYearData.length === 0) return null

    // Sort by how close the amount is to the requested amount
    sameYearData.sort((a, b) => {
        return Math.abs(a.amount - amount) - Math.abs(b.amount - amount)
    })

    // Return the closest match
    return sameYearData[0]
}

// Define updateCurrentData function
function updateCurrentData() {
    const foundData = findLoanData(year_count.value, loan_amount.value)
    // console.log('foundData:', foundData)
    if (foundData) {
        // Create a new object to ensure reactivity
        current_data.value = { ...foundData }
    } else {
        console.warn(`No loan data found for ${year_count.value} years and ${loan_amount.value} amount`)
        // Default values if no matching data is found
        current_data.value = {
            years: year_count.value,
            amount: loan_amount.value,
            monthly_payment: 0,
            interest_rate: 0
        }
    }

    // Debug output
    /*
    console.log('Loan data updated:', {
        years: year_count.value,
        amount: loan_amount.value,
        payment: current_data.value?.monthly_payment
    })
        */
}

// Initialize with default values
updateCurrentData()

export function useLoanCalculator() {
    const setYearCount = (years) => {
        year_count.value = parseInt(years)
        updateCurrentData()
    }

    const setLoanAmount = (amount) => {
        loan_amount.value = parseInt(amount)
        updateCurrentData()
    }

    // Computed property that directly references current_data
    const currentLoanData = computed(() => current_data.value)

    return {
        setLoanAmount,
        setYearCount,
        currentLoanData,
        findLoanData,
        // Expose the reactive references directly
        loan_amount,
        year_count
    }
}