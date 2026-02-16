# frozen_string_literal: true

module Novabilling
  module Customers
    module Types
      class GetPaymentsCustomersRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
