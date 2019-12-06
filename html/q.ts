
import { decorator } from '../utils/base'
import './styles/q';
import name from './names/q';

export default (...children: any) => <HTMLQuoteElement><unknown>decorator(name, children);
