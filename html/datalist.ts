
import { decorator } from '../utils/base'
import './styles/datalist';
import name from './names/datalist';

export default (...children: any) => <HTMLDataListElement><unknown>decorator(name, children);
