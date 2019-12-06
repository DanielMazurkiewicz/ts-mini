
import { decorator } from '../utils/base'
import './styles/fieldset';
import name from './names/fieldset';

export default (...children: any) => <HTMLFieldSetElement><unknown>decorator(name, children);
