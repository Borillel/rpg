import { BaseRepository } from "./BaseRepository";
import { UserProfile, Character, Item } from "../types";

export class UserRepository extends BaseRepository<UserProfile> {
  constructor() {
    super("users");
  }
}

export class CharacterRepository extends BaseRepository<Character> {
  constructor() {
    super("characters");
  }
}

export class ItemRepository extends BaseRepository<Item> {
  constructor() {
    super("items");
  }
}

export const userRepository = new UserRepository();
export const characterRepository = new CharacterRepository();
export const itemRepository = new ItemRepository();
