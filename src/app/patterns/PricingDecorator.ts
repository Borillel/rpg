export interface IPricing {
  getPrice(): number;
  getDescription(): string;
}

export class BaseItemPricing implements IPricing {
  constructor(private basePrice: number, private itemName: string) {}

  getPrice(): number {
    return this.basePrice;
  }

  getDescription(): string {
    return this.itemName;
  }
}

export abstract class PricingDecorator implements IPricing {
  constructor(protected pricingItem: IPricing) {}

  getPrice(): number {
    return this.pricingItem.getPrice();
  }

  getDescription(): string {
    return this.pricingItem.getDescription();
  }
}

export class HeroDiscountDecorator extends PricingDecorator {
  getPrice(): number {
    return Math.floor(super.getPrice() * 0.9);
  }

  getDescription(): string {
    return super.getDescription() + " (Desconto de Herói -10%)";
  }
}

export class GuildTaxDecorator extends PricingDecorator {
  getPrice(): number {
    return super.getPrice() + 5;
  }

  getDescription(): string {
    return super.getDescription() + " (Imposto da Guilda +5)";
  }
}
