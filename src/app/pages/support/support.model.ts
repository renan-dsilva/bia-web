import { SearchabelSelectOption } from "../components/searchable-select/searchable-select.model";

export class Support {
    constructor(
        public _id: string,
        public name?: string,
        public desc?: string,
        public level?: number,
        public phones?: string[],
        public emails?: string[],
        public status?: string
    ) { }

    static fromSelect(select: SearchabelSelectOption[]): Support[] {
        if (!select) {
            return [];
        }

        return select.map((s) => new this(s.value));
    }
}