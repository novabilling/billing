# frozen_string_literal: true

module Novabilling
  module Invoices
    module Types
      class GetInvoicesRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
