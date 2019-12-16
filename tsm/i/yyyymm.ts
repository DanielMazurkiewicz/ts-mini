
import dateBase from './methods/dateBase'
import { Month } from  '../../utils/dateTime'

const whileTyping = /^(\d{0,4}([\-](\d{1,2})?)?)?$/;
const whenEntered = /^\d{4}-\d{2}$/;

export default dateBase(whileTyping, whenEntered, Month);