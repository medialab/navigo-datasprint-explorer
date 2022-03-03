import { get } from 'axios';
import { csvParse } from 'd3-dsv';

export function fetchData (path) {
    return new Promise((success, failure) => {
        get(process.env.BASE_PATH + 'data/' + path)
        .then(({ data: str }) => {
            try {
                const csv = csvParse(str);
                success(csv);
            } catch (error) {
                failure(error);
            }
        })
        .catch((error) => {
            failure(error);
        })
    })
}

export function fetchFields (path) {
    return new Promise((success, failure) => {
        get(process.env.BASE_PATH + 'data/' + path)
        .then(({ data: json }) => {
            try {
                success(json);
            } catch (error) {
                failure(error);
            }
        })
        .catch((error) => {
            failure(error);
        })
    })
}