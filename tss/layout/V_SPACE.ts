import { ITSStyle } from "../structures/ITSStyle"
import startEndReverse from "../keywords/methods/startEndReverse"

export default (space: string): ITSStyle => ({align_content: startEndReverse[space] || space})
