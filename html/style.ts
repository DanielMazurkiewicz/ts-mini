
import { decorator } from '../utils/base'
import './styles/style';
import name from './names/style';

export default (...children: any) => <HTMLStyleElement><unknown>decorator(name, children);
