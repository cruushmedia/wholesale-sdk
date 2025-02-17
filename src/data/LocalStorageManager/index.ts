import { SaleorState } from "../../state";
import { LocalStorageHandler } from "../../helpers/LocalStorageHandler/LocalStorageHandler";

export class LocalStorageManager {
  private handler: LocalStorageHandler;

  private saleorState: SaleorState;

  constructor(handler: LocalStorageHandler, saleorState: SaleorState) {
    this.handler = handler;
    this.saleorState = saleorState;
  }

  getHandler = () => {
    return this.handler;
  };

  addItemToCart = (variantId: string, quantity: number, vendorId?: string) => {
    const vid = vendorId || "wood";
    console.log("add item to cart");
    const lines = this.saleorState.checkout?.lines || [];
    let variantInCheckout = lines.find(
      variant => variant.variant.id === variantId
    );
    const alteredLines = lines.filter(
      variant => variant.variant.id !== variantId
    );
    const newVariantQuantity = variantInCheckout
      ? variantInCheckout.quantity + quantity
      : quantity;
    if (variantInCheckout) {
      variantInCheckout.quantity = newVariantQuantity;
      if (vid) {
        variantInCheckout.variant.vendorId = vid;
      }
      alteredLines.push(variantInCheckout);
    } else {
      variantInCheckout = {
        quantity,
        variant: {
          id: variantId,
          vendorId: vid,
        },
      };
      alteredLines.push(variantInCheckout);
    }
    const alteredCheckout = this.saleorState.checkout
      ? {
          ...this.saleorState.checkout,
          lines: alteredLines,
        }
      : {
          lines: alteredLines,
        };
    this.handler.setCheckout(alteredCheckout);

    return alteredCheckout;
  };

  removeItemFromCart = (variantId: string) => {
    const lines = this.saleorState.checkout?.lines || [];
    const variantInCheckout = lines.find(
      variant => variant.variant.id === variantId
    );
    const alteredLines = lines.filter(
      variant => variant.variant.id !== variantId
    );
    if (variantInCheckout) {
      variantInCheckout.quantity = 0;
      alteredLines.push(variantInCheckout);
    }
    const alteredCheckout = this.saleorState.checkout
      ? {
          ...this.saleorState.checkout,
          lines: alteredLines,
        }
      : {
          lines: alteredLines,
        };
    this.handler.setCheckout(alteredCheckout);

    return alteredCheckout;
  };

  subtractItemFromCart = (variantId: string) => {
    const lines = this.saleorState.checkout?.lines || [];
    const variantFromCart = lines.find(
      variant => variant.variant.id === variantId
    );
    const alteredLines = lines.filter(
      variant => variant.variant.id !== variantId
    );
    const newVariantQuantity = variantFromCart
      ? variantFromCart.quantity - 1
      : 0;
    if (variantFromCart) {
      variantFromCart.quantity = newVariantQuantity;
      alteredLines.push(variantFromCart);
    }
    const alteredCheckout = this.saleorState.checkout
      ? {
          ...this.saleorState.checkout,
          lines: alteredLines,
        }
      : {
          lines: alteredLines,
        };
    this.handler.setCheckout(alteredCheckout);

    return alteredCheckout;
  };

  updateItemInCart = (variantId: string, quantity: number) => {
    const lines = this.saleorState.checkout?.lines || [];
    const variantInCheckout = lines.find(
      variant => variant.variant.id === variantId
    );
    const alteredLines = lines.filter(
      variant => variant.variant.id !== variantId
    );
    if (variantInCheckout) {
      variantInCheckout.quantity = quantity;
      alteredLines.push(variantInCheckout);
    }
    const alteredCheckout = this.saleorState.checkout
      ? {
          ...this.saleorState.checkout,
          lines: alteredLines,
        }
      : {
          lines: alteredLines,
        };
    this.handler.setCheckout(alteredCheckout);

    return alteredCheckout;
  };
}
