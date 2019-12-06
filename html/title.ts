
import { decorator } from '../utils/base'
import './styles/title';
import name from './names/title';

export default (...children: any) => <HTMLTitleElement><unknown>decorator(name, children);
