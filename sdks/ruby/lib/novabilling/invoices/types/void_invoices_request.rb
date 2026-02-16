# frozen_string_literal: true

module Novabilling
  module Invoices
    module Types
      class VoidInvoicesRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
      end
    end
  end
end
