
import { decorator } from '../utils/base'
import './styles/template';
import name from './names/template';

export default (...children: any) => <HTMLTemplateElement><unknown>decorator(name, children);
