import { gql } from "graphql-request";

export const GET_BUNDLE_META = gql`
    query GetBundleMeta($handle: String) {
        product(handle: $handle) {
            id
            title
            featuredImage {
                url
            }
            description
            seo {
                description
                title
            }
        }
    }
`;
