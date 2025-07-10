import { ref, readonly } from 'vue'


const buttonData = ref(null)
const buttonLable = ref(null)
export const useButtonState = () => {
    const setButtonData = (data, lable) => {
        buttonData.value = data
        buttonLable.value = lable

    }

    return {
        buttonData: readonly(buttonData),
        buttonLable: readonly(buttonLable),
        setButtonData
    }
}
