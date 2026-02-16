# frozen_string_literal: true

module Novabilling
  module Payments
    module Types
      class RefundPaymentDto < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :amount, -> { Integer }, optional: true, nullable: false
        field :reason, -> { String }, optional: true, nullable: false
      end
    end
  end
end
