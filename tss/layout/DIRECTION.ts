import { ITSStyle } from "../structures/ITSStyle"

export default (dir: string, dense?: any): ITSStyle => ({grid_auto_flow: dir + dense ? ' dense' : ''})
