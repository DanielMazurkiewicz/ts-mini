
import dateBase from './methods/dateBase'
import { Day } from  '../../utils/dateTime'

const whileTyping = /^(\d{1,4}([\-](\d{0,2}([\-](\d{1,2})?)?)?)?)?$/;
const whenEntered = /^\d{4}-\d{2}-\d{2}$/;

export default dateBase(whileTyping, whenEntered, Day);
