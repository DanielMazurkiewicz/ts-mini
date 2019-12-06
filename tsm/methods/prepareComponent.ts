import { decorator, styleAdd, useAsStyle } from '../../utils/base'
import '../../html/styles/div';
import div from '../../html/names/div';
import { IStyleId } from '../../tss/tss';

export default (style: IStyleId) => 
<(...children: any) => HTMLDivElement> useAsStyle((...children: any) => decorator(div, [children, style]), style)
