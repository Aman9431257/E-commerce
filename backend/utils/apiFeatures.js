class ApiFeatures {
  constructor(query, queryCopy, queryStr, sort) {
    this.query = query;
    this.queryCopy = queryCopy;
    this.queryStr = queryStr;
    this.sort = {};
    this.sort[sort === "price2" ? "price" : sort] = sort === "price" ? 1 : -1;
    this.sort["_id"] = 1;
  }

  search() {
    const keyword = this.queryStr.keyword
      ? {
          name: {
            $regex: this.queryStr.keyword,
            $options: "i",
          },
        }
      : {};

    this.query = this.query.find({ ...keyword });
    this.queryCopy = this.queryCopy.find({ ...keyword });
    
    return this;
  }

  filter() {
    const queryC = { ...this.queryStr };

    const removeFields = ["keyword", "page", "limit"];

    removeFields.forEach((key) => delete queryC[key]);


    let queryStr = JSON.stringify(queryC);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr));
    this.queryCopy = this.queryCopy.find(JSON.parse(queryStr));

    return this;
  }

  pagination(resultPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;

    const skip = resultPerPage * (currentPage - 1);

    this.query = this.query.sort(this.sort).limit(resultPerPage).skip(skip);
    this.queryCopy = this.queryCopy.sort(this.sort).limit(resultPerPage).skip(skip);

    return this;
  }
}

module.exports = ApiFeatures;