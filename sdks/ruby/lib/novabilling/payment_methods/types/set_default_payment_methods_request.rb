# frozen_string_literal: true

module Novabilling
  module PaymentMethods
    module Types
      class SetDefaultPaymentMethodsRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
