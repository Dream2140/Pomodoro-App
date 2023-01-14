/**
 * @description checkes if current radio button have attribute "checked"
 * @exports isChecked
 * @param {string} newVal current estimation value
 * @param {string} currentVal current radio button value
 * @return {string} empty string if fasle and attribute "checked" if true
 */
export default function (newVal, currentVal) {
    return newVal === currentVal ? 'checked' : '';
}