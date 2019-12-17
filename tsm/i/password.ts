import textBase from './methods/textBase'

const whileTyping = /^(\S+(\s\S+)*\s?)?$/;
const whenEntered = /^\S+(\s\S+)*$/;

export default textBase(whileTyping, whenEntered, 'password', 6);