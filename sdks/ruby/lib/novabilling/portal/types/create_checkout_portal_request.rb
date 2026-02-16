# frozen_string_literal: true

module Novabilling
  module Portal
    module Types
      class CreateCheckoutPortalRequest < Internal::Types::Model
        field :external_id, -> { String }, optional: false, nullable: false, api_name: "externalId"
        field :invoice_id, -> { String }, optional: false, nullable: false, api_name: "invoiceId"
      end
    end
  end
end
