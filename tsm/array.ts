import { decorator } from '../utils/base';
import div from '../html/short/div'
import '../html/styles/div'
import prepareArray from './methods/prepareArray';


export default (...children: any) => <HTMLDivElement>decorator(prepareArray(div()), children);