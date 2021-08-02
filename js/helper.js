export const check_positive_numbers = (...inputs) => inputs.every(inp => inp > 0);
export const check_valid_numbers =(...inputs) => inputs.every((input) => Number.isFinite(input));
export const hide_after_seconds = async (sec, elem)=>{await setTimeout(() =>{ elem.classList.add('hidden') },sec * 1000)}