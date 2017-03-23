import { Injectable } from '@angular/core';
import { ModelService } from './model.service';
const ENABLE_TOKENS_KEY = 'y_tokens';
const ENABLED_TOKENS_VALUE = 'enabled';
const DISABLED_TOKENS_VALUE = 'disabled';

const CART_TOKEN_KEY = 'y_cart_token';
const USER_TOKEN_KEY = 'y_user_token';


@Injectable()
export class TokenService extends ModelService {

    allowTokens = false;

    userToken;
    cartToken;

    constructor() {
        super();
        if (!!sessionStorage.getItem(ENABLE_TOKENS_KEY)) {
            this.allowTokens = true;
        }

        if (!!sessionStorage.getItem(USER_TOKEN_KEY)) {
            this.storeUserToken(JSON.parse(sessionStorage.getItem(USER_TOKEN_KEY)));
        }

        if (!!sessionStorage.getItem(CART_TOKEN_KEY)) {
            this.storeCartToken(sessionStorage.getItem(CART_TOKEN_KEY));
        }


    }

    isEnabled(): Boolean {
        return sessionStorage.getItem(ENABLE_TOKENS_KEY) === ENABLED_TOKENS_VALUE;
    }

    enable() {
        sessionStorage.setItem(ENABLE_TOKENS_KEY, ENABLED_TOKENS_VALUE);
        this.allowTokens = true;
        this.storeTokens();
    }

    hasCartToken(): Boolean {
        return !!this.getCartToken();
    }

    getCartToken() {
        return super.get(CART_TOKEN_KEY);
    }

    storeCartToken(cartToken) {
        // store the cart token so that we can retrieve it later
        // when the user allows cookies
        this.cartToken = cartToken;

        super.store(CART_TOKEN_KEY, cartToken);
        this.storeTokens();
    }

    getUserToken() {
        return super.get(USER_TOKEN_KEY);
    }

    storeUserToken(userToken) {
        // store the cart token so that we can retrieve it later
        // when the user allows cookies
        this.userToken = userToken;
        super.store(USER_TOKEN_KEY, userToken);
        this.storeTokens();
    }

    storeTokens() {
        if (this.allowTokens) {
            if (this.userToken) {
                sessionStorage.setItem(USER_TOKEN_KEY, JSON.stringify(this.userToken));
            }else {
                sessionStorage.removeItem(CART_TOKEN_KEY);
            }
            if (this.cartToken) {
                sessionStorage.setItem(CART_TOKEN_KEY, this.cartToken);
            }else {
                sessionStorage.removeItem(CART_TOKEN_KEY);
            }
        }
    }

    clearTokens() {

        this.userToken = null;
        sessionStorage.removeItem(USER_TOKEN_KEY);
        super.store(USER_TOKEN_KEY, null);

        this.cartToken = null;
        sessionStorage.removeItem(CART_TOKEN_KEY);
        super.store(CART_TOKEN_KEY, null);

    }

}
