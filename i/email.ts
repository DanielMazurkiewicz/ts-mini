import textBase from './methods/textBase'

const whileTyping = /^([\w\-\_]+\.)*(([\w\-\_]+)(@(([\w\-\_]+\.)*([\w\-\_]*))?)?)?$/;
const whenEntered = /^((\w|[-_])+\.)*((\w|[-_])+)@((\w|[-_])+\.)+((\w|[-_]){2,})$/;

export default textBase(whileTyping, whenEntered);