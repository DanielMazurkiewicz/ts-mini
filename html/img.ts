
import { decorator } from '../utils/base'
import './styles/img';
import name from './names/img';

export default (...children: any) => <HTMLImageElement><unknown>decorator(name, children);
