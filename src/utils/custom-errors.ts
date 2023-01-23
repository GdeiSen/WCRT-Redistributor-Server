import {CustomError} from 'ts-custom-error'//Needed to be added, because of some native error extensions problems

export class CreationError extends CustomError {
    description?: string;
    constructor(message?: string, description?: string) {
        super(message);
        this.description = description;
    }
}