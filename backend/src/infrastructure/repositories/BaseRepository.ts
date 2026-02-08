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

  // async updateRaw(id: string, data: Partial<TDoc>): Promise<void> {
  //   if (!this.isValidId(id)) return;
  //   await this._model.findByIdAndUpdate(id, data).exec();
  // }
  async updateRaw(
    id: string,
    data: Partial<TDoc>
  ): Promise<TDoc> {
    if (!this.isValidId(id)) {
      throw new Error("Invalid ID");
    }

    const updated = await this._model.findByIdAndUpdate(
      id,
      data,
      { new: true } //return updated doc
    ).exec();

    if (!updated) {
      throw new Error("Entity not found");
    }

    return updated;
  }


  // async count(filter: any = {}): Promise<number> {
  //   return this._model.countDocuments(filter).exec();
  // }
  async count(filter: Record<string, unknown> = {}): Promise<number> {
    return this._model.countDocuments(filter).exec();
  }

  async findManyRaw(
    // filter: any,
    filter: Record<string, unknown>,
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





