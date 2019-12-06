
import { decorator } from '../utils/base'
import './styles/param';
import name from './names/param';

export default (...children: any) => <HTMLParamElement><unknown>decorator(name, children);
