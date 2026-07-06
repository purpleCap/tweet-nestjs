import { Injectable, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import type { Request } from 'express';
import { PaginationQueryDto } from './dto/pagination-query.dto';
import { FindManyOptions, FindOptionsWhere, ObjectLiteral, Repository } from 'typeorm';
import { Paginated } from './pagination.interface';

@Injectable()
export class PaginationProvider {
    constructor(@Inject(REQUEST) private readonly request: Request) { }
    public async paginateQuery<T extends ObjectLiteral>(
        paginationQueryDto: PaginationQueryDto,
        repository: Repository<T>,
        where?: FindOptionsWhere<T> | null,
        relations?: object
    ): Promise<Paginated<T>> {
        const findOptions: FindManyOptions<T> = {
            skip: (paginationQueryDto.page! - 1) * paginationQueryDto.limit!,
            take: paginationQueryDto.limit,
        };
        if (where) {
            findOptions.where = where;
        }
        if (relations) {
            findOptions.relations = relations;
        }
        const data = await repository.find(findOptions);
        if(where == null) {
            where = {};
        }
        const totalItems = await repository.count(where);
        const totalPages = Math.ceil(totalItems / paginationQueryDto.limit!);
        const currentPage = paginationQueryDto.page!;
        const nextPage = currentPage < totalPages ? currentPage + 1 : currentPage;
        const previousPage = currentPage > 1 ? currentPage - 1 : currentPage;

        const baseUrl = `${this.request.protocol}://${this.request.get('host')}`;

        const response = {
            data,
            meta: {
                itemsPerPage: paginationQueryDto.limit!,
                currentPage: currentPage,
                totalItems: totalItems,
                totalPages: totalPages
            },
            links: {
                first: `${baseUrl}${this.request.path}?page=1&limit=${paginationQueryDto.limit}`,
                last: `${baseUrl}${this.request.path}?page=${totalPages}&limit=${paginationQueryDto.limit}`,
                current: `${baseUrl}${this.request.path}?page=${currentPage}&limit=${paginationQueryDto.limit}`,
                previous: `${baseUrl}${this.request.path}?page=${previousPage}&limit=${paginationQueryDto.limit}`,
                next: `${baseUrl}${this.request.path}?page=${nextPage}&limit=${paginationQueryDto.limit}`
            }
        }

        return response;
    }
}
