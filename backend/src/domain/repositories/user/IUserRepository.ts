import { IUserCoreRepository } from "./IUserCoreRepository";
import { IUserAuthRepository } from "./IUserAuthRepository";
import { IUserAdminRepository } from "./IUserAdminRepository";
import { IUserGamificationRepository } from "./IUserGamificationRepository";

export interface IUserRepository extends 
  IUserCoreRepository, 
  IUserAuthRepository, 
  IUserAdminRepository, 
  IUserGamificationRepository {}
