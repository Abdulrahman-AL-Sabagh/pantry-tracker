import { ItemDto } from "@/data-access/items";
import { ItemEntity } from "@/entites/item";
import {
  AuthenticationError,
  GetItem,
  GetUser,
  UpdateItem,
  itemToDto,
} from "./utils";

export async function incrementItemUseCase(
  context: { getUser: GetUser; updateItem: UpdateItem; getItem: GetItem },
  data: { itemId: number }
): Promise<ItemDto> {
  const user = context.getUser();

  if (!user) {
    throw new AuthenticationError();
  }

  const item = new ItemEntity(await context.getItem(data.itemId));

  item.setQuantity(item.getQuantity() + 1);

  await context.updateItem(itemToDto(item));

  return itemToDto(item);
}