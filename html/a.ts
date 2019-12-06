
import { decorator } from '../utils/base'
import './styles/a';
import name from './names/a';

export default (...children: any) => <HTMLAnchorElement><unknown>decorator(name, children);
