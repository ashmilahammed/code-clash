import { Model, Document, Types } from "mongoose";

export abstract class BaseRepository<TDoc extends Document> {
  protected readonly _model: Model<TDoc>;

  protected constructor(model: Model<TDoc>) {
    this._model = model;
  }

  protected isValidId(id: string): boolean {
    return Types.ObjectId.isValid(id);
  }

  async findByIdRaw(id: string): Promise<TDoc | null> {
    if (!this.isValidId(id)) return null;
    return this._model.findById(id).exec();
  }

  async createRaw(data: Partial<TDoc>): Promise<TDoc> {
    const doc = new this._model(data);
    await doc.save();
    return doc;
  }

  async updateRaw(id: string, data: Partial<TDoc>): Promise<void> {
    if (!this.isValidId(id)) return;
    await this._model.findByIdAndUpdate(id, data).exec();
  }

  async count(filter: any = {}): Promise<number> {
    return this._model.countDocuments(filter).exec();
  }

  async findManyRaw(
    filter: any,
    skip: number,
    limit: number,
    sort: any
  ): Promise<TDoc[]> {
    return this._model
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort(sort)
      .exec();
  }
}








// import { Model, Document, Types } from "mongoose";


// export abstract class BaseRepository<TDomain> {
//   protected readonly _model: Model<Document>;

//   protected constructor(model: Model<Document>) {
//     this._model = model;
//   }

//   protected isValidId(id: string): boolean {
//     return Types.ObjectId.isValid(id);
//   }

//   async findByIdRaw(id: string): Promise<Document | null> {
//     if (!this.isValidId(id)) return null;
//     return this._model.findById(id).exec();
//   }

//   async createRaw<T extends Document>(data: any): Promise<T> {
//     const doc = new this._model(data);
//     await doc.save();
//     return doc as T;
//   }

//   async updateRaw(id: string, data: any): Promise<void> {
//     if (!this.isValidId(id)) return;
//     await this._model.findByIdAndUpdate(id, data).exec();
//   }

//   async count(filter: any = {}): Promise<number> {
//     return this._model.countDocuments(filter).exec();
//   }

//   async findManyRaw(
//     filter: any,
//     skip: number,
//     limit: number,
//     sort: any
//   ): Promise<Document[]> {
//     return this._model
//       .find(filter)
//       .skip(skip)
//       .limit(limit)
//       .sort(sort)
//       .exec();
//   }
// }







// import { Model, Document, Types } from "mongoose";


// export abstract class BaseRepository<TDomain> {

//   protected readonly _model: Model<Document>;

//   protected constructor(model: Model<Document>) {
//     this._model = model;
//   }

//   async findById(id: string): Promise<TDomain | null> {
//     if (!Types.ObjectId.isValid(id)) return null;

//     const doc = await this._model.findById(id).exec();
//     return doc ? (doc.toObject() as TDomain) : null;
//   }

//   async findAll(filter: Partial<TDomain> = {}): Promise<TDomain[]> {
//     const docs = await this._model.find(filter as any).exec();
//     return docs.map((d) => d.toObject() as TDomain);
//   }

//   async create(data: Partial<TDomain>): Promise<TDomain> {
//     const doc = await this._model.create(data);
//     return doc.toObject() as TDomain;
//   }

//   async update(
//     id: string,
//     data: Partial<TDomain>
//   ): Promise<TDomain | null> {
//     if (!Types.ObjectId.isValid(id)) return null;

//     const doc = await this._model
//       .findByIdAndUpdate(id, data, { new: true })
//       .exec();

//     return doc ? (doc.toObject() as TDomain) : null;
//   }

//   async delete(id: string): Promise<boolean> {
//     if (!Types.ObjectId.isValid(id)) return false;

//     const result = await this._model.findByIdAndDelete(id).exec();
//     return !!result;
//   }
// }
