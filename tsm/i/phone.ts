import textBase from './methods/textBase'

const whileTyping = /^([+])?(\d+\s){0,5}(\d*)$/;
const whenEntered = /^([+])?(\d+\s){0,5}(\d+)$/;

export default textBase(whileTyping, whenEntered);