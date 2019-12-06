
import { decorator } from '../utils/base'
import './styles/select';
import name from './names/select';

export default (...children: any) => <HTMLSelectElement><unknown>decorator(name, children);
