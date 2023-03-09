import { Message } from "@angular/compiler/src/i18n/i18n_ast";

export class Dashboard {
    constructor(
        public messages?: Message[],
        public qty_enrolled_students?: number,
        public avg_students_per_classroom?: number,
        public qty_students_in_classroom?: number,
        public qty_students_absent?: number,
        public qty_students_medicine?: number,
        public str_students_medicine_times?: string,
        public qty_messages?: number,
    ) { }
}