
import { decorator } from '../utils/base'
import './styles/link';
import name from './names/link';

export default (...children: any) => <HTMLLinkElement><unknown>decorator(name, children);
