# frozen_string_literal: true

module Novabilling
  module PaymentProviders
    module Types
      class DeletePaymentProvidersRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
