import { SearchabelSelectOption } from "../components/searchable-select/searchable-select.model";
import { Area } from "../areas/area.model";

export class Process {
    constructor(
        public _id: string,
        public area?: Area,
        public name?: string,
        public desc?: string,
        public status?: string
    ) { }

    static fromSelect(select: SearchabelSelectOption[]): Process[] {
        if (!select) {
            return [];
        }

        return select.map((s) => new this(s.value));
    }
}