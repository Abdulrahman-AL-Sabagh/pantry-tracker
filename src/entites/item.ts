import { ZodError, z } from "zod";

type ValidatedFields = "name" | "userId" | "quantity" | "isLow";

export class ItemEntityValidationError extends Error {
  private errors: Record<ValidatedFields, string | undefined>;

  constructor(errors: Record<ValidatedFields, string | undefined>) {
    super("An error occured validating an item entity");
    this.errors = errors;
  }

  getErrors() {
    return this.errors;
  }
}

export class ItemEntity {
  private id?: number;
  private name: string;
  private quantity: number;
  private userId: string;
  private isLow: boolean;

  constructor({
    id,
    name,
    userId,
    quantity,
    isLow = false,
  }: {
    id?: number;
    name: string;
    userId: string;
    quantity: number;
    isLow?: boolean;
  }) {
    this.id = id;
    this.name = name;
    this.userId = userId;
    this.quantity = quantity;
    this.isLow = isLow;
  }

  getName() {
    return this.name;
  }

  getQuantity() {
    return this.quantity;
  }

  getUserId() {
    return this.userId;
  }

  getId() {
    return this.id;
  }

  getIsLow() {
    return this.isLow;
  }

  setIsLow(isLow: boolean) {
    this.isLow = isLow;
  }

  setQuantity(quantity: number) {
    this.quantity = quantity;
  }

  validate() {
    const itemSchema = z.object({
      name: z
        .string()
        .regex(/^[a-z]+$/)
        .min(1),
      userId: z.string().min(1),
      quantity: z.number().min(0),
      isLow: z.boolean().default(false),
    });

    try {
      itemSchema.parse(this);
    } catch (err) {
      const error = err as ZodError;
      const errors = error.flatten().fieldErrors;
      throw new ItemEntityValidationError({
        name: errors.name?.[0],
        userId: errors.userId?.[0],
        quantity: errors.quantity?.[0],
        isLow: errors.isLow?.[0],
      });
    }
  }
}
