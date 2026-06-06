import { gql } from "graphql-request";

export const GET_BUNDLES_QUERY = gql`
 query GetAllBundles {
  products(first: 50, query: "bundles:true") {
    nodes {
      id
      title
      handle
      tags
      featuredImage {
        url
        width
        height
        altText
      }
      productComponentsCount {
        count
      }
      productComponents(first: 10) {
        nodes {
          product {
            id
            title
            handle
          }
          componentVariants(first: 10) {
            nodes {
              id
              title
              sku
              price
              inventoryQuantity
            }
          }
        }
      }
      variants(first: 10) {
        nodes {
          id
          title
          price
          requiresComponents
          productVariantComponents(first: 10) {
            nodes {
              id
              quantity
              productVariant {
                id
                title
                sku
                price
                product {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
    pageInfo {
      hasNextPage
      endCursor
    }
  }
}
`;
