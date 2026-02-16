# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class RemoveFromCustomerTaxesRequest < Internal::Types::Model
        field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
        field :tax_id, -> { String }, optional: false, nullable: false, api_name: "taxId"
      end
    end
  end
end
