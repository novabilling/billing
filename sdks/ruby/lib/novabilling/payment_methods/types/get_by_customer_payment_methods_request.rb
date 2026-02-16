# frozen_string_literal: true

module Novabilling
  module PaymentMethods
    module Types
      class GetByCustomerPaymentMethodsRequest < Internal::Types::Model
        field :customer_id, -> { String }, optional: false, nullable: false, api_name: "customerId"
      end
    end
  end
end
