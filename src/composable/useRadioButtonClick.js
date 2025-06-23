/*useRadioButtonClick.js */

import { ref } from 'vue';
  // Each call creates its own isOpen ref

export const useRadioButtonClick = (id = null) => {
  
    const isOpen = ref(false);
    const setIsOpen = (value) => {
        console.log(`setIsOpen for ${id}:`, value);
        isOpen.value = value;
    }

    return {
        isOpen,
        setIsOpen
    }
};
