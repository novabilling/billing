# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class TaxesControllerGetCustomerTaxesRequest < Internal::Types::Model
        field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
      end
    end
  end
end
