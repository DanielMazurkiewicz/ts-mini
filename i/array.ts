import decorator from '../utils/decorator';
import div from '../html/short/div'
import '../html/styles/div'
import prepareArray from '../tsm/methods/prepareArray';


export default (...children: any) => <HTMLDivElement>decorator(prepareArray(div()), children);