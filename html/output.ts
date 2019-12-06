
import { decorator } from '../utils/base'
import './styles/output';
import name from './names/output';

export default (...children: any) => <HTMLOutputElement><unknown>decorator(name, children);
