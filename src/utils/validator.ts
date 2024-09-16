import _ from 'lodash';

export class Validator<T> {
  private data: T;
  private errors: {
    [field: string]: Error;
  } = {};
  constructor(data: T) {
    this.data = data;
  }
  require(field: string, errorMessage?: string) {
    if (!_.get(this.data, field)) {
      _.set(this.errors, field, new Error(errorMessage || `${field} is required.`));
    }
    return this;
  }
  atLeastOne(field: string) {
    if (!_.get(this.data, field)?.length) {
      _.set(this.errors, field, new Error(`${field} must have at least one item.`));
    }
    return this;
  }

  gt(field: string, value: number) {
    if ((_.get(this.data, field) as number) <= value) {
      _.set(this.errors, field, new Error(`${field} must greater than ${value}.`));
    }
    return this;
  }
  gte(field: string, value: number) {
    if ((_.get(this.data, field) as number) < value) {
      _.set(this.errors, field, new Error(`${field} must greater than or equal ${value}.`));
    }
    return this;
  }

  lt(field: string, value: number) {
    if ((_.get(this.data, field) as number) >= value) {
      _.set(this.errors, field, new Error(`${field} must lesser than ${value}`));
    }
    return this;
  }
  lte(field: string, value: number) {
    if ((_.get(this.data, field) as number) > value) {
      _.set(this.errors, field, new Error(`${field} must lesser than or equal ${value}.`));
    }
    return this;
  }
  getError() {
    return this.errors;
  }
  getFirstError() {
    return _.get(Object.entries(this.errors)[0], 1);
  }
}
