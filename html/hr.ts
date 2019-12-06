
import { decorator } from '../utils/base'
import './styles/hr';
import name from './names/hr';

export default (...children: any) => <HTMLHRElement><unknown>decorator(name, children);
