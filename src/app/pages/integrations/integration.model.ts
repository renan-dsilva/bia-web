import { SearchabelSelectOption } from "../components/searchable-select/searchable-select.model";
import { Application } from "../applications/application.model";

export class Integration {
    constructor(
        public _id: string,
        public source_application?: Application,
        public target_application?: Application,
        public desc?: string,
        public status?: string
    ) { }

    static fromSelect(select: SearchabelSelectOption[]): Integration[] {
        if (!select) {
            return [];
        }

        return select.map((s) => new this(s.value));
    }
}