
import { decorator } from '../utils/base'
import './styles/label';
import name from './names/label';

export default (...children: any) => <HTMLLabelElement><unknown>decorator(name, children);
