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

export const GET_BUNDLE_BY_HANDLE = gql`
  query GetBundleByHandle($handle: String!) {
  products(first: 1, query: $handle) {
    edges {
      node {
        id
        title
        handle
        status
        productType
        tags
        priceRangeV2 {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        variants(first: 10) {
          edges {
            node {
              id
              title
              price
              sku
              availableForSale
              inventoryQuantity
            }
          }
        }
        bundleComponents(first: 20) {
          edges {
            node {
              quantity
              optionSelections {
                componentOption {
                  id
                  name
                }
                values {
                  value
                }
              }
              componentProduct {
                id
                title
                handle
                featuredImage {
                  url
                  altText
                }
                variants(first: 10) {
                  edges {
                    node {
                      id
                      title
                      price
                      sku
                    }
                  }
                }
              }
            }
          }
        }
        featuredImage {
          url
          altText
        }
        images(first: 5) {
          edges {
            node {
              url
              altText
            }
          }
        }
      }
    }
  }
}
`;
