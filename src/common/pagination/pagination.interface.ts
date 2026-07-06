export interface Paginated<E> {
    data: E[],
    meta: {
        itemsPerPage: number,
        totalItems: number,
        currentPage: number,
        totalPages: number
    },
    links: {
        first: string,
        last: string
        current: string,
        previous: string,
        next: string,
    }
}