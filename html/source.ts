
import { decorator } from '../utils/base'
import './styles/source';
import name from './names/source';

export default (...children: any) => <HTMLSourceElement><unknown>decorator(name, children);
