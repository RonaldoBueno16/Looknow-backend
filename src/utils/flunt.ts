export class Flunt {
    constructor(public errors: any[] = []) { }

    isRequired(value: any, message: string) {
        if (!value || value.length <= 0) {
            this.errors.push(message);
        }
    }

    hasMinLen = (value: any, min: number, message: any) => {
        if (!value || value.length < min) {
            this.errors.push(message);
        }
    }

    hasMaxLen = (value: any, max: number, message: any) => {
        if (!value || value.length > max) {
            this.errors.push(message);
        }
    }

    isFixedLen = (value: any, len: number, message: any) => {
        if (value.length !== len) {
            this.errors.push(message);
        }
    }

    isEmail = (value: any, message: string) => {
        const reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
        if (!reg.test(value)) {
            this.errors.push(message);
        }
    }

    isNotNull = (value: any, message: string) => {
        if (!value.length) {
            this.errors.push(message);
        }
    }

    isGreaterThan = (valuea: any, valueb: any, message: string) => {
        if (valuea > valueb) {
            this.errors.push(message);
        }
    }

    clear() {
        this.errors = [];
    }

    isNumeric = (value: any, message: string) => {
        const reg = new RegExp(/^[0-9]+$/);
        if (!value || !reg.test(value)) {
            this.errors.push(message);
        }
    }

    isValid() {
        return this.errors.length === 0;
    }
}