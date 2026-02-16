# frozen_string_literal: true

module Novabilling
  module Customers
    module Types
      class DeletePaymentMethodCustomersRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :method_id, -> { String }, optional: false, nullable: false, api_name: "methodId"
      end
    end
  end
end
