

// calculate the flex order value based on the weight numbers
//If weight is positive (0–100), return it directly.
//If weight is negative, subtract it from 100 to get the right flex order:

/*
* @param {number} weightValue - The weight value between -100 and 100 ( can go from -999 to 999 )
* @returns {number} The corresponding flex order value
*
*/

import { ref, computed } from 'vue'

export const useWeightToOrder = () => {

  // calculate the flex order value based on the weight numbers
  const getOrderFromWeight = (weightValue) => {
    return Number(weightValue) >= 0 ? Number(weightValue) : 100 + Math.abs(Number(weightValue));
  }

  // calculate tabindex to match visual order
  const getTabIndexFromWeight = (weightValue) => {
    // Convert weight to a tabindex that follows visual order
    // Lower weights (higher visual priority) get lower tabindex values
    const order = getOrderFromWeight(weightValue);

    // Since flex order 0 comes first visually, we want tabindex 1
    // We add 1 because tabindex should start at 1, not 0
    return order + 1;
  }

  // Helper to sort items by weight for consistent ordering
  const sortByWeight = (items, weightKey = 'weight') => {
    return [...items].sort((a, b) => {
      const weightA = getOrderFromWeight(a[weightKey]);
      const weightB = getOrderFromWeight(b[weightKey]);
      return weightA - weightB;
    });
  }

  // For managing  components with sequential tabindex-- sortof working
  const createTabIndexManager = (items) => {
    const itemsRef = ref(items || []);

    const sortedItems = computed(() => sortByWeight(itemsRef.value));

    const getSequentialTabIndex = (item, _weightKey = 'weight') => {
      const index = sortedItems.value.findIndex(i => i === item);
      return index + 1; // tabindex starts at 1
    }

    return {
      items: itemsRef,
      sortedItems,
      getSequentialTabIndex
    }
  }

  return {
    getOrderFromWeight,
    getTabIndexFromWeight,
    sortByWeight,
    createTabIndexManager
  }
}
