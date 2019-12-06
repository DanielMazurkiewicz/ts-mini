
import { decorator } from '../utils/base'
import './styles/textarea';
import name from './names/textarea';

export default (...children: any) => <HTMLTextAreaElement><unknown>decorator(name, children);
