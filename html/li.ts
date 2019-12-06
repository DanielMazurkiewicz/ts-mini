
import { decorator } from '../utils/base'
import './styles/li';
import name from './names/li';

export default (...children: any) => <HTMLLIElement><unknown>decorator(name, children);
