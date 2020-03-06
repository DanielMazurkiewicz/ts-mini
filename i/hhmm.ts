import timeBase from './methods/timeBase'
import { Minute } from  '../utils/dateTime'

const whileTyping = /^(\d{0,2}([\:](\d{1,2})?)?)?$/;
const whenEntered = /^\d{2}:\d{2}$/;

export default timeBase(whileTyping, whenEntered, Minute);