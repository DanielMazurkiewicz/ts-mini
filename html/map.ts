
import { decorator } from '../utils/base'
import './styles/map';
import name from './names/map';

export default (...children: any) => <HTMLMapElement><unknown>decorator(name, children);
