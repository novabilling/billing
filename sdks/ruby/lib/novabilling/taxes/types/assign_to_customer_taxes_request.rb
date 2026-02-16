# frozen_string_literal: true

module Novabilling
  module Taxes
    module Types
      class AssignToCustomerTaxesRequest < Internal::Types::Model
        field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
        field :body, -> { Novabilling::Types::AssignTaxDto }, optional: false, nullable: false
      end
    end
  end
end
