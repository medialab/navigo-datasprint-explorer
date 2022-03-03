export default function listValues (data, field) {
    let list = new Set();

    for (let i = 0; i < data.length; i++) {
        const value = data[i][field];
        if (value === '') { continue; }
        list.add(value);
    }

    return Array.from(list).sort();
}