# frozen_string_literal: true

module Novabilling
  module Payments
    module Types
      class GetPaymentsRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
