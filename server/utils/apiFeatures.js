const EXCLUDED = ['page', 'sort', 'limit', 'fields'];
const OPERATORS = ['gte', 'gt', 'lte', 'lt'];
const MAX_LIMIT = 100;

class APIFeatures {
  constructor(
    query,
    queryString,
    { filterable = [], defaultSort = '-createdAt' } = {},
  ) {
    this.query = query;
    this.queryString = queryString;
    this.filterable = filterable;
    this.defaultSort = defaultSort;
  }

  filter() {
    const filter = {};

    for (const [key, value] of Object.entries(this.queryString)) {
      if (EXCLUDED.includes(key) || !this.filterable.includes(key)) continue;

      if (Array.isArray(value)) {
        filter[key] = { $in: value };
      } else if (value && typeof value === 'object') {
        const ops = {};
        for (const [op, v] of Object.entries(value)) {
          if (OPERATORS.includes(op) && typeof v === 'string')
            ops[`$${op}`] = v;
        }
        if (Object.keys(ops).length) filter[key] = ops;
      } else {
        filter[key] = value;
      }
    }

    this.query = this.query.find(filter);
    return this;
  }

  sort() {
    const sortBy = this.queryString.sort
      ? String(this.queryString.sort).split(',').join(' ')
      : this.defaultSort;
    this.query = this.query.sort(sortBy);
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const fields = String(this.queryString.fields)
        .split(',')
        .filter((f) => f && !f.startsWith('+'))
        .join(' ');
      this.query = this.query.select(fields || '-__v');
    } else {
      this.query = this.query.select('-__v');
    }
    return this;
  }

  paginate() {
    const page = Math.max(parseInt(this.queryString.page, 10) || 1, 1);
    const limit = Math.min(
      Math.max(parseInt(this.queryString.limit, 10) || 100, 1),
      MAX_LIMIT,
    );
    this.query = this.query.skip((page - 1) * limit).limit(limit);
    return this;
  }
}

export default APIFeatures;
