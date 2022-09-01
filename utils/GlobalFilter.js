class GlobalFilter {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  filter() {
    const queryStr = { ...this.queryStr };
    const restrictedFields = ["sort", "page", "limit", "fields"];
    restrictedFields.forEach((f) => delete queryStr[f]);
    let tempoQueryStr = JSON.stringify(queryStr);
    tempoQueryStr = tempoQueryStr.replace(
      /\b(gt|gte|lt|lte)\b/g,
      (atomic) => `$${atomic}`
    );
    //{ price: { gt: '200', lt: '1000', } }
    //{ price: {$gt: '200', $lt: '1000' } }

    this.query.find(JSON.parse(tempoQueryStr));

    return this;
  }

  sort() {
    if (this.queryStr.sort) {
      const sortQuery = this.queryStr.sort.split(",").join(" ");

      this.query.sort(sortQuery);
    } else {
      this.query.sort("-createdAt");
    }

    return this;
  }

  fields() {
    if (this.queryStr.fields) {
      const fieldsQuery = this.queryStr.fields.split(",").join(" ");
      this.query.select(fieldsQuery);
    }

    return this;
  }

  paginate() {
    const page = parseInt(this.queryStr.page) || 1;
    const limit = parseInt(this.queryStr.limit) || 10;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = GlobalFilter;
