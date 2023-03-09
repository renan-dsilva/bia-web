import { SearchabelSelectOption } from "../components/searchable-select/searchable-select.model";
import { Process } from "../processes/process.model";
import { Support } from "../support/support.model";

export class Application {
    constructor(
        public _id: string,
        public name?: string,
        public processes?: Process[],
        public support?: Support[],
        public vendor?: string,
        public desc?: string,
        public status?: string
    ) { }

    static fromSelect(select: SearchabelSelectOption[]): Application[] {
        if (!select) {
            return [];
        }

        return select.map((s) => new this(s.value));
    }
}