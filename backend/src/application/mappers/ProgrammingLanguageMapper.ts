import { ProgrammingLanguage } from "../../domain/entities/language/ProgrammingLanguage";
import { IProgrammingLanguageDoc } from "../../infrastructure/database/models/language/ProgrammingLanguageModel";



export class ProgrammingLanguageMapper {

  static toDomain(doc: IProgrammingLanguageDoc): ProgrammingLanguage {
    return new ProgrammingLanguage(
      doc._id.toString(),
      doc.key,
      doc.name,
      doc.version,
      doc.isActive
    );
  }

  static toPersistence(
    entity: Partial<ProgrammingLanguage>
  ) {
    const persistence: Partial<IProgrammingLanguageDoc> = {};

    if (entity.key !== undefined) persistence.key = entity.key;
    if (entity.name !== undefined) persistence.name = entity.name;
    if (entity.version !== undefined) persistence.version = entity.version;
    if (entity.isActive !== undefined) persistence.isActive = entity.isActive;

    return persistence;
  }
}
