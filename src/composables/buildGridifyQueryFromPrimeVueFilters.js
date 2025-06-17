import { ConditionalOperator, GridifyQueryBuilder } from 'gridify-client';

export default function buildGridifyQueryFromPrimeVueFilters(primevueFilters, options = {}) {
    const {
        page = 1,
        pageSize = 10,
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

    const builder = new GridifyQueryBuilder().setPage(page).setPageSize(pageSize);

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

    return builder.build();
}
