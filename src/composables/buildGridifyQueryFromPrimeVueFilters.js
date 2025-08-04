import { ConditionalOperator, GridifyQueryBuilder } from 'gridify-client';

export default function buildGridifyQueryFromPrimeVueFilters(primevueFilters, options = {}) {
    const {
        page = 1,
        page_size = 10, // Giữ nguyên là page_size
        orderBy = null,
    } = options;

    const matchModeMap = {
        startsWith: ConditionalOperator.StartsWith,
        contains: ConditionalOperator.Contains,
        notContains: ConditionalOperator.NotContains,
        endsWith: ConditionalOperator.EndsWith,
        equals: ConditionalOperator.Equal,
        notEquals: ConditionalOperator.NotEqual,
        lt: ConditionalOperator.LessThan,
        lte: ConditionalOperator.LessThanOrEqual,
        gt: ConditionalOperator.GreaterThan,
        gte: ConditionalOperator.GreaterThanOrEqual,
        dateIs: ConditionalOperator.Equal,
        dateIsNot: ConditionalOperator.NotEqual,
        dateBefore: ConditionalOperator.LessThan,
        dateAfter: ConditionalOperator.GreaterThan,
        in: ConditionalOperator.In,
        between: "between",
    };

    const builder = new GridifyQueryBuilder().setPage(page).setPageSize(page_size);

    if (orderBy?.field) {
        builder.addOrderBy(orderBy.field, orderBy.asc ?? true);
    }

    const filterEntries = Object.entries(primevueFilters).filter(([field]) => field !== "Search");

    let hasPreviousCondition = false;

    filterEntries.forEach(([field, filter]) => {
        const isGroup = "constraints" in filter && Array.isArray(filter.constraints);

        if (isGroup) {
            const { constraints, operator } = filter;
            const validConstraints = constraints.filter(c => c.value !== null && c.value !== "");

            if (validConstraints.length === 0) return;

            if (hasPreviousCondition) builder.and();

            builder.startGroup();
            validConstraints.forEach((c, i) => {
                const op = matchModeMap[c.matchMode];
                if (!op) return;

                if (c.matchMode === "between" && Array.isArray(c.value) && c.value.length === 2) {
                    builder.addCondition(field, ConditionalOperator.GreaterThanOrEqual, c.value[0]);
                    builder.and();
                    builder.addCondition(field, ConditionalOperator.LessThanOrEqual, c.value[1]);
                } else {
                    builder.addCondition(field, op, c.value);
                }

                // Add operator (AND/OR) between constraints
                if (i < validConstraints.length - 1) {
                    operator === "or" ? builder.or() : builder.and();
                }
            });
            builder.endGroup();
            hasPreviousCondition = true;

        } else if (filter.value !== null && filter.value !== "") {
            const op = matchModeMap[filter.matchMode];
            if (!op) return;

            if (hasPreviousCondition) builder.and();

            builder.addCondition(field, op, filter.value);
            hasPreviousCondition = true;
        }
    });

    const queryAsObject = builder.build(); // Đây là một object, ví dụ { page: 1, pageSize: 10, filter: '...' }
    
    // Đổi tên key pageSize thành page_size nếu gridify-client trả về pageSize
    if (queryAsObject.pageSize) {
        queryAsObject.page_size = queryAsObject.pageSize;
        delete queryAsObject.pageSize;
    }

    // Trả về một URLSearchParams object
    return new URLSearchParams(queryAsObject);
}
