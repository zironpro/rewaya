import { gql } from "graphql-request";

/**
 * Create a new checkout (cart session) in Shopify
 */
export const CHECKOUT_CREATE_MUTATION = gql`
  mutation CheckoutCreate($input: CheckoutCreateInput!) {
    checkoutCreate(input: $input) {
      checkout {
        id
        webUrl
        lineItems(first: 100) {
          edges {
            node {
              id
              title
              quantity
              variantTitle
              variant {
                id
                sku
              }
            }
          }
        }
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Add line items (products/variants) to an existing checkout
 */
export const CHECKOUT_LINE_ITEMS_ADD_MUTATION = gql`
  mutation CheckoutLineItemsAdd($checkoutId: ID!, $lineItems: [CheckoutLineItemInput!]!) {
    checkoutLineItemsAdd(checkoutId: $checkoutId, lineItems: $lineItems) {
      checkout {
        id
        webUrl
        lineItems(first: 100) {
          edges {
            node {
              id
              title
              quantity
              variantTitle
              variant {
                id
                sku
              }
            }
          }
        }
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Remove line items from a checkout
 */
export const CHECKOUT_LINE_ITEMS_REMOVE_MUTATION = gql`
  mutation CheckoutLineItemsRemove($checkoutId: ID!, $lineItemIds: [ID!]!) {
    checkoutLineItemsRemove(checkoutId: $checkoutId, lineItemIds: $lineItemIds) {
      checkout {
        id
        webUrl
        lineItems(first: 100) {
          edges {
            node {
              id
              title
              quantity
              variantTitle
            }
          }
        }
      }
      checkoutUserErrors {
        code
        field
        message
      }
    }
  }
`;

/**
 * Query a product by handle to get variant information
 */
export const GET_PRODUCT_VARIANTS_BY_HANDLE_QUERY = gql`
  query GetProductByHandle($handle: String!) {
    productByHandle(handle: $handle) {
      id
      handle
      title
      variants(first: 100) {
        edges {
          node {
            id
            sku
            title
            availableForSale
          }
        }
      }
    }
  }
`;

/**
 * Get variant by ID
 */
export const GET_VARIANT_QUERY = gql`
  query GetVariant($id: ID!) {
    productVariant(id: $id) {
      id
      sku
      title
      availableForSale
    }
  }
`;
