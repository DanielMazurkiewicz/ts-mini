
import { decorator } from '../utils/base'
import './styles/br';
import name from './names/br';

export default (...children: any) => <HTMLBRElement><unknown>decorator(name, children);
