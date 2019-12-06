
import { decorator } from '../utils/base'
import './styles/option';
import name from './names/option';

export default (...children: any) => <HTMLOptionElement><unknown>decorator(name, children);
