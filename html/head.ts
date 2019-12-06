
import { decorator } from '../utils/base'
import './styles/head';
import name from './names/head';

export default (...children: any) => <HTMLHeadElement><unknown>decorator(name, children);
