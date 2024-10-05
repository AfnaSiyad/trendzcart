export function getDate(createdAt){

    const date = new Date(createdAt);

    const month = date.toLocaleString('default', { month: 'long' }); // Full month name
    const day = date.getDate(); // Day of the month
    const year = date.getFullYear();

    return (`${day} ${month} ${year}`)

}