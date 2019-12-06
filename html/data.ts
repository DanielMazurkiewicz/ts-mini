
import { decorator } from '../utils/base'
import './styles/data';
import name from './names/data';

export default (...children: any) => <HTMLDataElement><unknown>decorator(name, children);
