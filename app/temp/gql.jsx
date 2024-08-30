const { admin } = await authenticate.admin(request);

const response = await admin.graphql(
  `#graphql
  mutation discountAutomaticBasicCreate($automaticBasicDiscount: DiscountAutomaticBasicInput!) {
    discountAutomaticBasicCreate(automaticBasicDiscount: $automaticBasicDiscount) {
      automaticDiscountNode {
        id
        automaticDiscount {
          ... on DiscountAutomaticBasic {
            startsAt
            endsAt
            minimumRequirement {
              ... on DiscountMinimumQuantity {
                greaterThanOrEqualToQuantity {
                  quantity
                }
              }
            }
            customerGets {
              value {
                ... on DiscountAmount {
                  amount {
                    amount
                    currencyCode
                  }
                  appliesOnEachItem
                }
              }
              items {
                ... on DiscountProductVariants {
                  productVariants {
                    edges {
                      node {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      userErrors {
        field
        code
        message
      }
    }
  }`,
  {
    variables: {
      "automaticBasicDiscount": {
        "title": "$50 off each product variant over a quantity of 10 during the summer of 2022",
        "startsAt": "2022-06-21T00:00:00Z",
        "endsAt": "2022-09-21T00:00:00Z",
        "minimumRequirement": {
          "quantity": {
            "greaterThanOrEqualToQuantity": 10
          }
        },
        "customerGets": {
          "value": {
            "discountAmount": {
              "amount": 50,
              "appliesOnEachItem": true
            }
          },
          "items": {
            "productVariants": {
              "edges": [
                {
                  "node": {
                    "id": "variant-id-1"
                  }
                },
                {
                  "node": {
                    "id": "variant-id-2"
                  }
                }
              ]
            }
          }
        }
      }
    },
  },
);

const data = await response.json();
