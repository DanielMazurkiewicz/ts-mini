
import { decorator } from '../utils/base'
import './styles/dialog';
import name from './names/dialog';

export default (...children: any) => <HTMLDialogElement><unknown>decorator(name, children);
