
import { decorator } from '../utils/base'
import './styles/embed';
import name from './names/embed';

export default (...children: any) => <HTMLEmbedElement><unknown>decorator(name, children);
