/** Update 更新顺序表。小号先走，大号后走，同号看 subOrder，再相同就先来后到 */
export const enum Order {
    begin,
    begin_input,
    begin_keybind,
    begin_bg,
    end
}