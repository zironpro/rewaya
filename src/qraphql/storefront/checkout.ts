import { gql } from "graphql-request";

export const CREATE_CHECKOUT_URL = gql`
    mutation CartCreate($variantId: ID!) {
        cartCreate(input: {
            lines: [
                {
                    quantity: 1
                    merchandiseId: $variantId
                }
            ]
        }) {
            cart {
                id
                checkoutUrl
            }
            userErrors {
                field
                message
            }
        }
    }
`;
