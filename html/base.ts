
import { decorator } from '../utils/base'
import './styles/base';
import name from './names/base';

export default (...children: any) => <HTMLBaseElement><unknown>decorator(name, children);
