import { Nameable } from '../../common/domain/Nameable';

export namespace Sort {

    /**
     * Sort based on a simple string.
     *
     * @param a
     * @param b
     * @returns {number}
     * @todo relocate this to a more appropriate location
     */
    export function asString(a: string, b: string): number {
        if (!a || !b) return 0; // abort on nothing useful

        if (a.toUpperCase() < b.toUpperCase()) return -1;
        if (a.toUpperCase() > b.toUpperCase()) return  1;

        return 0;
    }

    /**
     * Sort based on a `Nameable` object.
     *
     * @param a
     * @param b
     * @returns {number}
     * @todo relocate this to a more appropriate location
     */
    export function asNameable(a: Nameable, b: Nameable) {
        return asString(a.name, b.name);
    }

}