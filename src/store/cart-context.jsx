import { createContext, useReducer} from 'react'
import { DUMMY_PRODUCTS } from '../dummy-products';

export const CartContext = createContext({
    items: [],
    addItemToCart: () => {},
    updateItemQuantity: () => {},
});

function shoppingCartReducer(state, action) {
    switch (action.type) {
        case "ADD_ITEM":
            const addItems = [...state.items];

            const existingCartItemIndex = addItems.findIndex(
            (cartItem) => cartItem.id === action.payload
            );
            const existingCartItem = addItems[existingCartItemIndex];

            if (existingCartItem) {
            const updatedItem = {
                ...existingCartItem,
                quantity: existingCartItem.quantity + 1,
            };
            addItems[existingCartItemIndex] = updatedItem;
            } else {
            const product = DUMMY_PRODUCTS.find((product) => product.id === action.payload);
            addItems.push({
                id: action.payload,
                name: product.title,
                price: product.price,
                quantity: 1,
            });
            }

            return {
                ...state,
                items: addItems,
            };
            
        case 'UPDATE_ITEM':
            const updatedItems = [...state.items];
            const updatedItemIndex = updatedItems.findIndex(
                (item) => item.id === action.payload.productId
            );

            const updatedItem = {
                ...updatedItems[updatedItemIndex],
            };

            updatedItem.quantity += action.payload.amount;

            if (updatedItem.quantity <= 0) {
                updatedItems.splice(updatedItemIndex, 1);
            } else {
                updatedItems[updatedItemIndex] = updatedItem;
            }

            return {
                ...state,
                items: updatedItems,
            };

        default:
            return state
    }
}

export default function CartContextProvider({children}) {
    const [shoppingCartState, shoppingCartStateDispatch] = useReducer(shoppingCartReducer, {
        items: [],
    })

    function handleAddItemToCart(id) {
        shoppingCartStateDispatch({
            type: 'ADD_ITEM',
            payload: id
        })
    }

    function handleUpdateCartItemQuantity(productId, amount) {
     shoppingCartStateDispatch({
        type: 'UPDATE_ITEM',
        payload: {
            productId,
            amount
        }
     })
    }
    
    const ctxValue = {
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity
    }

    return <CartContext.Provider value={ctxValue}>
        {children}
    </CartContext.Provider>
}