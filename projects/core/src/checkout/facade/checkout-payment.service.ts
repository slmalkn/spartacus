import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import {
  ANONYMOUS_USERID,
  CartDataService,
} from '../../cart/facade/cart-data.service';
import { CardType, PaymentDetails } from '../../model/cart.model';
import { CheckoutActions } from '../store/actions/index';
import {
  StateWithCheckout,
  SET_PAYMENT_DETAILS_PROCESS_ID,
} from '../store/checkout-state';
import { CheckoutSelectors } from '../store/selectors/index';
import { StateWithProcess } from '../../process/store/process-state';
import {
  getProcessStateFactory,
} from '../../process/store/selectors/process-group.selectors';
import { LoaderState } from '../../state/utils/loader/loader-state';

@Injectable({
  providedIn: 'root',
})
export class CheckoutPaymentService {
  constructor(
    protected store: Store<StateWithCheckout | StateWithProcess<void>>,
    protected cartData: CartDataService
  ) {}

  /**
   * Get card types
   */
  getCardTypes(): Observable<CardType[]> {
    return this.store.pipe(select(CheckoutSelectors.getAllCardTypes));
  }

  /**
   * Get payment details
   */
  getPaymentDetails(): Observable<PaymentDetails> {
    return this.store.pipe(select(CheckoutSelectors.getPaymentDetails));
  }

  /**
   * Get status about set Payment Details process
   */
  getSetPaymentDetailsResultProcess(): Observable<LoaderState<void>> {
    return this.store.pipe(
      select(getProcessStateFactory(SET_PAYMENT_DETAILS_PROCESS_ID))
    );
  }

  /**
   * Clear info about process of setting Payment Details
   */
  resetSetPaymentDetailsProcess(): void {
    this.store.dispatch(new CheckoutActions.ResetSetPaymentDetailsProcess());
  }

  /**
   * Load the supported card types
   */
  loadSupportedCardTypes(): void {
    this.store.dispatch(new CheckoutActions.LoadCardTypes());
  }

  /**
   * Create payment details using the given paymentDetails param
   * @param paymentDetails: the PaymentDetails to be created
   */
  createPaymentDetails(paymentDetails: PaymentDetails): void {
    if (this.actionAllowed()) {
      this.store.dispatch(
        new CheckoutActions.CreatePaymentDetails({
          userId: this.cartData.userId,
          cartId: this.cartData.cartId,
          paymentDetails,
        })
      );
    }
  }

  /**
   * Set payment details
   * @param paymentDetails : the PaymentDetails to be set
   */
  setPaymentDetails(paymentDetails: PaymentDetails): void {
    if (this.actionAllowed()) {
      this.store.dispatch(
        new CheckoutActions.SetPaymentDetails({
          userId: this.cartData.userId,
          cartId: this.cartData.cart.code,
          paymentDetails: paymentDetails,
        })
      );
    }
  }

  protected actionAllowed(): boolean {
    return this.cartData.userId !== ANONYMOUS_USERID;
  }
}
