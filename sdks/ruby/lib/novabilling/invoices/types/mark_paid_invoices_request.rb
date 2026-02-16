# frozen_string_literal: true

module Novabilling
  module Invoices
    module Types
      class MarkPaidInvoicesRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :payment_method, -> { String }, optional: true, nullable: false, api_name: "paymentMethod"
      end
    end
  end
end
