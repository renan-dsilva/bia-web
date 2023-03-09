import { SearchabelSelectOption } from "../components/searchable-select/searchable-select.model";

export class Area {
    constructor(
        public _id: string,
        public name?: string,
        public business_owner?: string,
        public desc?: string,
        public status?: string
    ) { }

    static fromSelect(select: SearchabelSelectOption[]): Area[] {
        if (!select) {
            return [];
        }

        return select.map((s) => new this(s.value));
    }
}