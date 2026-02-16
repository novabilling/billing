# frozen_string_literal: true

module Novabilling
  module Invoices
    module Types
      class CreateCheckoutInvoicesRequest < Internal::Types::Model
        field :id, -> { String }, optional: false, nullable: false
        field :callback_url, -> { String }, optional: true, nullable: false, api_name: "callbackUrl"
      end
    end
  end
end
